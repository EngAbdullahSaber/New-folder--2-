'use client'

import { useState, useEffect } from 'react'
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
import { maskNumber } from '@/shared'
import { signOut } from 'next-auth/react'
import { getOperatorConfig } from '@/configs/environment'
import { PasswordStrengthIndicator } from '@/components/shared/PasswordStrengthIndicator'

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

const ResetPasswordVerification = ({ mode }: { mode: Mode }) => {
  const [otp, setOtp] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [idNumber, setIdNumber] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState<any>('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<any>('')
  const [apiErrors, setApiErrors] = useState<string[]>([])
  const [countdown, setCountdown] = useState(120)
  const [canResend, setCanResend] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { apiUrl } = getOperatorConfig()
  const { lang: locale } = useParams()

  const darkImg = '/images/pages/auth-v1-mask-2-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-2-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const steps = ['البيانات المطلوبة', 'كود التحقق', 'تعيين كلمة المرور']

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

  const extractErrorMessages = (errors: Record<string, string[]>): string[] => {
    const messages: string[] = []
    Object.keys(errors).forEach(key => {
      if (Array.isArray(errors[key])) {
        messages.push(...errors[key])
      }
    })
    return messages
  }

  const handleBack = () => setActiveStep(prev => prev - 1)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setApiErrors([])

      const response = await fetch(`${apiUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': (locale as Locale) || 'ar'
        },
        body: JSON.stringify({ id_no: idNumber, mobile: mobileNumber })
      })

      const data = await response.json()
      if (!response.ok) {
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
      setApiErrors([])

      const response = await fetch(`${apiUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': (locale as Locale) || 'ar'
        },
        body: JSON.stringify({ id_no: idNumber, sms_verify_code: otp })
      })

      const data = await response.json()

      if (!response.ok) {
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

      setApiErrors([])
      setActiveStep(2)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setLoading(true)
      setApiErrors([])

      const response = await fetch(`${apiUrl}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': (locale as Locale) || 'ar'
        },
        body: JSON.stringify({ id_no: idNumber, mobile: mobileNumber })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = extractErrorMessages(data.errors)
          setApiErrors(errorMessages)
        } else {
          setApiErrors(['فشل إعادة إرسال الكود'])
        }
        throw new Error('Resend failed')
      }

      setCountdown(120)
      setCanResend(false)
      setOtp(null)
      setApiErrors([])
    } catch (error) {
      console.error('Resend error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setPasswordError('كلمات المرور غير متطابقة')
        return
      }

      if (!isPasswordValid()) {
        setPasswordError('كلمة المرور لا تستوفي جميع المتطلبات')
        return
      }

      setPasswordLoading(true)
      setApiErrors([])

      const response = await fetch(`${apiUrl}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': (locale as Locale) || 'ar'
        },
        body: JSON.stringify({
          password: newPassword,
          password_confirmation: confirmPassword,
          id_no: idNumber,
          sms_verify_code: otp
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = extractErrorMessages(data.errors)
          setApiErrors(errorMessages)
        } else if (data.message) {
          setApiErrors([data.message])
        } else {
          setApiErrors(['فشلت عملية تعيين كلمة المرور'])
        }
        throw new Error('Password reset failed')
      }

      window.location.href = getLocalizedUrl('/apps/dashboard/home', locale as Locale)
    } catch (error) {
      console.error('Password reset error:', error)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleUserLogout = async () => {
    try {
      await signOut({ callbackUrl: '/ar/login' })
      localStorage.clear()
    } catch (error) {}
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>
        <Card className='flex flex-col sm:is-[460px]'>
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

            {apiErrors.length > 0 && (
              <Alert severity='error' className='my-2'>
                {apiErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}

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
                      label='رقم الهوية'
                      value={idNumber}
                      onChange={e => {
                        setIdNumber(e.target.value)
                        setApiErrors([])
                      }}
                      inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                    />

                    <TextField
                      fullWidth
                      required
                      label='رقم الجوال'
                      value={mobileNumber}
                      onChange={e => {
                        setMobileNumber(e.target.value)
                        setApiErrors([])
                      }}
                      inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
                    />

                    <Button
                      fullWidth
                      variant='contained'
                      onClick={handleSubmit}
                      disabled={!idNumber || !mobileNumber || loading}
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
                          setApiErrors([])
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

                    <Button fullWidth variant='contained' onClick={verifyCode}>
                      تحقق
                    </Button>

                    <div className='flex justify-center items-center flex-wrap gap-2'>
                      <Typography>لم يتم ارسال كود التحقق ؟</Typography>
                      {canResend ? (
                        <Typography
                          color='primary'
                          component={Link}
                          onClick={handleResendCode}
                          sx={{ cursor: 'pointer', textDecoration: 'none' }}
                        >
                          إعادة الإرسال
                        </Typography>
                      ) : (
                        <Typography color='text.secondary'>إعادة الإرسال بعد {formatTime(countdown)}</Typography>
                      )}
                    </div>

                    <Button fullWidth variant='outlined' onClick={handleBack} className='mbs-2'>
                      العودة
                    </Button>
                  </Form>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h4'>تعيين كلمة مرور جديدة</Typography>
                    <Typography>الرجاء إدخال كلمة المرور الجديدة وتأكيدها</Typography>
                  </div>

                  <Form noValidate autoComplete='off' className='flex flex-col gap-5'>
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
                        setApiErrors([])
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
                      label='تأكيد كلمة المرور الجديدة'
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
                      onClick={handlePasswordSubmit}
                      disabled={
                        !newPassword ||
                        !confirmPassword ||
                        !isPasswordValid() ||
                        newPassword !== confirmPassword ||
                        passwordLoading
                      }
                    >
                      {passwordLoading ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>

                    <Button fullWidth variant='outlined' onClick={handleBack}>
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

export default ResetPasswordVerification
