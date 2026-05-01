'use client'

import React, { forwardRef, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { TimePicker as MuiTimePicker, MobileTimePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/ar'
import 'dayjs/locale/en'

interface TimePickerProps {
  label?: string
  value: string | null
  locale: string
  onChange: (value: string | null) => void
  error?: any
  helperText?: string
  disabled?: boolean
  readOnly?: boolean
  tooltip?: string
  use24Hours?: boolean
  dictionary?: any
  pickerType?: 'input' | 'clock'
  now?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      disabled,
      readOnly,
      tooltip,
      locale,
      use24Hours = true,
      dictionary,
      pickerType = 'input',
      now = false,
      onKeyDown,
      onFocus
    },
    ref
  ) => {
    const timeValue: Dayjs | null = value ? dayjs(`1970-01-01T${value}`) : null

    const PickerComponent = pickerType === 'clock' ? MobileTimePicker : MuiTimePicker

    useEffect(() => {
      if (now && !value) {
        onChange(dayjs().format('HH:mm:ss'))
      }
    }, [now, value, onChange])

    return (
      <PickerComponent
        ampm={!use24Hours}
        value={timeValue}
        onChange={newValue => {
          if (!newValue) {
            onChange(null)
            return
          }

          onChange(newValue.format('HH:mm:ss'))
        }}
        disabled={disabled}
        localeText={{
          cancelButtonLabel: dictionary?.actions?.['cancel'],
          okButtonLabel: dictionary?.actions?.['save'],
          clearButtonLabel: dictionary?.actions?.['clear'],
          toolbarTitle: dictionary?.actions?.['select_time']
        }}
        slotProps={{
          popper: {
            sx: {
              '& .MuiPickersLayout-root': {
                display: 'flex',
                flex: 1,
                width: '100%',
                flexDirection: 'column'
              },
              '& .MuiList-root': {
                display: 'flex',
                flex: 1,
                width: '100%',
                flexDirection: 'column'
              },
              '& .MuiButtonBase-root': {
                flex: 1,
                width: '100%'
              }
            }
          },
          actionBar: {
            sx: {
              display: 'flex',
              justifyContent: 'space-between'
            }
          },
          textField: {
            inputRef: ref,
            size: 'small',
            fullWidth: true,
            label,
            error: !!error,
            helperText: error?.message || helperText,
            inputProps: {
              readOnly,
              title: tooltip
            },
            onKeyDown,
            onFocus,
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
        views={['hours', 'minutes']}
        format={use24Hours ? 'HH:mm' : 'hh:mm A'}
      />
    )
  }
)

export default TimePicker
