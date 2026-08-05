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
  Plus, Trash2, ListPlus, FileText,
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
    shop_logo_url: profile.shop_logo_url || '',
    // Appearance
    primaryColor: theme.primaryColor || '#4f46e5',
    secondaryColor: theme.secondaryColor || '#f97316',
    accentColor: theme.accentColor || '#10b981',
    neutralDarkColor: theme.neutralDarkColor || '#0f172a',
    navbarBgColor: theme.navbarBgColor || '#ffffff',
    navbarTextColor: theme.navbarTextColor || '#0f172a',
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
    heroBgColor: theme.heroBgColor || '#4f46e5',
    heroPattern: theme.heroPattern || 'none',
    heroImageUrl: theme.heroImageUrl || '',
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
    testimonials: theme.testimonials || [
      { name: '', text: '', rating: 5 },
      { name: '', text: '', rating: 5 },
      { name: '', text: '', rating: 5 },
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

  const handleBadgeIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, badgeId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Image must be less than 5MB', variant: 'destructive' })
      return
    }

    setUploadingField(`badge_${badgeId}`)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `badge-${badgeId}-${Date.now()}.${fileExt}`
      const filePath = `${profile.id}/${fileName}`

      const { error } = await supabase.storage.from('product-images').upload(filePath, file, { upsert: false })
      if (error) throw error

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath)
      const uploadedUrl = urlData.publicUrl

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
      const fileExt = file.name.split('.').pop()
      const fileName = `${fieldName}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
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
      const fileExt = file.name.split('.').pop()
      const fileName = `heroBanners-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
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
        const currentBanners = [...(prev.heroBanners || [])]
        const defaultAction = prev.heroBannerClickAction || 'shop'
        const defaultLink = prev.heroCtaLink || (defaultAction === 'shop' ? '#products' : defaultAction === 'collections' ? '#collections' : '')

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

      setFormData(prev => ({
        ...prev,
        heroImages: [...(prev.heroImages || []), uploadedUrl]
      }))
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
    setFormData(prev => ({
      ...prev,
      heroImages: (prev.heroImages || []).filter((_: string, i: number) => i !== index)
    }))
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
            {categories.length > 0 ? (
              <select
                value={item?.clickTarget || ''}
                onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
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
            {products.length > 0 ? (
              <select
                value={item?.clickTarget || ''}
                onChange={(e) => updatePromoItem(targetField, { clickTarget: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Choose Product --</option>
                {products.map((p) => (
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const data = new FormData()
      data.append('userId', profile.id)
      data.append('shop_slug', formData.shop_slug)
      data.append('shop_description', formData.shop_description)
      data.append('shop_logo_url', formData.shop_logo_url)
      
      // Pack everything else into shop_theme JSON
      const { shop_slug, shop_description, shop_logo_url, ...themeData } = formData
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
    { id: 'advanced', label: 'Advanced', icon: Zap },
  ]

  const tabs = isHeadlessMode
    ? allTabs.filter(t => ['general', 'headless', 'seo', 'advanced'].includes(t.id))
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
                <code className="bg-white/80 dark:bg-slate-900/80 px-1.5 py-0.5 rounded mx-1 text-indigo-600 dark:text-indigo-400 text-xs font-mono">resellerpro.in/{formData.shop_slug || 'your-store'}</code>
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

      {/* ═══════════════ LIVE STATUS ═══════════════ */}
      {isEligible && formData.shop_slug && (
        <div className={cn("flex items-center gap-4 p-4 rounded-2xl border",
          formData.storeStatus === 'open' ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-950/50 dark:bg-emerald-950/20' :
          formData.storeStatus === 'vacation' ? 'border-amber-200 bg-amber-50 dark:border-amber-950/50 dark:bg-amber-950/20' : 'border-red-200 bg-red-50 dark:border-red-950/50 dark:bg-red-950/20')}>
          <div className={cn("p-2 rounded-xl",
            formData.storeStatus === 'open' ? 'bg-emerald-100 dark:bg-emerald-900/30' : formData.storeStatus === 'vacation' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30')}>
            {formData.storeStatus === 'open' ? <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> :
             formData.storeStatus === 'vacation' ? <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" /> :
             <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />}
          </div>
          <div className="flex-1">
            <p className={cn("text-sm font-bold",
              formData.storeStatus === 'open' ? 'text-emerald-800 dark:text-emerald-300' : formData.storeStatus === 'vacation' ? 'text-amber-800 dark:text-amber-300' : 'text-red-800 dark:text-red-300')}>
              {formData.storeStatus === 'open' ? 'Store is LIVE' : formData.storeStatus === 'vacation' ? '🟡 Vacation Mode' : '🔴 Store Closed'}
            </p>
            <p className={cn("text-xs", formData.storeStatus === 'open' ? 'text-emerald-600 dark:text-emerald-400' : formData.storeStatus === 'vacation' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400')}>
              {storeUrlPrefix}{formData.shop_slug} · {productCount} products
            </p>
          </div>
          <a href={`/store/${formData.shop_slug}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
            <Eye className="w-3.5 h-3.5" /> Visit <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* ═══════════════ TAB NAVIGATION ═══════════════ */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); sessionStorage.setItem('resellerpro_shop_tab', tab.id); }}
                className={cn("inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap",
                  activeTab === tab.id ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300')}>
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

            <Section icon={ImageIcon} title="Store Logo">
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
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Primary (Buttons, links, active states)"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, primaryColor: v }))}
                    presets={['#4f46e5', '#059669', '#dc2626', '#ea580c', '#7c3aed', '#0891b2']}
                  />
                  <ColorPicker
                    label="Secondary (Hover states, headers, navigation)"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, secondaryColor: v }))}
                    presets={['#4338ca', '#047857', '#b91c1c', '#c2410c', '#6d28d9', '#0369a1']}
                  />
                  <ColorPicker
                    label="Third/Accent (Highlights, badges, info)"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, accentColor: v }))}
                    presets={['#f97316', '#eab308', '#ec4899', '#14b8a6', '#8b5cf6', '#f43f5e']}
                  />
                  <ColorPicker
                    label="Fourth/Neutral Dark (Text, sidebar, titles)"
                    name="neutralDarkColor"
                    value={formData.neutralDarkColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, neutralDarkColor: v }))}
                    presets={['#0f172a', '#1e293b', '#334155', '#18181b', '#27272a', '#171717']}
                  />
                  <ColorPicker
                    label="Navbar Background Color"
                    name="navbarBgColor"
                    value={formData.navbarBgColor}
                    onChange={handleChange}
                    onSet={(v) => setFormData(p => ({ ...p, navbarBgColor: v }))}
                    presets={['#ffffff', '#f8fafc', '#0f172a', '#1e293b', '#4f46e5', '#059669']}
                  />
                  <ColorPicker
                    label="Navbar Text & Icon Color"
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

                  {/* ── Settings for Product Showcase Hero ──────────── */}
                  {formData.heroTemplate === 'split' && (
                    <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2">Product Showcase Settings</span>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                      </div>

                      {/* Background Color */}
                      <ColorPicker
                        label="Hero Background Color"
                        name="heroBgColor"
                        value={formData.heroBgColor}
                        onChange={handleChange}
                        onSet={(v) => setFormData(p => ({ ...p, heroBgColor: v }))}
                        presets={['#0f172a', '#1e1b4b', '#0c0a09', '#052e16', '#450a0a', '#1e3a5f', '#18181b', '#0d1117']}
                      />

                      {/* Headline & Subtitle */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Headline</Label>
                          <Input name="heroTitle" value={formData.heroTitle} onChange={handleChange}
                            placeholder="Premium Quality. Timeless Style." disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Subtitle</Label>
                          <Input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange}
                            placeholder="Discover premium products at the best prices" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Primary Button Text</Label>
                          <Input name="heroCtaText" value={formData.heroCtaText} onChange={handleChange}
                            placeholder="Shop Now" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Secondary Button Text</Label>
                          <Input name="heroSecondaryCtaText" value={formData.heroSecondaryCtaText} onChange={handleChange}
                            placeholder="Explore Now" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Secondary Button Link</Label>
                          <Input name="heroSecondaryCtaLink" value={formData.heroSecondaryCtaLink} onChange={handleChange}
                            placeholder="#collections" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                      </div>

                      {/* Mini badge + Trust Labels */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Mini Badge</Label>
                          <Input name="heroBadge" value={formData.heroBadge} onChange={handleChange}
                            placeholder="New Arrival" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Trust Label 1</Label>
                          <Input name="heroBadge1" value={formData.heroBadge1} onChange={handleChange}
                            placeholder="Free Shipping" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Trust Label 2</Label>
                          <Input name="heroBadge2" value={formData.heroBadge2} onChange={handleChange}
                            placeholder="Easy Returns" disabled={isPending || !isEligible} className="mt-1.5" />
                        </div>
                        <div>
                          <Label>Trust Label 3</Label>
                          <Input name="heroBadge3" value={formData.heroBadge3} onChange={handleChange}
                            placeholder="COD Available" disabled={isPending || !isEligible} className="mt-1.5" />
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

                        {(formData.heroImages || []).length === 0 ? (
                          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No images added yet</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">Upload up to 5 product images — they will auto-slide on your storefront.</p>
                          </div>
                        ) : (
                          <div className="flex gap-3 flex-wrap">
                            {(formData.heroImages || []).map((imgUrl: string, idx: number) => (
                              <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shrink-0">
                                <img src={imgUrl} alt={`Hero image ${idx + 1}`} className="w-full h-full object-contain p-1" />
                                <button
                                  type="button"
                                  onClick={() => removeHeroImage(idx)}
                                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-black"
                                >
                                  Remove
                                </button>
                                <span className="absolute bottom-1 right-1 text-[8px] font-black text-white bg-black/60 rounded px-1">{idx + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">Square or transparent PNG (800×800 px) recommended. Max 5MB each.</p>
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
                              <span className="px-2.5 py-1.5 bg-white text-slate-950 font-black text-[9px] rounded-md shadow-sm">{formData.heroCtaText || 'Shop Collection'}</span>
                              <span className="px-2.5 py-1.5 border border-white/20 text-white font-black text-[9px] rounded-md">{formData.heroSecondaryCtaText || 'Explore Now'}</span>
                            </div>
                            <div className="flex items-center gap-3 pt-2 border-t border-white/10 text-slate-400 text-[8px] font-bold">
                              <span>✓ {formData.heroBadge1 || 'Free Shipping'}</span>
                              <span>✓ {formData.heroBadge2 || 'Easy Returns'}</span>
                              <span>✓ {formData.heroBadge3 || 'COD Available'}</span>
                            </div>
                          </div>
                          <div className="col-span-4 flex justify-center">
                            {/* Card style box: increased height, narrower width, overflow hidden, image fits inside */}
                            <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-2xl overflow-hidden border border-white/15 bg-white/5 shadow-2xl flex items-center justify-center p-2">
                              {(formData.heroImages || []).length > 0 ? (
                                <img src={formData.heroImages[0]} className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.08)]" alt="Mockup" />
                              ) : (
                                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&auto=format&fit=crop" className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.08)]" alt="Default Watch" />
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

                      {/* Default Destination Preference for New Banners */}
                      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <Label className="mb-1 block font-bold text-xs text-slate-900 dark:text-white">Default Destination for New Banners</Label>
                        <p className="text-[11px] text-slate-500 mb-2.5">When you upload a new promotional banner, it will automatically inherit this default link destination (which you can customize per banner).</p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { value: 'shop', label: '🛍️ Shop' },
                            { value: 'collections', label: '📦 Collections' },
                            { value: 'category', label: '🗂️ Category' },
                            { value: 'product', label: '📱 Product' },
                            { value: 'custom_url', label: '🔗 Custom URL' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                heroBannerClickAction: opt.value as any,
                                heroCtaLink: opt.value === 'shop' ? '#products' : opt.value === 'collections' ? '#collections' : prev.heroCtaLink
                              }))}
                              disabled={!isEligible}
                              className={cn(
                                "py-2 px-2 text-[11px] font-bold rounded-xl border-2 transition-all text-center",
                                formData.heroBannerClickAction === opt.value
                                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300'
                                  : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Banner List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Promotional Banners List</Label>
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
                                      <div className="grid grid-cols-5 gap-1">
                                        {[
                                          { value: 'shop', label: '🛍️ Shop' },
                                          { value: 'collections', label: '📦 Coll.' },
                                          { value: 'category', label: '🗂️ Cat.' },
                                          { value: 'product', label: '📱 Prod.' },
                                          { value: 'custom_url', label: '🔗 URL' },
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

                      {/* Multi-Banner Interactive Live Preview */}
                      {(formData.heroBanners || []).length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carousel Live Preview</p>
                            {(formData.heroBanners || []).length > 1 && (
                              <span className="text-[10px] text-slate-400">
                                {previewBannerIndex + 1} / {(formData.heroBanners || []).length}
                              </span>
                            )}
                          </div>
                          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-950 min-h-[140px]">
                            <img
                              src={formData.heroBanners[previewBannerIndex]?.imageUrl}
                              alt={`Promo Banner ${previewBannerIndex + 1} Preview`}
                              className="w-full object-cover max-h-48 transition-all duration-300"
                            />
                            {/* Prev / Next buttons */}
                            {(formData.heroBanners || []).length > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setPreviewBannerIndex(i => (i - 1 + (formData.heroBanners || []).length) % (formData.heroBanners || []).length)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                  aria-label="Previous banner"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPreviewBannerIndex(i => (i + 1) % (formData.heroBanners || []).length)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                  aria-label="Next banner"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            {/* Dot indicators */}
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                              {(formData.heroBanners || []).map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => setPreviewBannerIndex(i)}
                                  className={cn("w-2 h-2 rounded-full transition-all", i === previewBannerIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70")}
                                />
                              ))}
                            </div>
                            {/* Destination hint overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 pointer-events-none">
                              <span className="text-white text-xs font-black bg-black/70 px-3 py-1.5 rounded-lg border border-white/10">
                                Clicking Banner {previewBannerIndex + 1} goes to: {formData.heroBanners[previewBannerIndex]?.link || 'Shop Section'}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400">Multi-banner carousel auto-slides on your storefront with touch &amp; arrow navigation.</p>
                        </div>
                      )}
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
                  {formData.testimonials.map((t: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Testimonial {i + 1}</p>
                      <Input placeholder="Customer name" value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} disabled={!isEligible} />
                      <Textarea placeholder="What they said about your products..." value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} rows={2} disabled={!isEligible} />
                      <div className="flex items-center gap-1">
                        <Label className="text-xs mr-2">Rating:</Label>
                        {[1,2,3,4,5].map(star => (
                          <button key={star} type="button" onClick={() => updateTestimonial(i, 'rating', star)} disabled={!isEligible}>
                            <Star className={cn("w-5 h-5 transition-colors", star <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700')} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>


            <Section icon={Shield} title="Trust Badges" pro={!isEligible}>
              <ToggleRow label="Show Trust Badges" description="Display trust indicators below products" checked={formData.trustBadgesEnabled} onChange={v => handleToggle('trustBadgesEnabled', v)} disabled={!isEligible} />
              {formData.trustBadgesEnabled && (
                <div className="space-y-5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Badge Selection Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'secure_payment', icon: Shield, label: 'Secure Payment' },
                      { id: 'fast_delivery', icon: Truck, label: 'Fast Delivery' },
                      { id: 'easy_returns', icon: RotateCcw, label: 'Easy Returns' },
                      { id: 'quality', icon: Star, label: 'Quality Assured' },
                      { id: 'support', icon: HeartHandshake, label: '24/7 Support' },
                      { id: 'authentic', icon: Check, label: '100% Authentic' },
                    ].map(badge => {
                      const isEnabledOnStore = formData.trustBadges.includes(badge.id)
                      const isActiveEditing = selectedBadgeId === badge.id
                      const customItem = formData.trustBadgeItems?.[badge.id]
                      const badgeTitle = customItem?.title || badge.label
                      const hasCustomIcon = !!customItem?.iconUrl

                      return (
                        <div
                          key={badge.id}
                          onClick={() => setSelectedBadgeId(badge.id)}
                          className={cn(
                            "p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer relative group",
                            isActiveEditing
                              ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                              : isEnabledOnStore
                                ? 'border-indigo-500/50 bg-slate-50 dark:bg-slate-900/40'
                                : 'border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 opacity-60'
                          )}
                        >
                          {/* Toggle active state checkmark */}
                          <button
                            type="button"
                            title={isEnabledOnStore ? "Remove from storefront" : "Enable on storefront"}
                            onClick={(e) => {
                              e.stopPropagation()
                              const updated = isEnabledOnStore
                                ? formData.trustBadges.filter((b: string) => b !== badge.id)
                                : [...formData.trustBadges, badge.id]
                              setFormData(p => ({ ...p, trustBadges: updated }))
                            }}
                            className={cn(
                              "absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all font-bold",
                              isEnabledOnStore
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400 hover:bg-slate-300"
                            )}
                          >
                            ✓
                          </button>

                          {hasCustomIcon ? (
                            <img src={customItem.iconUrl} alt={badgeTitle} className="w-5 h-5 object-cover rounded" />
                          ) : (
                            <badge.icon className={cn("w-5 h-5", isEnabledOnStore ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500')} />
                          )}
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center truncate max-w-full">
                            {badgeTitle}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Single Selected Badge Editor */}
                  {selectedBadgeId && (() => {
                    const badgePresets: Record<string, { label: string; icon: any }> = {
                      secure_payment: { label: 'Secure Payment', icon: Shield },
                      fast_delivery: { label: 'Fast Delivery', icon: Truck },
                      easy_returns: { label: 'Easy Returns', icon: RotateCcw },
                      quality: { label: 'Quality Assured', icon: Star },
                      support: { label: '24/7 Support', icon: HeartHandshake },
                      authentic: { label: '100% Authentic', icon: Check },
                    }
                    const activePreset = badgePresets[selectedBadgeId] || { label: selectedBadgeId, icon: Shield }
                    const activeCustom = formData.trustBadgeItems?.[selectedBadgeId] || {}
                    const isEnabledOnStore = formData.trustBadges.includes(selectedBadgeId)

                    return (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              Editing: {activeCustom.title || activePreset.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = isEnabledOnStore
                                  ? formData.trustBadges.filter((b: string) => b !== selectedBadgeId)
                                  : [...formData.trustBadges, selectedBadgeId]
                                setFormData(p => ({ ...p, trustBadges: updated }))
                              }}
                              className={cn(
                                "px-3 py-1 text-xs font-bold rounded-lg border transition-all",
                                isEnabledOnStore
                                  ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950/50 dark:hover:bg-red-950/20"
                                  : "border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-950/50 dark:hover:bg-indigo-950/20"
                              )}
                            >
                              {isEnabledOnStore ? "Remove from Storefront" : "Add to Storefront"}
                            </button>
                          </div>
                        </div>

                        {/* Title & Description Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-semibold mb-1 block">Badge Title</Label>
                            <Input
                              value={activeCustom.title !== undefined ? activeCustom.title : activePreset.label}
                              onChange={(e) => updateTrustBadgeItem(selectedBadgeId, 'title', e.target.value)}
                              placeholder={activePreset.label}
                              disabled={isPending || !isEligible}
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold mb-1 block">Description (Optional)</Label>
                            <Input
                              value={activeCustom.description || ''}
                              onChange={(e) => updateTrustBadgeItem(selectedBadgeId, 'description', e.target.value)}
                              placeholder="e.g. 100% money back guarantee"
                              disabled={isPending || !isEligible}
                            />
                          </div>
                        </div>

                        {/* Custom Icon Image Upload */}
                        <div>
                          <Label className="text-xs font-semibold mb-1 block">Custom Icon Image</Label>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              {activeCustom.iconUrl ? (
                                <img src={activeCustom.iconUrl} alt="Badge Icon" className="w-full h-full object-cover" />
                              ) : (
                                <activePreset.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>
                            <label
                              htmlFor={`badge_icon_file_${selectedBadgeId}`}
                              className={cn(
                                "cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors",
                                (!isEligible || uploadingField !== null) && "opacity-50 pointer-events-none"
                              )}
                            >
                              {uploadingField === `badge_${selectedBadgeId}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              Upload Icon Image
                            </label>
                            <input
                              id={`badge_icon_file_${selectedBadgeId}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBadgeIconUpload(e, selectedBadgeId)}
                              className="hidden"
                              disabled={!isEligible || uploadingField !== null}
                            />
                            {activeCustom.iconUrl && (
                              <button
                                type="button"
                                onClick={() => updateTrustBadgeItem(selectedBadgeId, 'iconUrl', '')}
                                className="text-xs text-red-500 font-bold hover:underline"
                              >
                                Reset to Default Icon
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
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
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs">resellerpro.in/{formData.shop_slug || 'your-store'}</p>
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
        <div className="sticky bottom-[-32px] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 -mx-6 px-6 py-4 flex items-center justify-between z-20 rounded-b-2xl shadow-lg">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {formData.shop_slug && isEligible && (
              <a href={`/store/${formData.shop_slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Preview Store <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white dark:text-white shadow-sm">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <>Save Settings</>}
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
    <div className={cn("bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative", pro && 'opacity-60 pointer-events-none select-none')}>
      {pro && (
        <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center">
          <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-950/30 mb-3"><Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Professional Plan Required</p>
          <Link href="/settings/subscription"><Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white"><Crown className="w-3.5 h-3.5 mr-1.5" /> Upgrade Now</Button></Link>
        </div>
      )}
      <div className="flex items-center gap-2 mb-4"><Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /><h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2></div>
      {children}
    </div>
  )
}
 
function ToggleRow({ label, description, checked, onChange, disabled }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div><p className="text-sm font-medium text-slate-900 dark:text-slate-100">{label}</p><p className="text-xs text-slate-500 dark:text-slate-400">{description}</p></div>
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
 
function ColorPicker({ label, name, value, onChange, onSet, presets }: { label: string; name: string; value: string; onChange: any; onSet: (v: string) => void; presets: string[] }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <input type="color" name={name} value={value} onChange={onChange} className="w-10 h-10 rounded-lg border-2 border-slate-200 dark:border-slate-800 cursor-pointer p-0.5 bg-white dark:bg-slate-900" />
        <Input value={value} onChange={onChange} name={name} className="w-28 uppercase font-mono" maxLength={7} />
      </div>
      <div className="flex gap-1.5">
        {presets.map(c => (
          <button key={c} type="button" onClick={() => onSet(c)}
            className={cn("w-6 h-6 rounded-md border-2 transition-all hover:scale-110", value === c ? 'border-slate-900 dark:border-slate-100 scale-110' : 'border-transparent')}
            style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  )
}
