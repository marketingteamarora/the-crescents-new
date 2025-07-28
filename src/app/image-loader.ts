// This is a custom image loader for static exports
// It simply returns the src as-is since we're using unoptimized images
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  return `${src}?w=${width}&q=${quality || 75}`
}
