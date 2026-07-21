import type { PokemonSummary } from '@/api/types'
import { PokemonCard } from '@/components/PokemonCard'
import { CardSkeleton } from '@/components/CardSkeleton'
import { useFlip } from '@/hooks/useFlip'
import styles from './PokemonGrid.module.css'

interface PokemonGridProps {
  pokemon: PokemonSummary[]
  /** When true, renders skeleton placeholders instead of (or alongside) cards. */
  loading?: boolean
  skeletonCount?: number
}

/**
 * Responsive card grid. The grid columns/gaps are driven by Tailwind's
 * layout utilities (mobile-first, adapting up through the breakpoints).
 */
export function PokemonGrid({
  pokemon,
  loading = false,
  skeletonCount = 12,
}: PokemonGridProps) {
  // Animate tiles gliding into place when the column count changes on resize.
  const gridRef = useFlip<HTMLUListElement>([pokemon.length, loading])

  return (
    <ul ref={gridRef} className={styles.grid}>
      {pokemon.map((p) => (
        <li key={p.id} data-flip-key={`p-${p.id}`} className="animate-fade-in-up">
          <PokemonCard pokemon={p} />
        </li>
      ))}
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <li key={`skeleton-${i}`} data-flip-key={`s-${i}`}>
              <CardSkeleton />
            </li>
          ))
        : null}
    </ul>
  )
}
