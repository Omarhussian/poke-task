/** Raw shape of a paginated list item from `/pokemon`. */
export interface NamedApiResource {
  name: string
  url: string
}

/** Raw shape of the `/pokemon?limit&offset` list response. */
export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

/** Raw shape of `/pokemon/{id}` (only the fields we consume). */
export interface PokemonDetailResponse {
  id: number
  name: string
  height: number // in decimetres
  weight: number // in hectograms
  sprites: {
    front_default: string | null
    other?: {
      ['official-artwork']?: {
        front_default: string | null
      }
      dream_world?: {
        front_default: string | null
      }
    }
  }
  types: Array<{
    slot: number
    type: NamedApiResource
  }>
  stats: Array<{
    base_stat: number
    stat: NamedApiResource
  }>
}

/** Normalized list item used by the grid/card components. */
export interface PokemonSummary {
  id: number
  name: string
  imageUrl: string
}

/** Normalized detail model used by the detail page. */
export interface PokemonDetail {
  id: number
  name: string
  imageUrl: string
  heightMeters: number
  weightKg: number
  types: string[]
  stats: Array<{ name: string; value: number }>
}

export interface PaginatedSummaries {
  items: PokemonSummary[]
  totalCount: number
  hasNext: boolean
  hasPrevious: boolean
}
