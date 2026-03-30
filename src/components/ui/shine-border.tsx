"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ShineBorderProps = {
  children: ReactNode
  className?: string
  borderWidth?: number
  duration?: number
}

export function ShineBorder({
  children,
  className,
  borderWidth = 2,
  duration = 4,
}: ShineBorderProps) {
  return (
    <div
      className={cn("relative rounded-2xl", className)}
      style={{ padding: borderWidth }}
    >
      {/* Animated Gradient Layer */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div
          className="absolute -inset-full blur-sm animate-shine-rotate"
          style={{
            background: "conic-gradient(from 0deg, #3b82f6, #ef4444, #2dd4bf, #3b82f6)",
            '--shine-duration': `${duration}s`,
          } as React.CSSProperties}
        />
      </div>
      {/* Content Layer */}
      <div className="relative rounded-2xl bg-card">
        {children}
      </div>
    </div>
  )
}
