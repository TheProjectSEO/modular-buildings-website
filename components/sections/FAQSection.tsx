'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  questions: FAQItem[]
  title?: string
  subtitle?: string
  className?: string
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  questions,
  title = 'Frequently Asked Questions',
  subtitle,
  className = '',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container-custom">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2 className="text-h2 md:text-h1 font-bold text-mb-dark mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base text-mb-gray max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {questions.map((faq, index) => (
            <div
              key={index}
              className="border border-mb-border-gray rounded-mb-lg overflow-hidden bg-white transition-shadow hover:shadow-md"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-mb-bg-light transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-base md:text-lg font-semibold text-mb-dark pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 text-mb-navy">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              {/* Answer Content */}
              {openIndex === index && (
                <div className="px-6 pb-4 pt-2 border-t border-mb-border-light">
                  <div
                    className="text-base text-mb-gray leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
