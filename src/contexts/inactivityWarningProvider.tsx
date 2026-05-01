'use client'

import { useInactivityLogout } from '@/hooks/useInactivityLogout'
import { useState, ReactNode, useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle, Typography, Button, LinearProgress } from '@mui/material'

interface InactivityProviderProps {
  children: ReactNode
  timeout?: number
  warningTime?: number
  enabled?: boolean
  debounceTime?: number // ✅ Add this
}

export const InactivityProvider = ({
  children,
  timeout = 600000,
  warningTime = 60,
  enabled = true,
  debounceTime = 3000 // ✅ Add this with default value
}: InactivityProviderProps) => {
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [initialWarningTime, setInitialWarningTime] = useState(0)

  const onWarning = useCallback((seconds: number) => {
    setSecondsLeft(seconds)
    setInitialWarningTime(seconds)
    setIsWarningOpen(true)
  }, [])

  const onWarningUpdate = useCallback((seconds: number) => {
    setSecondsLeft(seconds)
  }, [])

  const { resetTimer } = useInactivityLogout({
    timeout,
    enabled,
    pauseEventListeners: isWarningOpen,
    warningTime,
    debounceTime,
    onWarning,
    onWarningUpdate
  })

  const handleStayActive = () => {
    setIsWarningOpen(false)
    setSecondsLeft(0)
    resetTimer()
  }

  const progress = initialWarningTime > 0 ? (secondsLeft / initialWarningTime) * 100 : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {children}

      <Dialog open={isWarningOpen} onClose={handleStayActive} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
          ⚠️ تحذير: عدم النشاط
        </DialogTitle>
        <DialogContent>
          <Typography
            className='mb-4'
            variant='h3'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: secondsLeft <= 10 ? 'error.main' : 'primary.main',
              fontFamily: 'monospace'
            }}
          >
            {formatTime(secondsLeft)}
          </Typography>

          <LinearProgress
            variant='determinate'
            value={progress}
            color={progress <= 30 ? 'error' : 'primary'}
            sx={{ height: 8, borderRadius: 4, mb: 3 }}
          />

          <Typography className='mb-4' variant='body1' sx={{ textAlign: 'center' }}>
            سيتم تسجيل خروجك تلقائياً بسبب عدم النشاط
          </Typography>

          <Typography className='mb-4' color='text.secondary' sx={{ textAlign: 'center' }}>
            هل تريد الاستمرار في الجلسة؟
          </Typography>

          <Button variant='contained' onClick={handleStayActive} fullWidth color='primary' size='large'>
            نعم، أريد الاستمرار
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
