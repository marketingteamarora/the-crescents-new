"use client"

import type { FAQContent } from "@/types/content"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQProps {
  content: FAQContent
}

export function FAQ({ content }: FAQProps) {
  if (!content || !content.faqs || content.faqs.length === 0) {
    return null
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20]">{content.title}</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{content.subtitle}</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {content.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
