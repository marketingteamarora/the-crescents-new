"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Home,
  CheckCircle,
  Download,
  TrendingUp,
  Users,
  Building,
  Menu,
  Play,
  ArrowRight,
  Star,
  Settings,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { LandingPageContent } from "@/types/content"
import { defaultContent } from "@/lib/default-content"
import { FAQ } from "@/components/faq"
import CognitoForm from "@/components/CognitoForm"
import Script from 'next/script'
import { GradientStyles } from "@/components/gradient-styles"

export default function CrescentsLanding() {
  // Use default content as initial state to avoid null checks
  const [content, setContent] = useState<LandingPageContent>(() => ({
    ...defaultContent,
    hero: { ...defaultContent.hero },
    stats: { ...defaultContent.stats },
    projectSummary: { ...defaultContent.projectSummary },
    lifestyle: { 
      ...defaultContent.lifestyle, 
      features: defaultContent.lifestyle.features ? [...defaultContent.lifestyle.features] : [] 
    },
    projectDetails: { 
      ...defaultContent.projectDetails, 
      features: defaultContent.projectDetails.features ? [...defaultContent.projectDetails.features] : [] 
    },
    investment: { 
      ...defaultContent.investment, 
      plans: defaultContent.investment.plans ? [...defaultContent.investment.plans] : [] 
    },
    cta: { ...defaultContent.cta },
    footer: { ...defaultContent.footer }
  }))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  
  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setIsLoading(true)
    try {
      // Fetch content from our API route
      const response = await fetch('/api/content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 } // Revalidate every 60 seconds
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // Ensure all required properties exist in the response
      const mergedContent = {
        ...defaultContent,
        ...data,
        hero: { ...defaultContent.hero, ...(data.hero || {}) },
        stats: { ...defaultContent.stats, ...(data.stats || {}) },
        projectSummary: { ...defaultContent.projectSummary, ...(data.projectSummary || {}) },
        lifestyle: {
          ...defaultContent.lifestyle,
          ...(data.lifestyle || {}),
          features: data.lifestyle?.features || (defaultContent.lifestyle.features ? [...defaultContent.lifestyle.features] : [])
        },
        projectDetails: {
          ...defaultContent.projectDetails,
          ...(data.projectDetails || {}),
          features: data.projectDetails?.features || (defaultContent.projectDetails.features ? [...defaultContent.projectDetails.features] : [])
        },
        investment: {
          ...defaultContent.investment,
          ...(data.investment || {}),
          plans: data.investment?.plans || (defaultContent.investment.plans ? [...defaultContent.investment.plans] : [])
        },
        cta: { ...defaultContent.cta, ...(data.cta || {}) },
        footer: { ...defaultContent.footer, ...(data.footer || {}) }
      }
      setContent(mergedContent)
    } catch (error) {
      console.error("Error loading content:", error)
      setError("Failed to load content. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-[#231F20] rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold mb-2">Error Loading Content</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={loadContent} variant="outline" className="border-red-300 hover:bg-red-50">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Use default content if no content is loaded yet
  const displayContent = content || defaultContent
  
  // Safely access nested properties with nullish coalescing
  const hero = displayContent.hero || defaultContent.hero
  const stats = displayContent.stats || defaultContent.stats
  const projectSummary = displayContent.projectSummary || defaultContent.projectSummary
  const lifestyle = displayContent.lifestyle || defaultContent.lifestyle
  const projectDetails = displayContent.projectDetails || defaultContent.projectDetails
  const investment = displayContent.investment || defaultContent.investment
  const cta = displayContent.cta || defaultContent.cta
  const footer = displayContent.footer || defaultContent.footer

  // Get the hero image with fallback
  const heroImageSrc =
    hero.heroImage && hero.heroImage !== "/placeholder.svg?height=1080&width=1920"
      ? hero.heroImage
      : "/placeholder.svg?height=1080&width=1920"

  return (
    <div className="min-h-screen bg-white">
      <GradientStyles />
      {/* Modern Header with Logo Colors */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100/50 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {hero.logoUrl ? (
              <Image 
                src={hero.logoUrl} 
                alt="Logo" 
                width={120} 
                height={40} 
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-[#231F20]">{hero.title || 'Welcome'}</h1>
                  <p className="text-xs text-gray-500">{hero.subtitle || 'Loading...'}</p>
                </div>
              </div>
            )}
          </div>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#project-details" className="text-gray-600 hover:text-[#D0AF21] transition-colors font-medium">
              Project Details
            </Link>
            <Link href="#lifestyle" className="text-gray-600 hover:text-[#D0AF21] transition-colors font-medium">
              Investment
            </Link>
            <Link href="#register" className="text-gray-600 hover:text-[#D0AF21] transition-colors font-medium">
              Register
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={scrollToForm}
              className="hidden sm:flex gradient-bg hover:opacity-90 text-white border-0 shadow-lg transition-opacity"
            >
              {content.embeds?.platinumAccess?.buttonText || 'Platinum Access'}
            </Button>
            
            <a 
              href={content.embeds?.bookMeeting?.redirectUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button 
                variant="outline"
                className="border-[#9C182F] text-[#9C182F] hover:bg-[#9C182F]/10 bg-transparent border-2 font-medium"
              >
                {content.embeds?.bookMeeting?.buttonText || 'Connect with Sales Team'}
              </Button>
            </a>
            
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-[#D0AF21] text-[#D0AF21] hover:bg-[#D0AF21]/10 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Proper Loading */}
        <div className="absolute inset-0">
          <Image
            src={heroImageSrc || "/placeholder.svg"}
            alt={`${content?.hero?.title} - Luxury Development`}
            fill
            className={`object-cover transition-all duration-1000 ${imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
            priority
            quality={90}
            onLoad={() => setImageLoaded(true)}
            unoptimized={heroImageSrc.startsWith("data:") || heroImageSrc.includes("placeholder.svg")}
          />

          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#231F20]/90 via-[#231F20]/70 to-[#231F20]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#231F20]/80 via-transparent to-transparent" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-8 w-20 h-20 bg-[#D0AF21]/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 right-12 w-32 h-32 bg-[#9C182F]/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#D0AF21]/10 rounded-full blur-lg animate-pulse delay-500" />

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white max-w-7xl mx-auto px-4 pt-20">
          <div className="mb-8 pt-8 animate-fade-in-up">
            {content.hero.badge && (
              <Badge className="mb-6 gradient-bg text-white border-0 px-8 py-3 text-sm font-medium backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                {content.hero.badge}
              </Badge>
            )}

            <h1 className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-b from-white via-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl">
                {content.hero.title}
              </span>
            </h1>

            {content.hero.subtitle && (
              <p className="text-2xl sm:text-3xl lg:text-4xl mb-8 font-medium">
                <span className="gradient-text drop-shadow-lg">
                  {content.hero.subtitle}
                </span>
              </p>
            )}

            {content.hero.location && (
              <div className="flex items-center justify-center space-x-3 text-xl sm:text-2xl mb-8 animate-fade-in-up delay-300">
                <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center shadow-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="text-[#D0AF21] font-medium drop-shadow-lg">{content.hero.location}</span>
              </div>
            )}
          </div>

          {content.hero.description && (
            <p className="text-lg sm:text-xl lg:text-2xl mb-12 text-gray-100 max-w-5xl mx-auto leading-relaxed drop-shadow-lg animate-fade-in-up delay-500">
              {content.hero.description}
            </p>
          )}

          {/* Form Section */}
          <div ref={formRef} id="platinum-access-form" className="max-w-2xl mx-auto mb-12 animate-fade-in-up delay-700">
            {showForm && (
              <div className="cognito-hero-form">
                <CognitoForm />
              </div>
            )}
            
            <style jsx global>{`
              .cognito-hero-form .cognito-form-frame,
              .cognito-hero-form .cognito,
              .cognito-hero-form .c-forms-form,
              .cognito-hero-form .c-forms-form > div {
                background: transparent !important;
                box-shadow: none !important;
              }
              .cognito-hero-form input,
              .cognito-hero-form textarea,
              .cognito-hero-form select {
                background: rgba(255, 255, 255, 0.2) !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                color: white !important;
                border-radius: 0.5rem !important;
                padding: 0.75rem 1rem !important;
                margin-bottom: 1rem !important;
                width: 100% !important;
              }
              .cognito-hero-form input::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
              }
              .cognito-hero-form label {
                color: white !important;
                margin-bottom: 0.5rem !important;
                display: block !important;
              }
              .cognito-hero-form button[type="submit"] {
                background: linear-gradient(to right, #D0AF21, #9C182F) !important;
                color: white !important;
                border: none !important;
                padding: 1rem 2rem !important;
                border-radius: 0.75rem !important;
                font-weight: 600 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
                transition: all 0.3s ease !important;
                width: 100% !important;
                margin-top: 1rem !important;
                cursor: pointer !important;
              }
              .cognito-hero-form button[type="submit"]:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
              }
            `}</style>
          </div>


        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                {content.stats.homes}
              </div>
              <div className="text-gray-600 font-medium">Premium Homes</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                {content.stats.categories}
              </div>
              <div className="text-gray-600 font-medium">Home Categories</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                {content.stats.experience}
              </div>
              <div className="text-gray-600 font-medium">Years Experience</div>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                {content.stats.moveIn}
              </div>
              <div className="text-gray-600 font-medium">Move-in Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Project Summary */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-[var(--gradient-from)]/10 to-[var(--gradient-to)]/10 text-[var(--gradient-to)] border-0 px-6 py-2 text-sm font-medium">
              Key Details
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231F20] mb-6">Project Summary</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about this exceptional development
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#231F20]">Developer & Location</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    <span className="font-semibold text-[#231F20]">{content.projectSummary.developer}</span>
                  </p>
                  <p>{content.projectSummary.location}</p>
                  <p className="text-sm bg-[#D0AF21]/10 text-[#9C182F] px-3 py-1 rounded-full inline-block">
                    Prime Location
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#231F20]">Project Specifications</h3>
                <div className="space-y-2 text-gray-600">
                  <p>• {content.projectSummary.status}</p>
                  <p>• {content.projectSummary.occupancy}</p>
                  <p>• {content.projectSummary.types}</p>
                  <p>• {content.projectSummary.sizes}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-[var(--gradient-from)]/5 to-[var(--gradient-to)]/5 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#231F20]">Pricing & Benefits</h3>
                <div className="space-y-3">
                  <p className="text-2xl font-bold gradient-text">
                    {content.projectSummary.pricing}
                  </p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• {content.projectSummary.deposit}</p>
                    <p>• {content.projectSummary.vipPricing}</p>
                    <p>• {content.projectSummary.cappedLevies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Lifestyle Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-[#D0AF21]/10 to-[#9C182F]/10 text-[#9C182F] border-0 px-6 py-2">
              Executive Living
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231F20] mb-6 leading-tight">
              {content.lifestyle.title}
              <br />
              <span className="gradient-text">
                {content.lifestyle.subtitle}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">{content.lifestyle.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {content.lifestyle.features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group bg-white"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized={feature.image.startsWith("data:") || feature.image.includes("placeholder.svg")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231F20]/50 to-transparent" />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-[#231F20]">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>


        </div>
      </section>

      {/* Dynamic Project Details Section */}
      <section id="details" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-[#D0AF21]/10 to-[#9C182F]/10 text-[#9C182F] border-0 px-6 py-2">
              Project Information
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231F20] mb-6">Project Details</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive information about The Crescents development
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8 sm:p-12">
                <h3 className="text-2xl font-bold mb-8 text-[#231F20]">Development Overview</h3>
                <div className="space-y-4">
                  {content.projectDetails.developmentOverview.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-[#D0AF21] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8 sm:p-12">
                <h3 className="text-2xl font-bold mb-8 text-[#231F20]">Community Features</h3>
                <div className="space-y-4">
                  {content.projectDetails.communityFeatures.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-[#D0AF21] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Bonuses & Incentives */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-[var(--gradient-from)]/5 to-[var(--gradient-to)]/5">
            <CardContent className="p-8 sm:p-12">
              <h3 className="text-2xl font-bold mb-8 text-center text-[#231F20]">Exclusive Bonuses & Incentives</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {content.projectDetails.bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#231F20] mb-1">{bonus.title}</h4>
                      <p className="text-gray-600 text-sm">{bonus.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dynamic Investment Section */}
      <section id="investment" className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-[#D0AF21]/10 to-[#9C182F]/10 text-[#9C182F] border-0 px-6 py-2">
              Investment Opportunity
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231F20] mb-6">
              {content.investment.title}
              <br />
              <span className="gradient-text">
                {content.investment.subtitle}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{content.investment.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {content.investment.stats.map((item, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#D0AF21] to-[#9C182F] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {index === 0 && <Users className="h-10 w-10 text-white" />}
                    {index === 1 && <TrendingUp className="h-10 w-10 text-white" />}
                    {index === 2 && <Home className="h-10 w-10 text-white" />}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-[#231F20]">{item.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#D0AF21] to-[#9C182F] bg-clip-text text-transparent mb-2">
                    {item.stat}
                  </div>
                  <div className="text-sm text-gray-500">{item.statLabel}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-2xl bg-gradient-to-br from-[var(--gradient-from)]/5 via-[var(--gradient-to)]/5 to-[var(--gradient-from)]/10">
            <CardContent className="p-8 sm:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-[#231F20]">{content.investment.appreciationTitle}</h3>
                  <div className="space-y-4">
                    {content.investment.appreciationPoints.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 gradient-bg rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="text-6xl font-bold gradient-text mb-4">
                    {content.investment.appreciationStat}
                  </div>
                  <div className="text-xl text-[#231F20] mb-4 font-semibold">
                    {content.investment.appreciationLabel}
                  </div>
                  <p className="text-sm text-gray-600 bg-white/70 p-4 rounded-xl">
                    {content.investment.appreciationDescription}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dynamic CTA Section */}
      <section
        id="register"
        className="py-16 sm:py-24 gradient-bg relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {content.cta.title}
                <br />
                <span className="text-yellow-200">{content.cta.subtitle}</span>
              </h2>
              <p className="text-xl text-orange-100 mb-8 leading-relaxed">{content.cta.description}</p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {content.cta.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-yellow-200" />
                    </div>
                    <span className="text-orange-100 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-orange-100 text-lg">{content.cta.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-orange-100 text-lg">{content.cta.email}</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-bold text-[#231F20] mb-4">{content.cta.worksheetTitle}</h3>
                  <p className="text-gray-600 mb-6">{content.cta.worksheetDescription}</p>
                  <a 
                    href={content.embeds?.bookMeeting?.redirectUrl || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#D0AF21] text-[#9C182F] hover:bg-[#D0AF21]/10 bg-white/80 backdrop-blur-sm h-12 px-8 rounded-xl w-full"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      {content.embeds?.bookMeeting?.buttonText || 'Connect with Sales Team'}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {content.faq && <FAQ content={content.faq} />}

      {/* Dynamic Footer */}
      <footer className="bg-[#231F20] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center mb-6">
                <Home className="h-5 w-5 text-white" />
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">{content.footer.description}</p>
              <p className="text-sm text-[#D0AF21] font-medium">{content.footer.pricing}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                {content.footer.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="hover:text-white transition-colors hover:text-[#D0AF21]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Developer</h4>
              <ul className="space-y-3 text-gray-400">
                {content.footer.developerLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="hover:text-white transition-colors hover:text-[#D0AF21]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Contact</h4>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#D0AF21]" />
                  <span>{content.footer.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#D0AF21]" />
                  <span>{content.footer.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-[#D0AF21] mt-1" />
                  <div>
                    <div>{content.footer.address}</div>
                    <div>{content.footer.city}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {content.footer.copyright}
            </p>
            <p className="text-sm mt-2">{content.footer.disclaimer}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Add CSS animations
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-500 {
  animation-delay: 0.5s;
}

.delay-700 {
  animation-delay: 0.7s;
}

.delay-1000 {
  animation-delay: 1s;
}
`

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}
