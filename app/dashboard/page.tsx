"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AuthForm } from "@/components/auth/auth-form"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { HeroEditor } from "@/components/dashboard/hero-editor"
import { ProjectEditor } from "@/components/dashboard/project-editor"
import { LifestyleEditor } from "@/components/dashboard/lifestyle-editor"
import { DetailsEditor } from "@/components/dashboard/details-editor"
import { InvestmentEditor } from "@/components/dashboard/investment-editor"
import { CTAEditor } from "@/components/dashboard/cta-editor"
import { FooterEditor } from "@/components/dashboard/footer-editor"
import { TemplateManager } from "@/components/dashboard/template-manager"
import { LivePreview } from "@/components/dashboard/live-preview"
import { ContentProvider, useContent } from "@/lib/content-context"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { User } from "@supabase/supabase-js"

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setAuthLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#231F20] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <DashboardLayout />
}

export default function Dashboard() {
  return (
    <ContentProvider>
      <DashboardContent />
    </ContentProvider>
  )
}
