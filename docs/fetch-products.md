 🗺️ Updated Implementation Roadmap for Seller Products (React Query)

  🧠 Updated Understanding

  Current State:
  - /Products/Products-Showcase in app-dropleather-v2 shows demo/static products
  - Replace with real products from api.products database
  - Only authenticated sellers can access (no anonymous access)
  - Auth redirect: auth.dropleather.com (not local login page)

  Key Changes:
  1. Authentication First - Redirect to auth.dropleather.com if not logged in
  2. Seller Role Check - Only role: "seller" users can view products
  3. Real Data - Fetch from api.products via backend API with React Query
  4. Live Updates - Optimized Supabase Realtime with dedicated hook

  🗺️ Implementation Roadmap

  Phase 1: Database & RLS Setup

  -- 1. Enable RLS on api.products table
  ALTER TABLE api.products ENABLE ROW LEVEL SECURITY;

  -- 2. Create seller read policy
  CREATE POLICY "Sellers can read active products"
  ON api.products
  FOR SELECT
  TO authenticated
  USING (
    status = 'active'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid()
        AND p.role = 'seller'
        AND p.is_active = true
    )
  );

  -- 3. Verify profiles table has seller roles
  -- Users need: { "role": "seller", "is_active": true }

  Phase 2: Backend API Layer

  // Create API endpoint in api-dropleather
  // Route: GET /v1/products/active

  // Logic:
  // 1. Verify JWT token from auth.dropleather.com
  // 2. Check user role = "seller" from profiles table
  // 3. Use Prisma ORM to fetch active products
  // 4. Return products from api.products WHERE status = 'active'

  Phase 3: Frontend Authentication & Redirects

  // Update: /app/Products/Products-Showcase/page.tsx

  export default async function ProductsShowcasePage() {
    // 1. Check Supabase session
    const session = await getSession()

    if (!session) {
      // 🚨 NEW: Redirect to auth.dropleather.com
      redirect('https://auth.dropleather.com/login?redirect_to=' +
               encodeURIComponent('https://app.dropleather.com/Products/Products-Showcase'))
    }

    // 2. Verify seller role
    const profile = await getProfile(session.user.id)

    if (profile?.role !== 'seller' || !profile?.is_active) {
      // Show access denied page or redirect to auth with error
      redirect('https://auth.dropleather.com/access-denied')
    }

    // 3. Render component for authenticated sellers only
    return <ProductsShowcaseClient />
  }

  Phase 4: Setup React Query Provider

  // Update: /app/layout.tsx or create QueryProvider wrapper

  'use client'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
  import { useState } from 'react'

  export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000,   // 10 minutes
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
          retry: 1
        }
      }
    }))

    return (
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  }

  // Wrap your app:
  // <QueryProvider>
  //   <ProductsShowcaseClient />
  // </QueryProvider>

  Phase 5: Frontend Data Fetching with React Query

  // Update: /components/products/ProductsShowcaseClient.tsx

  "use client"
  import { useQuery, useQueryClient } from '@tanstack/react-query'
  import { useProductsRealtime } from '@/hooks/useProductsRealtime'
  import { createClient } from '@/lib/supabase/client'

  // API function
  async function fetchActiveProducts() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No valid session')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/products/active`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    })

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
    return data.products
  }

  export function ProductsShowcaseClient() {
    const queryClient = useQueryClient()

    // 🆕 Use React Query for data fetching and caching
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
        if (error.message === 'Authentication required') return false
        return failureCount < 2
      }
    })

    // 🆕 Separate Realtime hook for real-time updates
    useProductsRealtime({
      onProductChange: (eventType, product) => {
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

    // Handle loading states
    if (isLoading) return <ProductsLoading />
    if (isError) return <ProductsError error={error} onRetry={refetch} />
    if (!products.length) return <ProductsEmpty />

    // Use existing UI components with real data
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col lg:flex-row gap-6 py-4 md:py-6 px-4 lg:px-6">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-80 flex-shrink-0">
            {/* Existing filter UI */}
          </div>

          {/* Right Side - Product Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-sora mb-2">Products Showcase</h1>
              <p className="text-muted-foreground font-sans">
                Discover our premium leather collection with {products.length} products
              </p>
            </div>

            {/* Product Grid with real data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  Phase 6: Optimized Realtime Hook

  // Create: /hooks/useProductsRealtime.ts

  import { useEffect } from 'react'
  import { createClient } from '@/lib/supabase/client'

  interface UseProductsRealtimeProps {
    onProductChange: (eventType: 'INSERT' | 'UPDATE' | 'DELETE', product: any) => void
  }

  export function useProductsRealtime({ onProductChange }: UseProductsRealtimeProps) {
    useEffect(() => {
      const supabase = createClient()

      // 🚀 Optimized subscription - specific to products table only
      const subscription = supabase
        .channel('products_changes')
        .on('postgres_changes', {
          event: '*',           // INSERT, UPDATE, DELETE
          schema: 'api',        // Specific schema
          table: 'products'     // Specific table only
        }, (payload) => {
          console.log('🔄 Product realtime update:', payload)

          const { eventType, new: newRecord, old: oldRecord } = payload
          const productData = eventType === 'DELETE' ? oldRecord : newRecord

          onProductChange(eventType as 'INSERT' | 'UPDATE' | 'DELETE', productData)
        })
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            console.log('📡 Products realtime connected')
          }
          if (status === 'CHANNEL_ERROR') {
            console.error('❌ Products realtime error:', err)
          }
          if (status === 'TIMED_OUT') {
            console.warn('⏰ Products realtime timed out')
          }
          if (status === 'CLOSED') {
            console.log('📡 Products realtime disconnected')
          }
        })

      // Cleanup subscription
      return () => {
        console.log('🔌 Unsubscribing from products realtime')
        subscription.unsubscribe()
      }
    }, [onProductChange])
  }

  Phase 7: Auth Error Handling & Loading Components

  // Create: /lib/auth-redirects.ts
  const AUTH_BASE_URL = 'https://auth.dropleather.com'

  export function redirectToAuth(reason = 'login') {
    const currentUrl = encodeURIComponent(window.location.href)
    const authUrl = `${AUTH_BASE_URL}/${reason}?redirect_to=${currentUrl}`
    window.location.href = authUrl
  }

  // Create: /components/products/ProductsLoading.tsx
  export function ProductsLoading() {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  // Create: /components/products/ProductsError.tsx
  interface ProductsErrorProps {
    error: Error
    onRetry: () => void
  }

  export function ProductsError({ error, onRetry }: ProductsErrorProps) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold font-sora mb-2">Unable to load products</h3>
        <p className="text-muted-foreground font-sans mb-4">{error.message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Create: /components/products/ProductsEmpty.tsx
  export function ProductsEmpty() {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-semibold font-sora mb-2">No products available</h3>
        <p className="text-muted-foreground font-sans">
          Products will appear here when they become available
        </p>
      </div>
    )
  }

  🔄 Updated Data Flow

  1. User visits app.dropleather.com/Products/Products-Showcase
  2. Check if authenticated via Supabase session
  3. If not authenticated → Redirect to auth.dropleather.com/login
  4. If authenticated but not seller → Redirect to auth.dropleather.com/access-denied
  5. If seller → React Query fetches products from backend API
  6. Display products in existing UI components
  7. useProductsRealtime hook subscribes to api.products changes only
  8. Realtime updates merge with React Query cache for instant UI updates
  9. Background revalidation keeps data fresh

  🎯 Files to Modify

  1. /app/Products/Products-Showcase/page.tsx - Add auth checks + redirects to auth.dropleather.com
  2. /components/products/ProductsShowcaseClient.tsx - Replace static data with React Query + Realtime
  3. /hooks/useProductsRealtime.ts - NEW Dedicated Realtime hook
  4. /lib/auth-redirects.ts - NEW Auth redirect utilities
  5. /components/products/ProductsLoading.tsx - NEW Loading component
  6. /components/products/ProductsError.tsx - NEW Error component
  7. /components/products/ProductsEmpty.tsx - NEW Empty state component
  8. Backend API - Create /v1/products/active endpoint with seller role validation
  9. Database - Add RLS policies for seller access

  📋 Updated Technical Stack

  - ✅ Authentication: Supabase Auth via auth.dropleather.com
  - ✅ Role Check: Only role: "seller" from profiles table
  - ✅ Data Fetching: React Query (@tanstack/react-query) for caching & revalidation
  - ✅ Data Source: api.products via backend API (Prisma ORM)
  - ✅ Real-time: Optimized Supabase Realtime (products table only)
  - ✅ Real-time Hook: Separate useProductsRealtime hook
  - ✅ Security: RLS policies + JWT validation
  - ✅ Auth Redirects: auth.dropleather.com for all auth flows

  🚀 React Query Advantages

  Frontend Fetch Strategy:
  - ✅ React Query handles caching, revalidation, error retry, and loading states
  - ✅ Background updates keep data fresh without blocking UI
  - ✅ Optimistic updates via Realtime for instant responsiveness
  - ✅ DevTools for debugging cache and queries
  - ✅ Automatic refetch on network reconnection

  Realtime Optimization:
  - ✅ Targeted subscriptions: Only api.products table (no wildcards)
  - ✅ Reduced bandwidth: Specific schema and table filtering
  - ✅ Separate hook: Clean separation of concerns
  - ✅ Smart merging: Realtime updates integrate with React Query cache via setQueryData