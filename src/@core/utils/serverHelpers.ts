// Next Imports
import { cookies } from 'next/headers'

// React cache for per-request memoization
import { cache } from 'react'

// Third-party Imports
import 'server-only'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { SystemMode } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// ✅ cache() ensures cookies are read only once per request,
// even if called from multiple layouts/components.
export const getSettingsFromCookie = cache(async (): Promise<Settings> => {
  const cookieStore = await cookies()
  const cookieName = themeConfig.settingsCookieName

  return JSON.parse(cookieStore.get(cookieName)?.value || '{}')
})

export const getMode = cache(async () => {
  const settingsCookie = await getSettingsFromCookie()

  // Get mode from cookie or fallback to theme config
  const _mode = settingsCookie.mode || themeConfig.mode

  return _mode
})

export const getSystemMode = cache(async (): Promise<SystemMode> => {
  const cookieStore = await cookies()
  const mode = await getMode()

  const colorPrefCookie = (cookieStore.get('colorPref')?.value || 'light') as SystemMode

  return (mode === 'system' ? colorPrefCookie : mode) || 'light'
})

export const getServerMode = cache(async () => {
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return mode === 'system' ? systemMode : mode
})

export const getSkin = cache(async () => {
  const settingsCookie = await getSettingsFromCookie()

  return settingsCookie.skin || 'default'
})
