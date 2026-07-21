import { Link } from 'react-router-dom'

import { ErrorState } from '@/components/ErrorState'

export function NotFound() {
  return (
    <div>
      <ErrorState
        title="Page not found"
        message="This route doesn't exist. Let's head back to the Pokédex."
      />
      <div style={{ textAlign: 'center', marginTop: '-1rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.4rem',
            borderRadius: 999,
            background: '#ef4444',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
