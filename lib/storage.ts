"use client"

import type { LandingPageContent } from "@/types/content"

export class ContentStorage {
  private static STORAGE_KEY = "landing-page-content"
  private static TEMPLATES_KEY = "landing-page-templates"

  static save(content: LandingPageContent, templateName?: string): boolean {
    try {
      if (templateName) {
        // Save as template
        const templates = this.getTemplates()
        templates[templateName] = {
          ...content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates))
      } else {
        // Save current content
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(content))
      }
      return true
    } catch (error) {
      console.error("Error saving content:", error)
      return false
    }
  }

  static load(): LandingPageContent | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.error("Error loading content:", error)
      return null
    }
  }

  static getTemplates(): Record<string, LandingPageContent & { createdAt: string; updatedAt: string }> {
    try {
      const templates = localStorage.getItem(this.TEMPLATES_KEY)
      return templates ? JSON.parse(templates) : {}
    } catch (error) {
      console.error("Error loading templates:", error)
      return {}
    }
  }

  static loadTemplate(templateName: string): LandingPageContent | null {
    try {
      const templates = this.getTemplates()
      return templates[templateName] || null
    } catch (error) {
      console.error("Error loading template:", error)
      return null
    }
  }

  static deleteTemplate(templateName: string): boolean {
    try {
      const templates = this.getTemplates()
      delete templates[templateName]
      localStorage.setItem(this.TEMPLATES_KEY, JSON.stringify(templates))
      return true
    } catch (error) {
      console.error("Error deleting template:", error)
      return false
    }
  }

  static exportContent(content: LandingPageContent): string {
    return JSON.stringify(content, null, 2)
  }

  static importContent(jsonString: string): LandingPageContent | null {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.error("Error importing content:", error)
      return null
    }
  }
}
