import type { LandingPageContent } from "@/types/content"

export const defaultContent: LandingPageContent = {
  hero: {
    badge: "Pre-Construction • Starting from $1M",
    title: "The Crescents",
    subtitle: "An Enclave Community",
    location: "Kennedy & Mayfield Road, Brampton",
    description:
      "Executive living redefined with freehold townhomes and single-family homes in the ultimate expression of opulent residential living.",
    heroImage: "/placeholder.svg?height=1080&width=1920",
    logoUrl: "/logo.svg",
  },
  stats: {
    homes: "248",
    categories: "4",
    experience: "30+",
    moveIn: "2025",
  },
  projectSummary: {
    developer: "Fieldgate Homes",
    location: "Kennedy & Mayfield Road, Brampton",
    status: "Pre-construction development",
    occupancy: "Occupancy anticipated 2025",
    types: "Freehold townhomes & single-family",
    sizes: "1,744 - 4,154 sq ft",
    pricing: "From $1M",
    deposit: "Flexible extended deposit",
    vipPricing: "Platinum VIP pricing",
    cappedLevies: "Capped development levies",
  },
  lifestyle: {
    title: "The Ultimate Expression of",
    subtitle: "Opulent Residential Living",
    description:
      "Discover a lifestyle where luxury meets convenience. Nestled near Conservation Drive Park and Heart Lake Conservation Park.",
    features: [
      {
        title: "Natural Beauty",
        description:
          "Minutes from Conservation Drive Park and Heart Lake Conservation Park. Enjoy hiking trails, waterfront activities, and pristine green spaces.",
        image: "/placeholder.svg?height=256&width=400",
      },
      {
        title: "Connected Living",
        description:
          "Exceptional transit access connects you to downtown Toronto and beyond. Urban amenities, shopping, and dining are all within reach.",
        image: "/placeholder.svg?height=256&width=400",
      },
      {
        title: "Family Excellence",
        description:
          "Top-rated schools and family-friendly amenities create the perfect environment for raising children in luxury and comfort.",
        image: "/placeholder.svg?height=256&width=400",
      },
    ],
  },
  projectDetails: {
    developmentOverview: [
      "Master-planned community by Fieldgate Homes",
      "Premium location at Kennedy & Mayfield Road",
      "Freehold townhomes and single-family homes",
      "Modern architectural design",
      "Energy-efficient construction",
      "Smart home pre-wiring",
    ],
    communityFeatures: [
      "Private parks and green spaces",
      "Walking trails and pathways",
      "Children's playground areas",
      "Community center facilities",
      "Professional landscaping",
      "24/7 security monitoring",
    ],
    floorPlans: [
      { width: "30'", size: "1,744 - 2,100 sq ft", popular: false, image: "/placeholder.svg?height=192&width=300" },
      { width: "38'", size: "2,200 - 2,800 sq ft", popular: true, image: "/placeholder.svg?height=192&width=300" },
      { width: "45'", size: "3,000 - 3,500 sq ft", popular: false, image: "/placeholder.svg?height=192&width=300" },
      { width: "50'", size: "3,600 - 4,154 sq ft", popular: false, image: "/placeholder.svg?height=192&width=300" },
    ],
    bonuses: [
      { title: "Platinum VIP Pricing", description: "Exclusive pricing available only to registered VIP members" },
      { title: "Extended Deposit Terms", description: "Flexible payment schedule with extended deposit periods" },
      { title: "Capped Development Levies", description: "Protection against rising development costs" },
      { title: "Premium Upgrade Credits", description: "Up to $25,000 in upgrade credits for finishes and features" },
      { title: "Assignment Rights", description: "Flexible assignment options before closing" },
      { title: "Priority Selection", description: "First access to the best lots and floor plans" },
    ],
  },
  investment: {
    title: "Why The Crescents is a",
    subtitle: "Great Investment",
    description:
      "Brampton's growing population, strong economy, and family-friendly environment create perfect conditions for long-term appreciation.",
    stats: [
      {
        title: "Growing Population",
        description:
          "Brampton is one of Canada's fastest-growing cities, with population expected to reach 1 million by 2031.",
        stat: "+15%",
        statLabel: "Population growth (5 years)",
      },
      {
        title: "Strong Economy",
        description: "Major employment hubs and business districts drive economic growth and housing demand.",
        stat: "$85K",
        statLabel: "Average household income",
      },
      {
        title: "Family-Friendly",
        description: "Top-rated schools, parks, and community amenities make this ideal for families.",
        stat: "9.2/10",
        statLabel: "Livability score",
      },
    ],
    appreciationTitle: "Future Appreciation Potential",
    appreciationPoints: [
      "Limited supply of freehold homes in prime locations",
      "Proximity to major transit and employment centers",
      "Master-planned community with premium amenities",
      "Fieldgate Homes' proven track record of quality",
    ],
    appreciationStat: "12-15%",
    appreciationLabel: "Expected Annual Appreciation",
    appreciationDescription: "Based on historical data and market projections for premium Brampton communities",
  },
  cta: {
    title: "Sign Up for",
    subtitle: "Platinum Access!",
    description:
      "Join our exclusive VIP list to receive priority access to floor plans, pricing, and special incentives.",
    benefits: [
      "Exclusive VIP pricing and incentives",
      "Priority selection of lots and floor plans",
      "Extended deposit terms and capped levies",
      "First access to new releases and updates",
    ],
    phone: "(905) 555-0123",
    email: "info@thecrescents.ca",
    worksheetTitle: "Ready to Submit a Worksheet?",
    worksheetDescription: "Take the next step and secure your unit with our sales team.",
  },
  footer: {
    description: "An Enclave Community at Kennedy & Mayfield Road, Brampton. Executive living redefined.",
    pricing: "Starting from $1M • Occupancy 2025",
    quickLinks: [
      { href: "#details", label: "Project Details" },
      { href: "#floorplans", label: "Floor Plans" },
      { href: "#investment", label: "Investment" },
      { href: "#register", label: "Register" },
    ],
    developerLinks: [
      { href: "#", label: "Fieldgate Homes" },
      { href: "#", label: "About Us" },
      { href: "#", label: "Other Projects" },
      { href: "#", label: "Contact" },
    ],
    phone: "(905) 555-0123",
    email: "info@thecrescents.ca",
    address: "Kennedy & Mayfield Road",
    city: "Brampton, ON",
    copyright: "The Crescents by Fieldgate Homes. All rights reserved.",
    disclaimer: "This is not an offering for sale. Any such offering can only be made by way of disclosure statement.",
  },
  faq: {
    title: "Frequently Asked",
    subtitle: "Questions",
    faqs: [
      {
        question: "What is the expected occupancy date?",
        answer: "Occupancy is anticipated for 2025, subject to construction progress and municipal approvals."
      },
      {
        question: "What types of homes are available?",
        answer: "The Crescents offers a selection of freehold townhomes and single-family homes ranging from 1,744 to 4,154 square feet."
      },
      {
        question: "What is the price range?",
        answer: "Homes start from $1M, with various models and sizes available to suit different needs and preferences."
      },
      {
        question: "Are there any deposit incentives?",
        answer: "Yes, we offer flexible extended deposit structures. Please contact our sales team for specific details."
      },
      {
        question: "What amenities will be available?",
        answer: "Residents will enjoy access to premium amenities including a clubhouse, fitness center, and beautifully landscaped outdoor spaces."
      },
      {
        question: "Where is The Crescents located?",
        answer: "The community is ideally situated at the corner of Kennedy & Mayfield Road in Brampton, offering a perfect balance of natural surroundings and urban convenience."
      }
    ]
  },
  embeds: {
    platinumAccess: {
      buttonText: 'Platinum Access',
      seamlessCode: '<div class="cognito-form"><script src="https://www.cognitoforms.com/f/Nq5wdJaqaEa9-yGGbQnXYg/407"></script></div>',
      iframeCode: '<iframe src="https://www.cognitoforms.com/f/Nq5wdJaqaEa9-yGGbQnXYg/407" style="border:0;width:100%;min-height:600px;"></iframe>',
      ampCode: '<amp-iframe width="600" height="600" layout="responsive" sandbox="allow-scripts allow-same-origin allow-popups" frameborder="0" src="https://www.cognitoforms.com/f/Nq5wdJaqaEa9-yGGbQnXYg/407"></amp-iframe>',
      customCode: '<!-- Add your custom HTML/JS here -->',
      activeType: 'seamless'
    },
    bookMeeting: {
      buttonText: 'Connect with Sales Team',
      redirectUrl: 'https://calendly.com/your-username/30min',
      seamlessCode: '<div class="calendly-inline-widget" data-url="https://calendly.com/your-username/30min" style="min-width:320px;height:630px;"></div><script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>',
      iframeCode: '<iframe src="https://calendly.com/your-username/30min" width="100%" height="630" frameborder="0"></iframe>',
      ampCode: '<amp-iframe width="600" height="630" layout="responsive" sandbox="allow-scripts allow-same-origin allow-popups" frameborder="0" src="https://calendly.com/your-username/30min"></amp-iframe>',
      customCode: '<!-- Add your custom booking form HTML/JS here -->',
      activeType: 'seamless'
    }
  },
}
