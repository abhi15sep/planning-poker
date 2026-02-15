import { useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, 'light')

  useEffect(() => {
    const root = window.document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    if (!storedTheme) {
      setTheme(mediaQuery.matches ? 'dark' : 'light')
    }
  }, [setTheme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  const isDark = theme === 'dark'

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  }
}
