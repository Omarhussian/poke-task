import {
  useInfiniteQuery,
  useQuery,
  useSuspenseQuery,
  keepPreviousData,
} from '@tanstack/react-query'

import {
  fetchPokemonDetail,
  fetchPokemonPage,
} from '@/api/pokemon'

export const PAGE_SIZE = 12

export const pokemonKeys = {
  all: ['pokemon'] as const,
  page: (page: number) => [...pokemonKeys.all, 'page', page] as const,
  infinite: () => [...pokemonKeys.all, 'infinite'] as const,
  detail: (idOrName: string | number) =>
    [...pokemonKeys.all, 'detail', String(idOrName)] as const,
}

/** Classic page-based query. `keepPreviousData` avoids UI flashes between pages. */
export function usePokemonPage(page: number) {
  return useQuery({
    queryKey: pokemonKeys.page(page),
    queryFn: ({ signal }) =>
      fetchPokemonPage({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        signal,
      }),
    placeholderData: keepPreviousData,
  })
}

/** Infinite query backing the "Load More" view. De-dupes naturally by page key. */
export function usePokemonInfinite() {
  return useInfiniteQuery({
    queryKey: pokemonKeys.infinite(),
    queryFn: ({ pageParam, signal }) =>
      fetchPokemonPage({ limit: PAGE_SIZE, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasNext) return undefined
      return allPages.length * PAGE_SIZE
    },
  })
}

/**
 * Suspense variant of the detail query. Paired with the `withAsyncBoundary`
 * HOC so loading is handled by <Suspense> and errors by the ErrorBoundary.
 */
export function usePokemonDetailSuspense(idOrName: string | number) {
  return useSuspenseQuery({
    queryKey: pokemonKeys.detail(idOrName),
    queryFn: ({ signal }) => fetchPokemonDetail(idOrName, signal),
  })
}
