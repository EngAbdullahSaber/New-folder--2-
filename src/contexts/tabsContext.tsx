// context/TabsContext.tsx

'use client'

import React, { createContext, useContext, useState } from 'react'

type Tab = {
  id: string
  title: string
  content: React.ReactNode
}

type TabsContextType = {
  tabs: Tab[]
  activeTab: string
  setActiveTab: (id: string) => void
  addTab: (title: string, content: React.ReactNode) => void
  deleteTab: (id: string) => void
  updateTabContent: (id: string, content: React.ReactNode) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export const TabsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTab, setActiveTabState] = useState<string | null>(null)

  const setActiveTab = (id: string) => setActiveTabState(id)

  const addTab = (title: string, content: React.ReactNode) => {
    const id = `tab-${Date.now()}`
    setTabs(prevTabs => [...prevTabs, { id, title, content }])
    setActiveTabState(id)
  }

  const deleteTab = (id: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== id))
    if (activeTab === id && tabs.length > 1) {
      setActiveTab(tabs[0].id) // Set the first tab as active
    }
  }

  const updateTabContent = (id: string, content: React.ReactNode) => {
    setTabs(prevTabs => prevTabs.map(tab => (tab.id === id ? { ...tab, content } : tab)))
  }

  return (
    <TabsContext.Provider
      value={{ tabs, activeTab: activeTab || '', setActiveTab, addTab, deleteTab, updateTabContent }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider')
  }
  return context
}
