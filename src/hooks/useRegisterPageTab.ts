'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePageTabs, type PageTabMode } from '@/contexts/pageTabsContext'

const MODE_LABELS: Record<string, string> = {
  add: 'اضافة',
  edit: 'تعديل',
  show: 'عرض',
  search: 'بحث',
  list: 'قائمة'
}

// Two-tone palette: light = used in light mode, dark = used in dark mode
// active = badge on the colored active tab, inactive = badge on the muted inactive tab
const MODE_COLORS: Record<string, { light: string; dark: string; active: string }> = {
  add:    { light: '#2e7d32', dark: '#81c784', active: '#ffffff' }, // green
  edit:   { light: '#e65100', dark: '#ffb74d', active: '#ffffff' }, // orange
  show:   { light: '#0277bd', dark: '#4fc3f7', active: '#ffffff' }, // blue
  search: { light: '#6a1b9a', dark: '#ce93d8', active: '#ffffff' }, // purple
  list:   { light: '#37474f', dark: '#90a4ae', active: '#ffffff' }, // slate
}

/**
 * Call this at the top of any page/details component.
 * It will register the page as a tab automatically.
 *
 * @param title   - Arabic/translated screen name (use dictionary key or literal string)
 * @param icon    - Remix icon class e.g. 'ri-file-list-3-line'
 */
export const useRegisterPageTab = (title: string, icon?: string, screenId?: string | number) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { openTab } = usePageTabs()

  const mode = (searchParams.get('mode') || 'list') as PageTabMode
  const url = `${pathname}?${searchParams.toString()}`
  const targetId = url // Unique identity is the URL

  const lastRegisteredUrl = useRef<string | null>(null)

  useEffect(() => {
    // Only register if the URL actually changed for this component instance
    // or if it's the first time and we have a valid title.
    if (title && title !== '...' && title !== '' && lastRegisteredUrl.current !== url) {
      openTab({ id: targetId, url, title, mode, icon, screenId })
      lastRegisteredUrl.current = url
    }
  }, [targetId, url, title, mode, icon, screenId, openTab])
}

export { MODE_LABELS, MODE_COLORS }
