"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupabaseImageUpload } from "./supabase-image-upload"
import type { HeroContent } from "@/types/content"
import { Type, ImageIcon, Eye, Sparkles, Target, MapPin } from "lucide-react"

interface EnhancedHeroEditorProps {
  content: HeroContent
  onChange: (content: HeroContent) => void
}

export function EnhancedHeroEditor({ content, onChange }: EnhancedHeroEditorProps) {
  const updateField = (field: keyof HeroContent, value: string) => {
    onChange({ ...content, [field]: value })
  }

  const presetBadges = [
    "Pre-Construction • Starting from $1M",
    "Now Selling • Move-in Ready 2025",
    "Limited Release • VIP Access Only",
    "Grand Opening • Special Pricing",
    "Exclusive Launch • Register Today",
  ]

  const presetLocations = [
    "Kennedy & Mayfield Road, Brampton",
    "Downtown Toronto, ON",
    "Mississauga City Centre, ON",
    "Vaughan Metropolitan Centre, ON",
    "Oakville Waterfront, ON",
  ]

  return (
    <div className="space-y-6">
      {/* Hero Content Management */}
      <Card className="border-2 border-[#D0AF21]/20">
        <CardHeader className="bg-gradient-to-r from-[#D0AF21]/5 to-[#9C182F]/5">
          <CardTitle className="text-[#231F20] flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-[#D0AF21]" />
            Hero Section Designer
            <Badge className="ml-2 bg-[#D0AF21] text-white">Premium</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content" className="flex items-center space-x-2">
                <Type className="h-4 w-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>Media</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
              {/* Badge Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Badge & Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="badge">Badge Text</Label>
                    <Input
                      id="badge"
                      value={content.badge}
                      onChange={(e) => updateField("badge", e.target.value)}
                      placeholder="Pre-Construction • Starting from $1M"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">Quick Presets</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presetBadges.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => updateField("badge", preset)}
                          className="text-xs h-8 bg-transparent hover:bg-[#D0AF21]/10 hover:border-[#D0AF21]"
                        >
                          {preset}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Headlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Main Headlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Primary Title</Label>
                      <Input
                        id="title"
                        value={content.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="The Crescents"
                        className="text-lg font-bold"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will be the main headline</p>
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        value={content.subtitle}
                        onChange={(e) => updateField("subtitle", e.target.value)}
                        placeholder="An Enclave Community"
                        className="text-base"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supporting headline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Project Location</Label>
                    <Input
                      id="location"
                      value={content.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="Kennedy & Mayfield Road, Brampton"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-gray-600">Location Presets</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presetLocations.map((preset, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => updateField("location", preset)}
                          className="text-xs h-8 bg-transparent hover:bg-[#D0AF21]/10 hover:border-[#D0AF21]"
                        >
                          {preset}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="description">Main Description</Label>
                    <Textarea
                      id="description"
                      value={content.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Executive living redefined with freehold townhomes and single-family homes in the ultimate expression of opulent residential living."
                      rows={4}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This appears below the main headline. Keep it compelling and concise.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Hero Background Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SupabaseImageUpload
                    value={content.heroImage}
                    onChange={(value) => updateField("heroImage", value)}
                    label="Hero Background Image"
                    aspectRatio="aspect-video"
                    category="hero"
                    showPresets={true}
                    presetImages={[
                      {
                        url: "/placeholder.svg?height=1080&width=1920&text=Luxury+Exterior",
                        label: "Luxury Exterior",
                      },
                      {
                        url: "/placeholder.svg?height=1080&width=1920&text=Modern+Architecture",
                        label: "Modern Architecture",
                      },
                      {
                        url: "/placeholder.svg?height=1080&width=1920&text=Community+View",
                        label: "Community View",
                      },
                      {
                        url: "/placeholder.svg?height=1080&width=1920&text=Aerial+View",
                        label: "Aerial View",
                      },
                    ]}
                  />

                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Hero Image Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use high-resolution images (1920×1080 or larger)</li>
                      <li>• Ensure good contrast for text readability</li>
                      <li>• Consider the focal point for mobile devices</li>
                      <li>• Architectural photography works best for real estate</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mini Preview */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
                    {content.heroImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${content.heroImage})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#231F20]/80 via-[#231F20]/60 to-[#231F20]/40" />

                    <div className="absolute inset-0 flex items-center justify-center text-white text-center p-8">
                      <div className="max-w-2xl">
                        {content.badge && (
                          <Badge className="mb-4 bg-gradient-to-r from-[#D0AF21]/90 to-[#9C182F]/90 text-white border-0 px-4 py-1 text-xs">
                            {content.badge}
                          </Badge>
                        )}

                        {content.title && (
                          <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">{content.title}</h1>
                        )}

                        {content.subtitle && (
                          <p className="text-lg md:text-xl mb-3 text-[#D0AF21] font-medium">{content.subtitle}</p>
                        )}

                        {content.location && (
                          <div className="flex items-center justify-center space-x-2 text-sm mb-3">
                            <MapPin className="h-3 w-3" />
                            <span>{content.location}</span>
                          </div>
                        )}

                        {content.description && (
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {content.description.substring(0, 120)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <Button onClick={() => window.open("/", "_blank")} className="bg-[#D0AF21] hover:bg-[#B8991D]">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
