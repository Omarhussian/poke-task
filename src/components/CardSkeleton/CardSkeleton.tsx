import styles from './CardSkeleton.module.css'

/** Placeholder shown while a page of Pokémon is loading. */
export function CardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <span className={styles.dex} />
      <span className={styles.circle} />
      <span className={styles.name} />
    </div>
  )
}
