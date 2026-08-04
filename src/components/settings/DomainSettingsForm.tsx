'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, CheckCircle2, AlertCircle, Copy, ExternalLink, 
  Sparkles, RefreshCw, Trash2, ArrowRight, ShieldCheck, HelpCircle 
} from 'lucide-react'

interface DomainInfo {
  hasDomain: boolean
  domain?: string
  status?: 'pending' | 'active' | 'error'
  shopSlug?: string
  verifiedAt?: string
  dnsInstructions?: {
    aRecord: { type: string; name: string; value: string }
    cnameRecord: { type: string; name: string; value: string }
  }
}

interface Props {
  shopSlug: string
  isProUser?: boolean
}

export function DomainSettingsForm({ shopSlug, isProUser = true }: Props) {
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [inputDomain, setInputDomain] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [copiedSlug, setCopiedSlug] = useState(false)
  const [copiedA, setCopiedA] = useState(false)
  const [copiedCNAME, setCopiedCNAME] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [baseUrl, setBaseUrl] = useState<string>('')

  useEffect(() => {
    // Dynamic base URL check: use window.location.origin when in browser, or env fallback
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
    } else {
      setBaseUrl(process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in')
    }
  }, [])

  const effectiveBase = baseUrl || (process.env.NEXT_PUBLIC_APP_URL || 'https://resellerpro.in')
  const activeSlug = shopSlug || domainInfo?.shopSlug || 'my-store'
  const storefrontUrl = `${effectiveBase}/store/${activeSlug}`

  useEffect(() => {
    fetchDomainStatus()
  }, [])

  async function fetchDomainStatus() {
    try {
      setLoading(true)
      const res = await fetch('/api/domains')
      const data = await res.json()

      if (res.ok) {
        setDomainInfo(data)
        if (data.domain) setInputDomain(data.domain)
      }
    } catch (e) {
      console.error('Failed to load domain settings:', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddDomain(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    if (!inputDomain.trim()) {
      setErrorMsg('Please enter a domain name.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: inputDomain }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add custom domain')
      }

      setSuccessMsg('Custom domain attached! Please add the DNS records below to activate HTTPS.')
      fetchDomainStatus()
    } catch (err: any) {
      setErrorMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVerifyDomain() {
    setVerifying(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const res = await fetch('/api/domains')
      const data = await res.json()

      if (data.status === 'active') {
        setSuccessMsg('🎉 Success! Your custom domain is fully active and secured with SSL!')
      } else {
        setErrorMsg('DNS records not detected yet. DNS changes can take up to 5-15 minutes to propagate. Please check again shortly.')
      }
      setDomainInfo(data)
    } catch (e: any) {
      setErrorMsg(e.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  async function handleRemoveDomain() {
    if (!confirm('Are you sure you want to remove your custom domain? Your store will fallback to your free subdomain.')) return

    try {
      setSubmitting(true)
      const res = await fetch('/api/domains', { method: 'DELETE' })
      if (res.ok) {
        setInputDomain('')
        setDomainInfo(null)
        setSuccessMsg('Custom domain removed successfully.')
        fetchDomainStatus()
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to remove domain')
    } finally {
      setSubmitting(false)
    }
  }

  function copyToClipboard(text: string, setCopiedFn: (val: boolean) => void) {
    navigator.clipboard.writeText(text)
    setCopiedFn(true)
    setTimeout(() => setCopiedFn(false), 2000)
  }

  return (
    <div className="space-y-6">
      
      {/* ── CARD 1: Standard Subdomain (₹0 Free Plan) ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Standard Storefront URL</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 tracking-wider">
                  Included Free
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every ResellerPro seller gets an automatic, instant storefront web address.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live URL:</span>
            <a 
              href={storefrontUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1.5 truncate"
            >
              {storefrontUrl}
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>

          <button
            onClick={() => copyToClipboard(storefrontUrl, setCopiedSlug)}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            {copiedSlug ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* ── CARD 2: White-Label Custom Domain (₹999 Pro Plan) ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">White-Label Custom Domain</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 tracking-wider">
                  ₹999 Pro Plan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your own domain name (e.g. <span className="font-semibold text-slate-700">www.mybrandstore.com</span>) to build instant brand trust.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alert Messages */}
        {errorMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{successMsg}</div>
          </div>
        )}

        {/* Form Body */}
        {loading ? (
          <div className="mt-6 flex items-center justify-center py-6 text-slate-400 text-xs gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
            Loading domain setup...
          </div>
        ) : domainInfo?.hasDomain ? (
          /* Active / Pending Domain State */
          <div className="mt-6 space-y-5">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${domainInfo.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {domainInfo.status === 'active' ? <CheckCircle2 className="w-5 h-5" /> : <RefreshCw className="w-5 h-5 animate-spin" />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {domainInfo.domain}
                    <a href={`https://${domainInfo.domain}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-xs text-slate-500">
                    Status:{' '}
                    <span className={`font-semibold ${domainInfo.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {domainInfo.status === 'active' ? 'Connected & Secured (SSL Active)' : 'Pending DNS Propagation'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleVerifyDomain}
                  disabled={verifying}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
                  {verifying ? 'Verifying...' : 'Check DNS Status'}
                </button>
                <button
                  onClick={handleRemoveDomain}
                  disabled={submitting}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove domain"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* DNS Setup Guide Box */}
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-4 shadow-lg shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-300">Required DNS Records (GoDaddy / Namecheap)</span>
                </div>
                <span className="text-[11px] text-slate-400">Add these 2 records in your domain registrar</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* Record A */}
                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span>RECORD 1 (Root Domain)</span>
                    <span className="text-emerald-400 font-semibold">TYPE: A</span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded text-slate-200">
                    <div>
                      <div>Host: <span className="text-amber-300">@</span></div>
                      <div>Value: <span className="text-emerald-300">76.76.21.21</span></div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('76.76.21.21', setCopiedA)} 
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Record CNAME */}
                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span>RECORD 2 (WWW Prefix)</span>
                    <span className="text-emerald-400 font-semibold">TYPE: CNAME</span>
                  </div>
                  <div className="flex items-center justify-between font-mono bg-slate-950 p-2 rounded text-slate-200">
                    <div>
                      <div>Host: <span className="text-amber-300">www</span></div>
                      <div>Value: <span className="text-emerald-300">cname.vercel-dns.com</span></div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('cname.vercel-dns.com', setCopiedCNAME)} 
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* Add Domain Input Form */
          <form onSubmit={handleAddDomain} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Enter Your Custom Domain Name</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputDomain}
                    onChange={(e) => setInputDomain(e.target.value)}
                    placeholder="e.g. fashionhubstore.com or shop.fashionhub.in"
                    className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-xs hover:opacity-95 transition-all shadow-md shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
                >
                  {submitting ? 'Connecting...' : 'Connect Domain'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              After connecting, SSL (HTTPS) certificate will be automatically issued free of charge.
            </p>
          </form>
        )}

      </div>

    </div>
  )
}
