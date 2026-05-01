'use client'

// استيرادات Next
import Link from 'next/link'

// استيرادات MUI
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// استيرادات الأنواع
import type { Mode } from '@core/types'

// استيرادات الـ Hooks
import { useImageVariant } from '@core/hooks/useImageVariant'

const NotFound = ({ mode }: { mode: Mode }) => {
  // المتغيرات
  const darkImg = '/images/pages/misc-mask-1-dark.png'
  const lightImg = '/images/pages/misc-mask-1-light.png'

  // الـ Hooks
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center gap-10'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            404
          </Typography>
          <Typography variant='h4'>الصفحة غير موجودة ⚠️</Typography>
          <Typography>لم نتمكن من العثور على الصفحة التي تبحث عنها.</Typography>
        </div>
        <img
          alt='error-illustration'
          src='/images/illustrations/characters/3.png'
          className='object-cover bs-[400px] md:bs-[450px] lg:bs-[500px]'
        />
        <Button href='/' component={Link} variant='contained'>
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
      <img src={miscBackground} className='absolute bottom-0 z-[-1] is-full max-md:hidden' />
    </div>
  )
}

export default NotFound
