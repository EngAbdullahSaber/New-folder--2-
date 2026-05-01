// components/shared/ModalFieldsRenderer.tsx
'use client'
import React, { useRef, useState, useMemo, useCallback } from 'react'
import ReactDOM from 'react-dom'
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  FormLabel,
  IconButton,
  Slider,
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  DynamicFormField,
  FileType,
  ListOfValue,
  Locale,
  formatDateToYMD,
  formatNumber,
  getIdPath,
  useParams,
  useSessionHandler
} from '@/shared'
import { useDialogDetailsForm } from '@/contexts/dialogDetailsFormContext'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import RichTextEditor from './RichTextEditor'
import axios from 'axios'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import FilePreview from './FilePriview'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import { FILE_TYPE_META } from '@/types/file'
import FileCard from './FileCard'
import CustomBadge from '@/@core/components/mui/Badge'
import TimePicker from './TimePicker'
import DatePickerComponent from './DatePicker'
import dayjs from 'dayjs'
import { getOperatorConfig } from '@/configs/environment'
import MultiFileUploader from './MultiFileUploader'
import { ColorPickerField } from './ColorPickerField'
import { IconPickerField } from './IconPickerField'

interface ModalFieldsRendererProps {
  fields?: any[]
  detailsKey?: string
  dataObject: any
  onChangeRow?: (row: any, rowIndex: number, object?: any) => void
}

interface PickerProps {
  label?: string
  error?: any
  helperText?: string
  value?: any
  onChange?: any
}

export const PickersComponent = React.forwardRef<HTMLInputElement, PickerProps>(
  ({ error, helperText, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        fullWidth
        {...props}
        label={props.label || ''}
        className='is-full'
        error={!!error}
        helperText={error?.message || helperText}
        size='small'
      />
    )
  }
)

PickersComponent.displayName = 'PickersComponent'

export const ModalFieldsRenderer: React.FC<ModalFieldsRendererProps> = React.memo(
  ({ fields: propsFields, dataObject, detailsKey, onChangeRow }) => {
    const { row, rowIndex, fields: contextFields, dictionary, errors, handleInputChange, mode } = useDialogDetailsForm()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    // ✅ Memoize fields to prevent recalculation
    const fields = useMemo(() => propsFields || contextFields, [propsFields, contextFields])

    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const { accessToken } = useSessionHandler()
    const { screenData } = useScreenPermissions('*')
    const { lang: locale } = useParams()
    const { apiUrl } = getOperatorConfig()

    // ✅ Memoize getDisplayValue function
    const getDisplayValue = useCallback(
      (field: any) => {
        const { viewProp, type, options, value: fieldValue, name } = field

        // Determine the source object
        let source: any
        if (dataObject && Object.keys(dataObject).length > 0) {
          source = detailsKey && typeof rowIndex === 'number' ? dataObject[detailsKey]?.[rowIndex] : dataObject
        } else {
          source = null
        }

        // Try viewProp first
        if (viewProp && source) {
          const paths = Array.isArray(viewProp) ? viewProp : [viewProp]
          const values = paths
            .map(path => path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : null), source))
            .filter(v => v !== null && v !== undefined && v !== '')

          if (values.length > 0) {
            let result = values.join(' - ')

            // ✅ Special case for select with single string viewProp
            if (type === 'select' && !Array.isArray(viewProp) && viewProp.includes('.')) {
              const idPath = getIdPath(viewProp)
              const idValue = idPath.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : null), source)
              if (idValue !== undefined && idValue !== null) {
                result = `(${idValue}) ${result}`
              }
            }

            return result
          }
        }

        // Fallback to select field value if type is select
        if (type === 'select' && options?.length > 0) {
          let actualValue = fieldValue

          // fieldValue might be an object with a 'value' key
          if (fieldValue && typeof fieldValue === 'object' && 'value' in fieldValue) {
            actualValue = fieldValue.value
          }

          const selectedOption = options.find((option: any) => String(option.value) === String(actualValue))
          return selectedOption ? selectedOption.label : actualValue
        }

        return null
      },
      [dataObject, detailsKey, rowIndex]
    )

    // ✅ Stable file upload handler
    const handleFileUpload = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string, field: any) => {
        const selectedFile = event.target.files?.[0]
        if (!selectedFile) return

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

        setUploadingFiles(prev => ({ ...prev, [fieldName]: true }))

        const formData = new FormData()
        formData.append('files[0][file]', selectedFile)
        formData.append('files[0][description]', fieldName)
        formData.append('fileable_type', screenData?.fileable_type)

        try {
          const response = await axios.post(`${apiUrl}/def/archives`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${accessToken}`
            }
          })

          const uploadedFile = response?.data?.data?.[0]
          if (uploadedFile) {
            let currentFiles = row.files || []
            currentFiles = Array.isArray(currentFiles) ? [...currentFiles] : []

            const existingIndex = currentFiles.findIndex((f: any) => f.description === fieldName)

            const newFile = {
              id: uploadedFile.id,
              path: uploadedFile.path,
              name: uploadedFile.name,
              ext: uploadedFile.ext,
              description: fieldName
            }

            if (existingIndex !== -1) {
              currentFiles[existingIndex] = newFile
            } else {
              currentFiles.push(newFile)
            }

            handleInputChange(rowIndex, 'files', currentFiles)
            toast.success('تم رفع الملف بنجاح')
          }
        } catch (error) {
          toast.error('فشل رفع الملف')
          console.error(error)
        } finally {
          setUploadingFiles(prev => ({ ...prev, [fieldName]: false }))
        }
      },
      [accessToken, apiUrl, row.files, rowIndex, screenData?.fileable_type, handleInputChange]
    )

    // ✅ Stable file delete handler
    const handleFileDelete = useCallback(
      async (fieldName: string, fileId: number) => {
        try {
          await axios.delete(`${apiUrl}/def/archives/${fileId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })

          let currentFiles = row.files || []
          currentFiles = currentFiles.filter((f: any) => f.description !== fieldName)
          handleInputChange(rowIndex, 'files', currentFiles)
          toast.success('تم حذف الملف بنجاح')
        } catch (error) {
          toast.error('حدث خطأ أثناء حذف الملف')
          console.error(error)
        }
      },
      [accessToken, apiUrl, row.files, rowIndex, handleInputChange]
    )

    // ✅ Stable file download handler
    const handleFileDownload = useCallback((filePath: string) => {
      if (!filePath) {
        toast.error('لا يوجد ملف للتحميل')
        return
      }
      window.open(filePath, '_blank')
    }, [])

    // ✅ Memoize field renderers to prevent recreating JSX on every render
    const renderField = useCallback(
      (field: any, fieldIndex: number) => {
        const fieldKey = `${field.name}-${fieldIndex}`

        // Text & Textarea & Email & Phone
        if (field.type === 'text' || field.type === 'textarea' || field.type === 'email' || field.type === 'phone') {
          if (mode === 'show' || field.mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {row[field.name] || '-'}
                </Typography>
              </Box>
            )
          }

          return (
            <TextField
              label={dictionary?.placeholders?.[field.label] || field.label}
              value={row[field.name] ?? ''}
              error={!!errors[rowIndex]?.[field.name]?.message}
              helperText={errors[rowIndex]?.[field.name]?.message}
              fullWidth
              disabled={field?.disabled}
              onChange={e => {
                handleInputChange(rowIndex, field.name, e.target.value)
                const updatedRow = {
                  ...row,
                  [field.name]: e.target.value,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              size='small'
              multiline={field.type === 'textarea'}
              rows={field.type === 'textarea' ? 4 : undefined}
              placeholder={dictionary?.placeholders?.[field.placeholder] || field.placeholder}
              type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            />
          )
        }

        // Password
        if (field.type === 'password') {
          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  ••••••••
                </Typography>
              </Box>
            )
          }

          return (
            <TextField
              label={dictionary?.placeholders?.[field.label] || field.label}
              value={row[field.name] ?? ''}
              error={!!errors[rowIndex]?.[field.name]?.message}
              helperText={errors[rowIndex]?.[field.name]?.message}
              fullWidth
              type='password'
              disabled={field?.disabled}
              onChange={e => {
                handleInputChange(rowIndex, field.name, e.target.value)

                const updatedRow = {
                  ...row,
                  [field.name]: e.target.value,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              size='small'
            />
          )
        }

        if (field.type === 'amount') {
          if (mode === 'show' || field.mode === 'show') {
            const rawValue = row[field.name]

            const formattedNumber = formatNumber(
              rawValue,
              0, // أو fieldConfig.decimals
              { locale: 'en-SA' }
            )

            return (
              <>
                <Box sx={{ py: 1 }} className='system-view'>
                  <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                    {dictionary?.placeholders?.[field.label] || field.label}
                  </Typography>

                  <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {formattedNumber}
                  </Typography>
                </Box>

                <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {formattedNumber}
                </Typography>
              </>
            )
          }
        }

        // Number
        if (field.type === 'number') {
          if (mode === 'show' || field.mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {row[field.name] ?? '-'}
                </Typography>
              </Box>
            )
          }

          return (
            <TextField
              label={dictionary?.placeholders?.[field.label] || field.label}
              value={row[field.name] ?? ''}
              error={!!errors[rowIndex]?.[field.name]?.message}
              helperText={errors[rowIndex]?.[field.name]?.message}
              fullWidth
              disabled={field?.disabled}
              type='number'
              onChange={e => {
                const rawValue = e.target.value
                let valueStr = rawValue

                if (field.maxLength) {
                  valueStr = rawValue.slice(0, field.maxLength)
                }

                const value = valueStr === '' ? '' : Number(valueStr)
                handleInputChange(rowIndex, field.name, value)
                field.onChange?.(value, rowIndex)

                const updatedRow = {
                  ...row,
                  [field.name]: value,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              size='small'
            />
          )
        }

        // Select
        if (field.type === 'select') {
          if (mode === 'show') {
            const getSelectDisplayValue = () => {
              if (field.viewProp) {
                const viewPropValue = getDisplayValue(field)
                if (viewPropValue) return viewPropValue
              }

              const value = row[field.name]
              if (!value) return '-'

              if (field.options && field.options.length > 0) {
                const selectedOption = field.options.find(
                  (option: any) => String(option[field.keyProp || 'value']) === String(value)
                )
                return selectedOption ? selectedOption[field.labelProp || 'label'] : value
              }

              if (field.displayProps && field.displayProps.length > 0) {
                const displayKey = field.displayProps[0]
                const relatedObject = row[`${field.name}_object`] || row[field.name + 'Object']
                if (relatedObject && relatedObject[displayKey]) {
                  return relatedObject[displayKey]
                }
              }

              return value
            }

            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {getSelectDisplayValue()}
                </Typography>
              </Box>
            )
          }

          return (
            <ListOfValue
              field={{
                label: dictionary?.placeholders?.[field.label] || field.label,
                options: field.options,
                required: field.required,
                keyProp: field.keyProp,
                labelProp: field.labelProp,
                type: field.type,
                name: field.name,
                queryParams: field.queryParams,
                displayProps: field.displayProps,
                multiple: field.multiple,
                searchProps: field.searchProps,
                searchMode: field.searchMode,
                searchInBackend: field.searchInBackend,
                apiMethod: field.apiMethod,
                cache: field.cache,
                cacheWithDifferentKey: field.cacheWithDifferentKey,
                disabled: field?.disabled,
                responseDataKey: field.responseDataKey,
                perPage: field.perPage
              }}
              row={row}
              rowIndex={rowIndex}
              handleInputChange={(index, key, value, object) => {
                handleInputChange(index, field.name, value)
                field.onChange?.(value, rowIndex, object)
                onChangeRow?.({ ...row, [field.name]: value }, index, object)
              }}
              errors={errors}
              apiUrl={field.apiUrl || ''}
              initialData={[]}
            />
          )
        }

        // Checkbox
        if (field.type === 'checkbox') {
          const isChecked = row[field.name] ?? false

          if (mode === 'show') {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isChecked ? (
                    <Typography sx={{ color: 'green', display: 'flex', alignItems: 'center', gap: 4.5 }}>
                      <CustomBadge
                        color={'success'}
                        badgeContent={<i className={`icon-base ri ri-check-line`} />}
                        tonal='true'
                      />
                      {dictionary?.placeholders?.[field.label] || field.label}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: 'red', display: 'flex', alignItems: 'center', gap: 4.5 }}>
                      <CustomBadge
                        color={'error'}
                        badgeContent={<i className='icon-base ri ri-close-line' />}
                        tonal='true'
                      />
                      {dictionary?.placeholders?.[field.label] || field.label}
                    </Typography>
                  )}
                </Box>
              </Box>
            )
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                disabled={field?.disabled}
                checked={isChecked}
                onChange={e => {
                  handleInputChange(rowIndex, field.name, e.target.checked)
                  const updatedRow = {
                    ...row,
                    [field.name]: e.target.checked,
                    rowChanged: true
                  }
                  if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                }}
              />
              <Typography variant='subtitle2' sx={{ color: '#999' }}>
                {dictionary?.placeholders?.[field.label] || field.label}
              </Typography>
            </Box>
          )
        }

        // Radio
        if (field.type === 'radio' && field.options) {
          if (mode === 'show') {
            const selectedOption = field.options.find((opt: any) => opt.value === row[field.name])
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {selectedOption ? dictionary?.placeholders?.[selectedOption.label] || selectedOption.label : '-'}
                </Typography>
              </Box>
            )
          }

          return (
            <FormControl required={field.required} fullWidth>
              <FormLabel>{dictionary?.placeholders?.[field.label] || field.label}</FormLabel>
              <RadioGroup
                row
                value={row[field.name] ?? ''}
                onChange={e => {
                  handleInputChange(rowIndex, field.name, e.target.value)
                  const updatedRow = {
                    ...row,
                    [field.name]: e.target.value,
                    rowChanged: true
                  }
                  if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                }}
              >
                {field.options.map((option: any, i: number) => (
                  <FormControlLabel
                    key={i}
                    value={option.value}
                    control={<Radio />}
                    label={dictionary?.placeholders?.[option.label] || option.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )
        }

        // Toggle
        if (field.type === 'toggle' && field.options) {
          if (mode === 'show') {
            const selectedOption = field.options.find((opt: any) => opt.value === row[field.name])
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {selectedOption ? dictionary?.placeholders?.[selectedOption.label] || selectedOption.label : '-'}
                </Typography>
              </Box>
            )
          }

          const activeValue = row[field.name] ?? ''

          return (
            <FormControl required={field.required} fullWidth>
              <FormLabel
                sx={{ mb: 1.5, display: 'block', fontWeight: 500, fontSize: '0.875rem', color: 'text.secondary' }}
              >
                {dictionary?.placeholders?.[field.label] || field.label}
              </FormLabel>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: `repeat(${field.options.length}, 1fr)`
                  },
                  gap: 3,
                  width: '100%'
                }}
              >
                {field.options.map((option: any, i: number) => {
                  const isSelected = String(activeValue) === String(option.value)
                  const optionLabel = dictionary?.placeholders?.[option.label] || option.label
                  const optionIcon = option.icon
                  const optionColor = option.color || 'primary'

                  return (
                    <Box
                      key={i}
                      onClick={() => {
                        const value = option.value
                        handleInputChange(rowIndex, field.name, value)
                        const updatedRow = {
                          ...row,
                          [field.name]: value,
                          rowChanged: true
                        }
                        if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                      }}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        borderRadius: '12px',
                        border: theme =>
                          `2px solid ${isSelected ? (theme.palette as any)[optionColor]?.main || theme.palette.primary.main : 'var(--mui-palette-divider)'}`,
                        backgroundColor: isSelected
                          ? theme =>
                              (theme.palette as any)[optionColor]?.lighterOpacity ||
                              `rgba(${((theme.palette as any)[optionColor]?.mainChannel || '0,0,0').split(' ').join(',')}, 0.08)`
                          : 'background.paper',
                        transition: 'all 0.2s ease-in-out',
                        textAlign: 'center',
                        '&:hover': {
                          borderColor: !isSelected ? 'primary.main' : undefined,
                          transform: !isSelected ? 'translateY(-2px)' : undefined,
                          boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)'
                        }
                      }}
                    >
                      {optionIcon && (
                        <Box
                          sx={{
                            fontSize: '1.75rem',
                            color: isSelected ? `${optionColor}.main` : 'text.secondary',
                            mb: 1,
                            display: 'flex'
                          }}
                        >
                          <i className={optionIcon} />
                        </Box>
                      )}

                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 600,
                          color: isSelected ? 'primary.main' : 'text.primary',
                          mb: 2
                        }}
                      >
                        {optionLabel}
                      </Typography>

                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: theme =>
                            `2px solid ${isSelected ? (theme.palette as any)[optionColor]?.main : 'var(--mui-palette-divider)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: isSelected ? `${optionColor}.main` : 'transparent',
                          transition: 'all 0.2s',
                          '&::after': isSelected
                            ? {
                                content: '""',
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'white'
                              }
                            : {}
                        }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </FormControl>
          )
        }

        // Date
        if (field.type === 'date') {
          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {row[field.name] ? format(new Date(String(row[field.name]).replace(' ', 'T')), 'yyyy-MM-dd') : '-'}
                </Typography>
              </Box>
            )
          }

          return (
            <FormControl fullWidth error={!!errors[rowIndex]?.[field.name]?.message}>
              <DatePickerComponent
                disabled={field?.disabled}
                value={row[field.name] ? String(row[field.name]) : null}
                onChange={(val: string | null) => {
                  const formattedDate = val ? formatDateToYMD(new Date(val)) : null
                  handleInputChange(rowIndex, field.name, formattedDate)
                  field.onChange?.(formattedDate, rowIndex)
                  const updatedRow = {
                    ...row,
                    [field.name]: formattedDate,
                    rowChanged: true
                  }
                  if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                }}
                error={errors[rowIndex]?.[field.name]}
                helperText={errors[rowIndex]?.[field.name]?.message}
                label={dictionary?.placeholders?.[field.label] || field.label}
                now={field?.now ?? false}
              />
            </FormControl>
          )
        }

        // Hijri Date
        if (field.type === 'hijri_date') {
          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {row[field.name]
                    ? (() => {
                        const cleaned = String(row[field.name]).replace(/\D/g, '')
                        if (cleaned.length <= 4) return cleaned
                        if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
                        return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
                      })()
                    : '-'}
                </Typography>
              </Box>
            )
          }

          return (
            <TextField
              label={dictionary?.placeholders?.[field.label] || field.label}
              disabled={field?.disabled}
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

                const updatedRow = {
                  ...row,
                  [field.name]: numericValue,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              size='small'
              inputProps={{
                inputMode: 'numeric',
                maxLength: 10
              }}
            />
          )
        }

        // Time
        if (field.type === 'time') {
          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {dayjs(`1970-01-01T${row[field.name]}`).format(field?.use24Hours ? 'HH:mm' : 'hh:mm A')}
                </Typography>
              </Box>
            )
          }

          return (
            <TimePicker
              value={row[field.name] || ''}
              locale={locale as Locale}
              dictionary={dictionary}
              use24Hours={field?.use24Hours}
              pickerType={field?.pickerInputType}
              disabled={field?.disabled}
              now={field?.now ?? false}
              onChange={value => {
                handleInputChange(rowIndex, field.name, value)

                const updatedRow = {
                  ...row,
                  [field.name]: value,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              label={dictionary?.placeholders?.[field.label] || field.label}
              error={!!errors[rowIndex]?.[field.name]?.message}
              helperText={errors[rowIndex]?.[field.name]?.message}
            />
          )
        }

        // Rich Text
        if (field.type === 'rich_text') {
          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Box sx={{ color: '#666', mt: 0.5 }} dangerouslySetInnerHTML={{ __html: row[field.name] || '-' }} />
              </Box>
            )
          }

          return (
            <RichTextEditor
              value={row[field.name] || ''}
              onChange={(value: string) => {
                handleInputChange(rowIndex, field.name, value)

                const updatedRow = {
                  ...row,
                  [field.name]: value,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              label={dictionary?.placeholders?.[field.label] || field.label}
              placeholder={dictionary?.placeholders?.[field.label] || field.label}
              error={!!errors[rowIndex]?.[field.name]?.message}
              disabled={field.disabled}
              helperText={errors[rowIndex]?.[field.name]?.message}
            />
          )
        }

        // Slider
        if (field.type === 'slider') {
          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {row[field.name] || 0}
                </Typography>
              </Box>
            )
          }

          return (
            <FormControl fullWidth>
              <FormLabel>{dictionary?.placeholders?.[field.label] || field.label}</FormLabel>
              <Slider
                value={row[field.name] || 0}
                onChange={(e, value) => {
                  handleInputChange(rowIndex, field.name, value)

                  const updatedRow = {
                    ...row,
                    [field.name]: value,
                    rowChanged: true
                  }
                  if (onChangeRow) onChangeRow(updatedRow, rowIndex)
                }}
                min={field.min || 0}
                max={field.max || 100}
                disabled={field?.disabled}
              />
              {errors[rowIndex]?.[field.name]?.message && (
                <Typography color='error' variant='caption'>
                  {errors[rowIndex]?.[field.name]?.message}
                </Typography>
              )}
            </FormControl>
          )
        }

        // Icon Picker
        if (field.type === 'icon_picker') {
          if (mode === 'show' || field.mode === 'show') {
            const iconValue = row[field.name]
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  {iconValue && <i className={iconValue} style={{ fontSize: '1.25rem' }} />}
                  <Typography variant='body1' sx={{ color: '#666' }}>
                    {iconValue || '-'}
                  </Typography>
                </Box>
              </Box>
            )
          }

          return (
            <IconPickerField
              label={dictionary?.placeholders?.[field.label] || field.label}
              value={row[field.name] ?? ''}
              error={!!errors[rowIndex]?.[field.name]?.message}
              helperText={errors[rowIndex]?.[field.name]?.message}
              disabled={field?.disabled}
              placeholder={dictionary?.placeholders?.[field.placeholder] || field.placeholder}
              dictionary={dictionary}
              onChange={val => {
                handleInputChange(rowIndex, field.name, val)

                const updatedRow = {
                  ...row,
                  [field.name]: val,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
            />
          )
        }

        // File
        if (field.type === 'file') {
          const filesList = row.files || []
          const fileData = filesList.find((f: any) => f.description === field.name)

          if (mode === 'show') {
            return (
              <>
                <Box className='system-view'>
                  <FilePreview
                    dictionary={dictionary}
                    filePath={fileData?.path}
                    fileName={fileData?.name}
                    label={dictionary?.placeholders?.[field.label] || field.label}
                  />
                </Box>

                <Typography className='print-view' variant='body1'>
                  {fileData ? fileData?.name || 'ملف مرفق' : '-'}
                </Typography>
              </>
            )
          }

          const fileType: FileType = fileData?.ext || 'unknown'
          const fileName = fileData?.name?.split('/').pop()

          return (
            <Box display='flex' alignItems='center' gap={1} onClick={e => e.stopPropagation()}>
              <Box width='100%'>
                <input
                  hidden
                  id={`file-upload-${field.name}-${rowIndex}`}
                  type='file'
                  multiple={field.multiple}
                  accept={field.accept || field.typeAllowed?.join(', ') || '*'}
                  onChange={e => {
                    e.stopPropagation()
                    handleFileUpload(e, field.name, field)
                  }}
                />

                <FileCard
                  dictionary={dictionary}
                  fileName={fileName}
                  fileType={fileType}
                  subtitle={FILE_TYPE_META[fileType as keyof typeof FILE_TYPE_META]?.label || 'File'}
                  loading={!!uploadingFiles[field.name]}
                  onUpload={() => document.getElementById(`file-upload-${field.name}-${rowIndex}`)?.click()}
                  onDownload={fileData ? () => handleFileDownload(fileData.path) : undefined}
                  onDelete={fileData ? () => handleFileDelete(field.name, fileData.id) : undefined}
                />

                {errors[rowIndex]?.[field.name]?.message && (
                  <Typography color='error' variant='caption'>
                    {errors[rowIndex][field.name].message}
                  </Typography>
                )}
              </Box>
            </Box>
          )
        }

        // Personal Picture
        if (field.type === 'personal_picture') {
          const filesList = row.files || []
          const fileData = filesList.find((f: any) => f.description === field.name)
          const imageSrc = fileData?.path || '/images/avatars/personal-pic-avatar.jpg'

          if (mode === 'show') {
            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                <Box className='relative flex max-sm:flex-col items-center gap-6'>
                  <Box className='relative'>
                    <img
                      height={160}
                      width={160}
                      className='rounded shadow-sm border border-divider transition-transform duration-300 hover:scale-[1.02] cursor-pointer'
                      src={imageSrc}
                      alt={field.label || 'Profile'}
                      style={{ objectFit: 'cover' }}
                      onClick={() => setPreviewImage(imageSrc)}
                    />
                  </Box>
                </Box>
              </Box>
            )
          }

          return (
            <Box className='flex flex-col items-center gap-4'>
              <Box className='relative'>
                <img
                  height={160}
                  width={160}
                  className='rounded shadow-sm border border-divider transition-transform duration-300 hover:scale-[1.02] cursor-pointer'
                  src={imageSrc}
                  alt={field.label || 'Profile'}
                  style={{ objectFit: 'cover' }}
                  onClick={() => setPreviewImage(imageSrc)}
                />
                <input
                  hidden
                  id={`personal-pic-${field.name}-${rowIndex}`}
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={e => handleFileUpload(e, field.name, field)}
                />
              </Box>
              <label htmlFor={`personal-pic-${field.name}-${rowIndex}`}>
                <IconButton component='span' color='primary'>
                  <i className='ri-upload-2-line' />
                </IconButton>
              </label>
            </Box>
          )
        }

        if (field.type === 'color_picker') {
          if (mode === 'show') {
            const colorValue = row[field.name] ? String(row[field.name]) : null

            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                {colorValue ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '4px',
                        backgroundColor: colorValue,
                        border: '1px solid',
                        borderColor: 'divider',
                        flexShrink: 0
                      }}
                    />
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {colorValue}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    -
                  </Typography>
                )}
              </Box>
            )
          }

          return (
            <ColorPickerField
              label={dictionary?.placeholders?.[field.label] || field.label}
              value={row[field.name] ? String(row[field.name]) : '#7367f0'}
              onChange={color => {
                handleInputChange(rowIndex, field.name, color)
                field.onChange?.(color)

                const updatedRow = {
                  ...row,
                  [field.name]: color,
                  rowChanged: true
                }
                if (onChangeRow) onChangeRow(updatedRow, rowIndex)
              }}
              error={!!errors[rowIndex]?.[field.name]?.message}
              helperText={errors[rowIndex]?.[field.name]?.message}
              required={field.required}
              disabled={field.disabled || false}
            />
          )
        }

        // Add this in the field type checking section

        // Multi-File Upload
        // Multi-File Upload (storage type)
        if (field.type === 'multi_file') {
          const allFilesList = row.files || []

          if (mode === 'show') {
            // ✅ Filter files for THIS field only
            const fieldFiles = allFilesList.filter((f: any) => f.description === field.name)

            return (
              <Box sx={{ py: 1 }}>
                <Typography className='mb-2' variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                  {dictionary?.placeholders?.[field.label] || field.label}
                </Typography>
                {fieldFiles.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {fieldFiles.map((file: any, idx: number) => (
                      <FilePreview key={idx} dictionary={dictionary} filePath={file.path} fileName={file.name} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant='body2' color='text.secondary'>
                    -
                  </Typography>
                )}
              </Box>
            )
          }
          console.log(field)
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
        }

        // Empty
        if (field.type === 'empty') {
          return <div></div>
        }

        return null
      },
      [
        mode,
        row,
        rowIndex,
        dictionary,
        errors,
        handleInputChange,
        getDisplayValue,
        locale,
        uploadingFiles,
        handleFileUpload,
        handleFileDownload,
        handleFileDelete
      ]
    )

    return (
      <>
        <Grid container spacing={2}>
          {fields.map((field: any, fieldIndex: number) => (
            <Grid size={{ xs: 12, sm: field.gridSize ?? 6 }} key={`${field.name}-${fieldIndex}`}>
              {renderField(field, fieldIndex)}
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={!!previewImage}
          onClose={() => setPreviewImage(null)}
          maxWidth='md'
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              backgroundColor: isMobile ? 'black' : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              overflow: 'hidden',
              borderRadius: isMobile ? 0 : '16px',
              border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box
              sx={{
                position: 'absolute',
                right: 16,
                top: isMobile ? 40 : 16,
                zIndex: 10,
                display: 'flex',
                gap: 2,
                direction: 'ltr' // Keep icons consistent regardless of app direction
              }}
            >
              {previewImage && (
                <IconButton
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = previewImage
                    link.download = `image-${Date.now()}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    width: isMobile ? 44 : 40,
                    height: isMobile ? 44 : 40,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)'
                    },
                    backdropFilter: 'blur(4px)'
                  }}
                  title='تحميل الصورة'
                >
                  <i className='ri-download-2-line' style={{ fontSize: isMobile ? '1.5rem' : '1.25rem' }} />
                </IconButton>
              )}
              <IconButton
                onClick={() => setPreviewImage(null)}
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  width: isMobile ? 44 : 40,
                  height: isMobile ? 44 : 40,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  },
                  backdropFilter: 'blur(4px)'
                }}
                title='إغلاق'
              >
                <i className='ri-close-line' style={{ fontSize: isMobile ? '1.5rem' : '1.25rem' }} />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              p: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              minHeight: isMobile ? '100vh' : 400,
              backgroundColor: 'black'
            }}
          >
            {previewImage && (
              <img
                src={previewImage}
                alt='Preview'
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.4)'
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

ModalFieldsRenderer.displayName = 'ModalFieldsRenderer'
