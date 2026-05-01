'use client'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Card, Typography, Box, Radio, Checkbox, IconButton, Tooltip, usePrintMode } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import type { Locale } from '@/configs/i18n'
import { DialogDetailsFormModal } from './DialogDetailsFormModal'
import type { DynamicFormTableFieldProps } from '@/shared'

// ===== TYPES =====
export type RatingType = 'radio' | 'checkbox'

export type RatingOption = {
  value: string | number
  label: string
  color?: string
  icon?: string
  [key: string]: any
  id?: any
}

export type GroupItem = {
  id: string | number
  name: string
  description?: string
  [key: string]: any
}

export type RatingGroup = {
  id: string | number
  name: string
  description?: string
  items: GroupItem[]
  [key: string]: any
}

export interface DynamicGroupedRatingTableProps {
  groups: RatingGroup[]
  ratingColumns: RatingOption[]
  ratingType?: RatingType
  title?: string
  dictionary?: any
  mode?: 'show' | 'edit' | 'add'
  detailsKey: string
  itemIdKey?: string
  itemIdKeyProp?: string // ✅ NEW: Property name in item object to use as ID
  ratingKey?: string
  ratingValueKey?: string
  initialData?: any[]
  onDataChange?: (data: any[]) => void
  dynamicFields?: DynamicFormTableFieldProps[]
  extraColumns?: Array<{
    key: string
    label: string
    width?: string
    render?: (item: GroupItem, group: RatingGroup) => React.ReactNode
  }>
  enableGroupRating?: boolean
  enableColors?: boolean
  locale?: string
  accessToken?: string
  showInfoIcon?: boolean | ((item: GroupItem, group: RatingGroup, rowData: any) => boolean)
  modalTitle?: string
  dataObject: any
}

export const DynamicGroupedRatingTable: React.FC<DynamicGroupedRatingTableProps> = ({
  groups = [],
  ratingColumns = [],
  ratingType = 'radio',
  title,
  dictionary: propDictionary,
  mode = 'edit',
  detailsKey,
  itemIdKey = 'id',
  itemIdKeyProp = 'id', // ✅ NEW: Default to 'id'
  ratingKey = 'rating',
  ratingValueKey = 'value',
  initialData = [],
  onDataChange,
  dynamicFields = [],
  extraColumns = [],
  enableGroupRating = true,
  enableColors = true,
  locale = 'ar',
  accessToken,
  showInfoIcon = true,
  modalTitle,
  dataObject
}) => {
  // ===== STATE =====
  const [dictionary, setDictionary] = useState<any>(propDictionary)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<RatingGroup | null>(null)
  const [selectedItem, setSelectedItem] = useState<GroupItem | null>(null)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0)
  const [expandedGroups, setExpandedGroups] = useState<Set<string | number>>(new Set())
  const [rowsData, setRowsData] = useState<any[]>([])

  ///
  const { isPrintMode } = usePrintMode()

  // ✅ Track if we've initialized from parent
  const firstNotifyRef = useRef(true)
  const isInitializedRef = useRef(false)
  const prevInitialDataRef = useRef<any[]>([])

  // ===== HELPER: Get item ID from item object =====
  const getItemId = useCallback(
    (item: GroupItem): string | number => {
      return item[itemIdKeyProp] ?? item.id
    },
    [itemIdKeyProp]
  )

  // ===== EFFECTS =====
  useEffect(() => {
    setExpandedGroups(new Set(groups.map(g => g.id)))
  }, [groups])

  useEffect(() => {
    if (!propDictionary && locale) {
      getDictionary(locale as Locale).then(res => setDictionary(res))
    } else {
      setDictionary(propDictionary)
    }
  }, [propDictionary, locale])

  // ✅ Initialize from initialData ONLY on first render or when initialData actually changes
  // useEffect(() => {
  //   const hasInitialData = initialData && initialData.length > 0
  //   const dataChanged = JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData)

  //   if (!isInitializedRef.current || (hasInitialData && dataChanged)) {
  //     if (hasInitialData) {
  //       // Use existing data from parent
  //       setRowsData(
  //         initialData.map(item => ({
  //           ...item,
  //           rowChanged: item.rowChanged ?? false
  //         }))
  //       )
  //     } else {
  //       // Create empty rows
  //       const emptyRows: any[] = []
  //       groups.forEach(group => {
  //         group.items.forEach(item => {
  //           const itemId = getItemId(item)
  //           emptyRows.push({
  //             [itemIdKey]: itemId,
  //             [ratingKey]: null,
  //             [ratingValueKey]: null,
  //             rowChanged: false
  //           })
  //         })
  //       })
  //       setRowsData(emptyRows)
  //     }

  //     isInitializedRef.current = true
  //     prevInitialDataRef.current = initialData
  //   }
  // }, [initialData, groups, itemIdKey, ratingKey, ratingValueKey, getItemId])

  useEffect(() => {
    if (!propDictionary && locale) {
      getDictionary(locale as Locale).then(setDictionary)
    } else {
      setDictionary(propDictionary)
    }
  }, [propDictionary, locale])

  const buildEmptyRows = useCallback(() => {
    const rows: any[] = []

    groups.forEach(group => {
      group.items.forEach(item => {
        const itemId = getItemId(item)

        rows.push({
          [itemIdKey]: itemId,
          [ratingKey]: null,
          [ratingValueKey]: null,
          rowChanged: false
        })
      })
    })

    return rows
  }, [groups, getItemId, itemIdKey, ratingKey, ratingValueKey])

  // ✅ Notify parent ONLY when rowsData actually changes
  // useEffect(() => {
  //   if (!isInitializedRef.current) return

  //   if (onDataChange) {
  //     onDataChange(rowsData)
  //   }
  // }, [rowsData, onDataChange])

  useEffect(() => {
    // Only initialize if we haven't or if there's no data yet
    if (rowsData.length === 0) {
      if (initialData?.length > 0) {
        setRowsData(
          initialData.map(row => ({
            ...row,
            rowChanged: row.rowChanged ?? false
          }))
        )
      } else {
        setRowsData(buildEmptyRows())
      }
      prevInitialDataRef.current = initialData
    }
  }, [initialData, buildEmptyRows, rowsData.length])

  const prevRowsDataRef_notify = useRef<string>('')

  useEffect(() => {
    const currentDataStr = JSON.stringify(rowsData)
    if (prevRowsDataRef_notify.current !== currentDataStr) {
      onDataChange?.(rowsData)
      prevRowsDataRef_notify.current = currentDataStr
    }
  }, [rowsData, onDataChange])
  // ===== HELPERS =====
  const getRowData = useCallback(
    (groupId: string | number, item: GroupItem) => {
      const itemId = getItemId(item)
      return rowsData.find(row => row[itemIdKey] == itemId) || null
    },
    [rowsData, itemIdKey, getItemId]
  )

  const getItemRating = useCallback(
    (groupId: string | number, item: GroupItem): string | string[] => {
      const row = getRowData(groupId, item)
      if (!row) return ratingType === 'checkbox' ? [] : ''

      const rating = row[ratingKey]
      if (ratingType === 'checkbox') {
        return Array.isArray(rating) ? rating : rating ? [rating] : []
      }
      return rating || ''
    },
    [getRowData, ratingKey, ratingType]
  )

  const getGroupRating = useCallback(
    (groupId: string | number, items: GroupItem[], columnValue: string): boolean | 'indeterminate' => {
      // ✅ Find the option object to get its ID
      const option = ratingColumns.find(opt => String(opt.value) === columnValue)
      const compareValue = option?.id ?? columnValue

      if (ratingType === 'radio') {
        return items.every(item => {
          const rating = getItemRating(groupId, item)
          return rating == compareValue
        })
      } else {
        const checkedCount = items.filter(item => {
          const itemRatings = getItemRating(groupId, item) as string[]
          return itemRatings.some(r => r == compareValue)
        }).length
        if (checkedCount === 0) return false
        if (checkedCount === items.length) return true
        return 'indeterminate'
      }
    },
    [ratingType, getItemRating, ratingColumns]
  )

  // ===== HANDLERS =====
  const toggleGroup = useCallback((groupId: string | number) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.has(groupId) ? next.delete(groupId) : next.add(groupId)
      return next
    })
  }, [])

  const handleItemRating = useCallback(
    (groupId: string | number, item: GroupItem, value: string, optionObject: RatingOption) => {
      const itemId = getItemId(item)

      setRowsData(prev => {
        const existingIndex = prev.findIndex(row => row[itemIdKey] == itemId)

        if (existingIndex >= 0) {
          const updated = [...prev]
          const row = { ...updated[existingIndex] }

          if (ratingType === 'radio') {
            // ✅ ratingKey gets the ID from optionObject
            row[ratingKey] = optionObject.id ?? value

            // ✅ ratingValueKey gets the value/label from optionObject
            row[ratingValueKey] = optionObject.value ?? optionObject.label ?? value
          } else {
            const current = Array.isArray(row[ratingKey]) ? row[ratingKey] : row[ratingKey] ? [row[ratingKey]] : []

            // ✅ For checkbox, store IDs
            const optionId = optionObject.id ?? value
            row[ratingKey] = current.includes(optionId)
              ? current.filter((v: any) => v !== optionId)
              : [...current, optionId]

            // ✅ For ratingValueKey, map IDs to values
            row[ratingValueKey] = row[ratingKey]
              .map((id: any) => {
                const opt = ratingColumns.find(o => (o.id ?? o.value) === id)
                return opt?.value ?? opt?.label ?? id
              })
              .join(', ')
          }

          row.rowChanged = true
          updated[existingIndex] = row

          return updated
        } else {
          const newRow: any = {
            [itemIdKey]: itemId,
            [ratingKey]: ratingType === 'radio' ? (optionObject.id ?? value) : [optionObject.id ?? value],
            [ratingValueKey]: optionObject.value ?? optionObject.label ?? value,
            rowChanged: true
          }

          return [...prev, newRow]
        }
      })
    },
    [itemIdKey, ratingKey, ratingValueKey, ratingType, ratingColumns, getItemId]
  )

  const handleGroupRating = useCallback(
    (groupId: string | number, value: string, items: GroupItem[], optionObject: RatingOption) => {
      items.forEach(item => {
        handleItemRating(groupId, item, value, optionObject)
      })
    },
    [handleItemRating]
  )

  const handleFieldChange = useCallback(
    (index: number, fieldName: string, value: any) => {
      if (!selectedItem) return

      const itemId = getItemId(selectedItem)

      setRowsData(prev => {
        const existingIndex = prev.findIndex(row => row[itemIdKey] == itemId)

        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = {
            ...updated[existingIndex],
            [fieldName]: value,
            rowChanged: true
          }
          return updated
        } else {
          const newRow: any = {
            [itemIdKey]: itemId,
            [fieldName]: value,
            rowChanged: true
          }
          return [...prev, newRow]
        }
      })
    },
    [selectedItem, itemIdKey, getItemId]
  )

  const handleOpenModal = useCallback((group: RatingGroup, item: GroupItem, itemIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedGroup(group)
    setSelectedItem(item)
    setSelectedItemIndex(itemIndex)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedGroup(null)
    setSelectedItem(null)
    setSelectedItemIndex(0)
  }, [])

  const handleSaveModal = useCallback(() => handleCloseModal(), [handleCloseModal])

  const getModalRow = useCallback(() => {
    if (!selectedItem) return {}
    const itemId = getItemId(selectedItem)
    const rowData = rowsData.find(row => row[itemIdKey] == itemId)
    return { ...selectedItem, ...(rowData || {}) }
  }, [selectedItem, rowsData, itemIdKey, getItemId])

  const getModalFields = useCallback(
    (item: GroupItem, group: RatingGroup) =>
      dynamicFields.filter(field => {
        if (typeof field.showInModal === 'function') {
          const rowData = getRowData(group.id, item)
          return field.showInModal(item, group, rowData)
        }
        return field.showInModal !== false
      }),
    [dynamicFields, getRowData]
  )

  const shouldShowInfoIcon = useCallback(
    (item: GroupItem, group: RatingGroup) => {
      if (typeof showInfoIcon === 'function') {
        const rowData = getRowData(group.id, item)
        const result = showInfoIcon(item, group, rowData)
        return result
      }
      return showInfoIcon && dynamicFields.length > 0
    },
    [showInfoIcon, dynamicFields.length, getRowData]
  )

  const hasAnyInfoIcon = useMemo(() => {
    if (!groups || groups.length === 0) return false
    return groups.some(g => g.items.some(item => shouldShowInfoIcon(item, g)))
  }, [groups, shouldShowInfoIcon])

  const getOptionColor = useCallback(
    (option: RatingOption) => {
      if (!enableColors) return undefined
      const colorMap: Record<string, string> = {
        جيد: '#22c55e',
        متوسط: '#f59e0b',
        ردئ: '#ef4444',
        'غير متوفر': '#94a3b8',
        good: '#22c55e',
        average: '#f59e0b',
        poor: '#ef4444',
        not_available: '#94a3b8',
        excellent: '#22c55e'
      }
      return (
        option.color || colorMap[String(option.label).toLowerCase()] || colorMap[String(option.value).toLowerCase()]
      )
    },
    [enableColors]
  )

  const getOptionBg = (color: string | undefined) => (color ? `${color}18` : 'transparent')
  const totalItems = groups.reduce((acc, g) => acc + g.items.length, 0)

  // ===== RENDER =====
  return (
    <>
      <style>{`
        .rgt-wrapper {
        //   border-radius: 14px;
          overflow: hidden;
          background: var(--mui-palette-background-paper, #ffffff);
        //   border: 1px solid var(--mui-palette-divider, #e8eaed);
          box-shadow: 0 1px 4px 0 rgba(0,0,0,0.06);
         }
        .rgt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid var(--mui-palette-divider);
          gap: 12px;
          flex-wrap: wrap;
        }
        .rgt-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .rgt-header-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--mui-palette-primary-lightOpacity, rgba(115,103,240,0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mui-palette-primary-main, #7367f0);
          font-size: 18px;
        }
        .rgt-header-title {
          font-size: 15px !important;
          font-weight: 600 !important;
          color: var(--mui-palette-text-primary) !important;
        }
        .rgt-header-sub {
          font-size: 12px !important;
          color: var(--mui-palette-text-secondary) !important;
        }
        .rgt-stats {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .rgt-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
        }
        .rgt-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .rgt-scroll {
          overflow-x: auto;
        }
        .rgt-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 520px;
        }
        .rgt-table thead tr {
          background: var(--mui-palette-action-hover, #f9fafb);
        }
        .rgt-table thead th {
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--mui-palette-text-secondary);
          text-transform: uppercase;
          border-bottom: 1px solid var(--mui-palette-divider);
          text-align: center;
        }
        .rgt-table thead th.th-label {
          text-align: start;
          min-width: 200px;
        }
        .rgt-col-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        .rgt-group-row {
          background: var(--mui-palette-action-hover, #f9fafb) !important;
          cursor: pointer;
        }
        .rgt-group-row:hover {
          background: var(--mui-palette-action-selected, #f1f5f9) !important;
        }
        .rgt-group-td {
          padding: 9px 12px !important;
          border-bottom: 1px solid var(--mui-palette-divider);
        }
        .rgt-group-inner {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rgt-group-name {
          font-size: 13px !important;
          font-weight: 600 !important;
          color: var(--mui-palette-primary-main, #7367f0) !important;
        }
        .rgt-group-badge {
          padding: 1px 7px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          background: var(--mui-palette-primary-main);
          color: #fff;
        }
        .rgt-group-rating-td {
          padding: 6px 4px;
          text-align: center;
          border-bottom: 1px solid var(--mui-palette-divider);
        }
        .rgt-item-row {
          border-bottom: 1px solid var(--mui-palette-divider, #e8eaed);
        }
        .rgt-item-row:last-child {
          border-bottom: none;
        }
        .rgt-item-row:hover {
          background: var(--mui-palette-action-hover, #f9fafb);
        }
        .rgt-item-td {
          padding: 8px 12px 8px 32px !important;
        }
        .rgt-item-inner {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rgt-item-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--mui-palette-divider);
        }
        .rgt-item-name {
          font-size: 13.5px !important;
          color: var(--mui-palette-text-primary) !important;
        }
        .rgt-rating-td {
          padding: 6px 4px;
          text-align: center;
        }
        .rgt-show-check {
          display: inline-flex;
          width: 24px;
          height: 24px;
          min-width: 24px;
          min-height: 24px;
          border-radius: 6px;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border: 1.5px solid rgba(0,0,0,0.1);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          line-height: 0;
          flex-shrink: 0;
        }
        .rgt-show-check i {
          font-weight: 900 !important;
          font-size: 16px !important;
        }
        .rgt-show-empty {
          display: inline-block;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 1px dashed var(--mui-palette-divider);
          background: var(--mui-palette-action-hover);
          opacity: 0.5;
          flex-shrink: 0;
        }
        .rgt-info-td {
          padding: 4px;
          text-align: center;
          width: 44px;
        }
        .rgt-info-btn {
          width: 28px !important;
          height: 28px !important;
          border-radius: 8px !important;
          background: var(--mui-palette-action-hover) !important;
          border: 1px solid var(--mui-palette-divider) !important;
        }
        .rgt-info-btn:hover {
          background: var(--mui-palette-primary-main) !important;
          border-color: var(--mui-palette-primary-main) !important;
        }
        .rgt-info-btn:hover .rgt-info-icon {
          color: #fff !important;
        }
        .rgt-info-icon {
          font-size: 15px;
          color: var(--mui-palette-text-secondary);
        }
        .rgt-empty {
          padding: 40px 24px;
          text-align: center;
          color: var(--mui-palette-text-secondary);
        }

        /* ================= PRINT MODE ================= */
  @media print {
    .rgt-wrapper {
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: #fff !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .rgt-scroll {
      overflow: visible !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .rgt-table {
      min-width: 100% !important;
      width: 100% !important;
      border-collapse: collapse !important;
    }

    .rgt-table tbody tr:last-child td {
      border-bottom: none !important;
    }

    .rgt-table th,
    .rgt-table td {
      border-bottom: 1px solid #ddd !important;
      border-left: 1px solid #ddd !important;
      padding: 6px 8px !important;
      color: #000 !important;
      background: #fff !important;
      font-size: 11px !important;
    }

    .rgt-table th:last-child,
    .rgt-table td:last-child {
      border-left: none !important;
    }

    .rgt-table tr:last-child td {
      border-bottom: none !important;
    }

    .rgt-table thead tr,
    .rgt-table thead th {
      background: #e8eaecff !important;
      color: #000 !important;
      font-weight: bold !important;
    }

    .rgt-group-row,
    .rgt-group-row td {
      background: #f1f5f9 !important;
      color: #000 !important;
      font-weight: bold !important;
    }

    .rgt-item-row td {
      background: #fff !important;
      color: #000 !important;
    }

    .rgt-group-name,
    .rgt-item-name,
    .rgt-header-title,
    .rgt-header-sub {
      color: #000 !important;
    }

    .rgt-group-badge {
      background: #2563eb !important;
      color: #fff !important;
      font-weight: bold !important;
    }

    .rgt-col-pill {
      background: transparent !important;
      border: none !important;
      color: #000 !important;
      font-weight: bold !important;
    }

    .rgt-show-check {
      background: transparent !important;
      color: inherit !important;
      width: 20px !important;
      height: 20px !important;
      min-width: 20px !important;
      min-height: 20px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      line-height: 0 !important;
      flex-shrink: 0 !important;
      border: none !important;
    }

    .rgt-show-check i {
      font-size: 18px !important;
      font-weight: normal !important;
      line-height: 1 !important;
    }

    .rgt-show-empty {
      background: #fff !important;
      border: 1px solid #e2e8f0 !important;
      width: 18px !important;
      height: 18px !important;
      min-width: 18px !important;
      min-height: 18px !important;
      border-radius: 4px !important;
      opacity: 1 !important;
      display: inline-block !important;
      flex-shrink: 0 !important;
    }

    .rgt-info-btn,
    .rgt-info-col,
    .rgt-header,
    .rgt-stats {
      display: none !important;
      width: 0 !important;
      padding: 0 !important;
      border: none !important;
      overflow: hidden !important;
    }

    .rgt-item-row:last-child td {
      border-bottom: none !important;
    }

    .rgt-item-row td:last-child {
      border-left: none !important;
    }

    tr, td, th {
      page-break-inside: avoid !important;
    }
  }
      `}</style>

      <Card>
        <div className='rgt-wrapper'>
          {title && (
            <div className='rgt-header'>
              <div className='rgt-header-left'>
                <div className='rgt-header-icon'>
                  <i className='ri-survey-line' />
                </div>
                <div>
                  <Typography className='rgt-header-title'>{dictionary?.titles?.[title] || title}</Typography>
                  <Typography className='rgt-header-sub'>
                    {groups.length} {dictionary?.placeholders?.['groups'] || 'مجموعات'} · {totalItems}{' '}
                    {dictionary?.placeholders?.['elements'] || 'عنصر'}
                  </Typography>
                </div>
              </div>

              {mode !== 'show' && (
                <div className='rgt-stats'>
                  {ratingColumns.map(opt => {
                    const color = getOptionColor(opt)
                    const compareValue = opt.id ?? opt.value

                    const count = groups.reduce(
                      (total, g) =>
                        total +
                        g.items.filter(item => {
                          const r = getItemRating(g.id, item)
                          return ratingType === 'radio'
                            ? r == compareValue
                            : (r as string[]).some(rating => rating == compareValue)
                        }).length,
                      0
                    )

                    return (
                      <div
                        key={`${opt.value}-${opt.label}`}
                        className='rgt-stat-pill'
                        style={{
                          background: getOptionBg(color),
                          border: `1px solid ${color || '#e2e8f0'}35`
                        }}
                      >
                        <span className='rgt-stat-dot' style={{ background: color || '#94a3b8' }} />
                        <span style={{ fontWeight: 700, color: color || '#94a3b8' }}>{count}</span>
                        <span style={{ color: 'var(--mui-palette-text-secondary)' }}>
                          {dictionary?.placeholders?.[opt.label] || opt.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className='rgt-scroll'>
            {groups.length === 0 ? (
              <div className='rgt-empty'>
                <i className='ri-inbox-line' style={{ fontSize: 32, opacity: 0.4 }} />
                <div>{dictionary?.placeholders?.['no_data'] || 'لا توجد بيانات'}</div>
              </div>
            ) : (
              <table className='rgt-table'>
                <thead>
                  <tr>
                    <th className='th-label'>{dictionary?.placeholders?.['monitoring_elements'] || 'عناصر الرصد'}</th>
                    {extraColumns.map((col, idx) => (
                      <th key={idx}>{dictionary?.placeholders?.[col.key] || col.label}</th>
                    ))}
                    {ratingColumns.map((option, idx) => {
                      const color = getOptionColor(option)
                      return (
                        <th key={`th-${option.id ?? option.value}-${idx}`}>
                          <span
                            className='rgt-col-pill'
                            style={{
                              background: getOptionBg(color),
                              color: color || 'var(--mui-palette-text-secondary)',
                              border: `1px solid ${color || '#e2e8f0'}40`
                            }}
                          >
                            {option.icon && <i className={option.icon} />}
                            {dictionary?.placeholders?.[option.label] || option.label}
                          </span>
                        </th>
                      )
                    })}
                    {hasAnyInfoIcon && (
                      <th style={{ width: 44 }} className='rgt-info-col'>
                        <Tooltip title={dictionary?.placeholders?.['additional_info'] || 'معلومات إضافية'}>
                          <i className='ri-information-line' style={{ fontSize: 14, opacity: 0.45 }} />
                        </Tooltip>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {groups.map(group => {
                    const isExpanded = expandedGroups.has(group.id)
                    return (
                      <React.Fragment key={group.id + '-group'}>
                        <tr className='rgt-group-row' onClick={() => toggleGroup(group.id)}>
                          <td className='rgt-group-td'>
                            <div className='rgt-group-inner'>
                              <IconButton
                                size='small'
                                onClick={e => {
                                  e.stopPropagation()
                                  toggleGroup(group.id)
                                }}
                              >
                                <i
                                  className={isExpanded ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'}
                                  style={{ fontSize: 18 }}
                                />
                              </IconButton>
                              {isPrintMode ? (
                                <Typography className='mx-2 bold-title'>{group.name}</Typography>
                              ) : (
                                <Typography className='rgt-group-name'>{group.name}</Typography>
                              )}

                              <span className='rgt-group-badge'>{group.items.length}</span>
                              {group.description && (
                                <Tooltip title={group.description}>
                                  <IconButton size='small' onClick={e => e.stopPropagation()}>
                                    <i className='ri-information-line' style={{ fontSize: 13 }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                          {extraColumns.map((_, idx) => (
                            <td key={idx} className='rgt-group-rating-td' />
                          ))}
                          {ratingColumns.map((option, index) => {
                            const color = getOptionColor(option)
                            const groupState = getGroupRating(group.id, group.items, String(option.value))
                            return (
                              <td
                                key={`group-${group.id}-${option.id ?? option.value}-${index}`}
                                className='rgt-group-rating-td'
                              >
                                {enableGroupRating && mode !== 'show' && (
                                  <Box display='flex' justifyContent='center'>
                                    {ratingType === 'radio' ? (
                                      <Radio
                                        size='small'
                                        checked={groupState === true}
                                        onChange={() =>
                                          handleGroupRating(group.id, String(option.value), group.items, option)
                                        }
                                        onClick={e => e.stopPropagation()}
                                        sx={{ color: color, '&.Mui-checked': { color } }}
                                      />
                                    ) : (
                                      <Checkbox
                                        size='small'
                                        checked={groupState === true}
                                        indeterminate={groupState === 'indeterminate'}
                                        onChange={() =>
                                          handleGroupRating(group.id, String(option.value), group.items, option)
                                        }
                                        onClick={e => e.stopPropagation()}
                                        sx={{
                                          color,
                                          '&.Mui-checked': { color },
                                          '&.MuiCheckbox-indeterminate': { color }
                                        }}
                                      />
                                    )}
                                  </Box>
                                )}
                              </td>
                            )
                          })}
                          {hasAnyInfoIcon && mode !== 'show' && <td className='rgt-info-td rgt-info-col' />}
                        </tr>

                        {isExpanded &&
                          group.items.map((item, itemIndex) => {
                            const itemKey = getItemId(item)
                            // Use a more unique key for rendering to avoid warnings with duplicate data
                            const renderKey = item.id ? `item-${item.id}` : `item-${itemKey}-${itemIndex}`
                            return (
                              <tr key={renderKey} className='rgt-item-row'>
                                <td className='rgt-item-td'>
                                  <div className='rgt-item-inner'>
                                    <span className='rgt-item-dot' />
                                    <Typography className='rgt-item-name'>{item.name}</Typography>
                                    {item.description && (
                                      <Tooltip title={item.description}>
                                        <i className='ri-information-line' style={{ fontSize: 12, opacity: 0.35 }} />
                                      </Tooltip>
                                    )}
                                  </div>
                                </td>
                                {extraColumns.map((col, idx) => (
                                  <td key={idx} className='rgt-rating-td'>
                                    {col.render ? col.render(item, group) : item[col.key]}
                                  </td>
                                ))}
                                {ratingColumns.map((option, idx) => {
                                  const color = getOptionColor(option)
                                  const itemRating = getItemRating(group.id, item)

                                  const isChecked =
                                    ratingType === 'radio'
                                      ? itemRating == (option.id ?? option.value)
                                      : (itemRating as string[]).some(r => r == (option.id ?? option.value))

                                  return (
                                    <td
                                      key={`item-${renderKey}-${option.id ?? option.value}-${idx}`}
                                      className='rgt-rating-td'
                                      style={{
                                        background: isChecked && mode === 'show' ? getOptionBg(color) : undefined
                                      }}
                                    >
                                      <Box display='flex' justifyContent='center'>
                                        {mode === 'show' ? (
                                          isChecked ? (
                                            <span
                                              className='rgt-show-check'
                                              style={{
                                                color: color || '#22c55e'
                                              }}
                                            >
                                              <i
                                                className={isPrintMode ? 'ri-check-fill' : 'ri-check-fill'}
                                                style={{ color: color || '#22c55e' }}
                                              />
                                            </span>
                                          ) : (
                                            <span className='rgt-show-empty' />
                                          )
                                        ) : ratingType === 'radio' ? (
                                          <Radio
                                            size='small'
                                            checked={isChecked}
                                            onChange={() =>
                                              handleItemRating(group.id, item, String(option.value), option)
                                            }
                                            sx={{ color, '&.Mui-checked': { color } }}
                                          />
                                        ) : (
                                          <Checkbox
                                            size='small'
                                            checked={isChecked}
                                            onChange={() =>
                                              handleItemRating(group.id, item, String(option.value), option)
                                            }
                                            sx={{ color, '&.Mui-checked': { color } }}
                                          />
                                        )}
                                      </Box>
                                    </td>
                                  )
                                })}
                                {hasAnyInfoIcon && (
                                  <td className='rgt-info-td rgt-info-col'>
                                    {shouldShowInfoIcon(item, group) && (
                                      <Tooltip
                                        title={dictionary?.placeholders?.['additional_info'] || 'معلومات إضافية'}
                                      >
                                        <IconButton
                                          size='small'
                                          className='rgt-info-btn'
                                          onClick={e => handleOpenModal(group, item, itemIndex, e)}
                                        >
                                          <i className='rgt-info-icon ri-information-line' />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </td>
                                )}
                              </tr>
                            )
                          })}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Card>

      {isModalOpen && selectedGroup && selectedItem && (
        <DialogDetailsFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
          row={getModalRow()}
          rowIndex={selectedItemIndex}
          fields={getModalFields(selectedItem, selectedGroup)}
          dictionary={dictionary}
          errors={[]}
          handleInputChange={handleFieldChange}
          mode={mode}
          title={modalTitle || `${selectedGroup.name} — ${selectedItem.name}`}
          showDelete={false}
          dataObject={dataObject}
          detailsKey={detailsKey}
        />
      )}
    </>
  )
}

export default DynamicGroupedRatingTable
