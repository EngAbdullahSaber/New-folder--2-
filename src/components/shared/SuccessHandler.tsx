'use client'

import { useSuccessApi } from '@/contexts/successApiProvider'
import { Alert } from '@mui/material'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import CustomBadge from '@/@core/components/mui/Badge'

const SuccessHandler = () => {
  const { success, setSuccess } = useSuccessApi()
  const pathname = usePathname()

  useEffect(() => {
    setSuccess(null)
  }, [pathname])

  if (!success) return null

  return (
    <Alert severity='success' className='my-3' icon={<i className='icon-base ri ri-check-line' />}>
      {success}
    </Alert>
  )
}

export default SuccessHandler
