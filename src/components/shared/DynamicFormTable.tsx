'use client'
import classNames from 'classnames'

import axios from 'axios'

import { toast } from 'react-toastify'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Card,
  IconButton,
  TextField,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
  ListOfValue,
  useSessionHandler,
  deleteRecordById,
  Typography,
  Box,
  format,
  FormControl,
  formatDateToYMD,
  CustomIconBtn,
  formatNumber,
  IconPickerField,
  CardContent,
  useMemo,
  Grid,
  getIdPath,
  resolvePath,
  useTheme,
  useMediaQuery,
  emitEvent,
  parseMrz,
  normalizeMrz,
  useContext,
  LoadingContext
} from '@/shared'

import { alpha } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import type { DynamicFormTableProps, FileType, Locale, Mode } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { DialogDetailsFormModal } from './DialogDetailsFormModal'
import RichTextEditor from './RichTextEditor'
import responsiveStyles from '@/shared/styles/responsive-table.module.css'
import FilePreview from './FilePriview'
import FileCard from './FileCard'
import { FILE_TYPE_META } from '@/types/file'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { PickersComponent } from './ModalFieldsRenderer'
import CustomBadge from '@/@core/components/mui/Badge'
import TimePicker from './TimePicker'
import DatePickerComponent from './DatePicker'
import dayjs from 'dayjs'
import { getOperatorConfig } from '@/configs/environment'
import MultiFileUploader from './MultiFileUploader'
import { ColorPickerField } from './ColorPickerField'
import { getFormattedHijriDate } from '@/utils/hijriConverter'
import { useSettings } from '@/@core/hooks/useSettings'
import { calculateAllColumns, isValidCalculationValue } from '@/utils/tableCalculations'

export const DynamicFormTable: React.FC<DynamicFormTableProps> = ({
  fields,
  onDataChange = () => { },
  title = '',
  initialData = [],
  mode,
  errors,
  apiEndPoint = '',
  defaultEmptyRows = 3,
  locale = '',
  dataObject = {},
  rowModal = false,
  rowModalConfig = {},
  defaultValueForSearch = false,
  detailsKey = '',
  enableDelete = true,
  enableEmptyRows = true,
  onlyOpenModalonButton = true,
  calculationRowConfig,
  onNewRow,
  onChangeRow
}) => {
  if (mode === 'search') {
    return null
  }
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { accessToken } = useSessionHandler()
  const { screenData } = useScreenPermissions('list')
  const [rows, setRows] = useState<any[]>([])
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [detailsRowIndex, setDetailsRowIndex] = useState<number | null>(null)
  const [dictionary, setDictionary] = useState<any>(null)
  const [uploadingFiles, setUploadingFiles] = useState<Record<number, boolean>>({})
  const { apiUrl } = getOperatorConfig()
  // ✅ Refs to manage state and prevent loops
  const prevRowsRef = useRef<any[]>([])
  const isFirstRender = useRef(true)
  const isUpdatingFromParent = useRef(false)
  const { settings } = useSettings()

  const tableFields = rowModal
    ? fields.filter(field => !field.hideInTable && field.type !== 'storage') // ✅ Add storage filter
    : fields.filter(field => field.type !== 'storage') // ✅ Filter storage fields

  useEffect(() => {
    if (locale) getDictionary(locale as Locale).then(setDictionary)
  }, [locale])

  const [hasScrolled, setHasScrolled] = useState(false)
  const tableScrollRef = useRef<HTMLDivElement>(null)

  // ✅ Handle scroll event
  useEffect(() => {
    const scrollContainer = tableScrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      if (!hasScrolled && scrollContainer.scrollLeft > 0) {
        setHasScrolled(true)
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [hasScrolled])

  const calculatedMinWidth = useMemo(() => {
    // 1. Calculate based on percentage (%)
    const totalFieldWidth = tableFields.reduce((acc, field) => {
      const width = parseFloat(field.width || '10')
      return acc + width
    }, 0)

    let extraWidth = 0
    if (mode === 'show') extraWidth += 2 // index
    if (rowModal) extraWidth += 5
    if (mode !== 'show' && enableDelete) extraWidth += 5
    if (mode !== 'show') extraWidth += 5

    const percentTotal = totalFieldWidth + extraWidth

    // 2. Calculate based on absolute pixels (avoid columns being squashed)
    const minPixelsPerField = isMobile ? 120 : 150
    const infoWidth = rowModal ? 60 : 0
    const deleteWidth = mode !== 'show' && enableDelete ? 60 : 0
    const resultWidth = mode !== 'show' ? 80 : 0
    const indexWidth = mode === 'show' ? 40 : 0

    const pixelTotal = tableFields.length * minPixelsPerField + indexWidth + infoWidth + deleteWidth + resultWidth

    if (percentTotal > 100) {
      return `max(${percentTotal}%, ${pixelTotal}px)`
    }

    // Ensure the table fills the container at minimum,
    // but triggers scroll if the absolute pixel floor is reached.
    return `max(100%, ${pixelTotal}px)`
  }, [tableFields, rowModal, mode, enableDelete])

  // Calculate values for the calculation row

  const isEmptyRow = useCallback(
    (row: Record<string, any>) => {
      return fields.every(field => !row[field.name])
    },
    [fields]
  )

  const calculationRowValues = useMemo(() => {
    if (!calculationRowConfig?.enabled || !calculationRowConfig?.columns || rows.length === 0) {
      return {}
    }

    // Filter out empty rows from calculation
    const dataRows = rows.filter(row => !isEmptyRow(row))
    if (dataRows.length === 0) {
      return {}
    }

    return calculateAllColumns(dataRows, calculationRowConfig.columns)
  }, [rows, calculationRowConfig])

  useEffect(() => {
    if (isUpdatingFromParent.current) {
      isUpdatingFromParent.current = false
      return
    }

    const MIN_ROWS = 3

    const hasInitialData = Array.isArray(initialData) && initialData.length > 0
    let base: Record<string, any>[] = []

    const createRow = (withDefaults: boolean) => {
      const row: Record<string, any> = {}
      if (withDefaults) {
        fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            row[field.name] = field.defaultValue
          }
        })
      }
      return row
    }

    if (mode === 'show') {
      const isDifferent = JSON.stringify(prevRowsRef.current) !== JSON.stringify(initialData)

      if (isDifferent) {
        let updated = [...(initialData || [])]

        // ✅ Remove empty rows completely in show mode
        updated = updated.filter(row => !isEmptyRow(row))

        prevRowsRef.current = updated
        setRows(updated)
      }

      return
    }

    if (hasInitialData) {
      base = [...initialData]

      // ✅ Ensure minimum 3 rows
      while (base.length < MIN_ROWS && enableEmptyRows) {
        base.push(createRow(false))
      }

      if (mode === 'edit') {
        const rowsWithValues = base.filter(row => !isEmptyRow(row))

        // Only add ONE extra empty row if 3 or more rows have values
        if (rowsWithValues.length >= 3 && !isEmptyRow(base[base.length - 1])) {
          base.push(createRow(false))
        }
      }

      prevRowsRef.current = base
      setRows(base)
      onDataChange(base)
      return
    }
    // Default/empty rows for other modes
    if (enableEmptyRows) {
      const useDefaults = defaultValueForSearch

      base = Array.from({ length: Math.max(defaultEmptyRows, MIN_ROWS) }, () =>
        createRow((mode as Mode) === 'search' ? useDefaults : true)
      )
    }

    setRows(base)
    onDataChange(base)
  }, [initialData, mode, defaultEmptyRows, isEmptyRow])

  // ✅ Sync rows changes back to parent - with loop prevention
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevRowsRef.current = rows

      return
    }

    if (mode === 'show') return

    const hasChanged = JSON.stringify(prevRowsRef.current) !== JSON.stringify(rows)

    if (hasChanged) {
      prevRowsRef.current = rows

      // ✅ Set flag BEFORE calling onDataChange to prevent re-initialization
      isUpdatingFromParent.current = true
      onDataChange(rows)
    }
  }, [rows, mode])

  const addRow = useCallback(() => {
    let createdRow: any = null
    let createdIndex = rows.length

    const baseRow: Record<string, any> = { isNew: true }

    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        baseRow[field.name] = field.defaultValue
      }
    })

    createdRow = onNewRow ? onNewRow(baseRow, createdIndex) || baseRow : baseRow

    setRows(prevRows => [...prevRows, createdRow])

    return {
      row: createdRow,
      rowIndex: createdIndex
    }
  }, [fields, rows.length, onNewRow])

  const isFieldDisabled = useCallback((field: any, row: any, rowIndex: number) => {
    if (typeof field.disableField === 'function') {
      return field.disableField(row, rowIndex)
    }

    return false
  }, [])

  // Showing the field based on conditions
  const shouldShowField = useCallback(
    (field: any, row: any) => {
      const { visible = true, visibleModes = [] } = field
      const isFieldVisible = visible && (visibleModes.length === 0 || visibleModes.includes(mode))

      if (!isFieldVisible) return false
      if (!field.showWhen) return true

      const { field: dependsOn, value, hasValue, operator = 'equals' } = field.showWhen

      const currentValue = row?.[dependsOn]

      // ✅ hasValue logic (highest priority)
      if (hasValue) {
        return currentValue !== null && currentValue !== undefined && currentValue !== ''
      }

      const values = Array.isArray(value) ? value.map(String) : [String(value)]
      const current = String(currentValue)

      switch (operator) {
        case 'notEquals':
          return !values.includes(current)

        case 'equals':
        default:
          return values.includes(current)
      }
    },
    [mode]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, fieldIndex: number) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        const isLastRow = rowIndex === rows.length - 1
        if (!isLastRow) return

        // Get visible fields for this specific row
        const visibleFields = tableFields.filter(f => shouldShowField(f, rows[rowIndex]))
        const lastField = visibleFields[visibleFields.length - 1]

        // Check if the current field is the last visible one
        if (tableFields[fieldIndex] === lastField) {
          addRow()
        }
      }
    },
    [rows, tableFields, shouldShowField, addRow]
  )

  const handleFocus = useCallback(
    (rowIndex: number, fieldIndex: number) => {
      const isLastRow = rowIndex === rows.length - 1
      if (!isLastRow) return

      // Get visible fields for this specific row
      const visibleFields = tableFields.filter(f => shouldShowField(f, rows[rowIndex]))
      const firstField = visibleFields[0]

      // Check if the current field is the first visible one
      if (tableFields[fieldIndex] === firstField) {
        addRow()
      }
    },
    [rows.length, tableFields, shouldShowField, addRow]
  )

  const deleteRow = async (e: React.MouseEvent, rowIndex: number, rowId?: any) => {
    e.stopPropagation()

    if (rows.length === 1) {
      setRows([{ rowChanged: false }])

      return
    }

    const isNew = rows[rowIndex]?.isNew || false

    if (rowId && apiEndPoint && !isNew) {
      try {
        const deleteConfirmed = await deleteRecordById(
          apiEndPoint,
          rowId,
          accessToken,
          settings.mode == 'dark' ? 'dark' : 'light'
        )

        if (deleteConfirmed) {
          setRows(rows.filter((_, index) => index !== rowIndex))
        }
      } catch (error) {
        console.error('Failed to delete row from API:', error)
      }
    } else {
      setRows(rows.filter((_, index) => index !== rowIndex))
    }
  }

  const handleInputChange = useCallback(
    async (index: number, fieldName: string, value: any) => {
      await setRows(prevRows => {
        const newRows = [...prevRows]
        const row = { ...newRows[index] }

        if (row[fieldName] === value) return prevRows

        row[fieldName] = value
        row.rowChanged = true

        // ✅ Find field config
        const fieldConfig = fields.find(f => f.name === fieldName)

        // ✅ Reset dependent fields
        if (fieldConfig?.resetFieldsOnChange?.length) {
          fieldConfig.resetFieldsOnChange.forEach(resetFieldName => {
            row[resetFieldName] = null
          })
        }

        newRows[index] = row

        return newRows
      })

      if (errors.length > 0)
        emitEvent('row_clear_errors', {
          detailsKey,
          rowIndex: index
        })
    },
    [fields]
  )

  const handleRowClick = useCallback(
    (index: number, e?: React.MouseEvent) => {
      if (rowModal) {
        setDetailsRowIndex(index)

        if (!onlyOpenModalonButton) {
          setIsDetailsModalOpen(true)
        }
      }

      if (index === rows.length - 1 && mode !== 'show' && enableEmptyRows) {
        addRow()
      }
    },
    [rowModal, rows.length, mode, addRow, onNewRow]
  )

  // File handling functions
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, fieldName: string, field: any) => {
      const selectedFile = event.target.files?.[0]

      if (!selectedFile) return

      // Validation
      const typeAllowed = field.typeAllowed || []
      const sizeAllowed = field.sizeAllowed || 5 * 1024 * 1024

      if (typeAllowed.length && !typeAllowed.includes(selectedFile.type)) {
        toast.error(`نوع الملف غير مدعوم! الأنواع المسموح بها: ${typeAllowed.join(', ')}`)

        return
      }

      if (selectedFile.size > sizeAllowed) {
        toast.error(`حجم الملف يتجاوز الحد المسموح به (${(sizeAllowed / 1024 / 1024).toFixed(2)} MB)`)

        return
      }

      setUploadingFiles(prev => ({ ...prev, [rowIndex]: true }))

      const formData = new FormData()

      formData.append('files[0][file]', selectedFile)
      formData.append('files[0][description]', fieldName)
      formData.append('fileable_type', field.fileableType ? field.fileableType : screenData?.fileable_type)
      formData.append('is_granted', 'true')
      try {
        const response = await axios.post(`${apiUrl}/def/archives`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': (locale as Locale) || 'ar'
          }
        })

        const uploadedFile = response?.data?.data?.[0]

        if (uploadedFile) {
          let currentRowFiles = rows[rowIndex].files || []

          currentRowFiles = Array.isArray(currentRowFiles) ? [...currentRowFiles] : []

          const existingIndex = currentRowFiles.findIndex((f: any) => f.description === fieldName)

          const newFile = {
            id: uploadedFile.id,
            path: uploadedFile.path,
            name: uploadedFile.name,
            ext: uploadedFile.ext,
            description: fieldName
          }

          if (existingIndex !== -1) {
            currentRowFiles[existingIndex] = newFile
          } else {
            currentRowFiles.push(newFile)
          }

          handleInputChange(rowIndex, 'files', currentRowFiles)
          toast.success('تم رفع الملف بنجاح')
        }
      } catch (error) {
        toast.error('فشل رفع الملف')
        console.error(error)
      } finally {
        setUploadingFiles(prev => ({ ...prev, [rowIndex]: false }))
      }
    },
    [accessToken, rows, screenData]
  )

  const [deleteLoading, setDeleteLoading] = useState<Record<number, boolean>>({})
  const handleFileDelete = useCallback(
    async (rowIndex: number, fieldName: string, fileId: number) => {
      try {
        setDeleteLoading(prev => ({ ...prev, [rowIndex]: true }))
        await axios.delete(`${apiUrl}/def/archives/${fileId}?is_granted=true`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': (locale as Locale) || 'ar'
          }
        })

        let currentRowFiles = rows[rowIndex].files || []

        currentRowFiles = currentRowFiles.filter((f: any) => f.description !== fieldName)
        handleInputChange(rowIndex, 'files', currentRowFiles)
        toast.success('تم حذف الملف بنجاح')
      } catch (error) {
        toast.error('حدث خطأ أثناء حذف الملف')
        console.error(error)
      } finally {
        setDeleteLoading(prev => ({ ...prev, [rowIndex]: false }))
      }
    },
    [accessToken, rows]
  )

  const handleFileDownload = useCallback((filePath: string) => {
    if (!filePath) {
      toast.error('لا يوجد ملف للتحميل')
      return
    }

    window.open(filePath, '_blank')
  }, [])

  const normalizeRadioValue = (value: any): '1' | '0' => {
    if (value === true || value === 1 || value === '1') return '1'
    return '0'
  }

  const { loading } = useContext(LoadingContext)
  if (loading.includes('details')) return null

  return (
    <Card>
      <CardContent sx={{ px: 0 }}>
        {title && (
          <div
            style={{ display: 'flex', alignItems: 'center', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
            className='mb-3'
          >
            <CustomAvatar skin='light' color={'primary'} size={30}>
              <i className={classNames('ri-align-justify', 'text-lg')} />
            </CustomAvatar>

            <Typography className='mx-2' variant='h6'>
              {dictionary?.titles?.[title] || title}
            </Typography>
          </div>
        )}

        <div className={responsiveStyles.tableWrapper}>
          {/* ✅ Scroll hint */}
          <div className={responsiveStyles.scrollHint}>
            <i className='ri-arrow-left-line' /> {dictionary?.placeholders?.['scroll_hint'] || 'اسحب لليسار'}
          </div>

          <div
            ref={tableScrollRef}
            className={classNames(responsiveStyles.tableScroll, hasScrolled && responsiveStyles.scrolled)}
          >
            <table
              className={tableStyles.table}
              style={{
                tableLayout: 'fixed',
                width: '100%',
                minWidth: calculatedMinWidth
              }}
            >
              <thead>
                <tr>
                  {
                    <th className='text-center' style={{ width: '3%' }}>
                      {dictionary?.placeholders?.['index'] || '#'}
                    </th>
                  }
                  {tableFields?.map((field, index) => (
                    <th
                      key={index}
                      style={{ width: field.width || 'auto' }}
                      className={`capitalize ${field.align ? `text-${field.align}` : 'text-center'}`}
                    >
                      {dictionary?.placeholders?.[field.label]}
                    </th>
                  ))}

                  {rowModal && (
                    <th className='text-end' style={{ width: '60px' }}>
                      <span className='capitalize'>{dictionary?.placeholders?.['extra_info']}</span>
                    </th>
                  )}

                  {mode !== 'show' && enableDelete && (
                    <th className='text-end' style={{ width: '60px' }}>
                      <span className='capitalize'>{dictionary?.actions?.['delete']} </span>
                    </th>
                  )}

                  {mode !== 'show' && (
                    <th className='text-end' style={{ width: '80px' }}>
                      <span className='capitalize'>{dictionary?.actions?.['result']}</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && mode === 'show' ? (
                  <tr>
                    <td
                      colSpan={
                        tableFields.length +
                        (mode === 'show' ? 1 : 0) +
                        (rowModal ? 1 : 0) +
                        (mode !== 'show' && enableDelete ? 1 : 0) +
                        (mode !== 'show' ? 1 : 0)
                      }
                      className='p-10 text-center'
                    >
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
                  rows.map((row: any, rowIndex: number) => (
                    <tr key={rowIndex} onClick={e => handleRowClick(rowIndex)}>
                      {
                        <td className='text-center' style={{ width: '2%' }}>
                          {rowIndex + 1}
                        </td>
                      }
                      {tableFields.map((field, fieldIndex) => {
                        const isVisible = shouldShowField(field, row)

                        if (!isVisible) {
                          return <td key={fieldIndex} style={{ width: field.width || 'auto' }} />
                        }

                        const alignClass = ['start', 'center', 'end'].includes(field.align)
                          ? `text-${field.align}`
                          : 'text-center'

                        return (
                          <td
                            key={fieldIndex}
                            style={{ width: field.width || 'auto' }}
                            className={`py-3 ${alignClass}`}
                          >
                            {mode === 'show' || field.mode === 'show' ? (
                              (() => {
                                const type = field.type
                                const fieldName = field.name
                                const label = field.label
                                const options = field.options || []
                                const viewProp = field.viewProp
                                const showPrimary = field?.showPrimary ?? true

                                const value = row?.[fieldName]

                                let displayValue: any = value

                                if (viewProp && dataObject) {
                                  const paths = Array.isArray(viewProp) ? viewProp : [viewProp]

                                  let source

                                  if (detailsKey && typeof rowIndex === 'number') {
                                    source = dataObject[detailsKey]?.[rowIndex]
                                  } else {
                                    source = dataObject
                                  }

                                  if (source) {
                                    const values = paths
                                      .map((path: string) => resolvePath(source, path))
                                      .filter(v => v !== null && v !== undefined && v !== '')

                                    if (values.length > 0) {
                                      displayValue = values.join(' - ')

                                      if (
                                        field.type === 'select' &&
                                        !Array.isArray(viewProp) &&
                                        typeof viewProp === 'string' &&
                                        viewProp.includes('.') &&
                                        showPrimary
                                      ) {
                                        const idPath = getIdPath(viewProp)
                                        const idValue = resolvePath(source, idPath)

                                        if (idValue !== undefined && idValue !== null) {
                                          displayValue = `(${idValue}) ${displayValue}`
                                        }
                                      }
                                    }
                                  }
                                }
                                if (!viewProp && type === 'select' && options.length > 0) {
                                  const selectedOption = options.find(option => String(option.value) === String(value))
                                  displayValue = selectedOption ? selectedOption.label : '-'
                                }

                                if (type === 'checkbox' || type === 'radio') {
                                  const isChecked = String(value) === '1' ? true : false

                                  return (
                                    <>
                                      <Box
                                        className='system-view'
                                        sx={{ display: 'flex', alignItems: 'center', py: 1 }}
                                      >
                                        <Box
                                          sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            ml: 2,
                                            flex: 1,
                                            justifyContent: `${['start', 'center', 'end'].includes(field.align) ? field.align : 'center'}`
                                          }}
                                        >
                                          {/* <Typography
                                      sx={{
                                        color: isChecked ? 'green' : 'red',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                      }}
                                    >
                                      <i className={isChecked ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} />
                                    </Typography> */}
                                          <CustomBadge
                                            color={isChecked ? 'success' : 'error'}
                                            badgeContent={
                                              <i
                                                className={`icon-base ri ${isChecked ? 'ri-check-line' : 'ri-close-line'}`}
                                              ></i>
                                            }
                                            tonal='true'
                                          />
                                        </Box>
                                      </Box>

                                      <div className='print-view'>
                                        <Typography
                                          sx={{
                                            color: isChecked ? 'green' : 'red',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                          }}
                                        >
                                          {isChecked ? 'نعم' : 'لا'}
                                        </Typography>
                                      </div>
                                    </>
                                  )
                                }

                                if (field.type === 'amount') {
                                  const rawValue = row[field.name]

                                  const formattedNumber = formatNumber(
                                    rawValue,
                                    0, // أو fieldConfig.decimals
                                    { locale: 'en-SA' }
                                  )

                                  return (
                                    <>
                                      <Box sx={{ py: 1 }} className='system-view'>
                                        <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                                          {formattedNumber}
                                        </Typography>
                                      </Box>

                                      <Typography
                                        className='print-view'
                                        variant='body1'
                                        sx={{ color: '#666', mt: 0.5 }}
                                      >
                                        {formattedNumber}
                                      </Typography>
                                    </>
                                  )
                                }

                                if (type === 'time') {
                                  const formattedTime = dayjs(`1970-01-01T${value || displayValue}`).format(
                                    field?.use24Hours ? 'HH:mm' : 'hh:mm A'
                                  )
                                  return (
                                    <>
                                      <Box className='system-view' sx={{ py: 1 }}>
                                        <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                                          {formattedTime}
                                        </Typography>
                                      </Box>

                                      <Typography
                                        className='print-view'
                                        variant='body1'
                                        sx={{ color: '#666', mt: 0.5 }}
                                      >
                                        {formattedTime}
                                      </Typography>
                                    </>
                                  )
                                }

                                if (type === 'multi_file') {
                                  const allFilesList = row.files || []
                                  const fieldFiles = allFilesList.filter((f: any) => f.description === field.name)

                                  return (
                                    <>
                                      <Box sx={{ py: 1 }}>
                                        <Typography
                                          className='mb-2'
                                          variant='subtitle2'
                                          sx={{ color: '#999', fontSize: '0.875rem' }}
                                        >
                                          {dictionary?.placeholders?.[field.label] || field.label}
                                        </Typography>
                                        {fieldFiles.length > 0 ? (
                                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {fieldFiles.map((file: any, idx: number) => (
                                              <FilePreview
                                                key={idx}
                                                dictionary={dictionary}
                                                filePath={file.path}
                                                fileName={file.name}
                                              />
                                            ))}
                                          </Box>
                                        ) : (
                                          <Typography variant='body2' color='text.secondary'>
                                            -
                                          </Typography>
                                        )}
                                      </Box>
                                    </>
                                  )
                                }

                                if (type === 'rich_text') {
                                  return (
                                    <>
                                      <Box sx={{ py: 1 }} className='system-view'>
                                        <Box
                                          sx={{
                                            color: '#666',
                                            mt: 0.5,
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word'
                                          }}
                                          dangerouslySetInnerHTML={{ __html: displayValue || '-' }}
                                        />
                                      </Box>

                                      <Box
                                        className='print-view'
                                        sx={{
                                          color: '#666',
                                          mt: 0.5,
                                          whiteSpace: 'normal',
                                          wordBreak: 'break-word'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: displayValue || '-' }}
                                      />
                                    </>
                                  )
                                }

                                if (type === 'date' && (displayValue || value)) {
                                  const dateVal = displayValue || value
                                  let formattedDate = 'Invalid Date'
                                  let hijriDate = null
                                  let timeString = ''

                                  if (dateVal) {
                                    const formattedRegDate = String(dateVal).replace(' ', 'T')
                                    const date = new Date(formattedRegDate)

                                    if (!isNaN(date.getTime())) {
                                      formattedDate = format(date, 'yyyy-MM-dd')
                                      timeString = format(date, 'HH:mm')
                                      hijriDate = getFormattedHijriDate(formattedDate) // ✅ Add Hijri
                                    }
                                  }

                                  return (
                                    <>
                                      <Box className='system-view' sx={{ py: 1 }}>
                                        <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                                          {formattedDate}
                                        </Typography>
                                      </Box>

                                      {field.showTime ? (
                                        <>
                                          <span
                                            className='text-xs text-gray-500 italic'
                                            style={{ fontSize: '0.65rem' }}
                                          >
                                            {timeString}
                                          </span>
                                          {field.showHijri && (
                                            <Typography
                                              variant='caption'
                                              sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                                            >
                                              {hijriDate} هـ
                                            </Typography>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {field.showHijri
                                            ? hijriDate && (
                                              <Typography
                                                variant='caption'
                                                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                                              >
                                                {hijriDate} هـ
                                              </Typography>
                                            )
                                            : null}
                                        </>
                                      )}

                                      <Typography
                                        className='print-view'
                                        variant='body1'
                                        sx={{ color: '#666', mt: 0.5 }}
                                      >
                                        {formattedDate}
                                      </Typography>
                                    </>
                                  )
                                }

                                if (type === 'hijri_date' && (displayValue || value)) {
                                  const formatHijriDisplay = (value: string | number | null | undefined) => {
                                    if (!value) return '-'
                                    const cleaned = String(value).replace(/\D/g, '')
                                    if (cleaned.length <= 4) return cleaned
                                    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
                                    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
                                  }
                                }

                                if (type === 'personal_picture') {
                                  const rowFiles = row.files || []
                                  const personalPicFile = rowFiles.find((f: any) => f.description === fieldName)
                                  const imageUrl = personalPicFile?.path || '/images/avatars/personal-pic-avatar.jpg'

                                  return (
                                    <>
                                      <Box className='system-view'>
                                        <Box className='relative flex max-sm:flex-col items-center gap-6'>
                                          <Box className='relative'>
                                            <img
                                              height={100}
                                              width={100}
                                              className='rounded'
                                              src={imageUrl}
                                              alt={label || 'Profile'}
                                              style={{ position: 'relative', zIndex: 1 }}
                                            />
                                          </Box>
                                        </Box>
                                      </Box>

                                      <div className='print-view'>
                                        <img
                                          height={80}
                                          width={80}
                                          className='rounded'
                                          src={imageUrl}
                                          alt={label || 'Profile'}
                                        />
                                      </div>
                                    </>
                                  )
                                }

                                if (type === 'file') {
                                  const rowFiles = row.files || []
                                  const fileData = rowFiles.find((f: any) => f.description === fieldName)

                                  return (
                                    <>
                                      <Box className='system-view'>
                                        <FilePreview
                                          minimChars
                                          dictionary={dictionary}
                                          filePath={fileData?.path}
                                          fileName={fileData?.name?.split('/').pop()}
                                        />
                                      </Box>

                                      <Typography className='print-view' variant='body1'>
                                        {fileData ? fileData.name?.split('/').pop() : '-'}
                                      </Typography>
                                    </>
                                  )
                                }

                                if (type === 'icon_picker') {
                                  return (
                                    <>
                                      <Box className='system-view' sx={{ py: 1 }}>
                                        {value && <i className={value} style={{ fontSize: '1.5rem' }} />}
                                      </Box>

                                      <Typography className='print-view' variant='body1'>
                                        {value || '-'}
                                      </Typography>
                                    </>
                                  )
                                }

                                return (
                                  <>
                                    <Box sx={{ py: 1 }} className='system-view'>
                                      <Typography
                                        variant='body1'
                                        sx={{
                                          color: '#666',
                                          mt: 0.5,
                                          whiteSpace: 'normal',
                                          wordBreak: 'break-word'
                                        }}
                                      >
                                        {(() => {
                                          const value = displayValue || row[fieldName]

                                          if (value === null || value === undefined) {
                                            return row[field.name] === 'id' ? 'يولد بشكل آلي' : '-'
                                          }

                                          if (Array.isArray(value)) {
                                            return '-'
                                          }

                                          if (typeof value === 'object') {
                                            if ('value' in value) {
                                              return value.value || '-'
                                            }

                                            return '-'
                                          }

                                          return String(value) || (row[field.name] === 'id' ? 'يولد بشكل آلي' : '-')
                                        })()}
                                      </Typography>
                                    </Box>

                                    <Typography
                                      className='print-view'
                                      variant='body1'
                                      sx={{
                                        color: '#666',
                                        mt: 0.5,
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word'
                                      }}
                                    >
                                      {(() => {
                                        const value = displayValue || row?.[fieldName]

                                        if (value === null || value === undefined) {
                                          return row[field.name] === 'id' ? 'يولد بشكل آلي' : '-'
                                        }

                                        if (Array.isArray(value)) {
                                          return '-'
                                        }

                                        if (typeof value === 'object') {
                                          if ('value' in value) {
                                            return value.value || '-'
                                          }

                                          return '-'
                                        }

                                        return String(value) || (row[field.name] === 'id' ? 'يولد بشكل آلي' : '-')
                                      })()}
                                    </Typography>
                                  </>
                                )
                              })()
                            ) : (
                              <>
                                {(field.type === 'text' || field.type === 'barcode') && (
                                  <TextField
                                    label={dictionary?.placeholders?.[field.label]}
                                    value={row[field.name] ?? ''}
                                    // multiline={field.type === 'barcode' ? true : false}
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    fullWidth
                                    title={field.tooltip || ''}
                                    onChange={(e: any) => {
                                      const value = e.target.value

                                      handleInputChange(rowIndex, field.name, value)
                                      field.onChange?.(value, rowIndex)
                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: value }, rowIndex)
                                    }}
                                    onBlur={(e: any) => {
                                      const value = e.target.value

                                      if (field.type === 'barcode') {
                                        // Barcode: pass raw scanned value directly (not MRZ)
                                        field.onBlur?.(value, rowIndex)
                                      } else {
                                        // Text with MRZ: normalize then parse
                                        const normalized = normalizeMrz(value)
                                        const parsed = parseMrz(normalized)
                                        field.onBlur?.(parsed, rowIndex)
                                      }
                                    }}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                    onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    size='small'
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'textarea' && (
                                  <TextField
                                    label={dictionary?.placeholders?.[field.label]}
                                    value={row[field.name] ?? ''}
                                    // multiline={field.type === 'barcode' ? true : false}
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    fullWidth
                                    title={field.tooltip || ''}
                                    multiline
                                    rows={4}
                                    onChange={(e: any) => {
                                      const value = e.target.value

                                      handleInputChange(rowIndex, field.name, value)
                                      field.onChange?.(value, rowIndex)
                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: value }, rowIndex)
                                    }}
                                    onBlur={(e: any) => {
                                      const value = e.target.value

                                      if (field.type === 'barcode') {
                                        // Barcode: pass raw scanned value directly (not MRZ)
                                        field.onBlur?.(value, rowIndex)
                                      } else {
                                        // Text with MRZ: normalize then parse
                                        const normalized = normalizeMrz(value)
                                        const parsed = parseMrz(normalized)
                                        field.onBlur?.(parsed, rowIndex)
                                      }
                                    }}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                    onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    // size='small'
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'number' && (
                                  <TextField
                                    label={dictionary?.placeholders?.[field.label]}
                                    value={row[field.name] ?? ''}
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    fullWidth
                                    title={field.tooltip || ''}
                                    onChange={(e: any) => {
                                      let value = e.target.value
                                      if (field.maxLength) {
                                        value = value.slice(0, field.maxLength)
                                      }
                                      handleInputChange(rowIndex, field.name, value)
                                      field.onChange?.(value)

                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: value }, rowIndex)
                                    }}
                                    onBlur={(e: any) => {
                                      const value = e.target.value

                                      field.onBlur?.(value)
                                    }}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                    onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    type='number'
                                    size='small'
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'time' && (
                                  <TimePicker
                                    {...field}
                                    dictionary={dictionary}
                                    use24Hours={field?.use24Hours}
                                    pickerType={field?.pickerInputType}
                                    value={row[field.name] ?? ''}
                                    label={dictionary?.placeholders?.[field.label]}
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    locale={locale}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    now={field?.now ?? false}
                                    onChange={(value: any) => {
                                      handleInputChange(rowIndex, field.name, value)
                                      field.onChange?.(value, rowIndex)

                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: value }, rowIndex)
                                    }}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                    onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'multi_file' &&
                                  (() => {
                                    const allFilesList = row.files || []
                                    return (
                                      <MultiFileUploader
                                        fieldName={field.name} // ✅ Used as description
                                        label={dictionary?.placeholders?.[field.label] || field.label}
                                        fileableType={field.fileableType || screenData?.fileable_type}
                                        accessToken={accessToken}
                                        locale={locale as Locale}
                                        typeAllowed={field.typeAllowed}
                                        sizeAllowed={field.sizeAllowed}
                                        maxFiles={field.maxFiles || 10}
                                        allFiles={allFilesList} // ✅ Pass ALL files
                                        onFilesChange={updatedAllFiles => {
                                          // ✅ Update ALL files in row
                                          handleInputChange(rowIndex, 'files', updatedAllFiles)

                                          const updatedRow = {
                                            ...row,
                                            files: updatedAllFiles,
                                            rowChanged: true
                                          }
                                          if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                                        }}
                                        disabled={field?.disabled}
                                        dictionary={dictionary}
                                      />
                                    )
                                  })()}

                                {field.type === 'rich_text' && (
                                  <RichTextEditor
                                    {...field}
                                    label={dictionary?.placeholders?.description}
                                    placeholder={dictionary?.placeholders?.description}
                                    onChange={value => {
                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: value }, rowIndex)
                                    }}
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'color_picker' && (
                                  <ColorPickerField
                                    label={dictionary?.placeholders?.[field.label] || field.label}
                                    value={row[field.name] ? String(row[field.name]) : '#7367f0'}
                                    onChange={color => {
                                      handleInputChange(rowIndex, field.name, color) // ✅ update local state
                                      field.onChange?.(color)
                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: color }, rowIndex)
                                    }}
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    required={field.required}
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'icon_picker' && (
                                  <IconPickerField
                                    label={dictionary?.placeholders?.[field.label] || field.label}
                                    value={row[field.name] || ''}
                                    onChange={icon => {
                                      handleInputChange(rowIndex, field.name, icon)
                                      field.onChange?.(icon)
                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: icon }, rowIndex)
                                    }}
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    required={field.required}
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                    dictionary={dictionary}
                                  />
                                )}

                                {field.type === 'select' && (
                                  <>
                                    {(() => {
                                      const computedQueryParams =
                                        typeof field.queryParamsFunction === 'function'
                                          ? field.queryParamsFunction(row, rowIndex)
                                          : field.queryParams

                                      const computedApiUrl =
                                        typeof field.apiUrlFunction === 'function'
                                          ? field.apiUrlFunction(row, rowIndex)
                                          : field.apiUrl

                                      return (
                                        <ListOfValue
                                          field={{
                                            label: dictionary?.placeholders?.[field.label],
                                            options: field.options,
                                            required: field.required,
                                            keyProp: field.keyProp,
                                            labelProp: field.labelProp,
                                            type: field.type,
                                            name: field.name,
                                            queryParams: computedQueryParams,
                                            displayProps: field.displayProps,
                                            multiple: field.multiple,
                                            searchProps: field.searchProps,
                                            searchMode: field.searchMode,
                                            searchInBackend: field.searchInBackend,
                                            cache: field.cache,
                                            apiMethod: field.apiMethod,
                                            disabled: field.disabled || isFieldDisabled(field, row, rowIndex) || false,
                                            responseDataKey: field.responseDataKey,
                                            perPage: field.perPage
                                          }}
                                          row={row}
                                          rowIndex={rowIndex}
                                          handleInputChange={(index: number, key: string, value: any, object) => {
                                            handleInputChange(index, field.name, value)
                                            field.onChange?.(value, rowIndex, object)
                                            onChangeRow?.({ ...rows[index], [key]: value }, index, object)
                                          }}
                                          errors={errors}
                                          apiUrl={computedApiUrl || ''}
                                          initialData={[]}
                                          onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                          onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                        />
                                      )
                                    })()}
                                  </>
                                )}

                                {field.type === 'checkbox' && (
                                  <Checkbox
                                    checked={row[field.name] ?? false}
                                    onChange={e => {
                                      const newValue = e.target.checked

                                      handleInputChange(rowIndex, field.name, newValue)
                                      field.onChange?.(newValue, rowIndex)

                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: newValue }, rowIndex)
                                    }}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                    onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'date' && (
                                  <FormControl fullWidth error={!!errors[rowIndex]?.[field.name]?.message}>
                                    {/* <AppReactDatepicker
                                selected={row[field.name] ? new Date(row[field.name]) : null}
                                onChange={(date: Date | null) => {
                                  const formattedDate = date ? formatDateToYMD(date) : null
                                  handleInputChange(rowIndex, field.name, formattedDate)
                                }}
                                customInput={
                                  <PickersComponent
                                    error={errors[rowIndex]?.[field.name]}
                                    label={dictionary?.placeholders?.[field.label] || field.label}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                  />
                                }
                                portalId='root'
                              /> */}
                                    <DatePickerComponent
                                      value={row[field.name] ? String(row[field.name]) : null}
                                      onChange={(val: string | null) => {
                                        const formattedDate = val ? formatDateToYMD(new Date(val)) : null

                                        // Update local state
                                        handleInputChange(rowIndex, field.name, formattedDate)

                                        // Manually create updated row object for parent callback
                                        const updatedRow = {
                                          ...rows[rowIndex],
                                          [field.name]: formattedDate,
                                          rowChanged: true
                                        }

                                        //Call parent callback
                                        if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                                      }}
                                      error={errors[rowIndex]?.[field.name]}
                                      helperText={errors[rowIndex]?.[field.name]?.message}
                                      label={dictionary?.placeholders?.[field.label] || field.label}
                                      disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                      now={field?.now ?? false}
                                      onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                      onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    />
                                  </FormControl>
                                )}

                                {/* Hijri Date */}
                                {field.type === 'hijri_date' && (
                                  <TextField
                                    label={dictionary?.placeholders?.[field.label] || field.label}
                                    value={
                                      row[field.name]
                                        ? (() => {
                                          const cleaned = String(row[field.name]).replace(/\D/g, '')
                                          if (cleaned.length <= 4) return cleaned
                                          if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
                                          return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
                                        })()
                                        : ''
                                    }
                                    error={!!errors[rowIndex]?.[field.name]?.message}
                                    helperText={errors[rowIndex]?.[field.name]?.message}
                                    fullWidth
                                    placeholder='1445-11-11'
                                    onChange={e => {
                                      const input = e.target.value.replace(/\D/g, '')
                                      const truncated = input.slice(0, 8)
                                      const numericValue = truncated ? parseInt(truncated, 10) : null
                                      handleInputChange(rowIndex, field.name, numericValue)

                                      onChangeRow?.({ ...rows[rowIndex], [field.name]: numericValue }, rowIndex)
                                    }}
                                    size='small'
                                    inputProps={{
                                      inputMode: 'numeric',
                                      maxLength: 10
                                    }}
                                    onKeyDown={e => handleKeyDown(e, rowIndex, fieldIndex)}
                                    onFocus={() => handleFocus(rowIndex, fieldIndex)}
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                  />
                                )}

                                {field.type === 'empty' && <div></div>}
                                {field.type === 'storage' && <div></div>}

                                {field.type === 'file' && (
                                  <Box display='flex' alignItems='center' gap={1} onClick={e => e.stopPropagation()}>
                                    {(() => {
                                      const rowFiles = row.files || []
                                      const fileData = rowFiles.find((f: any) => f.description === field.name)

                                      const fileType: FileType = fileData?.ext || 'unknown'

                                      const fileName = fileData?.name?.split('/').pop()

                                      return (
                                        <Box width='100%'>
                                          <input
                                            hidden
                                            id={`file-upload-${field.name}-${rowIndex}`}
                                            type='file'
                                            accept={field.typeAllowed?.join(', ') || '*'}
                                            onChange={e => {
                                              e.stopPropagation()
                                              handleFileUpload(e, rowIndex, field.name, field)
                                            }}
                                          />

                                          <FileCard
                                            dictionary={dictionary}
                                            fileName={fileName}
                                            fileType={fileType}
                                            subtitle={
                                              FILE_TYPE_META[fileType as keyof typeof FILE_TYPE_META]?.label || 'File'
                                            }
                                            loading={!!uploadingFiles[rowIndex]}
                                            onUpload={() =>
                                              document.getElementById(`file-upload-${field.name}-${rowIndex}`)?.click()
                                            }
                                            deleteLoading={!!deleteLoading[rowIndex]}
                                            onDownload={fileData ? () => handleFileDownload(fileData.path) : undefined}
                                            onDelete={
                                              fileData
                                                ? () => handleFileDelete(rowIndex, field.name, fileData.id)
                                                : undefined
                                            }
                                          />

                                          {errors[rowIndex]?.[field.name]?.message && (
                                            <Typography color='error' variant='caption'>
                                              {errors[rowIndex][field.name].message}
                                            </Typography>
                                          )}
                                        </Box>
                                      )
                                    })()}
                                  </Box>
                                )}

                                {field.type === 'radio' && field.options && (
                                  <FormControl
                                    disabled={field.disabled || isFieldDisabled(field, row, rowIndex) || false}
                                    required={field.required}
                                  >
                                    <RadioGroup
                                      row
                                      value={row[field.name] ?? ''}
                                      onChange={(_, value) => {
                                        const updatedRows = rows.map((r, i) => {
                                          const isTarget = i === rowIndex

                                          const isNotEmpty =
                                            r !== null && typeof r === 'object' && Object.keys(r).length > 0

                                          if (!isNotEmpty) return { r }

                                          const isNew = r?.isNew === true

                                          if (!isNew) {
                                            return {
                                              ...r,
                                              [field.name]: isTarget ? value : '0',
                                              rowChanged: true
                                            }
                                          }

                                          return { ...r }
                                        })

                                        setRows(updatedRows)
                                      }}
                                    >
                                      {field.options.map((option, optionIndex) => (
                                        <FormControlLabel
                                          key={optionIndex}
                                          value={String(option.value)}
                                          control={<Radio />}
                                          label={''}
                                        />
                                      ))}
                                    </RadioGroup>
                                  </FormControl>
                                )}
                              </>
                            )}
                          </td>
                        )
                      })}

                      {/* Extra info column */}
                      {rowModal && (
                        <td
                          className='text-end'
                          style={{ width: '60px' }}
                          onClick={() => {
                            if (onlyOpenModalonButton) {
                              setIsDetailsModalOpen(true)
                              setDetailsRowIndex(rowIndex)
                            }
                          }}
                        >
                          <Tooltip title={dictionary?.placeholders?.['extra_info']} placement='top'>
                            <CustomIconBtn color='info' variant='outlined' size='small'>
                              <i className='ri-information-line' />
                            </CustomIconBtn>
                          </Tooltip>
                        </td>
                      )}

                      {/* Delete column */}
                      {mode !== 'show' && enableDelete && (
                        <td className='text-end' style={{ width: '60px' }}>
                          <CustomIconBtn
                            color='error'
                            variant='outlined'
                            size='small'
                            onClick={e => {
                              const rowId = rows[rowIndex]?.id || null
                              deleteRow(e, rowIndex, rowId)
                            }}
                          >
                            <i className='ri-delete-bin-7-line' />
                          </CustomIconBtn>
                        </td>
                      )}

                      {/* Error indicator column (Result) */}
                      {mode !== 'show' && (
                        <td className='text-end' style={{ width: '80px' }}>
                          {errors.find(error => error.rowIndex === rowIndex)?.message && (
                            <Tooltip
                              title={errors.find(error => error.rowIndex === rowIndex)?.message || ''}
                              classes={{ popper: 'error-tooltip' }}
                              placement='top'
                            >
                              <CustomIconBtn color='warning' variant='outlined' size='small'>
                                <i className='ri-alert-line' />
                              </CustomIconBtn>
                            </Tooltip>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}

                {/* ✅ Calculation Row */}
                {calculationRowConfig?.enabled && Object.keys(calculationRowValues).length > 0 && (
                  <tr
                    style={{
                      backgroundColor: 'var(--mui-palette-customColors-tableHeaderBg)',
                      borderTop: `2px solid var(--mui-palette-divider)`
                    }}
                  >
                    {mode === 'show' && (
                      <td className='text-center' style={{ width: '3%' }}>
                        <Typography variant='body2' sx={{ fontWeight: 600 }}>
                          {dictionary?.placeholders?.['total'] || 'الإجمالي'}
                        </Typography>
                      </td>
                    )}
                    {tableFields.map((field, fieldIndex) => {
                      const alignClass = ['start', 'center', 'end'].includes(field.align)
                        ? `text-${field.align}`
                        : 'text-center'

                      // Map text alignment to flexbox justifyContent
                      const justifyContentMap: Record<string, string> = {
                        'text-start': 'flex-start',
                        'text-center': 'center',
                        'text-end': 'flex-end'
                      }
                      const justifyValue = justifyContentMap[alignClass] || 'center'

                      const calculatedValue = calculationRowValues[field.name]
                      const showCalculation = calculationRowConfig?.columns?.[field.name]
                      const showCurrnecy = calculationRowConfig?.columns?.[field.name]?.showCurrnecy ?? false

                      const formattedNumber = formatNumber(
                        calculatedValue,
                        0, // أو fieldConfig.decimals
                        { locale: 'en-SA', useCurrency: showCurrnecy }
                      )

                      const titleCell =
                        fieldIndex === 0 && mode !== 'show' ? (
                          <Typography variant='body2' sx={{ color: 'text.primary' }}>
                            {dictionary?.placeholders?.[String(calculationRowConfig?.title)] || 'الإجمالي'}
                          </Typography>
                        ) : null

                      return (
                        <td key={fieldIndex} style={{ width: field.width || 'auto' }} className={`py-3 ${alignClass}`}>
                          {showCalculation ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: justifyValue }}>
                              <Typography
                                variant='body2'
                                sx={{
                                  color: isValidCalculationValue(calculatedValue) ? 'text.primary' : 'text.disabled'
                                }}
                              >
                                {formattedNumber === '-' ? '-' : String(formattedNumber)}
                              </Typography>
                            </Box>
                          ) : (
                            titleCell
                          )}
                        </td>
                      )
                    })}

                    {/* Extra info column placeholder */}
                    {rowModal && (
                      <td className='text-end' style={{ width: '60px' }}>
                        <span></span>
                      </td>
                    )}

                    {/* Delete column placeholder */}
                    {mode !== 'show' && enableDelete && (
                      <td className='text-end' style={{ width: '60px' }}>
                        <span></span>
                      </td>
                    )}

                    {/* Result column placeholder */}
                    {mode !== 'show' && (
                      <td className='text-end' style={{ width: '80px' }}>
                        <span></span>
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      {rowModal && isDetailsModalOpen && detailsRowIndex !== null && (
        <DialogDetailsFormModal
          open={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onSave={() => setIsDetailsModalOpen(false)}
          row={rows[detailsRowIndex]}
          rowIndex={detailsRowIndex}
          fields={fields.filter(field => shouldShowField(field, rows[detailsRowIndex]))}
          dictionary={dictionary}
          errors={errors}
          handleInputChange={handleInputChange}
          deleteRow={deleteRow}
          mode={mode}
          tabs={rowModalConfig.tabs}
          title={rowModalConfig.title}
          showDelete={rowModalConfig.showDelete}
          showNotificationSettings={rowModalConfig.showNotificationSettings}
          detailsKey={detailsKey}
          onChangeRow={onChangeRow}
          dataObject={dataObject}
        />
      )}
    </Card>
  )
}

export default DynamicFormTable
