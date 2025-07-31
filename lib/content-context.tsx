"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { supabase } from "./supabase"
import { storage } from "./supabase-storage"
import { defaultContent } from "./default-content"
import type { LandingPageContent } from "@/types/content"

interface SaveResult {
  success: boolean;
  message: string;
}

interface ContentContextType {
  content: LandingPageContent
  setContent: (content: LandingPageContent) => void
  saveContent: () => Promise<SaveResult>
  loading: boolean
  hasChanges: boolean
  lastSaved: Date | null
  autoSave: boolean
  setAutoSave: (enabled: boolean) => void
  isSaving: boolean
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<LandingPageContent>(defaultContent)
  const [originalContent, setOriginalContent] = useState<LandingPageContent>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSave, setAutoSave] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if content has changes
  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent)

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (!autoSave || !hasChanges || loading) {
      return
    }

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save (2 seconds after last change)
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveContent()
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, 2000)

    // Cleanup timeout on unmount
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [content, autoSave, hasChanges, loading])

  useEffect(() => {
    loadContent()

    // Set up real-time subscription for content changes
    const subscription = supabase
      .channel("landing_page_content_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "landing_page_content",
          filter: "is_active=eq.true",
        },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            if (payload.new.is_active) {
              loadContent() // Reload content when changes are detected
            }
          }
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadContent = async () => {
    setLoading(true)
    try {
      const loadedContent = await storage.loadContent()
      // If no content is found in the database, use the default content
      const contentToUse = loadedContent || defaultContent
      setContent(contentToUse)
      setOriginalContent(contentToUse)
    } catch (error) {
      console.error("Error loading content:", error)
      // Fall back to default content if there's an error
      setContent(defaultContent)
      setOriginalContent(defaultContent)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    if (isSaving) {
      console.log('Save already in progress');
      return { success: false, message: 'Save already in progress' };
    }
    
    setIsSaving(true);
    
    try {
      const result = await storage.saveContent(content);
      
      if (result && result.success) {
        setOriginalContent(content);
        setLastSaved(new Date());
        return { success: true, message: 'Content saved successfully' };
      } else {
        const errorMessage = result?.message || 'Failed to save content';
        console.error('Save error:', errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Error saving content:", error);
      return { success: false, message: errorMessage };
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ContentContext.Provider
      value={{
        content,
        setContent,
        saveContent,
        loading,
        hasChanges,
        lastSaved,
        autoSave,
        setAutoSave,
        isSaving,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider")
  }
  return context
}
