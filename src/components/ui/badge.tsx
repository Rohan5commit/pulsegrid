import * as React from "react"
import { cn } from "@/lib/utils"

function Badge({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full border border-transparent bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
