'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateRequestStatusByAdmin, adminManageApiKey } from '@/app/actions/custom-website'
import { toast } from '@/lib/toast'
import { CheckCircle, XCircle, Key, RefreshCw, Copy, Sparkles, Phone, Mail, Globe } from 'lucide-react'

export interface WebsiteRequestItem {
  id: string
  user_id: string
  status: string
  contact_phone: string | null
  contact_email: string | null
  business_name: string | null
  created_at: string
  profile: {
    shop_slug: string
    store_mode: string
    connected_domain: string | null
    api_key_prefix: string | null
  }
}

export default function AdminWebsiteRequestsClient({
  initialRequests,
  pendingCount
}: {
  initialRequests: WebsiteRequestItem[]
  pendingCount?: number
}) {
  const [requests, setRequests] = useState<WebsiteRequestItem[]>(initialRequests)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [generatedKeyModal, setGeneratedKeyModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = activeFilter === 'all'
    ? requests
    : requests.filter(r => r.status === activeFilter)

  const handleUpdateStatus = async (requestId: string, userId: string, newStatus: string) => {
    setLoading(true)
    const res = await updateRequestStatusByAdmin(requestId, userId, newStatus)
    setLoading(false)

    if (res.success) {
      toast.success(res.message)
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r))
      if (res.generatedKey) {
        setGeneratedKeyModal(res.generatedKey)
      }
    } else {
      toast.error(res.message)
    }
  }

  const handleManageKey = async (userId: string, action: 'generate' | 'regenerate' | 'revoke') => {
    setLoading(true)
    const res = await adminManageApiKey(userId, action)
    setLoading(false)

    if (res.success) {
      toast.success(res.message)
      if (res.apiKey) {
        setGeneratedKeyModal(res.apiKey)
      }
    } else {
      toast.error(res.message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'development':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      case 'testing':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar - Ekodrix Dark Theme */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {['all', 'pending', 'approved', 'development', 'testing', 'completed', 'rejected'].map(status => (
          <Button
            key={status}
            variant="ghost"
            size="sm"
            onClick={() => setActiveFilter(status)}
            className={`capitalize text-xs rounded-xl px-4 transition-all ${
              activeFilter === status
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {status}
            {status === 'pending' && (pendingCount || 0) > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-black font-extrabold">
                {pendingCount}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center border border-white/5 rounded-2xl bg-[#0d1322] text-gray-500">
            No website requests found for this filter.
          </div>
        ) : (
          filtered.map(req => (
            <Card key={req.id} className="border border-white/5 bg-[#0d1322] text-gray-100 shadow-xl rounded-2xl overflow-hidden hover:border-white/10 transition-all">
              <CardContent className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Store Profile Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-lg text-white tracking-tight">
                      {req.business_name || req.profile.shop_slug}
                    </span>
                    <Badge variant="outline" className={`capitalize font-bold border ${getStatusBadgeStyle(req.status)}`}>
                      {req.status}
                    </Badge>
                    <Badge variant="outline" className={`font-mono text-[11px] uppercase border ${
                      req.profile.store_mode === 'headless'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}>
                      {req.profile.store_mode} MODE
                    </Badge>
                  </div>

                  {/* Details Grid */}
                  <div className="text-xs text-gray-400 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="text-gray-200 truncate">{req.contact_email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="text-gray-200">{req.contact_phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                      <span className="text-emerald-400">/{req.profile.shop_slug}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex items-center gap-3 shrink-0 flex-wrap w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                  {req.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 shadow-lg shadow-emerald-900/30 rounded-xl"
                        onClick={() => handleUpdateStatus(req.id, req.user_id, 'approved')}
                        disabled={loading}
                      >
                        <CheckCircle className="h-4 w-4" /> Approve & Enable Headless
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl"
                        onClick={() => handleUpdateStatus(req.id, req.user_id, 'rejected')}
                        disabled={loading}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}

                  {/* Status Dropdown */}
                  <Select
                    value={req.status}
                    onValueChange={(val) => handleUpdateStatus(req.id, req.user_id, val)}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-36 h-9 text-xs bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111827] border-white/10 text-gray-200">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* API Key Admin Controls */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl"
                    onClick={() => handleManageKey(req.user_id, req.profile.api_key_prefix ? 'regenerate' : 'generate')}
                    disabled={loading}
                  >
                    <Key className="h-3.5 w-3.5 text-emerald-400" />
                    {req.profile.api_key_prefix ? 'Regenerate Key' : 'Generate Key'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Secret API Key Display Dialog */}
      <Dialog open={!!generatedKeyModal} onOpenChange={() => setGeneratedKeyModal(null)}>
        <DialogContent className="sm:max-w-md bg-[#0d1322] border-white/10 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-emerald-400">
              <Sparkles className="h-5 w-5" />
              API Key Generated
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-gray-400">
              Copy this secret key and place it into the client&apos;s custom Next.js environment variables.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="font-mono text-xs break-all bg-black/60 p-3 rounded-lg border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-2">
              <span className="select-all font-bold">{generatedKeyModal}</span>
              <Button size="icon" variant="ghost" className="hover:bg-white/10 text-gray-300" onClick={() => copyToClipboard(generatedKeyModal || '')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setGeneratedKeyModal(null)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
