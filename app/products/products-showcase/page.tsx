import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProductsShowcaseClient } from "@/components/products/ProductsShowcaseClient"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Metadata } from "next"
import { requireSellerAuth } from "@/lib/seller-auth"
import { QueryProvider } from "@/providers/query-provider"

export const metadata: Metadata = {
  title: "Products Showcase | Dropleather Inc.",
}

export default async function ProductsShowcasePage() {
  const { session, profile } = await requireSellerAuth()

  // User data from authenticated seller
  const userData = {
    name: profile.full_name || 'Seller',
    email: profile.email || session.user.email || 'seller@dropleather.com',
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <QueryProvider>
      <SidebarProvider
        className="font-sans"
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" user={userData} />
        <SidebarInset>
          <SiteHeader title="Products Showcase" />
          <div className="flex flex-1 flex-col">
            <ProductsShowcaseClient />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  )
}