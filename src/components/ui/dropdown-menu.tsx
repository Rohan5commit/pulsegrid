"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function DropdownMenu({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function DropdownMenuTrigger({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function DropdownMenuContent({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-md", className)} {...props}>{children}</div>
}

function DropdownMenuItem({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm", className)} {...props}>{children}</div>
}

function DropdownMenuSeparator(props: Record<string, unknown>) {
  return <div className="my-1 h-px bg-[var(--color-border)]" />
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }
