'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { useParams, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import { OTPInput } from 'input-otp'
import type { SlotProps } from 'input-otp'
import classnames from 'classnames'

// Type Imports
import type { Mode } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Form from '@components/Form'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import styles from '@/libs/styles/inputOtp.module.css'
import PolicyAgreement from '@/components/shared/PolicyAgreement'
import { Alert, maskEmail, maskNumber, toast, useSessionHandler } from '@/shared'
import { useSetState } from 'react-use'
import { signIn, signOut } from 'next-auth/react'
import { getOperatorConfig } from '@/configs/environment'

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

const LoginVerificationCode = ({ mode }: { mode: Mode }) => {
  // States
  const [otp, setOtp] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState('')
  const searchParams = useSearchParams()
  const { user } = useSessionHandler()
  const { apiUrl } = getOperatorConfig()
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(120)
  const [canResend, setCanResend] = useState(false)

  // Extract query params
  const smsVerify = searchParams.get('sms_verify') === 'true'
  const emailVerify = searchParams.get('email_verify') === 'true'
  useEffect(() => {
    if (smsVerify && !emailVerify) {
      setSelectedMethod('sms')
      setActiveStep(1) // Auto-move to OTP step
    } else if (!smsVerify && emailVerify) {
      setSelectedMethod('email')
      setActiveStep(1) // Auto-move to OTP step
    }
  }, [smsVerify, emailVerify])

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

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-2-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-2-light.png'

  // Hooks
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  // Stepper steps
  const steps = ['طريقة التحقق', 'كود التحقق']

  const handleNext = () => {
    if (selectedMethod) {
      setActiveStep(1)
    }
  }

  const sendVerificationCode = async (navigate: boolean = true) => {
    try {
      const response = await fetch(`${apiUrl}/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel: selectedMethod, id: user.id })
      })
      if (!response.ok) throw new Error('Failed to send verification')
      if (navigate) {
        handleNext()
      }

      setCountdown(120) // Add this
      setCanResend(false) // Add this
    } catch (error) {
      console.error('Verification request error:', error)
    }
  }

  const handleUserLogout = async () => {
    try {
      await signOut({ callbackUrl: '/ar/login' })
      localStorage.clear()
    } catch (error) {}
  }

  const onSubmit = async () => {
    try {
      const res = await signIn('credentials', {
        id: user.id,
        verify_code: otp,
        redirect: false
      })
      if ((res && res.error) || !res) {
        toast.error('يرجى التأكد من كود التحقق وإعادة المحاولة')
        setError('يرجى التأكد من كود التحقق وإعادة المحاولة')
      } else {
        toast.success('تم تسجيل الدخول بنجاح')
        window.location.href = getLocalizedUrl('/apps/dashboard/home', locale as Locale)
      }
    } catch (error) {
      toast.error('يرجى التأكد من كود التحقق وإعادة المحاولة')
      setError('يرجى التأكد من كود التحقق وإعادة المحاولة')
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>
        <Card className='flex flex-col sm:is-[460px]'>
          <CardContent className='p-6 sm:!p-12'>
            <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center items-center mbe-6'>
              <Logo />
            </Link>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel className='mbe-6'>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {error && (
              <Alert severity='error' className='my-2'>
                {error}
              </Alert>
            )}

            <div className='flex flex-col gap-5'>
              {/* Step 1: Verification Method Selection */}
              {activeStep === 0 && (
                <>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h4'>طريقة التحقق</Typography>
                    <Typography>الرجاء اختيار طريقة استلام كود التحقق</Typography>
                  </div>

                  <Form noValidate autoComplete='off' className='flex flex-col gap-5'>
                    <RadioGroup value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}>
                      <FormControlLabel
                        value='email'
                        control={<Radio />}
                        label='البريد الإلكتروني'
                        className='mbe-2'
                        disabled={!emailVerify}
                      />
                      <FormControlLabel value='sms' control={<Radio />} label='رقم الجوال' disabled={!smsVerify} />
                    </RadioGroup>

                    <Button
                      fullWidth
                      variant='contained'
                      onClick={() => {
                        emailVerify && smsVerify ? sendVerificationCode() : handleNext()
                      }}
                      disabled={!selectedMethod}
                    >
                      التالي
                    </Button>
                  </Form>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {activeStep === 1 && (
                <>
                  <div className='flex flex-col gap-1'>
                    <Typography variant='h4'>كود التحقق 💬</Typography>
                    <Typography>
                      تم إرسال كود التحقق إلى {selectedMethod === 'email' ? 'البريد الإلكتروني' : 'رقم الجوال'}
                    </Typography>
                    <Typography className='font-medium' color='text.primary'>
                      {selectedMethod === 'email' && user.email
                        ? maskEmail(user?.email)
                        : user && user.mobile
                          ? maskNumber(user.mobile)
                          : ''}
                    </Typography>
                  </div>
                  <Form noValidate autoComplete='off' className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-2'>
                      <Typography>ادخل كود التحقق المكون من ٦ ارقام</Typography>
                      <OTPInput
                        dir='ltr'
                        onChange={setOtp}
                        value={otp ?? ''}
                        maxLength={6}
                        containerClassName='flex items-center'
                        onComplete={() => {
                          onSubmit()
                        }}
                        render={({ slots }) => (
                          <div className='flex items-center justify-start w-full gap-4' dir='ltr'>
                            {slots.slice(0, 6).map((slot, idx) => (
                              <Slot key={idx} {...slot} />
                            ))}
                          </div>
                        )}
                      />
                    </div>
                    <Button fullWidth variant='contained' type='submit' disabled={!otp || otp.length !== 6}>
                      تحقق
                    </Button>
                    <div className='flex justify-center items-center flex-wrap gap-2'>
                      <Typography>لم يتم ارسال كود التحقق ؟</Typography>
                      {canResend ? (
                        <Typography
                          color='primary'
                          className='cursor-pointer'
                          onClick={() => {
                            sendVerificationCode(false)
                          }}
                        >
                          إعادة الأرسال
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

              <Button fullWidth variant='outlined' color='error' onClick={handleUserLogout}>
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' /> */}
      </div>
      <PolicyAgreement open={false} onClose={() => console.log('closed')} onAgree={() => console.log('agreed')} />
    </>
  )
}

export default LoginVerificationCode
