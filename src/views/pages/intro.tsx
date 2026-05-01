'use client'

import { getSession, signIn } from 'next-auth/react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { checkUserValidation, getLocalizedUrl, Locale, useSessionHandler } from '@/shared'
import { useMenu } from '@/contexts/menuContext'
import { useSettings } from '@/@core/hooks/useSettings'
import { getOperatorConfig } from '@/configs/environment'
import primaryColorConfig from '@/configs/primaryColorConfig'
import { useUserDataOperations } from '@/hooks/useUserDataOperations'
import { getStoredDashboardType, clearStoredDashboardType, clearStoredOnlyIam } from '@/utils/dashboardRedirect'
import { DASHBOARD_PAGE_ROUTES } from '@/configs/dashboardConfig'
import { useDispatch, useSelector } from 'react-redux'
import { clearMenu } from '@/redux-store/slices/menuSlice'
import { persistor } from '@/redux-store'
import type { RootState } from '@/redux-store'

export const IntroComponent = () => {
  const { lang: locale } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const msgId = searchParams.get('msgId')
  const nameId = searchParams.get('nameId')
  const { session, user, isAuthenticated } = useSessionHandler()
  const { isInitialized, isLoading } = useMenu()
  const { refreshUserData } = useUserDataOperations()

  // ✅ Refs
  const hasRedirectedRef = useRef(false)
  const validationStartedRef = useRef(false)
  const freshUserDataRef = useRef<any>(null)
  const isRedirectingRef = useRef(false)

  // ✅ State
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSessionLoading, setIsSessionLoading] = useState(true)
  const [userDataReady, setUserDataReady] = useState(false)
  const [reduxDataSet, setReduxDataSet] = useState(false)
  const [sessionTimestamp, setSessionTimestamp] = useState<number | null>(null)

  const { settings, updateSettings, resetSettings, isSettingsChanged } = useSettings()
  const { domain, domainGif } = getOperatorConfig()
  const dispatch = useDispatch()

  // ✅ Get user data from Redux store
  const reduxUserData = useSelector((state: RootState) => state.user.userData)

  // ✅ Track when Redux user data is actually set after fresh API call
  useEffect(() => {
    // Only mark as set when:
    // 1. API call has completed (userDataReady)
    // 2. Redux store has the data
    // 3. Data was set AFTER the session started (ensures fresh data, not persisted)
    if (userDataReady && reduxUserData && sessionTimestamp) {
      const userDataTimestamp = (reduxUserData as any)?.updatedAt || (reduxUserData as any)?.timestamp

      // If we have a timestamp from the user data, verify it's after session start
      // Or if no timestamp, just check that userDataReady is true (API completed)
      const isFreshData = userDataTimestamp ? userDataTimestamp >= sessionTimestamp : true

      if (isFreshData) {
        console.log('✅ Fresh Redux user data confirmed after API refresh:', reduxUserData)
        setReduxDataSet(true)
      }
    }
  }, [reduxUserData, userDataReady, sessionTimestamp])

  // ✅ Clear persisted menu data on mount to ensure fresh fetch
  useEffect(() => {
    dispatch(clearMenu())
  }, [dispatch])

  // ✅ أضف هذا الـ useEffect بعد الـ states مباشرة
  useEffect(() => {
    if (isSessionLoading) return // لسه بيحمل

    // ✅ لو الـ session خلصت وما في user — redirect للـ login
    if (!isAuthenticated && !isProcessing && !token) {
      console.log('❌ User not authenticated, redirecting to login...')
      router.push(getLocalizedUrl('/login', locale as Locale))
    }
  }, [isSessionLoading, isAuthenticated, isProcessing, token])

  // ✅ Track when session finishes loading
  useEffect(() => {
    handleThemeSettings()
    if (session !== undefined) {
      setIsSessionLoading(false)
    }
  }, [session])

  const handleThemeSettings = (): void => {
    updateSettings({ contentWidth: 'wide', skin: 'bordered' })

    if (domain === 'localhost') {
      updateSettings({ primaryColor: primaryColorConfig[2].main, platformName: 'DEVELOPMENT' })
    } else if (domain === 'daleelalzowar.sa') {
      updateSettings({ primaryColor: primaryColorConfig[1].main, platformName: 'دليل الزوار' })
    } else if (domain === 'adilla.com.sa') {
      updateSettings({ primaryColor: primaryColorConfig[0].main, platformName: 'شركة الأدلاء' })
    }
  }

  // ✅ Handle Nafath login (runs once)
  useEffect(() => {
    if (hasRedirectedRef.current || isProcessing) return

    if (token && msgId && nameId) {
      setIsProcessing(true)
      handleNafathLogin(token, msgId, nameId)
      hasRedirectedRef.current = true
    }
  }, [token, msgId, nameId, isProcessing])

  // ✅ Refresh user data when authenticated (runs once)
  useEffect(() => {
    if (validationStartedRef.current || isProcessing || token || isSessionLoading || !isAuthenticated || !user) {
      return
    }

    console.log('🔄 Starting user data refresh...')
    validationStartedRef.current = true

    // ✅ Mark the start of a new session for fresh data
    setSessionTimestamp(Date.now())

    refreshUserData()
      .then(data => {
        console.log('✅ User data refreshed:', data)
        freshUserDataRef.current = data
        setUserDataReady(true)
      })
      .catch(err => {
        console.error('❌ Error refreshing user data:', err)
        // Still set ready to proceed with existing data
        freshUserDataRef.current = user
        setUserDataReady(true)
      })
  }, [isAuthenticated, user, isSessionLoading, isProcessing, token, refreshUserData])

  // ✅ Perform redirect when all conditions are met
  useEffect(() => {
    if (
      hasRedirectedRef.current ||
      isRedirectingRef.current ||
      isProcessing ||
      token ||
      isSessionLoading ||
      !isAuthenticated ||
      !user ||
      !userDataReady ||
      !isInitialized ||
      isLoading ||
      !reduxDataSet // ✅ Wait for Redux user data to be confirmed set
    ) {
      return
    }

    console.log('✅ All conditions met, performing redirect...')
    console.log('✅ Redux user data available:', reduxUserData)
    performRedirect(freshUserDataRef.current || user)
  }, [isAuthenticated, user, isSessionLoading, userDataReady, isInitialized, isLoading, isProcessing, token, reduxDataSet])

  // ✅ Fallback timeout
  useEffect(() => {
    if (hasRedirectedRef.current || isProcessing || token || isSessionLoading || !isAuthenticated || !user || !reduxDataSet) {
      return
    }

    const fallbackTimeout = setTimeout(() => {
      if (!hasRedirectedRef.current && !isRedirectingRef.current) {
        console.warn('⚠️ Fallback timeout reached, forcing redirect...')
        performRedirect(freshUserDataRef.current || user)
      }
    }, 5000)

    return () => clearTimeout(fallbackTimeout)
  }, [isAuthenticated, user, isSessionLoading, isProcessing, token, reduxDataSet])

  const performRedirect = async (userData?: any) => {
    if (hasRedirectedRef.current || isRedirectingRef.current) {
      console.log('⏭️ Redirect already in progress, skipping...')
      return
    }

    const userToUse = userData || user
    if (!userToUse) {
      console.warn('⚠️ No user data available for redirect')
      return
    }

    console.log('🚀 Starting redirect with user:', userToUse)

    // ✅ Set both flags
    isRedirectingRef.current = true
    hasRedirectedRef.current = true

    try {
      // ✅ Check for stored dashboard type redirect
      const storedType = getStoredDashboardType()
      clearStoredOnlyIam()
      const storedRedirectPath = storedType ? DASHBOARD_PAGE_ROUTES[storedType] : null

      // ✅ Call checkUserValidation and await it
      let redirectUrl = await checkUserValidation(userToUse, locale as Locale)

      console.log('📍 Validation redirect URL:', redirectUrl)

      // ✅ If the user is fully validated and we have a stored redirect, use it
      if (storedRedirectPath && redirectUrl.includes('/apps/dashboard/home')) {
        console.log('📍 Using stored redirect path:', storedRedirectPath)
        clearStoredDashboardType()
        redirectUrl = getLocalizedUrl(storedRedirectPath, locale as Locale)
      }

      console.log('🎯 Final redirect URL:', redirectUrl)

      // ✅ Flush persist to localStorage before navigation so the destination
      // layout's PersistGate hydrates with the fresh user data (not stale cache)
      await persistor.flush()

      router.push(redirectUrl)
    } catch (error) {
      console.error('❌ Error during redirect:', error)
      // Fallback to home
      router.push(getLocalizedUrl('/apps/dashboard/home', locale as Locale))
    }
  }

  const handleNafathLogin = async (token: string, msgId: string, nameId: string) => {
    try {
      console.log('🔐 Starting Nafath login...')

      const res = await signIn('credentials', {
        token,
        msgId,
        nameId,
        redirect: false,
        method: 'nafath/login'
      })

      if (res?.error) {
        console.error('❌ Nafath login error:', res.error)
        toast.error('فشل تسجيل الدخول')
        setTimeout(() => {
          router.push(getLocalizedUrl('/login', locale as Locale))
        }, 1000)
        return
      }

      console.log('✅ Nafath login successful, getting session...')

      // ✅ Wait for session update with retry
      let updatedSession: any = null
      let retries = 0
      const maxRetries = 5

      while (!updatedSession && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500))
        updatedSession = await getSession()
        retries++
        console.log(`🔄 Session check attempt ${retries}/${maxRetries}`)
      }

      if (!updatedSession) {
        console.error('❌ Could not get session after Nafath login')
        toast.error('خطأ في تسجيل الدخول')
        setTimeout(() => {
          router.push(getLocalizedUrl('/login', locale as Locale))
        }, 1000)
        return
      }

      console.log('✅ Session updated:', updatedSession)

      if (updatedSession?.user?.isNew) {
        toast.success('تم تسجيل الدخول بنجاح يرجى إدخال البيانات المطلوبة')
        setTimeout(() => {
          router.push(getLocalizedUrl('/update-new-user', locale as Locale))
        }, 1000)
      } else {
        toast.success('تم تسجيل الدخول بنجاح')
        // ✅ Redirect to intro WITHOUT token params
        setTimeout(() => {
          router.push(getLocalizedUrl('/intro', locale as Locale))
        }, 1000)
      }
    } catch (error) {
      console.error('❌ Nafath login error:', error)
      toast.error('خطأ في تسجيل الدخول')
      setTimeout(() => {
        router.push(getLocalizedUrl('/login', locale as Locale))
      }, 1000)
    }
  }

  // ✅ Show loading message based on state
  const getLoadingMessage = () => {
    if (isProcessing) return 'جاري تسجيل الدخول...'
    if (isSessionLoading) return 'جاري تحميل الجلسة...'
    if (!user) return 'جاري التحميل...'
    if (!userDataReady) return 'جاري تحميل بيانات المستخدم...'
    if (isLoading) return 'جاري تحميل القائمة...'
    if (isRedirectingRef.current) return 'جاري التوجيه...'
    return 'جاري التحميل...'
  }

  return (
    <div className='intro-logo-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img className='logo-gif' src={domainGif} alt='Loading...' />
      <div style={{ textAlign: 'center', marginTop: '20px', color: '#bbb', fontSize: '12px' }}>
        {getLoadingMessage()}
      </div>
    </div>
  )
}

export default IntroComponent
