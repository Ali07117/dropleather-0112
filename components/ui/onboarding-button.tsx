import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const onboardingButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        animated: "bg-black text-white dark:bg-white dark:text-black font-geist font-medium relative overflow-hidden rounded-[10px] group transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function OnboardingButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof onboardingButtonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  // If animated variant, render with subscription-plan style effects
  if (variant === "animated") {
    return (
      <Comp
        data-slot="button"
        className={cn(onboardingButtonVariants({ variant, size, className }))}
        {...props}
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 dark:to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Text and Icon with slide-up animation */}
        <div className="relative z-10 overflow-hidden h-full flex items-center w-full">
          {/* First set (visible initially) */}
          <div className="flex items-center justify-between w-full transform translate-y-0 group-hover:-translate-y-full transition-transform duration-300 px-3">
            <span className="text-left">{children}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="!w-[22px] !h-[22px] flex-shrink-0 ml-3">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* Second set (slides in from below) */}
          <div className="flex items-center justify-between w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 absolute inset-0 px-3">
            <span className="text-left">{children}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="!w-[22px] !h-[22px] flex-shrink-0 ml-3">
              <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Comp>
    )
  }

  // Default behavior for other variants
  return (
    <Comp
      data-slot="button"
      className={cn(onboardingButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { OnboardingButton, onboardingButtonVariants }