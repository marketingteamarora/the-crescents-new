"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { applyThemeColor, loadThemeColor, resetGradients } from "@/lib/theme-utils"

// Default colors
const DEFAULT_PRIMARY = "#D0AF21" // gold

export function ThemeColorPicker() {
  const { theme } = useTheme()
  const [color, setColor] = useState(DEFAULT_PRIMARY)
  const [isOpen, setIsOpen] = useState(false)

  // Load saved color from localStorage on mount
  useEffect(() => {
    const savedColor = loadThemeColor()
    setColor(savedColor)
  }, [])

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    applyThemeColor(newColor, theme === 'dark')
    
    // Show success message
    toast({
      title: "Theme color updated",
      description: "Your theme color has been updated successfully.",
    })
  }

  const resetToDefault = () => {
    setColor(DEFAULT_PRIMARY)
    applyThemeColor(DEFAULT_PRIMARY, theme === 'dark')
    setIsOpen(false)
    
    // Show success message
    toast({
      title: "Theme reset",
      description: "Your theme has been reset to default.",
    })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-md overflow-hidden">
            <div className="absolute inset-0 gradient-bg" />
          </div>
          <span className="hidden md:inline">Theme Color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="color-picker">Primary Color</Label>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-md border cursor-pointer"
                style={{ backgroundColor: color }}
              />
              <HexColorPicker 
                color={color} 
                onChange={handleColorChange} 
                className="!w-full mt-2"
              />
            </div>
            <div className="flex-1">
              <Input 
                id="color-picker"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                onBlur={(e) => handleColorChange(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Gradient Preview</p>
          <div className="h-12 rounded-md border gradient-bg" />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Gradient colors are fixed to our brand colors
          </p>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetToDefault}
            className="text-xs"
          >
            Reset to Default
          </Button>
          <Button 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="text-xs"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Helper function to get a complementary color
function getComplementaryColor(hex: string): string {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)
  
  // Convert to HSL
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    
    h /= 6
  }
  
  // Calculate complementary hue (180 degrees)
  h = (h * 360 + 180) % 360
  
  // Convert back to hex
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  
  if (s === 0) {
    // Achromatic
    const val = Math.round(l * 255)
    return `#${((1 << 24) + (val << 16) + (val << 8) + val).toString(16).slice(1)}`
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    const r = Math.round(hue2rgb(p, q, h / 360 + 1/3) * 255)
    const g = Math.round(hue2rgb(p, q, h / 360) * 255)
    const b = Math.round(hue2rgb(p, q, h / 360 - 1/3) * 255)
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
}
