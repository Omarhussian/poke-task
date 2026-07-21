import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { PaginatedSummaries } from '@/api/types'
import * as api from '@/api/pokemon'
import { PAGE_SIZE } from '@/hooks/usePokemonQueries'
import PaginationView from './PaginationView'

function makePage(offset: number): PaginatedSummaries {
  return {
    items: Array.from({ length: PAGE_SIZE }, (_, i) => {
      const id = offset + i + 1
      return { id, name: `pokemon-${id}`, imageUrl: `https://img/${id}.png` }
    }),
    totalCount: 60, // 5 pages of 12
    hasNext: offset + PAGE_SIZE < 60,
    hasPrevious: offset > 0,
  }
}

function renderView(initialEntry: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <PaginationView />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('PaginationView', () => {
  it('reads the page from the ?page= search param', async () => {
    const spy = vi
      .spyOn(api, 'fetchPokemonPage')
      .mockImplementation(async ({ offset }) => makePage(offset))

    renderView('/?page=3')

    expect(
      await screen.findByRole('button', { name: '3' }),
    ).toHaveAttribute('aria-current', 'page')
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 2 * PAGE_SIZE }),
    )
  })

  it('updates the URL page when navigating, so it survives back-navigation', async () => {
    const user = userEvent.setup()
    const spy = vi
      .spyOn(api, 'fetchPokemonPage')
      .mockImplementation(async ({ offset }) => makePage(offset))

    renderView('/')

    await user.click(await screen.findByRole('button', { name: '2' }))

    expect(
      await screen.findByText(/pokemon-13/i),
    ).toBeInTheDocument()
    expect(spy).toHaveBeenLastCalledWith(
      expect.objectContaining({ offset: PAGE_SIZE }),
    )
  })

  it('falls back to page 1 for invalid ?page= values', async () => {
    const spy = vi
      .spyOn(api, 'fetchPokemonPage')
      .mockImplementation(async ({ offset }) => makePage(offset))

    renderView('/?page=banana')

    expect(
      await screen.findByRole('button', { name: '1' }),
    ).toHaveAttribute('aria-current', 'page')
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ offset: 0 }))
  })

  it('shows an error state with retry when the request fails', async () => {
    vi.spyOn(api, 'fetchPokemonPage').mockRejectedValue(
      new Error('network down'),
    )

    renderView('/')

    expect(
      await screen.findByText("Couldn't load Pokémon"),
    ).toBeInTheDocument()
    expect(screen.getByText('network down')).toBeInTheDocument()
  })
})
