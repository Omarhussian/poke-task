import { Component, type ErrorInfo, type ReactNode } from 'react'

import { ErrorState } from '@/components/ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Optional custom fallback renderer. */
  fallback?: (error: Error, reset: () => void) => ReactNode
  /** Reset the boundary when any of these values change. */
  resetKeys?: unknown[]
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Catches runtime render errors anywhere below it and shows a recoverable
 * fallback UI. Combined with React Query's `reset` via the `withAsyncBoundary`
 * HOC to recover from failed data fetches.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In a real app this would go to an error reporting service.
    console.error('ErrorBoundary caught an error:', error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props
    if (!this.state.error || !resetKeys) return
    const prevKeys = prevProps.resetKeys ?? []
    const changed =
      resetKeys.length !== prevKeys.length ||
      resetKeys.some((key, i) => !Object.is(key, prevKeys[i]))
    if (changed) this.reset()
  }

  reset = (): void => {
    this.setState({ error: null })
  }

  render(): ReactNode {
    const { error } = this.state
    const { children, fallback } = this.props

    if (error) {
      if (fallback) return fallback(error, this.reset)
      return (
        <ErrorState
          title="Something went wrong"
          message={error.message}
          onRetry={this.reset}
        />
      )
    }

    return children
  }
}

/** Top-level boundary used to wrap the whole app. */
export function RootErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <ErrorState
            title="The app hit an unexpected error"
            message={error.message}
            onRetry={reset}
          />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
