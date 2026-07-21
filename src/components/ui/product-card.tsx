'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type ProductCardProps = {
  id: string
  name: string
  image?: string | null
  cost: number
  price: number
  profit: number
  stock: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export function ProductCard({
  id,
  name,
  image,
  cost,
  price,
  profit,
  stock,
}: ProductCardProps) {
  const stockConfig = {
    in_stock: { label: 'In Stock', color: 'bg-green-500' },
    low_stock: { label: 'Low Stock', color: 'bg-yellow-500' },
    out_of_stock: { label: 'Out of Stock', color: 'bg-red-500' },
  }

  const profitMargin = ((profit / price) * 100).toFixed(1)

  return (
    <Link href={`/products/${id}`} className="block">
      <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer">
        <div className="aspect-square relative bg-muted">
          <div className="absolute top-2 right-2 z-10">
            <Badge className={`${stockConfig[stock].color} text-white border-0`}>
              {stockConfig[stock].label}
            </Badge>
          </div>

          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-20 w-20 text-muted-foreground/20" />
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-base line-clamp-2">{name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="font-medium">₹{cost}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="font-medium">₹{price}</p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="font-bold text-green-600">₹{profit}</p>
              </div>
              <Badge variant="secondary">{profitMargin}%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
