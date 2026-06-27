"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Tabs({ className, children, ...props }: React.PropsWithChildren<{ className?: string }>) {
  const [active, setActive] = React.useState(0)
  return <div className={cn(className)} data-active-tab={active} {...props}>{children}</div>
}

function TabsList({ className, children, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1", className)} role="tablist" {...props}>{children}</div>
}

function TabsTrigger({ className, children, ...props }: React.PropsWithChildren<{ className?: string } & Record<string, unknown>>) {
  return <button className={cn("rounded-md px-3 py-1.5 text-sm font-medium", className)} role="tab" {...props}>{children}</button>
}

function TabsContent({ className, children, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("mt-2", className)} role="tabpanel" {...props}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
