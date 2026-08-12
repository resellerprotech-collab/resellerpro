'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'
import {
  Loader2, Palette, Globe, ExternalLink, Sparkles,
  Crown, Lock, Layout, Share2, Search, Eye, Rocket, ArrowRight,
  MapPin, Shield, CreditCard, PanelTop, Zap, MessageCircle, Quote,
  Mail, BookOpen, Megaphone, Tag, ChevronUp, ChevronLeft, ChevronRight, LayoutGrid
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { updateShopSettings } from '@/app/(dashboard)/settings/actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import type { HeroBannerItem, PromoItem } from '@/types'

import GeneralTabSection from '@/components/settings/shop-sections/GeneralTabSection'
import PaymentTabSection from '@/components/settings/shop-sections/PaymentTabSection'
import AppearanceTabSection from '@/components/settings/shop-sections/AppearanceTabSection'
import HeroTabSection from '@/components/settings/shop-sections/HeroTabSection'
import PromoTabSection from '@/components/settings/shop-sections/PromoTabSection'
import OfferBannerSection from '@/components/settings/shop-sections/OfferBannerSection'
import NewsletterBannerSection from '@/components/settings/shop-sections/NewsletterBannerSection'
import TestimonialsSection from '@/components/settings/shop-sections/TestimonialsSection'
import TrustBadgesSection from '@/components/settings/shop-sections/TrustBadgesSection'
import AboutUsSections from '@/components/settings/shop-sections/AboutUsSections'
import PoliciesTabSection from '@/components/settings/shop-sections/PoliciesTabSection'
import SocialTabSection from '@/components/settings/shop-sections/SocialTabSection'
import SeoTabSection from '@/components/settings/shop-sections/SeoTabSection'
import FooterTabSection from '@/components/settings/shop-sections/FooterTabSection'

interface ShopSettingsFormProps {
  profile: {
    id: string
    shop_slug?: string
    shop_description?: string
    shop_theme?: any
    business_name?: string
    avatar_url?: string
    shop_logo_url?: string
    upi_id?: string | null
    upi_name?: string | null
    upi_instructions?: string | null
  }
  isEligible?: boolean
  planName?: string
  planDisplay?: string
  productCount?: number
  products?: { id: string; name: string }[]
  categories?: string[]
}

export default function ShopSettingsForm({
  profile,
  isEligible = true,
  planName = 'free',
  planDisplay = 'Free Plan',
  productCount = 0,
  products = [],
  categories = []
}: ShopSettingsFormProps) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('general')
  const [slideDirection, setSlideDirection] = useState<number>(1)
  const [isMobileGridOpen, setIsMobileGridOpen] = useState<boolean>(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const bottomNavRef = useRef<HTMLDivElement>(null)

  const [storeUrlPrefix, setStoreUrlPrefix] = useState('resellerpro.in/store/')

  useEffect(() => {
    const saved = sessionStorage.getItem('resellerpro_shop_tab')
    if (saved) setActiveTab(saved)
    setStoreUrlPrefix(`${window.location.host}/store/`)
  }, [])

  const supabase = createClient()

  const [categoryList, setCategoryList] = useState<string[]>(categories || [])
  const [productList, setProductList] = useState<{ id: string; name: string }[]>(products || [])

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryList(prev => Array.from(new Set([...prev, ...categories])))
    }
  }, [categories])

  useEffect(() => {
    if (products && products.length > 0) {
      setProductList(products)
    }
  }, [products])

  useEffect(() => {
    const fetchStoreCategoriesAndProducts = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          supabase.from('categories').select('name').eq('user_id', profile.id),
          supabase.from('products').select('id, name, category').eq('user_id', profile.id)
        ])

        const dbCats = (catsRes.data || []).map(c => c.name).filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
        const prodCats = (prodsRes.data || []).map(p => p.category).filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
        const combinedCategories = Array.from(new Set([...(categories || []), ...dbCats, ...prodCats]))

        setCategoryList(combinedCategories)

        if (prodsRes.data && prodsRes.data.length > 0) {
          setProductList(prodsRes.data.map(p => ({ id: p.id, name: p.name })))
        }
      } catch (err) {
        console.error('[ShopSettingsForm] Failed to fetch live categories/products:', err)
      }
    }
    fetchStoreCategoriesAndProducts()
  }, [profile.id])

  const theme = profile.shop_theme || {}

  const initialBanners: HeroBannerItem[] = (theme.heroBanners && Array.isArray(theme.heroBanners) && theme.heroBanners.length > 0)
    ? theme.heroBanners
    : (theme.heroImageUrl ? [{
        id: 'banner-1',
        imageUrl: theme.heroImageUrl,
        link: theme.heroCtaLink || '#products',
        clickAction: theme.heroBannerClickAction || 'shop'
      }] : [])

  const [formData, setFormData] = useState({
    // Basic
    shop_slug: profile.shop_slug || '',
    shop_description: profile.shop_description || '',
    shop_logo_url: theme.shop_logo_url || profile.shop_logo_url || '',
    upi_id: profile.upi_id || '',
    upi_name: profile.upi_name || '',
    upi_instructions: profile.upi_instructions || '',
    // Payment Options Management
    enableOnlinePayment: theme.enableOnlinePayment === true,
    onlinePaymentTitle: (!theme.onlinePaymentTitle || theme.onlinePaymentTitle === 'Card Payment') ? 'Online Payment' : theme.onlinePaymentTitle,
    onlinePaymentDescription: theme.onlinePaymentDescription || 'Credit/Debit Card, NetBanking & UPI',
    razorpayKeyId: theme.razorpayKeyId || '',
    razorpayKeySecret: theme.razorpayKeySecret || '',
    enableCod: theme.enableCod !== false,
    codTitle: theme.codTitle || 'Cash on Delivery (COD)',
    codDescription: theme.codDescription || 'Pay cash on delivery',
    whatsappOrderTitle: theme.whatsappOrderTitle || 'Place Order via WhatsApp',
    whatsappOrderDescription: theme.whatsappOrderDescription || 'Direct order & support on WhatsApp',
    // Appearance
    primaryColor: theme.primaryColor || '#4f46e5',
    secondaryColor: theme.secondaryColor || '#f97316',
    accentColor: theme.accentColor || '#10b981',
    neutralDarkColor: theme.neutralDarkColor || '#0f172a',
    navbarBgColor: theme.navbarBgColor || '#ffffff',
    navbarTextColor: theme.navbarTextColor || '#0f172a',
    logoIncludesName: theme.logoIncludesName || false,
    layout: theme.layout || 'grid',
    showPrices: theme.showPrices !== false,
    showWhatsApp: theme.showWhatsApp !== false,
    buttonStyle: theme.buttonStyle || 'rounded',
    fontFamily: theme.fontFamily || 'default',
    colorScheme: theme.colorScheme || 'light',
    headerStyle: theme.headerStyle || 'default',
    // Hero Banner
    heroEnabled: theme.heroEnabled || false,
    heroTitle: theme.heroTitle || '',
    heroSubtitle: theme.heroSubtitle || '',
    heroCtaText: theme.heroCtaText || 'Shop Now',
    heroCtaLink: theme.heroCtaLink || '#products',
    heroClickAction: theme.heroClickAction || (theme.heroCtaLink === '#collections' ? 'collections' : theme.heroCtaLink?.includes('?category=') ? 'category' : theme.heroCtaLink?.includes('p/') ? 'product' : theme.heroCtaLink && theme.heroCtaLink !== '#products' ? 'custom_url' : 'shop'),
    heroMobileCtaLink: theme.heroMobileCtaLink || theme.heroCtaLink || '#products',
    heroMobileClickAction: theme.heroMobileClickAction || (theme.heroMobileCtaLink === '#collections' ? 'collections' : theme.heroMobileCtaLink?.includes('?category=') ? 'category' : theme.heroMobileCtaLink?.includes('p/') ? 'product' : theme.heroMobileCtaLink && theme.heroMobileCtaLink !== '#products' ? 'custom_url' : 'shop'),
    heroBgColor: theme.heroBgColor || '#4f46e5',
    heroPattern: theme.heroPattern || 'none',
    heroImageUrl: theme.heroImageUrl || '',
    heroMobileImageUrl: theme.heroMobileImageUrl || '',
    heroMobileImages: theme.heroMobileImages || (theme.heroMobileImageUrl ? [theme.heroMobileImageUrl] : []),
    heroMobileBanners: (theme.heroMobileBanners && Array.isArray(theme.heroMobileBanners) && theme.heroMobileBanners.length > 0)
      ? theme.heroMobileBanners
      : (theme.heroMobileImages || (theme.heroMobileImageUrl ? [theme.heroMobileImageUrl] : [])).map((img: string) => ({
          imageUrl: img,
          link: theme.heroMobileCtaLink || '#products',
          clickAction: theme.heroMobileClickAction || 'shop'
        })),
    heroShowcaseBanners: (theme.heroShowcaseBanners && Array.isArray(theme.heroShowcaseBanners) && theme.heroShowcaseBanners.length > 0)
      ? theme.heroShowcaseBanners
      : (theme.heroImages || (theme.heroImageUrl ? [theme.heroImageUrl] : [])).map((img: string) => ({
          imageUrl: img,
          link: theme.heroCtaLink || '#products',
          clickAction: theme.heroClickAction || 'shop'
        })),
    heroTemplate: theme.heroTemplate || 'split',
    heroBadge: theme.heroBadge || 'New Arrival',
    heroSecondaryCtaText: theme.heroSecondaryCtaText || 'Explore Now',
    heroSecondaryCtaLink: theme.heroSecondaryCtaLink || '#collections',
    heroBadge1: theme.heroBadge1 || 'Free Shipping',
    heroBadge2: theme.heroBadge2 || 'Easy Returns',
    heroBadge3: theme.heroBadge3 || 'COD Available',
    heroImages: theme.heroImages || (theme.heroImageUrl ? [theme.heroImageUrl] : []),
    heroBanners: initialBanners,
    heroBannerClickAction: theme.heroBannerClickAction || 'shop',
    // Announcement Banner
    bannerText: theme.bannerText || '',
    bannerEnabled: theme.bannerEnabled || false,
    // Special Offer Banner Strip
    offerBannerEnabled: theme.offerBannerEnabled !== false,
    offerBannerBadge: theme.offerBannerBadge || '⚡ Special Promotion',
    offerBannerTitle: theme.offerBannerTitle || 'Limited Time Offer: Get 10% OFF on Orders Above ₹1,499',
    offerBannerCode: theme.offerBannerCode || 'SAVE10',
    offerBannerSubtext: theme.offerBannerSubtext || 'Use code SAVE10 at checkout.',
    offerBannerBtnText: theme.offerBannerBtnText || 'Claim Offer Now',
    // Newsletter / VIP Circle Banner
    newsletterEnabled: theme.newsletterEnabled !== false,
    newsletterTitle: theme.newsletterTitle || 'JOIN OUR VIP CIRCLE',
    newsletterSubtitle: theme.newsletterSubtitle || 'Subscribe to get exclusive discount codes, new arrival alerts, and special event invites.',
    newsletterBtnText: theme.newsletterBtnText || 'SUBSCRIBE',
    newsletterPlaceholder: theme.newsletterPlaceholder || 'Enter your email address',
    // Social Links
    socialInstagram: theme.socialInstagram || '',
    socialFacebook: theme.socialFacebook || '',
    socialTwitter: theme.socialTwitter || '',
    socialWhatsApp: theme.socialWhatsApp || '',
    socialYoutube: theme.socialYoutube || '',
    // SEO
    seoTitle: theme.seoTitle || '',
    seoDescription: theme.seoDescription || '',
    // WhatsApp Chat Widget
    chatWidgetEnabled: theme.chatWidgetEnabled !== false,
    chatWidgetMessage: theme.chatWidgetMessage || 'Hi! I found your store online. I have a question.',
    // Store Status
    storeStatus: theme.storeStatus || 'open',
    vacationMessage: theme.vacationMessage || '',
    // Delivery & Shipping Fee Settings
    shippingType: theme.shippingType || 'above_amount',
    freeShippingThreshold: theme.freeShippingThreshold ?? 500,
    flatShippingFee: theme.flatShippingFee ?? 49,
    // Testimonials
    testimonialsEnabled: theme.testimonialsEnabled || false,
    testimonialsHeading: theme.testimonialsHeading || 'What Our Customers Say',
    testimonialsSubheading: theme.testimonialsSubheading || 'Trusted by 5,000+ businesses and individuals worldwide',
    testimonials: theme.testimonials || [
      { name: '', text: '', rating: 5, avatarUrl: '' },
      { name: '', text: '', rating: 5, avatarUrl: '' },
      { name: '', text: '', rating: 5, avatarUrl: '' },
    ],
    // Homepage Promotional Section
    promoSectionEnabled: theme.promoSectionEnabled !== false,
    promoLayout: theme.promoLayout || 'full_width',
    promoFullBanner: {
      imageUrl: theme.promoFullBanner?.imageUrl || '',
      clickAction: theme.promoFullBanner?.clickAction || 'shop',
      clickTarget: theme.promoFullBanner?.clickTarget || '',
    },
    promoCard1: {
      imageUrl: theme.promoCard1?.imageUrl || '',
      clickAction: theme.promoCard1?.clickAction || 'shop',
      clickTarget: theme.promoCard1?.clickTarget || '',
    },
    promoCard2: {
      imageUrl: theme.promoCard2?.imageUrl || '',
      clickAction: theme.promoCard2?.clickAction || 'shop',
      clickTarget: theme.promoCard2?.clickTarget || '',
    },
    // Custom Promo / CTA Banner Section
    ctaSectionEnabled: theme.ctaSectionEnabled || false,
    ctaImageUrl: theme.ctaImageUrl || '',
    ctaTitle: theme.ctaTitle || '',
    ctaSubtitle: theme.ctaSubtitle || '',
    ctaLink: theme.ctaLink || '',
    ctaBtnText: theme.ctaBtnText || 'Explore More',
    // Footer
    footerAbout: theme.footerAbout || '',
    footerAddress: theme.footerAddress || '',
    footerEmail: theme.footerEmail || '',
    footerPhone: theme.footerPhone || '',
    // Policies
    returnPolicy: theme.returnPolicy || '',
    shippingInfo: theme.shippingInfo || '',
    shippingPolicyText: theme.shippingPolicyText || '',
    returnPolicyText: theme.returnPolicyText || '',
    privacyPolicyText: theme.privacyPolicyText || '',
    termsPolicyText: theme.termsPolicyText || '',
    policyBlocks: theme.policyBlocks || { shipping: [], returns: [], privacy: [], terms: [] },
    // Category Showcase
    categoryShowcase: theme.categoryShowcase !== false,
    // Trust Badges
    trustBadgesEnabled: theme.trustBadgesEnabled !== false,
    trustBadgesHeading: theme.trustBadgesHeading || 'Built for Your Peace of Mind',
    trustBadgesSubheading: theme.trustBadgesSubheading || 'Trusted by 5,000+ businesses and individuals worldwide',
    trustBadges: (theme.trustBadges || ['secure_payment', 'fast_delivery', 'easy_returns', 'quality']).slice(0, 4),
    trustBadgeItems: theme.trustBadgeItems || {},
    // Custom CSS
    customCss: theme.customCss || '',
    // About Page Sections & Stats
    aboutStoryEnabled: theme.aboutStoryEnabled !== false,
    aboutStoryTag: theme.aboutStoryTag || 'OUR STORY',
    aboutStoryTitle: theme.aboutStoryTitle || 'Built With Passion,\nDriven By You',
    aboutStoryImage: theme.aboutStoryImage || '/images/store-about-story.png',
    aboutSignatureText: theme.aboutSignatureText || 'Thank you for being part of our journey.',
    aboutPara1: theme.aboutPara1 || '',
    aboutPara2: theme.aboutPara2 || '',
    aboutStatsEnabled: theme.aboutStatsEnabled !== false,
    aboutStats: theme.aboutStats || [
      { id: 'customers', iconName: 'users', value: '50K+', label: 'Happy Customers' },
      { id: 'products', iconName: 'shopping-bag', value: '10K+', label: 'Products Sold' },
      { id: 'countries', iconName: 'globe', value: '25+', label: 'Countries Delivered' },
      { id: 'feedback', iconName: 'award', value: '99%', label: 'Positive Feedback' },
    ],
  })

  const [selectedPolicyKey, setSelectedPolicyKey] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>('shipping')

  const uploadViaApi = async (file: File, folder: string = 'settings'): Promise<string> => {
    const apiFormData = new FormData()
    apiFormData.append('file', file)
    apiFormData.append('folder', folder)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: apiFormData
    })

    const data = await res.json()
    if (!res.ok || !data.success || !data.url) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.url
  }

  const handleBadgeIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, badgeId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Image must be less than 5MB.' })
      return
    }

    setUploadingField(`badge_${badgeId}`)
    try {
      const uploadedUrl = await uploadViaApi(file, 'badges')

      setFormData(prev => ({
        ...prev,
        trustBadgeItems: {
          ...(prev.trustBadgeItems || {}),
          [badgeId]: { ...(prev.trustBadgeItems?.[badgeId] || {}), iconUrl: uploadedUrl }
        }
      }))
      toast.success('Badge icon updated')
    } catch (err: any) {
      toast.error('Unable to upload icon', { description: err.message })
    } finally {
      setUploadingField(null)
    }
  }

  const updateTrustBadgeItem = (badgeId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      trustBadgeItems: {
        ...(prev.trustBadgeItems || {}),
        [badgeId]: { ...(prev.trustBadgeItems?.[badgeId] || {}), [field]: value }
      }
    }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    setUploadingField(fieldName)
    try {
      const uploadedUrl = await uploadViaApi(file, fieldName)

      setFormData(prev => ({ ...prev, [fieldName]: uploadedUrl }))
      toast.success('Image uploaded')
    } catch (err: any) {
      console.error('Upload error:', err)
      toast.error('Unable to upload image', {
        description: err.message || 'Check your file and try again.',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const handleMultipleBannersUpload = async (e: React.ChangeEvent<HTMLInputElement>, replaceIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    const fieldKey = replaceIndex !== undefined ? `heroBanners-${replaceIndex}` : 'heroBanners-new'
    setUploadingField(fieldKey)

    try {
      const uploadedUrl = await uploadViaApi(file, 'banners')

      setFormData(prev => {
        const currentBanners = [...(prev.heroBanners || [])]
        const defaultAction = 'shop'
        const defaultLink = '#products'

        if (replaceIndex !== undefined && currentBanners[replaceIndex]) {
          currentBanners[replaceIndex] = {
            ...currentBanners[replaceIndex],
            imageUrl: uploadedUrl
          }
        } else {
          currentBanners.push({
            id: `banner-${Date.now()}`,
            imageUrl: uploadedUrl,
            clickAction: defaultAction,
            link: defaultLink
          })
        }

        return {
          ...prev,
          heroBanners: currentBanners,
          heroImageUrl: currentBanners[0]?.imageUrl || uploadedUrl,
          heroCtaLink: currentBanners[0]?.link || defaultLink,
          heroBannerClickAction: currentBanners[0]?.clickAction || defaultAction
        }
      })

      toast.success(replaceIndex !== undefined ? 'Banner image updated' : 'Banner image added')
    } catch (err: any) {
      console.error('Upload error:', err)
      toast.error('Unable to upload banner', {
        description: err.message || 'Check your file and try again.',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const updateBannerItem = (index: number, updates: Partial<HeroBannerItem>) => {
    setFormData(prev => {
      const updatedBanners = [...(prev.heroBanners || [])]
      if (updatedBanners[index]) {
        updatedBanners[index] = { ...updatedBanners[index], ...updates }
      }
      return {
        ...prev,
        heroBanners: updatedBanners,
        ...(index === 0 ? {
          heroImageUrl: updates.imageUrl !== undefined ? updates.imageUrl : prev.heroImageUrl,
          heroCtaLink: updates.link !== undefined ? updates.link : prev.heroCtaLink,
          heroBannerClickAction: updates.clickAction !== undefined ? updates.clickAction : prev.heroBannerClickAction,
        } : {})
      }
    })
  }

  const removeBannerItem = (index: number) => {
    setFormData(prev => {
      const updatedBanners = (prev.heroBanners || []).filter((_: any, i: number) => i !== index)
      return {
        ...prev,
        heroBanners: updatedBanners,
        heroImageUrl: updatedBanners[0]?.imageUrl || '',
        heroCtaLink: updatedBanners[0]?.link || '#products',
        heroBannerClickAction: updatedBanners[0]?.clickAction || 'shop'
      }
    })
  }

  const updateMobileBannerItem = (index: number, updates: Partial<HeroBannerItem>) => {
    setFormData(prev => {
      const currentList: HeroBannerItem[] = prev.heroMobileBanners || (prev.heroMobileImages || []).map((img: string) => ({ imageUrl: img, link: '#products', clickAction: 'shop' }))
      const updatedList = [...currentList]
      if (updatedList[index]) {
        updatedList[index] = { ...updatedList[index], ...updates }
      }
      return {
        ...prev,
        heroMobileBanners: updatedList,
        heroMobileImages: updatedList.map(b => b.imageUrl),
        heroMobileImageUrl: updatedList[0]?.imageUrl || ''
      }
    })
  }

  const updateShowcaseBannerItem = (index: number, updates: Partial<HeroBannerItem>) => {
    setFormData(prev => {
      const currentList: HeroBannerItem[] = prev.heroShowcaseBanners || (prev.heroImages || []).map((img: string) => ({ imageUrl: img, link: '#products', clickAction: 'shop' }))
      const updatedList = [...currentList]
      if (updatedList[index]) {
        updatedList[index] = { ...updatedList[index], ...updates }
      }
      return {
        ...prev,
        heroShowcaseBanners: updatedList,
        heroImages: updatedList.map(b => b.imageUrl)
      }
    })
  }

  const handleMultipleMobileImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    setUploadingField('heroMobileImages')
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `heroMobileImages-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      const uploadedUrl = urlData.publicUrl

      setFormData(prev => {
        const currentList: HeroBannerItem[] = prev.heroMobileBanners || (prev.heroMobileImages || []).map((img: string) => ({ imageUrl: img, link: '#products', clickAction: 'shop' }))
        const newItem: HeroBannerItem = { imageUrl: uploadedUrl, link: '#products', clickAction: 'shop' }
        const updatedList = [...currentList, newItem].slice(0, 4)
        return {
          ...prev,
          heroMobileBanners: updatedList,
          heroMobileImages: updatedList.map(b => b.imageUrl),
          heroMobileImageUrl: updatedList[0]?.imageUrl || ''
        }
      })
      toast.success('Mobile banner added')
    } catch (err: any) {
      console.error('Upload error:', err)
      toast.error('Unable to upload image', {
        description: err.message || 'Check your file and try again.',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const removeMobileHeroImage = (index: number) => {
    setFormData(prev => {
      const currentList: HeroBannerItem[] = prev.heroMobileBanners || (prev.heroMobileImages || []).map((img: string) => ({ imageUrl: img, link: '#products', clickAction: 'shop' }))
      const updatedList = currentList.filter((_: any, i: number) => i !== index)
      return {
        ...prev,
        heroMobileBanners: updatedList,
        heroMobileImages: updatedList.map(b => b.imageUrl),
        heroMobileImageUrl: updatedList[0]?.imageUrl || ''
      }
    })
  }

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    setUploadingField('heroImages')
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `heroImages-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      const uploadedUrl = urlData.publicUrl

      setFormData(prev => {
        const currentList: HeroBannerItem[] = prev.heroShowcaseBanners || (prev.heroImages || []).map((img: string) => ({ imageUrl: img, link: '#products', clickAction: 'shop' }))
        const newItem: HeroBannerItem = { imageUrl: uploadedUrl, link: '#products', clickAction: 'shop' }
        const updatedList = [...currentList, newItem].slice(0, 5)
        return {
          ...prev,
          heroShowcaseBanners: updatedList,
          heroImages: updatedList.map(b => b.imageUrl)
        }
      })
      toast.success('Showcase image added')
    } catch (err: any) {
      console.error('Upload error:', err)
      toast.error('Unable to upload image', {
        description: err.message || 'Check your file and try again.',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const removeHeroImage = (index: number) => {
    setFormData(prev => {
      const currentList: HeroBannerItem[] = prev.heroShowcaseBanners || (prev.heroImages || []).map((img: string) => ({ imageUrl: img, link: '#products', clickAction: 'shop' }))
      const updatedList = currentList.filter((_: any, i: number) => i !== index)
      return {
        ...prev,
        heroShowcaseBanners: updatedList,
        heroImages: updatedList.map(b => b.imageUrl)
      }
    })
  }

  const handlePromoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'promoFullBanner' | 'promoCard1' | 'promoCard2') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    setUploadingField(targetField)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${targetField}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      const uploadedUrl = urlData.publicUrl

      setFormData(prev => ({
        ...prev,
        [targetField]: {
          ...(prev[targetField] || {}),
          imageUrl: uploadedUrl
        }
      }))

      toast.success('Promotional image uploaded')
    } catch (err: any) {
      console.error('Upload error:', err)
      toast.error('Unable to upload image', {
        description: err.message || 'Check your file and try again.',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const updatePromoItem = (targetField: 'promoFullBanner' | 'promoCard1' | 'promoCard2', updates: Partial<PromoItem>) => {
    setFormData(prev => ({
      ...prev,
      [targetField]: {
        ...(prev[targetField] || {}),
        ...updates
      }
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name: string, val: boolean) => {
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const updateTestimonial = (index: number, field: string, value: string | number) => {
    const updated = [...formData.testimonials]
    updated[index] = { ...updated[index], [field]: value }
    setFormData(prev => ({ ...prev, testimonials: updated }))
  }

  const handleTestimonialAvatarUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    const fieldKey = `testimonial_avatar_${index}`
    setUploadingField(fieldKey)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `testimonial-avatar-${index}-${Date.now()}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      const uploadedUrl = urlData.publicUrl

      updateTestimonial(index, 'avatarUrl', uploadedUrl)
      toast.success('Avatar uploaded')
    } catch (err: any) {
      console.error('Testimonial image upload error:', err)
      toast.error('Unable to upload avatar', {
        description: err.message || 'Check your file and try again.',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = new FormData()
      data.append('userId', profile.id)
      data.append('shop_slug', formData.shop_slug)
      data.append('shop_description', formData.shop_description)
      data.append('shop_logo_url', formData.shop_logo_url)
      data.append('upi_id', formData.upi_id)
      data.append('upi_name', formData.upi_name)
      data.append('upi_instructions', formData.upi_instructions)
      
      // Pack everything else into shop_theme JSON
      const { shop_slug, shop_description, shop_logo_url, upi_id, upi_name, upi_instructions, ...themeData } = formData
      data.append('shop_theme', JSON.stringify(themeData))

      const result = await updateShopSettings(data)
      if (result.success) {
        toast.success('Settings saved', { description: 'Your store settings have been updated.' })
        router.refresh()
      } else {
        toast.error('Unable to save settings', { description: result.message || 'Check your information and try again.' })
      }
    })
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'appearance', label: 'Design', icon: Palette },
    { id: 'hero', label: 'Hero Banner', icon: PanelTop },
    { id: 'promo', label: 'Promotional Section', icon: Megaphone },
    { id: 'offer-banner', label: 'Offer Banner', icon: Tag },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'trust-badges', label: 'Trust Badges', icon: Shield },
    { id: 'about-us', label: 'About Us', icon: BookOpen },
    { id: 'policies', label: 'Customer Policies', icon: Shield },
    { id: 'social', label: 'Social & Chat', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'footer', label: 'Footer', icon: MapPin },
  ]

  const handleSelectTab = (tabId: string) => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab)
    const nextIndex = tabs.findIndex(t => t.id === tabId)
    if (nextIndex !== currentIndex && nextIndex !== -1) {
      setSlideDirection(nextIndex > currentIndex ? 1 : -1)
    }
    setActiveTab(tabId)
    sessionStorage.setItem('resellerpro_shop_tab', tabId)
    setIsMobileGridOpen(false)

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const el = document.getElementById('shop-settings-active-section')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 50)
    }
  }

  const currentTabIdx = tabs.findIndex(t => t.id === activeTab)
  const currentTab = tabs[currentTabIdx >= 0 ? currentTabIdx : 0]
  const CurrentTabIcon = currentTab.icon

  const handlePrevTab = () => {
    if (currentTabIdx > 0) {
      handleSelectTab(tabs[currentTabIdx - 1].id)
    }
  }

  const handleNextTab = () => {
    if (currentTabIdx < tabs.length - 1) {
      handleSelectTab(tabs[currentTabIdx + 1].id)
    }
  }

  useEffect(() => {
    if (bottomNavRef.current) {
      const activeEl = bottomNavRef.current.querySelector('[data-active="true"]') as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      {/* ═══════════════ PREMIUM UPSELL ═══════════════ */}
      {!isEligible && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 p-6 md:p-8">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-2xl" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950/30"><Crown className="h-6 w-6 text-indigo-600 dark:text-indigo-400" /></div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">PRO Feature</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">Launch Your Online Store 🚀</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Build a <strong>Shopify-level online store</strong> with hero banners, testimonials, trust badges, custom footer, floating WhatsApp chat, and more — all with your own
                <code className="bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded mx-1 text-indigo-600 dark:text-indigo-400 text-xs font-mono">resellerpro.in/store/{formData.shop_slug || 'your-store'}</code>
                URL!
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {[
                  { icon: PanelTop, text: 'Hero Banner Builder' },
                  { icon: Quote, text: 'Customer Testimonials' },
                  { icon: Shield, text: 'Trust Badges' },
                  { icon: MessageCircle, text: 'WhatsApp Chat Widget' },
                  { icon: Search, text: 'SEO Optimization' },
                  { icon: Palette, text: 'Full Theme Control' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center"><Icon className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /></div>
                    <span className="font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <Link href="/settings/subscription">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 group">
                  <Rocket className="w-4 h-4 mr-2" /> Upgrade to Professional <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:block w-64 shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-500 flex flex-col items-center justify-center">
                  <span className="text-white font-black text-sm">{profile.business_name || 'Your Store'}</span>
                  <span className="text-white/70 text-[10px]">Premium Online Store</span>
                </div>
                <div className="p-3 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-1"><div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-3/4" /><div className="h-2 bg-slate-100 dark:bg-slate-800 rounded w-1/2" /></div>
                    </div>
                  ))}
                </div>
                <div className="p-3 pt-0">
                  <div className="h-8 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-3 h-3 text-indigo-400 mr-1" />
                    <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold">Upgrade to Unlock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ LIVE STATUS BANNER ═══════════════ */}
      {isEligible && formData.shop_slug && (
        <div className={cn(
          "relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all shadow-sm",
          formData.storeStatus === 'open' 
            ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-slate-900/40 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-slate-900/80' 
            : formData.storeStatus === 'vacation' 
            ? 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900/40 dark:from-amber-950/40 dark:via-slate-900/60 dark:to-slate-900/80' 
            : 'border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-slate-900/40 dark:from-rose-950/40 dark:via-slate-900/60 dark:to-slate-900/80'
        )}>
          <div className={cn(
            "absolute -right-10 -bottom-10 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none",
            formData.storeStatus === 'open' ? 'bg-emerald-500' : formData.storeStatus === 'vacation' ? 'bg-amber-500' : 'bg-rose-500'
          )} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={cn(
                "p-2.5 rounded-xl border flex items-center justify-center shrink-0 shadow-sm",
                formData.storeStatus === 'open' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : formData.storeStatus === 'vacation' 
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              )}>
                {formData.storeStatus === 'open' ? <Globe className="h-5 w-5" /> :
                 formData.storeStatus === 'vacation' ? <Loader2 className="h-5 w-5" /> :
                 <Lock className="h-5 w-5" />}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
                    {formData.storeStatus === 'open' ? 'Store is LIVE' : formData.storeStatus === 'vacation' ? 'Vacation Mode' : 'Store Closed'}
                  </h4>
                  {formData.storeStatus === 'open' && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      Online
                    </span>
                  )}
                  {formData.storeStatus === 'vacation' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shrink-0">
                      Pause
                    </span>
                  )}
                  {formData.storeStatus === 'closed' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shrink-0">
                      Offline
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium flex-wrap min-w-0">
                  <span className="font-mono text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-300/50 dark:border-slate-700/50 text-[11px] truncate max-w-full">
                    {storeUrlPrefix}{formData.shop_slug}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                    {productCount} {productCount === 1 ? 'product' : 'products'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
              <a
                href={`/store/${formData.shop_slug}`}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-2 text-xs font-bold px-4 py-2.5 sm:py-2 rounded-xl transition-all shadow-sm active:scale-95 w-full sm:w-auto",
                  formData.storeStatus === 'open'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    : formData.storeStatus === 'vacation'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Visit Store</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB NAVIGATION ═══════════════ */}
      {/* Mobile View: 3-Column Grid of Boxes */}
      <div id="shop-settings-mobile-grid" className="block md:hidden scroll-mt-6">
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-inner">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none min-h-[70px] gap-1.5 active:scale-95 text-center",
                  isActive
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-slate-200/60 dark:shadow-indigo-600/30 border border-slate-200/80 dark:border-indigo-500/40 ring-1 ring-indigo-500/20"
                    : "bg-white/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-800/80 border-transparent"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-colors shrink-0", isActive ? "text-indigo-600 dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                <span className="text-[11px] leading-tight line-clamp-2">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop View: Horizontal Scrollable Slide Bar */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 py-1">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md min-w-max shadow-inner">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer select-none",
                  isActive
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md shadow-slate-200/60 dark:shadow-indigo-600/30 border border-slate-200/80 dark:border-indigo-500/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 transition-colors", isActive ? "text-indigo-600 dark:text-white" : "text-slate-400 dark:text-slate-500")} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 md:pb-0">
        <div id="shop-settings-active-section" className="relative overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: -35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 35 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* ═══════════════ TAB: GENERAL ═══════════════ */}
              {activeTab === 'general' && (
                <GeneralTabSection
                  formData={formData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  handleFileUpload={handleFileUpload}
                  storeUrlPrefix={storeUrlPrefix}
                  uploadingField={uploadingField}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: PAYMENT METHODS ═══════════════ */}
              {activeTab === 'payment' && (
                <PaymentTabSection
                  formData={formData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  planName={planName}
                  isPending={isPending}
                />
              )}

              {/* ═══════════════ TAB: DESIGN ═══════════════ */}
              {activeTab === 'appearance' && (
                <AppearanceTabSection
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                />
              )}

              {/* ═══════════════ TAB: HERO BANNER ═══════════════ */}
              {activeTab === 'hero' && (
                <HeroTabSection
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  handleMultipleBannersUpload={handleMultipleBannersUpload}
                  updateBannerItem={updateBannerItem}
                  removeBannerItem={removeBannerItem}
                  handleMultipleMobileImagesUpload={handleMultipleMobileImagesUpload}
                  updateMobileBannerItem={updateMobileBannerItem}
                  removeMobileHeroImage={removeMobileHeroImage}
                  handleMultipleImagesUpload={handleMultipleImagesUpload}
                  updateShowcaseBannerItem={updateShowcaseBannerItem}
                  removeHeroImage={removeHeroImage}
                  categoryList={categoryList}
                  productList={productList}
                  categories={categories}
                  products={products}
                  uploadingField={uploadingField}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: PROMOTIONAL SECTION ═══════════════ */}
              {activeTab === 'promo' && (
                <PromoTabSection
                  formData={formData}
                  setFormData={setFormData}
                  handleToggle={handleToggle}
                  handlePromoFileUpload={handlePromoFileUpload}
                  updatePromoItem={updatePromoItem}
                  categoryList={categoryList}
                  productList={productList}
                  uploadingField={uploadingField}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: OFFER BANNER ═══════════════ */}
              {activeTab === 'offer-banner' && (
                <OfferBannerSection
                  formData={formData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: NEWSLETTER ═══════════════ */}
              {activeTab === 'newsletter' && (
                <NewsletterBannerSection
                  formData={formData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: TESTIMONIALS ═══════════════ */}
              {activeTab === 'testimonials' && (
                <TestimonialsSection
                  formData={formData}
                  setFormData={setFormData}
                  handleToggle={handleToggle}
                  updateTestimonial={updateTestimonial}
                  handleTestimonialAvatarUpload={handleTestimonialAvatarUpload}
                  uploadingField={uploadingField}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: TRUST BADGES ═══════════════ */}
              {activeTab === 'trust-badges' && (
                <TrustBadgesSection
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  updateTrustBadgeItem={updateTrustBadgeItem}
                  handleBadgeIconUpload={handleBadgeIconUpload}
                  uploadingField={uploadingField}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: ABOUT US ═══════════════ */}
              {activeTab === 'about-us' && (
                <AboutUsSections
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  handleFileUpload={handleFileUpload}
                  uploadingField={uploadingField}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: CUSTOMER POLICIES ═══════════════ */}
              {activeTab === 'policies' && (
                <PoliciesTabSection
                  formData={formData}
                  setFormData={setFormData}
                  selectedPolicyKey={selectedPolicyKey}
                  setSelectedPolicyKey={setSelectedPolicyKey}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: SOCIAL & CHAT ═══════════════ */}
              {activeTab === 'social' && (
                <SocialTabSection
                  formData={formData}
                  handleChange={handleChange}
                  handleToggle={handleToggle}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: SEO ═══════════════ */}
              {activeTab === 'seo' && (
                <SeoTabSection
                  formData={formData}
                  handleChange={handleChange}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}

              {/* ═══════════════ TAB: FOOTER ═══════════════ */}
              {activeTab === 'footer' && (
                <FooterTabSection
                  formData={formData}
                  handleChange={handleChange}
                  isPending={isPending}
                  isEligible={isEligible}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>



        {/* ═══════════════ SAVE BAR ═══════════════ */}
        <div className="fixed md:sticky bottom-16 md:bottom-[-32px] left-0 right-0 md:left-auto md:right-auto bg-white dark:bg-slate-900 border-t md:border border-slate-200 dark:border-slate-800 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-4 z-40 md:z-30 rounded-t-2xl md:rounded-2xl shadow-xl md:-mx-6">
          <div className="text-xs text-slate-500 dark:text-slate-400 w-full md:w-auto text-center md:text-left">
            {formData.shop_slug && isEligible && (
              <a href={`/store/${formData.shop_slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1.5 py-0.5">
                <Eye className="w-3.5 h-3.5" /> Preview Store <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending} className="flex-1 md:flex-none h-9 text-xs font-medium">Cancel</Button>
            <Button type="submit" disabled={isPending} className="flex-1 md:flex-none h-9 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white shadow-sm">
              {isPending ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...</> : <>Save Settings</>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
