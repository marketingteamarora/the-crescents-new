"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { SupabaseStorage } from "@/lib/supabase-storage"
import type { LandingPageContent } from "@/types/content"
import type { ContentTemplateRow } from "@/lib/supabase"
import { Save, Download, Upload, Trash2, Copy, FileText, Cloud, Users, Lock } from "lucide-react"
import { toast } from "sonner"

interface SupabaseTemplateManagerProps {
  currentContent: LandingPageContent
  onLoadTemplate: (content: LandingPageContent) => void
}

export function SupabaseTemplateManager({ currentContent, onLoadTemplate }: SupabaseTemplateManagerProps) {
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [importData, setImportData] = useState("")
  const [templates, setTemplates] = useState<ContentTemplateRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [storage] = useState(() => new SupabaseStorage())

  useEffect(() => {
    loadTemplates()
  }, [])

  // Set up real-time subscription for templates
  useEffect(() => {
    const subscription = storage.subscribeToTemplateChanges((payload) => {
      loadTemplates() // Reload templates when changes occur
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [storage])

  const loadTemplates = async () => {
    setIsLoading(true)
    try {
      const result = await storage.loadTemplates()
      if (result.success && result.data) {
        setTemplates(result.data)
      } else if (result.error) {
        toast.error(`Failed to load templates: ${result.error}`)
      }
    } catch (error) {
      console.error("Error loading templates:", error)
      toast.error("Failed to load templates")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast.error("Please enter a template name")
      return
    }

    setIsSaving(true)
    try {
      const result = await storage.saveTemplate(
        templateName,
        currentContent,
        templateDescription || undefined,
        isPublic,
      )

      if (result.success) {
        toast.success(`Template "${templateName}" saved successfully!`)
        setTemplateName("")
        setTemplateDescription("")
        setIsPublic(false)
        loadTemplates()
      } else {
        toast.error(`Failed to save template: ${result.error}`)
      }
    } catch (error) {
      console.error("Error saving template:", error)
      toast.error("Failed to save template")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadTemplate = (template: ContentTemplateRow) => {
    onLoadTemplate(template.content as LandingPageContent)
    toast.success(`Template "${template.name}" loaded successfully!`)
  }

  const handleDeleteTemplate = async (template: ContentTemplateRow) => {
    if (confirm(`Are you sure you want to delete template "${template.name}"?`)) {
      try {
        const result = await storage.deleteTemplate(template.id)
        if (result.success) {
          toast.success(`Template "${template.name}" deleted successfully!`)
          loadTemplates()
        } else {
          toast.error(`Failed to delete template: ${result.error}`)
        }
      } catch (error) {
        console.error("Error deleting template:", error)
        toast.error("Failed to delete template")
      }
    }
  }

  const handleExport = () => {
    const exported = JSON.stringify(currentContent, null, 2)
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

    try {
      const imported = JSON.parse(importData)
      onLoadTemplate(imported)
      setImportData("")
      toast.success("Content imported successfully!")
    } catch (error) {
      toast.error("Invalid JSON data")
    }
  }

  return (
    <div className="space-y-6">
      {/* Save as Template */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-blue-500" />
            Save to Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="templateName">Template Name *</Label>
            <Input
              id="templateName"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Luxury Condos Template"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="templateDescription">Description (Optional)</Label>
            <Textarea
              id="templateDescription"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Brief description of this template..."
              rows={2}
              className="mt-1"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isPublic" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked as boolean)} />
            <Label htmlFor="isPublic" className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Make this template public (visible to all users)
            </Label>
          </div>

          <Button
            onClick={handleSaveTemplate}
            disabled={isSaving || !templateName.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
          >
            {isSaving ? (
              <>
                <Cloud className="h-4 w-4 mr-2 animate-pulse" />
                Saving to Supabase...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Saved Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Saved Templates ({templates.length})
            </div>
            <Button variant="outline" size="sm" onClick={loadTemplates} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
              <p className="text-gray-500">Loading templates from Supabase...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates saved yet</p>
              <p className="text-sm">Save your current content as a template to reuse later</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      {template.is_public && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                          <Users className="h-3 w-3 mr-1" />
                          Public
                        </Badge>
                      )}
                      {!template.is_public && (
                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>

                    {template.description && <p className="text-sm text-gray-600 mb-2">{template.description}</p>}

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                      <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadTemplate(template)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Load
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteTemplate(template)}>
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
            <CardTitle className="text-gray-900 flex items-center">
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
            <CardTitle className="text-gray-900 flex items-center">
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
                className="mt-1"
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
