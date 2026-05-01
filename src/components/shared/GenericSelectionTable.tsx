'use client'

import React from 'react'
import * as Shared from '@/shared'
import axios from 'axios'

/* ================= CACHE ================= */
const apiCache = new Map<string, any[]>()

/* ================= TYPES ================= */
export interface ColumnConfig {
  key: string
  label: string
  type?: 'text' | 'chip' | 'date' | 'amount' | 'input' | 'rendered' | 'select' | 'badge'
  render?: (row: any, index: number) => React.ReactNode

  // ✅ static
  options?: any[]
  list?: any[]
  displayProps?: string[]
  // ✅ API
  apiUrl?: string | ((row: any) => string)
  apiMethod?: 'GET' | 'POST'
  queryParams?: any
  responseDataKey?: string
  searchInBackend?: boolean
  skipDataSuffix?: boolean

  keyProp?: string
  labelProp?: string

  width?: number | string
  align?: 'start' | 'center' | 'end'  
  fontWeight?: string | number
  color?: string
  visible?: boolean
  onClickRow?: boolean
  subKey?: string
  placeholder?: string
  disableField?: (row: any) => boolean
  required?: boolean
  error?: (row: any) => boolean
  errorMessage?: string | ((row: any) => string)
  fieldSx?: any
  viewProp?: any
  onChange?: (value: any, object?: any) => any
}

interface GenericSelectionTableProps {
  data: any[]
  columns: ColumnConfig[]
  onToggleAll: (checked: boolean) => void
  onToggleRow: (index: number, checked: boolean) => void
  onUpdateRow?: (index: number, data: any) => void
  onSave?: () => void
  dictionary?: any
  locale?: string
  mode: Shared.Mode
  title?: string
  idKey?: string
  emptyConfig?: {
    title?: string
    message?: string
    icon?: string
    condition?: boolean
  }
  hideCheckbox?: boolean
  headerIcon?: string
  iconColor?: string
}

/* ================= COMPONENT ================= */
const GenericSelectionTable = ({
  data,
  columns,
  onToggleAll,
  onToggleRow,
  onUpdateRow,
  dictionary,
  mode,
  title,
  idKey = 'id',
  emptyConfig,
  hideCheckbox = false,
  headerIcon,
  iconColor
}: GenericSelectionTableProps) => {
  // if (mode !== 'add') return null

  const [apiDataMap, setApiDataMap] = React.useState<Record<string, any[]>>({})

  const allSelected = data.length > 0 && data.every(row => row.selected)
  const someSelected = data.some(row => row.selected) && !allSelected

  const visibleColumns = columns.filter(col => col.visible !== false)

  /* ================= LOAD API DATA ================= */
  React.useEffect(() => {
    const load = async () => {
      const newMap: Record<string, any[]> = {}

      for (const col of columns) {
        if (!col.apiUrl || typeof col.apiUrl === 'function') continue

        const cacheKey = col.apiUrl + JSON.stringify(col.queryParams || {})

        // ✅ cache hit
        if (apiCache.has(cacheKey)) {
          newMap[col.key] = apiCache.get(cacheKey)!
          continue
        }

        try {
          const finalUrl = col.skipDataSuffix ? col.apiUrl : `${col.apiUrl}/data`
          const res =
            col.apiMethod === 'GET'
              ? await axios.get(col.apiUrl as string, { params: col.queryParams })
              : await axios.post(finalUrl as string, col.queryParams)

          const result = col.responseDataKey ? res.data[col.responseDataKey] : res.data

          apiCache.set(cacheKey, result)
          newMap[col.key] = result
        } catch (err) {
          console.error('API select error:', err)
        }
      }

      setApiDataMap(newMap)
    }

    load()
  }, [columns])

  /* ================= RESOLVE SELECT ================= */
  const resolveSelectLabel = (value: any, col: ColumnConfig) => {
    if (!value) return value

    // handle object { value, label }
    if (typeof value === 'object' && 'value' in value) {
      value = value.value
    }

    const list = col.apiUrl ? apiDataMap[col.key] : col.options

    if (!list || list.length === 0) return value

    const item = list.find((opt: any) => String(opt[col.keyProp || 'value']) === String(value))

    if (!item) return value

    /* ================= displayProps logic ================= */
    if (col.displayProps && col.displayProps.length > 0) {
      const values = col.displayProps.map(prop => item[prop]).filter(v => v !== null && v !== undefined && v !== '')

      if (values.length > 0) {
        return values.join(' - ')
      }
    }

    // fallback to labelProp
    return item[col.labelProp || 'label'] ?? value
  }

  /* ================= CELL RENDER ================= */
  const renderCellContent = (row: any, index: number, col: ColumnConfig) => {
    if (col.render) return col.render(row, index)

    const value = row[col.key]

    switch (col.type) {
      case 'chip':
        return <Shared.Chip label={value} size='small' variant='tonal' color={(col.color as any) || 'primary'} />

      case 'select': {
        const isError = col.error ? col.error(row) : col.required && row.selected && !value

        const resolvedApiUrl = typeof col.apiUrl === 'function' ? col.apiUrl(row) : col.apiUrl

        const resolvedLabel =
          dictionary?.placeholders?.[col.placeholder || ''] ||
          dictionary?.[col.placeholder || ''] ||
          dictionary?.placeholders?.[col.label || ''] ||
          dictionary?.titles?.[col.label || ''] ||
          dictionary?.[col.label || ''] ||
          col.placeholder ||
          col.label ||
          ''

        return (
          <Shared.ListOfValue
            field={{
              name: col.key,
              label: resolvedLabel,
              type: 'select',
              options: col.options || [],
              apiUrl: resolvedApiUrl,
              apiMethod: col.apiMethod || 'GET',
              labelProp: col.labelProp || 'label',
              keyProp: col.keyProp || 'value',
              searchInBackend: col.searchInBackend,
              displayProps: col.displayProps,
              responseDataKey: col.responseDataKey,
              queryParams: col.queryParams,
              skipDataSuffix: col.skipDataSuffix
            }}
            row={row || {}}
            rowIndex={index}
            apiUrl={resolvedApiUrl || ''}
            errors={{}}
            disabled={mode === 'show' || (col.disableField ? col.disableField(row) : false)}
            handleInputChange={(_idx, name, value, object) => {
              if (onUpdateRow) {
                const updateData = { [col.key]: value }
                if (col.onChange) {
                  Object.assign(updateData, col.onChange(value, object))
                }
                onUpdateRow(index, updateData)
              }
            }}
          />
        )
      }

      case 'amount': {
        const formattedNumber = Shared.formatNumber(value, 0, { locale: 'en-SA' })
        if (mode === 'show') {
          return (
            <Shared.Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Shared.Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.8rem' }}>
                {dictionary?.placeholders?.[col.label] || dictionary?.[col.label] || col.label}
              </Shared.Typography>
            <Shared.Typography variant='body1' sx={{ color: '#666', fontWeight: 600 }}>
              {formattedNumber}
            </Shared.Typography>
            </Shared.Box>
          )
        }

        return (
          <Shared.Typography variant='body2' color='primary.main'>
            {formattedNumber}
          </Shared.Typography>
        )
      }

      case 'date':
        if (mode === 'show') {
          return (
            <Shared.Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Shared.Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.8rem' }}>
                {dictionary?.placeholders?.[col.label] || dictionary?.[col.label] || col.label}
              </Shared.Typography>
              <Shared.Typography variant='body1' sx={{ color: '#666', fontWeight: 500 }}>
                {value ?? '-'}
              </Shared.Typography>
            </Shared.Box>
          )
        }
        return <Shared.Typography variant='body2'>{value}</Shared.Typography>

      case 'input': {
        const isError = col.error ? col.error(row) : col.required && row.selected && !value

        const mappedAlign =
          col.align === 'start' ? 'left' : col.align === 'end' ? 'right' : col.align || 'left'

        return (
          <Shared.TextField
            fullWidth
            size='small'
            label={
              dictionary?.placeholders?.[col.placeholder || ''] ||
              dictionary?.[col.placeholder || ''] ||
              dictionary?.placeholders?.[col.label || ''] ||
              dictionary?.titles?.[col.label || ''] ||
              dictionary?.[col.label || ''] ||
              col.placeholder ||
              col.label ||
              ''
            }
            value={value || ''}
            error={isError}
            helperText={
              isError
                ? typeof col.errorMessage === 'function'
                  ? col.errorMessage(row)
                  : col.errorMessage || dictionary?.messages?.required_field || 'مطلوب'
                : ''
            }
            disabled={mode === 'show' || (col.disableField ? col.disableField(row) : false)}
            onChange={e => {
              if (onUpdateRow) onUpdateRow(index, { [col.key]: e.target.value })
            }}
            onClick={e => e.stopPropagation()}
            sx={{ minWidth: 150, width: '100%', ...(col.fieldSx || {}) }}
          />
        )
      }

      case 'badge': {
        const option = Shared.getItemFromStaticListByValue(value, col.list || [])

        return (
          <Shared.Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
            <Shared.Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
              {dictionary?.placeholders?.[col.label]}
            </Shared.Typography>
            <Shared.Box>
              <Shared.Chip
                label={option?.label || '-'}
                size='small'
                variant='tonal'
                color={(option?.color as any) || (col.color as any) || 'primary'}
                sx={{ minWidth: 60 }}
              />
            </Shared.Box>
          </Shared.Box>

          // <Shared.Chip

          //   label={option?.label || '-'}
          //   size='small'
          //   variant='tonal'
          //   color={(option?.color as any) || (col.color as any) || 'primary'}
          //   sx={{ minWidth: 60 }}
          // />
        )
      }

      case 'text':
      default: {
        let displayValue = value
        if (mode === 'show') {
          displayValue = col.viewProp ? Shared.resolvePath(row, col.viewProp) : value
          return (
            <Shared.Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Shared.Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.8rem' }}>
                {dictionary?.placeholders?.[col.label] || dictionary?.[col.label] || col.label}
              </Shared.Typography>
            <Shared.Typography variant='body1' sx={{ color: '#666', fontWeight: 500, whiteSpace: 'nowrap'  }}>
              {displayValue ?? '-'}
            </Shared.Typography>
            </Shared.Box>
          )
        }

        return (
          <Shared.Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Shared.Typography variant={'body2'} sx={{ color: 'inherit' }}>
              {displayValue}
            </Shared.Typography>
            {col.subKey && (
              <Shared.Typography variant='caption' color='text.secondary'>
                {row[col.subKey]}
              </Shared.Typography>
            )}
          </Shared.Box>
        )
      }
    }
  }

  /* ================= UI ================= */
  return (
    <Shared.Box sx={{ mt: 4 }}>
      <Shared.Card sx={{ overflow: 'hidden' }}>
        <Shared.Box sx={{ p: 5, pb: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Shared.CustomAvatar skin='light' color={(iconColor as any) || 'primary'} size={30}>
            <i className={headerIcon || 'ri-list-check-2'} style={{ fontSize: '1.25rem' }} />
          </Shared.CustomAvatar>
          <Shared.Typography variant={mode === 'show' ? 'h5' : 'h6'}>
            {dictionary?.titles?.[title || ''] || dictionary?.[title || ''] || title || 'القائمة'}
          </Shared.Typography>
        </Shared.Box>

        <Shared.TableContainer>
          <Shared.Table stickyHeader>
            {mode !== 'show' && (
            <Shared.TableHead>
                <Shared.TableRow sx={{ bgcolor: 'action.hover' }}>
                  {!hideCheckbox && (
                    <Shared.TableCell padding='checkbox' sx={{ width: 50 }}>
                      <Shared.Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={e => onToggleAll(e.target.checked)}
                      />
                    </Shared.TableCell>
                  )}

                  {visibleColumns.map((col, idx) => {
                    const mappedAlign =
                      col.align === 'start' ? 'left' : col.align === 'end' ? 'right' : col.align || 'left'

                    return (
                      <Shared.TableCell
                        key={idx}
                        sx={{
                          width: col.width || 'auto',
                          minWidth: col.width || 'auto',
                          p: 4
                        }}
                        align={mappedAlign as any}
                      >
                        {dictionary?.placeholders?.[col.label] ||
                          dictionary?.actions?.[col.label] ||
                          dictionary?.[col.label] ||
                          col.label}
                      </Shared.TableCell>
                    )
                  })}
                </Shared.TableRow>
              </Shared.TableHead>
            )}

            <Shared.TableBody>
              {data.length === 0 ? (
                <Shared.TableRow>
                  <Shared.TableCell
                    colSpan={visibleColumns.length + (hideCheckbox ? 0 : 1)}
                    align='center'
                    sx={{ py: 10 }}
                  >
                    <Shared.Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      {emptyConfig?.condition === false ? (
                        <>
                          <i
                            className={emptyConfig?.icon || 'tabler-info-circle'}
                            style={{ fontSize: '3rem', color: 'orange' }}
                          />
                          <Shared.Typography variant='h6' color='text.secondary'>
                            {emptyConfig?.message || 'يرجى اختيار المعايير أولاً'}
                          </Shared.Typography>
                        </>
                      ) : (
                        <>
                          <i className='tabler-database-off' style={{ fontSize: '3rem', color: 'gray' }} />
                          <Shared.Typography variant='h6' color='text.secondary'>
                            {dictionary?.messages?.there_is_no_records || 'لا يوجد سجلات'}
                          </Shared.Typography>
                        </>
                      )}
                    </Shared.Box>
                  </Shared.TableCell>
                </Shared.TableRow>
              ) : (
                data.map((row, index) => (
                  <Shared.TableRow
                    key={row[idKey] || index}
                    hover
                    selected={row.selected}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: 'action.hover'
                      },
                      '&.Mui-selected': {
                        backgroundColor: (theme: any) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05) !important'
                            : 'rgba(0, 0, 0, 0.04) !important'
                      }
                    }}
                  >
                    {!hideCheckbox && (
                      <Shared.TableCell padding='checkbox'>
                        <Shared.Checkbox
                          checked={row.selected || false}
                          onChange={e => onToggleRow(index, e.target.checked)}
                        />
                      </Shared.TableCell>
                    )}

                    {visibleColumns.map((col, idx) => {
                      const mappedAlign =
                        col.align === 'start' ? 'left' : col.align === 'end' ? 'right' : col.align || 'left'

                      return (
                        <Shared.TableCell
                          key={idx}
                          align={mappedAlign as any}
                          onClick={() => col.onClickRow !== false && onToggleRow(index, !row.selected)}
                          sx={{
                            cursor: col.onClickRow !== false ? 'pointer' : 'default',
                            p: 3,
                            ps: 6,
                            width: col.width || 'auto',
                            minWidth: col.width || 'auto'
                          }}
                        >
                          {renderCellContent(row, index, col)}
                        </Shared.TableCell>
                      )
                    })}
                  </Shared.TableRow>
                ))
              )}
            </Shared.TableBody>
          </Shared.Table>
        </Shared.TableContainer>
      </Shared.Card>
    </Shared.Box>
  )
}

export default GenericSelectionTable
