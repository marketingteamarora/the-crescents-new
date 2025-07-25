"use client"

import { AdvancedImageUpload } from "./advanced-image-upload"

interface LifestyleImageUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
  featureType?: string
}

export function LifestyleImageUpload({ value, onChange, label, featureType }: LifestyleImageUploadProps) {
  // Lifestyle image specific presets
  const lifestylePresets = [
    {
      url: "/placeholder.svg?height=300&width=400&text=Park+View",
      label: "Park & Nature",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=Transit+Hub",
      label: "Transit & Connectivity",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=Shopping+Center",
      label: "Shopping & Dining",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=School+District",
      label: "Schools & Education",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=Recreation+Center",
      label: "Recreation & Fitness",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=Community+Garden",
      label: "Community Spaces",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=Waterfront",
      label: "Waterfront Access",
    },
    {
      url: "/placeholder.svg?height=300&width=400&text=Downtown+View",
      label: "City Views",
    },
  ]

  return (
    <AdvancedImageUpload
      value={value}
      onChange={onChange}
      label={label}
      aspectRatio="aspect-[4/3]"
      maxWidth={800}
      maxHeight={600}
      placeholder={`Upload ${featureType || "lifestyle"} image`}
      acceptedFormats={["image/jpeg", "image/jpg", "image/png", "image/webp"]}
      showPresets={true}
      presetImages={lifestylePresets}
    />
  )
}
