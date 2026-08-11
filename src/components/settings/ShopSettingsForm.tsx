'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import {
  Loader2, Palette, Globe, Info, ExternalLink, Sparkles,
  Crown, Lock, ShoppingBag, Layout, Type, Image as ImageIcon,
  Share2, Search, Bell, Eye, Rocket, ArrowRight, Check,
  Instagram, Facebook, Twitter, MessageCircle, Youtube,
  Star, MapPin, Mail, Phone, Clock, Zap,
  Monitor, Smartphone, PanelTop, Quote, Shield, Sun, Moon,
  Truck, RotateCcw, HeartHandshake, ChevronRight, Upload,
  Plus, Trash2, ListPlus, FileText, BookOpen, BarChart3, User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateShopSettings } from '@/app/(dashboard)/settings/actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import HeadlessSettingsForm from '@/components/settings/HeadlessSettingsForm'

import type { HeroBannerItem, PromoItem, PolicyBlock } from '@/types'

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
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState('general')
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [previewBannerIndex, setPreviewBannerIndex] = useState(0)

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
    trustBadges: theme.trustBadges || ['secure_payment', 'fast_delivery', 'easy_returns', 'quality', 'support', 'authentic'],
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

  const [selectedBadgeId, setSelectedBadgeId] = useState<string>('secure_payment')
  const [selectedPolicyKey, setSelectedPolicyKey] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>('shipping')

  const handleAddPolicyBlock = (pkey: string) => {
    const newBlock = {
      id: `pblk_${Date.now()}`,
      heading: 'New Policy Section',
      icon: 'shield',
      description: 'Enter your section description here...',
      points: [],
    }
    setFormData(prev => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: [...(prev.policyBlocks?.[pkey] || []), newBlock],
      }
    }))
  }

  const handleUpdatePolicyBlock = (pkey: string, blockId: string, updates: Partial<PolicyBlock>) => {
    setFormData(prev => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => b.id === blockId ? { ...b, ...updates } : b),
      }
    }))
  }

  const handleDeletePolicyBlock = (pkey: string, blockId: string) => {
    setFormData(prev => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).filter((b: PolicyBlock) => b.id !== blockId),
      }
    }))
  }

  const handleAddPolicyPoint = (pkey: string, blockId: string) => {
    setFormData(prev => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => {
          if (b.id !== blockId) return b
          return { ...b, points: [...(b.points || []), 'New policy point detail'] }
        }),
      }
    }))
  }

  const handleUpdatePolicyPoint = (pkey: string, blockId: string, idx: number, val: string) => {
    setFormData(prev => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => {
          if (b.id !== blockId) return b
          const updatedPoints = [...(b.points || [])]
          updatedPoints[idx] = val
          return { ...b, points: updatedPoints }
        }),
      }
    }))
  }

  const handleDeletePolicyPoint = (pkey: string, blockId: string, idx: number) => {
    setFormData(prev => ({
      ...prev,
      policyBlocks: {
        ...(prev.policyBlocks || {}),
        [pkey]: (prev.policyBlocks?.[pkey] || []).map((b: PolicyBlock) => {
          if (b.id !== blockId) return b
          return { ...b, points: (b.points || []).filter((_, i) => i !== idx) }
        }),
      }
    }))
  }

  const renderPolicySectionManager = (pkey: 'shipping' | 'returns' | 'privacy' | 'terms') => {
    const blocks: PolicyBlock[] = formData.policyBlocks?.[pkey] || []
    const routesMap = {
      shipping: '/shipping-policy',
      returns: '/return-policy',
      privacy: '/privacy-policy',
      terms: '/terms',
    }
    const titlesMap = {
      shipping: 'Shipping & Delivery Policy Page',
      returns: 'Return & Refund Policy Page',
      privacy: 'Privacy Policy Page',
      terms: 'Terms & Conditions Page',
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 block">
              {titlesMap[pkey]}
            </span>
            <p className="text-[11px] text-slate-500">
              Add headings, subheadings, descriptions, and bullet points. Edit or delete any section.
            </p>
          </div>
          <a
            href={`/store/${formData.shop_slug}${routesMap[pkey]}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            View Live Page <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Section Blocks List */}
        <div className="space-y-4">
          {blocks.map((block: PolicyBlock, idx: number) => (
            <div
              key={block.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <select
                    value={block.icon || 'shield'}
                    onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { icon: e.target.value })}
                    className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300"
                  >
                    <option value="truck">🚚 Truck</option>
                    <option value="rotate">🔄 Return</option>
                    <option value="shield">🛡️ Shield</option>
                    <option value="clock">⏰ Clock</option>
                    <option value="check">✅ Check</option>
                    <option value="lock">🔒 Lock</option>
                    <option value="file">📄 Document</option>
                  </select>
                  <Input
                    value={block.heading}
                    onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { heading: e.target.value })}
                    placeholder="Section Heading Title..."
                    className="text-xs font-bold h-9"
                    disabled={isPending || !isEligible}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePolicyBlock(pkey, block.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Subheading (Optional) */}
              <div>
                <Label className="text-[11px] font-semibold text-slate-500 mb-1 block">Subheading (Optional)</Label>
                <Input
                  value={block.subheading || ''}
                  onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { subheading: e.target.value })}
                  placeholder="e.g. 100% Verified & Hassle-Free"
                  className="text-xs h-8"
                  disabled={isPending || !isEligible}
                />
              </div>

              {/* Description Paragraph */}
              <div>
                <Label className="text-[11px] font-semibold text-slate-500 mb-1 block">Description Paragraph</Label>
                <Textarea
                  value={block.description || ''}
                  onChange={(e) => handleUpdatePolicyBlock(pkey, block.id, { description: e.target.value })}
                  placeholder="Write section explanation text..."
                  rows={2}
                  className="text-xs"
                  disabled={isPending || !isEligible}
                />
              </div>

              {/* Bullet Points */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Bullet Points / List Items</Label>
                  <button
                    type="button"
                    onClick={() => handleAddPolicyPoint(pkey, block.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <ListPlus className="w-3.5 h-3.5" /> Add Point
                  </button>
                </div>
                {(block.points || []).map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs">•</span>
                    <Input
                      value={pt}
                      onChange={(e) => handleUpdatePolicyPoint(pkey, block.id, pIdx, e.target.value)}
                      placeholder={`Point #${pIdx + 1}...`}
                      className="text-xs h-8 flex-1"
                      disabled={isPending || !isEligible}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePolicyPoint(pkey, block.id, pIdx)}
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Section Button */}
        <Button
          type="button"
          onClick={() => handleAddPolicyBlock(pkey)}
          variant="outline"
          className="w-full py-2.5 border-dashed border-2 border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Policy Section
        </Button>
      </div>
    )
  }

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
      toast({ title: 'File too large', description: 'Image must be less than 5MB', variant: 'destructive' })
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
      toast({ title: 'Icon Uploaded 🎉', description: 'Custom badge icon saved!' })
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.message, variant: 'destructive' })
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
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      })
      return
    }

    setUploadingField(fieldName)
    try {
      const uploadedUrl = await uploadViaApi(file, fieldName)

      setFormData(prev => ({ ...prev, [fieldName]: uploadedUrl }))
      toast({
        title: 'Upload Successful 🎉',
        description: 'Image uploaded and updated in settings.',
      })
    } catch (err: any) {
      console.error('Upload error:', err)
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload image.',
        variant: 'destructive',
      })
    } finally {
      setUploadingField(null)
    }
  }

  const handleMultipleBannersUpload = async (e: React.ChangeEvent<HTMLInputElement>, replaceIndex?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
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

      toast({
        title: replaceIndex !== undefined ? 'Banner Image Updated! 🎉' : 'Banner Added! 🎉',
        description: replaceIndex !== undefined ? 'Banner image has been changed.' : 'New promotional banner uploaded successfully.',
      })
    } catch (err: any) {
      console.error('Upload error:', err)
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload banner image.',
        variant: 'destructive',
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
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
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
      toast({
        title: 'Mobile Banner Added! 🎉',
        description: 'New mobile banner uploaded successfully.',
      })
    } catch (err: any) {
      console.error('Upload error:', err)
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload image.',
        variant: 'destructive',
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
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
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
      toast({
        title: 'Image Added! 🎉',
        description: 'New product showcase image uploaded successfully.',
      })
    } catch (err: any) {
      console.error('Upload error:', err)
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload image.',
        variant: 'destructive',
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
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
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

      toast({
        title: 'Upload Successful 🎉',
        description: 'Promotional image uploaded successfully.',
      })
    } catch (err: any) {
      console.error('Upload error:', err)
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload promotional image.',
        variant: 'destructive',
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

  const renderClickActionFields = (
    label: string,
    targetField: 'promoFullBanner' | 'promoCard1' | 'promoCard2',
    item: PromoItem
  ) => {
    return (
      <div className="space-y-3">
        <div>
          <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click Action ({label})</Label>
          <select
            value={item?.clickAction || 'shop'}
            onChange={(e) => updatePromoItem(targetField, { clickAction: e.target.value as any, clickTarget: '' })}
            className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="shop">Shop Page (All Products)</option>
            <option value="category">Category</option>
            <option value="product">Product</option>
            <option value="collection">Collection (Future)</option>
            <option value="custom_url">Custom URL</option>
          </select>
        </div>

        {item?.clickAction === 'category' && (
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Destination Category</Label>
            {categoryList.length > 0 ? (
              <select
                value={item?.clickTarget || ''}
                onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Category --</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">No store categories found. Add products with categories first.</p>
            )}
          </div>
        )}

        {item?.clickAction === 'product' && (
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Destination Product</Label>
            {productList.length > 0 ? (
              <select
                value={item?.clickTarget || ''}
                onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Product --</option>
                {productList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-1">No products found in store. Add products to catalog first.</p>
            )}
          </div>
        )}

        {item?.clickAction === 'custom_url' && (
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Destination URL</Label>
            <Input
              placeholder="https://example.com/promo or /store/my-shop/shop"
              value={item?.clickTarget || ''}
              onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
              className="mt-1 text-xs"
            />
          </div>
        )}
      </div>
    )
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
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
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
      toast({
        title: 'Avatar Uploaded 🎉',
        description: 'Customer image uploaded successfully.',
      })
    } catch (err: any) {
      console.error('Testimonial image upload error:', err)
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload image.',
        variant: 'destructive',
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
        toast({ title: 'Success ✨', description: 'Store settings saved!' })
        router.refresh()
      } else {
        toast({ title: 'Error', description: result.message || 'Failed to save', variant: 'destructive' })
      }
    })
  }

  const isHeadlessMode = (profile as any).store_mode === 'headless'

  const allTabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Design', icon: Palette },
    { id: 'hero', label: 'Hero Banner', icon: PanelTop },
    { id: 'promo', label: 'Promotional Section', icon: Sparkles },
    { id: 'sections', label: 'Sections', icon: Layout },
    { id: 'policies', label: 'Customer Policies', icon: Shield },
    { id: 'social', label: 'Social & Chat', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'footer', label: 'Footer', icon: MapPin },
    { id: 'headless', label: 'Headless Settings', icon: Zap },
  ]

  const tabs = isHeadlessMode
    ? allTabs.filter(t => ['general', 'headless', 'seo'].includes(t.id))
    : allTabs

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
          {/* Subtle background glow effect */}
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
                 formData.storeStatus === 'vacation' ? <Clock className="h-5 w-5" /> :
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
      <div className="overflow-x-auto scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); sessionStorage.setItem('resellerpro_shop_tab', tab.id); }}
                className={cn("inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap",
                  activeTab === tab.id ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300')}>
                <Icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ═══════════════ TAB: GENERAL ═══════════════ */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Section icon={Globe} title="Store URL">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-lg text-slate-500 dark:text-slate-400 text-sm shrink-0">
                    {storeUrlPrefix}
                  </div>
                  <Input id="shop_slug" name="shop_slug" value={formData.shop_slug} onChange={handleChange} placeholder="your-shop-name" className="rounded-l-none" disabled={isPending} />
                </div>
                <p className="text-xs text-muted-foreground">Lowercase letters, numbers, hyphens only.</p>
              </div>
            </Section>

            <Section icon={Info} title="Store Description">
              <Textarea name="shop_description" value={formData.shop_description} onChange={handleChange}
                placeholder="Tell customers about your business..." rows={3} disabled={isPending} />
            </Section>

            <Section icon={Smartphone} title="GPay / UPI Payment Details">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    UPI ID / GPay Mobile Number
                  </Label>
                  <Input
                    name="upi_id"
                    value={formData.upi_id || ''}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210@okbizaxis or 9876543210"
                    className="mt-1 text-xs sm:text-sm font-mono"
                    disabled={isPending}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    This UPI ID / GPay number is automatically sent to buyers when they choose "Pay via UPI" at checkout.
                  </p>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Account Holder / GPay Name
                  </Label>
                  <Input
                    name="upi_name"
                    value={formData.upi_name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Royal Fashion Store"
                    className="mt-1 text-xs sm:text-sm"
                    disabled={isPending}
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Payment Instructions / Custom Note (Optional)
                  </Label>
                  <Textarea
                    name="upi_instructions"
                    value={formData.upi_instructions || ''}
                    onChange={handleChange}
                    placeholder="e.g. Accepting GPay, PhonePe, Paytm transfers..."
                    rows={2}
                    className="mt-1 text-xs"
                    disabled={isPending}
                  />
                </div>
              </div>
            </Section>

            <Section icon={ImageIcon} title="Store Logo">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    {formData.shop_logo_url ? (
                      <img src={formData.shop_logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-750" />
                    )}
                    {uploadingField === 'shop_logo_url' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="shop_logo_file" className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-250 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Logo
                    </label>
                    <input
                      id="shop_logo_file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'shop_logo_url')}
                      className="hidden"
                      disabled={isPending || uploadingField !== null}
                    />
                    {formData.shop_logo_url && (
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, shop_logo_url: '' }))}
                        className="text-xs text-red-500 font-bold block hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Square image (e.g. 500x500 px) recommended. Max 5MB.</p>
                  </div>
                </div>
                {formData.shop_logo_url && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <ToggleRow 
                      label="Logo includes shop name" 
                      description="Hide the plain-text shop name next to the logo if your logo already contains the brand name" 
                      checked={formData.logoIncludesName} 
                      onChange={v => handleToggle('logoIncludesName', v)} 
                    />
                  </div>
                )}
              </div>
            </Section>

            <Section icon={Clock} title="Store Status" pro={!isEligible}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'open', label: 'Open', desc: 'Store visible & active' },
                  { value: 'vacation', label: 'Vacation', desc: 'Show vacation notice' },
                  { value: 'closed', label: 'Closed', desc: 'Hide store temporarily' },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => handleToggle('storeStatus', opt.value as any)}
                    className={cn("p-3 rounded-xl border-2 text-left transition-all",
                      formData.storeStatus === opt.value 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' 
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700')}
                    disabled={!isEligible}>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{opt.desc}</p>
                  </button>
                ))}
              </div>
              {formData.storeStatus === 'vacation' && (
                <div className="mt-3">
                  <Label>Vacation Message</Label>
                  <Input name="vacationMessage" value={formData.vacationMessage} onChange={handleChange}
                    placeholder="We'll be back on March 30! 🏖️" disabled={isPending || !isEligible} className="mt-1.5" />
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: DESIGN ═══════════════ */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Branding & Theme Colors */}
            <Section icon={Palette} title="Store Colors & Theme">
              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Customize the visual colors for your storefront elements. Click a color box or select a preset palette below.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Primary Brand Color"
                    description="Main action buttons (Buy Now, Add to Cart), links & active tabs."
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, primaryColor: v }))}
                    presets={['#4f46e5', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#0891b2']}
                  />
                  <ColorPicker
                    label="Secondary Hover Color"
                    description="Navigation hover highlights, sub-headers & secondary buttons."
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, secondaryColor: v }))}
                    presets={['#4338ca', '#047857', '#b91c1c', '#c2410c', '#6d28d9', '#0369a1']}
                  />
                  <ColorPicker
                    label="Accent & Promo Highlight"
                    description="Sale tags, discount badges, offer banners & notification badges."
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, accentColor: v }))}
                    presets={['#f97316', '#eab308', '#ec4899', '#14b8a6', '#8b5cf6', '#f43f5e']}
                  />
                  <ColorPicker
                    label="Dark Background & Titles"
                    description="Dark sections, footer backdrop, main titles & hero text."
                    name="neutralDarkColor"
                    value={formData.neutralDarkColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, neutralDarkColor: v }))}
                    presets={['#0f172a', '#1e293b', '#334155', '#18181b', '#27272a', '#171717']}
                  />
                  <ColorPicker
                    label="Top Header Background"
                    description="Background color of your store's top navigation bar."
                    name="navbarBgColor"
                    value={formData.navbarBgColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, navbarBgColor: v }))}
                    presets={['#ffffff', '#f8fafc', '#0f172a', '#1e293b', '#4f46e5', '#059669']}
                  />
                  <ColorPicker
                    label="Header Text & Icons"
                    description="Color for header menu items, search bar icon & cart icon."
                    name="navbarTextColor"
                    value={formData.navbarTextColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, navbarTextColor: v }))}
                    presets={['#0f172a', '#334155', '#ffffff', '#e2e8f0', '#4f46e5', '#ffffff']}
                  />
                </div>
              </div>
            </Section>

            {/* Layout & Typography */}
            <Section icon={Layout} title="Layout & Typography">
              <div className="space-y-6">


                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <Label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Button Shape</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'rounded', label: 'Rounded', radius: 'rounded-lg' },
                        { value: 'pill', label: 'Pill', radius: 'rounded-full' },
                        { value: 'sharp', label: 'Square', radius: 'rounded-none' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, buttonStyle: opt.value }))}
                          className={cn(
                            "py-2 px-2 text-xs font-bold border transition-all text-center",
                            opt.radius,
                            formData.buttonStyle === opt.value
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fontFamily" className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Font Family</Label>
                    <select
                      id="fontFamily"
                      name="fontFamily"
                      value={formData.fontFamily}
                      onChange={handleChange}
                      className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 px-3 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
                    >
                      <option value="default">System Default</option>
                      <option value="inter">Inter (Clean & Modern)</option>
                      <option value="poppins">Poppins (Friendly)</option>
                      <option value="playfair">Playfair (Elegant Luxury)</option>
                      <option value="roboto">Roboto (Professional)</option>
                      <option value="outfit">Outfit (Bold & Contemporary)</option>
                    </select>
                  </div>
                </div>
              </div>
            </Section>

            {/* Display Options */}
            <Section icon={Eye} title="Display Options">
              <div className="space-y-3">
                <ToggleRow label="Show Prices" description="Display product prices publicly on storefront" checked={formData.showPrices} onChange={v => handleToggle('showPrices', v)} />
                <ToggleRow label="WhatsApp Buy Button" description="Show 'Buy on WhatsApp' button on product pages" checked={formData.showWhatsApp} onChange={v => handleToggle('showWhatsApp', v)} />
                <ToggleRow label="Category Showcase" description="Show visual category cards on store homepage" checked={formData.categoryShowcase} onChange={v => handleToggle('categoryShowcase', v)} />
              </div>
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: HERO BANNER ═══════════════ */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <Section icon={PanelTop} title="Hero Banner Customization" pro={!isEligible}>
              <ToggleRow label="Enable Hero Banner" description="Show custom hero layout on your storefront" checked={formData.heroEnabled} onChange={v => handleToggle('heroEnabled', v)} disabled={!isEligible} />
              {formData.heroEnabled && (
                <div className="space-y-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">

                  {/* ── Visual Layout Selector ───────────────────────── */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Choose Your Hero Layout</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Card 1: Product Showcase Hero */}
                      <button
                        type="button"
                        onClick={() => !isEligible ? undefined : setFormData(prev => ({ ...prev, heroTemplate: 'split' }))}
                        disabled={!isEligible}
                        className={cn(
                          "group relative rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 focus:outline-none",
                          formData.heroTemplate === 'split'
                            ? "border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_4px_rgba(99,102,241,0.25)]"
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg",
                          !isEligible && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {/* Mini Preview Mockup */}
                        <div className="relative bg-slate-950 px-4 pt-4 pb-2 flex gap-3 overflow-hidden min-h-[110px]">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.18),transparent_60%)]" />
                          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:14px_14px]" />
                          {/* Left text column */}
                          <div className="relative z-10 flex flex-col gap-1.5 flex-1 justify-center">
                            <div className="w-14 h-1.5 bg-white/25 rounded-full" />
                            <div className="w-24 h-2.5 bg-white/80 rounded-full" />
                            <div className="w-20 h-2 bg-white/40 rounded-full" />
                            <div className="flex gap-1.5 mt-1">
                              <div className="h-5 w-12 rounded-md bg-white" />
                              <div className="h-5 w-12 rounded-md border border-white/30" />
                            </div>
                            <div className="flex gap-2 mt-0.5">
                              <div className="w-8 h-1 bg-white/20 rounded-full" />
                              <div className="w-8 h-1 bg-white/20 rounded-full" />
                              <div className="w-8 h-1 bg-white/20 rounded-full" />
                            </div>
                          </div>
                          {/* Right image column */}
                          <div className="relative z-10 w-16 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-xl">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/30 to-white/10" />
                            </div>
                          </div>
                        </div>
                        {/* Card Footer */}
                        <div className="px-4 py-3 bg-white dark:bg-slate-900 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-black text-sm text-slate-900 dark:text-white">Product Showcase Hero</span>
                              {formData.heroTemplate === 'split' && (
                                <span className="shrink-0 flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                  <Check className="w-2.5 h-2.5" /> Selected
                                </span>
                              )}
                            </div>
                            <span className="inline-block text-[9px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full mb-1.5">✦ Best for Products</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Interactive product showcase with CTA and sliding product images.</p>
                          </div>
                        </div>
                      </button>

                      {/* Card 2: Promotion Banner */}
                      <button
                        type="button"
                        onClick={() => !isEligible ? undefined : setFormData(prev => ({ ...prev, heroTemplate: 'banner' }))}
                        disabled={!isEligible}
                        className={cn(
                          "group relative rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 focus:outline-none",
                          formData.heroTemplate === 'banner'
                            ? "border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_4px_rgba(99,102,241,0.25)]"
                            : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg",
                          !isEligible && "opacity-60 cursor-not-allowed"
                        )}
                      >
                        {/* Mini Preview Mockup */}
                        <div className="relative min-h-[110px] overflow-hidden bg-gradient-to-br from-rose-500 via-orange-500 to-yellow-400 flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/10" />
                          {formData.heroImageUrl && formData.heroTemplate === 'banner' ? (
                            <img src={formData.heroImageUrl} alt="Banner preview" className="w-full h-full object-cover absolute inset-0" />
                          ) : (
                            <div className="relative z-10 flex flex-col items-center gap-2 px-6">
                              <div className="w-32 h-2 bg-white/80 rounded-full" />
                              <div className="w-20 h-1.5 bg-white/50 rounded-full" />
                              <div className="mt-1 w-16 h-4 rounded-lg bg-white/30 border border-white/50" />
                            </div>
                          )}
                        </div>
                        {/* Card Footer */}
                        <div className="px-4 py-3 bg-white dark:bg-slate-900 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-black text-sm text-slate-900 dark:text-white">Promotion Banner</span>
                              {formData.heroTemplate === 'banner' && (
                                <span className="shrink-0 flex items-center gap-1 text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                                  <Check className="w-2.5 h-2.5" /> Selected
                                </span>
                              )}
                            </div>
                            <span className="inline-block text-[9px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 px-2 py-0.5 rounded-full mb-1.5">✦ Best for Offers</span>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Upload your Canva/promo design. Click anywhere on banner goes to your chosen destination.</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* ── Common Setting: Mobile Banner ──────────── */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <Label className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                          <span className="text-sm font-black">Mobile Banner</span>
                        </Label>
                        <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          Upload up to 4 dedicated mobile banner images optimized specifically for mobile screens (&lt; 1024px). Displays regardless of chosen hero layout.
                        </p>
                      </div>
                      {(formData.heroMobileImages || (formData.heroMobileImageUrl ? [formData.heroMobileImageUrl] : [])).length < 4 && (
                        <label
                          htmlFor="hero_mobile_images_file"
                          className={cn(
                            "cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-sm",
                            (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                          )}
                        >
                          {uploadingField === 'heroMobileImages' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          Add Mobile Banner
                        </label>
                      )}
                      <input
                        id="hero_mobile_images_file"
                        type="file"
                        accept="image/*"
                        onChange={handleMultipleMobileImagesUpload}
                        className="hidden"
                        disabled={!isEligible || uploadingField !== null}
                      />
                    </div>

                    {(formData.heroMobileBanners || []).length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-white/50 dark:bg-slate-950/50">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">No mobile banners uploaded yet</p>
                        <p className="text-[10px] text-slate-400">Upload up to 4 mobile banner images — configure distinct destination links for each.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(formData.heroMobileBanners || []).map((banner: HeroBannerItem, idx: number) => {
                          const actionType = banner.clickAction || 'shop';
                          return (
                            <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black">
                                    {idx + 1}
                                  </span>
                                  Mobile Banner {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeMobileHeroImage(idx)}
                                  className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                {/* Thumbnail */}
                                <div className="md:col-span-4 flex items-center gap-3">
                                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                                    <img src={banner.imageUrl} alt={`Mobile Banner ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                  </div>
                                  <p className="text-[9px] text-slate-400">Mobile Banner {idx + 1}</p>
                                </div>

                                {/* Click Action Destination */}
                                <div className="md:col-span-8 space-y-2">
                                  <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Click Action Destination</Label>
                                  <div className="grid grid-cols-3 gap-1">
                                    {[
                                      { value: 'shop', label: '🛍️ Shop' },
                                      { value: 'category', label: '🗂️ Cat.' },
                                      { value: 'product', label: '📱 Prod.' },
                                    ].map(opt => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => updateMobileBannerItem(idx, {
                                          clickAction: opt.value as any,
                                          link: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : banner.link
                                        })}
                                        disabled={!isEligible}
                                        className={cn(
                                          "py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all text-center",
                                          actionType === opt.value
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                            : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                                        )}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>

                                  {actionType === 'category' && (
                                    <select
                                      value={banner.link || ''}
                                      onChange={(e) => updateMobileBannerItem(idx, { link: e.target.value })}
                                      disabled={!isEligible}
                                      className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                    >
                                      <option value="">Select Category…</option>
                                      {categoryList.map(cat => (
                                        <option key={cat} value={`?category=${encodeURIComponent(cat)}`}>{cat}</option>
                                      ))}
                                      {categoryList.length === 0 && <option value="" disabled>No categories yet</option>}
                                    </select>
                                  )}

                                  {actionType === 'product' && (
                                    <select
                                      value={banner.link || ''}
                                      onChange={(e) => updateMobileBannerItem(idx, { link: e.target.value })}
                                      disabled={!isEligible}
                                      className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                    >
                                      <option value="">Select Product…</option>
                                      {productList.map(p => (
                                        <option key={p.id} value={`p/${p.id}`}>{p.name}</option>
                                      ))}
                                      {productList.length === 0 && <option value="" disabled>No products yet</option>}
                                    </select>
                                  )}

                                  {actionType === 'custom_url' && (
                                    <Input
                                      value={banner.link || ''}
                                      onChange={(e) => updateMobileBannerItem(idx, { link: e.target.value })}
                                      placeholder="https://your-custom-link.com"
                                      className="w-full h-8 text-xs bg-white dark:bg-slate-900"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ── Settings for Product Showcase Hero ──────────── */}
                  {formData.heroTemplate === 'split' && (
                    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                          Product Showcase Hero Settings
                        </span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                      </div>

                      {/* 1. Background Color */}
                      <ColorPicker
                        label="Hero Background Color"
                        description="Select a dark or rich background color for your desktop hero card."
                        name="heroBgColor"
                        value={formData.heroBgColor}
                        onChange={handleChange}
                        onSet={(v) => setFormData(p => ({ ...p, heroBgColor: v }))}
                        presets={['#0f172a', '#1e1b4b', '#0c0a09', '#052e16', '#450a0a', '#1e3a5f', '#18181b', '#0d1117']}
                      />

                      {/* 2. Text Content & Highlight Badge */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-indigo-600">📝</span> Hero Headline &amp; Subtitle
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Configure the top badge tag, main title, and subtext for desktop view.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs font-bold">Top Highlight Tag (Mini Badge)</Label>
                            <Input name="heroBadge" value={formData.heroBadge} onChange={handleChange}
                              placeholder="e.g. New Arrival" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                            <p className="text-[9px] text-slate-400 mt-1">Tag shown above main title</p>
                          </div>
                          <div>
                            <Label className="text-xs font-bold">Main Headline</Label>
                            <Input name="heroTitle" value={formData.heroTitle} onChange={handleChange}
                              placeholder="e.g. Premium Quality. Timeless Style." disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                            <p className="text-[9px] text-slate-400 mt-1">Main banner heading title</p>
                          </div>
                          <div>
                            <Label className="text-xs font-bold">Subtitle</Label>
                            <Input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange}
                              placeholder="e.g. Discover premium products at best prices" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                            <p className="text-[9px] text-slate-400 mt-1">Short tagline under headline</p>
                          </div>
                        </div>
                      </div>

                      {/* 3. Action Buttons (CTA) */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-indigo-600">🔘</span> Action Button (CTA)
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Button displayed on the hero banner (defaults to your shop page).</p>
                        </div>

                        <div>
                          <Label className="text-xs font-bold block mb-1.5">Select Primary Button Label</Label>
                          <div className="flex items-center gap-2 flex-wrap">
                            {['Shop Now', 'Explore Now'].map(preset => {
                              const isSelected = (formData.heroCtaText || 'Shop Now') === preset
                              return (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setFormData(p => ({ ...p, heroCtaText: preset }))}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs",
                                    isSelected
                                      ? "bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20"
                                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                                  )}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                  {preset}
                                </button>
                              )
                            })}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                            Selected button label: <strong className="text-slate-900 dark:text-white">{formData.heroCtaText || 'Shop Now'}</strong> (links directly to shop page).
                          </p>
                        </div>
                      </div>

                      {/* 4. Trust Badges & Guarantee Labels */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-indigo-600">🛡</span> Trust &amp; Guarantee Badges
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">3 trust signals displayed below action buttons to build customer confidence.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs font-bold">Trust Badge 1</Label>
                            <Input name="heroBadge1" value={formData.heroBadge1} onChange={handleChange}
                              placeholder="e.g. Free Shipping" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                          </div>
                          <div>
                            <Label className="text-xs font-bold">Trust Badge 2</Label>
                            <Input name="heroBadge2" value={formData.heroBadge2} onChange={handleChange}
                              placeholder="e.g. Easy Returns" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                          </div>
                          <div>
                            <Label className="text-xs font-bold">Trust Badge 3</Label>
                            <Input name="heroBadge3" value={formData.heroBadge3} onChange={handleChange}
                              placeholder="e.g. COD Available" disabled={isPending || !isEligible} className="mt-1 text-xs h-9" />
                          </div>
                        </div>
                      </div>

                      {/* Product Showcase Images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <Label>Product Showcase Images <span className="text-slate-400 font-normal">(up to 5 — auto-slides)</span></Label>
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono font-semibold text-[9px] tracking-wider">
                                300 × 300 px
                              </span>
                              Square PNG/JPG recommended &middot; transparent background works best &middot; max 5 MB
                            </p>
                          </div>
                          {(formData.heroImages || []).length < 5 && (
                            <label
                              htmlFor="hero_images_file"
                              className={cn(
                                "cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors",
                                (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                              )}
                            >
                              {uploadingField === 'heroImages' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              Add Image
                            </label>
                          )}
                          <input
                            id="hero_images_file"
                            type="file"
                            accept="image/*"
                            onChange={handleMultipleImagesUpload}
                            className="hidden"
                            disabled={!isEligible || uploadingField !== null}
                          />
                        </div>

                        {(formData.heroShowcaseBanners || []).length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-white/50 dark:bg-slate-950/50">
                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No images added yet</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">Upload up to 5 product showcase images — configure distinct click targets for each.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(formData.heroShowcaseBanners || []).map((banner: HeroBannerItem, idx: number) => {
                              const actionType = banner.clickAction || 'shop';
                              return (
                                <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-3 shadow-2xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black">
                                        {idx + 1}
                                      </span>
                                      Showcase Image {idx + 1}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removeHeroImage(idx)}
                                      className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                    {/* Thumbnail */}
                                    <div className="md:col-span-4 flex items-center gap-3">
                                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
                                        <img src={banner.imageUrl} alt={`Showcase Image ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                      </div>
                                      <p className="text-[9px] text-slate-400">Showcase Image {idx + 1}</p>
                                    </div>

                                    {/* Click Action Destination */}
                                    <div className="md:col-span-8 space-y-2">
                                      <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Click Action Destination</Label>
                                      <div className="grid grid-cols-3 gap-1">
                                        {[
                                          { value: 'shop', label: '🛍️ Shop' },
                                          { value: 'category', label: '🗂️ Cat.' },
                                          { value: 'product', label: '📱 Prod.' },
                                        ].map(opt => (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => updateShowcaseBannerItem(idx, {
                                              clickAction: opt.value as any,
                                              link: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : banner.link
                                            })}
                                            disabled={!isEligible}
                                            className={cn(
                                              "py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all text-center",
                                              actionType === opt.value
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                                : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                                            )}
                                          >
                                            {opt.label}
                                          </button>
                                        ))}
                                      </div>

                                      {actionType === 'category' && (
                                        <select
                                          value={banner.link || ''}
                                          onChange={(e) => updateShowcaseBannerItem(idx, { link: e.target.value })}
                                          disabled={!isEligible}
                                          className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                        >
                                          <option value="">Select Category…</option>
                                          {categoryList.map(cat => (
                                            <option key={cat} value={`?category=${encodeURIComponent(cat)}`}>{cat}</option>
                                          ))}
                                          {categoryList.length === 0 && <option value="" disabled>No categories yet</option>}
                                        </select>
                                      )}

                                      {actionType === 'product' && (
                                        <select
                                          value={banner.link || ''}
                                          onChange={(e) => updateShowcaseBannerItem(idx, { link: e.target.value })}
                                          disabled={!isEligible}
                                          className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                        >
                                          <option value="">Select Product…</option>
                                          {productList.map(p => (
                                            <option key={p.id} value={`p/${p.id}`}>{p.name}</option>
                                          ))}
                                          {products.length === 0 && <option value="" disabled>No products yet</option>}
                                        </select>
                                      )}

                                      {actionType === 'custom_url' && (
                                        <Input
                                          value={banner.link || ''}
                                          onChange={(e) => updateShowcaseBannerItem(idx, { link: e.target.value })}
                                          placeholder="https://your-custom-link.com"
                                          className="w-full h-8 text-xs bg-white dark:bg-slate-900"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Live Preview */}
                      <div className="rounded-2xl overflow-hidden bg-slate-950 text-white p-5 relative border border-slate-800">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />
                        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                        <p className="relative z-10 text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Live Preview</p>
                        <div className="relative z-10 grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-8 space-y-2 text-left">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-white/10 text-slate-200 border border-white/5">
                              {formData.heroBadge || 'New Arrival'}
                            </span>
                            <h2 className="text-base font-black tracking-tight leading-tight text-white">{formData.heroTitle || 'Premium Quality. Timeless Style.'}</h2>
                            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{formData.heroSubtitle || 'Discover our new collection of premium products.'}</p>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              <span className="px-3 py-1.5 bg-white text-slate-950 font-black text-[10px] rounded-lg shadow-sm">{formData.heroCtaText || 'Shop Now'}</span>
                            </div>
                            <div className="flex items-center gap-3 pt-2 border-t border-white/10 text-slate-400 text-[8px] font-bold">
                              <span>✓ {formData.heroBadge1 || 'Free Shipping'}</span>
                              <span>✓ {formData.heroBadge2 || 'Easy Returns'}</span>
                              <span>✓ {formData.heroBadge3 || 'COD Available'}</span>
                            </div>
                          </div>
                          <div className="col-span-4 flex justify-center">
                            {/* Showcase image rendered directly without background card */}
                            <div className="relative w-full max-w-[110px] h-20 sm:h-24 rounded-xl overflow-hidden shadow-xl flex items-center justify-center">
                              {(formData.heroImages || []).length > 0 ? (
                                <img src={formData.heroImages[0]} className="w-full h-full object-cover" alt="Mockup" />
                              ) : (
                                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop" className="w-full h-full object-cover" alt="Default Product" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Settings for Promotion Banner (Multi-Banner Slider & Destinations) ── */}
                  {formData.heroTemplate === 'banner' && (
                    <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">Promotion Banner Carousel & Navigation</span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                      </div>

                      {/* Banner List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Desktop Banners</Label>
                            <p className="text-[11px] text-slate-500">Upload single or multiple promo banners — they will auto-slide on your storefront carousel.</p>
                            <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-mono font-semibold text-[9px] tracking-wider">
                                1200 × 480 px
                              </span>
                              Wide landscape image &middot; JPG/PNG/WebP &middot; max 5 MB
                            </p>
                          </div>
                          <label
                            htmlFor="hero_banner_multi_file"
                            className={cn(
                              "cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm",
                              (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                            )}
                          >
                            {uploadingField === 'heroBanners-new' ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            Add New Banner
                          </label>
                          <input
                            id="hero_banner_multi_file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMultipleBannersUpload(e)}
                            className="hidden"
                            disabled={!isEligible || uploadingField !== null}
                          />
                        </div>

                        {(formData.heroBanners || []).length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center bg-slate-50/50 dark:bg-slate-900/30">
                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">No Banners Uploaded Yet</p>
                            <p className="text-[11px] text-slate-400 max-w-sm">Upload promotional banner graphics created in Canva, ChatGPT, or Photoshop. Each banner can link directly to a product, category, or offer page.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(formData.heroBanners || []).map((banner: HeroBannerItem, idx: number) => {
                              const actionType = banner.clickAction || 'shop'
                              return (
                                <div key={banner.id || idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                                        {idx + 1}
                                      </span>
                                      <span className="font-bold text-xs text-slate-900 dark:text-white">Promotional Banner {idx + 1}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeBannerItem(idx)}
                                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                    {/* Image Preview & Change */}
                                    <div className="md:col-span-5 flex gap-3 items-center">
                                      <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shrink-0">
                                        <img src={banner.imageUrl} alt={`Banner ${idx + 1}`} className="w-full h-full object-cover" />
                                        {uploadingField === `heroBanners-${idx}` && (
                                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <label
                                          htmlFor={`change_banner_file_${idx}`}
                                          className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors"
                                        >
                                          <Upload className="w-3 h-3" />
                                          Change Image
                                        </label>
                                        <input
                                          id={`change_banner_file_${idx}`}
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleMultipleBannersUpload(e, idx)}
                                          className="hidden"
                                          disabled={!isEligible || uploadingField !== null}
                                        />
                                        <p className="text-[9px] text-slate-400 mt-1">1920×600 px recommended</p>
                                      </div>
                                    </div>

                                    {/* Click Action & Target */}
                                    <div className="md:col-span-7 space-y-2">
                                      <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Click Action Destination</Label>
                                      <div className="grid grid-cols-3 gap-1">
                                        {[
                                          { value: 'shop', label: '🛍️ Shop' },
                                          { value: 'category', label: '🗂️ Cat.' },
                                          { value: 'product', label: '📱 Prod.' },
                                        ].map(opt => (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => updateBannerItem(idx, {
                                              clickAction: opt.value as any,
                                              link: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : ''
                                            })}
                                            disabled={!isEligible}
                                            className={cn(
                                              "py-1.5 px-1 text-[10px] font-bold rounded-lg border transition-all text-center",
                                              actionType === opt.value
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                                                : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                                            )}
                                          >
                                            {opt.label}
                                          </button>
                                        ))}
                                      </div>

                                      {/* Target Selector / Input */}
                                      {actionType === 'category' && (
                                        <select
                                          value={banner.link || ''}
                                          onChange={(e) => updateBannerItem(idx, { link: e.target.value })}
                                          disabled={!isEligible}
                                          className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                        >
                                          <option value="">Select Category…</option>
                                          {categories.map(cat => (
                                            <option key={cat} value={`?category=${encodeURIComponent(cat)}`}>{cat}</option>
                                          ))}
                                          {categories.length === 0 && <option value="" disabled>No categories yet</option>}
                                        </select>
                                      )}

                                      {actionType === 'product' && (
                                        <select
                                          value={banner.link || ''}
                                          onChange={(e) => updateBannerItem(idx, { link: e.target.value })}
                                          disabled={!isEligible}
                                          className="w-full h-8 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 text-xs bg-white dark:bg-slate-900 dark:text-slate-100"
                                        >
                                          <option value="">Select Product…</option>
                                          {products.map(p => (
                                            <option key={p.id} value={`p/${p.id}`}>{p.name}</option>
                                          ))}
                                          {products.length === 0 && <option value="" disabled>No products yet</option>}
                                        </select>
                                      )}

                                      {actionType === 'custom_url' && (
                                        <Input
                                          value={banner.link || ''}
                                          onChange={(e) => updateBannerItem(idx, { link: e.target.value })}
                                          placeholder="https://your-custom-link.com"
                                          disabled={!isEligible}
                                          className="h-8 text-xs"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              )}
            </Section>

            <Section icon={Bell} title="Announcement Banner" pro={!isEligible}>
              <ToggleRow label="Enable Banner" description="Top marquee banner for promotions" checked={formData.bannerEnabled} onChange={v => handleToggle('bannerEnabled', v)} disabled={!isEligible} />
              {formData.bannerEnabled && (
                <div className="mt-3">
                  <Input name="bannerText" value={formData.bannerText} onChange={handleChange}
                    placeholder="🎉 Free shipping on orders above ₹500!" disabled={isPending || !isEligible} />
                  {formData.bannerText && (
                    <div className="mt-3 rounded-lg overflow-hidden border">
                      <div className="py-2 px-4 text-center text-xs font-bold text-white" style={{ backgroundColor: formData.primaryColor }}>{formData.bannerText}</div>
                    </div>
                  )}
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: PROMOTIONAL SECTION ═══════════════ */}
        {activeTab === 'promo' && (
          <div className="space-y-6">
            <Section icon={Sparkles} title="Homepage Promotional Section" pro={!isEligible}>
              <ToggleRow
                label="Enable Promotional Section"
                description="Show a high-impact promotional section on your storefront homepage between Featured Products and Best Sellers."
                checked={formData.promoSectionEnabled}
                onChange={v => handleToggle('promoSectionEnabled', v)}
                disabled={!isEligible}
              />

              {formData.promoSectionEnabled && (
                <div className="space-y-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Choose Layout */}
                  <div>
                    <Label className="text-sm font-bold text-slate-900 dark:text-slate-100 block mb-2">
                      Choose Layout
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Option 1: Full Width Banner */}
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, promoLayout: 'full_width' }))}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3",
                          formData.promoLayout === 'full_width'
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                            ○ Full Width Banner
                          </span>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            formData.promoLayout === 'full_width'
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 dark:border-slate-700"
                          )}>
                            {formData.promoLayout === 'full_width' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="w-full h-12 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">100% Full Width Banner</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Single high-impact banner image spanning the container width. Complete banner is clickable.
                        </p>
                      </button>

                      {/* Option 2: Two Promotional Cards */}
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, promoLayout: 'two_cards' }))}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3",
                          formData.promoLayout === 'two_cards'
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-md"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                            ○ Two Promotional Cards
                          </span>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            formData.promoLayout === 'two_cards'
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 dark:border-slate-700"
                          )}>
                            {formData.promoLayout === 'two_cards' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full h-12">
                          <div className="h-full rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Card 1</span>
                          </div>
                          <div className="h-full rounded-lg bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Card 2</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Two side-by-side promotional cards. Each card has its own image &amp; destination link.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Layout 1: Full Width Banner Controls */}
                  {formData.promoLayout === 'full_width' && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Full Width Banner Image &amp; Click Action
                      </h4>

                      <div>
                        <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">Banner Image</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative w-44 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {formData.promoFullBanner?.imageUrl ? (
                              <img src={formData.promoFullBanner.imageUrl} alt="Full Banner" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            )}
                            {uploadingField === 'promoFullBanner' && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="promo_full_file" className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              Upload Banner Image
                            </label>
                            <input
                              id="promo_full_file"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePromoFileUpload(e, 'promoFullBanner')}
                              className="hidden"
                              disabled={!isEligible || uploadingField !== null}
                            />
                            {formData.promoFullBanner?.imageUrl && (
                              <button
                                type="button"
                                onClick={() => updatePromoItem('promoFullBanner', { imageUrl: '' })}
                                className="text-xs text-red-500 font-bold block hover:underline"
                              >
                                Remove Image
                              </button>
                            )}
                            <p className="text-[10px] text-slate-400">Upload banner image created in Canva/Photoshop/AI. Max 5MB.</p>
                          </div>
                        </div>
                      </div>

                      {renderClickActionFields('Full Banner', 'promoFullBanner', formData.promoFullBanner)}
                    </div>
                  )}

                  {/* Layout 2: Two Promotional Cards Controls */}
                  {formData.promoLayout === 'two_cards' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Card 1 */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Card 1 (Left Card)
                        </h4>

                        <div>
                          <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">Card 1 Image</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              {formData.promoCard1?.imageUrl ? (
                                <img src={formData.promoCard1.imageUrl} alt="Card 1" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                              )}
                              {uploadingField === 'promoCard1' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="promo_card1_file" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                Upload Image
                              </label>
                              <input
                                id="promo_card1_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePromoFileUpload(e, 'promoCard1')}
                                className="hidden"
                                disabled={!isEligible || uploadingField !== null}
                              />
                              {formData.promoCard1?.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => updatePromoItem('promoCard1', { imageUrl: '' })}
                                  className="text-xs text-red-500 font-bold block hover:underline"
                                >
                                  Remove Image
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {renderClickActionFields('Card 1', 'promoCard1', formData.promoCard1)}
                      </div>

                      {/* Card 2 */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Card 2 (Right Card)
                        </h4>

                        <div>
                          <Label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 block">Card 2 Image</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              {formData.promoCard2?.imageUrl ? (
                                <img src={formData.promoCard2.imageUrl} alt="Card 2" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                              )}
                              {uploadingField === 'promoCard2' && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="promo_card2_file" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                Upload Image
                              </label>
                              <input
                                id="promo_card2_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePromoFileUpload(e, 'promoCard2')}
                                className="hidden"
                                disabled={!isEligible || uploadingField !== null}
                              />
                              {formData.promoCard2?.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => updatePromoItem('promoCard2', { imageUrl: '' })}
                                  className="text-xs text-red-500 font-bold block hover:underline"
                                >
                                  Remove Image
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {renderClickActionFields('Card 2', 'promoCard2', formData.promoCard2)}
                      </div>
                    </div>
                  )}

                  {/* Admin Live Preview Widget */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-300">Storefront Live Preview</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                        {formData.promoLayout === 'two_cards' ? 'Layout 2: Two Cards' : 'Layout 1: Full Width'}
                      </span>
                    </div>

                    {formData.promoLayout === 'two_cards' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-28 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <img
                            src={formData.promoCard1?.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80'}
                            alt="Preview Card 1"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="h-28 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 flex items-center justify-center">
                          <img
                            src={formData.promoCard2?.imageUrl || 'https://images.unsplash.com/photo-1490578474895-699bc4e2cf59?w=800&auto=format&fit=crop&q=80'}
                            alt="Preview Card 2"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <img
                          src={formData.promoFullBanner?.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80'}
                          alt="Preview Full Banner"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: SECTIONS ═══════════════ */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <Section icon={Sparkles} title="Special Promotion Banner" pro={!isEligible}>
              <ToggleRow
                label="Enable Special Promotion Banner"
                description="Show high-conversion offer banner strip on your store homepage"
                checked={formData.offerBannerEnabled}
                onChange={v => handleToggle('offerBannerEnabled', v)}
                disabled={!isEligible}
              />
              {formData.offerBannerEnabled && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Badge Label</Label>
                      <Input
                        name="offerBannerBadge"
                        value={formData.offerBannerBadge}
                        onChange={handleChange}
                        placeholder="⚡ Special Promotion"
                        disabled={isPending || !isEligible}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Coupon Code</Label>
                      <Input
                        name="offerBannerCode"
                        value={formData.offerBannerCode}
                        onChange={handleChange}
                        placeholder="SAVE10"
                        disabled={isPending || !isEligible}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Offer Headline</Label>
                    <Input
                      name="offerBannerTitle"
                      value={formData.offerBannerTitle}
                      onChange={handleChange}
                      placeholder="Limited Time Offer: Get 10% OFF on Orders Above ₹1,499"
                      disabled={isPending || !isEligible}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Subtext / Instructions</Label>
                      <Input
                        name="offerBannerSubtext"
                        value={formData.offerBannerSubtext}
                        onChange={handleChange}
                        placeholder="Use code SAVE10 at checkout."
                        disabled={isPending || !isEligible}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Button Text</Label>
                      <Input
                        name="offerBannerBtnText"
                        value={formData.offerBannerBtnText}
                        onChange={handleChange}
                        placeholder="Claim Offer Now"
                        disabled={isPending || !isEligible}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  {/* Banner Live Preview Box */}
                  <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</p>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          {formData.offerBannerBadge || '⚡ Special Promotion'}
                        </span>
                        <p className="text-sm font-black text-white leading-tight">
                          {formData.offerBannerTitle || 'Limited Time Offer: Get 10% OFF on Orders Above ₹1,499'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {formData.offerBannerSubtext || `Use code ${formData.offerBannerCode || 'SAVE10'} at checkout.`}
                        </p>
                      </div>
                      <span className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl whitespace-nowrap shadow-sm">
                        {formData.offerBannerBtnText || 'Claim Offer Now'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            <Section icon={Mail} title="VIP Circle / Newsletter Banner" pro={!isEligible}>
              <ToggleRow
                label="Enable VIP Circle Banner"
                description="Show subscription banner strip on your store homepage footer"
                checked={formData.newsletterEnabled}
                onChange={v => handleToggle('newsletterEnabled', v)}
                disabled={!isEligible}
              />
              {formData.newsletterEnabled && (
                <div className="space-y-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Banner Heading Title</Label>
                    <Input
                      name="newsletterTitle"
                      value={formData.newsletterTitle}
                      onChange={handleChange}
                      placeholder="JOIN OUR VIP CIRCLE"
                      disabled={isPending || !isEligible}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Banner Description Subtext</Label>
                    <Input
                      name="newsletterSubtitle"
                      value={formData.newsletterSubtitle}
                      onChange={handleChange}
                      placeholder="Subscribe to get exclusive discount codes, new arrival alerts, and special event invites."
                      disabled={isPending || !isEligible}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Input Placeholder Text</Label>
                      <Input
                        name="newsletterPlaceholder"
                        value={formData.newsletterPlaceholder}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        disabled={isPending || !isEligible}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Button Label</Label>
                      <Input
                        name="newsletterBtnText"
                        value={formData.newsletterBtnText}
                        onChange={handleChange}
                        placeholder="SUBSCRIBE"
                        disabled={isPending || !isEligible}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Banner Live Preview Box */}
                  <div className="mt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Live Preview</p>
                    <div className="p-6 md:p-8 rounded-2xl bg-[#1a1a1c] border border-slate-800 text-white">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="space-y-1.5 max-w-lg">
                          <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                            {formData.newsletterTitle || 'JOIN OUR VIP CIRCLE'}
                          </h3>
                          <p className="text-[13px] text-slate-400 leading-relaxed">
                            {formData.newsletterSubtitle || 'Subscribe to get exclusive discount codes, new arrival alerts, and special event invites.'}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                          <input
                            type="text"
                            placeholder={formData.newsletterPlaceholder || 'Enter your email address'}
                            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#0f0f11] border border-slate-800 text-white text-sm focus:outline-none placeholder:text-slate-600"
                            disabled
                          />
                          <button
                            type="button"
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wide whitespace-nowrap transition-colors shadow-lg shadow-indigo-900/20"
                            disabled
                          >
                            {formData.newsletterBtnText || 'SUBSCRIBE'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            <Section icon={Quote} title="Customer Testimonials" pro={!isEligible}>
              <ToggleRow label="Enable Testimonials" description="Show customer reviews on your store" checked={formData.testimonialsEnabled} onChange={v => handleToggle('testimonialsEnabled', v)} disabled={!isEligible} />
              {formData.testimonialsEnabled && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                    <div>
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Section Heading</Label>
                      <Input
                        placeholder="What Our Customers Say"
                        value={formData.testimonialsHeading || ''}
                        onChange={e => setFormData(prev => ({ ...prev, testimonialsHeading: e.target.value }))}
                        disabled={!isEligible}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Section Subheading</Label>
                      <Input
                        placeholder="Trusted by 5,000+ businesses and individuals worldwide"
                        value={formData.testimonialsSubheading || ''}
                        onChange={e => setFormData(prev => ({ ...prev, testimonialsSubheading: e.target.value }))}
                        disabled={!isEligible}
                      />
                    </div>
                  </div>

                  {formData.testimonials.map((t: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Testimonial {i + 1}</p>
                        {formData.testimonials.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.testimonials.filter((_: any, idx: number) => idx !== i)
                              setFormData(prev => ({ ...prev, testimonials: updated }))
                            }}
                            className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium transition-colors"
                            disabled={!isEligible}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Customer Avatar Upload */}
                        <div className="flex flex-col items-center gap-2 shrink-0 self-center sm:self-start">
                          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center relative group shadow-sm">
                            {t.avatarUrl ? (
                              <img src={t.avatarUrl} alt={t.name || `Customer ${i + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            )}
                            {uploadingField === `testimonial_avatar_${i}` && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => handleTestimonialAvatarUpload(i, e)}
                              disabled={!isEligible || uploadingField !== null}
                            />
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                              <Upload className="w-3 h-3" /> {t.avatarUrl ? 'Change' : 'Upload Image'}
                            </span>
                          </label>
                          {t.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => updateTestimonial(i, 'avatarUrl', '')}
                              className="text-[10px] text-red-500 hover:underline"
                              disabled={!isEligible}
                            >
                              Remove Image
                            </button>
                          )}
                        </div>

                        {/* Customer details */}
                        <div className="flex-1 space-y-2.5 w-full">
                          <Input placeholder="Customer name" value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} disabled={!isEligible} />
                          <Textarea placeholder="What they said about your products..." value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} rows={2} disabled={!isEligible} />
                          <div className="flex items-center gap-2 pt-1">
                            <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Rating:</Label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => updateTestimonial(i, 'rating', star)} disabled={!isEligible}>
                                  <Star className={cn("w-5 h-5 transition-colors", star <= (t.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700')} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        testimonials: [...prev.testimonials, { name: '', text: '', rating: 5, avatarUrl: '' }]
                      }))
                    }}
                    className="w-full py-2.5 px-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center gap-2"
                    disabled={!isEligible}
                  >
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </button>
                </div>
              )}
            </Section>


            <Section icon={Shield} title="Trust Badges" pro={!isEligible}>
              <ToggleRow label="Show Trust Badges" description="Display trust indicators below products" checked={formData.trustBadgesEnabled} onChange={v => handleToggle('trustBadgesEnabled', v)} disabled={!isEligible} />
              {formData.trustBadgesEnabled && (
                <div className="space-y-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Custom Badges List (Image Upload & Badge Name) */}
                  <div className="space-y-3">
                    {formData.trustBadges.map((badgeId: string, idx: number) => {
                      const badgePresets: Record<string, { label: string; icon: any }> = {
                        secure_payment: { label: 'Secure Payment', icon: Shield },
                        fast_delivery: { label: 'Fast Delivery', icon: Truck },
                        easy_returns: { label: 'Easy Returns', icon: RotateCcw },
                        quality: { label: 'Quality Assured', icon: Star },
                        support: { label: '24/7 Support', icon: HeartHandshake },
                        authentic: { label: '100% Authentic', icon: Check },
                      }
                      const preset = badgePresets[badgeId]
                      const customItem = formData.trustBadgeItems?.[badgeId] || {}
                      const badgeTitle = customItem.title !== undefined ? customItem.title : (preset?.label || `Badge ${idx + 1}`)
                      const IconComp = preset?.icon || Shield

                      return (
                        <div key={badgeId} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center gap-3">
                            {/* Image / Icon Preview */}
                            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0">
                              {customItem.iconUrl ? (
                                <img src={customItem.iconUrl} alt={badgeTitle} className="w-full h-full object-cover" />
                              ) : (
                                <IconComp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>

                            {/* Badge Name & Description Inputs */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <Label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Badge Name</Label>
                                <Input
                                  value={badgeTitle}
                                  onChange={(e) => updateTrustBadgeItem(badgeId, 'title', e.target.value)}
                                  placeholder="e.g. Fast Shipping"
                                  disabled={isPending || !isEligible}
                                  className="h-8 text-xs bg-white dark:bg-slate-950"
                                />
                              </div>
                              <div>
                                <Label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Description (Optional)</Label>
                                <Input
                                  value={customItem.description || ''}
                                  onChange={(e) => updateTrustBadgeItem(badgeId, 'description', e.target.value)}
                                  placeholder="e.g. 24-48 hr dispatch"
                                  disabled={isPending || !isEligible}
                                  className="h-8 text-xs bg-white dark:bg-slate-950"
                                />
                              </div>
                            </div>

                            {/* Action Buttons: Upload Image & Remove */}
                            <div className="flex items-center gap-2 shrink-0">
                              <label
                                htmlFor={`badge_file_${badgeId}`}
                                className={cn(
                                  "cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors",
                                  (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                                )}
                              >
                                {uploadingField === `badge_${badgeId}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                Upload Image
                              </label>
                              <input
                                id={`badge_file_${badgeId}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBadgeIconUpload(e, badgeId)}
                                className="hidden"
                                disabled={!isEligible || uploadingField !== null}
                              />

                              <button
                                type="button"
                                title="Remove Badge"
                                onClick={() => {
                                  setFormData(p => ({
                                    ...p,
                                    trustBadges: p.trustBadges.filter((id: string) => id !== badgeId)
                                  }))
                                }}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Add New Badge Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const newBadgeId = `badge-${Date.now()}`
                        setFormData(p => ({
                          ...p,
                          trustBadges: [...p.trustBadges, newBadgeId],
                          trustBadgeItems: {
                            ...(p.trustBadgeItems || {}),
                            [newBadgeId]: { title: 'New Badge', description: '', iconUrl: '' }
                          }
                        }))
                      }}
                      disabled={!isEligible}
                      className="w-full py-2.5 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Badge
                    </button>
                  </div>
                </div>
              )}
            </Section>

            {/* ─── ABOUT PAGE HEADER BANNER ─── */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50/30 to-card dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-card border border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/40">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">About Page Content</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Customize the story, image, and stats shown on your About Us page</p>
                </div>
              </div>
              {formData.shop_slug && (
                <a
                  href={`/store/${formData.shop_slug}/about`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl transition-colors shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View About Page
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* ─── ABOUT PAGE STORY SECTION ─── */}
            <Section icon={BookOpen} title="About Us Page - Story Section" pro={!isEligible}>
              <ToggleRow
                label="Enable Brand Story Section"
                description="Display your story content, main headline, bottom tagline, and image on your store About Us page"
                checked={formData.aboutStoryEnabled}
                onChange={v => handleToggle('aboutStoryEnabled', v)}
                disabled={!isEligible}
              />

              {formData.aboutStoryEnabled && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <Label>Main Headline</Label>
                    <Input
                      name="aboutStoryTitle"
                      value={formData.aboutStoryTitle}
                      onChange={handleChange}
                      placeholder="Built With Passion, Driven By You"
                      disabled={isPending || !isEligible}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>About Content / Narrative Text</Label>
                    <Textarea
                      name="aboutPara1"
                      value={formData.aboutPara1}
                      onChange={handleChange}
                      placeholder={`${formData.shop_slug || 'Your store'} was born out of a simple idea — to make every online shopping experience seamless, joyful, and trustworthy.`}
                      rows={3}
                      disabled={isPending || !isEligible}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Bottom Line / Signature Text</Label>
                    <Input
                      name="aboutSignatureText"
                      value={formData.aboutSignatureText}
                      onChange={handleChange}
                      placeholder="Thank you for being part of our journey."
                      disabled={isPending || !isEligible}
                      className="mt-1.5"
                    />
                  </div>

                  {/* Story Image Upload */}
                  <div>
                    <Label className="text-xs font-semibold mb-1.5 block">Story Banner Image</Label>
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {formData.aboutStoryImage ? (
                          <img src={formData.aboutStoryImage} alt="Story Image" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-400">
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">No image</span>
                          </div>
                        )}
                        {uploadingField === 'aboutStoryImage' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="about_story_image_file"
                          className={cn(
                            "cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors",
                            (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                          )}
                        >
                          {uploadingField === 'aboutStoryImage' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          Upload Story Image
                        </label>
                        <input
                          id="about_story_image_file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'aboutStoryImage')}
                          className="hidden"
                          disabled={!isEligible || uploadingField !== null}
                        />
                        {formData.aboutStoryImage && (
                          <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, aboutStoryImage: '' }))}
                            className="text-xs text-red-500 font-bold block hover:underline"
                          >
                            Remove Image
                          </button>
                        )}
                        <p className="text-[10px] text-slate-400">Landscape image recommended. Max 5MB.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            {/* ─── ABOUT PAGE STATS BANNER SECTION ─── */}
            <Section icon={BarChart3} title="About Us Page - Store Statistics Banner" pro={!isEligible}>
              <ToggleRow
                label="Enable Store Statistics Banner"
                description="Display key trust metrics (Customers, Products, Countries, Feedback) on your About Us page"
                checked={formData.aboutStatsEnabled}
                onChange={v => handleToggle('aboutStatsEnabled', v)}
                disabled={!isEligible}
              />

              {formData.aboutStatsEnabled && (
                <div className="space-y-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Customize the 4 key metrics displayed on the stats bar:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData.aboutStats || []).map((st: any, idx: number) => (
                      <div key={st.id || idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Metric #{idx + 1}
                        </span>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-[11px]">Big Value (Number)</Label>
                            <Input
                              value={st.value}
                              onChange={(e) => {
                                const val = e.target.value
                                setFormData(prev => {
                                  const updated = [...(prev.aboutStats || [])]
                                  updated[idx] = { ...updated[idx], value: val }
                                  return { ...prev, aboutStats: updated }
                                })
                              }}
                              placeholder="50K+"
                              disabled={isPending || !isEligible}
                              className="mt-1 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[11px]">Icon Style</Label>
                            <select
                              value={st.iconName || 'users'}
                              onChange={(e) => {
                                const val = e.target.value
                                setFormData(prev => {
                                  const updated = [...(prev.aboutStats || [])]
                                  updated[idx] = { ...updated[idx], iconName: val }
                                  return { ...prev, aboutStats: updated }
                                })
                              }}
                              disabled={isPending || !isEligible}
                              className="mt-1 w-full h-9 px-3 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none"
                            >
                              <option value="users">Users / Customers</option>
                              <option value="shopping-bag">Shopping Bag / Products</option>
                              <option value="globe">Globe / International</option>
                              <option value="award">Award / Star Feedback</option>
                              <option value="shield-check">Shield / Trust</option>
                              <option value="heart">Heart / Satisfaction</option>
                              <option value="truck">Truck / Shipping</option>
                              <option value="smile">Smile / Reviews</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-[11px]">Metric Label</Label>
                          <Input
                            value={st.label}
                            onChange={(e) => {
                              const val = e.target.value
                              setFormData(prev => {
                                const updated = [...(prev.aboutStats || [])]
                                updated[idx] = { ...updated[idx], label: val }
                                return { ...prev, aboutStats: updated }
                              })
                            }}
                            placeholder="Happy Customers"
                            disabled={isPending || !isEligible}
                            className="mt-1 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: CUSTOMER POLICIES ═══════════════ */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <Section icon={Shield} title="Customer Store Policies" pro={!isEligible}>
              <p className="text-xs text-slate-500 mb-4">
                Customize policy sections for each legal page on your online store. Select a policy page below to add headings, subheadings, descriptions, and bullet points.
              </p>

              {/* Policy Page Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { key: 'shipping', label: 'Shipping & Delivery', icon: Truck },
                  { key: 'returns', label: 'Return & Refund', icon: RotateCcw },
                  { key: 'privacy', label: 'Privacy Policy', icon: Shield },
                  { key: 'terms', label: 'Terms & Conditions', icon: Check },
                ].map((item) => {
                  const isSelected = selectedPolicyKey === item.key
                  const Icon = item.icon
                  return (
                    <button
                      key={item.key}
                      type="button"
                      disabled={!isEligible}
                      onClick={() => setSelectedPolicyKey(item.key as any)}
                      className={cn(
                        "p-3.5 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer",
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Render Section Block Manager */}
              {renderPolicySectionManager(selectedPolicyKey)}
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: SOCIAL & CHAT ═══════════════ */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <Section icon={MessageCircle} title="WhatsApp Chat Widget" pro={!isEligible}>
              <ToggleRow label="Floating Chat Button" description="Show WhatsApp chat button on all pages" checked={formData.chatWidgetEnabled} onChange={v => handleToggle('chatWidgetEnabled', v)} disabled={!isEligible} />
              {formData.chatWidgetEnabled && (
                <div className="mt-3 space-y-3">
                  <div>
                    <Label>WhatsApp Phone Number</Label>
                    <Input name="socialWhatsApp" value={formData.socialWhatsApp} onChange={handleChange}
                      placeholder="e.g. 9876543210 or +91 98765 43210" disabled={isPending || !isEligible} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Pre-filled Message</Label>
                    <Input name="chatWidgetMessage" value={formData.chatWidgetMessage} onChange={handleChange}
                      placeholder="Hi! I found your store online..." disabled={isPending || !isEligible} className="mt-1.5" />
                  </div>
                  <div className="mt-3 flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/30">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-800 dark:text-green-300">Chat Preview</p>
                      <p className="text-[10px] text-green-600 dark:text-green-400">This floating button appears on your store</p>
                    </div>
                  </div>
                </div>
              )}
            </Section>

            <Section icon={Share2} title="Social Media Links" pro={!isEligible}>
              <div className="grid sm:grid-cols-2 gap-4">
                <SocialInput icon={Instagram} label="Instagram" name="socialInstagram" value={formData.socialInstagram} onChange={handleChange} placeholder="@yourbusiness" disabled={isPending || !isEligible} />
                <SocialInput icon={Facebook} label="Facebook" name="socialFacebook" value={formData.socialFacebook} onChange={handleChange} placeholder="facebook.com/yourbusiness" disabled={isPending || !isEligible} />
                <SocialInput icon={Twitter} label="Twitter / X" name="socialTwitter" value={formData.socialTwitter} onChange={handleChange} placeholder="@yourbusiness" disabled={isPending || !isEligible} />
                <SocialInput icon={Youtube} label="YouTube" name="socialYoutube" value={formData.socialYoutube} onChange={handleChange} placeholder="youtube.com/@yourchannel" disabled={isPending || !isEligible} />
                <SocialInput icon={MessageCircle} label="WhatsApp" name="socialWhatsApp" value={formData.socialWhatsApp} onChange={handleChange} placeholder="+91 98765 43210" disabled={isPending || !isEligible} />
              </div>
            </Section>
          </div>
        )}

        {/* ═══════════════ TAB: SEO ═══════════════ */}
        {activeTab === 'seo' && (
          <Section icon={Search} title="SEO & Meta Tags" pro={!isEligible}>
            <div className="space-y-4">
              <div>
                <Label>SEO Title</Label>
                <Input name="seoTitle" value={formData.seoTitle} onChange={handleChange}
                  placeholder={`${profile.business_name || 'My Store'} — Best Products Online`}
                  disabled={isPending || !isEligible} maxLength={60} className="mt-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{formData.seoTitle.length}/60</p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2}
                  placeholder="Discover amazing products at great prices!"
                  disabled={isPending || !isEligible} maxLength={160} className="mt-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{formData.seoDescription.length}/160</p>
              </div>
              {(formData.seoTitle || formData.seoDescription) && (
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Google Preview</p>
                  <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">{formData.seoTitle || `${profile.business_name} | ResellerPro Store`}</p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs">resellerpro.in/store/{formData.shop_slug || 'your-store'}</p>
                  <p className="text-slate-600 dark:text-slate-350 text-xs mt-0.5 line-clamp-2">{formData.seoDescription || `Products from ${profile.business_name}`}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ═══════════════ TAB: FOOTER ═══════════════ */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <Section icon={MapPin} title="Custom Footer" pro={!isEligible}>
              <div className="space-y-4">
                <div>
                  <Label>About Text</Label>
                  <Textarea name="footerAbout" value={formData.footerAbout} onChange={handleChange}
                    placeholder="We are a trusted business delivering quality products since 2020."
                    rows={2} disabled={isPending || !isEligible} className="mt-1.5" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-500" /> Email</Label>
                    <Input name="footerEmail" value={formData.footerEmail} onChange={handleChange}
                      placeholder="contact@yourbusiness.com" disabled={isPending || !isEligible} className="mt-1.5" />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> Phone</Label>
                    <Input name="footerPhone" value={formData.footerPhone} onChange={handleChange}
                      placeholder="+91 98765 43210" disabled={isPending || !isEligible} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Address</Label>
                  <Textarea name="footerAddress" value={formData.footerAddress} onChange={handleChange}
                    placeholder="123, MG Road, Bangalore, Karnataka 560001"
                    rows={2} disabled={isPending || !isEligible} className="mt-1.5" />
                </div>
              </div>
            </Section>


          </div>
        )}


        {activeTab === 'headless' && (
          <HeadlessSettingsForm
            initialStoreMode={(profile as any).store_mode || 'standard'}
            initialConnectedDomain={(profile as any).connected_domain || null}
            apiKeyPrefix={(profile as any).api_key_prefix || null}
          />
        )}

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
 
// ─── Helper Components ──────────────────────────────────────
function Section({ icon: Icon, title, children, pro }: { icon: any; title: string; children: React.ReactNode; pro?: boolean }) {
  return (
    <div className={cn("bg-white dark:bg-slate-900 p-2 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-4", pro && 'opacity-60 pointer-events-none select-none')}>
      {pro && (
        <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-950/30 mb-3"><Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Professional Plan Required</p>
          <Link href="/settings/subscription"><Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white"><Crown className="w-3.5 h-3.5 mr-1.5" /> Upgrade Now</Button></Link>
        </div>
      )}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
        <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  )
}
 
function ToggleRow({ label, description, checked, onChange, disabled }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div><p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p><p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{description}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}
 
function SocialInput({ icon: Icon, label, name, value, onChange, placeholder, disabled }: { icon: any; label: string; name: string; value: string; onChange: any; placeholder: string; disabled?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs"><Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {label}</Label>
      <Input name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="text-sm" />
    </div>
  )
}
 
function ColorPicker({ 
  label, 
  description, 
  name, 
  value, 
  onChange, 
  onSet, 
  presets 
}: { 
  label: string; 
  description?: string; 
  name: string; 
  value: string; 
  onChange: any; 
  onSet: (v: string) => void; 
  presets: string[] 
}) {
  return (
    <div className="space-y-2 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40">
      <div className="space-y-0.5">
        <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">{label}</Label>
        {description && (
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <input 
          type="color" 
          name={name} 
          value={value} 
          onChange={onChange} 
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-900 shrink-0 shadow-xs" 
        />
        <Input 
          value={value} 
          onChange={onChange} 
          name={name} 
          className="w-24 uppercase font-mono text-xs h-8 px-2" 
          maxLength={7} 
        />
      </div>
      <div className="flex gap-1.5 pt-1">
        {presets.map(c => (
          <button 
            key={c} 
            type="button" 
            onClick={() => onSet(c)}
            className={cn(
              "w-5 h-5 rounded-md border transition-all hover:scale-110", 
              value === c ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-110' : 'border-slate-200 dark:border-slate-700'
            )}
            style={{ backgroundColor: c }} 
          />
        ))}
      </div>
    </div>
  )
}
