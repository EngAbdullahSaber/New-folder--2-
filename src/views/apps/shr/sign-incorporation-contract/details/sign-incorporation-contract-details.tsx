'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

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
import { Alert, TextField } from '@mui/material'
import { useSessionHandler } from '@/shared'
import SignIncorporationContractModal from '@/components/shared/SignIncorporationContract'
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

const SignIncorporationContract = ({ mode }: { mode: Mode }) => {
  // StatesshowContract
  const [otp, setOtp] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [idNo, setIdNo] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [verificationError, setverificationError] = useState<any>('')
  const { accessToken, user } = useSessionHandler()
  const [showContract, setShowContract] = useState<boolean>(false)
  const { apiUrl } = getOperatorConfig()
  // Vars
  const darkImg = '/images/pages/auth-v1-mask-2-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-2-light.png'

  // Hooks
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  // Stepper steps
  const steps = ['ادخل البيانات المطلوبة', 'أدخل كود التحقق']

  const handleNext = () => {
    setActiveStep(prev => prev + 1)
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      const response = await fetch(`${apiUrl}/shr/comp-terms-acceptances/send-verification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_no: idNo,
          mobile: mobileNumber
        })
      })
      if (!response.ok) {
        setverificationError('يرجى التأكد من البيانات المدخله')
        throw new Error('Verification failed')
      }
      setverificationError('')
      setActiveStep(1)
    } catch (error) {
      // console.error('Verification error:', error.error)
      // Handle error (show toast/message)
      // setverificationError(error)
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      const response = await fetch(`${apiUrl}/shr/comp-terms-acceptances/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verification_code: otp,
          mobile: mobileNumber,
          id_no: idNo
        })
      })
      if (!response.ok) {
        setverificationError('يرجى التأكد من البيانات المدخله')
        throw new Error('Verification failed')
      }
      setverificationError('')
      setActiveStep(2)
    } catch (error) {
      // console.error('Verification error:', error.error)
      // Handle error (show toast/message)
      // setverificationError(error)
    } finally {
      setLoading(false)
    }
  }

  const acceptContract = async () => {
    try {
      setLoading(true)
      // Replace with actual API call
      const response = await fetch(`${apiUrl}/shr/comp-terms-acceptances`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verification_code: otp,
          mobile: mobileNumber,
          id_no: idNo
        })
      })
      if (!response.ok) {
        setverificationError('يرجى التأكد من البيانات المدخله')
        throw new Error('Verification failed')
      }
      setverificationError('')
      window.location.href = getLocalizedUrl('/intro', locale as Locale)
    } catch (error) {
      // console.error('Verification error:', error.error)
      // Handle error (show toast/message)
      // setverificationError(error)
    } finally {
      setLoading(false)
    }
  }

  function maskNumber(number: string | number): string {
    let numStr = number.toString() // Ensure it's a string
    return '*'.repeat(numStr.length - 3) + numStr.slice(-3)
  }

  // Update the return

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
            {verificationError && (
              <Alert severity='error' className='my-2'>
                {verificationError}
              </Alert>
            )}

            <div className='flex flex-col gap-5'>
              {/* Step 1: Verification Method Selection */}
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
                      value={idNo}
                      onChange={e => setIdNo(e.target.value)}
                      type='text'
                    />

                    <TextField
                      fullWidth
                      required
                      label='رقم الحوال'
                      value={mobileNumber}
                      onChange={e => setMobileNumber(e.target.value)}
                      type='text'
                    />

                    <Button
                      fullWidth
                      variant='contained'
                      onClick={handleSubmit}
                      disabled={!idNo || !mobileNumber || loading}
                    >
                      {loading ? 'جاري التحقق...' : 'التالي'}
                    </Button>
                  </Form>
                </>
              )}

              {/* Step 2: OTP Verification */}
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
                        onChange={setOtp}
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
                      <Typography color='primary' component={Link}>
                        إعادة الأرسال
                      </Typography>
                    </div>
                    <Button fullWidth variant='outlined' onClick={handleBack} className='mbs-2'>
                      العودة
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        {/* <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' /> */}
      </div>
      <SignIncorporationContractModal
        open={showContract}
        onClose={() => console.log('closed')}
        onAgree={() => acceptContract()}
      />
    </>
  )
}

export default SignIncorporationContract
