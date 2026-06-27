"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Dialog({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function DialogTrigger({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function DialogContent({ children, className, ...props }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50", className)}>
      <div className="rounded-xl bg-[var(--color-surface)] p-6 shadow-xl">{children}</div>
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-[var(--color-muted-foreground)]", className)} {...props} />
}

function DialogClose({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return <>{children}</>
}

function DialogOverlay(props: Record<string, unknown>) { return null }
function DialogPortal({ children }: React.PropsWithChildren) { return <>{children}</> }

export {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogOverlay, DialogPortal,
  DialogTitle, DialogTrigger,
}
