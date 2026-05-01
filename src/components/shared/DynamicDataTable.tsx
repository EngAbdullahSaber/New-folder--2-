'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import type { PaginationState, RowSelectionState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Card,
  CardContent,
  Checkbox,
  TablePagination,
  Typography,
  useMediaQuery,
  HeaderPrint,
  FooterPrint,
  exportToExcel,
  Box,
  emitEvent,
  onEvent
} from '@/shared'
import type { DynamicTableProps, MenuOption, Locale } from '@/shared'
import OptionMenu from '@core/components/option-menu'
import tableStyles from '@core/styles/table.module.css'
import CustomIconButton from './CustomIconButton'
import CustomTooltipButton from './CustomTooltipButton'
import { getDictionary } from '@/utils/getDictionary'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import { useDialog } from '@/contexts/dialogContext'
import { LoadingContext } from '@/contexts/loadingContext'
import LoadingSpinner from './LoadingSpinner'
import { resolveCell } from './ResolveDataTableCell'
import { CustomIconBtn } from './CustomIconButton'
import ReportDialog from './ReportDialog'
import TableFilters from './TableFilters'
import { alpha, useTheme, CircularProgress, Popover, List, ListItem, FormControlLabel, Divider, IconButton, Button } from '@mui/material'
import { defaultPageSize, paginationSizeList } from '@/utils/constants'
import { DynamicCardView } from './DynamicCardView'
import { MapViewer } from '@/shared'
import { FilterPopup } from './ColumnFilterPopup'

export const DynamicTable: React.FC<
  DynamicTableProps & {
    selectable?: boolean
    onSelectedIdsChange?: (selectedIds: string[]) => void
    showOnlyOptions?: Array<'add' | 'edit' | 'delete' | 'search' | 'print' | 'export' | (string & {})>
    model?: string
    collapsible?: boolean
    expandableColumns?: string[] // accessorKeys that go inside expandable
    maxVisibleColumns?: number
    onSelectedRowsChange?: (rows: any[]) => void
    extraActionConfig?: {
      action: string
      title: string
      icon: React.ReactNode
      color?: string
    }
  }
> = ({
  columns,
  data,
  totalItems,
  onPaginationChange,
  title = '',
  headerOptions = [],
  onHeaderOptionClick,
  rowOptions = [],
  onRowOptionClick,
  selectable = true,
  onSelectedIdsChange,
  listView = true,
  locale = '',
  showOnlyOptions,
  handleSort,
  apiEndPoint,
  model: propModel,
  paginationStoreKey,
  showBarcode = false,
  enableFilters = false,
  filterableColumns = [],
  onFilterChange,
  enableColumnVisibility = false,
  initialVisibleColumns,
  appliedFilters = {},
  collapsible = false,
  expandableColumns,
  maxVisibleColumns = 6,
  onSelectedRowsChange,
  fetchKey = 'id',
  extraActionConfig,
  extraActions,
  mapLocation
  // showForm = false
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(null)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [viewMode, setViewMode] = useState<'table' | 'cards'>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('viewMode')
      return (stored as 'table' | 'cards') || 'table'
    }
    return 'table'
  })

  useEffect(() => {
    sessionStorage.setItem('viewMode', viewMode)
  }, [viewMode])

  const activeFiltersCount = useMemo(() => {
    return Object.values(appliedFilters).filter(val => val !== undefined && val !== null && val !== '').length
  }, [appliedFilters])

  // ── Column popup filter state ─────────────────────────────────────────────
  const [inlineFilters, setInlineFilters] = useState<Record<string, any>>({})
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null)
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null)

  const handleInlineFilterChange = (key: string, value: any) => {
    const updated = { ...inlineFilters }
    if (value === '' || value === null || value === undefined) {
      delete updated[key]
    } else {
      updated[key] = value
    }
    setInlineFilters(updated)
  }

  const handleApplyInlineFilters = () => {
    onFilterChange?.(inlineFilters)
    setActiveFilterCol(null)
    setFilterAnchorEl(null)
  }

  const handleClearInlineFilters = () => {
    setInlineFilters({})
    onFilterChange?.({})
    onHeaderOptionClick?.('refresh')
    setActiveFilterCol(null)
    setFilterAnchorEl(null)
  }

  const handleClearSingleFilter = (key: string) => {
    const updated = { ...inlineFilters }
    delete updated[key]
    setInlineFilters(updated)
    onFilterChange?.(updated)
    setActiveFilterCol(null)
    setFilterAnchorEl(null)
  }

  const openFilterPopup = (e: React.MouseEvent<HTMLElement>, colKey: string) => {
    e.stopPropagation()
    if (activeFilterCol === colKey) {
      setActiveFilterCol(null)
      setFilterAnchorEl(null)
    } else {
      setActiveFilterCol(colKey)
      setFilterAnchorEl(e.currentTarget)
    }
  }

  // Close popup on outside click — Disabled as per user request to prevent unwanted closing during date selection
  // useEffect(() => {
  //   if (!activeFilterCol) return
  //   const handler = (e: MouseEvent) => {
  //     const target = e.target as HTMLElement
  //
  //     // If the element is no longer in the document, it was likely a disappearing UI element 
  //     // (like a day in a DatePicker or a menu item) that was removed on click.
  //     // We should ignore these clicks to prevent closing the popup prematurely.
  //     if (!document.contains(target)) return
  //
  //     // Ignore clicks inside the popup or on the filter icon
  //     const isInsidePopup = target.closest('[data-filter-popup]')
  //     const isInsideIcon = target.closest('[data-filter-icon]')
  //
  //     // Also ignore clicks inside MUI portals (select menus, date pickers, etc.)
  //     const isInsidePortal =
  //       target.closest('.MuiPopover-root') ||
  //       target.closest('.MuiMenu-root') ||
  //       target.closest('.MuiModal-root') ||
  //       target.closest('.MuiDialog-root') ||
  //       target.closest('.MuiAutocomplete-popper') ||
  //       target.closest('.MuiPickersPopper-root')
  //
  //     if (!isInsidePopup && !isInsideIcon && !isInsidePortal) {
  //       setActiveFilterCol(null)
  //       setFilterAnchorEl(null)
  //     }
  //   }
  //   document.addEventListener('mousedown', handler)
  //   return () => document.removeEventListener('mousedown', handler)
  // }, [activeFilterCol])

  //filter section
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    initialVisibleColumns ||
      (columns
        .filter(c => c.isVisible !== false)
        .map(c => c.accessorKey)
        .filter(Boolean) as string[])
  )
 
  const handleToggleColumn = (columnKey: string) => {
    const isVisible = visibleColumns.includes(columnKey)
    if (isVisible) {
      setVisibleColumns(visibleColumns.filter(k => k !== columnKey))
    } else {
      setVisibleColumns([...visibleColumns, columnKey])
    }
  }
 
  const handleShowAll = () => {
    setVisibleColumns(columns.map(c => c.accessorKey))
  }
 
  const handleHideAll = () => {
    setVisibleColumns([columns[0]?.accessorKey].filter(Boolean))
  }

  const filteredColumns = useMemo(() => {
    const baseColumns = columns.filter(col => col.isVisible !== false)

    // If visibleColumns is empty (e.g. somehow it got cleared), show all base columns
    if (!visibleColumns || visibleColumns.length === 0) return baseColumns

    return baseColumns.filter(col => {
      const key = col.accessorKey || col.id
      return key ? visibleColumns.includes(key as string) : true
    })
  }, [columns, visibleColumns])

  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  // Derive model name from apiEndPoint if not provided (e.g. /def/personal -> personal)
  const model = useMemo(() => {
    if (propModel) return propModel
    if (!apiEndPoint) return ''
    const parts = apiEndPoint.split('/')
    return parts[parts.length - 1]
  }, [propModel, apiEndPoint])

  const getStoredPagination = (): PaginationState => {
    if (!paginationStoreKey) return { pageIndex: 0, pageSize: defaultPageSize }

    try {
      const stored = JSON.parse(localStorage.getItem(paginationStoreKey) || '{}')

      return {
        pageIndex: stored.pageIndex ?? 0,
        pageSize: stored.pageSize ?? defaultPageSize
      }
    } catch {
      return { pageIndex: 0, pageSize: defaultPageSize }
    }
  }

  const isCollapsibleEnabled = useMemo(() => {
    if (typeof collapsible === 'boolean') return collapsible
    return filteredColumns.length > maxVisibleColumns
  }, [collapsible, filteredColumns.length, maxVisibleColumns])

  // ✅ Split columns
  const { mainColumns, collapsedColumns } = useMemo(() => {
    if (!isCollapsibleEnabled) {
      return { mainColumns: filteredColumns, collapsedColumns: [] }
    }

    if (expandableColumns && expandableColumns.length > 0) {
      return {
        mainColumns: filteredColumns.filter(col => !expandableColumns.includes(col.accessorKey)),
        collapsedColumns: filteredColumns.filter(col => expandableColumns.includes(col.accessorKey))
      }
    }

    return {
      mainColumns: filteredColumns.slice(0, maxVisibleColumns),
      collapsedColumns: filteredColumns.slice(maxVisibleColumns)
    }
  }, [filteredColumns, expandableColumns, isCollapsibleEnabled, maxVisibleColumns])

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }))
  }
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>(getStoredPagination)

  const { loading } = useContext(LoadingContext)

  const {
    canAdd,
    showAddButton,
    canEdit,
    showEditButton,
    canDelete,
    canSearch,
    showSearchButton,
    canPrint,
    screenData
  } = useScreenPermissions('list')

  const [selectedRowIds, setSelectedRowIds] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [dictionary, setDictionary] = useState<any>(null)
  const { isPrintMode, triggerPrintMode, selectedRowsToPrint } = usePrintMode()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { openDialog } = useDialog()

  const selectedRowsData = React.useMemo(() => {
    return Object.keys(rowSelection)
      .filter(rowIndex => rowSelection[rowIndex])
      .map(rowIndex => data[Number(rowIndex)])
      .filter(row => row !== undefined)
  }, [rowSelection, data])

  useEffect(() => {
    onSelectedRowsChange?.(selectedRowsData)
  }, [selectedRowsData])

  const handlePrintClick = () => {
    if (selectedRowsData.length > 0) {
      // Print only selected rows
      triggerPrintMode(selectedRowsData)
    } else {
      // Print all rows
      triggerPrintMode()
    }
  }
  const handleExcelExport = () => {
    // Determine which data to export
    const dataToExport = selectedRowsData.length > 0 ? selectedRowsData : data

    // Filter columns to exclude checkbox, index, and options columns
    const exportColumns = columns.filter(
      col =>
        col.accessorKey && // Only include columns with accessorKey
        col.accessorKey !== 'select' &&
        col.accessorKey !== 'options'
    )

    exportToExcel({
      data: dataToExport,
      columns: exportColumns,
      fileName: screenData?.object_name_ar || title || 'export',
      sheetName: 'البيانات',
      dictionary
    })
  }
  const displayData = React.useMemo(() => {
    if (isPrintMode && selectedRowsToPrint.length > 0) {
      // Show only selected rows when printing with selection
      return selectedRowsToPrint
    }
    // Show all data normally or when printing all
    return data
  }, [isPrintMode, selectedRowsToPrint, data])

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  // ✅ NEW HELPER FUNCTION: This handles your Priority Logic
  const shouldRender = (action: string, standardPermission: boolean) => {
    // 1. PRIORITY: If showOnlyOptions is passed and has items, strictly follow it.
    // It ignores standardPermission (canAdd, canEdit) completely.
    if (showOnlyOptions && showOnlyOptions.length > 0) {
      return showOnlyOptions.includes(action as any)
    }

    // 2. FALLBACK: If showOnlyOptions is NOT passed (or empty), use standard permissions.
    return standardPermission
  }

  // ✅ Filter row options based on priority logic
  const defaultRowOptions: MenuOption[] = (
    rowOptions.length
      ? rowOptions
      : [
          { text: 'edit', action: 'edit', visible: false },
          { text: 'delete', action: 'delete', visible: false }
        ]
  )
    .filter(option => option.visible !== false)
    .filter(option => shouldRender(option.action, true)) // We pass true as fallback, or you can pass specific perms

  const hasRowActions = useMemo(() => {
    const canShowEdit = shouldRender('edit', canEdit && showEditButton)
    const canShowDelete = shouldRender('delete', canDelete)
    const hasMenuOptions = defaultRowOptions.length > 0
    const hasMapButtons = mapLocation && mapLocation.length > 0

    return canShowEdit || canShowDelete || hasMenuOptions || hasMapButtons
  }, [canEdit, showEditButton, canDelete, defaultRowOptions, showOnlyOptions, mapLocation])

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  )

  const tableColumns = useMemo(() => {
    return [
      // ✅ EXPAND COLUMN (FIRST)
      ...(isCollapsibleEnabled && !isPrintMode
        ? [
          {
            id: 'expand',
            header: () => null,
            width: '3%',
            enableSorting: false,
            cell: ({ row }: any) => {
              const isExpanded = expandedRows[row.original.id]

              return (
                <div className='flex justify-center'>
                  <CustomIconButton
                    size='small'
                    onClick={e => {
                      e.stopPropagation()
                      toggleRowExpansion(row.original.id)
                    }}
                    sx={theme => ({
                      width: 32,
                      height: 28,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: isExpanded
                        ? alpha(theme.palette.primary.main, 0.14)
                        : alpha(theme.palette.action.active, 0.04),
                      color: isExpanded ? 'primary.main' : 'text.secondary',
                      border: `1.5px solid ${
                        isExpanded ? alpha(theme.palette.primary.main, 0.4) : alpha(theme.palette.divider, 0.5)
                      }`,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        borderColor: theme.palette.primary.main,
                        transform: 'scale(1.15)',
                        boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    })}
                  >
                    <i
                      className={`ri-arrow-down-s-line text-xl transition-all duration-300`}
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </CustomIconButton>
                </div>
              )
            }
          }
        ]
      : []),

    // ✅ SELECT COLUMN
    ...(listView && selectable && !isPrintMode
      ? [
          {
            id: 'select',
            enableSorting: false,
            header: ({ table }: any) => (
              <Checkbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            ),
            cell: ({ row }: any) => (
              <div className='text-center'>
                <Checkbox
                  checked={row.getIsSelected()}
                  disabled={!row.getCanSelect()}
                  indeterminate={row.getIsSomeSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            ),
            width: '3%'
          }
        ]
      : []),

    // ✅ INDEX COLUMN
    ...(listView
      ? [
          {
            id: 'index',
            header: () => <div className='text-center capitalize'>{dictionary?.placeholders?.['index']}</div>,
            cell: ({ row }: any) => (
              <div className='text-center'>{pagination.pageIndex * pagination.pageSize + row.index + 1}</div>
            ),
            width: '3%'
          }
        ]
      : []),

    // ✅ MAIN (VISIBLE) COLUMNS
    ...mainColumns.map(column => ({
      ...column,
      header: () => (
        <div className='text-center capitalize' style={{ display: 'flex', justifyContent: 'center' }}>
          {typeof column.header === 'string'
            ? dictionary?.placeholders?.[column.header]
            : flexRender(column.header, {})}
        </div>
      ),
      cell: resolveCell(column, {
        onRowOptionClick,
        openDialog: openDialog as any,
        dictionary,
        isPrintMode,
        theme
      })
    })),

    // ✅ OPTIONS COLUMN
    ...(listView && !isPrintMode && hasRowActions
      ? [
          {
            id: 'options',
            header: () => <div className='text-center capitalize'>{dictionary?.actions?.['options']}</div>,
            cell: ({ row }: any) => {
              const rowId = row.original.fetchKey || row.original[fetchKey] || row.original.id

              const getCustomColor = (color: string) => {
                const mapping: any = {
                  primary: 'rgb(102 108 255)',
                  secondary: 'rgb(138 141 147)',
                  success: 'rgb(114 225 40)',
                  error: 'rgb(230 69 66)',
                  warning: 'rgb(253 181 40)',
                  info: 'rgb(38 198 249)'
                }

                return mapping[color] || color
              }

              return (
                <div className='flex justify-center'>
                  <div className='flex items-center gap-1'>
                    {defaultRowOptions
                      .filter(opt => opt.isExternal)
                      .map((option, idx) => {
                        const isDisabled =
                          typeof option.disabled === 'function' ? option.disabled(row.original) : option.disabled

                        if (option.visible === false) return null

                        return (
                          <CustomIconButton
                            key={`${option.action}-${idx}`}
                            color={option.color as any}
                            customColor={getCustomColor(option.color as string)}
                            disabled={isDisabled}
                            onClick={e => {
                              e.stopPropagation()
                              onRowOptionClick(option.action, rowId, undefined, row.original)
                            }}
                          >
                            <i className={option.icon} />
                          </CustomIconButton>
                        )
                      })}

                    {/* EDIT */}
                    {shouldRender('edit', canEdit && showEditButton) && (
                      <CustomIconButton
                        color='warning'
                        onClick={e => {
                          e.stopPropagation()
                          onRowOptionClick('edit', rowId, undefined, row.original)
                        }}
                      >
                        <i className='ri-pencil-line' />
                      </CustomIconButton>
                    )}

                    {/* DELETE */}
                    {shouldRender('delete', canDelete) && (
                      <CustomIconButton
                        color='error'
                        onClick={e => {
                          e.stopPropagation()
                          onRowOptionClick('delete', rowId, undefined, row.original)
                        }}
                      >
                        <i className='ri-delete-bin-6-line' />
                      </CustomIconButton>
                    )}

                    {/* ✅ UNIFIED MAP ACTION */}
                    {mapLocation && mapLocation.length > 0 && (
                      <CustomIconButton
                        color='info'
                        onClick={e => {
                          e.stopPropagation()
                          let locations = []

                          // 1. Helper to parse separate Long/Lat pairs if they exist in data
                          const getPairValue = (base: string) => {
                            const longKey = base
                              ? base.endsWith('_')
                                ? `${base}longitude`
                                : `${base}_longitude`
                              : 'longitude'
                            const latKey = base
                              ? base.endsWith('_')
                                ? `${base}latitude`
                                : `${base}_latitude`
                              : 'latitude'
                            const long = row.original[longKey]
                            const lat = row.original[latKey]
                            return long && lat ? `${lat}, ${long}` : null
                          }

                          if (mapLocation.includes('x_axis') && mapLocation.includes('y_axis')) {
                            const x = row.original.x_axis
                            const y = row.original.y_axis

                            if (x !== undefined && y !== undefined && x !== null && y !== null) {
                              locations.push({
                                coordinates: `${x}, ${y}`,
                                title:
                                  dictionary?.actions?.['location'] ||
                                  dictionary?.placeholders?.['location'] ||
                                  'Location'
                              })
                            }
                          } else {
                            // Detect if we should treat fields as pairs vs standalone strings
                            const processedKeys = new Set<string>()

                            mapLocation.forEach(keyStr => {
                              if (processedKeys.has(keyStr)) return

                              const keys = keyStr.split('??')
                              let coordinates = ''
                              let activeKey = keys[0]

                              for (const k of keys) {
                                // A. Check if it's a standalone coordinate string "LAT,LONG"
                                const val = row.original[k]
                                if (val && String(val).includes(',')) {
                                  coordinates = String(val)
                                  activeKey = k
                                  break
                                }

                                // B. Check if it's a prefix for longitude / latitude
                                if (k.endsWith('longitude') || k.endsWith('latitude')) {
                                  let base = k.replace(/_?(longitude|latitude)$/, '')
                                  const pairedVal = getPairValue(base)
                                  if (pairedVal) {
                                    coordinates = pairedVal
                                    activeKey = base || 'location'
                                    // Mark counterparts as processed
                                    const lKey = base
                                      ? base.endsWith('_')
                                        ? `${base}longitude`
                                        : `${base}_longitude`
                                      : 'longitude'
                                    const aKey = base
                                      ? base.endsWith('_')
                                        ? `${base}latitude`
                                        : `${base}_latitude`
                                      : 'latitude'
                                    processedKeys.add(lKey)
                                    processedKeys.add(aKey)
                                    break
                                  }
                                }
                              }

                              if (coordinates) {
                                locations.push({
                                  coordinates,
                                  title:
                                    dictionary?.actions?.[activeKey] ||
                                    dictionary?.placeholders?.[activeKey] ||
                                    dictionary?.titles?.[activeKey] ||
                                    activeKey.replace('_', ' ')
                                })
                              }

                              processedKeys.add(keyStr)
                            })
                          }

                          openDialog?.(MapViewer, { locations })
                        }}
                      >
                        <i className='ri-map-pin-2-line' />
                      </CustomIconButton>
                    )}

                    {/* EXTRA MENU OPTIONS */}
                    {defaultRowOptions.length > 0 && (
                      <div onClick={e => e.stopPropagation()}>
                        <OptionMenu
                          iconButtonProps={{ size: 'medium' }}
                          iconClassName='text-textSecondary text-[22px]'
                          options={[
                            ...defaultRowOptions
                              .filter(opt => !opt.isExternal)
                              .map(option => ({
                                text: dictionary?.actions?.[option.text] || option.text,
                                icon: option.icon,
                                disabled:
                                  typeof option.disabled === 'function'
                                    ? option.disabled(row.original)
                                    : option.disabled,
                                menuItemProps: {
                                  onClick: () => onRowOptionClick(option.action, rowId, undefined, row.original)
                                }
                              })),
                            ...(mapLocation && mapLocation.length > 0
                              ? [
                                  {
                                    text: dictionary?.actions?.['map_pin'] || 'View Map',
                                    menuItemProps: {
                                      onClick: () => {
                                        let locations = []

                                        // 1. Helper for separate axes
                                        const getPairValueLocal = (base: string) => {
                                          const longKey = base
                                            ? base.endsWith('_')
                                              ? `${base}longitude`
                                              : `${base}_longitude`
                                            : 'longitude'
                                          const latKey = base
                                            ? base.endsWith('_')
                                              ? `${base}latitude`
                                              : `${base}_latitude`
                                            : 'latitude'
                                          const long = row.original[longKey]
                                          const lat = row.original[latKey]
                                          return long && lat ? `${lat}, ${long}` : null
                                        }

                                        // Special case: separate x_axis and y_axis fields
                                        if (mapLocation.includes('x_axis') && mapLocation.includes('y_axis')) {
                                          const x = row.original.x_axis
                                          const y = row.original.y_axis

                                          if (x !== undefined && y !== undefined && x !== null && y !== null) {
                                            locations.push({
                                              coordinates: `${x}, ${y}`,
                                              title: dictionary?.actions?.['location'] || 'Location'
                                            })
                                          }
                                        } else {
                                          // Default behavior: map each key to a separate pin
                                          const processedKeys = new Set<string>()

                                          mapLocation.forEach(keyStr => {
                                            if (processedKeys.has(keyStr)) return

                                            const keys = keyStr.split('??')
                                            let coordinates = ''
                                            let activeKey = keys[0]

                                            for (const k of keys) {
                                              // A. LAT,LONG check
                                              const val = row.original[k]
                                              if (val && String(val).includes(',')) {
                                                coordinates = String(val)
                                                activeKey = k
                                                break
                                              }

                                              // B. Long/Lat Pair Check
                                              if (k.endsWith('longitude') || k.endsWith('latitude')) {
                                                const base = k.replace(/_?(longitude|latitude)$/, '')
                                                const pairedVal = getPairValueLocal(base)
                                                if (pairedVal) {
                                                  coordinates = pairedVal
                                                  activeKey = base || 'location'
                                                  const lKey = base
                                                    ? base.endsWith('_')
                                                      ? `${base}longitude`
                                                      : `${base}_longitude`
                                                    : 'longitude'
                                                  const aKey = base
                                                    ? base.endsWith('_')
                                                      ? `${base}latitude`
                                                      : `${base}_latitude`
                                                    : 'latitude'
                                                  processedKeys.add(lKey)
                                                  processedKeys.add(aKey)
                                                  break
                                                }
                                              }
                                            }

                                            if (coordinates) {
                                              locations.push({
                                                coordinates,
                                                title:
                                                  dictionary?.actions?.[activeKey] ||
                                                  dictionary?.placeholders?.[activeKey] ||
                                                  activeKey.replace('_', ' ')
                                              })
                                            }

                                            processedKeys.add(keyStr)
                                          })
                                        }

                                        openDialog?.(MapViewer, { locations })
                                      }
                                    }
                                  }
                                ]
                              : [])
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            },
            width: '10%'
          }
        ]
      : [])
    ]
  }, [
    isCollapsibleEnabled,
    isPrintMode,
    expandedRows,
    theme,
    listView,
    selectable,
    dictionary,
    pagination,
    mainColumns,
    onRowOptionClick,
    openDialog,
    fetchKey,
    hasRowActions,
    defaultRowOptions,
    mapLocation
  ])


  const table = useReactTable({
    data: displayData,
    columns: tableColumns,
    state: { rowSelection, pagination },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    pageCount: totalItems,
    manualPagination: true,

    onPaginationChange: updater => {
      setPagination(old => {
        const newState = typeof updater === 'function' ? updater(old) : updater

        if (paginationStoreKey) {
          localStorage.setItem(paginationStoreKey, JSON.stringify(newState))
        }

        return newState
      })
    },

    enableSortingRemoval: true,
    enableMultiSort: true
  })

  useEffect(() => {
    const ids = Object.keys(rowSelection)
      .filter(rowIndex => rowSelection[rowIndex])
      .map(rowIndex => data[Number(rowIndex)])
      .filter(
        row =>
          row &&
          (row.fetchKey || row[fetchKey] || row.id) !== undefined &&
          (row.fetchKey || row[fetchKey] || row.id) !== null
      )
      .map(row => row.fetchKey || row[fetchKey] || row.id)

    setSelectedRowIds(ids)
  }, [rowSelection, onSelectedIdsChange, data, fetchKey])

  const handleMultiDelete = (e: any) => {
    e.stopPropagation()
    if (selectedRowIds.length > 0) {
      onSelectedIdsChange?.(selectedRowIds)
      setSelectedRowIds([])
      setRowSelection({})
    } else {
      alert('Please select rows to delete.')
    }
  }

  const handleSortDynamic = (column: any) => {
    const currentSort = column.getIsSorted()
    const columnKey = column.columnDef.accessorKey

    let nextSort: 'asc' | 'desc' | false = currentSort === false ? 'asc' : currentSort === 'asc' ? 'desc' : false

    if (nextSort === false) {
      column.clearSorting()
      onHeaderOptionClick?.('refresh')
    } else {
      column.toggleSorting(nextSort === 'desc')
      handleSort(columnKey, nextSort)
    }
  }

  const toggleArrowIcon = (
    <svg width='21' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g id='remix-icons/line/system/2arrow-left-s-line'>
        <path
          id='Vector'
          d='M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z'
          fill='var(--mui-palette-text-primary)'
        />
        <path
          id='Vector_2'
          d='M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z'
          fill='var(--mui-palette-text-disabled)'
        />
      </g>
    </svg>
  )

  useEffect(() => {
    const unsubscribe = onEvent('list:reset', (event: CustomEvent) => {
      setRowSelection({})
      setSelectedRowIds([])
      onHeaderOptionClick('refresh')
    })

    return unsubscribe
  }, [])

  return (
    <div>
      <HeaderPrint dictionary={dictionary}></HeaderPrint>
      <FooterPrint showBarcode={showBarcode} />

      <div className='print-table-container'>
        <Card>
          {listView && (
            <React.Fragment>
              <CardContent className='flex justify-between items-center max-sm:flex-col gap-4'>
                <div>
                  <Typography variant='h5' color={'primary-main'}>
                    {screenData?.object_name_ar ? screenData?.object_name_ar : title}
                    <span> {toggleArrowIcon}</span>
                    {dictionary?.actions?.['list']}
                    {isPrintMode && selectedRowsToPrint.length > 0 && (
                      <Typography component='span' variant='caption' color='primary' sx={{ ml: 2 }}>
                        ({selectedRowsToPrint.length} {dictionary?.placeholders?.['selected_rows'] || 'Selected Rows'})
                      </Typography>
                    )}
                  </Typography>
                </div>
                <div className='flex items-center gap-2'>
                  {/* ✅ ALWAYS-VISIBLE extra actions (isSelectionIndependent) */}
                  {(() => {
                    const actions = [...(extraActions || []), ...(extraActionConfig ? [extraActionConfig] : [])]
                    return actions
                      .filter(config => config.isSelectionIndependent)
                      .map((config, idx) => (
                        <CustomTooltipButton
                          key={`independent-${config.action}-${idx}`}
                          title={dictionary?.actions?.[config.title] ?? config.title}
                          arrow
                        >
                          <CustomIconBtn
                            customColor={config.color || 'rgb(76 175 80)'}
                            variant='outlined'
                            size='small'
                            sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                            disabled={config.disabled || config.loading}
                            onClick={() => {
                              emitEvent(config.action, {
                                rows: selectedRowsData,
                                apiEndPoint,
                                model
                              })
                            }}
                          >
                            {config.loading ? <CircularProgress size={20} color='inherit' /> : config.icon}
                            {selectedRowsData.length > 0 && (
                              <span
                                style={{
                                  fontSize: '9px',
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  backgroundColor: config.color ?? 'rgb(76 175 80)',
                                  color: 'white',
                                  borderRadius: '10px',
                                  minWidth: '18px',
                                  width: 'auto',
                                  padding: '0 4px',
                                  height: '18px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  border: '2px solid var(--mui-palette-background-paper)',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                {selectedRowsData.length}
                              </span>
                            )}
                          </CustomIconBtn>
                        </CustomTooltipButton>
                      ))
                  })()}

                  {/* ✅ SELECTION-DEPENDENT extra actions */}
                  {selectedRowsData.length > 0 && (
                    <>
                      {(() => {
                        const actions = [...(extraActions || []), ...(extraActionConfig ? [extraActionConfig] : [])]
                        return actions
                          .filter(config => !config.isSelectionIndependent)
                          .map((config, idx) => (
                            <CustomTooltipButton
                              key={`${config.action}-${idx}`}
                              title={dictionary?.actions?.[config.title] ?? config.title}
                              arrow
                            >
                              <CustomIconBtn
                                customColor={config.color || 'rgb(76 175 80)'}
                                variant='outlined'
                                size='small'
                                sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                                disabled={config.disabled || config.loading}
                                onClick={() => {
                                  emitEvent(config.action, {
                                    rows: selectedRowsData,
                                    apiEndPoint,
                                    model
                                  })
                                }}
                              >
                                {config.loading ? <CircularProgress size={20} color='inherit' /> : config.icon}
                                <span
                                  style={{
                                    fontSize: '9px',
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: config.color ?? 'rgb(76 175 80)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    minWidth: '18px',
                                    width: 'auto',
                                    padding: '0 4px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    border: '2px solid var(--mui-palette-background-paper)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  {selectedRowsData.length}
                                </span>
                              </CustomIconBtn>
                            </CustomTooltipButton>
                          ))
                      })()}
                    </>
                  )}

                  {/* ✅ MULTI-DELETE (selection-dependent) */}
                  {selectedRowIds.length > 0 && canDelete && (
                    <CustomTooltipButton title={dictionary?.actions?.['delete']} arrow>
                      <CustomIconBtn
                        customColor='rgb(230 69 66)'
                        color='error'
                        variant='outlined'
                        size='small'
                        onClick={handleMultiDelete}
                      >
                        <i className='ri-delete-bin-6-line' />
                        <span
                          style={{
                            fontSize: '9px',
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'rgb(230 69 66)',
                            color: 'white',
                            borderRadius: '10px',
                            minWidth: '18px',
                            width: 'auto',
                            padding: '0 4px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            border: '2px solid var(--mui-palette-background-paper)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {selectedRowIds.length}
                        </span>
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}

                  {/* ✅ CLEAR SELECTION — always last (leftmost in RTL UI) */}
                  {selectedRowsData.length > 0 && (
                    <CustomTooltipButton title={dictionary?.actions?.['clear_selection']} arrow>
                      <CustomIconBtn
                        customColor='rgb(158 158 158)'
                        variant='outlined'
                        size='small'
                        sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                        onClick={() => {
                          setRowSelection({})
                          setSelectedRowIds([])
                        }}
                      >
                        <i className='ri-close-circle-line' />
                        <span
                          style={{
                            fontSize: '9px',
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'rgb(158 158 158)',
                            color: 'white',
                            borderRadius: '10px',
                            minWidth: '18px',
                            width: 'auto',
                            padding: '0 4px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            border: '2px solid var(--mui-palette-background-paper)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {selectedRowsData.length}
                        </span>
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}
                  {/* ... skip add button ... */}

                  {/* ✅ PRINT BUTTON: Uses shouldRender logic */}
                  {shouldRender('print', canPrint) && (
                    <React.Fragment>
                      <CustomTooltipButton
                        title={
                          selectedRowsData.length > 0
                            ? `${dictionary?.actions?.['print']} عدد (${selectedRowsData.length})`
                            : dictionary?.actions?.['print']
                        }
                        arrow
                      >
                        <CustomIconBtn
                          customColor={selectedRowsData.length > 0 ? 'rgb(255 152 0)' : 'rgb(102 108 255)'}
                          variant='outlined'
                          size='small'
                          sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                          onClick={handlePrintClick}
                        >
                          <i className='ri-printer-line' />
                          {selectedRowsData.length > 0 && (
                            <span
                              style={{
                                fontSize: '9px',
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'rgb(255 152 0)',
                                color: 'white',
                                borderRadius: '10px',
                                minWidth: '18px',
                                width: 'auto',
                                padding: '0 4px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                border: '2px solid var(--mui-palette-background-paper)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            >
                              {selectedRowsData.length}
                            </span>
                          )}
                        </CustomIconBtn>
                      </CustomTooltipButton>
                    </React.Fragment>
                  )}
                  {shouldRender('print', true) && (
                    <CustomTooltipButton
                      title={
                        selectedRowsData.length > 0
                          ? `${dictionary?.actions?.['export'] || 'تصدير'} (${selectedRowsData.length})`
                          : dictionary?.actions?.['export'] || 'تصدير إلى Excel'
                      }
                      arrow
                    >
                      <CustomIconBtn
                        customColor={selectedRowsData.length > 0 ? 'rgb(76 175 80)' : 'rgb(67 160 71)'}
                        variant='outlined'
                        size='small'
                        sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                        onClick={handleExcelExport}
                      >
                        <i className='ri-file-excel-line' style={{ fontSize: '20px' }} />
                        {selectedRowsData.length > 0 && (
                          <span
                            style={{
                              fontSize: '9px',
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              backgroundColor: 'rgb(76 175 80)',
                              color: 'white',
                              borderRadius: '10px',
                              minWidth: '18px',
                              width: 'auto',
                              padding: '0 4px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              border: '2px solid var(--mui-palette-background-paper)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            {selectedRowsData.length}
                          </span>
                        )}
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}
                  {/* ✅ COLUMNS BUTTON (Moved to Header) */}
                     <CustomTooltipButton title={dictionary?.actions?.['columns'] || 'الأعمدة'} arrow>
                      <CustomIconBtn
                        customColor='rgb(102 108 255)'
                        variant={Boolean(columnMenuAnchor) ? 'contained' : 'outlined'}
                        size='small'
                        sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                        onClick={e => setColumnMenuAnchor(e.currentTarget)}
                      >
                        <i className='ri-layout-column-line' />
                        <span
                          style={{
                            fontSize: '9px',
                            position: 'absolute',
                            top: '-12px',
                            right: '-8px',
                            backgroundColor: 'rgb(102 108 255)',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '1px 6px',
                            minWidth: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            border: '2px solid var(--mui-palette-background-paper)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {visibleColumns.length}/{columns.length}
                        </span>
                      </CustomIconBtn>
                    </CustomTooltipButton>
               
                  {/* ✅ FILTERS BUTTON (Moved to Header) */}
                  {enableFilters && (
                    <CustomTooltipButton title={dictionary?.actions?.['filters'] || 'الفلاتر'} arrow>
                      <CustomIconBtn
                        customColor='rgb(102 108 255)'
                        variant={isFiltersExpanded ? 'contained' : 'outlined'}
                        size='small'
                        sx={{ position: 'relative', width: 34, height: 34, p: 0 }}
                        onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                      >
                        <i className='ri-filter-3-line' />
                        {activeFiltersCount > 0 && (
                          <span
                            style={{
                              fontSize: '9px',
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              backgroundColor: 'rgb(102 108 255)',
                              color: 'white',
                              borderRadius: '10px',
                              minWidth: '18px',
                              width: 'auto',
                              padding: '0 4px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              border: '2px solid var(--mui-palette-background-paper)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            {activeFiltersCount}
                          </span>
                        )}
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}

                  {shouldRender('add', canAdd && showAddButton) && (
                    <CustomTooltipButton title={dictionary?.actions?.['add']} arrow>
                      <CustomIconBtn
                        customColor='rgb(114 225 40)'
                        variant='outlined'
                        size='small'
                        onClick={() => onHeaderOptionClick('add')}
                      >
                        <i className='ri-add-line' />
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}

                  {/* ✅ SEARCH BUTTON: Uses shouldRender logic */}
                  {shouldRender('search', canSearch && showSearchButton) && (
                    <CustomTooltipButton title={dictionary?.actions?.['search']} arrow>
                      <CustomIconBtn
                        customColor='rgb(38 198 249)'
                        variant='outlined'
                        size='small'
                        onClick={() => onHeaderOptionClick('search')}
                      >
                        <i className='ri-search-line' />
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}
                  {/* ✅ REFRESH BUTTON: Tied to Search Logic */}
                  {shouldRender('search', canSearch && showSearchButton) && (
                    <CustomTooltipButton title={dictionary?.actions?.['refresh']} arrow>
                      <CustomIconBtn
                        customColor='rgb(253 181 40)'
                        color='primary'
                        variant='outlined'
                        size='small'
                        onClick={() => onHeaderOptionClick('refresh')}
                      >
                        <i className='ri-refresh-line' />
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}

                  {viewMode === 'cards' && (
                    <CustomTooltipButton title={dictionary?.actions?.['list'] || 'Table'} arrow>
                      <CustomIconBtn
                        customColor='rgb(102 108 255)'
                        variant='outlined'
                        size='small'
                        onClick={() => setViewMode('table')}
                      >
                        <i className='ri-table-2' style={{ fontSize: 20 }} />
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}
                  {viewMode === 'table' && (
                    <CustomTooltipButton title={dictionary?.actions?.['grid'] || 'Cards'} arrow>
                      <CustomIconBtn
                        customColor='rgb(102 108 255)'
                        variant='outlined'
                        size='small'
                        onClick={() => setViewMode('cards')}
                      >
                        <i className='ri-layout-grid-line' style={{ fontSize: 20 }} />
                      </CustomIconBtn>
                    </CustomTooltipButton>
                  )}
                </div>
                {/* ✅ VIEW TOGGLE */}
              </CardContent>

              {/* ✅ ADD FILTERS COMPONENT */}
              {enableFilters && filterableColumns && filterableColumns.length > 0 && (
                <CardContent sx={{ pt: 0 }}>
                  <TableFilters
                    filterableColumns={filterableColumns}
                    onFilterChange={onFilterChange || (() => {})}
                    onReset={() => onHeaderOptionClick('refresh')}
                    dictionary={dictionary}
                    locale={locale as string}
                    isExpanded={isFiltersExpanded}
                    onExpandedChange={setIsFiltersExpanded}
                    hideToolbar={true}
                  />
                </CardContent>
              )}
            </React.Fragment>
          )}

          {/* ... (Mobile View Code) ... */}
          {/* NOTE: Apply the same `shouldRender` replacement to mobile view buttons below if needed */}
          {viewMode === 'cards' ? (
            <DynamicCardView
              columns={columns}
              data={displayData}
              onRowOptionClick={onRowOptionClick}
              openDialog={openDialog}
              dictionary={dictionary}
              fetchKey={fetchKey}
              showOnlyOptions={showOnlyOptions}
              rowOptions={rowOptions}
              mapLocation={mapLocation}
            />
          ) : isMobile ? (
            <DynamicCardView
              columns={columns}
              data={displayData}
              onRowOptionClick={onRowOptionClick}
              openDialog={openDialog}
              dictionary={dictionary}
              fetchKey={fetchKey}
              showOnlyOptions={showOnlyOptions}
              rowOptions={rowOptions}
              mapLocation={mapLocation}
            />
          ) : (
            <div className='w-full overflow-x-auto' style={{ minHeight: '200px' }}>
              <table className={`${tableStyles.table} w-full`}>
                {/* ... Table Header ... */}
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                        const colDef = header.column.columnDef as any
                        const filterCol = enableFilters
                          ? filterableColumns.find(
                              fc =>
                                fc.accessorKey === colDef.accessorKey ||
                                fc.accessorKey === colDef.id ||
                                (fc as any).originalAccessorKey === colDef.accessorKey
                            )
                          : undefined
                        const isFiltered = filterCol && inlineFilters[filterCol.accessorKey] !== undefined
                        const isPopupOpen = filterCol && activeFilterCol === filterCol.accessorKey

                        return (
                          <th
                            key={header.id}
                            className={`${selectable ? 'p-2' : 'py-2'} text-left`}
                            style={{ width: colDef?.width || 'auto', position: 'relative' }}
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                                className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                                onClick={() => {
                                  if (!header.column.getCanSort()) return
                                  handleSortDynamic(header.column)
                                }}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {{
                                  asc: <i className='ri-arrow-up-line text-xl' />,
                                  desc: <i className='ri-arrow-down-line text-xl' />
                                }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}

                                {/* ── Filter icon for filterable columns ── */}
                                {filterCol && (
                                  <span
                                    data-filter-icon
                                    onClick={e => openFilterPopup(e, filterCol.accessorKey)}
                                    title={dictionary?.actions?.['filter'] || 'فلتر'}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: 20,
                                      height: 20,
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      flexShrink: 0,
                                      color: isFiltered
                                        ? 'var(--mui-palette-primary-main)'
                                        : isPopupOpen
                                          ? 'var(--mui-palette-primary-main)'
                                          : 'var(--mui-palette-text-disabled)',
                                      background: isFiltered
                                        ? 'var(--mui-palette-primary-lightOpacity)'
                                        : isPopupOpen
                                          ? 'var(--mui-palette-action-hover)'
                                          : 'transparent',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <i
                                      className={isFiltered ? 'ri-filter-fill' : 'ri-filter-line'}
                                      style={{ fontSize: '13px' }}
                                    />
                                  </span>
                                )}
                              </div>
                            )}

                            {/* ── Filter Popup ── */}
                            {filterCol && isPopupOpen && (
                              <FilterPopup
                                filterCol={filterCol}
                                value={inlineFilters[filterCol.accessorKey]}
                                onChange={val => handleInlineFilterChange(filterCol.accessorKey, val)}
                                onApply={handleApplyInlineFilters}
                                onClear={() => handleClearSingleFilter(filterCol.accessorKey)}
                                dictionary={dictionary}
                                locale={locale as string}
                              />
                            )}
                          </th>
                        )
                      })}
                    </tr>
                  ))}

                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={tableColumns.length} className='p-10 text-center'>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            py: 12,
                            opacity: 0.6
                          }}
                        >
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '24px',
                              bgcolor: alpha(theme.palette.secondary.main, 0.06),
                              color: alpha(theme.palette.secondary.main, 0.4),
                              border: `1.5px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            <i className='ri-file-search-line text-6xl' />
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant='h5' sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                              {dictionary?.messages?.['there_is_no_records'] || 'لا يوجد سجلات'}
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.disabled', maxWidth: 300, mx: 'auto' }}>
                              {dictionary?.messages?.['no_records_hint'] ||
                                'لم يتم العثور على أي نتائج مطابقة لخيارات البحث الحالية'}
                            </Typography>
                          </Box>
                        </Box>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map(row => {
                      const isExpanded = expandedRows[row.original.id]

                      return (
                        <React.Fragment key={row.id}>
                          <tr
                            className={`${row.getIsSelected() ? 'selected' : ''} ${isCollapsibleEnabled ? 'cursor-pointer' : ''}`}
                            onClick={() => {
                              if (isCollapsibleEnabled) {
                                toggleRowExpansion(row.original.id)
                              }
                            }}
                          >
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id} className='p-2 text-center'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                          {!isPrintMode && isCollapsibleEnabled && isExpanded && collapsedColumns.length > 0 && (
                            <tr className=''>
                              <td colSpan={row.getVisibleCells().length}>
                                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 p-4'>
                                  {collapsedColumns.map(col => {
                                    const CellComponent = resolveCell(col, { onRowOptionClick, openDialog, dictionary })
                                    return (
                                      <Box
                                        key={col.accessorKey}
                                        sx={theme => ({
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'start',
                                          gap: 3,
                                          px: 3,
                                          py: 2,
                                          borderRadius: '10px',
                                          border: `1px solid ${
                                            theme.palette.mode === 'dark'
                                              ? alpha(theme.palette.divider, 0.2)
                                              : alpha(theme.palette.divider, 0.12)
                                          }`,
                                          bgcolor:
                                            theme.palette.mode === 'dark'
                                              ? alpha(theme.palette.primary.dark, 0.08)
                                              : alpha(theme.palette.primary.light, 0.04),
                                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                          '&:hover': {
                                            bgcolor:
                                              theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.primary.main, 0.08)
                                                : alpha(theme.palette.primary.main, 0.04),
                                            borderColor: alpha(theme.palette.primary.main, 0.4),
                                            transform: 'translateY(-1px)',
                                            boxShadow: theme =>
                                              theme.palette.mode === 'dark'
                                                ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                                                : `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                            '& .row-label': { color: theme.palette.primary.main }
                                          }
                                        })}
                                      >
                                        {/* Key */}
                                        <Typography
                                          className='row-label'
                                          variant='caption'
                                          sx={{
                                            fontWeight: 700,
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                            color: 'text.secondary',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0,
                                            minWidth: 100,
                                            transition: 'color 0.2s ease',
                                            fontSize: '10.5px',
                                            opacity: 0.9
                                          }}
                                        >
                                          {dictionary?.placeholders?.[col.header as string] || col.header}
                                        </Typography>

                                        {/* Value */}
                                        <Box
                                          sx={{
                                            fontSize: '0.82rem',
                                            fontWeight: 500,
                                            color: 'text.primary',
                                            textAlign: 'start',
                                            flexShrink: 0,
                                            maxWidth: '55%'
                                          }}
                                        >
                                          <CellComponent row={row} getValue={() => row.original?.[col.accessorKey]} />
                                        </Box>
                                      </Box>
                                    )
                                  })}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {loading.includes('list') && <LoadingSpinner type='skeleton' skeletonHeight={100} />}

          <TablePagination
            className='system-view'
            rowsPerPageOptions={paginationSizeList}
            component='div'
            count={totalItems}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
              onPaginationChange(page, table.getState().pagination.pageSize)
            }}
            onRowsPerPageChange={e => {
              const newSize = Number(e.target.value)
              table.setPageSize(newSize)
              onPaginationChange(table.getState().pagination.pageIndex, newSize)
            }}
            labelRowsPerPage='عدد السجلات بالصفحة'
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} من ${count !== -1 ? count : `أكثر من ${to}`}`}
          />
        </Card>
      </div>

      <Popover
        open={Boolean(columnMenuAnchor)}
        anchorEl={columnMenuAnchor}
        onClose={() => setColumnMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 0.5,
            borderRadius: '12px',
            border: `1px solid var(--mui-palette-divider)`,
            bgcolor: 'var(--mui-palette-background-paper)',
            backdropFilter: 'blur(12px)',
            boxShadow: 'var(--mui-customShadows-lg)'
          }
        }}
      >
        <Box sx={{ p: 2, minWidth: 260 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
              {dictionary?.placeholders?.['manage_columns'] || 'إدارة الأعمدة'}
            </Typography>
            <IconButton
              size='small'
              onClick={() => setColumnMenuAnchor(null)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: '6px',
                color: 'text.secondary',
                '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.06) }
              }}
            >
              <i className='ri-close-line' style={{ fontSize: '0.85rem' }} />
            </IconButton>
          </Box>
 
          {/* Show/Hide All */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
            <Button
              size='small'
              variant='outlined'
              onClick={handleShowAll}
              fullWidth
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                height: 30,
                borderColor: alpha(theme.palette.divider, 0.1),
                color: 'text.secondary',
                '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main }
              }}
            >
              {dictionary?.actions?.['show_all'] || 'إظهار الكل'}
            </Button>
            <Button
              size='small'
              variant='outlined'
              onClick={handleHideAll}
              fullWidth
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                height: 30,
                borderColor: alpha(theme.palette.divider, 0.1),
                color: 'text.secondary',
                '&:hover': { borderColor: theme.palette.error.main, color: theme.palette.error.main }
              }}
            >
              {dictionary?.actions?.['hide_all'] || 'إخفاء الكل'}
            </Button>
          </Box>
 
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1), mb: 1 }} />
 
          {/* Column List */}
          <List dense disablePadding sx={{ maxHeight: 320, overflow: 'auto' }}>
            {columns.map(column => {
              const isVisible = visibleColumns.includes(column.accessorKey)
              return (
                <ListItem
                  key={column.accessorKey}
                  disablePadding
                  sx={{
                    borderRadius: '8px',
                    mb: 0.25,
                    transition: 'background 0.15s',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) }
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size='small'
                        checked={isVisible}
                        onChange={() => handleToggleColumn(column.accessorKey)}
                        sx={{
                          color: isVisible ? theme.palette.primary.main : 'text.disabled',
                          p: '6px'
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant='body2'
                        sx={{
                          fontSize: '0.8rem',
                          fontWeight: isVisible ? 600 : 400,
                          color: isVisible ? 'text.primary' : 'text.secondary',
                          transition: 'color 0.15s'
                        }}
                      >
                        {typeof column.header === 'string'
                          ? dictionary?.placeholders?.[column.header] || column.header
                          : column.accessorKey}
                      </Typography>
                    }
                    sx={{ width: '100%', m: 0, px: 0.5, py: 0.25 }}
                  />
                </ListItem>
              )
            })}
          </List>
 
          <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1), mt: 1, mb: 1 }} />
 
          {/* Footer count */}
          <Typography
            variant='caption'
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.disabled',
              fontSize: '0.72rem'
            }}
          >
            {visibleColumns.length} {dictionary?.placeholders?.['of'] || 'من'} {columns.length}{' '}
            {dictionary?.placeholders?.['visible'] || 'ظاهر'}
          </Typography>
        </Box>
      </Popover>
 
      <ReportDialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        model={model}
        columns={columns}
        dictionary={dictionary}
        locale={locale as string}
      />
    </div>
  )
}

export default DynamicTable
