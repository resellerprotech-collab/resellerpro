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

export function Testimonials({ primaryColor = '#6366f1' }: TestimonialsProps) {
  const reviews: Testimonial[] = [
    {
      id: 'rev-1',
      name: 'Ananya Sharma',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      comment: 'Super fast delivery and packaging was impressive! The product quality is even better than shown in pictures. Will definitely buy again.',
      date: '2 days ago',
      productName: 'Verified Purchase',
    },
    {
      id: 'rev-2',
      name: 'Rohan Verma',
      location: 'Delhi NCR',
      rating: 5,
      comment: 'Ordered via WhatsApp with COD. Got instant update messages and delivery took just 3 days. Extremely satisfied with the service!',
      date: '1 week ago',
      productName: 'Verified Purchase',
    },
    {
      id: 'rev-3',
      name: 'Priya Sundaram',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      comment: 'Great value for money. Returning or exchanging items was smooth when I needed a different size. 10/10 customer support.',
      date: '2 weeks ago',
      productName: 'Verified Purchase',
    },
  ]

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
              <span className="text-xs font-bold text-slate-700">4.9 / 5.0 (500+ Happy Customers)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Loved by Thousands of Buyers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Real feedback from verified customers who shop with us every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 relative flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200" />
              <div className="space-y-3 relative z-10">
                <div className="flex text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                  </h4>
                  <p className="text-[10px] text-slate-400">{rev.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {rev.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
