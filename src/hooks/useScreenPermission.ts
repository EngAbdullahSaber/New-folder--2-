'use client'

import { useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { getLocalizedUrl, Locale, Mode } from '@/shared'
import { useMenu } from '@/contexts/menuContext'
import { useRegisterPageTab } from './useRegisterPageTab'

export const useScreenPermissions = (mode: Mode) => {
  const params = useParams()
  const pathname = usePathname()
  const { systemObjects } = useMenu()

  const locale = Array.isArray(params?.lang) ? params.lang[0] : (params?.lang as Locale)

  const permissions = useMemo(() => {
    // -------------------------------
    // Defaults (no data / no access)
    // -------------------------------
    if (!Array.isArray(systemObjects) || !systemObjects.length) {
      return {
        canAdd: false,
        showAddButton: false,
        canEdit: false,
        showEditButton: false,
        canDelete: false,
        canSearch: false,
        showSearchButton: false,
        canPrint: false,
        canPrintPdf: false,
        canPrintExcel: false,
        canAddArchive: false,
        canOpenArchive: false,
        canDeleteArchive: false,
        canShowRecrodInfo: false,
        showRecordInfoButton: false,
        screenData: null
      }
    }

    // ✅ Normalize path - remove locale, trailing slashes, query params
    const normalize = (path: string) => {
      return path
        .replace(/^\/[a-z]{2}\//, '/') // Remove locale prefix (e.g., /ar/ or /en/)
        .replace(/\/+$/, '') // Remove trailing slashes
        .split('?')[0] // Remove query params
        .toLowerCase()
    }

    // ✅ Extract route path from current URL
    const extractRoutePath = (url: string) => {
      // 1️⃣ Normalize URL: remove locale (/ar/), query params, trailing slashes
      const normalized = url
        .replace(/^\/[a-z]{2}\//, '/') // remove locale prefix
        .split('?')[0] // remove query params
        .replace(/\/+$/, '') // remove trailing slashes
        .toLowerCase()

      // 2️⃣ Remove /apps/ prefix
      const withoutApps = normalized.replace(/^\/apps\//, '')

      // 3️⃣ Remove ending mode or 'details'
      // Matches: /list, /add, /edit, /show, /search, /details
      const baseRoute = withoutApps.replace(/\/(list|add|edit|show|search|details)$/, '')

      return baseRoute || null
    }

    const currentRoutePath = extractRoutePath(pathname || '')

    // console.log('🔍 Debug Info:', {
    //   originalPathname: pathname,
    //   normalizedPath: normalize(pathname || ''),
    //   extractedRoutePath: currentRoutePath,
    //   locale
    // })

    // -------------------------------
    // ✅ Find active screen recursively (FIXED)
    // -------------------------------
    const findActiveScreen = (items: any[], depth = 0): any => {
      for (const item of items) {
        // Skip non-screen items (type 1 = SYSTEM, type 2 = MENU)
        if (item.object_type === 3 && item.route_path) {
          // Clean the route_path from backend
          const cleanRoutePath = item.route_path
            .replace(/^\/+/, '') // Remove leading slashes
            .replace(/\/+$/, '') // Remove trailing slashes
            .toLowerCase()

          // console.log(`${'  '.repeat(depth)}📄 Checking Screen:`, {
          //   label: item.object_name_ar,
          //   routePath: cleanRoutePath,
          //   currentRoutePath,
          //   match: cleanRoutePath === currentRoutePath
          // })

          // ✅ Exact match on route_path
          if (cleanRoutePath === currentRoutePath) {
            // console.log('✅ FOUND ACTIVE SCREEN:', item.object_name_ar)
            return item
          }
        }

        // Recursively check children
        if (item.children?.length) {
          // console.log(`${'  '.repeat(depth)}📁 Checking folder:`, item.object_name_ar)
          const found = findActiveScreen(item.children, depth + 1)
          if (found) return found
        }
      }

      return null
    }

    const activeScreen = findActiveScreen(systemObjects)

    if (!activeScreen) {
      console.warn('⚠️ No active screen found for:', currentRoutePath)
    } else {
      // console.log('✅ Active Screen Found:', {
      //   name: activeScreen.object_name_ar,
      //   routePath: activeScreen.route_path,
      //   permissions: activeScreen.permissions
      // })
    }

    // -------------------------------
    // ✅ Normalize route name for comparison
    // -------------------------------
    const normalizeRouteName = (routeName: string) => {
      // من: "def.seasonal_departments.index"
      // إلى: "def.seasonal_departments"
      return routeName.split('.').slice(0, 2).join('.').toLowerCase()
    }

    // -------------------------------
    // ✅ Permission check (FIXED)
    // -------------------------------
    const hasPermission = (action: string): boolean => {
      if (!activeScreen?.permissions?.length) {
        // console.log(`❌ No active screen or permissions to check for action: ${activeScreen}`)
        // console.log(`❌ No permissions array for action: ${action}`)
        return false
      }

      const normalizedScreenRoute = normalizeRouteName(activeScreen.route_name || '')

      const found = activeScreen.permissions.some((p: any) => {
        const normalizedPermRoute = normalizeRouteName(p.name || '')
        const routeMatch = normalizedPermRoute === normalizedScreenRoute
        const actionMatch = p.route_action?.toLowerCase() === action.toLowerCase()
        const isGranted = p.is_granted === true
        // console.log('🔍 Checking Permission:', {})

        const matches = isGranted && actionMatch && routeMatch
        // console.log(`✅ Permission GRANTED for ${p.route_action}:`, {
        //   permissionName: p.name,
        //   routeAction: p.route_action,
        //   isGranted: p.is_granted,
        //   screenRoute: normalizedScreenRoute,
        //   permRoute: normalizedPermRoute
        // })
        if (matches) {
          // console.log(`✅ Permission GRANTED for ${action}:`, {
          //   permissionName: p.name,
          //   routeAction: p.route_action,
          //   isGranted: p.is_granted,
          //   screenRoute: normalizedScreenRoute,
          //   permRoute: normalizedPermRoute
          // })
        }

        return matches
      })

      if (!found) {
        // console.log(`❌ Permission DENIED for ${action}`)
      }

      return found
    }

    // -------------------------------
    // ✅ Final permissions map
    // -------------------------------
    return {
      canAdd: hasPermission('store'),
      showAddButton: hasPermission('store') && !['add', 'edit', 'search'].includes(mode),
      canEdit: hasPermission('update'),
      showEditButton: hasPermission('update') && ['show', 'list'].includes(mode),
      canDelete: hasPermission('destroy'),
      canSearch: hasPermission('index'),
      showSearchButton: hasPermission('index') && !['add', 'edit', 'search'].includes(mode),
      showPrintButton: hasPermission('show') && ['show'].includes(mode),
      canPrint: hasPermission('show'),
      canPrintPdf: hasPermission('print_pdf'),
      canPrintExcel: hasPermission('print_excel'),
      canAddArchive: hasPermission('archive_add'),
      canOpenArchive: hasPermission('archive_open'),
      canDeleteArchive: hasPermission('archive_destroy'),
      canShowRecrodInfo: hasPermission('audit_fields'),
      showRecordInfoButton: hasPermission('audit_fields') && !['add', 'search'].includes(mode),

      screenData: activeScreen || null
    }
  }, [systemObjects, pathname, mode, locale])

  // ✅ Multi-Tab Registration
  const screenTitle = permissions.screenData?.object_name_ar || permissions.screenData?.object_name_en || ''
  const screenIcon = permissions.screenData?.icon || ''

  useRegisterPageTab(screenTitle, screenIcon, permissions.screenData?.id)

  return {
    ...permissions,
    currentScreen: pathname
  }
}
