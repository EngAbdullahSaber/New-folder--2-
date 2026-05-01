'use client'

import { createContext, useContext, useRef } from 'react'

import type { UseFormReturn } from 'react-hook-form'

interface FormContextType {
  registerForm: (id: string, formMethods: UseFormReturn<any>) => void
  unregisterForm: (id: string) => void
  validateAllForms: () => Promise<boolean>
}

const FormContext = createContext<FormContextType | null>(null)

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const forms = useRef<Record<string, UseFormReturn<any>>>({})

  const registerForm = (id: string, formMethods: UseFormReturn<any>) => {
    forms.current[id] = formMethods
  }

  const unregisterForm = (id: string) => {
    delete forms.current[id]
  }

  const validateAllForms = async () => {
    const results = await Promise.all(
      Object.values(forms.current).map(form => form.trigger()) // Validates all forms
    )

    return results.every(isValid => isValid) // Check if all forms are valid
  }

  return (
    <FormContext.Provider value={{ registerForm, unregisterForm, validateAllForms }}>{children}</FormContext.Provider>
  )
}

export const useFormContext = () => {
  const context = useContext(FormContext)

  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider')
  }

  return context
}
