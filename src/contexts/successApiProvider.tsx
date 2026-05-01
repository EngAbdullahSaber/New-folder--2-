// Create a new SuccessApiProvider component
'use client'

import { createContext, useContext, useState } from 'react'

type SuccessApiContextType = {
  success: string | null
  setSuccess: (Success: string | null) => void
}

const SuccessApiContext = createContext<SuccessApiContextType>({
  success: null,
  setSuccess: () => { }
})

export const SuccessApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [success, setSuccess] = useState<string | null>(null)

  return (
    <SuccessApiContext.Provider value={{ success, setSuccess }}>
      {children}
    </SuccessApiContext.Provider>
  )
}

export const useSuccessApi = () => useContext(SuccessApiContext)
