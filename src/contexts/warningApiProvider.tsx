'use client'

import { createContext, useContext, useState } from 'react'

type WarningApiContextType = {
  warning: string | null
  setWarning: (warning: string | null) => void
}

const WarningApiContext = createContext<WarningApiContextType>({
  warning: null,
  setWarning: () => {}
})

export const WarningApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [warning, setWarning] = useState<string | null>(null)

  return <WarningApiContext.Provider value={{ warning, setWarning }}>{children}</WarningApiContext.Provider>
}

export const useWarningApi = () => useContext(WarningApiContext)
