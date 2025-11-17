import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireSellerAuth } from "@/lib/seller-auth"
import { QueryProvider } from "@/providers/query-provider"
import { SubscriptionProvider } from "@/providers/subscription-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

  // Prepare user data with fallbacks
  const userData = {
    name: profile?.name || session?.user?.email?.split('@')[0] || 'Seller',
    email: profile?.email || session?.user?.email || 'seller@dropleather.com',
    avatar: "/avatars/shadcn.jpg",
    subscription_plan: profile?.subscription_plan || 'free',
  }

  return (
    <QueryProvider>
      <SubscriptionProvider userPlan={userData.subscription_plan}>
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
            {children}
          </SidebarInset>
        </SidebarProvider>
      </SubscriptionProvider>
    </QueryProvider>
  )
}