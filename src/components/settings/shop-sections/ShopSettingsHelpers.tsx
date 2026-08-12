'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Crown, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Section({ icon: Icon, title, children, pro }: { icon: any; title: string; children: React.ReactNode; pro?: boolean }) {
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

export function ToggleRow({ label, description, checked, onChange, disabled }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div><p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p><p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{description}</p></div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}

export function SocialInput({ icon: Icon, label, name, value, onChange, placeholder, disabled }: { icon: any; label: string; name: string; value: string; onChange: any; placeholder: string; disabled?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs"><Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" /> {label}</Label>
      <Input name={name} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className="text-sm" />
    </div>
  )
}

export function ColorPicker({ 
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
