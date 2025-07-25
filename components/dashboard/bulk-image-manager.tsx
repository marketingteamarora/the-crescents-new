"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ImageHandler } from "@/lib/image-handler"
import { Upload, Folder, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface BulkImageManagerProps {
  onImagesUploaded: (images: Array<{ name: string; url: string; type: string }>) => void
}

export function BulkImageManager({ onImagesUploaded }: BulkImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<Array<{ name: string; url: string; type: string }>>([])

  const handleBulkUpload = async (files: FileList) => {
    setIsUploading(true)
    setUploadProgress(0)

    const results: Array<{ name: string; url: string; type: string }> = []
    const totalFiles = files.length

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i]
      const progress = ((i + 1) / totalFiles) * 100
      setUploadProgress(progress)

      try {
        const result = await ImageHandler.processImage(file)
        if (result.success && result.data) {
          results.push({
            name: file.name,
            url: result.data,
            type: file.type.includes("floor") ? "floorplan" : file.type.includes("hero") ? "hero" : "lifestyle",
          })
        }
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error)
      }
    }

    setUploadedImages(results)
    onImagesUploaded(results)
    setIsUploading(false)

    toast.success(`Successfully uploaded ${results.length} of ${totalFiles} images`)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      handleBulkUpload(files)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#231F20] flex items-center">
          <Folder className="h-5 w-5 mr-2" />
          Bulk Image Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Upload Multiple Images</h3>
          <p className="text-gray-600 mb-4">Select multiple images to upload at once</p>

          <Button
            onClick={() => document.getElementById("bulk-upload")?.click()}
            disabled={isUploading}
            className="bg-gradient-to-r from-[#D0AF21] to-[#9C182F] hover:from-[#B8991D] hover:to-[#7D1426] text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Images
          </Button>

          <input
            id="bulk-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Uploading images...</span>
              <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {uploadedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Uploaded Images ({uploadedImages.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {image.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white bg-black/50 px-2 py-1 rounded truncate">{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
