"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon | (() => React.ReactNode)
    showCount?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.name}
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {item.items?.length ? (
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    {typeof item.icon === 'function' ? item.icon() : <item.icon className="!size-5" />}
                    <span className="text-sm font-sans font-normal">{item.name}</span>
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
                    {typeof item.icon === 'function' ? item.icon() : <item.icon className="!size-5" />}
                    <span className="text-sm font-sans font-normal">{item.name}</span>
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
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="text-sidebar-foreground/70 !size-5" />
            <span className="text-sm font-sans font-normal">More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
