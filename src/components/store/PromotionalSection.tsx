'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ShopTheme, PromoItem } from '@/types'

interface PromotionalSectionProps {
  theme?: ShopTheme | null
  shopSlug: string
}

const DEFAULT_FULL_BANNER = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80'
const DEFAULT_CARD_1 = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'
const DEFAULT_CARD_2 = 'https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?w=800&auto=format&fit=crop&q=80'

export function resolvePromoLink(item: PromoItem | undefined | null, shopSlug: string): string {
  if (!item || !item.clickAction) return `/store/${shopSlug}/shop`

  switch (item.clickAction) {
    case 'category':
      return item.clickTarget
        ? `/store/${shopSlug}/shop?category=${encodeURIComponent(item.clickTarget)}`
        : `/store/${shopSlug}/shop`

    case 'product':
      return item.clickTarget
        ? `/store/${shopSlug}/p/${item.clickTarget}`
        : `/store/${shopSlug}/shop`

    case 'custom_url':
      if (!item.clickTarget) return `/store/${shopSlug}/shop`
      return item.clickTarget

    case 'collection':
    case 'shop':
    default:
      return `/store/${shopSlug}/shop`
  }
}

export function PromotionalSection({ theme, shopSlug }: PromotionalSectionProps) {
  // If explicitly disabled or no DB images set, do not render
  if (theme?.promoSectionEnabled === false) {
    return null
  }

  const layout = theme?.promoLayout || 'full_width'
  const fullBanner = theme?.promoFullBanner
  const card1 = theme?.promoCard1
  const card2 = theme?.promoCard2

  if (layout === 'two_cards') {
    const card1Img = card1?.imageUrl
    const card2Img = card2?.imageUrl

    if (!card1Img && !card2Img) {
      return null
    }

    const link1 = resolvePromoLink(card1, shopSlug)
    const link2 = resolvePromoLink(card2, shopSlug)

    const isExternal1 = link1.startsWith('http://') || link1.startsWith('https://')
    const isExternal2 = link2.startsWith('http://') || link2.startsWith('https://')

    return (
      <section className="mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1 */}
          {card1Img && (
            <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 bg-slate-950 aspect-[16/9] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src={card1Img}
                alt="Promotional Card 1"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {isExternal1 ? (
                <a
                  href={link1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="Promotional banner link 1"
                />
              ) : (
                <Link
                  href={link1}
                  className="absolute inset-0 z-10"
                  aria-label="Promotional banner link 1"
                />
              )}
            </div>
          )}

          {/* Card 2 */}
          {card2Img && (
            <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 bg-slate-950 aspect-[16/9] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src={card2Img}
                alt="Promotional Card 2"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {isExternal2 ? (
                <a
                  href={link2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="Promotional banner link 2"
                />
              ) : (
                <Link
                  href={link2}
                  className="absolute inset-0 z-10"
                  aria-label="Promotional banner link 2"
                />
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  // Default: Full Width Banner Layout
  const bannerImg = fullBanner?.imageUrl
  if (!bannerImg) {
    return null
  }
  const link = resolvePromoLink(fullBanner, shopSlug)
  const isExternal = link.startsWith('http://') || link.startsWith('https://')

  return (
    <section className="mb-14">
      <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 bg-slate-950 min-h-[180px] sm:min-h-[260px] md:min-h-[340px] lg:min-h-[380px] w-full flex items-center justify-center">
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[380px] lg:h-[420px]">
          <Image
            src={bannerImg}
            alt="Homepage Promotional Banner"
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            priority
            sizes="100vw"
          />
        </div>
        {isExternal ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label="Promotional section banner link"
          />
        ) : (
          <Link
            href={link}
            className="absolute inset-0 z-10"
            aria-label="Promotional section banner link"
          />
        )}
      </div>
    </section>
  )
}
