"use client"

import * as React from "react"

function TooltipProvider({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

export { TooltipProvider }
