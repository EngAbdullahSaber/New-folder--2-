'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export type PageTabMode = 'add' | 'edit' | 'show' | 'search' | 'list' | string

export type PageTab = {
  id: string         // unique id, usually the route path
  url?: string        // full URL with query
  title: string      // screen name (Arabic / translated)
  mode: PageTabMode  // current mode badge
  icon?: string      // optional remix icon class
  pinned?: boolean   // home / dashboard never close
  screenId?: string | number // backend object id
}

type PageTabsContextType = {
  tabs: PageTab[]
  activeTabId: string | null
  openTab: (tab: Omit<PageTab, 'id'> & { id?: string }) => void
  openNewTab: () => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTab: (id: string, updates: Partial<PageTab>) => void
  setTabs: React.Dispatch<React.SetStateAction<PageTab[]>>
}

const PageTabsContext = createContext<PageTabsContextType | undefined>(undefined)

export const PageTabsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tabs, setTabs] = useState<PageTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const activeTabIdRef = useRef<string | null>(null)

  // Sync ref with state
  useEffect(() => {
    activeTabIdRef.current = activeTabId
  }, [activeTabId])

  // Helper to update state and ref together
  const setActiveTab = useCallback((id: string | null) => {
    setActiveTabId(id)
    activeTabIdRef.current = id
  }, [])

  const openTab = useCallback((tab: Omit<PageTab, 'id'> & { id?: string }) => {
    const targetId = tab.url || `tab-${Date.now()}`

    setTabs(prev => {
      // 1. If this exact URL is already open in a tab, just activate it and clean up placeholder
      const existing = prev.find(t => t.id === targetId)
      if (existing) {
        if (activeTabIdRef.current?.startsWith('new-tab-')) {
          const blankTab = prev.find(t => t.id === activeTabIdRef.current)
          if (blankTab && !blankTab.url) {
             return prev.filter(t => t.id !== activeTabIdRef.current)
          }
        }
        return prev
      }

      // 2. Identify if we are "filling" a blank tab
      const isBlank = activeTabIdRef.current?.startsWith('new-tab-') || prev.length === 0
      
      if (isBlank && prev.length > 0) {
        return prev.map(t => t.id === activeTabIdRef.current ? { ...t, ...tab, id: targetId } as PageTab : t)
      }

      // 3. Navigate within current tab if not pinned
      const activeTab = prev.find(t => t.id === activeTabIdRef.current)
      if (activeTab && !activeTab.pinned) {
          return prev.map(t => t.id === activeTabIdRef.current ? { ...t, ...tab, id: targetId } as PageTab : t)
      }

      // 4. Default: Add new tab
      return [...prev, { ...tab, id: targetId } as PageTab]
    })

    setActiveTab(targetId)
  }, [setActiveTab]) 

  const openNewTab = useCallback(() => {
    const id = `new-tab-${Date.now()}`
    const newTab: PageTab = {
      id,
      title: 'جديد',
      mode: '',
      icon: ''
    }
    setTabs(prev => [...prev, newTab])
    setActiveTab(id)
  }, [setActiveTab])

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const idx = prev.findIndex(t => t.id === id)
      const next = prev.filter(t => t.id !== id)
      
      const cur = activeTabIdRef.current
      if (cur === id) {
        // activate neighbour tab
        if (next.length === 0) {
          setActiveTab(null)
        } else {
          const newIdx = Math.max(0, idx - 1)
          setActiveTab(next[newIdx]?.id ?? null)
        }
      }

      return next
    })
  }, [setActiveTab])

  const updateTab = useCallback((id: string, updates: Partial<PageTab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  return (
    <PageTabsContext.Provider
      value={{ tabs, activeTabId, openTab, openNewTab, closeTab, setActiveTab, updateTab, setTabs }}
    >
      {children}
    </PageTabsContext.Provider>
  )
}

export const usePageTabs = () => {
  const ctx = useContext(PageTabsContext)
  if (!ctx) throw new Error('usePageTabs must be used within PageTabsProvider')
  return ctx
}
