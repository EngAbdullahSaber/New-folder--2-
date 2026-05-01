'use client'

import React, { useRef } from 'react'
import { Box, Typography, Button, Divider, alpha, useTheme, TextField, useColorScheme } from '@mui/material'
import { ListOfValue } from '@/shared'
import DatePickerComponent from './DatePicker'
import { useSettings } from '@/@core/hooks/useSettings'
import type { ColumnFilter } from '@/types/components/dynamicDataTable'

interface FilterPopupProps {
  filterCol: ColumnFilter
  value: any
  onChange: (val: any) => void
  onApply: () => void
  onClear: () => void
  dictionary?: any
  locale?: string
}

export const FilterPopup: React.FC<FilterPopupProps> = ({
  filterCol,
  value,
  onChange,
  onApply,
  onClear,
  dictionary,
  locale = 'ar'
}) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { mode: muiMode, systemMode } = useColorScheme()

  // Determine if we are in dark mode (handles 'system' mode correctly)
  const isDark = muiMode === 'system' ? systemMode === 'dark' : muiMode === 'dark'

  const popupRef = useRef<HTMLDivElement>(null)

  const label =
    typeof filterCol.label === 'string'
      ? dictionary?.placeholders?.[filterCol.label] || filterCol.label
      : filterCol.label || ''

  const resolvedPlaceholder =
    filterCol.filterPlaceholder && typeof filterCol.filterPlaceholder === 'string'
      ? dictionary?.placeholders?.[filterCol.filterPlaceholder] || filterCol.filterPlaceholder
      : label || dictionary?.placeholders?.['search'] || 'بحث...'

  // For select: update value but keep popup open
  const handleSelectChange = (_: any, key: string, val: any) => {
    onChange(val)
  }

  const renderInput = () => {
    // Common styles for wrapping components like ListOfValue/DatePicker to match popup theme
    const wrapperSx = {
      '& .MuiOutlinedInput-root': {
        height: '38px',
        fontSize: '0.85rem',
        backgroundColor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.02),
        '& fieldset': {
          borderColor: isDark ? alpha(theme.palette.divider, 0.5) : alpha(theme.palette.divider, 0.8)
        },

        '&:hover fieldset': {
          borderColor: theme.palette.primary.main
        },
        '&.Mui-focused fieldset': {
          borderWidth: '1.5px'
        }
      },
      '& .MuiInputBase-input': {
        color: 'text.primary'
      },
      '& .MuiInputLabel-root': {
        display: 'none' // Hide internal label as we have it in header
      },
      '& .MuiSelect-select': {
        color: 'text.primary'
      }
    }

    switch (filterCol.type) {
      case 'select':
        return (
          <Box sx={{ minWidth: 220, ...wrapperSx }}>
            <ListOfValue
              field={{
                label: '', // Empty label
                name: filterCol.accessorKey,
                type: 'select',
                options: filterCol.options,
                keyProp: filterCol.keyProp || 'value',
                labelProp: filterCol.labelProp || 'label',
                queryParams: filterCol.filterQueryParams || filterCol.queryParams,
                perPage: filterCol.perPage,
                displayProps: filterCol.filterDisplayProps || [],
                searchProps: filterCol.filterSearchProps || [],
                placeholder: resolvedPlaceholder
              }}
              row={{ [filterCol.accessorKey]: value ?? '' }}
              rowIndex={0}
              handleInputChange={handleSelectChange}
              errors={{}}
              apiUrl={filterCol.apiUrl || ''}
              initialData={[]}
            />
          </Box>
        )

      case 'date':
        return (
          <Box sx={{ minWidth: 220, ...wrapperSx }}>
            <DatePickerComponent label={''} value={value ?? null} onChange={val => onChange(val)} />
          </Box>
        )

      case 'dateRange':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 240, ...wrapperSx }}>
            <DatePickerComponent
              label={dictionary?.placeholders?.['from'] || 'من'}
              value={value?.from ?? null}
              onChange={val => onChange({ ...(typeof value === 'object' && value ? value : {}), from: val })}
            />
            <DatePickerComponent
              label={dictionary?.placeholders?.['to'] || 'إلى'}
              value={value?.to ?? null}
              onChange={val => onChange({ ...(typeof value === 'object' && value ? value : {}), to: val })}
            />
          </Box>
        )

      case 'number':
        return (
          <TextField
            fullWidth
            size='small'
            type='number'
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onApply()}
            autoFocus
            placeholder={resolvedPlaceholder}
            sx={wrapperSx}
          />
        )

      case 'checkbox':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: '8px 12px',
              borderRadius: 'var(--mui-shape-customBorderRadius-md)',
              border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.4) : alpha(theme.palette.divider, 0.7)}`,
              background: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.01),

              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { borderColor: theme.palette.primary.main, background: alpha(theme.palette.primary.main, 0.04) }
            }}
            onClick={() => onChange(!value)}
          >
            <input
              type='checkbox'
              checked={!!value}
              readOnly
              style={{ width: 16, height: 16, accentColor: theme.palette.primary.main, cursor: 'pointer' }}
            />
            <Typography variant='body2' sx={{ color: 'text.primary', fontSize: '0.82rem', fontWeight: 500 }}>
              {label}
            </Typography>
          </Box>
        )

      default:
        // text
        return (
          <TextField
            fullWidth
            size='small'
            type='text'
            value={value ?? ''}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onApply()}
            autoFocus
            placeholder={resolvedPlaceholder}
            sx={wrapperSx}
          />
        )
    }
  }

  const hasValue = value !== undefined && value !== '' && value !== null

  return (
    <div
      data-filter-popup
      ref={popupRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        insetInlineStart: 0,
        zIndex: 99,
        minWidth: 260,
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        overflow: 'hidden',
        backgroundColor: isDark ? '#2f3349' : '#ffffff', // Explicit background for contrast
        border: `1px solid ${isDark ? alpha(theme.palette.divider, 1) : alpha(theme.palette.divider, 0.6)}`,
        boxShadow: isDark
          ? `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${alpha(theme.palette.common.white, 0.05)}`
          : `0 20px 50px rgba(0,0,0,0.1), 0 0 0 1px ${alpha(theme.palette.common.black, 0.02)}`,

        backdropFilter: 'blur(15px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* ── Header ───────────────────────────────────── */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            color: theme.palette.primary.main
          }}
        >
          <i className='ri-filter-3-line' style={{ fontSize: '14px' }} />
        </Box>
        <Typography
          variant='subtitle2'
          sx={{
            color: isDark ? theme.palette.primary.main : 'text.primary',

            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.01em'
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* ── Input Content ────────────────────────────── */}
      <Box sx={{ p: 2 }}>{renderInput()}</Box>

      {/* ── Footer Actions ───────────────────────────── */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          gap: 1.5
        }}
      >
        {/* Reset Button */}
        <Button
          size='small'
          variant='text'
          onClick={onClear}
          disabled={!hasValue}
          startIcon={<i className='ri-delete-bin-7-line' style={{ fontSize: '14px' }} />}
          sx={{
            flex: 1,
            height: 32,
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: hasValue ? theme.palette.error.main : 'text.disabled',
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1)
            }
          }}
        >
          {dictionary?.actions?.['reset'] || 'مسح'}
        </Button>

        {/* Apply Button */}
        <Button
          size='small'
          variant='contained'
          onClick={onApply}
          startIcon={<i className='ri-check-line' style={{ fontSize: '14px' }} />}
          sx={{
            flex: 1,
            height: 32,
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 700,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`
            }
          }}
        >
          {dictionary?.actions?.['apply'] || 'تطبيق'}
        </Button>
      </Box>
    </div>
  )
}



export default FilterPopup
