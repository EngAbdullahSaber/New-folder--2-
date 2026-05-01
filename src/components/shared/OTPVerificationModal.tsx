// components/OTPVerificationModal.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  CircularProgress,
  IconButton
} from '@mui/material'
import { OTPInput, SlotProps } from 'input-otp'
import { toast } from 'react-toastify'
import axios from 'axios'
import { getOperatorConfig } from '@/configs/environment'

interface OTPVerificationModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  fieldType: 'email' | 'mobile'
  fieldValue: string
  accessToken: string
  dictionary?: any
}

// Slot component for OTP input
const Slot = (props: SlotProps) => {
  return (
    <div
      className={`relative w-12 h-14 text-2xl flex items-center justify-center border-2 rounded-lg transition-all
        ${props.isActive ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'}
        ${props.char ? 'border-primary-500' : ''}
      `}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

const FakeCaret = () => {
  return (
    <div className='absolute pointer-events-none inset-0 flex items-center justify-center animate-pulse'>
      <div className='w-px h-8 bg-primary-500' />
    </div>
  )
}

export const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  open,
  onClose,
  onSuccess,
  fieldType,
  fieldValue,
  accessToken,
  dictionary
}) => {
  const [otp, setOtp] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { apiUrl } = getOperatorConfig()

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Send verification code
  const sendVerificationCode = async (isInitial = true) => {
    if (isInitial) {
      setResendLoading(false)
    } else {
      setResendLoading(true)
    }

    try {
      const endpoint =
        fieldType === 'email' ? '/api/verification/send-email-code' : '/api/verification/send-mobile-code'

      await axios.post(
        `${apiUrl}${endpoint}`,
        { [fieldType]: fieldValue },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      toast.success(
        fieldType === 'email' ? 'تم إرسال كود التحقق إلى البريد الإلكتروني' : 'تم إرسال كود التحقق إلى رقم الجوال'
      )

      setCountdown(60) // 60 seconds countdown
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'فشل إرسال كود التحقق')
    } finally {
      setResendLoading(false)
    }
  }

  // Send code when modal opens
  useEffect(() => {
    if (open) {
      sendVerificationCode(true)
      setOtp('')
    }
  }, [open])

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('الرجاء إدخال كود التحقق المكون من 6 أرقام')
      return
    }

    setLoading(true)

    try {
      const endpoint = fieldType === 'email' ? '/api/verification/verify-email' : '/api/verification/verify-mobile'

      await axios.post(
        `${apiUrl}${endpoint}`,
        {
          [fieldType]: fieldValue,
          code: otp
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )

      toast.success('تم التحقق بنجاح')
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'كود التحقق غير صحيح')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setOtp('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth dir='rtl'>
      <DialogTitle>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>
            {fieldType === 'email' ? 'التحقق من البريد الإلكتروني' : 'التحقق من رقم الجوال'}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <i className='ri-close-line' />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box className='flex flex-col gap-5' py={2}>
          {/* Instructions */}
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            تم إرسال كود التحقق المكون من 6 أرقام إلى
          </Typography>
          <Typography variant='body1' fontWeight='bold' textAlign='center' color='primary'>
            {fieldValue}
          </Typography>

          {/* OTP Input */}
          <Box className='flex flex-col gap-2'>
            <Typography>ادخل كود التحقق المكون من 6 أرقام</Typography>
            <OTPInput
              dir='ltr'
              onChange={setOtp}
              value={otp ?? ''}
              maxLength={6}
              disabled={loading}
              containerClassName='flex items-center'
              onComplete={() => {
                handleVerifyOTP()
              }}
              render={({ slots }) => (
                <div className='flex items-center justify-center w-full gap-4' dir='ltr'>
                  {slots.slice(0, 6).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              )}
            />
          </Box>

          {/* Verify Button */}
          <Button
            fullWidth
            variant='contained'
            onClick={handleVerifyOTP}
            disabled={!otp || otp.length !== 6 || loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'جاري التحقق...' : 'تحقق'}
          </Button>

          {/* Resend Code */}
          <Box className='flex justify-center items-center flex-wrap gap-2'>
            <Typography variant='body2'>لم يتم استلام كود التحقق؟</Typography>
            {countdown > 0 ? (
              <Typography variant='body2' color='text.secondary'>
                يمكنك إعادة الإرسال بعد {countdown} ثانية
              </Typography>
            ) : (
              <Typography
                variant='body2'
                color='primary'
                className='cursor-pointer'
                onClick={() => sendVerificationCode(false)}
                sx={{
                  pointerEvents: resendLoading ? 'none' : 'auto',
                  opacity: resendLoading ? 0.5 : 1
                }}
              >
                {resendLoading ? 'جاري الإرسال...' : 'إعادة الإرسال'}
              </Typography>
            )}
          </Box>

          {/* Back Button */}
          <Button fullWidth variant='outlined' onClick={handleClose} disabled={loading}>
            العودة
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
