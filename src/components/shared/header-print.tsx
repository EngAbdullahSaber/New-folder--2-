'use client'

import { useEffect, useState } from 'react'
import { getOperatorConfig } from '@/configs/environment'
import { useSessionHandler, useSearchParams } from '@/shared'
import '@/shared/styles/styles.css'
import dayjs from 'dayjs'

interface IProps {
  dictionary: any
}
export const HeaderPrint = ({ dictionary }: IProps) => {
  const operator = getOperatorConfig()
  const { user } = useSessionHandler()

  const recordId = '000000'
  const { printHeader, title } = operator

  // ✅ Client-only date to avoid hydration mismatch
  const [formattedDate, setFormattedDate] = useState<string>('')

  let departmentDisplay = ''
  if (user?.context?.department_id) {
    const foundDept = user?.user_depts?.find((d: any) => String(d.id) === String(user.context.department_id))
    if (foundDept) {
      departmentDisplay = foundDept.department_name_ar
    }
  }

  useEffect(() => {
    const value = new Intl.DateTimeFormat('ar-SA', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date())

    setFormattedDate(value)
  }, [])

  return (
    <div className='header-container  '>
      {/* Right Section */}
      <div className='header-section right'>
        {/* <p>الموسم : 1444</p> */}
        <p>{`${dictionary?.placeholders['season']}: ${user?.context?.season}`}</p>
        {/* <p>الإدارة : المؤسسسة الأهلية للأدلاء</p> */}
        <p>{`${dictionary?.placeholders['season']}: ${departmentDisplay}`}</p>
        {/* <p>المستخدم : يوسف محجوب</p> */}
        <p>{`${dictionary?.placeholders['user_name']}: ${user?.full_name_ar}`}</p>
        <p>{`${dictionary?.placeholders['date']}: ${dayjs().format('YYYY-MM-DD HH:MM')}`}</p>
      </div>

      {/* Center Logo */}
      <div className='header-section center'>
        <img src={`/images/logos/${printHeader.logoImage}`} alt={title} className='logo' />
      </div>

      {/* Left Section */}
      <div className='header-section left'>
        <p className='small-text'>{printHeader.address}</p>
        <p className='small-text'>رأس المال : {printHeader.capital}</p>
      </div>
    </div>
  )
}

export default HeaderPrint
