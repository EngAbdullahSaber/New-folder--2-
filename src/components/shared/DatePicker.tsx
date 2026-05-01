'use client'

import React, { forwardRef, useEffect } from 'react'
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'

interface DatePickerProps {
  label?: string
  value: string | null
  onChange: (value: string | null) => void
  error?: any
  helperText?: string
  disabled?: boolean
  readOnly?: boolean
  onFocus?: () => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  tooltip?: string
  dictionary?: any
  sx?: any
  now?: boolean
  withTime?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}

const DatePickerComponent = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      disabled,
      readOnly,
      onFocus,
      onBlur,
      tooltip,
      dictionary,
      sx,
      now = false,
      withTime = false,
      onKeyDown
    },
    ref
  ) => {
    const dateValue: Dayjs | null = value ? dayjs(value) : null

    useEffect(() => {
      if (now && !value) {
        const format = withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
        onChange(dayjs().format(format))
      }
    }, [now, value, onChange, withTime])

    const PickerComponent = withTime ? MuiDateTimePicker : MuiDatePicker

    return (
      <PickerComponent
        value={dateValue}
        onChange={newValue => {
          if (!newValue) {
            onChange(null)
            return
          }

          const format = withTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'

          onChange(newValue.format(format))
        }}
        disabled={disabled}
        sx={sx}
        slotProps={{
          textField: {
            inputRef: ref,
            label,
            error: !!error,
            helperText: error?.message || helperText,
            onFocus,
            onBlur,
            onKeyDown,
            inputProps: { readOnly, title: tooltip },
            size: 'small',
            fullWidth: true,
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
                }
              }
            }
          }
        }}
        localeText={{
          cancelButtonLabel: dictionary?.actions?.['cancel'],
          okButtonLabel: dictionary?.actions?.['save'],
          clearButtonLabel: dictionary?.actions?.['clear'],
          toolbarTitle: dictionary?.actions?.['select_time']
        }}
      />
    )
  }
)

export default DatePickerComponent
