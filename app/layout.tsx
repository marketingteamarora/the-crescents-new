import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ContentProvider } from "@/lib/content-context"
import { Toaster } from "sonner"
import { ThemeInitializer } from "@/components/theme-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://the-crescents.vercel.app'),
  title: {
    default: "The Crescents | Luxury Freehold Townhomes & Singles in Brampton",
    template: `%s | The Crescents`,
  },
  description: "Discover The Crescents, an exclusive enclave of luxury freehold townhomes and single-family homes at Kennedy & Mayfield in Brampton. Experience opulent living with premium features and exceptional connectivity.",
  keywords: ["The Crescents", "luxury homes Brampton", "freehold townhomes", "single-family homes", "Kennedy and Mayfield", "Fieldgate Homes", "pre-construction homes", "new homes Brampton"],
  authors: [{ name: "Fieldgate Homes", url: "https://fieldgatehomes.com" }],
  creator: "Fieldgate Homes",
  publisher: "Fieldgate Homes",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://the-crescents.vercel.app",
    title: "The Crescents | Luxury Freehold Townhomes & Singles in Brampton",
    description: "Discover The Crescents, an exclusive enclave of luxury freehold townhomes and single-family homes at Kennedy & Mayfield in Brampton. Experience opulent living with premium features and exceptional connectivity.",
    images: [
      {
        url: "/placeholder.jpg",
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
    images: ["/placeholder.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "https://the-crescents.vercel.app",
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
