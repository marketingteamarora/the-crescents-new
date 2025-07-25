"use client"

import { AdvancedImageUpload } from "./advanced-image-upload"

interface FloorPlanUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
  planType?: "30'" | "38'" | "45'" | "50'" | string
}

export function FloorPlanUpload({ value, onChange, label, planType }: FloorPlanUploadProps) {
  // Floor plan specific presets
  const floorPlanPresets = [
    {
      url: "/placeholder.svg?height=400&width=300&text=30ft+Townhome",
      label: "30ft Townhome",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=38ft+Townhome",
      label: "38ft Townhome",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=45ft+Townhome",
      label: "45ft Townhome",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=50ft+Single+Family",
      label: "50ft Single Family",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=Basement+Plan",
      label: "Basement Plan",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=Main+Floor",
      label: "Main Floor",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=Second+Floor",
      label: "Second Floor",
    },
    {
      url: "/placeholder.svg?height=400&width=300&text=Third+Floor",
      label: "Third Floor",
    },
  ]

  return (
    <AdvancedImageUpload
      value={value}
      onChange={onChange}
      label={label}
      aspectRatio="aspect-[3/4]"
      maxWidth={800}
      maxHeight={1000}
      placeholder={`Upload ${planType || "floor"} plan`}
      acceptedFormats={["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "application/pdf"]}
      showPresets={true}
      presetImages={floorPlanPresets}
    />
  )
}
