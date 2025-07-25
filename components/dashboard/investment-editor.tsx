"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { InvestmentContent } from "@/types/content"
import { Plus, Trash2 } from "lucide-react"

interface InvestmentEditorProps {
  content: InvestmentContent
  onChange: (content: InvestmentContent) => void
}

export function InvestmentEditor({ content, onChange }: InvestmentEditorProps) {
  const updateField = (field: keyof InvestmentContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const updateStat = (index: number, field: string, value: string) => {
    const updated = [...content.stats]
    updated[index] = { ...updated[index], [field]: value }
    updateField("stats", updated)
  }

  const addStat = () => {
    const newStat = {
      title: "",
      description: "",
      stat: "",
      statLabel: "",
    }
    updateField("stats", [...content.stats, newStat])
  }

  const removeStat = (index: number) => {
    const updated = content.stats.filter((_, i) => i !== index)
    updateField("stats", updated)
  }

  const updateAppreciationPoint = (index: number, value: string) => {
    const updated = [...content.appreciationPoints]
    updated[index] = value
    updateField("appreciationPoints", updated)
  }

  const addAppreciationPoint = () => {
    updateField("appreciationPoints", [...content.appreciationPoints, ""])
  }

  const removeAppreciationPoint = (index: number) => {
    const updated = content.appreciationPoints.filter((_, i) => i !== index)
    updateField("appreciationPoints", updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Investment Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="investmentTitle">Title</Label>
              <Input
                id="investmentTitle"
                value={content.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Why The Crescents is a"
              />
            </div>
            <div>
              <Label htmlFor="investmentSubtitle">Subtitle</Label>
              <Input
                id="investmentSubtitle"
                value={content.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Great Investment"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="investmentDescription">Description</Label>
            <Textarea
              id="investmentDescription"
              value={content.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brampton's growing population, strong economy..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Investment Statistics</CardTitle>
            <Button onClick={addStat} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {content.stats.map((stat, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#231F20]">Statistic {index + 1}</h4>
                  <Button onClick={() => removeStat(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={stat.title}
                      onChange={(e) => updateStat(index, "title", e.target.value)}
                      placeholder="Growing Population"
                    />
                  </div>
                  <div>
                    <Label>Statistic Value</Label>
                    <Input
                      value={stat.stat}
                      onChange={(e) => updateStat(index, "stat", e.target.value)}
                      placeholder="+15%"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={stat.description}
                    onChange={(e) => updateStat(index, "description", e.target.value)}
                    placeholder="Brampton is one of Canada's fastest-growing cities..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Statistic Label</Label>
                  <Input
                    value={stat.statLabel}
                    onChange={(e) => updateStat(index, "statLabel", e.target.value)}
                    placeholder="Population growth (5 years)"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Future Appreciation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="appreciationTitle">Section Title</Label>
              <Input
                id="appreciationTitle"
                value={content.appreciationTitle}
                onChange={(e) => updateField("appreciationTitle", e.target.value)}
                placeholder="Future Appreciation Potential"
              />
            </div>
            <div>
              <Label htmlFor="appreciationStat">Appreciation Percentage</Label>
              <Input
                id="appreciationStat"
                value={content.appreciationStat}
                onChange={(e) => updateField("appreciationStat", e.target.value)}
                placeholder="12-15%"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="appreciationLabel">Statistic Label</Label>
              <Input
                id="appreciationLabel"
                value={content.appreciationLabel}
                onChange={(e) => updateField("appreciationLabel", e.target.value)}
                placeholder="Expected Annual Appreciation"
              />
            </div>
            <div>
              <Label htmlFor="appreciationDescription">Description</Label>
              <Textarea
                id="appreciationDescription"
                value={content.appreciationDescription}
                onChange={(e) => updateField("appreciationDescription", e.target.value)}
                placeholder="Based on historical data and market projections..."
                rows={2}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Appreciation Points</Label>
              <Button onClick={addAppreciationPoint} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
                <Plus className="h-4 w-4 mr-2" />
                Add Point
              </Button>
            </div>
            <div className="space-y-3">
              {content.appreciationPoints.map((point, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={point}
                    onChange={(e) => updateAppreciationPoint(index, e.target.value)}
                    placeholder="Limited supply of freehold homes..."
                    className="flex-1"
                  />
                  <Button onClick={() => removeAppreciationPoint(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
