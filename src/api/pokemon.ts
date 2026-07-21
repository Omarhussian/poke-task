import type {
  PaginatedSummaries,
  PokemonDetail,
  PokemonDetailResponse,
  PokemonListResponse,
  PokemonSummary,
} from './types'

const BASE_URL = 'https://pokeapi.co/api/v2'

/** Small typed fetch wrapper that throws a helpful error on non-2xx responses. */
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(
      `Request to "${path}" failed with status ${response.status} (${response.statusText}).`,
    )
  }
  return (await response.json()) as T
}

/**
 * The list endpoint doesn't return ids/sprites, but the id is derivable from
 * the resource URL (".../pokemon/{id}/") and the official artwork follows a
 * stable CDN path — so we can build a rich card without N extra requests.
 */
const OFFICIAL_ARTWORK =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

function extractIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  return match ? Number(match[1]) : Number.NaN
}

function toSummary(name: string, url: string): PokemonSummary {
  const id = extractIdFromUrl(url)
  return {
    id,
    name,
    imageUrl: `${OFFICIAL_ARTWORK}/${id}.png`,
  }
}

export interface FetchListParams {
  limit: number
  offset: number
  signal?: AbortSignal
}

/** Fetch a page of Pokémon and normalize into summaries. */
export async function fetchPokemonPage({
  limit,
  offset,
  signal,
}: FetchListParams): Promise<PaginatedSummaries> {
  const data = await request<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
    signal,
  )

  return {
    items: data.results.map((r) => toSummary(r.name, r.url)),
    totalCount: data.count,
    hasNext: Boolean(data.next),
    hasPrevious: Boolean(data.previous),
  }
}

/** Fetch and normalize a single Pokémon's details. */
export async function fetchPokemonDetail(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<PokemonDetail> {
  const data = await request<PokemonDetailResponse>(
    `/pokemon/${idOrName}`,
    signal,
  )

  const artwork =
    data.sprites.other?.['official-artwork']?.front_default ??
    data.sprites.front_default ??
    `${OFFICIAL_ARTWORK}/${data.id}.png`

  return {
    id: data.id,
    name: data.name,
    imageUrl: artwork,
    heightMeters: data.height / 10, // decimetres -> metres
    weightKg: data.weight / 10, // hectograms -> kilograms
    types: data.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  }
}
