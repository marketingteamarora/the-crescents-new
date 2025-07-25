"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
  aspectRatio?: string
  maxWidth?: number
}

export function ImageUpload({ 
  value, 
  onChange, 
  label, 
  aspectRatio = "aspect-video",
  maxWidth
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload - in real app, upload to your storage service
    const reader = new FileReader()
    reader.onload = (e) => {
      onChange(e.target?.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>

      {value && (
        <div className="relative group">
          <div 
            className={`${aspectRatio} relative rounded-lg overflow-hidden border`}
            style={maxWidth ? { maxWidth: `${maxWidth}px` } : {}}
          >
            <Image 
              src={value || "/placeholder.svg"} 
              alt={label} 
              fill 
              className="object-contain" 
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500">Upload Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div>
          <Label className="text-xs text-gray-500">Image URL</Label>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
