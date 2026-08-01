'use client'

import { Star, CheckCircle2, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  date: string
  productName?: string
}

interface TestimonialsProps {
  primaryColor?: string
  customReviews?: any[]
}

export function Testimonials({ primaryColor = '#6366f1', customReviews }: TestimonialsProps) {
  const reviews = (customReviews || []).filter(r => r.name || r.text || r.comment)

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">Verified Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Testimonials
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 relative flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200" />
              <div className="space-y-3 relative z-10">
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.text || rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                  </h4>
                  {rev.location && <p className="text-[10px] text-slate-400">{rev.location}</p>}
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {rev.productName || 'Verified Buyer'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
