'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Component Imports
import PolicyAgreement from '@/components/shared/PolicyAgreement'

// Type Imports
import type { Mode } from '@core/types'
import { checkUserValidation, getLocalizedUrl, handleSave, Locale, useSessionHandler } from '@/shared'
import { getOperatorConfig } from '@/configs/environment'

const PolicyAgreementComponent = ({ mode }: { mode: Mode }) => {
  // States
  const [isOpen, setIsOpen] = useState(true)
  const { accessToken, user } = useSessionHandler()
  const { apiUrl } = getOperatorConfig()

  // Hooks
  const { lang: locale } = useParams()
  const router = useRouter()
  const authBackground = useImageVariant(
    mode,
    '/images/pages/auth-v1-mask-2-light.png',
    '/images/pages/auth-v1-mask-2-dark.png'
  )

  const handleAgree = async () => {
    try {
      const response = await handleSave(
        '/aut/users',
        locale as Locale,
        { acceptance: 1, acceptance_id: user['acceptance']['id'] },
        user.id,
        accessToken
      )
      setIsOpen(false)
      window.location.href = getLocalizedUrl('/apps/dashboard/home', locale as Locale)
    } catch (error) {
      console.error('Error submitting policy acceptance:', error)
    }
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>
        <PolicyAgreement open={isOpen} onClose={() => setIsOpen(false)} onAgree={handleAgree} />
        {/* <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' /> */}
      </div>
    </>
  )
}

export default PolicyAgreementComponent
