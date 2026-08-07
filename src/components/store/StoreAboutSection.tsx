'use client'

import React from 'react'
import Image from 'next/image'
import type { ShopTheme } from '@/types'

interface StoreAboutSectionProps {
  storeName: string
  shopDescription?: string | null
  theme?: ShopTheme | null
  primaryColor?: string
  className?: string
}

export function StoreAboutSection({
  storeName,
  shopDescription,
  theme,
  className = '',
}: StoreAboutSectionProps) {
  // If admin explicitly disabled the story section, hide it
  if (theme?.aboutStoryEnabled === false) return null

  const storyTitle = theme?.aboutStoryTitle || 'Built With Passion,\nDriven By You'
  const storyImage = theme?.aboutStoryImage || '/images/store-about-story.png'
  const signatureText = theme?.aboutSignatureText || 'Thank you for being part of our journey.'

  const defaultPara1 = shopDescription || `${storeName} was born out of a simple idea — to make every online shopping experience seamless, joyful, and trustworthy.`

  const p1 = theme?.aboutPara1 || defaultPara1
  const p2 = theme?.aboutPara2 || ''

  return (
    <section className={`w-full py-8 md:py-0 ${className}`}>
      <div className=" rounded-[10px] p-6 sm:p-10 md:p-14 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & Story Content */}
          <div className="lg:col-span-6 space-y-6 text-left pr-0 lg:pr-4">
            
            {/* Main Headline */}
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium text-[#1C1917] whitespace-pre-line">
                {storyTitle}
              </h2>
            </div>

            {/* Paragraph Content */}
            <div className="space-y-4 text-stone-600 text-[12px]">
              <p>{p1}</p>
            </div>

            {/* Bottom Signature / Closing Note */}
            <div className="pt-3">
              <p className="text-2xl sm:text-3xl text-stone-800 tracking-wide font-semibold leading-snug">
                {signatureText}
              </p>
            </div>

          </div>

          {/* Right Column: Aesthetic Image Container */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="relative w-full aspect-[4/3] sm:aspect-[14/10] max-w-lg lg:max-w-none rounded-[10px] overflow-hidden shadow-md bg-stone-100 group">
              <Image
                src={storyImage}
                alt={`${storeName} Our Story`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-black/5 rounded-[28px] pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
