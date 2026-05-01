'use client'

import { Alert } from '@mui/material'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useInfoApi } from '@/contexts/infoApiProvider'

const InfoHandler = () => {
  const { info, setInfo } = useInfoApi()
  const pathname = usePathname()

  useEffect(() => {
    setInfo(null)
  }, [pathname])

  if (!info) return null

  return (
    <Alert severity='info' className='my-3' icon={<i className='icon-base ri ri-information-line' />}>
      {info}
    </Alert>
  )
}

export default InfoHandler
