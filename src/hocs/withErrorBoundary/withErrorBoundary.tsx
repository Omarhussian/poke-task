import type { ComponentType, ReactNode } from 'react'

import { ErrorBoundary } from '@/components/ErrorBoundary'

interface WithErrorBoundaryOptions {
  fallback?: (error: Error, reset: () => void) => ReactNode
}

/** Sets a readable displayName for wrapped components (helps devtools). */
function getDisplayName(Component: ComponentType<unknown>): string {
  return Component.displayName || Component.name || 'Component'
}

/**
 * HOC: wraps any component in an {@link ErrorBoundary} so render-time errors
 * are contained and recoverable.
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryOptions = {},
) {
  function ComponentWithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={options.fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${getDisplayName(
    WrappedComponent as ComponentType<unknown>,
  )})`

  return ComponentWithErrorBoundary
}
