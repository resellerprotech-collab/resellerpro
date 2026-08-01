import Link from 'next/link'
import { Instagram, Facebook, Twitter, MessageCircle, Youtube, Heart, MapPin, Mail, Phone, Clock } from 'lucide-react'
import type { Profile, ShopTheme } from '@/types'

interface StoreFooterProps {
  profile: Profile
  theme: ShopTheme | null
}

export function StoreFooter({ profile, theme }: StoreFooterProps) {
  const storeName = profile.shop_name || profile.business_name || 'Store'
  const waNum = theme?.socialWhatsApp || profile.whatsapp_number || profile.business_phone
  const waClean = waNum?.replace(/\D/g, '')
  const waLink = waClean ? `https://wa.me/91${waClean}?text=${encodeURIComponent('Hi! I wanted to inquire about a product.')}` : null

  const address = theme?.footerAddress || profile.business_address
  const email = theme?.footerEmail || profile.business_email
  const phone = theme?.footerPhone || profile.business_phone || profile.whatsapp_number

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
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
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
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

          {/* Column 3: Trust & Policies */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Customer Policies</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold">
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
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:items-start gap-1">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 flex items-center gap-1 font-semibold">
              Powered by <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" /> ResellerPro
            </p>
          </div>

          {/* We Accept Payment Icons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[10px] font-bold text-slate-500 mr-1">Accepted Payments:</span>
            <span className="bg-slate-900 px-2 py-1 rounded text-[9px] font-black text-slate-300 border border-slate-800 tracking-wider">UPI</span>
            <span className="bg-slate-900 px-2 py-1 rounded text-[9px] font-black text-slate-300 border border-slate-800 tracking-wider">COD</span>
            <span className="bg-slate-900 px-2 py-1 rounded text-[9px] font-black text-slate-300 border border-slate-800 tracking-wider">VISA</span>
            <span className="bg-slate-900 px-2 py-1 rounded text-[9px] font-black text-slate-300 border border-slate-800 tracking-wider">MASTERCARD</span>
          </div>

          {/* Social Media Link Buttons */}
          <div className="flex items-center gap-3">
            {theme?.socialInstagram && (
              <a
                href={`https://instagram.com/${theme.socialInstagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {theme?.socialFacebook && (
              <a
                href={theme.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {theme?.socialTwitter && (
              <a
                href={theme.socialTwitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
