"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { CTAContent } from "@/types/content"
import { Plus, Trash2 } from "lucide-react"

interface CTAEditorProps {
  content: CTAContent
  onChange: (content: CTAContent) => void
}

export function CTAEditor({ content, onChange }: CTAEditorProps) {
  const updateField = (field: keyof CTAContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const updateBenefit = (index: number, value: string) => {
    const updated = [...content.benefits]
    updated[index] = value
    updateField("benefits", updated)
  }

  const addBenefit = () => {
    updateField("benefits", [...content.benefits, ""])
  }

  const removeBenefit = (index: number) => {
    const updated = content.benefits.filter((_, i) => i !== index)
    updateField("benefits", updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Call-to-Action Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ctaTitle">Title</Label>
              <Input
                id="ctaTitle"
                value={content.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Sign Up for"
              />
            </div>
            <div>
              <Label htmlFor="ctaSubtitle">Subtitle</Label>
              <Input
                id="ctaSubtitle"
                value={content.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                placeholder="Platinum Access!"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ctaDescription">Description</Label>
            <Textarea
              id="ctaDescription"
              value={content.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Join our exclusive VIP list to receive priority access..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Benefits List</CardTitle>
            <Button onClick={addBenefit} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  placeholder="Exclusive VIP pricing and incentives"
                  className="flex-1"
                />
                <Button onClick={() => removeBenefit(index)} variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ctaPhone">Phone Number</Label>
              <Input
                id="ctaPhone"
                value={content.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(905) 555-0123"
              />
            </div>
            <div>
              <Label htmlFor="ctaEmail">Email Address</Label>
              <Input
                id="ctaEmail"
                type="email"
                value={content.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="info@thecrescents.ca"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Worksheet Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="worksheetTitle">Worksheet Title</Label>
            <Input
              id="worksheetTitle"
              value={content.worksheetTitle}
              onChange={(e) => updateField("worksheetTitle", e.target.value)}
              placeholder="Ready to Submit a Worksheet?"
            />
          </div>

          <div>
            <Label htmlFor="worksheetDescription">Worksheet Description</Label>
            <Textarea
              id="worksheetDescription"
              value={content.worksheetDescription}
              onChange={(e) => updateField("worksheetDescription", e.target.value)}
              placeholder="Take the next step and secure your unit with our sales team."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
