'use client'

import React, { useState, useEffect } from 'react'
import * as Shared from '@/shared'

import { getDictionary } from '@/utils/getDictionary'

export const useCityAccess = () => {
  const { user, filter_with_city } = Shared.useSessionHandler()
  const { lang: locale } = Shared.useParams()
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    if (locale) {
      getDictionary(locale as any).then((res: any) => {
        setDictionary(res)
      })
    }
  }, [locale])

  const hasNoCitiesAssigned = user && (!user.user_cities || user.user_cities.length === 0)
  const hasCitiesButNoneSelected = user && user.user_cities?.length > 0 && !user.context?.city_id

  const shouldBlockAccess = hasNoCitiesAssigned || hasCitiesButNoneSelected

  const AccessBlockedScreen = () => (
    <Shared.Card sx={{ my: 4 }}>
      <Shared.CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 20,
          textAlign: 'center',
          minHeight: '400px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Shared.Box
          sx={{
            mb: 6,
            width: 100,
            height: 100,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'warning.lighter',
            color: 'warning.main',
            fontSize: '3.5rem',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'warning.main',
              animation: 'ripple 1.5s infinite ease-out',
              opacity: 0
            },
            '@keyframes ripple': {
              '0%': { transform: 'scale(1)', opacity: 0.5 },
              '100%': { transform: 'scale(1.5)', opacity: 0 }
            }
          }}
        >
          <i className='ri-shield-keyhole-line' />
        </Shared.Box>

        <Shared.Typography
          variant='body1'
          sx={{
            color: 'text.secondary',
            maxWidth: 500,
            mx: 'auto',
            mb: 8,
            lineHeight: 1.6
          }}
        >
          {hasNoCitiesAssigned
            ? (dictionary?.messages?.access_denied_cities || 'Access denied: No cities assigned to your account.')
            : (dictionary?.messages?.access_denied_no_active_city || 'عبر إعدادات المستخدم، يمكنك تحديد أو تغيير المدينة النشطة للوصول إلى هذه الشاشة.')
          }
        </Shared.Typography>
      </Shared.CardContent>
    </Shared.Card>
  )

  return {
    shouldBlockAccess,
    hasNoCitiesAssigned,
    hasCitiesButNoneSelected,
    AccessBlockedScreen,
    dictionary,
    loading: !dictionary,
    user,
    filter_with_city,
    locale
  }
}
