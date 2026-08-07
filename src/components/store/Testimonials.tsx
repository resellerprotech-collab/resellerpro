'use client'

import React from 'react'
import { Star, CheckCircle2, Quote } from 'lucide-react'

export interface Testimonial {
  id?: string
  name: string
  location?: string
  rating?: number
  text?: string
  comment?: string
  productName?: string
  avatarUrl?: string
  role?: string
}

interface TestimonialsProps {
  primaryColor?: string
  customReviews?: Testimonial[] | any[]
  heading?: string
  subheading?: string
}

export function Testimonials({ primaryColor = '#6366f1', customReviews, heading, subheading }: TestimonialsProps) {
  const reviews = (customReviews || []).filter(r => r && (r.name || r.text || r.comment))

  if (reviews.length === 0) {
    return null
  }

  const sectionHeading = heading !== undefined && heading !== '' ? heading : 'What Our Customers Say'
  const sectionSubheading = subheading !== undefined ? subheading : 'Trusted by 5,000+ businesses and individuals worldwide'

  // Ensure enough cards for a full screen width loop
  const displayList = reviews.length < 4
    ? [...reviews, ...reviews, ...reviews, ...reviews]
    : reviews

  const renderReviewCard = (rev: any, idx: number, prefix: string) => {
    const initials = rev.name ? rev.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'
    const avatar = rev.avatarUrl || rev.imageUrl || rev.image || rev.avatar
    return (
      <div
        key={`${prefix}_${rev.id || idx}_${idx}`}
        className="shrink-0 w-[230px] sm:w-[300px] md:w-[340px] p-4 sm:p-5 shadow-md border border-slate-100 rounded-[10px]  relative flex flex-col justify-between transition-all duration-300 group"
      >
        {/* Card Header: Avatar & Quote Icon */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-slate-100 border border-slate-200/60 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs sm:text-base shadow-inner shrink-0">
            {avatar ? (
              <img src={avatar} alt={rev.name} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="shrink-0">
            <Quote className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black rotate-180" />
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex text-amber-400 gap-0.5 sm:gap-1 mb-1.5 sm:mb-2.5">
          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-xs text-slate-700 font-medium leading-relaxed mb-3 sm:mb-4 line-clamp-2 break-words">
          “{rev.text || rev.comment}”
        </p>

        {/* Card Footer: Customer Name/Role & PrimaryColor Verified Badge */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between mt-auto gap-1">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
              {rev.name}
            </h4>
            <p className="text-[9px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {rev.role || rev.location || rev.productName || 'Verified Customer'}
            </p>
          </div>

          <div
            className="inline-flex items-center gap-1 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg text-[9px] sm:text-xs font-bold shadow-xs shrink-0"
            style={{ backgroundColor: primaryColor || 'var(--store-primary, #000000)' }}
          >
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white fill-white/20" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="py-8 md:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10 text-center">
        <h2 className="text-xl sm:text-3xl lg:text-4xl text-black font-medium tracking-tight">
          {sectionHeading}
        </h2>
        {sectionSubheading ? (
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-xl mx-auto">
            {sectionSubheading}
          </p>
        ) : null}
      </div>

      {/* Truly Infinite Seamless Marquee Container using pure Tailwind CSS classes */}
      <div className="relative w-full overflow-hidden group flex gap-3 sm:gap-6 py-1 select-none">
        {/* Track 1 */}
        <div className="flex gap-3 sm:gap-6 shrink-0 animate-[marquee_55s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
          {displayList.map((rev, idx) => renderReviewCard(rev, idx, 't1'))}
        </div>

        {/* Track 2 (Mirror Copy for Endless Seamless Loop) */}
        <div className="flex gap-3 sm:gap-6 shrink-0 animate-[marquee_55s_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform" aria-hidden="true">
          {displayList.map((rev, idx) => renderReviewCard(rev, idx, 't2'))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
