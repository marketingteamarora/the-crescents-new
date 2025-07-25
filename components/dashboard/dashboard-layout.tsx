"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { HeroEditor } from "@/components/dashboard/hero-editor"
import { ProjectEditor } from "@/components/dashboard/project-editor"
import { LifestyleEditor } from "@/components/dashboard/lifestyle-editor"
import { DetailsEditor } from "@/components/dashboard/details-editor"
import { InvestmentEditor } from "@/components/dashboard/investment-editor"
import { CTAEditor } from "@/components/dashboard/cta-editor"
import { FooterEditor } from "@/components/dashboard/footer-editor"
import { FAQEditor } from "@/components/dashboard/faq-editor"
import { LivePreview } from "@/components/dashboard/live-preview"
import { TemplateManager } from "@/components/dashboard/template-manager"
import { EmbedManager } from "@/components/dashboard/embed-manager"
import { useContent } from "@/lib/content-context"
import { LogOut, Save, Clock, CheckCircle, ExternalLink, Palette } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { ThemeColorPicker } from "./theme-color-picker"

export function DashboardLayout() {
  const { content, setContent, saveContent, loading, hasChanges, lastSaved, autoSave, setAutoSave, isSaving } = useContent()
  const [activeTab, setActiveTab] = useState("hero")

  const handleSave = async () => {
    try {
      await saveContent()
      toast({
        title: "Content saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your changes.",
        variant: "destructive",
      })
    }
  }

  const handlePreview = () => {
    window.open("/", "_blank")
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    })
    window.location.href = "/dashboard"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#231F20] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Real Estate Landing Page Dashboard</h1>
            <div className="flex items-center space-x-4 mt-2">
              <ThemeColorPicker />
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
                <label htmlFor="auto-save" className="text-sm text-gray-600">
                  Auto-save
                </label>
              </div>
              {isSaving && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
                </Badge>
              )}
              {!isSaving && hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Unsaved changes
                </Badge>
              )}
              {!isSaving && !hasChanges && lastSaved && (
                <Badge variant="secondary" className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </Badge>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handlePreview}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
              {isSaving ? "Saving..." : "Save Changes"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 gap-2 mb-2">
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="project">Project</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 gap-2 mb-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="investment">Investment</TabsTrigger>
                <TabsTrigger value="cta">CTA</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 gap-2">
                <TabsTrigger value="footer">Footer</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="embeds">Embeds</TabsTrigger>
              </TabsList>

              <TabsContent value="hero" className="space-y-4">
                <HeroEditor content={content.hero} onChange={(hero) => setContent({ ...content, hero })} />
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <ProjectEditor
                  projectContent={content.projectSummary}
                  statsContent={content.stats}
                  onProjectChange={(projectSummary) => setContent({ ...content, projectSummary })}
                  onStatsChange={(stats) => setContent({ ...content, stats })}
                />
              </TabsContent>

              <TabsContent value="lifestyle" className="space-y-4">
                <LifestyleEditor
                  content={content.lifestyle}
                  onChange={(lifestyle) => setContent({ ...content, lifestyle })}
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <DetailsEditor
                  content={content.projectDetails}
                  onChange={(projectDetails) => setContent({ ...content, projectDetails })}
                />
              </TabsContent>

              <TabsContent value="investment" className="space-y-4">
                <InvestmentEditor
                  content={content.investment}
                  onChange={(investment) => setContent({ ...content, investment })}
                />
              </TabsContent>

              <TabsContent value="cta" className="space-y-4">
                <CTAEditor content={content.cta} onChange={(cta) => setContent({ ...content, cta })} />
              </TabsContent>

              <TabsContent value="footer" className="space-y-4">
                <FooterEditor content={content.footer} onChange={(footer) => setContent({ ...content, footer })} />
              </TabsContent>

              <TabsContent value="faq" className="space-y-4">
                <FAQEditor 
                  content={content.faq || { title: '', subtitle: '', faqs: [] }}
                  onChange={(faq) => setContent({ ...content, faq })}
                />
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <TemplateManager currentContent={content} onLoadTemplate={(template) => setContent(template)} />
              </TabsContent>

              <TabsContent value="embeds" className="space-y-4">
                <EmbedManager 
                  config={content.embeds || {
                    platinumAccess: {
                      buttonText: 'Platinum Access',
                      redirectUrl: '',
                      seamlessCode: '',
                      iframeCode: '',
                      ampCode: '',
                      customCode: '',
                      activeType: 'seamless'
                    },
                    bookMeeting: {
                      buttonText: 'Book a Meeting',
                      redirectUrl: '',
                      seamlessCode: '',
                      iframeCode: '',
                      ampCode: '',
                      customCode: '',
                      activeType: 'seamless'
                    }
                  }}
                  onChange={(embeds) => setContent({ ...content, embeds })}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="col-span-2">
            <LivePreview content={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
