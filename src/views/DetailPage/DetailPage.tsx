import { useNavigate, useParams } from 'react-router-dom'

import { TypeBadge } from '@/components/TypeBadge'
import { Spinner } from '@/components/Spinner'
import { usePokemonDetailSuspense } from '@/hooks/usePokemonQueries'
import { capitalize, formatDexNumber, humanize } from '@/utils/format'
import { withAsyncBoundary } from '@/hocs/withAsyncBoundary'
import styles from './DetailPage.module.css'

function DetailPageContent() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data } = usePokemonDetailSuspense(id)

  const primaryType = data.types[0] ?? 'normal'

  return (
    <article className="animate-fade-in-up">
      <button type="button" onClick={() => navigate(-1)} className={styles.back}>
        ‹ Back
      </button>

      <div className={styles.card} data-type={primaryType}>
        <div className={styles.hero}>
          <span className={styles.dex}>{formatDexNumber(data.id)}</span>
          <img
            src={data.imageUrl}
            alt={capitalize(data.name)}
            className={styles.sprite}
            decoding="async"
          />
        </div>

        <div className={styles.body}>
          <h1 className={styles.name}>{capitalize(data.name)}</h1>

          <div className={styles.types}>
            {data.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>

          <dl className={styles.stats}>
            <div className={styles.stat}>
              <dt>Height</dt>
              <dd>{data.heightMeters.toFixed(1)} m</dd>
            </div>
            <div className={styles.stat}>
              <dt>Weight</dt>
              <dd>{data.weightKg.toFixed(1)} kg</dd>
            </div>
          </dl>

          <div className={styles.baseStats}>
            <h2 className={styles.baseStatsTitle}>Base Stats</h2>
            <ul className={styles.baseStatsList}>
              {data.stats.map((stat) => (
                <li key={stat.name} className={styles.baseStatRow}>
                  <span className={styles.baseStatName}>
                    {humanize(stat.name)}
                  </span>
                  <span className={styles.baseStatValue}>{stat.value}</span>
                  <span className={styles.baseStatBar} aria-hidden="true">
                    <span
                      className={styles.baseStatFill}
                      style={{
                        width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  )
}

/**
 * The detail page uses suspenseful data fetching: <Suspense> renders the
 * spinner while loading and the ErrorBoundary renders a retryable error — both
 * provided by the `withAsyncBoundary` HOC.
 */
export default withAsyncBoundary(DetailPageContent, {
  pendingFallback: (
    <div className={styles.center}>
      <Spinner label="Loading Pokémon…" />
    </div>
  ),
})
