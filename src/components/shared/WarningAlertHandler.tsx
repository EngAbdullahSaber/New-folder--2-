'use client'

import { Alert } from '@mui/material'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useWarningApi } from '@/contexts/warningApiProvider'

const WarningHandler = () => {
  const { warning, setWarning } = useWarningApi()
  const pathname = usePathname()

  useEffect(() => {
    setWarning(null)
  }, [pathname])

  if (!warning) return null

  return (
    <Alert severity='warning' className='my-3' icon={<i className='icon-base ri ri-alert-line' />}>
      {warning}
    </Alert>
  )
}

export default WarningHandler
