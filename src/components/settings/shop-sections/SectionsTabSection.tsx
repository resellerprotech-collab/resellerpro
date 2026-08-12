'use client'

import React from 'react'
import OfferBannerSection from './OfferBannerSection'
import NewsletterBannerSection from './NewsletterBannerSection'
import TestimonialsSection from './TestimonialsSection'
import TrustBadgesSection from './TrustBadgesSection'
import AboutUsSections from './AboutUsSections'

interface SectionsTabSectionProps {
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<any>>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleToggle: (name: string, val: boolean) => void
  updateTestimonial: (index: number, field: string, value: string | number) => void
  handleTestimonialAvatarUpload: (index: number, e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleBadgeIconUpload: (e: React.ChangeEvent<HTMLInputElement>, badgeId: string) => Promise<void>
  updateTrustBadgeItem: (badgeId: string, field: string, value: string) => void
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => Promise<void>
  uploadingField: string | null
  isPending: boolean
  isEligible: boolean
}

export default function SectionsTabSection(props: SectionsTabSectionProps) {
  return (
    <div className="space-y-6">
      <OfferBannerSection
        formData={props.formData}
        handleChange={props.handleChange}
        handleToggle={props.handleToggle}
        isPending={props.isPending}
        isEligible={props.isEligible}
      />

      <NewsletterBannerSection
        formData={props.formData}
        handleChange={props.handleChange}
        handleToggle={props.handleToggle}
        isPending={props.isPending}
        isEligible={props.isEligible}
      />

      <TestimonialsSection
        formData={props.formData}
        setFormData={props.setFormData}
        handleToggle={props.handleToggle}
        updateTestimonial={props.updateTestimonial}
        handleTestimonialAvatarUpload={props.handleTestimonialAvatarUpload}
        uploadingField={props.uploadingField}
        isEligible={props.isEligible}
      />

      <TrustBadgesSection
        formData={props.formData}
        setFormData={props.setFormData}
        handleChange={props.handleChange}
        handleToggle={props.handleToggle}
        updateTrustBadgeItem={props.updateTrustBadgeItem}
        handleBadgeIconUpload={props.handleBadgeIconUpload}
        uploadingField={props.uploadingField}
        isPending={props.isPending}
        isEligible={props.isEligible}
      />

      <AboutUsSections
        formData={props.formData}
        setFormData={props.setFormData}
        handleChange={props.handleChange}
        handleToggle={props.handleToggle}
        handleFileUpload={props.handleFileUpload}
        uploadingField={props.uploadingField}
        isPending={props.isPending}
        isEligible={props.isEligible}
      />
    </div>
  )
}
