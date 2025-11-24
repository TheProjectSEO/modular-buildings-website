'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase'

interface ContactFormProps {
  productInterest?: string
  sourcePage?: string
}

interface ContactFormData {
  name: string
  company: string
  phone: string
  country: string
  city: string
  email: string
  message: string
  gdprConsent: boolean
}

export const ContactForm: React.FC<ContactFormProps> = ({
  productInterest,
  sourcePage,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    phone: '',
    country: '',
    city: '',
    email: '',
    message: '',
    gdprConsent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            ...formData,
            product_interest: productInterest,
            source_page: sourcePage,
            status: 'new',
          },
        ])

      if (error) throw error

      setSubmitStatus('success')
      // Reset form
      setFormData({
        name: '',
        company: '',
        phone: '',
        country: '',
        city: '',
        email: '',
        message: '',
        gdprConsent: false,
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-mb">
          Thank you! Your message has been sent successfully. We'll get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-mb">
          There was an error submitting your message. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country *
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-mb-border-gray rounded-mb focus:outline-none focus:ring-2 focus:ring-mb-navy"
        />
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="gdprConsent"
          name="gdprConsent"
          checked={formData.gdprConsent}
          onChange={handleChange}
          required
          className="mt-1"
        />
        <label htmlFor="gdprConsent" className="text-sm text-gray-600">
          I have read the privacy policy regarding my personal data and I agree to the processing of my data. *
        </label>
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
