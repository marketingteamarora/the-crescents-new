"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { ProjectDetailsContent } from "@/types/content"
import { Plus, Trash2 } from "lucide-react"
import { SupabaseImageUpload } from "./supabase-image-upload"

interface DetailsEditorProps {
  content: ProjectDetailsContent
  onChange: (content: ProjectDetailsContent) => void
}

export function DetailsEditor({ content, onChange }: DetailsEditorProps) {
  const updateField = (field: keyof ProjectDetailsContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const updateOverviewItem = (index: number, value: string) => {
    const updated = [...content.developmentOverview]
    updated[index] = value
    updateField("developmentOverview", updated)
  }

  const addOverviewItem = () => {
    updateField("developmentOverview", [...content.developmentOverview, ""])
  }

  const removeOverviewItem = (index: number) => {
    const updated = content.developmentOverview.filter((_, i) => i !== index)
    updateField("developmentOverview", updated)
  }

  const updateFeatureItem = (index: number, value: string) => {
    const updated = [...content.communityFeatures]
    updated[index] = value
    updateField("communityFeatures", updated)
  }

  const addFeatureItem = () => {
    updateField("communityFeatures", [...content.communityFeatures, ""])
  }

  const removeFeatureItem = (index: number) => {
    const updated = content.communityFeatures.filter((_, i) => i !== index)
    updateField("communityFeatures", updated)
  }

  const updateFloorPlan = (index: number, field: string, value: any) => {
    const updated = [...content.floorPlans]
    updated[index] = { ...updated[index], [field]: value }
    updateField("floorPlans", updated)
  }

  const addFloorPlan = () => {
    const newPlan = {
      width: "",
      size: "",
      popular: false,
      image: "/placeholder.svg?height=192&width=300",
    }
    updateField("floorPlans", [...content.floorPlans, newPlan])
  }

  const removeFloorPlan = (index: number) => {
    const updated = content.floorPlans.filter((_, i) => i !== index)
    updateField("floorPlans", updated)
  }

  const updateBonus = (index: number, field: string, value: string) => {
    const updated = [...content.bonuses]
    updated[index] = { ...updated[index], [field]: value }
    updateField("bonuses", updated)
  }

  const addBonus = () => {
    const newBonus = { title: "", description: "" }
    updateField("bonuses", [...content.bonuses, newBonus])
  }

  const removeBonus = (index: number) => {
    const updated = content.bonuses.filter((_, i) => i !== index)
    updateField("bonuses", updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Development Overview</CardTitle>
            <Button onClick={addOverviewItem} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.developmentOverview.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => updateOverviewItem(index, e.target.value)}
                  placeholder="Development overview point"
                  className="flex-1"
                />
                <Button onClick={() => removeOverviewItem(index)} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Community Features</CardTitle>
            <Button onClick={addFeatureItem} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.communityFeatures.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => updateFeatureItem(index, e.target.value)}
                  placeholder="Community feature"
                  className="flex-1"
                />
                <Button onClick={() => removeFeatureItem(index)} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Floor Plans</CardTitle>
            <Button onClick={addFloorPlan} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Floor Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {content.floorPlans.map((plan, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#231F20]">Floor Plan {index + 1}</h4>
                  <Button onClick={() => removeFloorPlan(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Width</Label>
                    <Input
                      value={plan.width}
                      onChange={(e) => updateFloorPlan(index, "width", e.target.value)}
                      placeholder="30'"
                    />
                  </div>
                  <div>
                    <Label>Size Range</Label>
                    <Input
                      value={plan.size}
                      onChange={(e) => updateFloorPlan(index, "size", e.target.value)}
                      placeholder="1,744 - 2,100 sq ft"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id={`popular-${index}`}
                      checked={plan.popular}
                      onCheckedChange={(checked) => updateFloorPlan(index, "popular", checked)}
                    />
                    <Label htmlFor={`popular-${index}`}>Popular</Label>
                  </div>
                </div>

                <SupabaseImageUpload
                  value={plan.image}
                  onChange={(value) => updateFloorPlan(index, "image", value)}
                  label="Floor Plan Image"
                  aspectRatio="aspect-[3/4]"
                  category="floorplan"
                  showPresets={true}
                  presetImages={[
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
                  ]}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Bonuses & Incentives</CardTitle>
            <Button onClick={addBonus} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Bonus
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {content.bonuses.map((bonus, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#231F20]">Bonus {index + 1}</h4>
                  <Button onClick={() => removeBonus(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Bonus Title</Label>
                    <Input
                      value={bonus.title}
                      onChange={(e) => updateBonus(index, "title", e.target.value)}
                      placeholder="Platinum VIP Pricing"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={bonus.description}
                      onChange={(e) => updateBonus(index, "description", e.target.value)}
                      placeholder="Exclusive pricing available..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
