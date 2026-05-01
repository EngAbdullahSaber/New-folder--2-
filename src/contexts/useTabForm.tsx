'use client'

import { createContext, useContext, useState } from 'react'

type TabFormContextType = {
  tabContextValue: string
  setTabContextValue: (value: string) => void
}

const TabFormContext = createContext<TabFormContextType>({
  tabContextValue: '0',
  setTabContextValue: () => {}
})

export const TabFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabContextValue, setTabContextValue] = useState('0')

  // const setActiveTab = (groupKey: string, value: string) => {
  //   setTabs(prev => ({
  //     ...prev,
  //     [groupKey]: value
  //   }))
  // }

  return <TabFormContext.Provider value={{ tabContextValue, setTabContextValue }}>{children}</TabFormContext.Provider>
}

export const useTabFormContext = () => useContext(TabFormContext)
