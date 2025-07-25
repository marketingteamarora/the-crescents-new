"use client"

import { AdvancedImageUpload } from "./advanced-image-upload"

interface HeroImageUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
}

export function HeroImageUpload({ value, onChange, label }: HeroImageUploadProps) {
  // Hero image specific presets
  const heroImagePresets = [
    {
      url: "/placeholder.svg?height=1080&width=1920&text=Luxury+Exterior",
      label: "Luxury Exterior",
    },
    {
      url: "/placeholder.svg?height=1080&width=1920&text=Modern+Architecture",
      label: "Modern Architecture",
    },
    {
      url: "/placeholder.svg?height=1080&width=1920&text=Community+View",
      label: "Community View",
    },
    {
      url: "/placeholder.svg?height=1080&width=1920&text=Aerial+View",
      label: "Aerial View",
    },
    {
      url: "/placeholder.svg?height=1080&width=1920&text=Interior+Lobby",
      label: "Interior Lobby",
    },
    {
      url: "/placeholder.svg?height=1080&width=1920&text=Amenities",
      label: "Amenities",
    },
  ]

  return (
    <AdvancedImageUpload
      value={value}
      onChange={onChange}
      label={label}
      aspectRatio="aspect-video"
      maxWidth={1920}
      maxHeight={1080}
      placeholder="Upload stunning hero background"
      acceptedFormats={["image/jpeg", "image/jpg", "image/png", "image/webp"]}
      showPresets={true}
      presetImages={heroImagePresets}
    />
  )
}
