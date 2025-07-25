"use client"

export class ImageHandler {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private static readonly ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]

  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: "Please upload a valid image file (JPEG, PNG, WebP, GIF, or SVG)" }
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: "File size must be less than 10MB" }
    }

    return { valid: true }
  }

  static async processImage(
    file: File,
    options?: {
      maxWidth?: number
      maxHeight?: number
      quality?: number
      format?: string
    },
  ): Promise<{ success: boolean; data?: string; error?: string }> {
    try {
      const validation = this.validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      const { maxWidth = 1920, maxHeight = 1080, quality = 0.9, format = "image/jpeg" } = options || {}

      // Handle SVG files differently
      if (file.type === "image/svg+xml") {
        const reader = new FileReader()
        return new Promise((resolve) => {
          reader.onload = (e) => {
            resolve({ success: true, data: e.target?.result as string })
          }
          reader.onerror = () => {
            resolve({ success: false, error: "Failed to read SVG file" })
          }
          reader.readAsDataURL(file)
        })
      }

      // Create a canvas to resize/optimize the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      return new Promise((resolve) => {
        img.onload = () => {
          // Calculate optimal dimensions
          let { width, height } = img

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          canvas.width = width
          canvas.height = height

          // Apply image smoothing for better quality
          if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            ctx.drawImage(img, 0, 0, width, height)
          }

          // Convert to base64 with quality optimization
          const finalQuality = file.size > 2 * 1024 * 1024 ? Math.min(quality, 0.8) : quality
          const dataUrl = canvas.toDataURL(format, finalQuality)

          resolve({ success: true, data: dataUrl })
        }

        img.onerror = () => {
          resolve({ success: false, error: "Failed to process image" })
        }

        img.crossOrigin = "anonymous"
        img.src = URL.createObjectURL(file)
      })
    } catch (error) {
      return { success: false, error: "Failed to process image" }
    }
  }

  static async validateUrl(url: string): Promise<{ valid: boolean; error?: string }> {
    try {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return { valid: false, error: "Please enter a valid URL starting with http:// or https://" }
      }

      // Test if the URL is accessible and is an image
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = "anonymous"

        const timeout = setTimeout(() => {
          resolve({ valid: false, error: "URL validation timeout - please check if the image is accessible" })
        }, 8000)

        img.onload = () => {
          clearTimeout(timeout)
          resolve({ valid: true })
        }

        img.onerror = () => {
          clearTimeout(timeout)
          resolve({ valid: false, error: "Unable to load image from this URL - please check if it's a valid image" })
        }

        img.src = url
      })
    } catch (error) {
      return { valid: false, error: "Invalid URL format" }
    }
  }

  static getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }
      img.crossOrigin = "anonymous"
      img.src = src
    })
  }

  static generatePlaceholder(width: number, height: number, text?: string): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    if (ctx) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#f8fafc")
      gradient.addColorStop(0.5, "#e2e8f0")
      gradient.addColorStop(1, "#cbd5e1")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add border
      ctx.strokeStyle = "#94a3b8"
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, width - 2, height - 2)

      // Add icon
      const iconSize = Math.min(width, height) / 8
      ctx.fillStyle = "#64748b"
      ctx.font = `${iconSize}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("🖼️", width / 2, height / 2 - iconSize / 2)

      // Add text
      ctx.fillStyle = "#475569"
      ctx.font = `${Math.min(width, height) / 20}px Arial`
      const displayText = text || `${width} × ${height}`
      ctx.fillText(displayText, width / 2, height / 2 + iconSize / 2)
    }

    return canvas.toDataURL()
  }

  static async compressImage(
    file: File,
    targetSizeKB: number,
  ): Promise<{ success: boolean; data?: string; error?: string }> {
    let quality = 0.9
    let result = await this.processImage(file, { quality })

    if (!result.success || !result.data) {
      return result
    }

    // Estimate current size
    let currentSizeKB = Math.round((result.data.length * 3) / 4 / 1024)

    // Reduce quality until we reach target size
    while (currentSizeKB > targetSizeKB && quality > 0.1) {
      quality -= 0.1
      result = await this.processImage(file, { quality })
      if (!result.success || !result.data) break
      currentSizeKB = Math.round((result.data.length * 3) / 4 / 1024)
    }

    return result
  }

  static getImageFormat(dataUrl: string): string {
    if (dataUrl.startsWith("data:image/png")) return "PNG"
    if (dataUrl.startsWith("data:image/jpeg")) return "JPEG"
    if (dataUrl.startsWith("data:image/webp")) return "WebP"
    if (dataUrl.startsWith("data:image/gif")) return "GIF"
    if (dataUrl.startsWith("data:image/svg")) return "SVG"
    return "Unknown"
  }
}
