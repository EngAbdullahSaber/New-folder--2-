// Create a new ErrorApiProvider component
'use client'

import { createContext, useContext, useState } from 'react'

type ErrorApiContextType = {
  error: string | null
  setError: (error: string | null) => void
}

const ErrorApiContext = createContext<ErrorApiContextType>({
  error: null,
  setError: () => { }
})

export const ErrorApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null)

  return (
    <ErrorApiContext.Provider value={{ error, setError }}>
      {children}
    </ErrorApiContext.Provider>
  )
}

export const useErrorApi = () => useContext(ErrorApiContext)
