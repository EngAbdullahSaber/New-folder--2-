'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { OTPInput } from 'input-otp'
import type { SlotProps } from 'input-otp'
import classnames from 'classnames'
import type { Mode } from '@core/types'
import type { Locale } from '@configs/i18n'
import Form from '@components/Form'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { getLocalizedUrl } from '@/utils/i18n'
import styles from '@/libs/styles/inputOtp.module.css'
import PolicyAgreement from '@/components/shared/PolicyAgreement'
import { Alert, TextField, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { maskNumber, useSessionHandler, validateEmail } from '@/shared'
import { signOut } from 'next-auth/react'
import { getOperatorConfig } from '@/configs/environment'
import { PasswordStrengthIndicator } from '@/components/shared/PasswordStrengthIndicator'
import { useUserDataOperations } from '@/hooks/useUserDataOperations'

const Slot = (props: SlotProps) => {
  return (
    <div className={classnames(styles.slot, { [styles.slotActive]: props.isActive })}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className='w-px h-5 bg-textPrimary' />
    </div>
  )
}

const UpdateNewUser = ({ mode }: { mode: Mode }) => {
  const [otp, setOtp] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const { accessToken, user } = useSessionHandler()
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState<any>('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<any>('')
  const [countdown, setCountdown] = useState(120)
  const [canResend, setCanResend] = useState(false)
  const [apiErrors, setApiErrors] = useState<string[]>([]) // ✅ New state for API errors
  const { refreshUserData } = useUserDataOperations()

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { apiUrl } = getOperatorConfig()
  const { lang: locale } = useParams()

  const darkImg = '/images/pages/auth-v1-mask-2-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-2-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const steps = ['البيانات المطلوبة', 'كود التحقق']

  const isPasswordValid = () => {
    if (!newPassword) return false

    const rules = [
      newPassword.length >= 8,
      /[A-Z]/.test(newPassword),
      /[a-z]/.test(newPassword),
      /[0-9]/.test(newPassword),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
    ]

    return rules.every(rule => rule)
  }

  useEffect(() => {
    if (activeStep === 1 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [activeStep, countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError('')
    setApiErrors([]) // ✅ Clear API errors on change
  }

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setEmailError('البريد الإلكتروني غير صالح')
    }
  }

  // ✅ Helper function to extract error messages
  const extractErrorMessages = (errors: Record<string, string[]>): string[] => {
    const messages: string[] = []
    Object.keys(errors).forEach(key => {
      if (Array.isArray(errors[key])) {
        messages.push(...errors[key])
      }
    })
    return messages
  }

  const handleSubmit = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setPasswordError('كلمات المرور غير متطابقة')
        return
      }

      if (!isPasswordValid()) {
        setPasswordError('كلمة المرور لا تستوفي جميع المتطلبات')
        return
      }

      setLoading(true)
      setApiErrors([]) // ✅ Clear previous errors
      const response = await fetch(`${apiUrl}/aut/users/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': (locale as Locale) || 'ar' // ✅ Add Accept-Language header
        },
        body: JSON.stringify({
          isNew: true,
          password: newPassword,
          personal: {
            mobile: mobileNumber,
            email: email
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // ✅ Handle validation errors
        if (data.errors) {
          const errorMessages = extractErrorMessages(data.errors)
          setApiErrors(errorMessages)
        } else if (data.message) {
          setApiErrors([data.message])
        } else {
          setApiErrors(['يرجى التأكد من البيانات المدخله'])
        }
        throw new Error('Verification failed')
      }

      setPasswordError('')
      setApiErrors([])
      setActiveStep(1)
      setCountdown(120)
      setCanResend(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    try {
      setLoading(true)
      setApiErrors([]) // ✅ Clear previous errors

      const response = await fetch(`${apiUrl}/aut/users/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': (locale as Locale) || 'ar' // ✅ Add Accept-Language header
        },
        body: JSON.stringify({
          sms_verify_code: otp
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // ✅ Handle validation errors
        if (data.errors) {
          const errorMessages = extractErrorMessages(data.errors)
          setApiErrors(errorMessages)
        } else if (data.message) {
          setApiErrors([data.message])
        } else {
          setApiErrors(['يرجى التأكد من كود التحقق'])
        }
        throw new Error('Verification failed')
      }

      setPasswordError('')
      setApiErrors([])
      await refreshUserData()
      window.location.href = getLocalizedUrl('/apps/dashboard/home', locale as Locale)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserLogout = async () => {
    try {
      await signOut({ callbackUrl: '/ar/login' })
      localStorage.clear()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>
        <Card className='flex flex-col sm:is-[560px]'>
          <CardContent className='p-6 sm:!p-12'>
            <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center items-center mbe-6'>
              <Logo />
            </Link>

            <Stepper activeStep={activeStep} alternativeLabel className='mbe-6'>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* ✅ Display API errors */}
            {apiErrors.length > 0 && (
              <Alert severity='error' className='my-2'>
                {apiErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}

            {/* ✅ Display password validation errors */}
            {passwordError && (
              <Alert severity='error' className='my-2'>
                {passwordError}
              </Alert>
            )}

            <div className='flex flex-col gap-5'>
              {activeStep === 0 && (
                <>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h4'>التحقق من الهوية</Typography>
                    <Typography>الرجاء إدخال البيانات التالية للمتابعة</Typography>
                  </div>

                  <Form noValidate autoComplete='off' className='flex flex-col gap-5'>
                    <TextField
                      fullWidth
                      required
                      label='البريد الإلكتروني'
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={handleEmailBlur}
                      error={!!emailError}
                      helperText={emailError}
                      type='email'
                      inputProps={{ inputMode: 'email' }}
                    />

                    <TextField
                      fullWidth
                      required
                      label='رقم الجوال'
                      value={mobileNumber}
                      onChange={e => {
                        setMobileNumber(e.target.value)
                        setApiErrors([]) // ✅ Clear errors on change
                      }}
                      inputProps={{
                        maxLength: 10,
                        inputMode: 'numeric',
                        pattern: '[0-10]*'
                      }}
                    />

                    <TextField
                      fullWidth
                      required
                      label='كلمة المرور الجديدة'
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      error={!!passwordError && !isPasswordValid()}
                      onChange={e => {
                        setNewPassword(e.target.value)
                        setPasswordError('')
                        setApiErrors([]) // ✅ Clear errors on change
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge='end'>
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <PasswordStrengthIndicator password={newPassword} />

                    <TextField
                      fullWidth
                      required
                      label='تأكيد كلمة المرور'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      error={!!passwordError || (confirmPassword && newPassword !== confirmPassword)}
                      helperText={confirmPassword && newPassword !== confirmPassword ? 'كلمات المرور غير متطابقة' : ''}
                      onChange={e => {
                        setConfirmPassword(e.target.value)
                        setPasswordError('')
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge='end'>
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />

                    <Button
                      fullWidth
                      variant='contained'
                      onClick={handleSubmit}
                      disabled={
                        !email ||
                        !mobileNumber ||
                        loading ||
                        !newPassword ||
                        !confirmPassword ||
                        !isPasswordValid() ||
                        emailError !== '' ||
                        newPassword !== confirmPassword
                      }
                    >
                      {loading ? 'جاري التحقق...' : 'التالي'}
                    </Button>
                  </Form>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h4'>كود التحقق 💬</Typography>
                    <Typography>تم إرسال كود التحقق إلى رقم الجوال</Typography>
                    <Typography className='font-medium' color='text.primary'>
                      {maskNumber(mobileNumber)}
                    </Typography>
                  </div>
                  <Form noValidate autoComplete='off' className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                      <Typography>ادخل كود التحقق المكون من ٦ ارقام</Typography>
                      <OTPInput
                        dir='ltr'
                        onChange={value => {
                          setOtp(value)
                          setApiErrors([]) // ✅ Clear errors on change
                        }}
                        value={otp ?? ''}
                        maxLength={6}
                        containerClassName='flex items-center'
                        onComplete={verifyCode}
                        render={({ slots }) => (
                          <div className='flex items-center justify-start w-full gap-4' dir='ltr'>
                            {slots.slice(0, 6).map((slot, idx) => (
                              <Slot key={idx} {...slot} />
                            ))}
                          </div>
                        )}
                      />
                    </div>
                    <Button fullWidth variant='contained' type='submit' onClick={verifyCode}>
                      تحقق
                    </Button>
                    <div className='flex justify-center items-center flex-wrap gap-2'>
                      <Typography>لم يتم ارسال كود التحقق ؟</Typography>
                      {canResend ? (
                        <Typography
                          color='primary'
                          className='cursor-pointer'
                          onClick={() => {
                            handleSubmit()
                            setCountdown(120)
                            setCanResend(false)
                          }}
                        >
                          إعادة الأرسال
                        </Typography>
                      ) : (
                        <Typography color='text.secondary'>إعادة الإرسال بعد {formatTime(countdown)}</Typography>
                      )}
                    </div>
                    <Button fullWidth variant='outlined' onClick={() => setActiveStep(0)} className='mbs-2'>
                      العودة
                    </Button>
                  </Form>
                </>
              )}

              <Button fullWidth variant='outlined' color='error' onClick={handleUserLogout} disabled={loading}>
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <PolicyAgreement open={false} onClose={() => console.log('closed')} onAgree={() => console.log('agreed')} />
    </>
  )
}

export default UpdateNewUser
