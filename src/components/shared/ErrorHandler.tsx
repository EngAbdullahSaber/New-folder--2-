'use client'

import { useErrorApi } from '@/contexts/errorApiProvider'
import { Alert } from '@mui/material'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { formatApiErrors } from '@/shared'

const ErrorHandler = () => {
  const { error, setError }: any = useErrorApi()
  const pathname = usePathname()

  useEffect(() => {
    setError(null)
  }, [pathname])

  if (!error) return null

  const messages = formatApiErrors(error)

  return (
    <Alert severity='error' className='my-3'>
      <div className='font-bold mb-2'>لم تتم العملية بنجاح</div>

      <ul className='list-disc list-inside space-y-1'>
        {messages.map((msg: string, index: number) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </Alert>
  )
}

export default ErrorHandler
