'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Twitter, MessageCircle, Youtube, MapPin, Mail, Phone, Clock, ChevronDown } from 'lucide-react'
import type { Profile, ShopTheme } from '@/types'

interface StoreFooterProps {
  profile: Profile
  theme: ShopTheme | null
}

function formatSocialUrl(platform: 'instagram' | 'facebook' | 'twitter' | 'whatsapp' | 'youtube', rawVal?: string | null): string | null {
  if (!rawVal || !rawVal.trim()) return null
  const val = rawVal.trim()

  if (platform === 'instagram') {
    if (val.startsWith('http')) return val
    const username = val.replace(/^@/, '').replace(/^instagram\.com\//, '')
    return `https://instagram.com/${username}`
  }

  if (platform === 'facebook') {
    if (val.startsWith('http')) return val
    const path = val.replace(/^facebook\.com\//, '')
    return `https://facebook.com/${path}`
  }

  if (platform === 'twitter') {
    if (val.startsWith('http')) return val
    const username = val.replace(/^@/, '').replace(/^(twitter|x)\.com\//, '')
    return `https://x.com/${username}`
  }

  if (platform === 'youtube') {
    if (val.startsWith('http')) return val
    const path = val.replace(/^youtube\.com\//, '')
    return `https://youtube.com/${path}`
  }

  if (platform === 'whatsapp') {
    const cleanNum = val.replace(/\D/g, '')
    if (!cleanNum) return null
    const formatted = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum
    return `https://wa.me/${formatted}?text=${encodeURIComponent('Hi! I found your store online.')}`
  }

  return null
}

export function StoreFooter({ profile, theme }: StoreFooterProps) {
  const [openNav, setOpenNav] = useState(false)
  const [openPolicies, setOpenPolicies] = useState(false)

  const storeName = profile.business_name || profile.shop_name || 'Store'
  const waNum = theme?.socialWhatsApp || profile.whatsapp_number || profile.business_phone
  const waLink = formatSocialUrl('whatsapp', waNum)
  const instaLink = formatSocialUrl('instagram', theme?.socialInstagram)
  const fbLink = formatSocialUrl('facebook', theme?.socialFacebook)
  const twLink = formatSocialUrl('twitter', theme?.socialTwitter)
  const ytLink = formatSocialUrl('youtube', theme?.socialYoutube)

  const address = theme?.footerAddress || profile.business_address
  const email = theme?.footerEmail || profile.business_email
  const phone = theme?.footerPhone || profile.business_phone || profile.whatsapp_number

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-black text-xl tracking-tight uppercase">{storeName}</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {theme?.footerAbout || profile.shop_description || 'Your destination for premium quality products. Direct shipping, easy returns, and dedicated support.'}
            </p>

            {/* Merchant Contact Info */}
            <div className="pt-2 space-y-2 text-xs text-slate-300">
              {address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Support Hours: Mon - Sat (9:00 AM - 8:00 PM)</span>
              </div>
            </div>

            {/* Social Media Icon Buttons */}
            <div className="flex items-center gap-2.5 pt-3">
              <a
                href={instaLink || '#'}
                target={instaLink ? '_blank' : '_self'}
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={fbLink || '#'}
                target={fbLink ? '_blank' : '_self'}
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              {twLink && (
                <a
                  href={twLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 flex items-center justify-center transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              <a
                href={ytLink || '#'}
                target={ytLink ? '_blank' : '_self'}
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 flex items-center justify-center transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (Accordion on mobile) */}
          <div className="border-b border-slate-900/80 md:border-none pb-4 md:pb-0 space-y-3 md:space-y-4">
            <button
              type="button"
              onClick={() => setOpenNav(!openNav)}
              className="w-full flex items-center justify-between text-left text-white font-bold text-xs uppercase tracking-wider md:cursor-default md:pointer-events-none"
            >
              <span>Navigation</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 md:hidden ${openNav ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 text-xs sm:text-sm font-semibold transition-all ${openNav ? 'block pt-1' : 'hidden md:block'}`}>
              <li>
                <Link href={`/store/${profile.shop_slug}`} className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`/store/${profile.shop_slug}/shop`} className="hover:text-white transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link href={`/store/${profile.shop_slug}/about`} className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/store/${profile.shop_slug}/contact`} className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Policies (Accordion on mobile) */}
          <div className="border-b border-slate-900/80 md:border-none pb-4 md:pb-0 space-y-3 md:space-y-4">
            <button
              type="button"
              onClick={() => setOpenPolicies(!openPolicies)}
              className="w-full flex items-center justify-between text-left text-white font-bold text-xs uppercase tracking-wider md:cursor-default md:pointer-events-none"
            >
              <span>Customer Policies</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 md:hidden ${openPolicies ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`space-y-2.5 text-xs sm:text-sm font-semibold transition-all ${openPolicies ? 'block pt-1' : 'hidden md:block'}`}>
              <li>
                <Link href={`/store/${profile.shop_slug}/shipping-policy`} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href={`/store/${profile.shop_slug}/return-policy`} className="hover:text-white transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href={`/store/${profile.shop_slug}/privacy-policy`} className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/store/${profile.shop_slug}/terms`} className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Contact & Help */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Connect With Us</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have questions about an order? Message us directly on WhatsApp for instant assistance.
            </p>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="pt-8 border-t border-slate-900 flex flex-col items-center justify-center text-center gap-1">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="text-[10px] text-slate-600 flex items-center justify-center gap-1 font-semibold">
            Powered by ResellerPro
          </p>
        </div>
      </div>
    </footer>
  )
}
