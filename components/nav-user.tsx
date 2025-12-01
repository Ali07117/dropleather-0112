"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"
import { logout } from "@/app/actions/auth"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
    subscription_plan?: string
  }
}) {
  const { isMobile } = useSidebar()

  // Get subscription plan badge styles
  const getSubscriptionBadge = (plan?: string) => {
    const planLower = plan?.toLowerCase() || 'free'

    const styles = {
      free: {
        bg: 'transparent',
        text: 'text-muted-foreground',
        border: 'border border-muted-foreground/30'
      },
      professional: {
        bg: 'bg-blue-500',
        text: 'text-white',
        border: ''
      },
      enterprise: {
        bg: 'bg-purple-500',
        text: 'text-white',
        border: ''
      }
    }

    const style = styles[planLower as keyof typeof styles] || styles.free
    const displayName = planLower === 'professional' ? 'Pro' :
                       planLower.charAt(0).toUpperCase() + planLower.slice(1)

    return { style, displayName }
  }

  const { style: badgeStyle, displayName } = getSubscriptionBadge(user.subscription_plan)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                    {displayName}
                  </span>
                </div>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                      {displayName}
                    </span>
                  </div>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <a href="/account/details" className="flex items-center">
                  <IconUserCircle />
                  Account
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/account/billing" className="flex items-center">
                  <IconCreditCard />
                  Billing
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/account/notifications" className="flex items-center">
                  <IconNotification />
                  Notifications
                </a>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={async () => {
                await logout()
              }}
              className="cursor-pointer"
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
