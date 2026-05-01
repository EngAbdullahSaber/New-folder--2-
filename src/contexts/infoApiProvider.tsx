'use client'

import { createContext, useContext, useState } from 'react'

type InfoApiContextType = {
  info: string | null
  setInfo: (info: string | null) => void
}

const InfoApiContext = createContext<InfoApiContextType>({
  info: null,
  setInfo: () => {}
})

export const InfoApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [info, setInfo] = useState<string | null>(null)

  return <InfoApiContext.Provider value={{ info, setInfo }}>{children}</InfoApiContext.Provider>
}

export const useInfoApi = () => useContext(InfoApiContext)
