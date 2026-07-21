import { NavLink, Outlet } from 'react-router-dom'

import { RouteTransition } from '@/components/RouteTransition'
import styles from './Layout.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Pagination', end: true },
  { to: '/load-more', label: 'Load More', end: false },
]

/**
 * Responsive application shell. The outer spacing/width is handled with
 * Tailwind's `container` + layout utilities; the visual chrome (header bar,
 * tabs) uses a CSS Module.
 */
export function Layout() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className="container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <NavLink to="/" className={styles.brand}>
            <img src="/pokeball.svg" alt="" className={styles.brandIcon} />
            <span>
              Poké<span className={styles.brandAccent}>dex</span>
            </span>
          </NavLink>

          <nav className={styles.tabs} aria-label="View switcher">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-6 md:py-10">
        <RouteTransition>
          <Outlet />
        </RouteTransition>
      </main>

      <footer className={styles.footer}>
        <div className="container py-6 text-center">
          Data from{' '}
          <a
            href="https://pokeapi.co"
            target="_blank"
            rel="noreferrer"
            className={styles.footerLink}
          >
            PokéAPI
          </a>{' '}
          · Built with React, TypeScript &amp; React Query
          <br />
          Made by Omar Hussain
        </div>
      </footer>
    </div>
  )
}
