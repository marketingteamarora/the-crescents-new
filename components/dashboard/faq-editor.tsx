"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { FAQContent, FAQItem } from "@/types/content"

interface FAQEditorProps {
  content?: FAQContent
  onChange: (content: FAQContent) => void
}

export function FAQEditor({ content, onChange }: FAQEditorProps) {
  const safeContent = content || { title: "", subtitle: "", faqs: [] }

  const updateField = (field: keyof FAQContent, value: any) => {
    onChange({ ...safeContent, [field]: value })
  }

  const handleFAQChange = (index: number, field: keyof FAQItem, value: string) => {
    const newFAQs = [...safeContent.faqs]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    updateField("faqs", newFAQs)
  }

  const addFAQ = () => {
    updateField("faqs", [...safeContent.faqs, { question: "", answer: "" }])
  }

  const removeFAQ = (index: number) => {
    const newFAQs = safeContent.faqs.filter((_, i) => i !== index)
    updateField("faqs", newFAQs)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#231F20]">FAQ Section Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="faq-title">Title</Label>
          <Input
            id="faq-title"
            value={safeContent.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Frequently Asked Questions"
          />
        </div>
        <div>
          <Label htmlFor="faq-subtitle">Subtitle</Label>
          <Textarea
            id="faq-subtitle"
            value={safeContent.subtitle}
            onChange={(e) => updateField("subtitle", e.target.value)}
            placeholder="Find answers to common questions..."
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Questions & Answers</h3>
          {safeContent.faqs.map((faq, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                onClick={() => removeFAQ(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div>
                <Label htmlFor={`faq-question-${index}`}>Question</Label>
                <Input
                  id={`faq-question-${index}`}
                  value={faq.question}
                  onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                  placeholder="What is...?"
                />
              </div>
              <div>
                <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                <Textarea
                  id={`faq-answer-${index}`}
                  value={faq.answer}
                  onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                  placeholder="This is..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button type="button" onClick={addFAQ} variant="outline">
            Add FAQ Item
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
