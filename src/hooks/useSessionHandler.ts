// // hooks/useSessionHandler.ts
// 'use client'

// import { getOperatorConfig } from '@/configs/environment'
// import { useSession } from 'next-auth/react'
// import { useState, useEffect, useMemo } from 'react'

// const CURL_ALLOWED_USER_IDS = ['53204', '1544', '53232'] // ✅ قائمة المسموح لهم

// export const useSessionHandler = () => {
//   const { data: session, status, update }: any = useSession()
//   const [userData, setUserData] = useState<any>(null)
//   const { domain } = getOperatorConfig()
//   const isAuthenticated = status === 'authenticated'
//   const accessToken = session?.user?.accessToken

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const stored: any = localStorage.getItem('userData')
//       if (stored) {
//         try {
//           setUserData(JSON.parse(stored))
//         } catch (e) {
//           console.error('Failed to parse user data:', e)
//         }
//       }
//     }
//   }, [session])

//   const user = useMemo(() => {
//     return session?.user ? { ...session.user, ...(userData || {}) } : null
//   }, [session?.user, userData])

//   // ✅ Permission check داخل الـ hook
//   const canSeeCurl = CURL_ALLOWED_USER_IDS.includes(String(user?.id)) || domain === 'localhost' // ✅ السماح في localhost للتطوير

//   return {
//     isAuthenticated,
//     accessToken,
//     session,
//     user,
//     update,
//     personal: userData?.personal,
//     status,
//     userDepartments: userData?.user_depts,
//     userGroups: userData?.user_groups,
//     canSeeCurl // ✅ export مباشرة
//   }
// }

// // ✅ للاستخدام خارج الـ components (apiClient, etc.) — من localStorage فقط
// export const canSeeCurlStatic = (): boolean => {
//   if (typeof window === 'undefined') return false
//   const { domain } = getOperatorConfig()
//   try {
//     const userData = localStorage.getItem('userData')
//     if (!userData) return false

//     const parsed = JSON.parse(userData)
//     return CURL_ALLOWED_USER_IDS.includes(String(parsed?.id)) || domain === 'localhost' // ✅ السماح في localhost للتطوير
//   } catch (e) {
//     return false
//   }
// }

'use client'

import { getOperatorConfig } from '@/configs/environment'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { store, type RootState } from '@/redux-store'

const CURL_ALLOWED_USER_IDS = ['53204', '1544', '53232', '85100', '91853', '59326']

export const useSessionHandler = () => {
  const { data: session, status, update }: any = useSession()

  const { domain } = getOperatorConfig()

  // ✅ Get userData from Redux instead of localStorage
  const userData = useSelector((state: RootState) => state.user.userData)
  // ✅ Get settings with fallback for old persisted state
  const filter_with_city = useSelector((state: RootState) => state.user.filter_with_city ?? true)

  const isAuthenticated = status === 'authenticated'
  const accessToken = session?.user?.accessToken

  // ✅ Merge session + persisted userData (Prioritize Redux for details, Session for Auth)
  const user = useMemo(() => {
    if (!session?.user) return null

    return {
      ...session.user,
      ...(userData || {}),
      // Force tokens from session to ensure auth doesn't break
      accessToken: session.user.accessToken,
      refreshToken: session.user.refreshToken
    }
  }, [session?.user, userData])

  // ✅ Permission check
  const canSeeCurl = CURL_ALLOWED_USER_IDS.includes(String(user?.id)) || domain === 'localhost'

  return {
    isAuthenticated,
    accessToken,
    session,
    user,
    update,
    personal: userData?.personal,
    status,
    userDepartments: userData?.user_depts,
    userGroups: userData?.user_groups,
    userPassportUnits: userData?.user_passport_units,
    userCities: userData?.user_cities,
    filter_with_city,
    canSeeCurl // ✅ export مباشرة
  }
}

export const canSeeCurlStatic = (): boolean => {
  if (typeof window === 'undefined') return false

  const { domain } = getOperatorConfig()

  try {
    // ✅ Read from Redux store directly
    const state = store.getState()
    const userData = state.user?.userData

    if (!userData) return false

    return CURL_ALLOWED_USER_IDS.includes(String(userData?.id)) || domain === 'localhost'
  } catch (e) {
    console.error('canSeeCurlStatic error:', e)
    return false
  }
}
