'use client'

import React, { useState, useCallback } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Collapse,
  useTheme,
  alpha,
  Divider,
  Tooltip
} from '@mui/material'
import { ListOfValue } from '@/shared'
import DatePickerComponent from './DatePicker'
import type { ColumnFilter, DynamicColumnDef } from '@/shared'
import { useLOVContext } from '../../contexts/lovContext'

interface TableFiltersProps {
  filterableColumns: ColumnFilter[]
  onFilterChange: (filters: Record<string, any>) => void
  onReset?: () => void
  dictionary?: any
  locale?: string
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  hideToolbar?: boolean
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  filterableColumns,
  onFilterChange,
  onReset,
  dictionary,
  locale = 'ar',
  isExpanded,
  onExpandedChange,
  hideToolbar = false
}) => {
  const { getOptions } = useLOVContext()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [localExpanded, setLocalExpanded] = useState(false)

  const expanded = isExpanded !== undefined ? isExpanded : localExpanded
  const setExpanded = onExpandedChange !== undefined ? onExpandedChange : setLocalExpanded

  // Helper to get labels from dynamic LOV cache
  const getLabelFromCache = useCallback(
    (filter: ColumnFilter, value: any) => {
      // ... (keep internal logic)
      if (!filter.apiUrl) return null

      const queryParams = filter.queryParams || {}
      const serialized = JSON.stringify(
        Object.keys(queryParams)
          .sort()
          .reduce(
            (acc, key) => {
              acc[key] = queryParams[key]
              return acc
            },
            {} as Record<string, any>
          )
      )
      const cacheKey = `${filter.apiUrl}-${serialized}`
      const options = getOptions(cacheKey, true)
      if (options) {
        const option = options.find((opt: any) => String(opt.value) === String(value))
        return option?.label
      }
      return null
    },
    [getOptions]
  )

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => {
      const updated = { ...prev }
      if (value === null || value === undefined || value === '') {
        delete updated[key]
      } else {
        updated[key] = value
      }
      return updated
    })
  }, [])

  const handleApplyFilters = useCallback(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleResetFilters = useCallback(() => {
    setFilters({})
    onFilterChange({})
    onReset?.()
  }, [onFilterChange, onReset])

  const activeFiltersCount = Object.keys(filters).length

  const renderFilterField = useCallback(
    (filter: ColumnFilter) => {
      const value = filters[filter.accessorKey] ?? ''
      const label =
        typeof filter.label === 'string' ? dictionary?.placeholders?.[filter.label] || filter.label : filter.label

      switch (filter.type) {
        case 'text':
          return (
            <TextField
              fullWidth
              size='small'
              label={label}
              value={value}
              onChange={e => handleFilterChange(filter.accessorKey, e.target.value)}
              placeholder={dictionary?.placeholders?.['search'] || 'بحث...'}
              sx={inputSx(isDark, theme)}
            />
          )

        case 'number':
          return (
            <TextField
              fullWidth
              size='small'
              type='number'
              label={label}
              value={value}
              onChange={e => handleFilterChange(filter.accessorKey, e.target.value)}
              sx={inputSx(isDark, theme)}
            />
          )

        case 'select':
          return (
            <ListOfValue
              field={{
                label,
                name: filter.accessorKey,
                type: 'select',
                options: filter.options,
                keyProp: filter.keyProp || 'value',
                labelProp: filter.labelProp || 'label',
                queryParams: filter.queryParams,
                perPage: filter.perPage
              }}
              row={filters}
              rowIndex={0}
              handleInputChange={(_, key, val) => handleFilterChange(key, val)}
              errors={{}}
              apiUrl={filter.apiUrl || ''}
              initialData={[]}
            />
          )

        case 'date':
          return <DatePickerComponent label={label} value={value} onChange={val => handleFilterChange(filter.accessorKey, val)} />

        case 'dateRange':
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <DatePickerComponent
                label={dictionary?.placeholders?.['from'] || 'من'}
                value={value?.from || null}
                onChange={val =>
                  handleFilterChange(filter.accessorKey, { ...(typeof value === 'object' ? value : {}), from: val })
                }
              />
              <DatePickerComponent
                label={dictionary?.placeholders?.['to'] || 'إلى'}
                value={value?.to || null}
                onChange={val =>
                  handleFilterChange(filter.accessorKey, { ...(typeof value === 'object' ? value : {}), to: val })
                }
              />
            </Box>
          )

        case 'checkbox':
          return (
            <FormControlLabel
              control={
                <Checkbox
                  size='small'
                  checked={!!value}
                  onChange={e => handleFilterChange(filter.accessorKey, e.target.checked)}
                  sx={{ color: theme.palette.primary.main }}
                />
              }
              label={<Typography variant='body2'>{label}</Typography>}
            />
          )

        default:
          return null
      }
    },
    [filters, handleFilterChange, dictionary, isDark, theme]
  )

  // ─── Shared style helpers ──────────────────────────────────────────────────

  const surface = isDark ? alpha(theme.palette.common.white, 0.04) : alpha(theme.palette.common.black, 0.02)

  const border = isDark ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.1)

  return (
    <Box sx={{ mb: activeFiltersCount > 0 || expanded ? 2 : 0 }}>
      {/* ── Toolbar Row ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          p: '6px 10px',
          borderRadius: '10px',
          bgcolor: surface,
          border: `1px solid ${border}`,
          backdropFilter: 'blur(6px)',
          mb: activeFiltersCount > 0 ? 1 : expanded ? 1 : 0,
          ...(hideToolbar ? { display: 'none' } : {})
        }}
      >
        {/* Filter Toggle */}
        {!hideToolbar && (
          <Tooltip title={dictionary?.actions?.['filters'] || 'الفلاتر'} arrow>
            <Button
              variant={expanded ? 'contained' : 'outlined'}
              size='small'
              onClick={() => setExpanded(!expanded)}
              startIcon={<i className='ri-filter-3-line' style={{ fontSize: '0.9rem' }} />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 1.5,
                height: 32,
                ...(expanded
                  ? {}
                  : {
                      borderColor: border,
                      color: 'text.secondary',
                      '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main }
                    })
              }}
            >
              {dictionary?.actions?.['filters'] || 'الفلاتر'}
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    ml: 0.8,
                    px: 0.8,
                    height: 18,
                    borderRadius: '9px',
                    bgcolor:     alpha(theme.palette.primary.main, 0.12),
                    color:   '#fff'  ,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </Button>
          </Tooltip>
        )}


        {/* Clear All Button (Only when not hiding toolbar or if we want it in chips row) */}
        {!hideToolbar && activeFiltersCount > 0 && (
          <>
            <Box sx={{ flex: 1 }} />
            <Tooltip title={dictionary?.actions?.['clear'] || 'مسح الكل'} arrow>
              <IconButton
                size='small'
                onClick={handleResetFilters}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.16) }
                }}
              >
                <i className='ri-close-circle-line' style={{ fontSize: '0.95rem' }} />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>


      {/* ── Expandable Filter Panel ──────────────────────────────────────── */}
      <Collapse in={expanded} timeout={220}>
        <Box
          sx={{
            p: 2,
            borderRadius: '10px',
            bgcolor: surface,
            border: `1px solid ${border}`,
            backdropFilter: 'blur(6px)'
          }}
        >
          {/* ── Active Filter Chips (Moved Inside Panel) ──────────────────── */}
          {activeFiltersCount > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, justifyContent: 'flex-start' }}>
              {Object.entries(filters).map(([key, value]) => {
                const filter = filterableColumns.find(f => f.accessorKey === key)
                if (!filter) return null

                let displayValue = value
                if (filter.type === 'select') {
                  if (filter.options) {
                    const option = filter.options.find((opt: any) => opt.value === value)
                    displayValue = option?.label || value
                  } else {
                    displayValue = getLabelFromCache(filter, value) || value
                  }
                } else if (filter.type === 'dateRange') {
                  displayValue = `${value.from || '...'} → ${value.to || '...'}`
                }

                return (
                  <Chip
                    key={key}
                    size='small'
                    label={
                      <Typography variant='caption' sx={{ fontWeight: 500 }}>
                        <span style={{ opacity: 0.65 }}>
                          {typeof filter.label === 'string'
                            ? dictionary?.placeholders?.[filter.label] || filter.label
                            : filter.label}
                          :
                        </span>
                        {displayValue}
                      </Typography>
                    }
                    onDelete={() => handleFilterChange(key, null)}
                    sx={{
                      height: 24,
                      borderRadius: '6px',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                      color: theme.palette.primary.main,
                      '& .MuiChip-deleteIcon': {
                        color: alpha(theme.palette.primary.main, 0.6),
                        fontSize: '0.85rem',
                        '&:hover': { color: theme.palette.primary.main }
                      }
                    }}
                  />
                )
              })}
            </Box>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 2
            }}
          >
            {filterableColumns.map(filter => (
              <Box key={filter.accessorKey}>{renderFilterField(filter)}</Box>
            ))}
          </Box>

          <Divider sx={{ my: 2, borderColor: border }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button
              variant='outlined'
              size='small'
              color='error'
              onClick={handleResetFilters}
              startIcon={<i className='ri-refresh-line' style={{ fontSize: '0.85rem' }} />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                height: 32
              }}
            >
              {dictionary?.actions?.['reset'] || 'إعادة تعيين'}
            </Button>
            <Button
              variant='contained'
              size='small'
              onClick={handleApplyFilters}
              startIcon={<i className='ri-search-line' style={{ fontSize: '0.85rem' }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                height: 32,
                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.35)}`
              }}
            >
              {dictionary?.actions?.['apply'] || 'تطبيق'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

// ── Shared input style helper ────────────────────────────────────────────────
function inputSx(isDark: boolean, theme: any) {
  return {
    '& .MuiOutlinedInput-root': {
      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
      fontSize: '0.82rem',
      '& fieldset': {
        borderColor: 'var(--mui-palette-divider)'
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main
      }
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.82rem'
    }
  }
}

export default TableFilters
