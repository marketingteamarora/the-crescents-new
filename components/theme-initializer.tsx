"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { loadThemeColor, applyThemeColor } from "@/lib/theme-utils"

export function ThemeInitializer() {
  const { theme, systemTheme } = useTheme()
  
  useEffect(() => {
    // Load the saved theme color and apply it
    const savedColor = loadThemeColor()
    const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
    applyThemeColor(savedColor, isDark)
  }, [theme, systemTheme])

  // This component doesn't render anything
  return null
}
