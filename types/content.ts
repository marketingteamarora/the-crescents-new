export interface HeroContent {
  badge: string
  title: string
  subtitle: string
  location: string
  description: string
  heroImage: string
  logoUrl?: string
}

export interface StatsContent {
  homes: string
  categories: string
  experience: string
  moveIn: string
}

export interface ProjectSummaryContent {
  developer: string
  location: string
  status: string
  occupancy: string
  types: string
  sizes: string
  pricing: string
  deposit: string
  vipPricing: string
  cappedLevies: string
}

export interface LifestyleContent {
  title: string
  subtitle: string
  description: string
  features: Array<{
    title: string
    description: string
    image: string
  }>
}

export interface FloorPlan {
  width: string
  size: string
  popular: boolean
  image: string
}

export interface Bonus {
  title: string
  description: string
}

export interface ProjectDetailsContent {
  developmentOverview: string[]
  communityFeatures: string[]
  floorPlans: FloorPlan[]
  bonuses: Bonus[]
  // Features for project details section
  features?: Array<{
    title: string
    description: string
    icon: string
  }>
}

export interface InvestmentPlan {
  name: string
  price: string
  features: string[]
  ctaText: string
  popular?: boolean
}

export interface InvestmentContent {
  title: string
  subtitle: string
  description: string
  stats: Array<{
    title: string
    description: string
    stat: string
    statLabel: string
  }>
  appreciationTitle: string
  appreciationPoints: string[]
  appreciationStat: string
  appreciationLabel: string
  appreciationDescription: string
  // Investment plans for the investment section
  plans?: InvestmentPlan[]
}

export interface CTAContent {
  title: string
  subtitle: string
  description: string
  benefits: string[]
  phone: string
  email: string
  worksheetTitle: string
  worksheetDescription: string
}

export interface FooterContent {
  description: string
  pricing: string
  quickLinks: Array<{ href: string; label: string }>
  developerLinks: Array<{ href: string; label: string }>
  phone: string
  email: string
  address: string
  city: string
  copyright: string
  disclaimer: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQContent {
  title: string
  subtitle: string
  faqs: FAQItem[]
}

export type EmbedType = 'seamless' | 'iframe' | 'amp' | 'custom'

export interface EmbedConfig {
  buttonText: string
  redirectUrl: string
  seamlessCode: string
  iframeCode: string
  ampCode: string
  customCode: string
  activeType: EmbedType
}

export interface EmbedsConfig {
  platinumAccess: EmbedConfig
  bookMeeting: EmbedConfig
}

export interface LandingPageContent {
  hero: HeroContent
  stats: StatsContent
  projectSummary: ProjectSummaryContent
  lifestyle: LifestyleContent
  projectDetails: ProjectDetailsContent
  investment: InvestmentContent
  cta: CTAContent
  footer: FooterContent
  faq?: FAQContent
  embeds?: EmbedsConfig
}
