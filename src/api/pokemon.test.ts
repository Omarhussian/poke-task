import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchPokemonDetail, fetchPokemonPage } from './pokemon'
import type { PokemonDetailResponse, PokemonListResponse } from './types'

function mockFetchOnce(body: unknown, init: ResponseInit = { status: 200 }) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchPokemonPage', () => {
  const listResponse: PokemonListResponse = {
    count: 1302,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=12&limit=12',
    previous: null,
    results: [
      { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ],
  }

  it('requests the right endpoint and normalizes results into summaries', async () => {
    const fetchMock = mockFetchOnce(listResponse)

    const page = await fetchPokemonPage({ limit: 12, offset: 0 })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?limit=12&offset=0',
      { signal: undefined },
    )
    expect(page.totalCount).toBe(1302)
    expect(page.hasNext).toBe(true)
    expect(page.hasPrevious).toBe(false)
    expect(page.items).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
      {
        id: 2,
        name: 'ivysaur',
        imageUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png',
      },
    ])
  })

  it('throws a descriptive error on non-2xx responses', async () => {
    mockFetchOnce({}, { status: 500, statusText: 'Internal Server Error' })

    await expect(fetchPokemonPage({ limit: 12, offset: 0 })).rejects.toThrow(
      /failed with status 500/,
    )
  })
})

describe('fetchPokemonDetail', () => {
  const detailResponse: PokemonDetailResponse = {
    id: 25,
    name: 'pikachu',
    height: 4, // decimetres
    weight: 60, // hectograms
    sprites: {
      front_default: 'https://example.com/front.png',
      other: {
        'official-artwork': {
          front_default: 'https://example.com/artwork.png',
        },
      },
    },
    types: [
      {
        slot: 1,
        type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
      },
    ],
    stats: [
      {
        base_stat: 35,
        stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' },
      },
      {
        base_stat: 90,
        stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' },
      },
    ],
  }

  it('normalizes units, types and stats', async () => {
    mockFetchOnce(detailResponse)

    const detail = await fetchPokemonDetail(25)

    expect(detail).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://example.com/artwork.png',
      heightMeters: 0.4,
      weightKg: 6,
      types: ['electric'],
      stats: [
        { name: 'hp', value: 35 },
        { name: 'speed', value: 90 },
      ],
    })
  })

  it('falls back to the default sprite when official artwork is missing', async () => {
    mockFetchOnce({
      ...detailResponse,
      sprites: { front_default: 'https://example.com/front.png' },
    })

    const detail = await fetchPokemonDetail(25)
    expect(detail.imageUrl).toBe('https://example.com/front.png')
  })
})
