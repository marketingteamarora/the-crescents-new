import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

type EmbedType = 'seamless' | 'iframe' | 'amp' | 'custom'

type EmbedConfig = {
  buttonText: string
  redirectUrl: string
  seamlessCode: string
  iframeCode: string
  ampCode: string
  customCode: string
  activeType: EmbedType
}

type EmbedManagerProps = {
  config: {
    platinumAccess: EmbedConfig
    bookMeeting: EmbedConfig
  }
  onChange: (config: {
    platinumAccess: EmbedConfig
    bookMeeting: EmbedConfig
  }) => void
}

export function EmbedManager({ config, onChange }: EmbedManagerProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'platinum' | 'meeting'>('platinum')
  const [activeType, setActiveType] = useState<EmbedType>('seamless')
  const isMeetingTab = activeTab === 'meeting'

  const currentConfig = activeTab === 'platinum' ? config.platinumAccess : config.bookMeeting
  const buttonLabel = activeTab === 'platinum' ? 'Platinum Access' : 'Connect with Sales Team'

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
    toast({
      title: "Copied to clipboard",
      description: `The ${type} code has been copied to your clipboard.`,
    })
  }

  const handleChange = (field: keyof EmbedConfig, value: string) => {
    const newConfig = { ...config }
    if (activeTab === 'platinum') {
      newConfig.platinumAccess = { ...newConfig.platinumAccess, [field]: value }
    } else {
      newConfig.bookMeeting = { ...newConfig.bookMeeting, [field]: value }
    }
    onChange(newConfig)
  }

  const renderCodePreview = () => {
    switch (activeType) {
      case 'seamless':
        return currentConfig.seamlessCode
      case 'iframe':
        return currentConfig.iframeCode
      case 'amp':
        return currentConfig.ampCode
      case 'custom':
        return currentConfig.customCode
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b">
        <Button
          variant="ghost"
          className={`${activeTab === 'platinum' ? 'border-b-2 border-primary' : ''} rounded-none`}
          onClick={() => setActiveTab('platinum')}
        >
          Platinum Access
        </Button>
        <Button
          variant="ghost"
          className={`${activeTab === 'meeting' ? 'border-b-2 border-primary' : ''} rounded-none`}
          onClick={() => setActiveTab('meeting')}
        >
          Connect with Sales Team
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={currentConfig.buttonText}
            onChange={(e) => handleChange('buttonText', e.target.value)}
            placeholder={isMeetingTab ? 'Connect with Sales Team' : 'Platinum Access'}
          />
        </div>

        {isMeetingTab ? (
          <div className="space-y-2">
            <Label htmlFor="redirectUrl">Meeting URL</Label>
            <Input
              id="redirectUrl"
              type="url"
              value={currentConfig.redirectUrl || ''}
              onChange={(e) => handleChange('redirectUrl', e.target.value)}
              placeholder="https://calendly.com/your-link"
            />
            <p className="text-sm text-muted-foreground">
              Enter the full URL where the button should redirect (e.g., Calendly, Zoom, etc.)
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Embed Type</Label>
              <div className="flex space-x-2">
                {['seamless', 'iframe', 'amp', 'custom'].map((type) => (
                  <Button
                    key={type}
                    variant={currentConfig.activeType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setActiveType(type as EmbedType)
                      handleChange('activeType', type)
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Textarea
              value={currentConfig[`${currentConfig.activeType}Code` as keyof Omit<EmbedConfig, 'buttonText' | 'activeType' | 'redirectUrl'>] as string}
              onChange={(e) => handleChange(`${currentConfig.activeType}Code` as keyof EmbedConfig, e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              placeholder={`Paste your ${currentConfig.activeType} code here...`}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(
                  currentConfig[`${currentConfig.activeType}Code` as keyof Omit<EmbedConfig, 'buttonText' | 'activeType' | 'redirectUrl'>] as string,
                  `${currentConfig.activeType} code`
                )}
              >
                {copied === currentConfig.activeType ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied === currentConfig.activeType ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
