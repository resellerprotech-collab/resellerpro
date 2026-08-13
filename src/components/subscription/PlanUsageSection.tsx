'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart2, ChevronDown, ChevronUp, Package, AlertCircle, Check, Zap } from 'lucide-react'

type Metric = {
  used: number
  limit: number
  percentage: number
  isReached: boolean
}

type PlanUsageSectionProps = {
  metrics: {
    orders?: Metric
    enquiries?: Metric
    customers?: Metric
    products?: Metric
  }
}

function MetricProgress({ label, metric, icon }: { label: string; metric?: Metric; icon: React.ReactNode }) {
  if (!metric) return null
  const isUnlimited = metric.limit === Infinity || metric.limit === 999999

  return (
    <div className="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-blue-600">{icon}</span>
          {label}
        </span>
        <span className="font-bold text-slate-700 text-xs bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
          {isUnlimited ? 'Unlimited' : `${metric.used} / ${metric.limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              metric.isReached ? 'bg-rose-500' : metric.percentage > 80 ? 'bg-amber-500' : 'bg-blue-600'
            }`}
            style={{ width: `${metric.percentage}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function PlanUsageSection({ metrics }: PlanUsageSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-200">
      <CardContent className="p-6 md:p-8">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-100 transition-colors">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Plan usage
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">View your current usage and limits</p>
            </div>
          </div>

          <div className="p-2 text-slate-400 group-hover:text-slate-600 transition-colors">
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>

        {isOpen && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MetricProgress
                label="Total Orders"
                metric={metrics.orders}
                icon={<Package className="h-4 w-4" />}
              />
              <MetricProgress
                label="Total Enquiries"
                metric={metrics.enquiries}
                icon={<AlertCircle className="h-4 w-4" />}
              />
              <MetricProgress
                label="Customers"
                metric={metrics.customers}
                icon={<Check className="h-4 w-4" />}
              />
              <MetricProgress
                label="Products"
                metric={metrics.products}
                icon={<Zap className="h-4 w-4" />}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
