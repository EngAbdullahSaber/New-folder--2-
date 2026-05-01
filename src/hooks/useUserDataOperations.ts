// hooks/useUserDataOperations.ts
'use client'

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { setUserData, clearUserData as clearUserDataAction } from '@/redux-store/slices/userSlice'

export const useUserDataOperations = () => {
  const { data: session, update }: any = useSession()
  const dispatch = useDispatch()

  // ✅ Refresh user data from API
  const refreshUserData = useCallback(async () => {
    if (!session?.user?.accessToken) return null

    try {
      const config = await import('@/configs/environment').then(m => m.getOperatorConfig())

      const response = await fetch(`${config.apiUrl}/aut/user`, {
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          'Accept-Language': 'ar'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const fullUserData = data.data

        // Store in localStorage
        // localStorage.setItem('userData', JSON.stringify(fullUserData))
        // Add a timestamp to mark when this data was fetched
        const dataWithTimestamp = {
          ...fullUserData,
          timestamp: Date.now()
        }

        dispatch(setUserData(dataWithTimestamp))
        // Trigger storage event to update other components
        window.dispatchEvent(new Event('storage'))

        // Update session to keep it in sync with fresh data
        if (update && fullUserData.context) {
          await update({
            user: {
              ...session?.user,
              context: fullUserData.context
            }
          })
        }

        return fullUserData
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      return null
    }
  }, [session?.user?.accessToken])

  // ✅ Clear user data on logout
  const clearUserData = useCallback(() => {
    // localStorage.removeItem('userData')
    // window.dispatchEvent(new Event('storage'))

    dispatch(clearUserDataAction())
  }, [])

  return {
    refreshUserData,
    clearUserData
  }
}
