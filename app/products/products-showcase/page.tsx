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
  let session, profile, authError = null;

  try {
    const result = await requireSellerAuth();
    session = result.session;
    profile = result.profile;
  } catch (error) {
    authError = error instanceof Error ? error.message : String(error);
  }

  // Show error if authentication failed
  if (authError) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <pre className="text-sm text-red-800 whitespace-pre-wrap">{authError}</pre>
        </div>
      </div>
    );
  }

  // User data from authenticated seller
  const userData = {
    name: profile?.full_name || 'Seller',
    email: profile?.email || session?.user?.email || 'seller@dropleather.com',
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