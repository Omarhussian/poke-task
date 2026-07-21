import styles from './Spinner.module.css'

interface SpinnerProps {
  label?: string
  /** Diameter in pixels. */
  size?: number
}

/** Pokéball-inspired spinner used across loading states. */
export function Spinner({ label, size = 44 }: SpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span
        className={styles.ball}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label ? <span className={styles.label}>{label}</span> : null}
      <span className={styles.srOnly}>{label ?? 'Loading'}</span>
    </div>
  )
}
