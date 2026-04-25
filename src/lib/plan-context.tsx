'use client'

import { createContext, useContext } from 'react'

interface PlanContextValue {
  isPro: boolean
}

export const PlanContext = createContext<PlanContextValue>({ isPro: false })

export function PlanProvider({
  isPro,
  children,
}: {
  isPro: boolean
  children: React.ReactNode
}) {
  return (
    <PlanContext.Provider value={{ isPro }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlanContext() {
  return useContext(PlanContext)
}
