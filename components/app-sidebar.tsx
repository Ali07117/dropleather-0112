"use client"

import * as React from "react"
import {
  IconHelp,
  IconInnerShadowTop,
  IconBook,
} from "@tabler/icons-react"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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
      showCount: true,
      items: [
        {
          title: "Brand Lab",
          url: "#",
        },
        {
          title: "AI Virtual Model",
          url: "#",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: () => <Image src="/images/products.svg" alt="Products" width={20} height={20} />,
      showCount: true,
      items: [
        {
          title: "Products Showcase",
          url: "#",
        },
        {
          title: "Private Products",
          url: "#",
        },
        {
          title: "Wishlist",
          url: "#",
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
      showCount: true,
      items: [
        {
          title: "Orders Control",
          url: "#",
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
      url: "#",
      icon: () => <Image src="/images/integrations.svg" alt="Integration" width={20} height={20} />,
      showCount: true,
    },
    {
      name: "Subscription",
      url: "#",
      icon: () => <Image src="/images/billing.svg" alt="Subscription" width={20} height={20} />,
      items: [
        {
          title: "Subscription Plans",
          url: "#",
        },
        {
          title: "Billing History",
          url: "#",
        },
      ],
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
  }
}) {
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
                <span className="text-base font-sans font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {item.items?.length ? (
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        {item.icon && <item.icon className="!size-5" />}
                        <span className="text-sm font-sans font-normal">{item.title}</span>
                        {item.showCount && (
                          <div className="ml-auto min-w-[16px] max-w-[32px] h-[16px] flex items-center justify-center rounded text-[10px] font-bold px-1" style={{backgroundColor: '#266DF0', color: '#FFFFFF'}}>
                            {0 > 99 ? '+99' : 0}
                          </div>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        {item.icon && <item.icon className="!size-5" />}
                        <span className="text-sm font-sans font-normal">{item.title}</span>
                        {item.showCount && (
                          <div className="ml-auto min-w-[16px] max-w-[32px] h-[16px] flex items-center justify-center rounded text-[10px] font-bold px-1" style={{backgroundColor: '#266DF0', color: '#FFFFFF'}}>
                            {0 > 99 ? '+99' : 0}
                          </div>
                        )}
                      </a>
                    </SidebarMenuButton>
                  )}
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>{subItem.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
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
