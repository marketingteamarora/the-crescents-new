import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ContentProvider } from "@/lib/content-context"
import { Toaster } from "sonner"
import { ThemeInitializer } from "@/components/theme-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'), // IMPORTANT: Replace with your actual domain
  title: {
    default: "The Crescents | Luxury Freehold Townhomes & Singles in Brampton",
    template: `%s | The Crescents`,
  },
  description: "Discover The Crescents, an exclusive enclave of luxury freehold townhomes and single-family homes at Kennedy & Mayfield in Brampton. Experience opulent living with premium features and exceptional connectivity.",
  keywords: ["The Crescents", "luxury homes Brampton", "freehold townhomes", "single-family homes", "Kennedy and Mayfield", "Fieldgate Homes", "pre-construction homes", "new homes Brampton"],
  authors: [{ name: "Fieldgate Homes", url: "https://fieldgatehomes.com" }], // Replace with actual developer URL
  creator: "Your Name or Company", // Replace with your name or company
  publisher: "Your Name or Company", // Replace with your name or company
  generator: 'v0.dev',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com", // IMPORTANT: Replace with your actual domain
    title: "The Crescents | Luxury Freehold Townhomes & Singles in Brampton",
    description: "Discover The Crescents, an exclusive enclave of luxury freehold townhomes and single-family homes at Kennedy & Mayfield in Brampton. Experience opulent living with premium features and exceptional connectivity.",
    images: [
      {
        url: "/og-image.jpg", // IMPORTANT: Replace with your Open Graph image URL
        width: 1200,
        height: 630,
        alt: "The Crescents Luxury Homes in Brampton",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Crescents | Luxury Freehold Townhomes & Singles in Brampton",
    description: "Discover The Crescents, an exclusive enclave of luxury freehold townhomes and single-family homes at Kennedy & Mayfield in Brampton. Experience opulent living with premium features and exceptional connectivity.",
    images: ["/twitter-image.jpg"], // IMPORTANT: Replace with your Twitter image URL
    creator: "@yourtwitterhandle", // IMPORTANT: Replace with your Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://your-domain.com", // IMPORTANT: Replace with your actual domain
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeInitializer />
        <ContentProvider>
          {children}
        </ContentProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
