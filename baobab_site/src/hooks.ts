import { useEffect, useState } from 'react'

/** Media query réactive, utilisée pour couper les effets coûteux sur mobile. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 760px)')
export const useFinePointer = () => useMediaQuery('(pointer: fine)')
