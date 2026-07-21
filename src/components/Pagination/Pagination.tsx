import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
}

/**
 * Builds a compact page-number list with ellipses:
 * e.g. 1 … 4 5 [6] 7 8 … 42
 */
function buildPageItems(current: number, total: number): (number | 'ellipsis')[] {
  const delta = 1
  const pages = new Set<number>([1, total])
  for (let i = current - delta; i <= current + delta; i++) {
    if (i >= 1 && i <= total) pages.add(i)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  const items: (number | 'ellipsis')[] = []
  let prev = 0
  for (const page of sorted) {
    if (page - prev > 1) items.push('ellipsis')
    items.push(page)
    prev = page
  }
  return items
}

/** Numbered pagination with previous/next controls. */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null
  const items = buildPageItems(currentPage, totalPages)

  const go = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages)
    if (clamped !== currentPage) onPageChange(clamped)
  }

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.control}
        onClick={() => go(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      <ul className={styles.pages}>
        {items.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={styles.page}
                data-active={item === currentPage}
                aria-current={item === currentPage ? 'page' : undefined}
                onClick={() => go(item)}
                disabled={disabled}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={styles.control}
        onClick={() => go(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </nav>
  )
}
