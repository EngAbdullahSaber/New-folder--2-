// menuContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useSessionHandler } from '@/hooks/useSessionHandler'
import { VerticalMenuDataType, HorizontalMenuDataType } from '@/types/menuTypes'
import { fetchRecords_GET, Locale, useParams } from '@/shared'
import { transformBackendDataToMenuData, transformBackendDataToHorizontalMenu } from '@/components/GenerateMenu'
import { getDictionary } from '@/utils/getDictionary'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux-store'
import { setMenuData } from '@/redux-store/slices/menuSlice'
import { useUserData } from '@/hooks/useUserData'

interface MenuContextType {
  verticalMenuData: VerticalMenuDataType[]
  horizontalMenuData: HorizontalMenuDataType[]
  systemObjects: any[]
  isLoading: boolean
  isInitialized: boolean
  refetchMenu: () => Promise<void>
}

const MenuContext = createContext<MenuContextType | null>(null)

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const { userData } = useUserData()
  const { session, accessToken, user, isAuthenticated, status } = useSessionHandler()
  const { lang } = useParams()
  const locale = lang as Locale
  const dispatch = useDispatch()
  const { verticalMenuData, horizontalMenuData, systemObjects, isInitialized } = useSelector(
    (state: RootState) => state.menu
  )

  const [dictionary, setDictionary] = useState<any>(null)
  // const [verticalMenuData, setVerticalMenuData] = useState<VerticalMenuDataType[]>([])
  // const [horizontalMenuData, setHorizontalMenuData] = useState<HorizontalMenuDataType[]>([])
  // const [systemObjects, setSystemObjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchInProgress = React.useRef(false)

  const cacheKey = `systemObjectsCache_${session?.user?.id}_${locale}`

  // ✅ Load dictionary
  useEffect(() => {
    getDictionary(locale).then(setDictionary)
  }, [locale])

  // ✅ Restore cache immediately on mount
  // useEffect(() => {
  //   try {
  //     const cached = localStorage.getItem(cacheKey)
  //     if (cached) {
  //       const parsed = JSON.parse(cached)
  //       setSystemObjects(parsed)

  //       // If we have dictionary, transform to both menu types immediately
  //       if (dictionary) {
  //         setVerticalMenuData(transformBackendDataToMenuData(parsed, dictionary, locale))
  //         setHorizontalMenuData(transformBackendDataToHorizontalMenu(parsed, dictionary, locale))
  //         setIsInitialized(true)
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Failed to restore menu cache:', error)
  //   }
  // }, [cacheKey, dictionary, locale])

  // const fetchMenu = useCallback(async () => {
  //   if (!accessToken || !dictionary) return

  //   setIsLoading(true)

  //   try {
  //     // const baseParams: any = { platform_id: 2 }

  //     const { data }: any = await fetchRecords_GET('/aut/menu', 0, 1000, '', accessToken, 'ar')
  //     const system = data?.system ?? []

  //     setSystemObjects(system)

  //     // ✅ Transform to both menu types
  //     setVerticalMenuData(transformBackendDataToMenuData(system, dictionary, locale))
  //     setHorizontalMenuData(transformBackendDataToHorizontalMenu(system, dictionary, locale))
  //     setIsInitialized(true)

  //     // ✅ Store in localStorage
  //     localStorage.setItem(cacheKey, JSON.stringify(system))
  //   } catch (error) {
  //     console.error('Failed to fetch menu:', error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [accessToken, dictionary, cacheKey, session?.user?.locale, locale])

  const fetchMenu = useCallback(async () => {
    if (!accessToken || !dictionary || fetchInProgress.current) return

    setIsLoading(true)
    fetchInProgress.current = true

    try {
      const { data }: any = await fetchRecords_GET('/aut/menu', 0, 1000, '', accessToken, 'ar')
      const system = data?.system ?? []

      const vertical = transformBackendDataToMenuData(system, dictionary, locale)
      const horizontal = transformBackendDataToHorizontalMenu(system, dictionary, locale)

      dispatch(
        setMenuData({
          vertical,
          horizontal,
          system
        })
      )
    } catch (error) {
      console.error('Failed to fetch menu:', error)
      // ✅ Set initialized even on error to prevent getting stuck, 
      // or handle it with a retry logic.
      dispatch(
        setMenuData({
          vertical: [],
          horizontal: [],
          system: []
        })
      )
    } finally {
      setIsLoading(false)
      fetchInProgress.current = false
    }
  }, [accessToken, dictionary, locale, dispatch])

  //// ✅ Fetch menu when accessToken and dictionary are ready
  // Added check for verticalMenuData.length to ensure we fetch if data is missing
  useEffect(() => {
    if (!isAuthenticated || !user || status !== 'authenticated') {
      return
    }

    if (accessToken && dictionary && !isLoading && (!isInitialized || verticalMenuData.length === 0)) {
      fetchMenu()
    }
  }, [
    accessToken,
    dictionary,
    isInitialized,
    fetchMenu,
    isAuthenticated,
    user,
    status,
    isLoading
  ])

  return (
    <MenuContext.Provider
      value={{
        verticalMenuData,
        horizontalMenuData,
        systemObjects,
        isLoading,
        isInitialized,
        refetchMenu: fetchMenu
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used inside MenuProvider')
  return ctx
}
