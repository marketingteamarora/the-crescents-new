"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, ExternalLink } from "lucide-react"

interface LivePreviewProps {
  content?: any
  onRefresh?: () => void
}

export function LivePreview({ content, onRefresh }: LivePreviewProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setLastRefresh(new Date())

    if (iframeRef.current) {
      // Add timestamp to force refresh
      const timestamp = new Date().getTime()
      const currentSrc = iframeRef.current.src.split("?")[0]
      iframeRef.current.src = `${currentSrc}?preview=true&t=${timestamp}`
    }

    if (onRefresh) {
      onRefresh()
    }

    // Reset refreshing state after a short delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Auto-refresh when content changes
  useEffect(() => {
    if (content) {
      handleRefresh()
    }
  }, [content])

  const openInNewTab = () => {
    const timestamp = new Date().getTime()
    window.open(`/?preview=true&t=${timestamp}`, "_blank")
  }

  return (
    <div className="col-span-2">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Live Preview</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Last updated: {lastRefresh.toLocaleTimeString()}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button variant="outline" size="sm" onClick={openInNewTab} className="h-8 bg-transparent">
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-[800px] border rounded-lg overflow-hidden bg-gray-100">
            {isRefreshing && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm text-gray-600">Updating preview...</span>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`/?preview=true&t=${lastRefresh.getTime()}`}
              className="w-full h-full border-0"
              title="Live Preview"
              onLoad={() => setIsRefreshing(false)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
