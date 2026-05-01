'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { storeDashboardType, storeOnlyIam } from '@/utils/dashboardRedirect'

const ParamCapture = () => {
  const searchParams = useSearchParams()

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) {
      storeDashboardType(type)
    }

    const onlyIam = searchParams.get('onlyIam')
    if (onlyIam) {
      storeOnlyIam(onlyIam)
    }
  }, [searchParams])

  return null
}

export default ParamCapture
