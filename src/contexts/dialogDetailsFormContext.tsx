// src/contexts/dialogDetailsFormContext.tsx
'use client'
import React, { createContext, useContext } from 'react'
import type { DialogDetailsFormContextType } from '@/types/components/dialogDetailsForm'

// Re-export types for convenience
export type { TabConfig, TabContentProps, DialogDetailsFormContextType } from '@/types/components/dialogDetailsForm'

const DialogDetailsFormContext = createContext<DialogDetailsFormContextType | null>(null)

export const DialogDetailsFormProvider: React.FC<{
    children: React.ReactNode
    value: DialogDetailsFormContextType
}> = ({ children, value }) => (
    <DialogDetailsFormContext.Provider value={value}>
        {children}
    </DialogDetailsFormContext.Provider>
)

export const useDialogDetailsForm = () => {
    const ctx = useContext(DialogDetailsFormContext)
    if (!ctx) throw new Error('useDialogDetailsForm must be used within DialogDetailsFormProvider')
    return ctx
}
