"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { storage } from "@/lib/supabase-storage"
import { supabase } from "@/lib/supabase"
import { Upload, X, ImageIcon, LinkIcon, Check, AlertCircle, Loader2, Eye, Cloud } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface SupabaseImageUploadProps {
  value: string
  onChange: (value: string) => void
  label: string
  aspectRatio?: string
  category?: string
  placeholder?: string
  acceptedFormats?: string[]
  showPresets?: boolean
  presetImages?: Array<{ url: string; label: string }>
}

export function SupabaseImageUpload({
  value,
  onChange,
  label,
  aspectRatio = "aspect-video",
  category = "general",
  placeholder,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
  showPresets = false,
  presetImages = [],
}: SupabaseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState("")
  const [isValidatingUrl, setIsValidatingUrl] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; size?: number } | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 30) return prev + 10
        if (prev < 60) return prev + 5
        if (prev < 90) return prev + 3
        return prev + 1
      })
    }, 200)

    try {
      const filePath = await storage.uploadImage(file, category)
      
      if (filePath) {
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('landing-page-images')
          .getPublicUrl(filePath)
          
        onChange(publicUrl)
        
        // Create an image element to get dimensions
        const img = new window.Image()
        img.onload = () => {
          setImageInfo({
            width: img.width,
            height: img.height,
            size: file.size
          })
        }
        img.src = publicUrl
        
        toast.success(`${label} uploaded successfully!`, {
          description: `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
        })
        setUploadProgress(100)
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        toast.error(
          `Please upload a valid image file (${acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")})`,
        )
        return
      }
      handleFileUpload(file)
    }
  }

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return

    setIsValidatingUrl(true)

    try {
      // Simple URL validation
      new URL(urlInput)
      onChange(urlInput)
      setUrlInput("")
      setShowUrlInput(false)
      toast.success("Image URL added successfully!")
    } catch (error) {
      toast.error("Please enter a valid URL")
    } finally {
      setIsValidatingUrl(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        const file = files[0]
        if (!acceptedFormats.includes(file.type)) {
          toast.error(
            `Please upload a valid image file (${acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")})`,
          )
          return
        }
        handleFileUpload(file)
      }
    },
    [acceptedFormats],
  )

  const handleRemove = () => {
    onChange("")
    setImageInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success("Image removed")
  }

  const handlePreview = () => {
    if (value) {
      window.open(value, "_blank")
    }
  }

  const handlePresetSelect = (presetUrl: string) => {
    onChange(presetUrl)
    toast.success("Preset image selected!")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const currentImage = value || "/placeholder.svg?height=400&width=600"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center space-x-2">
          <Cloud className="h-4 w-4 text-blue-500" />
          <span>{label}</span>
          {imageInfo && (
            <Badge variant="outline" className="text-xs">
              {imageInfo.width} × {imageInfo.height}
              {imageInfo.size && ` • ${formatFileSize(imageInfo.size)}`}
            </Badge>
          )}
        </Label>

        {value && (
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handlePreview}>
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button size="sm" variant="destructive" onClick={handleRemove}>
              <X className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Image Preview */}
      <Card className="overflow-hidden border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
        <CardContent className="p-0">
          <div className={`${aspectRatio} relative group bg-gradient-to-br from-gray-50 to-gray-100`}>
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={label}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-105"
              unoptimized={value?.startsWith("data:") || false}
            />

            {/* Enhanced Overlay Controls */}
            {value && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handlePreview}
                    className="bg-white/90 hover:bg-white shadow-lg"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleRemove}
                    className="bg-red-500/90 hover:bg-red-500 shadow-lg"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Enhanced Upload Progress */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 min-w-[280px] shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Uploading to Supabase...</p>
                      <p className="text-sm text-gray-500">Processing and storing securely</p>
                    </div>
                  </div>
                  <Progress value={uploadProgress} className="h-3 mb-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{uploadProgress}% complete</span>
                    <span>{uploadProgress < 100 ? "Uploading..." : "Complete!"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Upload Methods */}
      <div className="space-y-4">
        {/* Drag & Drop Upload */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-6">
            <div
              ref={dropRef}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`text-center transition-all duration-300 ${
                dragActive ? "bg-blue-50 border-blue-400 scale-105" : ""
              }`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${
                  dragActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Cloud className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {dragActive ? "Drop your image here!" : "Upload to Supabase Storage"}
              </h3>

              <p className="text-gray-600 mb-4">Secure cloud storage with automatic optimization</p>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.join(",")}
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>Supported formats: {acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")}</p>
                <p>Maximum file size: 10MB • Stored securely in Supabase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL Input Toggle */}
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-gray-500 hover:text-blue-500"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            {showUrlInput ? "Hide URL Input" : "Use Image URL Instead"}
          </Button>
        </div>

        {/* URL Input */}
        {showUrlInput && (
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-3">
                  <LinkIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Image URL</span>
                </div>

                <div className="flex space-x-2">
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                  />
                  <Button
                    type="button"
                    onClick={handleUrlSubmit}
                    disabled={!urlInput.trim() || isValidatingUrl}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isValidatingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-start space-x-2 text-xs text-gray-500">
                  <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>Make sure the URL is publicly accessible and points directly to an image file</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preset Images */}
        {showPresets && presetImages.length > 0 && (
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                Quick Presets
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {presetImages.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset.url)}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors group"
                  >
                    <Image
                      src={preset.url || "/placeholder.svg"}
                      alt={preset.label}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{preset.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Image Info */}
      {imageInfo && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <Check className="h-4 w-4" />
                <span className="font-medium">Image uploaded to Supabase successfully</span>
              </div>
              <div className="text-xs text-green-600 space-x-4">
                <span>
                  {imageInfo.width} × {imageInfo.height}px
                </span>
                {imageInfo.size && <span>{formatFileSize(imageInfo.size)}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
