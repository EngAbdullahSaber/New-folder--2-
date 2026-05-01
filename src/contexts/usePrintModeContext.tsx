'use client'

import React, { createContext, useContext, useState } from 'react'

// Create a context
const PrintModeContext = createContext({
  isPrintMode: false,
  selectedRowsToPrint: [] as any[], // ✅ NEW: Store selected rows for printing
  setPrintMode: (mode: boolean) => {},
  setSelectedRowsToPrint: (rows: any[]) => {}, // ✅ NEW: Set selected rows
  triggerPrintMode: (selectedRows?: any[]) => {} // ✅ UPDATED: Accept selected rows
})

// Create a provider component
export const PrintModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPrintMode, setIsPrintMode] = useState(false)
  const [selectedRowsToPrint, setSelectedRowsToPrint] = useState<any[]>([]) // ✅ NEW

  const handleBeforePrint = () => {
    setIsPrintMode(true)
  }

  const handleAfterPrint = () => {
    // Clear selected rows after printing
    setTimeout(() => {
      setIsPrintMode(false)
      setSelectedRowsToPrint([]) // ✅ Clear selected rows
    }, 500)
  }

  // Listen for print events
  React.useEffect(() => {
    window.addEventListener('beforeprint', handleBeforePrint)
    window.addEventListener('afterprint', handleAfterPrint)

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint)
      window.removeEventListener('afterprint', handleAfterPrint)
    }
  }, [])

  // ✅ UPDATED: Accept selectedRows parameter
  const triggerPrintMode = (selectedRows?: any[]) => {
    if (selectedRows && selectedRows.length > 0) {
      setSelectedRowsToPrint(selectedRows) // ✅ Store selected rows
    } else {
      setSelectedRowsToPrint([]) // ✅ Clear if no selection (print all)
    }

    setIsPrintMode(true)
    setTimeout(() => window.print(), 200)
    setTimeout(() => {
      setIsPrintMode(false)
      setSelectedRowsToPrint([]) // ✅ Clear after print
    }, 300)
  }

  return (
    <PrintModeContext.Provider
      value={{
        isPrintMode,
        selectedRowsToPrint, // ✅ Expose to consumers
        setPrintMode: setIsPrintMode,
        setSelectedRowsToPrint, // ✅ Expose setter
        triggerPrintMode
      }}
    >
      {children}
    </PrintModeContext.Provider>
  )
}

// Create a custom hook to use print mode context
export const usePrintMode = () => useContext(PrintModeContext)
