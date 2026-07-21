import { useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import styles from './RouteTransition.module.css'

interface RouteTransitionProps {
  children: ReactNode
}

/**
 * Replays an enter animation on every navigation by keying the wrapper on the
 * current pathname — React remounts the node, so the CSS animation runs again.
 */
export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation()
  return (
    <div key={location.pathname} className={styles.page}>
      {children}
    </div>
  )
}
