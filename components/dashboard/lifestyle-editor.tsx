"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { LifestyleContent } from "@/types/content"
import { Plus, Trash2 } from "lucide-react"
import { SupabaseImageUpload } from "./supabase-image-upload"

interface LifestyleEditorProps {
  content: LifestyleContent
  onChange: (content: LifestyleContent) => void
}

export function LifestyleEditor({ content, onChange }: LifestyleEditorProps) {
  const updateField = (field: keyof LifestyleContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const updatedFeatures = [...content.features]
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
    updateField("features", updatedFeatures)
  }

  const addFeature = () => {
    const newFeature = {
      title: "",
      description: "",
      image: "/placeholder.svg?height=256&width=400",
    }
    updateField("features", [...content.features, newFeature])
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = content.features.filter((_, i) => i !== index)
    updateField("features", updatedFeatures)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Lifestyle Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="lifestyleTitle">Title</Label>
              <Input
                id="lifestyleTitle"
                value={content.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="The Ultimate Expression of"
              />
            </div>
            <div>
              <Label htmlFor="lifestyleSubtitle">Subtitle</Label>
              <Input
                id="lifestyleSubtitle"
                value={content.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Opulent Residential Living"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lifestyleDescription">Description</Label>
            <Textarea
              id="lifestyleDescription"
              value={content.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Discover a lifestyle where luxury meets convenience..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Lifestyle Features</CardTitle>
            <Button onClick={addFeature} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {content.features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#231F20]">Feature {index + 1}</h4>
                  <Button onClick={() => removeFeature(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Feature Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                      placeholder="Natural Beauty"
                    />
                  </div>
                  <div className="md:row-span-2">
                    <SupabaseImageUpload
                      value={feature.image}
                      onChange={(value) => updateFeature(index, "image", value)}
                      label="Feature Image"
                      aspectRatio="aspect-[4/3]"
                      category="lifestyle"
                      showPresets={true}
                      presetImages={[
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
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <Label>Feature Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                    placeholder="Minutes from Conservation Drive Park..."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
