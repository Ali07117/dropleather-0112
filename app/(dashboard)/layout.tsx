import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireSellerAuth } from "@/lib/seller-auth"
import { QueryProvider } from "@/providers/query-provider"
import { SubscriptionProvider } from "@/providers/subscription-provider"
import { AuthProvider } from "@/components/auth-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user, profile, authError = null;

  try {
    const result = await requireSellerAuth();
    user = result.user;
    profile = result.profile;
  } catch (error) {
    authError = error instanceof Error ? error.message : String(error);
  }

  // Show error if authentication failed and redirect to auth subdomain
  if (authError) {
    return (
      <script dangerouslySetInnerHTML={{
        __html: `
          console.log('Authentication error, redirecting to auth subdomain');
          window.location.href = 'https://auth.dropleather.com/login';
        `
      }} />
    );
  }

  // Prepare user data with fallbacks
  const userData = {
    name: profile?.name || user?.email?.split('@')[0] || 'Seller',
    email: profile?.email || user?.email || 'seller@dropleather.com',
    avatar: "/avatars/shadcn.jpg",
    subscription_plan: profile?.subscription_plan || 'free',
  }

  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}