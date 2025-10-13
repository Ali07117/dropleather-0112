import { useEffect } from 'react'
import { createClientSupabase } from '@/utils/supabase/client'

interface Product {
  id: string
  title: string
  description: string
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

interface UseProductsRealtimeProps {
  onProductChange: (eventType: 'INSERT' | 'UPDATE' | 'DELETE', product: any) => void
}

export function useProductsRealtime({ onProductChange }: UseProductsRealtimeProps) {
  useEffect(() => {
    console.log('🚀 [PRODUCTS REALTIME] Initializing subscription')
    
    // Create Supabase client
    let supabase: any = null
    
    async function setupRealtime() {
      try {
        // Dynamically import Supabase client to avoid hydration issues
        const { createClientSupabase } = await import('@/utils/supabase/client')
        supabase = await createClientSupabase()

        // 🚀 Optimized subscription - specific to products table only
        const subscription = supabase
          .channel('products_changes')
          .on('postgres_changes', {
            event: '*',           // INSERT, UPDATE, DELETE
            schema: 'api',        // Specific schema
            table: 'products'     // Specific table only
          }, (payload: any) => {
            console.log('🔄 Product realtime update:', payload)
            
            const { eventType, new: newRecord, old: oldRecord } = payload
            const productData = eventType === 'DELETE' ? oldRecord : newRecord
            
            onProductChange(eventType as 'INSERT' | 'UPDATE' | 'DELETE', productData)
          })
          .subscribe((status: string, err?: any) => {
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

        return subscription
      } catch (error) {
        console.error('❌ Failed to setup realtime subscription:', error)
        return null
      }
    }

    let subscription: any = null
    
    setupRealtime().then((sub) => {
      subscription = sub
    })

    // Cleanup subscription
    return () => {
      if (subscription) {
        console.log('🔌 Unsubscribing from products realtime')
        subscription.unsubscribe()
      }
    }
  }, [onProductChange])
}