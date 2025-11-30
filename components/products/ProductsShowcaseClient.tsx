"use client"

import * as React from "react"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useProductsRealtime } from "@/hooks/useProductsRealtime"
import { ProductsLoading } from "./ProductsLoading"
import { ProductsError } from "./ProductsError"
import { ProductsEmpty } from "./ProductsEmpty"
import { createClientSupabase, getCurrentUser } from "@/utils/supabase/client"

interface Product {
  id: string
  title: string
  description?: string
  price: number
  comparePrice?: number
  sku?: string
  category?: string
  status: string
  stock?: number
  weight?: number
  urlHandle?: string
  categoryId?: string
  images: Array<{
    id: string
    image_path: string
    isPrimary: boolean
    altText?: string
    position: number
  }>
  createdAt: string
  updatedAt: string
}

// Professional API function with Supabase automatic session handling
async function fetchActiveProducts(): Promise<Product[]> {
  try {
    // Get current user claims (Supabase auto-refreshes if needed)
    const user = await getCurrentUser()

    if (!user) {
      console.warn('🔄 [FETCH PRODUCTS] No valid user, redirecting to auth')
      window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                             encodeURIComponent(window.location.href)
      throw new Error('Authentication required')
    }

    // Get session for access token
    const supabase = await createClientSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      console.warn('🔄 [FETCH PRODUCTS] No valid session, redirecting to auth')
      window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                             encodeURIComponent(window.location.href)
      throw new Error('Authentication required')
    }

    console.log('🛍️ [FETCH PRODUCTS] Making authenticated API request with auto-refreshed token')

    const response = await fetch(`https://api.dropleather.com/v1/seller/products/active`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('🛍️ [FETCH PRODUCTS] API response status:', response.status)

    if (response.status === 401) {
      // This should rarely happen now with auto-refresh, but handle gracefully
      console.warn('🔄 [FETCH PRODUCTS] Unexpected 401, redirecting to auth')
      window.location.href = 'https://auth.dropleather.com/login?redirect_to=' +
                             encodeURIComponent(window.location.href)
      throw new Error('Authentication required')
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    console.log('🛍️ [FETCH PRODUCTS] Success:', data.data?.products?.length || 0, 'products')

    return data.data?.products || []
  } catch (error) {
    console.error('❌ [FETCH PRODUCTS] Error:', error)
    throw error
  }
}

const productColors = [
  { name: "Brown", value: "#4C2B11" },
  { name: "Red", value: "#DC2626" },
  { name: "Black", value: "#000000" },
  { name: "Green", value: "#2C5100" },
  { name: "Blue", value: "#191970" }
]

export function ProductsShowcaseClient() {
  const queryClient = useQueryClient()
  const [favorites, setFavorites] = React.useState<string[]>([])
  const [selectedProductColors, setSelectedProductColors] = React.useState<Record<string, number>>({})

  // 🆕 React Query for data fetching
  const {
    data: products = [],
    error,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['products', 'active'],
    queryFn: fetchActiveProducts,
    staleTime: 5 * 60 * 1000,    // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,      // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,  // Don't refetch on window focus
    refetchInterval: false,       // No polling - rely on Realtime
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message === 'Authentication required') return false
      return failureCount < 2
    }
  })

  // 🆕 Realtime updates
  useProductsRealtime({
    onProductChange: (eventType, product) => {
      console.log('🔄 [REALTIME] Product change:', eventType, product.id)
      
      // Update React Query cache directly
      queryClient.setQueryData(['products', 'active'], (oldProducts: Product[] = []) => {
        switch (eventType) {
          case 'INSERT':
            return product.status === 'active' ? [...oldProducts, product] : oldProducts

          case 'UPDATE':
            if (product.status === 'active') {
              const exists = oldProducts.some(p => p.id === product.id)
              return exists
                ? oldProducts.map(p => p.id === product.id ? product : p)
                : [...oldProducts, product]
            } else {
              return oldProducts.filter(p => p.id !== product.id)
            }

          case 'DELETE':
            return oldProducts.filter(p => p.id !== product.id)

          default:
            return oldProducts
        }
      })
    }
  })



  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const selectProductColor = (productId: string, colorIndex: number) => {
    setSelectedProductColors(prev => ({
      ...prev,
      [productId]: colorIndex
    }))
  }


  // Handle loading state
  if (isLoading) return <ProductsLoading />
  
  // Handle error state
  if (isError && error) return <ProductsError error={error as Error} onRetry={refetch} />
  
  // Handle empty state
  if (!products.length) return <ProductsEmpty />

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="py-16 md:py-24 px-16 lg:px-24">
        {/* Product Grid */}
        <div className="w-full">
          <div className="mb-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/products">Products</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Products Showcase</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-2xl font-bold font-sora mb-2">Products Showcase</h1>
            <p className="text-muted-foreground font-sans">
              Explore all the newest additions to our premium leather goods collection. Dive in and discover your next bestseller crafted with exceptional quality.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden group shadow-none border border-[#E3E3E3] p-0">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={
                        product.images.find(img => img.isPrimary)?.image_path 
                          ? `https://data.dropleather.com/storage/v1/object/public/product-images/${product.images.find(img => img.isPrimary)?.image_path}`
                          : product.images[0]?.image_path 
                            ? `https://data.dropleather.com/storage/v1/object/public/product-images/${product.images[0]?.image_path}`
                            : "/images/product.png"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Heart icon */}
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white"
                    >
                      <Heart className={cn(
                        "h-4 w-4",
                        favorites.includes(product.id) 
                          ? "fill-red-500 text-red-500" 
                          : "text-gray-600"
                      )} />
                    </Button>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-1">
                    {/* Title */}
                    <h3 className="font-semibold text-base leading-tight line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Category */}
                    <div className="text-sm text-muted-foreground font-medium mb-4">
                      {product.category || 'Uncategorized'}
                    </div>

                    {/* Prices */}
                    <div className="space-y-1">
                      <span className="font-bold text-lg">
                        From USD {product.price.toFixed(2)}
                      </span>
                      <p className="text-gray-500" style={{fontSize: '14px'}}>
                        From USD {product.price.toFixed(0)} with Dropleather Pro or Enterprise
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full h-10" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-semibold font-sora mb-2">No products available</h3>
              <p className="text-muted-foreground font-sans">
                Check back later for new products
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

