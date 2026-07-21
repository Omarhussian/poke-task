/** Capitalize the first letter of a word. */
export function capitalize(value: string): string {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Format a Pokédex id as "#001". */
export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

/** Prettify PokéAPI slugs like "special-attack" -> "Special Attack". */
export function humanize(slug: string): string {
  return slug
    .split('-')
    .map(capitalize)
    .join(' ')
}
