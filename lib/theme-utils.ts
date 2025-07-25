// Utility functions for theme management

// Fixed gradient colors
const DEFAULT_GRADIENT_FROM = '#D0AF21' // gold
const DEFAULT_GRADIENT_TO = '#9C182F'   // maroon
const DEFAULT_PRIMARY = '#D0AF21' // gold

export const applyThemeColor = (color: string, isDark: boolean = false) => {
  if (!color) return
  
  const root = document.documentElement
  
  // Set the primary color
  root.style.setProperty('--primary', color)
  
  // Always use our fixed gradient colors
  root.style.setProperty('--gradient-from', DEFAULT_GRADIENT_FROM)
  root.style.setProperty('--gradient-to', DEFAULT_GRADIENT_TO)
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme-color', color)
  }
  
  // Update meta theme color
  updateMetaThemeColor(color)
}

// Update meta theme color
const updateMetaThemeColor = (color: string) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color)
  }
}

// Load theme color from localStorage
export const loadThemeColor = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme-color') || DEFAULT_PRIMARY
  }
  return DEFAULT_PRIMARY
}

// Reset gradients to default colors
export const resetGradients = () => {
  const root = document.documentElement
  root.style.setProperty('--gradient-from', DEFAULT_GRADIENT_FROM)
  root.style.setProperty('--gradient-to', DEFAULT_GRADIENT_TO)
}


