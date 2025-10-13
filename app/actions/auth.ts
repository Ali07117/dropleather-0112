'use server'

import { createClientSupabase } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logout() {
  try {
    const supabase = createClientSupabase()
    
    // Server-side session termination using Supabase auth
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Supabase logout error:', error)
    }
    
    // Clear any cached data
    revalidatePath('/', 'layout')
    
  } catch (error) {
    console.error('Logout process failed:', error)
  }
  
  // Server-side redirect to login
  redirect('/login')
}