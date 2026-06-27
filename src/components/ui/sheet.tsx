"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Sheet({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function SheetTrigger({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function SheetContent({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("fixed inset-y-0 right-0 z-50 w-72 bg-[var(--color-surface)] p-4 shadow-xl", className)} {...props}>
      {children}
    </div>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

function SheetClose({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

export { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger }
