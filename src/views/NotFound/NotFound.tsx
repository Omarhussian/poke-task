import { Link } from 'react-router-dom'

import { ErrorState } from '@/components/ErrorState'
import styles from './NotFound.module.css'

export function NotFound() {
  return (
    <div>
      <ErrorState
        title="Page not found"
        message="This route doesn't exist. Let's head back to the Pokédex."
      />
      <div className={styles.actions}>
        <Link to="/" className={styles.homeLink}>
          Back to home
        </Link>
      </div>
    </div>
  )
}
