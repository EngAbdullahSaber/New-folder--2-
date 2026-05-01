'use client'

import { useEffect, useRef, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { usePathname, useParams } from 'next/navigation'
import { useUserDataOperations } from './useUserDataOperations'
import { useDispatch } from 'react-redux'
import { clearMenu } from '@/redux-store/slices/menuSlice'
import { persistor } from '@/redux-store'

interface UseInactivityLogoutOptions {
  timeout?: number
  enabled?: boolean
  pauseEventListeners?: boolean
  onWarning?: (secondsLeft: number) => void
  onWarningUpdate?: (secondsLeft: number) => void
  warningTime?: number
  excludePaths?: string[]
  debounceTime?: number // ✅ Make it configurable
}

export const useInactivityLogout = ({
  timeout = 600000, // 10 minutes default
  enabled = true,
  pauseEventListeners = false,
  onWarning,
  onWarningUpdate,
  warningTime = 60,
  excludePaths = ['/ar/login', '/en/login', '/fr/login', '/ar/intro', '/en/intro', '/fr/intro'],
  debounceTime = 3000 // ✅ 3 seconds debounce
}: UseInactivityLogoutOptions = {}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { lang } = useParams()
  const { clearUserData } = useUserDataOperations()
  const dispatch = useDispatch()

  const isExcluded = excludePaths.some(path => pathname?.includes(path))

  const logout = useCallback(async () => {
    try {
      if (typeof window !== 'undefined') {
        clearUserData()
        dispatch(clearMenu())
        // ✅ Purge Redux Persist storage (removes persist:root key)
        await persistor.purge()

        // ✅ Slight delay to ensure pending writes are finished before final clear
        await new Promise(resolve => setTimeout(resolve, 50))

        // ✅ Force removal of the persistence key and clear all storage
        localStorage.removeItem('persist:root')
        localStorage.clear()
        sessionStorage.clear()

        const callbackUrl = `${window.location.origin}/${lang || 'ar'}/login`
        await signOut({ callbackUrl, redirect: true })
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [lang, clearUserData])

  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  const startCountdown = useCallback(
    (totalSeconds: number) => {
      stopCountdown()
      let remainingSeconds = totalSeconds

      if (onWarning) {
        onWarning(remainingSeconds)
      }
      if (onWarningUpdate) {
        onWarningUpdate(remainingSeconds)
      }

      countdownIntervalRef.current = setInterval(() => {
        remainingSeconds -= 1

        if (remainingSeconds <= 0) {
          stopCountdown()
          logout()
        } else if (onWarningUpdate) {
          onWarningUpdate(remainingSeconds)
        }
      }, 1000)
    },
    [onWarning, onWarningUpdate, logout, stopCountdown]
  )

  const resetTimer = useCallback(() => {
    // If enabled is false or path is excluded, don't start any timers
    if (!enabled || isExcluded) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      stopCountdown()
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    stopCountdown()

    if (!enabled || isExcluded) return

    const warningTimeout = timeout - warningTime * 1000

    if (warningTime > 0 && warningTimeout > 0) {
      warningRef.current = setTimeout(() => {
        startCountdown(warningTime)
      }, warningTimeout)
    }

    timeoutRef.current = setTimeout(() => {
      logout()
    }, timeout)
  }, [enabled, isExcluded, pauseEventListeners, timeout, warningTime, logout, stopCountdown, startCountdown])

  const debouncedResetTimer = useCallback(() => {
    if (pauseEventListeners) return

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      resetTimer()
    }, debounceTime) // ✅ Configurable debounce
  }, [pauseEventListeners, resetTimer, debounceTime])

  useEffect(() => {
    if (!enabled || isExcluded) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      stopCountdown()
      return
    }

    // ✅ Only significant events
    const events = ['keydown', 'mousedown', 'click', 'touchstart']

    if (!pauseEventListeners) {
      resetTimer()
      events.forEach(event => {
        document.addEventListener(event, debouncedResetTimer, { passive: true })
      })
    }

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, debouncedResetTimer)
      })
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [enabled, isExcluded, pauseEventListeners, resetTimer, debouncedResetTimer])

  // ✅ Clean up on unmount ONLY
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      stopCountdown()
    }
  }, [stopCountdown])

  return { resetTimer }
}
