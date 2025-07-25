"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ContentStorage } from "@/lib/storage"
import type { LandingPageContent } from "@/types/content"
import { Save, Download, Upload, Trash2, Copy, FileText } from "lucide-react"
import { toast } from "sonner"

interface TemplateManagerProps {
  currentContent: LandingPageContent
  onLoadTemplate: (content: LandingPageContent) => void
}

export function TemplateManager({ currentContent, onLoadTemplate }: TemplateManagerProps) {
  const [templateName, setTemplateName] = useState("")
  const [importData, setImportData] = useState("")
  const [templates, setTemplates] = useState(() => ContentStorage.getTemplates())

  const refreshTemplates = () => {
    setTemplates(ContentStorage.getTemplates())
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    if (ContentStorage.save(currentContent, templateName)) {
      toast.success(`Template "${templateName}" saved successfully!`)
      setTemplateName("")
      refreshTemplates()
    } else {
      toast.error("Failed to save template")
    }
  }

  const handleLoadTemplate = (name: string) => {
    const template = ContentStorage.loadTemplate(name)
    if (template) {
      onLoadTemplate(template)
      toast.success(`Template "${name}" loaded successfully!`)
    } else {
      toast.error("Failed to load template")
    }
  }

  const handleDeleteTemplate = (name: string) => {
    if (confirm(`Are you sure you want to delete template "${name}"?`)) {
      if (ContentStorage.deleteTemplate(name)) {
        toast.success(`Template "${name}" deleted successfully!`)
        refreshTemplates()
      } else {
        toast.error("Failed to delete template")
      }
    }
  }

  const handleExport = () => {
    const exported = ContentStorage.exportContent(currentContent)
    const blob = new Blob([exported], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `landing-page-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Content exported successfully!")
  }

  const handleImport = () => {
    if (!importData.trim()) {
      toast.error("Please paste the content data")
      return
    }

    const imported = ContentStorage.importContent(importData)
    if (imported) {
      onLoadTemplate(imported)
      setImportData("")
      toast.success("Content imported successfully!")
    } else {
      toast.error("Invalid content data")
    }
  }

  return (
    <div className="space-y-6">
      {/* Save as Template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20] flex items-center">
            <Save className="h-5 w-5 mr-2" />
            Save as Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <div className="flex-1">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., Luxury Condos Template"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveTemplate} className="bg-[#D0AF21] hover:bg-[#B8991D]">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#231F20] flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Saved Templates ({Object.keys(templates).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(templates).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates saved yet</p>
              <p className="text-sm">Save your current content as a template to reuse later</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {Object.entries(templates).map(([name, template]) => (
                <div key={name} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#231F20]">{name}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {template.hero.title}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Created: {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadTemplate(name)}
                      className="text-[#D0AF21] border-[#D0AF21] hover:bg-[#D0AF21]/10"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Load
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTemplate(name)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export/Import */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#231F20] flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Download your current content as a JSON file for backup or sharing.
            </p>
            <Button onClick={handleExport} variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#231F20] flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Import Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="importData">Paste JSON Content</Label>
              <Textarea
                id="importData"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your exported JSON content here..."
                rows={3}
              />
            </div>
            <Button onClick={handleImport} variant="outline" className="w-full bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Import Content
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
