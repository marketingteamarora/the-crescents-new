"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { FooterContent } from "@/types/content"
import { Plus, Trash2 } from "lucide-react"

interface FooterEditorProps {
  content: FooterContent
  onChange: (content: FooterContent) => void
}

export function FooterEditor({ content, onChange }: FooterEditorProps) {
  const updateField = (field: keyof FooterContent, value: any) => {
    onChange({ ...content, [field]: value })
  }

  const updateQuickLink = (index: number, field: string, value: string) => {
    const updated = [...content.quickLinks]
    updated[index] = { ...updated[index], [field]: value }
    updateField("quickLinks", updated)
  }

  const addQuickLink = () => {
    updateField("quickLinks", [...content.quickLinks, { href: "#", label: "" }])
  }

  const removeQuickLink = (index: number) => {
    const updated = content.quickLinks.filter((_, i) => i !== index)
    updateField("quickLinks", updated)
  }

  const updateDeveloperLink = (index: number, field: string, value: string) => {
    const updated = [...content.developerLinks]
    updated[index] = { ...updated[index], [field]: value }
    updateField("developerLinks", updated)
  }

  const addDeveloperLink = () => {
    updateField("developerLinks", [...content.developerLinks, { href: "#", label: "" }])
  }

  const removeDeveloperLink = (index: number) => {
    const updated = content.developerLinks.filter((_, i) => i !== index)
    updateField("developerLinks", updated)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Footer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="footerDescription">Description</Label>
            <Textarea
              id="footerDescription"
              value={content.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="An Enclave Community at Kennedy & Mayfield Road, Brampton..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="footerPricing">Pricing Information</Label>
            <Input
              id="footerPricing"
              value={content.pricing}
              onChange={(e) => updateField("pricing", e.target.value)}
              placeholder="Starting from $1M • Occupancy 2025"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Quick Links</CardTitle>
            <Button onClick={addQuickLink} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.quickLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Link Text</Label>
                  <Input
                    value={link.label}
                    onChange={(e) => updateQuickLink(index, "label", e.target.value)}
                    placeholder="Project Details"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Label>Link URL</Label>
                    <Input
                      value={link.href}
                      onChange={(e) => updateQuickLink(index, "href", e.target.value)}
                      placeholder="#details"
                    />
                  </div>
                  <Button onClick={() => removeQuickLink(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#231F20]">Developer Links</CardTitle>
            <Button onClick={addDeveloperLink} size="sm" className="bg-[#D0AF21] hover:bg-[#B8991D]">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.developerLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <Label>Link Text</Label>
                  <Input
                    value={link.label}
                    onChange={(e) => updateDeveloperLink(index, "label", e.target.value)}
                    placeholder="Fieldgate Homes"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Label>Link URL</Label>
                    <Input
                      value={link.href}
                      onChange={(e) => updateDeveloperLink(index, "href", e.target.value)}
                      placeholder="#"
                    />
                  </div>
                  <Button onClick={() => removeDeveloperLink(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20]">Contact & Legal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="footerPhone">Phone Number</Label>
              <Input
                id="footerPhone"
                value={content.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(905) 555-0123"
              />
            </div>
            <div>
              <Label htmlFor="footerEmail">Email Address</Label>
              <Input
                id="footerEmail"
                type="email"
                value={content.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="info@thecrescents.ca"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="footerAddress">Address</Label>
              <Input
                id="footerAddress"
                value={content.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Kennedy & Mayfield Road"
              />
            </div>
            <div>
              <Label htmlFor="footerCity">City</Label>
              <Input
                id="footerCity"
                value={content.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Brampton, ON"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="footerCopyright">Copyright Text</Label>
            <Input
              id="footerCopyright"
              value={content.copyright}
              onChange={(e) => updateField("copyright", e.target.value)}
              placeholder="The Crescents by Fieldgate Homes. All rights reserved."
            />
          </div>

          <div>
            <Label htmlFor="footerDisclaimer">Disclaimer</Label>
            <Textarea
              id="footerDisclaimer"
              value={content.disclaimer}
              onChange={(e) => updateField("disclaimer", e.target.value)}
              placeholder="This is not an offering for sale. Any such offering can only be made by way of disclosure statement."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
