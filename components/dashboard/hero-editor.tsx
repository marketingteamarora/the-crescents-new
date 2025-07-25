"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import type { HeroContent } from "@/types/content"

interface HeroEditorProps {
  content: HeroContent
  onChange: (content: HeroContent) => void
}

export function HeroEditor({ content, onChange }: HeroEditorProps) {
  // Provide default values if content is undefined
  const safeContent = content || {
    badge: "",
    title: "",
    subtitle: "",
    location: "",
    description: "",
    heroImage: ""
  }

  const updateField = (field: keyof HeroContent, value: string) => {
    onChange({ ...safeContent, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Hero Section Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                value={safeContent.badge}
                onChange={(e) => updateField("badge", e.target.value)}
                placeholder="Pre-Construction • Starting from $1M"
              />
            </div>

            <div>
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={safeContent.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="The Crescents"
                className="text-3xl font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={safeContent.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="An Enclave Community"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={safeContent.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Kennedy & Mayfield Road, Brampton"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={safeContent.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Executive living redefined..."
              rows={3}
            />
          </div>

          <ImageUpload
            value={safeContent.heroImage || ""}
            onChange={(value) => updateField("heroImage", value)}
            label="Hero Background Image"
            aspectRatio="aspect-video"
          />
          
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-[#231F20] mb-4">Logo</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Upload your logo. Recommended size: 240x80px (2:1 aspect ratio).
              </p>
              <ImageUpload
                value={safeContent.logoUrl || ""}
                onChange={(value) => updateField("logoUrl", value)}
                label="Site Logo"
                aspectRatio="aspect-[3/1]"
                maxWidth={240}
              />
              {safeContent.logoUrl && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Logo Preview</h4>
                  <div className="max-w-[240px] p-4 border border-gray-200 rounded">
                    <img 
                      src={safeContent.logoUrl} 
                      alt="Logo preview" 
                      className="w-full h-auto max-h-20 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
