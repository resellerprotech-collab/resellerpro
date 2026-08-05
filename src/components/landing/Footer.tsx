'use client'

import { useState } from 'react'
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  Star,
  Tag,
  Mail,
  HelpCircle,
  Building2,
  FileText,
  Phone,
  Headphones,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import NextImage from 'next/image'

export default function Footer() {
  const [openNavMobile, setOpenNavMobile] = useState(false)
  const [openCompanyMobile, setOpenCompanyMobile] = useState(false)

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-12 md:py-16 px-6 sm:px-12 lg:px-16 relative text-slate-900">
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-slate-200/60">

          {/* Column 1: Logo, Description, CTA, Trust Bullet Points */}
          <div className="lg:col-span-4 space-y-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5">
              <NextImage
                src="/logo.svg"
                alt="ResellerPro"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">ResellerPro</span>
            </Link>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              Your all-in-one platform to manage products, customers & orders. Built for modern resellers who want to grow faster.
            </p>

            {/* CTA Button */}
            <div>
              <Link href="/signup">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 group cursor-pointer">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Trust Bullets */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium text-slate-700">Easy to Use</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium text-slate-700">Secure & Reliable</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-3 h-3" />
                </div>
                <span className="text-xs font-medium text-slate-700">Grow Your Business</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2 lg:pl-6 lg:border-l lg:border-slate-200/40 space-y-3">
            <button
              type="button"
              onClick={() => setOpenNavMobile(!openNavMobile)}
              className="w-full flex items-center justify-between text-left lg:cursor-default cursor-pointer py-1"
            >
              <div>
                <h4 className="text-xs font-bold tracking-wider uppercase text-slate-900">NAVIGATION</h4>
                <div className="hidden lg:block w-5 h-0.5 bg-blue-600 rounded-full mt-1" />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 lg:hidden transition-transform duration-300 ${openNavMobile ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            <ul className={`space-y-3.5 text-xs font-medium text-slate-700 transition-all duration-300 ${
              openNavMobile ? 'block pt-2' : 'hidden lg:block'
            }`}>
              <li>
                <Link href="/features" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <Star className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Features</span>
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <Tag className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 lg:pl-6 lg:border-l lg:border-slate-200/40 space-y-3">
            <button
              type="button"
              onClick={() => setOpenCompanyMobile(!openCompanyMobile)}
              className="w-full flex items-center justify-between text-left lg:cursor-default cursor-pointer py-1"
            >
              <div>
                <h4 className="text-xs font-bold tracking-wider uppercase text-slate-900">COMPANY</h4>
                <div className="hidden lg:block w-5 h-0.5 bg-blue-600 rounded-full mt-1" />
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 lg:hidden transition-transform duration-300 ${openCompanyMobile ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            <ul className={`space-y-3.5 text-xs font-medium text-slate-700 transition-all duration-300 ${
              openCompanyMobile ? 'block pt-2' : 'hidden lg:block'
            }`}>
              <li>
                <Link href="/about" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="flex items-center gap-2.5 hover:text-blue-600 transition-colors group">
                  <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Need Help Box */}
          <div className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-slate-200/40 space-y-4">
            <div>
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-900">CONTACT</h4>
              <div className="hidden lg:block w-5 h-0.5 bg-blue-600 rounded-full mt-1" />
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-700">
              <a href="mailto:support@resellerpro.in" className="flex items-center gap-3 hover:text-blue-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@resellerpro.in</span>
              </a>

              <a href="tel:+917736767759" className="flex items-center gap-3 hover:text-blue-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 7736767759</span>
              </a>
            </div>

            {/* Need Help? Box */}
            <div className="bg-blue-50/60 border border-blue-100/80 rounded-2xl p-4 flex items-center gap-3.5 mt-5">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">Need Help?</div>
                <div className="text-[11px] text-slate-600">
                  We're here to support you <span className="text-blue-600 font-bold">24/7.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            © 2025 ResellerPro. All rights reserved.
          </div>

          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <span>Made with <span className="text-blue-600 font-medium">passion</span> for resellers</span>
          </div>

          <div className="flex items-center gap-2">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
