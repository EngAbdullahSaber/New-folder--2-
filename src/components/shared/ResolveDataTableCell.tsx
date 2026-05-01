'use client'
import React from 'react'
import classNames from 'classnames'
import {
  Avatar,
  Box,
  Chip,
  format,
  formatNumber,
  getItemFromStaticListByValue,
  LinearProgress,
  Tooltip,
  Typography,
  useTheme,
  useColorScheme
} from '@/shared'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import { getFormattedHijriDate } from '@/utils/hijriConverter' // ✅ Import Hijri converter
import dayjs from 'dayjs'
import Barcode from 'react-barcode'

type ResolveCellHelpers = {
  onRowOptionClick?: (action: string, id: any, customUrl?: string) => void
  openDialog?: (component: any, value: any) => void
  mode?: 'table' | 'card'
  dictionary?: any
  isPrintMode?: boolean
  theme?: any
}

// Helper to get nested value using dot notation
const getNestedValue = (obj: any, path: string) => path.split('.').reduce((o, k) => o?.[k], obj)

export const resolveCell = (column: any, helpers: ResolveCellHelpers = {}) => {
  const { onRowOptionClick, openDialog, mode = 'table', dictionary, isPrintMode = false, theme } = helpers
  const getAvatar = (params: any) => {
    const { avatar } = params
    const size = mode === 'table' ? 34 : 24
    if (isPrintMode && mode === 'table') return null
    return <CustomAvatar skin='light' variant='circular' src={avatar} size={size} />
  }

  const getAlignment = () => {
    switch (column.align) {
      case 'text-left':
        return 'justify-start'
      case 'text-center':
        return 'justify-center'
      case 'text-right':
        return 'justify-end'
      default:
        return 'justify-start'
    }
  }

  // ✅ Enhanced card field renderer with Hijri support
  const renderCardField = (
    row: any,
    accessor: string,
    identifier?: boolean,
    labelView?: string,

    type?: string
  ) => {
    const label = !labelView ? dictionary?.placeholders?.[accessor] || accessor : dictionary?.placeholders?.[labelView]
    const value = getNestedValue(row, accessor) ?? row[accessor]

    const showHijri = column?.showHijri || true
    const showTime = column?.showTime || false

    let displayValue = value
    let subValue: string | null = null
    let timeString = ''
    if (type === 'date' && value) {
      const dateObj = new Date(value)
      const gregorianDate = dayjs(dateObj).format('YYYY-MM-DD')
      timeString = dayjs(dateObj).format('HH:mm')

      // Always show Gregorian date
      displayValue = gregorianDate

      // Decide what to show below date
      if (column.showHijri) {
        subValue = getFormattedHijriDate(gregorianDate) + ' هـ'
      }
    }

    if (type === 'progress') {
      displayValue = (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1, minWidth: 100 }}>
          <Box sx={{ flexGrow: 1 }}>
            <LinearProgress
              variant='determinate'
              value={Number(value) || 0}
              sx={{ height: 6, borderRadius: 5, '& .MuiLinearProgress-bar': { borderRadius: 5 } }}
            />
          </Box>
          <Typography variant='caption'>{Math.round(Number(value) || 0)}%</Typography>
        </Box>
      )
    }

    return (
      <Typography
        component={'div'}
        className='flex justify-start items-center gap-3 mt-4 mb-1.5'
        sx={{
          padding: '4px 0',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography
          variant='subtitle1'
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '0.7rem',
            minWidth: '100px'
          }}
        >
          {label}
        </Typography>

        <div className='flex justify-center flex-1 flex-col items-start'>
          <Typography
            variant='subtitle2'
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '0.6rem',
              textAlign: 'start'
            }}
          >
            {identifier ? (
              <span
                className='text-blue-500 underline cursor-pointer'
                style={{
                  fontSize: column?.fontSize || 13,
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  maxWidth: 200
                }}
                onClick={e => {
                  e.stopPropagation()
                  const routingId = column?.fetchKey
                    ? row.original?.[column.fetchKey] || row?.[column.fetchKey]
                    : value || row.original?.id || row?.id
                  onRowOptionClick?.('show', routingId, column?.routerUrl)
                }}
              >
                {displayValue}
              </span>
            ) : (
              <>{displayValue}</>
            )}
          </Typography>

          {/* ✅ Show Hijri or Time below */}
          {column.showTime ? (
            <>
              <Typography
                variant='caption'
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.55rem',
                  mt: 0.5,
                  fontStyle: 'italic'
                }}
              >
                {timeString}
              </Typography>
              {subValue && (
                <Typography
                  variant='caption'
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.55rem',
                    mt: 0.5,
                    fontStyle: 'italic'
                  }}
                >
                  {subValue}
                </Typography>
              )}
            </>
          ) : (
            <>
              {subValue && (
                <Typography
                  variant='caption'
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.55rem',
                    mt: 0.5,
                    fontStyle: 'italic'
                  }}
                >
                  {subValue}
                </Typography>
              )}
            </>
          )}
        </div>
      </Typography>
    )
  }

  // Helper to get value (handles nested accessorKeys)
  const getCellValue = (row: any, getValue: any) => {
    if (column.accessorKey?.includes('.')) return getNestedValue(row.original, column.accessorKey)
    return getValue()
  }

  // Identify cell type
  const getCellType = () => {
    if (column.type === 'barcode') return 'barcode'
    if (column.type === 'selectIcon') return 'selectIcon'
    if (column.accessorKey === 'id' || column.isIdentifier) return 'identifier'
    if (column.type === 'personalPicture') return 'personalPicture'
    if (column.type === 'date') return 'date'
    if (column.type === 'time') return 'time'
    if (column.type === 'badge' || column.displayWithBadge || column.list) return 'badge'
    if (column.isRef && column.component) return 'reference'
    if (column.type === 'iconBadge') return 'iconBadge'
    if (column.combine) return 'combine'
    if (column.cell) return 'custom'
    if (column.type === 'amount') return 'amount'
    if (column.type === 'select') return 'select'
    if (column.type === 'progress') return 'progress'
    if (column.type === 'dateTime') return 'dateTime'

    return 'default'
  }

  const cellType = getCellType()

  // Cell rendering
  switch (cellType) {
    case 'identifier':
      return ({ row, getValue }: any) => {
        const value = getCellValue(row, getValue)
        if (mode === 'card') return renderCardField(row, column.accessorKey, true, column.header)
        return (
          <div className={`flex w-full ${getAlignment()}`}>
            <span
              className='text-blue-500 underline cursor-pointer'
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: 200, fontSize: '12px' }}
              onClick={e => {
                e.stopPropagation()
                const routingId = column.fetchKey
                  ? row.original?.[column.fetchKey] || row?.[column.fetchKey]
                  : value || row.original?.id || row?.id
                onRowOptionClick?.('show', routingId, column.routerUrl)
              }}
            >
              {value}
            </span>
          </div>
        )
      }

    case 'iconBadge':
      return ({ row, getValue }: any) => {
        const rawValue = getCellValue(row, getValue)
        const isDark = theme?.palette?.mode === 'dark'

        const defaultOptions = [
          { value: '1', label: 'approved', icon: 'ri-check-line', color: 'success' },
          { value: '0', label: 'rejected', icon: 'ri-close-line', color: 'error' },
          { value: '2', label: 'rejected', icon: 'ri-close-line', color: 'error' }
        ]

        const options = column.badgeOptions?.length ? column.badgeOptions : defaultOptions
        const isValuePresent = rawValue != null && rawValue !== ''

        let matched = options.find((opt: any) => String(opt.value) === String(rawValue))

        if (!matched) {
          if (isValuePresent) {
            matched = options.find((opt: any) => opt.value === 'not null') || options[0]
          } else {
            matched =
              options.find((opt: any) => opt.value === 'null') ||
              (rawValue === null ? options.find((opt: any) => opt.value === null) : null) ||
              defaultOptions[1]
          }
        }

        if (!matched)
          return <div style={{ textAlign: 'center', color: isDark ? '#475569' : '#94a3b8', fontSize: 12 }}>—</div>

        const colorMap: Record<
          string,
          {
            bgLight: string
            bgDark: string
            borderLight: string
            borderDark: string
            iconLight: string
            iconDark: string
          }
        > = {
          success: {
            bgLight: 'rgba(34,197,94,0.10)',
            bgDark: 'rgba(34,197,94,0.18)',
            borderLight: 'rgba(34,197,94,0.35)',
            borderDark: 'rgba(34,197,94,0.55)',
            iconLight: '#16a34a',
            iconDark: '#4ade80'
          },
          error: {
            bgLight: 'rgba(239,68,68,0.10)',
            bgDark: 'rgba(239,68,68,0.18)',
            borderLight: 'rgba(239,68,68,0.35)',
            borderDark: 'rgba(239,68,68,0.55)',
            iconLight: '#dc2626',
            iconDark: '#f87171'
          },
          warning: {
            bgLight: 'rgba(234,179,8,0.10)',
            bgDark: 'rgba(234,179,8,0.18)',
            borderLight: 'rgba(234,179,8,0.35)',
            borderDark: 'rgba(234,179,8,0.55)',
            iconLight: '#ca8a04',
            iconDark: '#facc15'
          },
          info: {
            bgLight: 'rgba(59,130,246,0.10)',
            bgDark: 'rgba(59,130,246,0.18)',
            borderLight: 'rgba(59,130,246,0.35)',
            borderDark: 'rgba(59,130,246,0.55)',
            iconLight: '#2563eb',
            iconDark: '#60a5fa'
          },
          default: {
            bgLight: 'rgba(148,163,184,0.12)',
            bgDark: 'rgba(148,163,184,0.20)',
            borderLight: 'rgba(148,163,184,0.35)',
            borderDark: 'rgba(148,163,184,0.50)',
            iconLight: '#64748b',
            iconDark: '#94a3b8'
          }
        }

        const palette = colorMap[matched.color] ?? colorMap['default']

        const bg = isDark ? palette.bgDark : palette.bgLight
        const border = isDark ? palette.borderDark : palette.borderLight
        const icon = isDark ? palette.iconDark : palette.iconLight

        const iconName = typeof matched.icon === 'string' ? matched.icon : null

        const getTooltipTitle = () => {
          if (column.tooltip) {
            let tooltipVal = typeof column.tooltip === 'object' ? column.tooltip[rawValue] : column.tooltip

            if (tooltipVal === undefined && typeof column.tooltip === 'object') {
              tooltipVal = isValuePresent ? column.tooltip['not null'] : column.tooltip['null']
            }

            if (tooltipVal) return dictionary?.[tooltipVal] || dictionary?.messages?.status?.[tooltipVal] || tooltipVal
          }

          if (matched.tooltip)
            return dictionary?.[matched.tooltip] || dictionary?.messages?.status?.[matched.tooltip] || matched.tooltip

          return (
            dictionary?.messages?.status?.[matched.label] ||
            dictionary?.status?.[matched.label] ||
            dictionary?.[matched.label] ||
            matched.label ||
            ''
          )
        }

        return (
          <div className={`flex w-full ${getAlignment()}`}>
            <Tooltip title={getTooltipTitle()} arrow placement='top'>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: bg,
                  border: `1.5px solid ${border}`,
                  color: icon,
                  fontSize: '0.85rem',
                  lineHeight: 1,
                  boxShadow: `0 1px 4px ${border}`,
                  cursor: 'default',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: `0 2px 8px ${border}`
                  }
                }}
              >
                {iconName ? <i className={iconName} style={{ fontSize: '0.8rem' }} /> : matched.icon}
              </Box>
            </Tooltip>
          </div>
        )
      }

    case 'personalPicture':
      return ({ row, getValue }: any) => {
        const value = getCellValue(row, getValue)
        return (
          <div className={classNames(mode === 'table' ? 'text-center' : '', 'system-view')}>
            {getAvatar({ avatar: value })}
          </div>
        )
      }

    case 'time':
      return ({ row, getValue }: any) => {
        const rawValue = getCellValue(row, getValue)

        if (!rawValue) return ''

        const formattedTime = typeof rawValue === 'string' ? rawValue.slice(0, 5) : format(new Date(rawValue), 'HH:mm')

        if (mode === 'card') {
          return renderCardField(row, column.accessorKey)
        }

        return (
          <div className={column.align || 'text-start'} style={{ fontSize: column.fontSize || 13 }}>
            {formattedTime}
          </div>
        )
      }

    case 'dateTime':
      return ({ row, getValue }: any) => {
        const dateValue = getCellValue(row, getValue)
        if (!dateValue) return <div className='text-xs text-center'>-</div>

        const formattedDateTime = dayjs(dateValue).format('YYYY-MM-DD HH:mm')

        if (mode === 'card') {
          return renderCardField(row, column.accessorKey, false, column.header, 'date')
        }

        return (
          <div className={column.align || 'text-center'} style={{ fontSize: column.fontSize || 13 }}>
            <span className='font-medium'>{formattedDateTime}</span>
          </div>
        )
      }

    case 'date':
      return ({ row, getValue }: any) => {
        const showHijri = column?.showHijri ?? true
        const showTime = column?.showTime ?? false

        // ✅ CARD MODE with Hijri
        if (mode === 'card') {
          return renderCardField(row, column.accessorKey, false, column.header, cellType)
        }

        // ===== COMBINE DATES with Hijri =====
        if (column.combine?.length) {
          const combinedDates = column.combine.map((key: string) => {
            const rawValue = key.includes('.') ? getNestedValue(row.original, key) : row.original[key]
            if (!rawValue) return null

            const gregorianDate = format(new Date(rawValue), 'yyyy-MM-dd')
            const hijriDate = getFormattedHijriDate(gregorianDate)
            const timeString = dayjs(rawValue).format('HH:mm')

            return (
              <div key={key} className='inline-flex flex-col items-center mx-1'>
                <span className='text-[13px] text-center'>{gregorianDate}</span> Custom font size using Tailwind
                {showTime ? (
                  <>
                    <span className='text-xs text-gray-500 italic' style={{ fontSize: '0.65rem' }}>
                      {timeString}
                    </span>

                    {showHijri
                      ? hijriDate && <span className='text-xs text-gray-500 italic'>{hijriDate} هـ</span>
                      : null}
                  </>
                ) : (
                  <>
                    {showHijri
                      ? hijriDate && <span className='text-xs text-gray-500 italic'>{hijriDate} هـ</span>
                      : null}
                  </>
                )}
              </div>
            )
          })

          return (
            <div className='flex justify-center items-center gap-2' >
              {combinedDates.reduce((prev: any, curr: any, idx: number) => {
                if (!curr) return prev
                return prev === null
                  ? [curr]
                  : [
                    ...prev,
                    <span key={`sep-${idx}`} className='text-gray-400'>
                      -
                    </span>,
                    curr
                  ]
              }, null)}
            </div>
          )
        }

        // ===== SINGLE DATE with Hijri =====
        const dateValue = getCellValue(row, getValue)
        if (!dateValue) return <div className='text-xs text-center'>-</div>

        const formattedDate = format(new Date(dateValue), 'yyyy-MM-dd')
        const hijriDate = getFormattedHijriDate(formattedDate)
        const timeString = dayjs(dateValue).format('HH:mm')

        return (
          <div className='flex flex-col items-center text-center'>
            <span className='text-xs font-medium '>{formattedDate}</span>
            {showTime ? (
              <>
                <span className='text-xs text-gray-500 italic' style={{ fontSize: '0.65rem' }}>
                  {timeString}
                </span>

                {showHijri
                  ? hijriDate && (
                    <span className='text-xs text-gray-500 italic' style={{ fontSize: '0.65rem' }}>
                      {hijriDate} هـ
                    </span>
                  )
                  : null}
              </>
            ) : (
              <>
                {showHijri
                  ? hijriDate && (
                    <span className='text-xs text-gray-500 italic' style={{ fontSize: '0.65rem' }}>
                      {hijriDate} هـ
                    </span>
                  )
                  : null}
              </>
            )}
          </div>
        )
      }

    case 'selectIcon':
      return ({ row, getValue }: any) => {
        const rawValue = getCellValue(row, getValue)
        const list = column.list || column.badgeOptions || []
        const option = getItemFromStaticListByValue(rawValue, list)

        if (!option) return <div className='text-start'>—</div>

        const tooltipTitle =
          dictionary?.placeholders?.[option.value === '1' ? 'male' : 'female'] ||
          dictionary?.[option.label] ||
          dictionary?.placeholders?.[option.label] ||
          option.label

        return (
          <div className={`flex w-full ${getAlignment()}`}>
            <Tooltip title={tooltipTitle} arrow placement='top'>
              <i
                className={`${option.icon} text-xl`}
                style={{ color: option.color ? `var(--mui-palette-${option.color}-main)` : 'inherit' }}
              />
            </Tooltip>
          </div>
        )
      }

    case 'select':
      return ({ row, getValue }: any) => {
        const rawValue = getCellValue(row, getValue)
        const status = column.list ? getItemFromStaticListByValue(rawValue, column.list) : null
        let label;
        let color
        if (status) {
          label = status?.label || rawValue
          color = status?.color || column.badgeColor || 'primary'
        } else {
          label = rawValue || ''
          color = 'primary'
        }
        if (column.cell) {
          label = column.cell({ row, getValue })
        }

        if (column.type === 'amount') {
          label = formatNumber(label ?? rawValue, column.decimals ?? 0, { locale: column.locale ?? 'ar-SA' })
        }

        if (mode === 'card')
          return (
            <Typography
              component={'div'}
              className='flex justify-between items-center mt-4 mb-1.5'
              sx={{
                padding: '4px 0',
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  minWidth: '100px'
                }}
              >
                {dictionary?.placeholders?.[column.header]}
              </Typography>
              <div className='flex justify-center flex-1 flex-col items-center'>
                <Typography
                  variant='subtitle2'
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.6rem',
                    textAlign: 'center'
                  }}
                >
                  {/* <Chip
                    variant='tonal'
                    label={label}
                    size='small'
                    color={color as any}
                    sx={{ borderRadius: column.rounded || '50rem', height: 24, fontSize: '0.75rem' }}
                  /> */}
                  {label}
                </Typography>
              </div>
            </Typography>
          )

        return (
          <div className='text-start'>
            {/* <Chip
              variant='tonal'
              label={label}
              size='small'
              color={color as any}
              sx={{ borderRadius: column.rounded || '50rem', height: 24, fontSize: '0.75rem' }}
            /> */}

            {label}
          </div>
        )
      }

    case 'badge':
      return ({ row, getValue }: any) => {
        const rawValue = getCellValue(row, getValue)
        let label;
        let color;
        let status;
        if (!column.list) {
          label = rawValue || ''
          color = column.badgeColor || 'primary'
        } else {
          status = column.list ? getItemFromStaticListByValue(rawValue, column.list) : null
          label = status?.label || rawValue
          color = status ? (status.color || column.badgeColor || 'primary') : 'primary'
        }

        if (column.cell) {
          label = column.cell({ row, getValue })
        }

        if (column.type === 'amount') {
          label = formatNumber(label ?? rawValue, column.decimals ?? 0, {
            locale: 'en-SA',
            useCurrency: column.showCurrency
          })
        }

        if (mode === 'card')
          return (
            <Typography
              component={'div'}
              className='flex justify-between items-center mt-4 mb-1.5'
              sx={{
                padding: '4px 0',
                borderBottom: theme => `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  minWidth: '100px'
                }}
              >
                {dictionary?.placeholders?.[column.header]}
              </Typography>
              <div className='flex justify-center flex-1 flex-col items-center'>
                <Typography
                  variant='subtitle2'
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.6rem',
                    textAlign: 'center'
                  }}
                >
                  <Chip
                    variant='tonal'
                    label={label}
                    size='small'
                    color={color as any}
                    sx={{ borderRadius: column.rounded || '50rem', height: 24, fontSize: '0.75rem' }}
                  />
                </Typography>
              </div>
            </Typography>
          )

        if (column.type == 'badge') {
          return (
            <div className={column.align || 'text-start'}>
              <Chip
                variant='tonal'
                label={label}
                size='small'
                color={color as any}
                sx={{ borderRadius: column.rounded || '50rem', height: 24, fontSize: '0.75rem' }}
              />
            </div>
          )
        } else {
          return (
            <div className={column.align || 'text-start'} style={{ fontSize: '0.75rem' }}>
              {label}
            </div>
          )
        }
      }

    case 'reference':
      return ({ row, getValue }: any) => {
        const value = getCellValue(row, getValue)
        if (mode === 'card') return renderCardField(row, column.accessorKey)
        return (
          <div className='text-start'>
            <span
              className='text-blue-500 underline cursor-pointer'
              style={{ fontSize: column.fontSize || 13, whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: 200 }}
              onClick={e => {
                e.stopPropagation()
                openDialog?.(column.component, value)
              }}
            >
              {value}
            </span>
          </div>
        )
      }

    case 'progress':
      return ({ row, getValue }: any) => {
        const value = getCellValue(row, getValue)
        const progress = Number(value) || 0

        if (mode === 'card') return renderCardField(row, column.accessorKey, false, column.header, cellType)

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2, px: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant='determinate'
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 5,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5
                  }
                }}
              />
            </Box>
            <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, minWidth: '30px' }}>
              {Math.round(progress)}%
            </Typography>
          </Box>
        )
      }

    case 'amount':
      return ({ row, getValue }: any) => {
        const rawValue = getCellValue(row, getValue)

        const formattedValue = formatNumber(rawValue, column.decimals ?? 0, {
          locale: 'en-SA',
          useCurrency: column.showCurrency
        })

        if (mode === 'card') {
          return renderCardField(row, column.accessorKey)
        }

        return (
          <div className={column.align || 'text-start'} style={{ fontSize: column.fontSize || 13 }}>
            {formattedValue}
          </div>
        )
      }

    case 'barcode':
      return ({ row, getValue }: any) => {
        const { mode: muiMode, systemMode } = useColorScheme()
        const isDark = muiMode === 'system' ? systemMode === 'dark' : muiMode === 'dark'

        const value = getCellValue(row, getValue)
        if (!value) return ''

        if (mode === 'card') return renderCardField(row, column.accessorKey)

        return (
          <div className={`flex flex-col items-center w-full ${getAlignment()}`}>
            <div
              className='cursor-pointer'
              onClick={e => {
                e.stopPropagation()
                const routingId = column.fetchKey
                  ? row.original?.[column.fetchKey] || row?.[column.fetchKey]
                  : value || row.original?.id || row?.id
                onRowOptionClick?.('show', routingId, column.routerUrl)
              }}
            >
              <Barcode
                value={String(value)}
                width={1}
                height={35}
                fontSize={10}
                background='transparent'
                displayValue={true}
              />
            </div>
          </div>
        )
      }

    case 'combine':
      return ({ row }: any) => {
        const getNestedValue = (obj: any, path: string) => {
          return path.split('.').reduce((acc, key) => acc?.[key], obj)
        }

        const value = column?.combine
          ?.map((key: string) => {
            const v = key.includes('.') ? getNestedValue(row.original, key) : row.original?.[key]

            return v ?? '' // handle null/undefined
          })
          ?.filter(Boolean) // remove empty values
          ?.join(' - ')

        if (!value) return null

        if (mode === 'card') {
          return <div className='mb-1 text-center'>{value}</div>
        }

        return (
          <div
            className={column.align || 'text-center'}
            style={{
              fontSize: column.fontSize || 13,
              whiteSpace: 'pre-wrap'
            }}
          >
            {value}
          </div>
        )
      }
    case 'custom':
      return column.cell

    case 'default':
    default:
      return ({ row, getValue }: any) => {
        const value = getCellValue(row, getValue)

        if (mode === 'card') return renderCardField(row, column.accessorKey, false, column.header)

        const truncateLimit = column.truncate ?? 70
        const isLongString = typeof value === 'string' && value.length > truncateLimit
        const truncated = isLongString ? value.slice(0, truncateLimit) + '...' : value

        // ✅ إذا الـ accessorKey فيه نقطة (nested) وما في primaryKey، اعرض الـ id
        const isNested = column.accessorKey?.includes('.')
        const primaryKey = column.primaryKey
        const showPrimaryKey = column.showPrimaryKey // 👈 new override
        const showPrimary = column?.showPrimary ?? true
        const getNestedObject = (obj: any, path: string) => {
          return path.split('.').reduce((acc, key) => acc?.[key], obj)
        }
        const nestedId =
          isNested && showPrimary
            ? (() => {
              const fullObj = getNestedObject(row.original, column.accessorKey.replace(/\.[^.]+$/, ''))
              // removes last key (name_ar) → gets requester object

              if (!fullObj) return null

              if (showPrimaryKey) {
                return fullObj?.[showPrimaryKey] ?? row.original?.[showPrimaryKey] ?? null
              }

              if (primaryKey) {
                return row.original?.[primaryKey] ?? null
              }

              return fullObj?.id ?? null
            })()
            : null
        // ✅ دالة تحول align class لـ justifyContent
        const getJustifyContent = (align: string) => {
          switch (align) {
            case 'text-start':
              return 'flex-start'
            case 'text-end':
              return 'flex-end'
            case 'text-center':
              return 'center'
            case 'text-right':
              return 'flex-start'
            case 'text-left':
              return 'flex-end'
          }
        }

        return (
          <div
            style={{
              fontSize: column.fontSize || 13,
              whiteSpace: column.whiteSpace || (typeof value === 'string' ? 'normal' : undefined),
              wordWrap: 'break-word',
              lineHeight: '1.4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: getJustifyContent(column.align),
              textAlign: column.align ? (column.align.replace('text-', '') as any) : 'inherit',
              gap: 6
            }}
          >
            {column.icon && <i className={`ri ${column.icon.name} mx-1`} style={{ background: column.icon.color }} />}

            {nestedId && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--mui-palette-action-selected)',
                  color: 'var(--mui-palette-text-primary)',
                  fontSize: '0.65em',
                  padding: '1px 6px',
                  borderRadius: '20px',
                  border: '1px solid var(--mui-palette-divider)',
                  lineHeight: 1.6,
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap'
                }}
              >
                {nestedId}
              </span>
            )}
            <span>{truncated}</span>
          </div>
        )
      }
  }
}
