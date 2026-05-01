// DateRangeField.tsx
import { forwardRef, useState } from 'react'
import { TextField, FormControl } from '@mui/material'
import { format, addDays } from 'date-fns'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import dayjs from 'dayjs'

type Props = {
  value?: [Date | null, Date | null]
  onChange?: (value: [string | null, string | null]) => void
  error?: any
  helpText?: string
  label?: string
}

const CustomInput = forwardRef<any, any>((props, ref) => {
  const { label, start, end, error, helpText, ...rest } = props

  const startDate = start ? format(start, 'MM/dd/yyyy') : ''
  const endDate = end ? ` - ${format(end, 'MM/dd/yyyy')}` : ''

  const value = `${startDate}${endDate}`

  return (
    <TextField
      size='small'
      fullWidth
      inputRef={ref}
      error={!!error}
      helperText={error?.message || helpText}
      {...rest}
      label={label}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
          }
        }
      }}
      value={value}
    />
  )
})

CustomInput.displayName = 'CustomInput'

export default function DateRangeField({ value, onChange, error, helpText, label }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(value?.[0] ? dayjs(value[0]).toDate() : null)

  const [endDate, setEndDate] = useState<Date | null>(value?.[1] ? dayjs(value[1]).toDate() : null)

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates

    setStartDate(start)
    setEndDate(end)

    onChange?.([start ? dayjs(start).format('YYYY-MM-DD') : null, end ? dayjs(end).format('YYYY-MM-DD') : null])
  }

  return (
    <AppReactDatepicker
      selectsRange
      monthsShown={2}
      startDate={startDate}
      endDate={endDate}
      selected={startDate}
      shouldCloseOnSelect={false}
      onChange={handleChange}
      customInput={<CustomInput label={label} start={startDate} end={endDate} error={error} helpText={helpText} />}
    />
  )
}
