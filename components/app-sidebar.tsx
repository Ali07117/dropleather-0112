"use client"

import * as React from "react"
import {
  IconHelp,
  IconInnerShadowTop,
  IconBook,
} from "@tabler/icons-react"
import { Lock } from "lucide-react"
import Image from "next/image"

import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { useSubscription } from "@/hooks/useSubscription"
import { DisabledTooltip } from "@/components/ui/disabled-tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: () => <Image src="/images/dashboard.svg" alt="Dashboard" width={20} height={20} />,
      showCount: false,
    },
    {
      title: "Branding",
      url: "#",
      icon: () => <Image src="/images/branding.svg" alt="Branding" width={20} height={20} />,
      showCount: false,
      requiresFeature: "branding",
      items: [
        {
          title: "Brand Lab",
          url: "/branding/brand-lab",
          showCount: true,
          requiresFeature: "brand-lab-ai",
        },
        {
          title: "AI Virtual Model",
          url: "/branding/virtual-model",
          requiresFeature: "virtual-model",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: () => <Image src="/images/products.svg" alt="Products" width={20} height={20} />,
      showCount: false,
      items: [
        {
          title: "Products Showcase",
          url: "/products/products-showcase",
          showCount: true,
        },
        {
          title: "Private Products",
          url: "/products/private-products",
          showCount: true,
          requiresFeature: "private-products",
        },
        {
          title: "Wishlist",
          url: "#",
          showCount: true,
        },
        {
          title: "Shipping Fees",
          url: "#",
        },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: () => <Image src="/images/orders.svg" alt="Orders" width={20} height={20} />,
      showCount: false,
      items: [
        {
          title: "Orders Control",
          url: "#",
          showCount: true,
        },
        {
          title: "Payments History",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Resource Center",
      url: "#",
      icon: IconBook,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Integration",
      url: "/integration",
      icon: () => <Image src="/images/integrations.svg" alt="Integration" width={20} height={20} />,
      showCount: true,
      requiresFeature: "integration",
    },
  ],
}

export function AppSidebar({ 
  user, 
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string
    email: string
    avatar: string
    subscription_plan?: string
  }
}) {
  const { hasFeature } = useSubscription()

  const handleRestrictedClick = (e: React.MouseEvent, feature: string) => {
    if (!hasFeature(feature)) {
      e.preventDefault()
      // Redirect to subscription page
      window.location.href = `/subscription-plan?feature=${feature}`
    }
  }

  const renderMenuItem = (item: {
    title: string;
    url: string;
    icon?: () => React.ReactNode;
    requiresFeature?: string;
    showCount?: boolean;
  }, isSubItem = false) => {
    const isRestricted = Boolean(item.requiresFeature && !hasFeature(item.requiresFeature))
    const MenuComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton
    const tooltipMessage = isRestricted ? `Upgrade to Pro to unlock ${item.title}` : ""

    const menuButton = (
      <MenuComponent
        asChild={!isRestricted}
        className={isRestricted ? "text-gray-400 cursor-not-allowed" : ""}
        disabled={isRestricted}
      >
        {isRestricted ? (
          <div
            className="flex items-center gap-2 w-full"
            onClick={(e) => handleRestrictedClick(e, item.requiresFeature!)}
          >
            {!isSubItem && item.icon && <item.icon />}
            <span className="text-sm font-sans font-normal">{item.title}</span>
            {isRestricted && item.requiresFeature !== 'branding' && <Lock className="w-3 h-3 ml-auto" />}
            {item.showCount && !isRestricted && (
              <div className="ml-auto min-w-[16px] max-w-[32px] h-[16px] flex items-center justify-center rounded text-[10px] font-bold px-1 bg-sidebar-accent text-sidebar-accent-foreground">
                {0 > 99 ? '+99' : 0}
              </div>
            )}
          </div>
        ) : (
          <a href={item.url}>
            {!isSubItem && item.icon && <item.icon />}
            <span className="text-sm font-sans font-normal">{item.title}</span>
            {item.showCount && (
              <div className="ml-auto min-w-[16px] max-w-[32px] h-[16px] flex items-center justify-center rounded text-[10px] font-bold px-1 bg-sidebar-accent text-sidebar-accent-foreground">
                {0 > 99 ? '+99' : 0}
              </div>
            )}
          </a>
        )}
      </MenuComponent>
    )

    return isRestricted ? (
      <DisabledTooltip disabled={true} message={tooltipMessage}>
        {menuButton}
      </DisabledTooltip>
    ) : menuButton
  }

  return (
    <Sidebar collapsible="offcanvas" className="font-sans font-normal" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-6" />
                <span className="text-base font-sans font-semibold">DropLeather Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isRestricted = Boolean(item.requiresFeature && !hasFeature(item.requiresFeature))
              
              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={true}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.items?.length ? (
                      <CollapsibleTrigger asChild disabled={isRestricted}>
                        {renderMenuItem(item)}
                      </CollapsibleTrigger>
                    ) : (
                      renderMenuItem(item)
                    )}
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem: {
                            title: string;
                            url: string;
                            requiresFeature?: string;
                            showCount?: boolean;
                          }) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              {renderMenuItem(subItem, true)}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
