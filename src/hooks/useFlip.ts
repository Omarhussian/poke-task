import { useEffect, useRef } from 'react'

/**
 * FLIP (First, Last, Invert, Play) animation.
 *
 * CSS cannot interpolate a change in the *number* of grid tracks (e.g. going
 * from 2 → 3 columns), so tiles normally snap into their new positions on
 * resize. This hook measures each child's position, lets the browser reflow,
 * then animates the delta with a transform so the tiles visibly glide into
 * place.
 *
 * Returns a ref to attach to the container whose direct children should animate.
 */
export function useFlip<T extends HTMLElement>(deps: unknown[] = []) {
  const containerRef = useRef<T | null>(null)
  // Cache the last measured rect per child (keyed by a stable data attribute).
  const positions = useRef(new Map<string, DOMRect>())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const animateReflow = () => {
      const children = Array.from(container.children) as HTMLElement[]

      // LAST: read the new positions.
      const newPositions = new Map<string, DOMRect>()
      children.forEach((child, index) => {
        const key = child.dataset.flipKey ?? String(index)
        newPositions.set(key, child.getBoundingClientRect())
      })

      if (!prefersReduced) {
        children.forEach((child, index) => {
          const key = child.dataset.flipKey ?? String(index)
          const prev = positions.current.get(key)
          const next = newPositions.get(key)
          if (!prev || !next) return

          const dx = prev.left - next.left
          const dy = prev.top - next.top
          if (dx === 0 && dy === 0) return

          // INVERT: jump the element back to its old position…
          child.style.transition = 'none'
          child.style.transform = `translate(${dx}px, ${dy}px)`

          // PLAY: …then release it on the next frame so it eases to (0,0).
          requestAnimationFrame(() => {
            child.style.transition =
              'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
            child.style.transform = ''
          })
        })
      }

      positions.current = newPositions
    }

    // Capture initial positions (FIRST) so the very first resize can animate.
    const children = Array.from(container.children) as HTMLElement[]
    children.forEach((child, index) => {
      const key = child.dataset.flipKey ?? String(index)
      positions.current.set(key, child.getBoundingClientRect())
    })

    const observer = new ResizeObserver(() => animateReflow())
    observer.observe(container)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return containerRef
}
