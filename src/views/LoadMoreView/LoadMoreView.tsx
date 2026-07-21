import { useMemo } from 'react'

import { PokemonGrid } from '@/components/PokemonGrid'
import { LoadMoreButton } from '@/components/LoadMoreButton'
import { ErrorState } from '@/components/ErrorState'
import type { PokemonSummary } from '@/api/types'
import { PAGE_SIZE, usePokemonInfinite } from '@/hooks/usePokemonQueries'
import { withErrorBoundary } from '@/hocs/withErrorBoundary'
import styles from '../View.module.css'

function LoadMoreView() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonInfinite()

  // Flatten pages and guard against duplicates (e.g. StrictMode double effects).
  const items = useMemo<PokemonSummary[]>(() => {
    const seen = new Set<number>()
    const flat: PokemonSummary[] = []
    for (const page of data?.pages ?? []) {
      for (const item of page.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id)
          flat.push(item)
        }
      }
    }
    return flat
  }, [data])

  const totalCount = data?.pages[0]?.totalCount

  return (
    <section className="animate-fade-in-up">
      <header className={styles.head}>
        <h1 className={styles.title}>Pokémon — Load More</h1>
        <p className={styles.subtitle}>
          Append the next batch of Pokémon as you scroll through the Pokédex.
        </p>
      </header>

      {isError && items.length === 0 ? (
        <ErrorState
          title="Couldn't load Pokémon"
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <PokemonGrid
            pokemon={items}
            loading={isLoading}
            skeletonCount={PAGE_SIZE}
          />

          {items.length > 0 ? (
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              hasMore={Boolean(hasNextPage)}
              loadedCount={items.length}
              totalCount={totalCount}
            />
          ) : null}

          {isError && items.length > 0 ? (
            <ErrorState
              title="Couldn't load more"
              message={(error as Error)?.message}
              onRetry={() => fetchNextPage()}
            />
          ) : null}
        </>
      )}
    </section>
  )
}

export default withErrorBoundary(LoadMoreView)
