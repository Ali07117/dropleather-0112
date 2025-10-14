"use client"

import * as React from "react"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Heart, ShoppingBag, Filter, Star, Eye, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useProductsRealtime } from "@/hooks/useProductsRealtime"
import { ProductsLoading } from "./ProductsLoading"
import { ProductsError } from "./ProductsError"
import { ProductsEmpty } from "./ProductsEmpty"
import { createClientSupabase } from "@/utils/supabase/client"

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
    url: string
    isPrimary: boolean
    altText?: string
    position: number
  }>
  createdAt: string
  updatedAt: string
}

// API function to fetch products
async function fetchActiveProducts(): Promise<Product[]> {
  try {
    // 📂 TEMPORARY: Bypass auth for testing
    // const supabase = await createClientSupabase()
    // const { data: { session } } = await supabase.auth.getSession()
    // 
    // if (!session?.access_token) {
    //   throw new Error('No valid session')
    // }

    console.log('🛍️ [FETCH PRODUCTS] Making API request without auth...')

    const response = await fetch(`https://api.dropleather.com/v1/seller/products/active`, {
      headers: {
        // 'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('🛍️ [FETCH PRODUCTS] API response status:', response.status)
    
    if (response.status === 401) {
      // Token expired - redirect to auth
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
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(["All"])
  const [selectedColors, setSelectedColors] = React.useState<string[]>([])
  const [priceRange, setPriceRange] = React.useState([0, 500])
  const [favorites, setFavorites] = React.useState<string[]>([])
  const [selectedProductColors, setSelectedProductColors] = React.useState<Record<string, number>>({})
  const [isCategoriesVisible, setIsCategoriesVisible] = React.useState(true)

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

  // Filter products
  const filteredProducts = React.useMemo(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (!selectedCategories.includes("All")) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category || '')
      )
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    return filtered
  }, [products, searchQuery, selectedCategories, priceRange])

  const handleCategoryChange = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"])
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.filter(cat => cat !== "All")
        if (prev.includes(category)) {
          const filtered = newCategories.filter(cat => cat !== category)
          return filtered.length === 0 ? ["All"] : filtered
        } else {
          return [...newCategories, category]
        }
      })
    }
  }

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

  // Get unique categories from products
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    return ["All", ...uniqueCategories]
  }, [products])

  // Handle loading state
  if (isLoading) return <ProductsLoading />
  
  // Handle error state
  if (isError && error) return <ProductsError error={error as Error} onRetry={refetch} />
  
  // Handle empty state
  if (!products.length) return <ProductsEmpty />

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-6 py-4 md:py-6 px-4 lg:px-6">
        {/* Left Sidebar - Filters */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <Card className="sticky top-4">
            <CardContent className="px-6 py-2 pb-1 space-y-6">
              {/* Filters Header */}
              <div className="flex items-center gap-2 text-black mb-2">
                <img src="/images/filter.svg" alt="Filter" className="w-5 h-5" />
                <span className="font-medium font-sans text-lg">Filters</span>
              </div>
              
              {/* Search Bar */}
              <div className="space-y-2">
                <Label className="text-sm font-medium font-sans">Search Products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 font-sans"
                  />
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium font-sans">Choose Category</Label>
                  <button 
                    onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
                    className="flex items-center gap-1 text-xs font-sans text-black hover:text-gray-600"
                  >
                    <span>{isCategoriesVisible ? 'Hide All' : 'View All'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                
                {isCategoriesVisible && categories.length > 0 && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-sans">{category}</span>
                        <Checkbox 
                          checked={category ? selectedCategories.includes(category) : false}
                          onCheckedChange={() => category && handleCategoryChange(category)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium font-sans">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Show Results Button */}
              <Button 
                className="w-full font-sora bg-black hover:bg-black text-white hover:text-white h-[53px] -mb-2"
              >
                Show {filteredProducts.length} Results
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Product Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold font-sora mb-2">Products Showcase</h1>
            <p className="text-muted-foreground font-sans">
              Discover our premium leather collection with {filteredProducts.length} products
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative"
              >
                {/* Heart Icon */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-[15px] right-[15px] z-10 transition-colors w-4 h-4 flex items-center justify-center"
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    favorites.includes(product.id) 
                      ? "fill-red-500 text-red-500" 
                      : "text-black hover:text-red-500"
                  )} />
                </button>

                {/* Checkbox */}
                <div className="absolute top-[15px] left-[15px] z-10">
                  <Checkbox />
                </div>
                
                <Card className="overflow-hidden shadow-none">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative w-full h-[238px] flex items-center justify-center">
                      <div className="relative">
                        <img
                          src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || "/images/product.png"}
                          alt={product.title}
                          className="max-w-full max-h-full object-contain"
                          width={251}
                          height={238}
                        />
                        
                        {/* Colors Icon */}
                        <div className="absolute -bottom-3 -right-3 z-5">
                          <img
                            src="/images/colors.svg"
                            alt="Colors"
                            className="w-[35px] h-[35px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="px-4 pb-0 pt-6 space-y-0">
                      {/* Category */}
                      <p className="text-xl font-sora font-semibold text-black">
                        {product.category || 'Uncategorized'}
                      </p>

                      {/* Title */}
                      <h3 className="font-medium font-sora text-base line-clamp-2 mb-4" style={{ color: '#000000' }}>
                        {product.title}
                      </h3>

                      {/* Colors */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          {productColors.map((color, index) => (
                            <div
                              key={index}
                              onClick={() => selectProductColor(product.id, index)}
                              className={cn(
                                "w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer",
                                selectedProductColors[product.id] === index
                                  ? "border border-[#D9D9D9] bg-transparent"
                                  : ""
                              )}
                            >
                              <div
                                className="w-7 h-7 rounded-full"
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="space-y-1">
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="text-base text-black opacity-60 font-geist font-normal line-through">
                            Previously ${product.comparePrice.toFixed(2)}
                          </div>
                        )}
                        <div className="text-[22px] font-bold font-sora text-black">
                          ${product.price.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground font-sans">
                          VAT included
                        </p>
                      </div>

                      {/* See Details Button */}
                      <Button 
                        variant="outline"
                        className="w-full font-sora font-semibold text-[18px] h-[53px] rounded-[11px] bg-transparent border-[#E3E3E3] hover:bg-black hover:border-black text-black hover:text-white transition-all duration-300 mt-6"
                      >
                        See Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold font-sora mb-2">No products found</h3>
              <p className="text-muted-foreground font-sans">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}