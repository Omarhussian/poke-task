import { useSearchParams } from 'react-router-dom'

import { PokemonGrid } from '@/components/PokemonGrid'
import { Pagination } from '@/components/Pagination'
import { ErrorState } from '@/components/ErrorState'
import { PAGE_SIZE, usePokemonPage } from '@/hooks/usePokemonQueries'
import { withErrorBoundary } from '@/hocs/withErrorBoundary'
import styles from '../View.module.css'

/** Parse `?page=` into a valid page number, defaulting to 1. */
function parsePage(value: string | null): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1
}

function PaginationView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))

  const setPage = (nextPage: number) => {
    setSearchParams((params) => {
      if (nextPage <= 1) {
        params.delete('page')
      } else {
        params.set('page', String(nextPage))
      }
      return params
    })
  }

  const { data, isLoading, isFetching, isError, error, refetch } =
    usePokemonPage(page)

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0

  return (
    <section className="animate-fade-in-up">
      <header className={styles.head}>
        <h1 className={styles.title}>Pokémon — Pagination</h1>
        <p className={styles.subtitle}>
          Browse the Pokédex page by page. Click a card for full details.
        </p>
      </header>

      {isError ? (
        <ErrorState
          title="Couldn't load Pokémon"
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <PokemonGrid
            pokemon={data?.items ?? []}
            loading={isLoading}
            skeletonCount={PAGE_SIZE}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            disabled={isFetching}
          />
        </>
      )}
    </section>
  )
}

export default withErrorBoundary(PaginationView)
