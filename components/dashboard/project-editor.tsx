"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProjectSummaryContent, StatsContent } from "@/types/content"

interface ProjectEditorProps {
  projectContent: ProjectSummaryContent
  statsContent: StatsContent
  onProjectChange: (content: ProjectSummaryContent) => void
  onStatsChange: (content: StatsContent) => void
}

export function ProjectEditor({ projectContent, statsContent, onProjectChange, onStatsChange }: ProjectEditorProps) {
  // Provide default values to prevent undefined errors
  const safeProjectContent = projectContent || {
    developer: "",
    location: "",
    status: "",
    occupancy: "",
    types: "",
    sizes: "",
    pricing: "",
    deposit: "",
    vipPricing: "",
    cappedLevies: ""
  }

  const safeStatsContent = statsContent || {
    homes: "",
    categories: "",
    experience: "",
    moveIn: ""
  }

  const updateProjectField = (field: keyof ProjectSummaryContent, value: string) => {
    onProjectChange({ ...safeProjectContent, [field]: value })
  }

  const updateStatsField = (field: keyof StatsContent, value: string) => {
    onStatsChange({ ...safeStatsContent, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="homes">Premium Homes</Label>
              <Input
                id="homes"
                value={safeStatsContent.homes}
                onChange={(e) => updateStatsField("homes", e.target.value)}
                placeholder="248"
              />
            </div>
            <div>
              <Label htmlFor="categories">Home Categories</Label>
              <Input
                id="categories"
                value={safeStatsContent.categories}
                onChange={(e) => updateStatsField("categories", e.target.value)}
                placeholder="4"
              />
            </div>
            <div>
              <Label htmlFor="experience">Years Experience</Label>
              <Input
                id="experience"
                value={safeStatsContent.experience}
                onChange={(e) => updateStatsField("experience", e.target.value)}
                placeholder="30+"
              />
            </div>
            <div>
              <Label htmlFor="moveIn">Move-in Ready</Label>
              <Input
                id="moveIn"
                value={safeStatsContent.moveIn}
                onChange={(e) => updateStatsField("moveIn", e.target.value)}
                placeholder="2025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="developer">Developer</Label>
              <Input
                id="developer"
                value={safeProjectContent.developer}
                onChange={(e) => updateProjectField("developer", e.target.value)}
                placeholder="Fieldgate Homes"
              />
            </div>
            <div>
              <Label htmlFor="projectLocation">Location</Label>
              <Input
                id="projectLocation"
                value={safeProjectContent.location}
                onChange={(e) => updateProjectField("location", e.target.value)}
                placeholder="Kennedy & Mayfield Road, Brampton"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={safeProjectContent.status}
                onChange={(e) => updateProjectField("status", e.target.value)}
                placeholder="Pre-construction development"
              />
            </div>
            <div>
              <Label htmlFor="occupancy">Occupancy</Label>
              <Input
                id="occupancy"
                value={safeProjectContent.occupancy}
                onChange={(e) => updateProjectField("occupancy", e.target.value)}
                placeholder="Occupancy anticipated 2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="types">Property Types</Label>
              <Input
                id="types"
                value={safeProjectContent.types}
                onChange={(e) => updateProjectField("types", e.target.value)}
                placeholder="Freehold townhomes & single-family"
              />
            </div>
            <div>
              <Label htmlFor="sizes">Size Range</Label>
              <Input
                id="sizes"
                value={safeProjectContent.sizes}
                onChange={(e) => updateProjectField("sizes", e.target.value)}
                placeholder="1,744 - 4,154 sq ft"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="pricing">Pricing</Label>
              <Input
                id="pricing"
                value={safeProjectContent.pricing}
                onChange={(e) => updateProjectField("pricing", e.target.value)}
                placeholder="From $1M"
              />
            </div>
            <div>
              <Label htmlFor="deposit">Deposit Terms</Label>
              <Input
                id="deposit"
                value={safeProjectContent.deposit}
                onChange={(e) => updateProjectField("deposit", e.target.value)}
                placeholder="Flexible extended deposit"
              />
            </div>
            <div>
              <Label htmlFor="vipPricing">VIP Pricing</Label>
              <Input
                id="vipPricing"
                value={safeProjectContent.vipPricing}
                onChange={(e) => updateProjectField("vipPricing", e.target.value)}
                placeholder="Platinum VIP pricing"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
