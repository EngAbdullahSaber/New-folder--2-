'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, pipe, nonEmpty } from 'valibot'
import type { InferInput } from 'valibot'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'
import type { Mode } from '@core/types'
import type { Locale } from '@configs/i18n'
import Logo from '@components/layout/shared/Logo'
import themeConfig from '@configs/themeConfig'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { getLocalizedUrl } from '@/utils/i18n'
import { CircularProgress } from '@/shared'
import { getOperatorConfig } from '@/configs/environment'
import {
  clearStoredDashboardType,
  clearStoredOnlyIam,
  getStoredDashboardType,
  getStoredOnlyIam
} from '@/utils/dashboardRedirect'
import { DASHBOARD_PAGE_ROUTES } from '@/configs/dashboardConfig'

type FormData = InferInput<typeof schema>

const schema = object({
  id: pipe(
    string(),
    nonEmpty('هذا الحقل مطلوب'),
    minLength(1, 'اسم المستخدم أو رقم الهوية يجب أن يكون أكثر من 3 حروف')
  ),
  password: pipe(string(), nonEmpty('هذا الحقل مطلوب'))
})

const LoginV1 = ({ mode }: { mode: Mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const { darkImage, lightImage, title, apiUrl } = getOperatorConfig()
  const { lang: locale } = useParams()
  const searchParams = useSearchParams()

  const urlParam = searchParams.get('onlyIam')
  const [onlyIamParam, setOnlyIamParam] = useState<string | null>(urlParam)
  const [isReady, setIsReady] = useState(!!urlParam)

  useEffect(() => {
    const stored = getStoredOnlyIam()
    const currentUrl = searchParams.get('onlyIam')
    setOnlyIamParam(currentUrl || stored)
    setIsReady(true)
  }, [searchParams])

  const showNafath = onlyIamParam !== 'false'
  const showCredentials = onlyIamParam !== 'true'

  const authBackground: any = useImageVariant(mode, lightImage, darkImage)

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      id: '',
      password: ''
    }
  })

  // ✅ TEST FUNCTION 1: Direct API Call (bypasses NextAuth)
  const testDirectApiCall = async () => {
    const values = getValues()

    console.log('🧪 Starting Direct API Test...')
    console.log('📝 Test Data:', { id: values.id, password: '***' })

    setTestLoading(true)

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-Language': locale as string
        },
        body: JSON.stringify({
          id: '53204',
          password: 'Yusuf-daleel@123'
        })
      })

      console.log('📡 Response Status:', response.status)
      console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('📦 Response Data:', data)

      if (response.ok) {
        toast.success('✅ Direct API Test: Success!')
        console.log('✅ Login successful:', data)
      } else {
        toast.error(`❌ Direct API Test Failed: ${data.message || response.statusText}`)
        console.error('❌ Login failed:', data)
      }
    } catch (error) {
      console.error('💥 Direct API Test Error:', error)
      toast.error(`💥 Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestLoading(false)
    }
  }

  // ✅ TEST FUNCTION 2: NextAuth SignIn Test
  const testNextAuthSignIn = async () => {
    const values = getValues()

    console.log('🧪 Starting NextAuth Test...')
    console.log('📝 Test Data:', { id: values.id, password: '***' })

    setTestLoading(true)

    try {
      const res = await signIn('credentials', {
        id: values.id,
        password: values.password,
        redirect: false
      })

      console.log('📦 NextAuth Response:', res)

      if (res?.error) {
        toast.error(`❌ NextAuth Test Failed: ${res.error}`)
        console.error('❌ NextAuth error:', res)
      } else if (res?.ok) {
        toast.success('✅ NextAuth Test: Success!')
        console.log('✅ NextAuth successful:', res)
      } else {
        toast.error('❌ NextAuth Test: Unexpected response')
        console.error('❌ Unexpected response:', res)
      }
    } catch (error) {
      console.error('💥 NextAuth Test Error:', error)
      toast.error(`💥 NextAuth Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestLoading(false)
    }
  }

  // ✅ TEST FUNCTION 3: Check API Endpoint
  const testApiEndpoint = async () => {
    console.log('🧪 Testing API Endpoint...')
    console.log('🔗 API URL:', apiUrl)

    setTestLoading(true)

    try {
      // Test if API is reachable
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })

      console.log('📡 Health Check Status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ API is reachable:', data)
        toast.success('✅ API Endpoint is reachable!')
      } else {
        console.warn('⚠️ API returned non-200:', response.status)
        toast.warning(`⚠️ API returned status: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 API Endpoint Test Error:', error)
      toast.error(`💥 Cannot reach API: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitLoading(true)
      const res = await signIn('credentials', {
        id: data.id,
        password: data.password,
        redirect: false
      })

      if ((res && res.error) || !res) {
        toast.error('خطأ في اسم المستخدم أو كلمة المرور')
      } else {
        toast.success('تم تسجيل الدخول بنجاح')

        const storedType = getStoredDashboardType()
        clearStoredOnlyIam()
        const redirectPath = storedType ? DASHBOARD_PAGE_ROUTES[storedType] : null

        if (redirectPath) {
          clearStoredDashboardType()
          window.location.href = getLocalizedUrl(redirectPath, locale as Locale)
        } else {
          window.location.href = getLocalizedUrl('/intro', locale as Locale)
        }
      }
    } catch (error) {
      toast.error('خطأ في اسم المستخدم أو كلمة المرور')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <div className='flex justify-center items-center min-bs-[100dvh] is-full relative p-6'>
      <Card className='flex flex-col sm:is-[460px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center items-center mbe-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div className='text-center'>
              <Typography variant='h4'>{`مرحبا بكم في ${title}! 👋🏻`}</Typography>
              {!isReady && <CircularProgress size='1.5rem' className='mbs-2' />}
              {isReady && showCredentials && (
                <Typography className='mbs-1'>الرجاء إدخال اسم المستخدم وكلمة المرور</Typography>
              )}
              {isReady && !showCredentials && <Typography className='mbs-1'>الرجاء تسجيل الدخول عبر نفاذ</Typography>}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-full mx-auto'>
              {isReady && showCredentials && (
                <>
                  <Controller
                    name='id'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label='رقم المستخدم أو رقم الهوية'
                        {...field}
                        {...(errors.id && { error: true, helperText: errors.id.message })}
                      />
                    )}
                  />

                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        label='كلمة المرور'
                        type={isPasswordShown ? 'text' : 'password'}
                        {...field}
                        {...(errors.password && { error: true, helperText: errors.password.message })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                                {isPasswordShown ? <i className='ri-eye-off-line' /> : <i className='ri-eye-line' />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />

                  <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                    <FormControlLabel control={<Checkbox />} label='تذكرني' />
                    <Typography
                      className='text-end'
                      color='primary'
                      component={Link}
                      href={getLocalizedUrl('/reset-password-verification', locale as Locale)}
                    >
                      نسيت كلمة المرور؟
                    </Typography>
                  </div>

                  <Button
                    loading={submitLoading}
                    loadingIndicator={<CircularProgress size={'1rem'} color='info' />}
                    loadingPosition='start'
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                    className='text-sm'
                  >
                    تسجيل الدخول
                  </Button>

                  {/* ✅ DEBUG BUTTONS - Remove in production */}
                  {/* <div className='flex flex-col gap-2 mt-4 p-4 bg-gray-100 rounded'>
                    <Typography variant='caption' className='font-bold text-center'>
                      🧪 Debug Tools (Dev Only)
                    </Typography>

                    <Button onClick={testApiEndpoint} variant='outlined' size='small' disabled={testLoading} fullWidth>
                      {testLoading ? <CircularProgress size='1rem' /> : '🔍 Test API Endpoint'}
                    </Button>

                    <Button
                      onClick={testDirectApiCall}
                      variant='outlined'
                      size='small'
                      disabled={testLoading}
                      fullWidth
                    >
                      {testLoading ? <CircularProgress size='1rem' /> : '🚀 Test Direct API'}
                    </Button>

                    <Button
                      onClick={testNextAuthSignIn}
                      variant='outlined'
                      size='small'
                      disabled={testLoading}
                      fullWidth
                    >
                      {testLoading ? <CircularProgress size='1rem' /> : '🔐 Test NextAuth'}
                    </Button>

                    <Typography variant='caption' className='text-xs text-gray-600 text-center mt-2'>
                      API: {apiUrl}
                    </Typography>
                  </div> */}
                </>
              )}

              {isReady && showNafath && (
                <div className='flex justify-center items-center mt-4'>
                  <img
                    src='/images/apps/aut/nafath-logo.png'
                    alt='Nafath Logo'
                    className='max-w-full h-auto cursor-pointer transition-transform hover:scale-105'
                    style={{ maxHeight: '80px' }}
                    onClick={() => (window.location.href = 'https://prod.adilla.com.sa/_IAM/login')}
                  />
                </div>
              )}
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginV1
