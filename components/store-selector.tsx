"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Store } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const stores = [
  {
    value: "main-store",
    label: "Main Store",
  },
  {
    value: "fashion-boutique",
    label: "Fashion Boutique",
  },
  {
    value: "sports-gear",
    label: "Sports Gear",
  },
  {
    value: "electronics-hub",
    label: "Electronics Hub",
  },
  {
    value: "home-decor",
    label: "Home Decor",
  },
]

export function StoreSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("main-store")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between font-sans"
          size="sm"
        >
          <Store className="h-4 w-4 mr-2" />
          {value
            ? stores.find((store) => store.value === value)?.label
            : "Select store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder="Search stores..." className="h-9" />
          <CommandList>
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup>
              {stores.map((store) => (
                <CommandItem
                  key={store.value}
                  value={store.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {store.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === store.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}