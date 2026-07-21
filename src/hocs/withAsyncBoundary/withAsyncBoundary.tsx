import { Suspense, type ComponentType, type ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ErrorState } from '@/components/ErrorState'
import { Spinner } from '@/components/Spinner'

interface WithAsyncBoundaryOptions {
  /** Node rendered while suspended (defaults to a centered spinner). */
  pendingFallback?: ReactNode
  /** Renders when a child throws (defaults to a retryable ErrorState). */
  errorFallback?: (error: Error, reset: () => void) => ReactNode
}

function getDisplayName(Component: ComponentType<unknown>): string {
  return Component.displayName || Component.name || 'Component'
}

/**
 * HOC: composes React Query's {@link QueryErrorResetBoundary}, an
 * {@link ErrorBoundary}, and {@link Suspense} so the wrapped component can use
 * suspenseful data fetching with graceful loading + retry-on-error.
 */
export function withAsyncBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAsyncBoundaryOptions = {},
) {
  const {
    pendingFallback = (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Loading Pokémon…" />
      </div>
    ),
    errorFallback = (error: Error, reset: () => void) => (
      <ErrorState
        title="Couldn't load data"
        message={error.message}
        onRetry={reset}
      />
    ),
  } = options

  function ComponentWithAsyncBoundary(props: P) {
    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            fallback={(error, resetBoundary) =>
              errorFallback(error, () => {
                reset()
                resetBoundary()
              })
            }
          >
            <Suspense fallback={pendingFallback}>
              <WrappedComponent {...props} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    )
  }

  ComponentWithAsyncBoundary.displayName = `withAsyncBoundary(${getDisplayName(
    WrappedComponent as ComponentType<unknown>,
  )})`

  return ComponentWithAsyncBoundary
}
