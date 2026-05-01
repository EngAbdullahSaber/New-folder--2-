'use client'

import { useInactivityLogout } from '@/hooks/useInactivityLogout'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Typography, Button } from '@mui/material'

export const InactivityHandler = () => {
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const { resetTimer } = useInactivityLogout({
    timeout: 60000, // دقيقة واحدة
    enabled: true,
    warningTime: 15, // تحذير قبل 15 ثانية
    excludePaths: ['/ar/login', '/en/login', '/fr/login'],
    onWarning: seconds => {
      setSecondsLeft(seconds)
      setIsWarningOpen(true)
    },
    onWarningUpdate: seconds => {
      setSecondsLeft(seconds)
    }
  })

  const handleStayActive = () => {
    setIsWarningOpen(false)
    resetTimer()
  }

  return (
    <Dialog open={isWarningOpen} onClose={handleStayActive}>
      <DialogTitle>تحذير: عدم النشاط</DialogTitle>
      <DialogContent>
        <Typography className='mb-4'>سيتم تسجيل خروجك تلقائياً بعد {secondsLeft} ثانية بسبب عدم النشاط.</Typography>
        <Typography className='mb-4'>هل تريد الاستمرار في الجلسة؟</Typography>
        <Button variant='contained' onClick={handleStayActive} fullWidth>
          نعم، أريد الاستمرار
        </Button>
      </DialogContent>
    </Dialog>
  )
}
