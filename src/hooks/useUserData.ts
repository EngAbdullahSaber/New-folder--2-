// // hooks/useUserData.ts
// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { useSession } from 'next-auth/react'

// interface UserData {
//   id: number
//   personal_id: string
//   email: string
//   mobile: string
//   full_name_ar: string
//   personal?: any
//   files?: any[]
//   user_groups?: any[]
//   context?: any
//   [key: string]: any
// }

// export const useUserData = () => {
//   const { data: session }: any = useSession() // ✅ Use useSession directly, not useSessionHandler
//   const [userData, setUserData] = useState<UserData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   // ✅ Load user data from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem('userData')
//       if (stored) {
//         try {
//           const parsed = JSON.parse(stored)
//           setUserData(parsed['personal'])
//         } catch (e) {
//           console.error('Failed to parse user data:', e)
//         }
//       }
//       setIsLoading(false)
//     }
//   }, [])

//   // ✅ Function to refresh user data from API
//   const refreshUserData = useCallback(async () => {
//     if (!session?.user?.accessToken) return

//     try {
//       const config = await import('@/configs/environment').then(m => m.getOperatorConfig())

//       const response = await fetch(`${config.apiUrl}/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${session.user.accessToken}`
//         }
//       })

//       if (response.ok) {
//         const data = await response.json()
//         const fullUserData = data.data

//         // Store in localStorage
//         localStorage.setItem('userData', JSON.stringify(fullUserData))
//         setUserData(fullUserData)

//         return fullUserData
//       }
//     } catch (error) {
//       console.error('Failed to refresh user data:', error)
//     }
//   }, [session?.user?.accessToken])

//   // ✅ Clear user data on logout
//   const clearUserData = useCallback(() => {
//     localStorage.removeItem('userData')
//     setUserData(null)
//   }, [])

//   return {
//     userData,
//     isLoading,
//     refreshUserData,
//     clearUserData
//   }
// }

'use client'

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux-store'
import { setUserData, clearUserData } from '@/redux-store/slices/userSlice'

export const useUserData = () => {
  const { data: session }: any = useSession()
  const dispatch = useDispatch()

  const userData = useSelector((state: RootState) => state.user.userData)

  const refreshUserData = useCallback(async () => {
    if (!session?.user?.accessToken) return

    try {
      const config = await import('@/configs/environment').then(m => m.getOperatorConfig())

      const response = await fetch(`${config.apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const fullUserData = data.data

        dispatch(setUserData(fullUserData))

        return fullUserData
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }, [session?.user?.accessToken, dispatch])

  const clear = useCallback(() => {
    dispatch(clearUserData())
  }, [dispatch])

  return {
    userData,
    isLoading: false,
    refreshUserData,
    clearUserData
  }
}
