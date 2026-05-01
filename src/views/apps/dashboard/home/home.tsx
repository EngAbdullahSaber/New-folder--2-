'use client'

import { useParams } from 'next/navigation'


// Type Imports
import type { Mode } from '@core/types'


// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'



const Home = ({ mode }: { mode: Mode }) => {

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-2-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-2-light.png'

  // Hooks
  const { lang: locale } = useParams()
  const authBackground = useImageVariant(mode, lightImg, darkImg)


  // Update the return

  return (

    <>
      <div className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6'>

        {/* <img src={authBackground} className='absolute bottom-[5%] z-[-1] is-full max-md:hidden' /> */}
      </div>

    </>

  )
}

export default Home
