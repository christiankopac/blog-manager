import { ref, onMounted, onUnmounted } from 'vue'
import { THEMES } from '../constants'
import type { Themes } from 'md-editor-v3'

export function useTheme() {
  const theme = ref<Themes>(THEMES.LIGHT)
  let mediaQuery: MediaQueryList | null = null
  
  const updateTheme = (isDark: boolean) => {
    requestAnimationFrame(() => {
      theme.value = isDark ? THEMES.DARK : THEMES.LIGHT
      document.documentElement.classList.toggle('dark', isDark)
    })
  }
  
  onMounted(() => {
    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      updateTheme(mediaQuery.matches)
      
      const handler = (e: MediaQueryListEvent) => updateTheme(e.matches)
      mediaQuery.addEventListener('change', handler)
      
      onUnmounted(() => {
        mediaQuery?.removeEventListener('change', handler)
      })
    }
  })
  
  return {
    theme,
    updateTheme
  }
}