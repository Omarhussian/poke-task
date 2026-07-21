import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { PokemonSummary } from '@/api/types'
import { capitalize, formatDexNumber } from '@/utils/format'
import styles from './PokemonCard.module.css'

interface PokemonCardProps {
  pokemon: PokemonSummary
}

/** A single Pokémon tile that links to its dedicated detail route. */
export function PokemonCard({ pokemon }: PokemonCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className={styles.card}
      aria-label={`View details for ${capitalize(pokemon.name)}`}
    >
      <span className={styles.dexNumber}>{formatDexNumber(pokemon.id)}</span>

      <div className={styles.imageWrap}>
        {!loaded ? <span className={styles.imageSkeleton} aria-hidden="true" /> : null}
        <img
          src={pokemon.imageUrl}
          alt={capitalize(pokemon.name)}
          className={styles.image}
          loading="lazy"
          decoding="async"
          data-loaded={loaded}
          onLoad={() => setLoaded(true)}
        />
      </div>

      <span className={styles.name}>{capitalize(pokemon.name)}</span>
    </Link>
  )
}
