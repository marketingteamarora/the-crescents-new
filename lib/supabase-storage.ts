"use client"

import { supabase } from "./supabase"
import type { LandingPageContent } from "@/types/content"
import type { LandingPageContentRow, ContentTemplateRow, UploadedImageRow } from "./supabase"

export class SupabaseStorage {
  // Content Management
  async saveContent(content: LandingPageContent): Promise<any> {
    try {
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be authenticated to save content");
      }

      // Call the database function to handle the save operation
      const { data, error } = await supabase.rpc('save_landing_page_content_api', {
        content_data: content,
        user_uuid: user.id
      });

      if (error) {
        console.error('Database error during save:', error);
        throw new Error(`Failed to save content: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error in saveContent:", error);
      throw error;
    }
  }

  async loadContent(): Promise<LandingPageContent | null> {
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No data found
          return null
        }
        console.error("Error loading content:", error)
        throw error
      }

      return data.content as LandingPageContent
    } catch (error) {
      console.error("Error loading content:", error)
      throw error
    }
  }

  static async loadActiveContent(): Promise<{ success: boolean; data?: LandingPageContent; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned"
        console.error("Error loading content:", error)
        return { success: false, error: error.message }
      }

      if (!data) {
        return { success: true, data: undefined }
      }

      return { success: true, data: data.content as LandingPageContent }
    } catch (error) {
      console.error("Error loading content:", error)
      return { success: false, error: "Failed to load content" }
    }
  }

  static async getContentHistory(): Promise<{ success: boolean; data?: LandingPageContentRow[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("landing_page_content")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error loading content history:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error loading content history:", error)
      return { success: false, error: "Failed to load content history" }
    }
  }

  // Template Management
  static async saveTemplate(
    name: string,
    content: LandingPageContent,
    description?: string,
    isPublic = false,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("content_templates")
        .insert({
          name,
          description,
          content,
          is_public: isPublic,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving template:", error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Error saving template:", error)
      return { success: false, error: "Failed to save template" }
    }
  }

  static async loadTemplates(): Promise<{ success: boolean; data?: ContentTemplateRow[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("content_templates")
        .select("*")
        .order("updated_at", { ascending: false })

      if (error) {
        console.error("Error loading templates:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error loading templates:", error)
      return { success: false, error: "Failed to load templates" }
    }
  }

  static async deleteTemplate(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from("content_templates").delete().eq("id", id)

      if (error) {
        console.error("Error deleting template:", error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Error deleting template:", error)
      return { success: false, error: "Failed to delete template" }
    }
  }

  // Image Management
  async uploadImage(file: File, category = "general"): Promise<string> {
    try {
      // Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("You must be authenticated to upload images")
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage.from("landing-page-images").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        throw error
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("landing-page-images").getPublicUrl(data.path)

      return publicUrl
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      // Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("You must be authenticated to delete images")
      }

      // Extract the file path from the URL
      const urlParts = url.split("/")
      const fileName = urlParts[urlParts.length - 1]
      const category = urlParts[urlParts.length - 2]
      const filePath = `${category}/${fileName}`

      const { error } = await supabase.storage.from("landing-page-images").remove([filePath])

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      throw error
    }
  }

  static async getImages(category?: string): Promise<{ success: boolean; data?: UploadedImageRow[]; error?: string }> {
    try {
      let query = supabase.from("uploaded_images").select("*").order("created_at", { ascending: false })

      if (category) {
        query = query.eq("category", category)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error loading images:", error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error("Error loading images:", error)
      return { success: false, error: "Failed to load images" }
    }
  }

  // Helper function to get image dimensions
  private static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => {
        resolve({ width: 0, height: 0 })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // Real-time subscriptions
  static subscribeToContentChanges(callback: (payload: any) => void) {
    return supabase
      .channel("landing_page_content_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "landing_page_content",
          filter: "is_active=eq.true",
        },
        callback,
      )
      .subscribe()
  }

  static subscribeToTemplateChanges(callback: (payload: any) => void) {
    return supabase
      .channel("content_templates_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content_templates",
        },
        callback,
      )
      .subscribe()
  }
}

export const storage = new SupabaseStorage()
