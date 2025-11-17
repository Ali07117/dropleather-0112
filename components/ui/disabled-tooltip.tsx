import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

interface DisabledTooltipProps {
  children: React.ReactNode
  disabled: boolean
  message: string
}

export function DisabledTooltip({ children, disabled, message }: DisabledTooltipProps) {
  if (!disabled) {
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-not-allowed">
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}