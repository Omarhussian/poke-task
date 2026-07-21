import styles from './LoadMoreButton.module.css'

interface LoadMoreButtonProps {
  onClick: () => void
  isLoading?: boolean
  hasMore: boolean
  loadedCount?: number
  totalCount?: number
}

/** "Load More" control for the infinite/append list view. */
export function LoadMoreButton({
  onClick,
  isLoading = false,
  hasMore,
  loadedCount,
  totalCount,
}: LoadMoreButtonProps) {
  return (
    <div className={styles.wrapper}>
      {loadedCount != null && totalCount != null ? (
        <p className={styles.count}>
          Showing <strong>{loadedCount}</strong> of {totalCount}
        </p>
      ) : null}

      {hasMore ? (
        <button
          type="button"
          className={styles.button}
          onClick={onClick}
          disabled={isLoading}
        >
          <img
            src="/pokeball.svg"
            alt=""
            aria-hidden="true"
            className={
              isLoading ? `${styles.icon} ${styles.iconSpin}` : styles.icon
            }
          />
          {isLoading ? 'Loading…' : 'Load More'}
        </button>
      ) : (
        <p className={styles.done}>You've caught 'em all! 🎉</p>
      )}
    </div>
  )
}
