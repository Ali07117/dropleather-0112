"use client"

import {
  type Icon,
} from "@tabler/icons-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useSubscription } from "@/hooks/useSubscription"
import { DisabledTooltip } from "@/components/ui/disabled-tooltip"
import { Lock } from "lucide-react"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon | (() => React.ReactNode)
    showCount?: boolean
    requiresFeature?: string
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { hasFeature } = useSubscription()

  const handleRestrictedClick = (e: React.MouseEvent, feature: string) => {
    if (!hasFeature(feature)) {
      e.preventDefault()
      window.location.href = `/subscription-plan?feature=${feature}`
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isRestricted = Boolean(item.requiresFeature && !hasFeature(item.requiresFeature))
          const tooltipMessage = isRestricted ? `Upgrade to Pro to unlock ${item.name}` : ""

          return (
            <Collapsible
              key={item.name}
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items?.length ? (
                  <CollapsibleTrigger asChild disabled={isRestricted}>
                    <SidebarMenuButton
                      className={isRestricted ? "text-gray-400 cursor-not-allowed" : ""}
                      disabled={isRestricted}
                    >
                      {item.icon && <item.icon />}
                      <span className="text-sm font-sans font-normal">{item.name}</span>
                      {isRestricted && <Lock className="w-3 h-3 ml-auto" />}
                      {item.showCount && !isRestricted && (
                        <div className="ml-auto min-w-[16px] max-w-[32px] h-[16px] flex items-center justify-center rounded text-[10px] font-bold px-1 bg-sidebar-accent text-sidebar-accent-foreground">
                          {0 > 99 ? '+99' : 0}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <DisabledTooltip disabled={isRestricted} message={tooltipMessage}>
                    <SidebarMenuButton
                      asChild={!isRestricted}
                      className={isRestricted ? "text-gray-400 cursor-not-allowed" : ""}
                      disabled={isRestricted}
                    >
                      {isRestricted ? (
                        <div
                          className="flex items-center gap-2 w-full"
                          onClick={(e) => handleRestrictedClick(e, item.requiresFeature!)}
                        >
                          {item.icon && <item.icon />}
                          <span className="text-sm font-sans font-normal">{item.name}</span>
                          <Lock className="w-3 h-3 ml-auto" />
                        </div>
                      ) : (
                        <a href={item.url}>
                          {item.icon && <item.icon />}
                          <span className="text-sm font-sans font-normal">{item.name}</span>
                          {item.showCount && (
                            <div className="ml-auto min-w-[16px] max-w-[32px] h-[16px] flex items-center justify-center rounded text-[10px] font-bold px-1 bg-sidebar-accent text-sidebar-accent-foreground">
                              {0 > 99 ? '+99' : 0}
                            </div>
                          )}
                        </a>
                      )}
                    </SidebarMenuButton>
                  </DisabledTooltip>
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
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
