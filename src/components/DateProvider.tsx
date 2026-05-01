'use client'

import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'

import 'dayjs/locale/ar'
import 'dayjs/locale/en'

interface IProps {
  children: React.ReactNode
}

const DateProvider = ({ children }: IProps) => {
  const { lang } = useParams()
  const locale = lang === 'ar' ? 'ar' : 'en'

  dayjs.locale(locale)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  )
}

export default DateProvider
