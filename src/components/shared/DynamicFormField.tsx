import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Switch,
  Box,
  Typography,
  Controller,
  ListOfValue,
  Slider,
  InputAdornment,
  handleSave,
  useFormContext,
  useParams,
  useSessionHandler,
  toast,
  IconButton,
  Button,
  getFileByDescription,
  formatDateToYMD,
  isBase64File,
  parseBase64File,
  previewBase64File,
  downloadBase64File,
  getFileType,
  resolveDisplayValueFormField,
  getItemFromStaticListByValue,
  Chip,
  statusList,
  formatNumber,
  Input,
  resolveStaticFields,
  Tooltip,
  OTPVerificationModal,
  getAutoCompleteValue,
  ColorPickerField,
  IconPickerField,
  getIdPath,
  resolvePath
} from '@/shared'
import type { DynamicFormFieldProps, FileType, Locale, SearchMode } from '@/shared'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { getDictionary } from '@/utils/getDictionary'
import { addDays, format } from 'date-fns'
import axios from 'axios'
import RichTextEditor from './RichTextEditor'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useFileExtraUpload } from '@/hooks/useFileExtraUpload'
import FilePreview from './FilePriview'
import FileCard from './FileCard'
import { FILE_TYPE_META } from '@/types/file'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import CustomBadge from '@/@core/components/mui/Badge'
import TimePicker from './TimePicker'
import DatePickerComponent from './DatePicker'
import dayjs from 'dayjs'
import { useOperatorConfig } from '@/hooks/useOperatorConfig'
import { useDialog } from '@/contexts/dialogContext'
import { description, maxLength } from 'valibot'
import { useWatch, Watch } from 'react-hook-form'
import DateRangeField from './DateRangeField'
import { convertToHijri, getFormattedHijriDate } from '@/utils/hijriConverter'
import MultiFileUploader from './MultiFileUploader'
import { Color } from '@iconify/utils/lib/colors/types'
import IconBadge from './IconBadge'
import data from '@/data/searchData'
import { Dialog, DialogContent, DialogTitle, useMediaQuery } from '@mui/material'
import ContractorTypeListPage from '@/app/[lang]/(dashboard)/(private)/apps/acs/contractor-type/list/page'
interface PickerProps {
  label?: string
  error?: any
  registername?: string
  helperText: string
}

const PickersComponent = forwardRef(({ error, helperText, ...props }: PickerProps, ref) => {
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
})

export const DynamicFormField = ({
  name,
  label,
  type,
  control,
  mode,
  gridRef = '',
  required = false,
  visible = true,
  disabled = false,
  options = [],
  apiUrl = '',
  placeholder = '',
  helpText = '',
  tooltip = '',
  readOnly = false,
  rowIndex = 0,
  errors = {},
  onChange,
  onBlur,
  onFocus,
  keyProp = 'value',
  labelProp = 'label',
  gridSize,
  screenMode,
  queryParams = {},
  children = [],
  defaultValue = null,
  viewProp = '',
  editProp = '',
  dataObject = {},
  inputAdornment = '',
  locale = '',
  cacheWithDifferentKey = false,
  lovKeyName = null,
  cache = false,
  displayProps = [],
  typeAllowed = [],
  sizeAllowed = null,
  multiple = false,
  multipleKeyProp,
  searchProps = [],
  searchMode = '' as SearchMode,
  searchInBackend = true,
  extraField = false,
  fileableType = '',
  autoFill = false,
  use24Hours = true,
  modalConfig = {},
  selectFirstValue,
  pickerInputType = 'input',
  apiMethod = 'POST',
  submitLovKeyProp,
  isStaticProp,
  verificationRequired = false,
  autoComplete = '',
  minLength = undefined,
  length = undefined,
  maxLength = undefined,
  maxFiles = undefined,
  presetColors = undefined,
  showAlpha = undefined,
  displayWithBadge = false,
  badgeColor = 'primary',
  responseDataKey = undefined,
  showCurrency = true,
  showTime = false,
  showHijri = true,
  showPrimary = true,
  now = false,
  perPage = undefined,
  skipDataSuffix = false
}: DynamicFormFieldProps) => {
  const commonTextFieldSx = {
    '& .MuiInputBase-input': {
      color: 'var(--mui-palette-text-primary, #fff)'
    },
    ...(readOnly || disabled
      ? {
        '& .MuiInputBase-input': {
          WebkitTextFillColor: '#666 !important',
          color: '#666 !important'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#666 !important'
        },
        '& .MuiInputLabel-root': {
          color: '#999 !important'
        }
      }
      : {})
  }

  const effectiveMode = resolveStaticFields({ name, type, autoFill }) && mode !== 'search' ? 'show' : mode
  const { setValue, getValues, clearErrors: clearFormErrors, watch } = useFormContext()
  const { accessToken, user } = useSessionHandler()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [verificationStatus, setVerificationStatus] = useState<{
    email?: boolean
    mobile?: boolean
  }>({})
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [verificationField, setVerificationField] = useState<{
    type: 'email' | 'mobile'
    value: string
  } | null>(null)

  // ✅ Use useRef instead of useState for initialValues to prevent re-renders
  const initialValuesRef = useRef<{
    email?: string
    mobile?: string
  }>({})
  const { screenData } = useScreenPermissions('*')
  const [dictionary, setDictionary] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { openDialog } = useDialog()

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  const { backendUrl } = useOperatorConfig()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isTextarea = target.tagName === 'TEXTAREA'

    // ✅ Allow Enter inside textarea (new line)
    if (event.key === 'Enter' && isTextarea && !event.ctrlKey && !event.metaKey) {
      return
    }

    // 🚀 Use Ctrl/Meta + Enter to move from textarea
    if (event.key === 'Enter') {
      event.preventDefault()

      const form = gridRef.current
      if (!form) return

      const inputs = Array.from(form.querySelectorAll('input, select, textarea')) as HTMLElement[]

      const index = inputs.indexOf(target)
      if (index === -1) return

      for (let i = index + 1; i < inputs.length; i++) {
        const nextInput = inputs[i] as HTMLElement
        if (!nextInput.hasAttribute('disabled') && nextInput.offsetParent !== null) {
          nextInput.focus()
          break
        }
      }
    }
  }

  const handleFocus = () => onFocus?.()

  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [focusedField, setFocusedField] = useState<string | null>(null)
  // Handle verification success

  const fieldValue = watch(name)

  // ✅ FIX: Stabilize processedSelectValue by using a ref to track previous value
  const prevFieldValueRef = useRef(fieldValue)
  const prevProcessedValueRef = useRef<any>(null)

  const processedSelectValue = useMemo(() => {
    if (type !== 'select' || !multiple || !Array.isArray(fieldValue)) {
      prevFieldValueRef.current = fieldValue
      return fieldValue
    }

    // ✅ Check if fieldValue actually changed (deep comparison for arrays)
    const hasChanged =
      !prevFieldValueRef.current ||
      !Array.isArray(prevFieldValueRef.current) ||
      fieldValue.length !== prevFieldValueRef.current.length ||
      fieldValue.some((val, idx) => {
        const prev = prevFieldValueRef.current[idx]
        if (typeof val === 'object' && typeof prev === 'object') {
          return JSON.stringify(val) !== JSON.stringify(prev)
        }
        return val !== prev
      })

    // ✅ If nothing changed, return the previous processed value to prevent re-renders
    if (!hasChanged && prevProcessedValueRef.current !== null) {
      return prevProcessedValueRef.current
    }

    // ✅ Process the new value
    const processed = fieldValue.map((item: any) => {
      if (typeof item === 'object' && item !== null) {
        // ✅ Use submitLovKeyProp if exists, else multipleKeyProp
        if (submitLovKeyProp && item.hasOwnProperty(submitLovKeyProp)) {
          return item[submitLovKeyProp]
        }
        if (multipleKeyProp && item.hasOwnProperty(multipleKeyProp)) {
          return item[multipleKeyProp]
        }
      }
      return item // primitive value or object without keys
    })

    // ✅ Cache the result
    prevFieldValueRef.current = fieldValue
    prevProcessedValueRef.current = processed
    return processed
  }, [fieldValue, multiple, multipleKeyProp, submitLovKeyProp, type])

  const allFilesList = getValues('files') || []

  // if (!visible) return null

  if (!mounted) return null

  const getNestedValue = (obj: any, path: string): any => {
    if (!obj || !path) return null

    const keys = path.split('.')
    return keys.reduce((acc: any, key: string) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key]
      }
      return null
    }, obj)
  }
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ?? null}
        render={({ field, fieldState }) => {
          const { error } = fieldState
          // const [personalPic, setPersonalPic] = useState(field.value || '/images/avatars/personal-pic-avatar.jpg')

          // ✅ NEW: Get edit value from editProp if in edit mode
          const editValue = useMemo(() => {
            // Only apply in edit mode
            if (effectiveMode !== 'edit' && effectiveMode !== 'add') return null

            // Need editProp and dataObject with data
            if (!editProp || !dataObject || Object.keys(dataObject).length === 0) return null

            // Get nested value using dot notation
            const value = getNestedValue(dataObject, editProp)

            // Debug log in development
            if (process.env.NODE_ENV === 'development' && value !== null) {
              // console.log(`📝 editProp [${name}]:`, {
              //   editProp,
              //   value,
              //   type: typeof value
              // })
            }

            return value
          }, [effectiveMode, editProp, dataObject, name])

          // ✅ Determine effective field value (editValue takes priority)
          const effectiveFieldValue = editValue !== null && editValue !== undefined ? editValue : field.value

          const extraUploader = useFileExtraUpload({
            name: field.name,
            setValue,
            multiple: multiple || false,
            typeAllowed,
            sizeAllowed
          })

          const normalUploader = useFileUpload({
            name: field.name,
            accessToken,
            getValues,
            setValue,
            multiple: multiple || false,
            typeAllowed,
            sizeAllowed,
            fileableType: fileableType
          })

          // Update the displayValue useMemo (around line 129):

          const displayValue = useMemo(() => {
            if (effectiveMode === 'show') {
              // ✅ Prepare viewProp paths
              const paths = viewProp ? (Array.isArray(viewProp) ? viewProp : [viewProp]) : []

              // ✅ Try viewProp first with dataObject
              if (paths.length > 0 && dataObject && Object.keys(dataObject).length > 0) {
                const values = paths
                  .map(path => {
                    const keys = path.split('.')
                    return keys.reduce((acc: any, key: string) => (acc ? acc[key] : null), dataObject)
                  })
                  .filter(v => v !== null && v !== undefined && v !== '')

                if (values.length > 0) {
                  let result = values.join(' - ')

                  // Special case: select with single string path
                  if (
                    type === 'select' &&
                    !Array.isArray(viewProp) &&
                    typeof viewProp === 'string' &&
                    viewProp.includes('.') &&
                    showPrimary
                  ) {
                    const idPath = getIdPath(viewProp)
                    const idValue = resolvePath(dataObject, idPath)

                    if (idValue !== undefined && idValue !== null) {
                      result = `(${idValue}) ${result}`
                    }
                  }

                  return result
                }
              }

              // ✅ If viewProp didn't work, try getting the full record from form values
              if (paths.length > 0) {
                const allValues = getValues() // Get all form values
                const values = paths
                  .map(path => {
                    const keys = path.split('.')
                    return keys.reduce((acc: any, key: string) => (acc ? acc[key] : null), allValues)
                  })
                  .filter(v => v !== null && v !== undefined && v !== '')

                if (values.length > 0) {
                  if (type === 'select' && typeof viewProp === 'string' && viewProp.includes('.') && options) {
                    if (options.length > 0) {
                      const selectedOption = options.find((option: any) => String(option.value) === String(values[0]))
                      return selectedOption ? selectedOption.label : values[0]
                    }
                  }
                  return values.join(' - ')
                }
              }

              // ✅ Handle select fields
              if (type === 'select') {
                const value = field.value

                // If field.value is an object with a 'value' property
                if (value && typeof value === 'object' && 'value' in value) {
                  const actualValue = value.value
                  if (options.length > 0) {
                    const selectedOption = options.find((option: any) => String(option.value) === String(actualValue))
                    return selectedOption ? selectedOption.label : actualValue
                  }
                  return actualValue
                }

                // If field.value is a primitive
                if (options.length > 0) {
                  const selectedOption = options.find((option: any) => String(option.value) === String(value))
                  return selectedOption ? selectedOption.label : value
                }

                return value
              }
            }
            return null
          }, [effectiveMode, viewProp, dataObject, type, options, field.value, getValues])
          // useEffect(() => {
          //   const filesList = getValues('files') || []
          //   if (filesList && filesList.length) {
          //     const file = getFileByDescription(filesList, name)
          //     if (file) {
          //       if (type === 'personal_picture') {
          //         setPersonalPic(file.path)
          //       }
          //     }
          //   }
          // }, [name, type])

          // Track initial values and verification status
          // ✅ Fixed useEffect - removed initialValues from dependencies
          useEffect(() => {
            if (effectiveMode === 'show' || effectiveMode === 'search') return

            if ((type === 'email' || type === 'mobile') && verificationRequired) {
              const currentValue = field.value

              // Store initial value using ref
              if (!initialValuesRef.current[type]) {
                initialValuesRef.current = {
                  ...initialValuesRef.current,
                  [type]: currentValue
                }
              }

              // Check if value has changed from initial
              const hasChanged = initialValuesRef.current[type] && initialValuesRef.current[type] !== currentValue

              if (!hasChanged && currentValue) {
                // Value hasn't changed, assume it's verified
                setVerificationStatus(prev => ({ ...prev, [type]: true }))
              } else if (hasChanged) {
                // Value changed, needs verification
                setVerificationStatus(prev => ({ ...prev, [type]: false }))
              }
            }
          }, [field.value, type, verificationRequired, effectiveMode]) // ✅ Removed initialValues

          // Handle verification success
          const handleVerificationSuccess = () => {
            if (verificationField) {
              setVerificationStatus(prev => ({
                ...prev,
                [verificationField.type]: true
              }))

              // ✅ Update ref instead of state
              initialValuesRef.current = {
                ...initialValuesRef.current,
                [verificationField.type]: verificationField.value
              }

              toast.success('تم التحقق بنجاح')
            }
          }

          // Handle verification icon click
          const handleVerificationClick = () => {
            const currentValue = field.value
            if (!currentValue) {
              toast.error(type === 'email' ? 'الرجاء إدخال البريد الإلكتروني أولاً' : 'الرجاء إدخال رقم الجوال أولاً')
              return
            }

            setVerificationField({
              type: type as 'email' | 'mobile',
              value: currentValue
            })
            setShowOTPModal(true)
          }

          // ✅ Get verification icon - updated to use ref
          const getVerificationIcon = () => {
            const hasChanged = initialValuesRef.current[type as 'email' | 'mobile'] !== field.value
            const isVerified = verificationStatus[type as 'email' | 'mobile']

            if (!field.value) return null

            if (!hasChanged && isVerified) {
              // Not changed and verified
              return (
                <InputAdornment position='end'>
                  <IconButton disabled>
                    <i className='ri-checkbox-circle-fill' style={{ color: 'green' }} />
                  </IconButton>
                </InputAdornment>
              )
            }

            if (hasChanged || !isVerified) {
              // Changed or not verified - show verification button
              return (
                <InputAdornment position='end'>
                  <Tooltip title='انقر للتحقق'>
                    <IconButton onClick={handleVerificationClick} color='warning'>
                      <i className='ri-shield-check-line' />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }

            return null
          }

          // ========== End Verification Required ==========

          // ========== SHOW MODE ==========
          if (effectiveMode === 'show') {
            if (type === 'checkbox' || type === 'switch') {
              const isChecked = field.value
              return (
                <>
                  <Box className='system-view' sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      {isChecked || isStaticProp ? (
                        <Typography sx={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                          {/* <i className='ri-checkbox-circle-fill' /> */}
                          <CustomBadge
                            color={'success'}
                            badgeContent={<i className={`icon-base ri ri-check-line`} />}
                            tonal='true'
                            sx={{ marginInlineStart: '20px' }}
                          />
                          {dictionary?.placeholders?.[options[0]?.[labelProp]]}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                          {/* <i className='ri-close-circle-fill' /> */}
                          <CustomBadge
                            color={'error'}
                            badgeContent={<i className='icon-base ri ri-close-line' />}
                            tonal='true'
                            sx={{ marginInlineStart: '20px' }}
                          />
                          {dictionary?.placeholders?.[options[0]?.[labelProp]]}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <div className='print-view'>
                    {isChecked ? (
                      <Typography sx={{ color: 'green', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        نعم
                      </Typography>
                    ) : (
                      <Typography sx={{ color: 'red', display: 'flex', alignItems: 'center', gap: 0.5 }}>لا</Typography>
                    )}
                  </div>
                </>
              )
            }
            // Add this in the SHOW MODE section
            if (type === 'checkboxToggle') {
              const selectedValues = effectiveFieldValue || defaultValue || []
              const selectedOptions = Array.isArray(selectedValues)
                ? options.filter((opt: any) =>
                  selectedValues.some((v: any) => String(v) === String(opt[keyProp || 'value']))
                )
                : []
              const displayLabels = selectedOptions
                .map((opt: any) => dictionary?.placeholders?.[opt[labelProp || 'label']] || opt[labelProp || 'label'])
                .join(', ')

              return (
                <>
                  <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                      {selectedOptions.length > 0 ? (
                        selectedOptions.map((opt: any, idx: number) => {
                          const optionLabel =
                            dictionary?.placeholders?.[opt[labelProp || 'label']] || opt[labelProp || 'label']
                          const optionColor = opt.color || 'primary'
                          return (
                            <Chip
                              key={idx}
                              variant='tonal'
                              label={optionLabel}
                              size='small'
                              color={optionColor}
                              sx={{
                                borderRadius: '50rem',
                                height: 24,
                                fontSize: '0.75rem'
                              }}
                            />
                          )
                        })
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          -
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {displayLabels || '-'}
                  </Typography>
                </>
              )
            }
            if (type === 'amount') {
              const rawValue = effectiveFieldValue ?? ''

              const formattedNumber = formatNumber(
                rawValue,
                0, // أو fieldConfig.decimals
                { locale: 'en-SA', useCurrency: showCurrency }
              )

              return (
                <>
                  <Box sx={{ pt: 0, pb: 1, mt: '-5px' }} className='system-view'>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>

                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {formattedNumber}
                    </Typography>
                  </Box>

                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {formattedNumber}
                  </Typography>
                </>
              )
            }
            if ((type === 'date' || type === 'date_time') && (displayValue || field.value)) {
              const dateVal = displayValue || field.value || null
              let formattedDate = 'Invalid Date'
              let hijriDate = null
              let timeString = ''

              let showTimeField = type === 'date_time' ? true : showTime

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
                  <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {formattedDate}
                    </Typography>
                    {/* ✅ Show Hijri */}

                    {showTimeField ? (
                      <>
                        <span className='text-xs text-gray-500 italic' style={{ fontSize: '0.65rem' }}>
                          {timeString}
                        </span>
                        {showHijri && (
                          <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                            {hijriDate} هـ
                          </Typography>
                        )}
                      </>
                    ) : (
                      <>
                        {showHijri
                          ? hijriDate && (
                            <Typography variant='caption' sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                              {hijriDate} هـ
                            </Typography>
                          )
                          : null}
                      </>
                    )}
                  </Box>

                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {formattedDate} ({hijriDate} هـ)
                  </Typography>
                </>
              )
            }

            if (type === 'hijri_date' && field.value) {
              const formatHijriDisplay = (value: string | number | null | undefined) => {
                if (!value) return '-'
                const cleaned = String(value).replace(/\D/g, '')
                if (cleaned.length <= 4) return cleaned
                if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
                return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
              }

              return (
                <>
                  <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>
                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {formatHijriDisplay(field.value)}
                    </Typography>
                  </Box>

                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {formatHijriDisplay(field.value)}
                  </Typography>
                </>
              )
            }

            if (type === 'time' && field.value) {
              const timeValue = displayValue || field.value
              // Use Dayjs to format
              const formattedTime = dayjs(`1970-01-01T${timeValue}`).format(use24Hours ? 'HH:mm' : 'hh:mm A')

              return (
                <>
                  <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>

                    <Typography variant='body1' sx={{ color: '#666' }}>
                      {formattedTime}
                    </Typography>
                  </Box>

                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {formattedTime}
                  </Typography>
                </>
              )
            }

            if (type === 'rich_text') {
              return (
                <>
                  <Box sx={{ pt: 0, pb: 1, mt: '-5px' }} className='system-view'>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>
                    <Box
                      sx={{ color: '#666' }}
                      dangerouslySetInnerHTML={{ __html: displayValue || field.value || '-' }}
                    />
                  </Box>

                  <Box
                    className='print-view'
                    sx={{ color: '#666', mt: 0.5 }}
                    dangerouslySetInnerHTML={{ __html: displayValue || field.value || '-' }}
                  />
                </>
              )
            }
            if (type === 'multi_file') {
              const fieldFiles = allFilesList.filter((f: any) => f.description === field.name)
              return (
                <>
                  <Box sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label] || label}
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
                </>
              )
            }

            if (type === 'personal_picture') {
              // ✅ Get personal picture from files array by description
              const filesList = getValues('files') || []
              const personalPicFile = filesList.find((f: any) => f.description === name)
              const displayPic = personalPicFile?.path || '/images/avatars/personal-pic-avatar.jpg'

              return (
                <>
                  <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>
                    <Box className='relative flex max-sm:flex-col items-center gap-6'>
                      <Box className='relative'>
                        <img
                          height={160}
                          width={160}
                          className='rounded-md shadow-sm border border-divider transition-transform duration-300 hover:scale-[1.02] cursor-pointer'
                          src={displayPic}
                          alt={label || 'Profile'}
                          style={{ position: 'relative', zIndex: 1 }}
                          onClick={() => {
                            console.log(mode)
                            if (mode === 'show') {
                              setPreviewImage(displayPic)
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <div className='print-view'>
                    <img height={100} width={100} className='rounded-md' src={displayPic} alt={label || 'Profile'} />
                  </div>
                </>
              )
            }

            if (type === 'file' && extraField) {
              const value = field.value

              const isBase64 = isBase64File(value)
              const fileInfo = isBase64 ? parseBase64File(value) : null
              const fileType: FileType = fileInfo?.extension ? getFileType(fileInfo.extension) : 'unknown'

              return (
                <>
                  <Box className='system-view'>
                    <FilePreview
                      dictionary={dictionary}
                      filePath={value}
                      fileName={
                        fileInfo?.extension
                          ? `${dictionary?.placeholders?.['file']}.${fileInfo.extension}`
                          : dictionary?.placeholders?.['attached_file']
                      } // use extension as filenam
                      mode='auto'
                      // fileName={value?.split('/').pop()}
                      label={dictionary?.placeholders?.[label]}
                    />
                  </Box>

                  <Typography className='print-view' variant='body1'>
                    {value ? dictionary?.placeholders?.['attached_file'] : '-'}
                  </Typography>
                </>
              )
            }

            if (type === 'file' && !extraField) {
              const filesList = getValues('files') || []
              const fileData = filesList.find((f: any) => f.description === name)

              return (
                <>
                  <Box className='system-view'>
                    <FilePreview
                      dictionary={dictionary}
                      filePath={fileData?.path}
                      fileName={fileData?.name?.split('/').pop()}
                      label={dictionary?.placeholders?.[label]}
                    />
                  </Box>
                  <Typography className='print-view' variant='body1'>
                    {fileData ? fileData.name?.split('/').pop() : '-'}
                  </Typography>
                </>
              )
            }

            if (type === 'select' && field.name && !apiUrl && options.length > 0) {
              if (field.name.includes('status') || field.name.includes('state') || displayWithBadge) {
                const status = getItemFromStaticListByValue(field.value ? field.value : displayValue, options) ?? null
                const labelProp = status?.label ?? 'غير محدد'
                const color = status?.color ?? 'default'

                return (
                  <>
                    <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                      <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                        {dictionary?.placeholders?.[label]}
                      </Typography>

                      <Chip
                        variant='tonal'
                        label={labelProp}
                        size='small'
                        color={color}
                        sx={{
                          borderRadius: '50rem',
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>

                    <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                      {labelProp}
                    </Typography>
                  </>
                )
              }
            }

            if (type === 'select' && field.name && apiUrl && viewProp && !multiple) {
              if (displayWithBadge) {
                const labelProp = displayValue ?? 'غير محدد'
                const color = badgeColor ?? 'primary'

                return (
                  <>
                    <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                      <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                        {dictionary?.placeholders?.[label]}
                      </Typography>

                      <Chip
                        variant='tonal'
                        label={labelProp}
                        size='small'
                        color={color}
                        sx={{
                          borderRadius: '50rem',
                          height: 24,
                          fontSize: '0.75rem'
                        }}
                      />
                    </Box>

                    <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                      {labelProp}
                    </Typography>
                  </>
                )
              }
            }

            if (type === 'select' && field.name && viewProp && multiple) {
              return (
                <>
                  {/* ===== System View ===== */}
                  <Box className='system-view' sx={{ pt: 0, pb: 1, mt: '-5px' }}>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {Array.isArray(displayValue) && displayValue.length > 0 ? (
                        displayValue.map((item, index) => {
                          const labelValue = lovKeyName ? item[lovKeyName] : item

                          return (
                            <Chip
                              key={index}
                              variant='tonal'
                              label={labelValue}
                              size='small'
                              color='default'
                              sx={{
                                borderRadius: '50rem',
                                height: 24,
                                fontSize: '0.75rem'
                              }}
                            />
                          )
                        })
                      ) : (
                        <Chip
                          variant='tonal'
                          label='غير محدد'
                          size='small'
                          color='default'
                          sx={{
                            borderRadius: '50rem',
                            height: 24,
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* ===== Print View ===== */}
                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {Array.isArray(displayValue) && displayValue.length > 0
                      ? displayValue.map(item => (lovKeyName ? item[lovKeyName] : item)).join(' , ')
                      : 'غير محدد'}
                  </Typography>
                </>
              )
            }

            if (type === 'toggle') {
              const status = getItemFromStaticListByValue(field.value ? field.value : displayValue, options) ?? null
              const labelProp = status?.label ?? 'غير محدد'
              const color = status?.color ?? 'primary'

              return (
                <>
                  <div className='system-view' style={{ paddingBlock: '0px 8px', marginTop: '-5px' }}>
                    <div
                      style={{
                        marginBottom: '0px',
                        color: 'var(--mui-palette-text-secondary, #999)',
                        fontSize: '0.875rem'
                      }}
                    >
                      {dictionary?.placeholders?.[label] || label}
                    </div>

                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 12px',
                        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        height: '24px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor: `var(--mui-palette-${color}-lightOpacity, rgba(115,103,240,0.08))`,
                        color: `var(--mui-palette-${color}-main, #7367f0)`
                      }}
                    >
                      {dictionary?.placeholders?.[labelProp] || labelProp}
                    </div>
                  </div>

                  <div className='print-view' style={{ color: '#666', marginTop: '2px', fontSize: '0.875rem' }}>
                    {dictionary?.placeholders?.[labelProp] || labelProp}
                  </div>
                </>
              )
            }

            // Replace the default return at the end of SHOW MODE (around line 420-440):

            if (type === 'icon_picker') {
              const iconValue = field.value
              return (
                <>
                  <Box sx={{ pt: 0, pb: 1, mt: '-5px' }} className='system-view'>
                    <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                      {dictionary?.placeholders?.[label]}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                      {iconValue && <i className={iconValue} style={{ fontSize: '1.25rem' }} />}
                      <Typography variant='body1' sx={{ color: '#666' }}>
                        {iconValue || '-'}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                    {iconValue || '-'}
                  </Typography>
                </>
              )
            }

            return (
              <>
                <Box sx={{ pt: 0, pb: 1, mt: '-5px' }} className='system-view'>
                  <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem' }}>
                    {dictionary?.placeholders?.[label]}
                  </Typography>

                  <Typography variant='body1' sx={{ color: '#666' }}>
                    {resolveDisplayValueFormField({
                      value: displayValue ?? field.value,
                      name,
                      autoFill,
                      user
                    })}
                  </Typography>
                </Box>

                <Typography className='print-view' variant='body1' sx={{ color: '#666', mt: 0.5 }}>
                  {resolveDisplayValueFormField({
                    value: displayValue ?? field.value,
                    name,
                    autoFill,
                    user
                  })}
                </Typography>
              </>
            )
          }

          // ========== EDIT MODE ==========
          if (name === 'id' || name == 'season') {
            return (
              <TextField
                {...field}
                label={dictionary?.placeholders?.[label]}
                fullWidth
                required={required}
                error={!!error}
                helperText={error?.message || helpText}
                disabled={disabled}
                placeholder={placeholder}
                inputProps={{ readOnly, title: tooltip, autoComplete: 'off' }}
                onFocus={handleFocus}
                onChange={(e: any) => {
                  const value = e.target.value
                  field.onChange(value)
                  onChange?.(value)
                  clearFormErrors(field.name)
                }}
                onBlur={(e: any) => {
                  const value = e.target.value
                  field.onBlur()
                  onBlur?.(value)
                }}
                onKeyDown={handleKeyDown}
                size='small'
                autoComplete='off'
                sx={commonTextFieldSx}
              />
            )
          }

          switch (type) {
            case 'text':
            case 'iban':
              return (
                <TextField
                  {...field}
                  label={dictionary?.placeholders?.[label]}
                  fullWidth
                  required={required}
                  error={!!error}
                  helperText={error?.message || helpText}
                  disabled={disabled}
                  placeholder={placeholder}
                  inputProps={{
                    readOnly,
                    title: tooltip,
                    autoComplete: getAutoCompleteValue(type, autoComplete)
                  }}
                  value={effectiveFieldValue || ''}
                  onFocus={handleFocus}
                  onChange={(e: any) => {
                    const value = e.target.value
                    field.onChange(value)
                    onChange?.(value)
                    clearFormErrors(field.name)
                  }}
                  onBlur={(e: any) => {
                    const value = e.target.value
                    field.onBlur()
                    onBlur?.(value)
                  }}
                  onKeyDown={handleKeyDown}
                  size='small'
                  sx={commonTextFieldSx}
                />
              )

            case 'textarea':
              return (
                <TextField
                  data-field-name={name}
                  id={name}
                  {...field}
                  label={dictionary?.placeholders?.[label]}
                  fullWidth
                  required={required}
                  error={!!error}
                  helperText={error?.message || helpText}
                  disabled={disabled}
                  placeholder={placeholder}
                  inputProps={{
                    readOnly,
                    title: tooltip,
                    autoComplete: 'off'
                  }}
                  value={effectiveFieldValue || ''}
                  multiline
                  rows={4}
                  onFocus={handleFocus}
                  onChange={(e: any) => {
                    const value = e.target.value
                    field.onChange(value)
                    onChange?.(value)
                    clearFormErrors(field.name)
                  }}
                  onBlur={(e: any) => {
                    const value = e.target.value
                    field.onBlur()
                    onBlur?.(value)
                  }}
                  onKeyDown={handleKeyDown}
                  size='small'
                  sx={commonTextFieldSx}
                />
              )

            case 'password':
              return (
                <TextField
                  {...field}
                  label={dictionary?.placeholders?.[label]}
                  fullWidth
                  required={required}
                  error={!!error}
                  helperText={error?.message || helpText}
                  disabled={disabled}
                  placeholder={placeholder}
                  type='password'
                  inputProps={{
                    readOnly,
                    title: tooltip,
                    autoComplete: 'new-password'
                  }}
                  value={effectiveFieldValue || ''}
                  onFocus={handleFocus}
                  onChange={(e: any) => {
                    const value = e.target.value
                    field.onChange(value)
                    onChange?.(value)
                    clearFormErrors(field.name)
                  }}
                  onBlur={(e: any) => {
                    const value = e.target.value
                    field.onBlur()
                    onBlur?.(value)
                  }}
                  onKeyDown={handleKeyDown}
                  size='small'
                />
              )

            case 'time':
              return (
                <TimePicker
                  {...field}
                  dictionary={dictionary}
                  onChange={(val: any) => {
                    field.onChange(val)
                    clearFormErrors(field.name)
                  }}
                  label={dictionary?.placeholders?.[label]}
                  error={!!error}
                  locale={locale}
                  use24Hours={use24Hours}
                  now={now}
                  pickerType={pickerInputType}
                  helperText={error?.message || helpText}
                />
              )
            case 'multi_file':
              return (
                <MultiFileUploader
                  fieldName={field.name} // ✅ Used as description
                  label={dictionary?.placeholders?.[label] || label}
                  fileableType={screenData?.fileable_type}
                  accessToken={accessToken}
                  locale={locale as Locale}
                  typeAllowed={typeAllowed}
                  sizeAllowed={sizeAllowed}
                  maxFiles={maxFiles || 10}
                  allFiles={allFilesList} // ✅ Pass ALL files
                  onFilesChange={(uploadedFiles: any[]) => {
                    // Convert uploaded files array to a mock ChangeEvent format
                    const mockEvent = {
                      target: { files: uploadedFiles }
                    } as any
                    extraUploader.handleInputChange(mockEvent)
                  }}
                  disabled={field?.disabled}
                  dictionary={dictionary}
                />
              )

            case 'rich_text':
              return (
                <RichTextEditor
                  {...field}
                  onChange={(val: any) => {
                    field.onChange(val)
                    clearFormErrors(field.name)
                  }}
                  label={dictionary?.placeholders?.[label]}
                  placeholder={dictionary?.placeholders?.[label]}
                  error={!!error}
                  helperText={error?.message || helpText}
                />
              )

            case 'iconBadge':
              return <IconBadge value={field.value} options={options} dictionary={dictionary} />

            case 'number':
              return (
                <TextField
                  {...field}
                  label={dictionary?.placeholders?.[label]}
                  type='number'
                  fullWidth
                  required={required}
                  error={!!error}
                  helperText={error?.message || helpText}
                  disabled={disabled}
                  placeholder={placeholder}
                  inputProps={{
                    readOnly,
                    title: tooltip,
                    autoComplete: 'off',
                    maxLength: maxLength,
                    length: length,
                    minLength
                  }}
                  onFocus={handleFocus}
                  onChange={(e: any) => {
                    const value = e.target.value
                    field.onChange(value)
                    onChange?.(value)
                    clearFormErrors(field.name)
                  }}
                  onBlur={(e: any) => {
                    const value = e.target.value
                    field.onBlur()
                    onBlur?.(value)
                  }}
                  onKeyDown={handleKeyDown}
                  size='small'
                  value={effectiveFieldValue || ''}
                  sx={commonTextFieldSx}
                />
              )
            case 'email':
              return (
                <>
                  <TextField
                    {...field}
                    label={dictionary?.placeholders?.[label]}
                    fullWidth
                    required={required}
                    error={!!error}
                    helperText={error?.message || helpText}
                    disabled={disabled}
                    placeholder={placeholder}
                    type='email'
                    inputProps={{
                      readOnly,
                      title: tooltip,
                      autoComplete: 'off'
                    }}
                    value={effectiveFieldValue || ''}
                    onFocus={handleFocus}
                    onChange={(e: any) => {
                      const value = e.target.value
                      field.onChange(value)
                      onChange?.(value)
                      clearFormErrors(field.name)

                      // ✅ Reset verification when value changes - using ref
                      if (
                        verificationRequired &&
                        initialValuesRef.current.email &&
                        value !== initialValuesRef.current.email
                      ) {
                        setVerificationStatus(prev => ({ ...prev, email: false }))
                      }
                    }}
                    onBlur={(e: any) => {
                      const value = e.target.value
                      field.onBlur()
                      onBlur?.(value)
                    }}
                    onKeyDown={handleKeyDown}
                    size='small'
                    sx={commonTextFieldSx}
                    InputProps={
                      verificationRequired
                        ? {
                          endAdornment: getVerificationIcon()
                        }
                        : undefined
                    }
                  />

                  {/* OTP Modal */}
                  {verificationRequired && verificationField?.type === 'email' && (
                    <OTPVerificationModal
                      open={showOTPModal}
                      onClose={() => setShowOTPModal(false)}
                      onSuccess={handleVerificationSuccess}
                      fieldType='email'
                      fieldValue={verificationField.value}
                      accessToken={accessToken}
                      dictionary={dictionary}
                    />
                  )}
                </>
              )

            // Update the mobile case:
            case 'mobile':
              return (
                <>
                  <TextField
                    {...field}
                    label={dictionary?.placeholders?.[label]}
                    type='tel'
                    fullWidth
                    required={required}
                    error={!!error}
                    helperText={error?.message || helpText}
                    disabled={disabled}
                    placeholder={placeholder}
                    inputProps={{ readOnly, title: tooltip, autoComplete: 'off' }}
                    onFocus={handleFocus}
                    onChange={(e: any) => {
                      const value = String(e.target.value).replace(/\s/g, '')
                      field.onChange(value)
                      onChange?.(value)
                      clearFormErrors(field.name)
                      // ✅ Reset verification when value changes - using ref
                      if (
                        verificationRequired &&
                        initialValuesRef.current.mobile &&
                        value !== initialValuesRef.current.mobile
                      ) {
                        setVerificationStatus(prev => ({ ...prev, mobile: false }))
                      }
                    }}
                    onBlur={(e: any) => {
                      const value = e.target.value
                      field.onBlur()
                      onBlur?.(value)
                    }}
                    onKeyDown={handleKeyDown}
                    size='small'
                    value={effectiveFieldValue || ''}
                    InputProps={
                      verificationRequired
                        ? {
                          endAdornment: getVerificationIcon()
                        }
                        : undefined
                    }
                  />

                  {/* OTP Modal */}
                  {verificationRequired && verificationField?.type === 'mobile' && (
                    <OTPVerificationModal
                      open={showOTPModal}
                      onClose={() => setShowOTPModal(false)}
                      onSuccess={handleVerificationSuccess}
                      fieldType='mobile'
                      fieldValue={verificationField.value}
                      accessToken={accessToken}
                      dictionary={dictionary}
                    />
                  )}
                </>
              )

            // ✅ Add this state at the component level (outside the switch)

            // Then in your switch case:
            case 'amount': {
              const rawValue = field.value ?? ''
              const fieldKey = `${name}-amount` // Unique key for this field

              // ✅ Format only when NOT focused
              const displayValue =
                focusedField === fieldKey
                  ? String(rawValue) // Show raw while typing
                  : typeof rawValue === 'number'
                    ? formatNumber(rawValue, 2, { useCurrency: false })
                    : rawValue

              return (
                <TextField
                  label={dictionary?.placeholders?.[label] || label}
                  fullWidth
                  required={required}
                  error={!!error}
                  helperText={error?.message || helpText}
                  disabled={disabled}
                  placeholder={placeholder}
                  size='small'
                  value={displayValue}
                  inputProps={{
                    inputMode: 'decimal',
                    readOnly,
                    title: tooltip
                  }}
                  onFocus={(e: any) => {
                    setFocusedField(fieldKey)
                    handleFocus?.()
                  }}
                  onChange={(e: any) => {
                    const raw = e.target.value.replace(/,/g, '')

                    // ✅ Allow only numbers and one decimal point
                    if (!/^\d*\.?\d*$/.test(raw)) return

                    field.onChange(raw === '' ? '' : Number(raw))
                    onChange?.(raw)
                    clearFormErrors(field.name)
                  }}
                  onBlur={(e: any) => {
                    setFocusedField(null)
                    field.onBlur()
                  }}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    endAdornment: showCurrency ? (
                      <InputAdornment position='end'>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#666' }}>SAR</span>
                      </InputAdornment>
                    ) : null
                  }}
                />
              )
            }

            case 'select':
              // console.log('field', field.value)
              return (
                <FormControl fullWidth error={!!error} data-field-name={name}>
                  <ListOfValue
                    field={{
                      label: dictionary?.placeholders?.[label] || label,
                      options,
                      required,
                      keyProp,
                      labelProp,
                      type,
                      name,
                      queryParams,
                      lovKeyName,
                      cacheWithDifferentKey,
                      cache,
                      displayProps,
                      multiple,
                      searchProps,
                      searchMode,
                      searchInBackend,
                      apiMethod,
                      responseDataKey,
                      perPage,
                      skipDataSuffix
                    }}
                    row={{
                      [lovKeyName ? lovKeyName : name]: multiple
                        ? effectiveFieldValue || processedSelectValue // ✅ Use effectiveFieldValue
                        : String(
                          (effectiveFieldValue && typeof effectiveFieldValue === 'object'
                            ? (effectiveFieldValue.value ?? effectiveFieldValue[keyProp])
                            : effectiveFieldValue) ||
                          processedSelectValue ||
                          ''
                        ) // ✅ Use effectiveFieldValue
                    }}
                    rowIndex={rowIndex}
                    handleInputChange={(index: number, key: string, value: any, object: any) => {
                      if (submitLovKeyProp && multiple) {
                        const controlledValue = (Array.isArray(value) ? value : [value]).map(v => ({
                          [submitLovKeyProp]: v
                        }))
                        field?.onChange({ value: controlledValue, object: object })
                        onChange?.({ value: controlledValue, object: object })
                        setValue(name, controlledValue, { shouldValidate: true })
                        clearFormErrors(field.name)
                      } else {
                        field?.onChange({ value: value, object: object })
                        onChange?.({ value: value, object: object })
                        setValue(name, value, { shouldValidate: true })
                        clearFormErrors(field.name)
                      }
                    }}
                    errors={error ? { [rowIndex]: { [name]: error.message || '' } } : {}}
                    apiUrl={apiUrl}
                    selectFirstValue={selectFirstValue}
                    disabled={disabled || readOnly}
                  />
                </FormControl>
              )
            case 'toggle':
              const activeValue = effectiveFieldValue ?? defaultValue

              return (
                <div style={{ width: '100%' }}>
                  {label && (
                    <div
                      style={{
                        marginBottom: '12px',
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--mui-palette-text-primary)'
                      }}
                    >
                      {dictionary?.placeholders?.[label] || label}
                    </div>
                  )}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(auto-fit, minmax(150px, 1fr))'
                      },
                      gap: 4
                    }}
                  >
                    {options.map((option: any) => {
                      const isSelected = String(activeValue) === String(option[keyProp])
                      const optionLabel = dictionary?.placeholders?.[option[labelProp]] || option[labelProp]
                      const optionDescription = dictionary?.placeholders?.[option.description] || option.description
                      const optionHelperText = dictionary?.placeholders?.[option.helperText] || option.helperText
                      const optionIcon = option.icon
                      const optionColor = option.color || 'primary'

                      return (
                        <Box
                          key={option[keyProp]}
                          onClick={() => {
                            if (!disabled && !readOnly) {
                              field.onChange(option[keyProp])
                              onChange?.(option[keyProp])
                              clearFormErrors(field.name)
                            }
                          }}
                          sx={{
                            cursor: disabled || readOnly ? 'default' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 4,
                            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                            border: (theme: Theme) =>
                              isSelected
                                ? `2px solid ${(theme.palette as any)[optionColor]?.main || theme.palette.primary.main}`
                                : theme.palette.mode === 'dark'
                                  ? '1.5px solid rgba(255,255,255,0.12)'
                                  : '1.5px solid rgba(0,0,0,0.1)',
                            backgroundColor: isSelected
                              ? (theme: Theme) =>
                                (theme.palette as any)[optionColor]?.lighterOpacity ||
                                `rgba(${(theme.palette as any)[optionColor]?.mainChannel || '0,0,0'}, 0.08)`
                              : 'background.paper',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: disabled || readOnly ? 0.7 : 1,
                            textAlign: 'center',
                            boxShadow: isSelected
                              ? (theme: Theme) =>
                                `0 6px 16px 0 rgba(${(theme.palette as any)[optionColor]?.mainChannel || '0,0,0'}, 0.15)`
                              : 'none',
                            minHeight: '160px',
                            justifyContent: 'space-between',
                            transform: isSelected ? 'translateY(-2px)' : 'none',
                            '&:hover': {
                              borderColor: !isSelected && !disabled ? 'primary.main' : undefined,
                              transform: !disabled ? 'translateY(-2px)' : undefined,
                              boxShadow: !disabled ? '0 4px 12px 0 rgba(0,0,0,0.1)' : undefined
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {optionIcon && (
                              <Box
                                sx={{
                                  fontSize: '2rem',
                                  color: isSelected ? `${optionColor}.main` : 'text.secondary',
                                  mb: 1,
                                  display: 'flex'
                                }}
                              >
                                <i className={optionIcon} />
                              </Box>
                            )}

                            <Typography
                              variant='body1'
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.9375rem',
                                color: isSelected ? 'primary.main' : 'text.secondary'
                              }}
                            >
                              {optionLabel}
                            </Typography>

                            {(optionHelperText || optionDescription) && (
                              <Typography
                                variant='caption'
                                sx={{
                                  color: 'text.secondary',
                                  display: 'block',
                                  lineHeight: 1.3
                                }}
                              >
                                {optionHelperText || optionDescription}
                              </Typography>
                            )}
                          </Box>

                          <Radio
                            checked={isSelected}
                            disabled={disabled || readOnly}
                            color={optionColor as any}
                            sx={{ mt: 2, p: 0 }}
                          />
                        </Box>
                      )
                    })}
                  </Box>
                  {error && (
                    <div style={{ color: 'var(--mui-palette-error-main)', fontSize: '0.75rem', marginTop: '4px' }}>
                      {error.message}
                    </div>
                  )}
                </div>
              )

            case 'checkboxToggle':
              const activeCheckboxToggleValue = effectiveFieldValue ?? defaultValue

              return (
                <div style={{ width: '100%' }}>
                  {label && (
                    <div
                      style={{
                        marginBottom: '12px',
                        display: 'block',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'var(--mui-palette-text-primary)'
                      }}
                    >
                      {dictionary?.placeholders?.[label] || label}
                    </div>
                  )}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(auto-fit, minmax(150px, 1fr))'
                      },
                      gap: 4
                    }}
                  >
                    {options.map((option: any) => {
                      const isSelected = Array.isArray(activeCheckboxToggleValue)
                        ? activeCheckboxToggleValue.some(v => String(v) === String(option[keyProp]))
                        : String(activeCheckboxToggleValue) === String(option[keyProp])

                      const optionLabel = dictionary?.placeholders?.[option[labelProp]] || option[labelProp]
                      const optionDescription = dictionary?.placeholders?.[option.description] || option.description
                      const optionHelperText = dictionary?.placeholders?.[option.helperText] || option.helperText
                      const optionIcon = option.icon
                      const optionColor = option.color || 'primary'

                      return (
                        <Box
                          key={option[keyProp]}
                          onClick={() => {
                            if (!disabled && !readOnly) {
                              let newValue
                              if (Array.isArray(activeCheckboxToggleValue)) {
                                if (activeCheckboxToggleValue.some(v => String(v) === String(option[keyProp]))) {
                                  newValue = activeCheckboxToggleValue.filter(
                                    v => String(v) !== String(option[keyProp])
                                  )
                                } else {
                                  newValue = [...activeCheckboxToggleValue, option[keyProp]]
                                }
                              } else {
                                newValue =
                                  String(activeCheckboxToggleValue) === String(option[keyProp]) ? null : option[keyProp]
                              }
                              field.onChange(newValue)
                              onChange?.(newValue)
                              clearFormErrors(field.name)
                            }
                          }}
                          sx={{
                            cursor: disabled || readOnly ? 'default' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 4,
                            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                            border: (theme: Theme) =>
                              isSelected
                                ? `2px solid ${(theme.palette as any)[optionColor]?.main || theme.palette.primary.main}`
                                : theme.palette.mode === 'dark'
                                  ? '1.5px solid rgba(255,255,255,0.12)'
                                  : '1.5px solid rgba(0,0,0,0.1)',
                            backgroundColor: isSelected
                              ? (theme: Theme) =>
                                (theme.palette as any)[optionColor]?.lighterOpacity ||
                                `rgba(${(theme.palette as any)[optionColor]?.mainChannel || '0,0,0'}, 0.08)`
                              : 'background.paper',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: disabled || readOnly ? 0.7 : 1,
                            textAlign: 'center',
                            boxShadow: isSelected
                              ? (theme: Theme) =>
                                `0 6px 16px 0 rgba(${(theme.palette as any)[optionColor]?.mainChannel || '0,0,0'}, 0.15)`
                              : 'none',
                            minHeight: '160px',
                            justifyContent: 'space-between',
                            transform: isSelected ? 'translateY(-2px)' : 'none',
                            '&:hover': {
                              borderColor: !isSelected && !disabled ? 'primary.main' : undefined,
                              transform: !disabled ? 'translateY(-2px)' : undefined,
                              boxShadow: !disabled ? '0 4px 12px 0 rgba(0,0,0,0.1)' : undefined
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                            {optionIcon && (
                              <Box
                                sx={{
                                  fontSize: '2rem',
                                  color: isSelected ? `${optionColor}.main` : 'text.secondary',
                                  mb: 1,
                                  display: 'flex'
                                }}
                              >
                                <i className={optionIcon} />
                              </Box>
                            )}

                            <Typography
                              variant='body1'
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.9375rem',
                                color: isSelected ? 'primary.main' : 'text.secondary'
                              }}
                            >
                              {optionLabel}
                            </Typography>

                            {(optionHelperText || optionDescription) && (
                              <Typography
                                variant='caption'
                                sx={{
                                  color: 'text.secondary',
                                  display: 'block',
                                  lineHeight: 1.3
                                }}
                              >
                                {optionHelperText || optionDescription}
                              </Typography>
                            )}
                          </Box>

                          <Checkbox
                            checked={isSelected}
                            disabled={disabled || readOnly}
                            color={optionColor as any}
                            sx={{ mt: 2, p: 0 }}
                          />
                        </Box>
                      )
                    })}
                  </Box>
                  {error && (
                    <div style={{ color: 'var(--mui-palette-error-main)', fontSize: '0.75rem', marginTop: '4px' }}>
                      {error.message}
                    </div>
                  )}
                </div>
              )

            case 'radio':
              const radioValue = effectiveFieldValue ?? defaultValue ?? ''

              return (
                <FormControl required={required} error={!!error}>
                  <FormLabel>{dictionary?.placeholders?.[label] || label}</FormLabel>
                  <RadioGroup
                    value={radioValue}
                    onChange={(e: any) => {
                      const value = e.target.value
                      field.onChange(value)
                      onChange?.(value)
                      clearFormErrors(field.name)
                    }}
                    row
                  >
                    {options.map((option: any) => (
                      <FormControlLabel
                        key={option[keyProp]}
                        value={option[keyProp]}
                        control={<Radio />}
                        label={dictionary?.placeholders?.[option[labelProp]] || option[labelProp]}
                      />
                    ))}
                  </RadioGroup>
                  {error && <Typography color='error'>{error.message}</Typography>}
                </FormControl>
              )

            case 'checkbox': {
              const checkboxValue = effectiveFieldValue ?? defaultValue ?? false

              if (modalConfig?.open && modalConfig?.component) {
                return (
                  <FormControl error={!!error}>
                    <input
                      type='checkbox'
                      style={{ display: 'none' }}
                      checked={!!field.value}
                      onChange={() => { }}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {options.map((option: any) => (
                      <FormControlLabel
                        key={option[keyProp]}
                        control={
                          <Checkbox
                            checked={checkboxValue}
                            onChange={e => {
                              const newValue = e.target.checked
                              field.onChange(newValue)
                              onChange?.(newValue)
                              clearFormErrors(field.name)
                            }}
                          />
                        }
                        // label={dictionary?.placeholders?.[option[labelProp]] || option[labelProp]}
                        label={
                          <>
                            <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              <Typography
                                sx={{
                                  color: field.value ? 'primary.main' : 'label',
                                  // textDecoration: 'underline',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {dictionary?.placeholders?.['i_consent_on']}
                              </Typography>
                              {(modalConfig?.names?.length ? modalConfig.names : [name]).map(
                                (name: string, index: number) => {
                                  return (
                                    <Typography
                                      key={index}
                                      onClick={() => {
                                        const component = modalConfig.component ?? (() => null)

                                        openDialog(component, {
                                          ...modalConfig.props,
                                          ...modalConfig,
                                          title: name,
                                          description: String(getValues(name + '_html') ?? ''), // ✅ dynamic per click
                                          dictionary,
                                          onConfirm: () => {
                                            field.onChange(true)
                                            onChange?.(true)
                                            clearFormErrors(field.name)
                                          }
                                        })
                                      }}
                                      sx={{
                                        color: field.value ? 'primary.main' : 'label',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      {/* {name} */}
                                      {dictionary?.placeholders?.[name] || name}
                                      {index < (modalConfig?.names?.length ? modalConfig.names.length : 1) - 1 && ','}
                                    </Typography>
                                  )
                                }
                              )}
                              <Typography
                                sx={{
                                  color: field.value ? 'primary.main' : 'label', // textDecoration: 'underline',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                {dictionary?.placeholders?.['end_of_consent']}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    ))}

                    {error && (
                      <Typography
                        sx={{
                          color: 'error.main',
                          marginInlineStart: '0px',
                          marginTop: '5px'
                        }}
                      >
                        {error.message}
                      </Typography>
                    )}
                  </FormControl>
                )
              }

              return (
                <FormControl required={required} error={!!error}>
                  <Box>
                    {options.map((option: any) => (
                      <FormControlLabel
                        key={option[keyProp]}
                        control={
                          <Checkbox
                            checked={checkboxValue}
                            onChange={e => {
                              const newValue = e.target.checked
                              field.onChange(newValue)
                              onChange?.(newValue)
                              clearFormErrors(field.name)
                            }}
                          />
                        }
                        label={dictionary?.placeholders?.[option[labelProp]] || option[labelProp]}
                      />
                    ))}
                  </Box>

                  {error && <Typography color='error'>{error.message}</Typography>}
                </FormControl>
              )
            }

            case 'switch': {
              const switchValue = effectiveFieldValue ?? defaultValue ?? false

              return (
                <FormControl required={required} error={!!error}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!switchValue}
                          disabled={disabled || readOnly}
                          onChange={e => {
                            const newValue = e.target.checked
                            field.onChange(newValue)
                            onChange?.(newValue)
                            clearFormErrors(field.name)
                          }}
                        />
                      }
                      label={dictionary?.placeholders?.[label] || label}
                    />
                  </Box>
                  {error && <Typography color='error'>{error.message}</Typography>}
                </FormControl>
              )
            }

            case 'date_range':
              return (
                <FormControl fullWidth error={!!error}>
                  <DateRangeField
                    value={field.value}
                    onChange={(val: any) => {
                      const formattedValue = val?.join(',') || ''
                      field.onChange(formattedValue)
                      setValue(name, formattedValue)
                    }}
                    error={fieldState.error}
                    helpText={helpText}
                    label={dictionary?.placeholders?.[label] || label}
                  />
                </FormControl>
              )

            // case 'date':
            //   return (
            //     <FormControl fullWidth error={!!error}>
            //       <DatePickerComponent
            //         value={field.value ?? null}
            //         onChange={(val: string | null) => {
            //           field.onChange(val)
            //           clearFormErrors(field.name)
            //         }}
            //         error={fieldState.error}
            //         helperText={fieldState.error?.message || helpText}
            //         label={dictionary?.placeholders?.[label]}
            //         readOnly={readOnly}
            //         disabled={disabled}
            //         onFocus={handleFocus}
            //         tooltip={tooltip}
            //         onBlur={e => onBlur?.(e)}
            //       />

            //     </FormControl>
            //   )

            case 'date': {
              const hijriDate = effectiveFieldValue ? getFormattedHijriDate(effectiveFieldValue) : null // ✅ Use effectiveFieldValue

              const combinedHelperText = fieldState.error?.message
                ? fieldState.error.message
                : hijriDate
                  ? `${helpText}${helpText ? ' • ' : ''}${hijriDate} هـ`
                  : helpText

              return (
                <FormControl fullWidth error={!!error}>
                  <DatePickerComponent
                    value={effectiveFieldValue ?? null}
                    onChange={(val: string | null) => {
                      field.onChange(val)
                      onChange?.({ date: val, hijriDate: hijriDate })
                      clearFormErrors(field.name)
                    }}
                    now={now}
                    error={fieldState.error}
                    helperText={combinedHelperText}
                    label={dictionary?.placeholders?.[label] || label}
                    readOnly={readOnly}
                    disabled={disabled}
                    onFocus={handleFocus}
                    tooltip={tooltip}
                    onBlur={e => onBlur?.(e)}
                  />
                </FormControl>
              )
            }

            case 'date_time': {
              const hijriDate = effectiveFieldValue ? getFormattedHijriDate(effectiveFieldValue) : null // ✅ Use effectiveFieldValue

              const combinedHelperText = fieldState.error?.message
                ? fieldState.error.message
                : hijriDate
                  ? `${helpText}${helpText ? ' • ' : ''}${hijriDate} هـ`
                  : helpText

              return (
                <FormControl fullWidth error={!!error}>
                  <DatePickerComponent
                    value={effectiveFieldValue ?? null}
                    onChange={(val: string | null) => {
                      field.onChange(val)
                      onChange?.({ date: val, hijriDate: hijriDate })
                      clearFormErrors(field.name)
                    }}
                    now={now}
                    withTime={true}
                    error={fieldState.error}
                    helperText={combinedHelperText}
                    label={dictionary?.placeholders?.[label] || label}
                    dictionary={dictionary}
                    readOnly={readOnly}
                    disabled={disabled}
                    onFocus={handleFocus}
                    tooltip={tooltip}
                    onBlur={e => onBlur?.(e)}
                  />
                </FormControl>
              )
            }

            case 'hijri_date':
              const formatHijriDisplay = (value: string | number | null | undefined) => {
                if (!value) return ''
                const cleaned = String(value).replace(/\D/g, '')
                if (cleaned.length <= 4) return cleaned
                if (cleaned.length <= 6) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
                return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
              }

              const handleHijriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const input = e.target.value.replace(/\D/g, '')
                const truncated = input.slice(0, 8)
                const numericValue = truncated ? parseInt(truncated, 10) : null
                field.onChange(numericValue)
                onChange?.(numericValue)
                clearFormErrors(field.name)
              }

              return (
                <TextField
                  label={dictionary?.placeholders?.[label]}
                  fullWidth
                  required={required}
                  error={!!error}
                  helperText={error?.message || helpText}
                  disabled={disabled}
                  placeholder='1445-11-11'
                  value={formatHijriDisplay(effectiveFieldValue)}
                  onChange={handleHijriChange}
                  onBlur={(e: any) => {
                    field.onBlur()
                    onBlur?.(field.value)
                  }}
                  onFocus={handleFocus}
                  onKeyDown={handleKeyDown}
                  size='small'
                  inputProps={{
                    readOnly,
                    title: tooltip,
                    inputMode: 'numeric',
                    maxLength: 10
                  }}
                  sx={{
                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
                    {
                      display: 'none'
                    },
                    '& input[type=number]': {
                      MozAppearance: 'textfield'
                    }
                  }}
                />
              )

            case 'slider':
              return (
                <FormControl fullWidth>
                  <FormLabel>{label}</FormLabel>
                  <Slider
                    value={field.value || 0}
                    onChange={(e, value) => {
                      if (value) {
                        field?.onChange(value)
                        onChange?.(value)
                        clearFormErrors(field.name)
                      }
                    }}
                    onFocus={handleFocus}
                    onBlur={(e: any) => onBlur?.(e.target.value)}
                    disabled={disabled}
                  />
                  {error && <Typography color='error'>{error.message}</Typography>}
                </FormControl>
              )

            // case 'file': {
            //   if (extraField) {
            //     // Extra field logic (base64)
            //     const value = getValues(field.name)
            //     const isBase64 = isBase64File(value)
            //     const fileInfo = isBase64 ? parseBase64File(value) : null

            //     return (
            //       <Box display='flex' alignItems='center' width='100%'>
            //         <TextField
            //           fullWidth
            //           size='small'
            //           placeholder='اختر ملفًا...'
            //           value={
            //             isBase64 ? 'ملف مرفق' : 'fileNames' in extraUploader ? extraUploader.fileNames.join(', ') : ''
            //           }
            //           InputProps={{
            //             readOnly: true,
            //             endAdornment: (
            //               <Box display='flex' alignItems='center' gap={1} height={'40px'}>
            //                 <IconButton onClick={() => fileInputRef.current?.click()}>⬆️</IconButton>
            //                 {isBase64 && <IconButton onClick={() => previewBase64File(value)}>👁️</IconButton>}
            //                 {isBase64 && (
            //                   <IconButton
            //                     onClick={() => downloadBase64File(value, `${field.name}.${fileInfo?.extension}`)}
            //                   >
            //                     📥
            //                   </IconButton>
            //                 )}
            //               </Box>
            //             )
            //           }}
            //           error={!!error}
            //           helperText={error?.message || helpText}
            //         />

            //         <input
            //           hidden
            //           ref={fileInputRef}
            //           type='file'
            //           multiple={multiple}
            //           accept={typeAllowed?.join(', ') || '*'}
            //           onChange={extraUploader.handleInputChange}
            //         />
            //       </Box>
            //     )
            //   } else {
            //     // Normal file logic (API upload)
            //     const filesList = getValues('files') || []
            //     const fileData = filesList.find((f: any) => f.description === name) // ✅ Get by description

            //     const handleNormalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
            //       const selectedFile = event.target.files?.[0]
            //       if (!selectedFile) return

            //       // Validation
            //       if (typeAllowed && typeAllowed.length && !typeAllowed.includes(selectedFile.type)) {
            //         toast.error(`نوع الملف غير مدعوم! الأنواع المسموح بها: ${typeAllowed.join(', ')}`)
            //         return
            //       }

            //       if (sizeAllowed && selectedFile.size > sizeAllowed) {
            //         toast.error(`حجم الملف يتجاوز الحد المسموح به (${(sizeAllowed / 1024 / 1024).toFixed(2)} MB)`)
            //         return
            //       }

            //       setUploadingFile(true)

            //       const formData = new FormData()
            //       formData.append('files[0][file]', selectedFile)
            //       formData.append('files[0][description]', name)
            //       formData.append('fileable_type', fileableType || 'GENERAL')

            //       try {
            //         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/def/archives`, formData, {
            //           headers: {
            //             'Content-Type': 'multipart/form-data',
            //             Authorization: `Bearer ${accessToken}`
            //           }
            //         })

            //         const uploadedFile = response?.data?.data?.[0]
            //         if (uploadedFile) {
            //           let currentFiles = getValues('files') || []
            //           currentFiles = Array.isArray(currentFiles) ? [...currentFiles] : []

            //           const existingIndex = currentFiles.findIndex((f: any) => f.description === name)

            //           const newFile = {
            //             id: uploadedFile.id,
            //             path: uploadedFile.path,
            //             name: uploadedFile.name,
            //             ext: uploadedFile.ext,
            //             description: name
            //           }

            //           if (existingIndex !== -1) {
            //             currentFiles[existingIndex] = newFile
            //           } else {
            //             currentFiles.push(newFile)
            //           }

            //           // ✅ Update files array WITHOUT triggering full validation
            //           setValue('files', currentFiles, { shouldValidate: false, shouldDirty: true })

            //           // ✅ Clear the error for THIS specific field only
            //           clearFormErrors(name)

            //           toast.success('تم رفع الملف بنجاح')
            //         }
            //       } catch (error) {
            //         toast.error('فشل رفع الملف')
            //         console.error(error)
            //       } finally {
            //         setUploadingFile(false)
            //       }
            //     }

            //     const handleNormalFileDelete = async () => {
            //       if (!fileData || !fileData.id) return

            //       try {
            //         await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/def/archives/${fileData.id}`, {
            //           headers: { Authorization: `Bearer ${accessToken}` }
            //         })

            //         // ✅ Remove from files array by description
            //         let currentFiles = getValues('files') || []
            //         currentFiles = currentFiles.filter((f: any) => f.description !== name)
            //         setValue('files', currentFiles, { shouldValidate: true })
            //         toast.success('تم حذف الملف بنجاح')
            //       } catch (error) {
            //         toast.error('حدث خطأ أثناء حذف الملف')
            //         console.error(error)
            //       }
            //     }

            //     return (
            //       <Box display='flex' alignItems='center' width='100%'>
            //         <TextField
            //           fullWidth
            //           size='small'
            //           label={dictionary?.placeholders?.[label] || label}
            //           placeholder='اختر ملفًا...'
            //           value={fileData ? fileData.name?.split('/').pop() || 'ملف مرفق' : ''}
            //           InputProps={{
            //             readOnly: true,
            //             endAdornment: (
            //               <Box display='flex' alignItems='center' gap={1} height={'40px'}>
            //                 {/* Upload */}
            //                 <input
            //                   hidden
            //                   id={`file-upload-${name}`}
            //                   type='file'
            //                   accept={typeAllowed?.join(', ') || '*'}
            //                   onChange={handleNormalFileUpload}
            //                 />
            //                 <label htmlFor={`file-upload-${name}`}>
            //                   <IconButton component='span' disabled={uploadingFile}>
            //                     {uploadingFile ? '⏳' : '⬆️'}
            //                   </IconButton>
            //                 </label>

            //                 {/* Download */}
            //                 {fileData && <IconButton onClick={() => window.open(fileData.path, '_blank')}>📥</IconButton>}

            //                 {/* Delete */}
            //                 {fileData && (
            //                   <IconButton color='error' onClick={handleNormalFileDelete}>
            //                     🗑️
            //                   </IconButton>
            //                 )}
            //               </Box>
            //             )
            //           }}
            //           error={!!error}
            //           helperText={error?.message || helpText}
            //         />
            //       </Box>
            //     )
            //   }
            // }

            case 'file': {
              if (extraField) {
                // Extra field logic (Base64)
                const value = getValues(field.name)

                const isBase64 = isBase64File(value)
                const fileInfo = isBase64 ? parseBase64File(value) : null
                const fileType: FileType = fileInfo?.extension ? getFileType(fileInfo.extension) : 'unknown' // map extension

                return (
                  <Box
                    width='100%'
                    sx={{
                      position: 'relative',
                      mt: 0, // Moderate margin for floating room
                      '& .MuiTypography-root.floating-label': {
                        position: 'absolute',
                        top: isBase64 || value ? '-11px' : '8px',
                        insetInlineStart: isBase64 || value ? '20px' : '60px',
                        px: '5px',
                        bgcolor: isBase64 || value ? 'background.paper' : 'transparent',
                        transition: 'all 0.2s ease',
                        zIndex: 10,
                        fontSize: isBase64 || value ? '12px' : '14px',
                        color: error ? 'error.main' : isBase64 || value ? 'primary.main' : 'text.secondary',
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    <Typography className='floating-label'>{dictionary?.placeholders?.[label] || label}</Typography>

                    <input
                      hidden
                      ref={fileInputRef}
                      type='file'
                      multiple={multiple}
                      accept={typeAllowed?.join(', ') || '*'}
                      onChange={extraUploader.handleInputChange}
                    />

                    {/* File Card */}
                    <FileCard
                      dictionary={dictionary}
                      fileName={isBase64 ? `${dictionary?.placeholders?.['file']}.${fileInfo?.extension}` : value}
                      fileType={fileType}
                      subtitle={isBase64 ? FILE_TYPE_META[fileType].label : 'Local file'}
                      loading={false}
                      onUpload={() => fileInputRef.current?.click()}
                      onDownload={
                        isBase64 ? () => downloadBase64File(value, `${field.name}.${fileInfo?.extension}`) : undefined
                      }
                      error={error ? true : false}
                      onDelete={isBase64 ? () => setValue(field.name, null) : undefined}
                    />

                    {error && (
                      <Typography sx={{ color: 'error.main', marginInlineStart: '10px', marginTop: '5px' }}>
                        {error.message || helpText}
                      </Typography>
                    )}
                  </Box>
                )
              } else {
                // Normal file logic (API upload)
                const filesList = getValues('files') || []
                const fileData = filesList.find((f: any) => f.description === name)
                const fileType: FileType = fileData?.ext ? getFileType(fileData.ext) : 'unknown'

                const handleNormalFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
                  const selectedFile = event.target.files?.[0]
                  if (!selectedFile) return

                  if (typeAllowed && typeAllowed.length && !typeAllowed.includes(selectedFile.type)) {
                    toast.error(`نوع الملف غير مدعوم! الأنواع المسموح بها: ${typeAllowed.join(', ')}`)
                    return
                  }

                  if (sizeAllowed && selectedFile.size > sizeAllowed) {
                    toast.error(`حجم الملف يتجاوز الحد المسموح به (${(sizeAllowed / 1024 / 1024).toFixed(2)} MB)`)
                    return
                  }

                  setUploadingFile(true)

                  const formData = new FormData()
                  formData.append('files[0][file]', selectedFile)
                  formData.append('files[0][description]', name)
                  formData.append('fileable_type', fileableType ? fileableType : screenData?.fileable_type)

                  try {
                    const response = await axios.post(`${backendUrl}/def/archives`, formData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${accessToken}`,
                        'Accept-Language': (locale as Locale) || 'ar'
                      }
                    })

                    const uploadedFile = response?.data?.data?.[0]
                    if (uploadedFile) {
                      let currentFiles = getValues('files') || []
                      currentFiles = Array.isArray(currentFiles) ? [...currentFiles] : []

                      const existingIndex = currentFiles.findIndex((f: any) => f.description === name)

                      const newFile = {
                        id: uploadedFile.id,
                        path: uploadedFile.path,
                        name: uploadedFile.name,
                        ext: uploadedFile.ext,
                        description: name
                      }

                      if (existingIndex !== -1) {
                        currentFiles[existingIndex] = newFile
                      } else {
                        currentFiles.push(newFile)
                      }

                      setValue('files', currentFiles, { shouldValidate: false, shouldDirty: true })
                      clearFormErrors(name)
                      toast.success('تم رفع الملف بنجاح')
                    }
                  } catch (error) {
                    toast.error('فشل رفع الملف')
                    console.error(error)
                  } finally {
                    setUploadingFile(false)
                  }
                }

                const handleNormalFileDelete = async () => {
                  if (!fileData || !fileData.id) return

                  try {
                    setDeleteLoading(true)
                    await axios.delete(`${backendUrl}/def/archives/${fileData.id}`, {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Accept-Language': (locale as Locale) || 'ar'
                      }
                    })

                    let currentFiles = getValues('files') || []
                    currentFiles = currentFiles.filter((f: any) => f.description !== name)
                    setValue('files', currentFiles, { shouldValidate: true })
                    toast.success('تم حذف الملف بنجاح')
                  } catch (error) {
                    toast.error('حدث خطأ أثناء حذف الملف')
                    console.error(error)
                  } finally {
                    setDeleteLoading(false)
                  }
                }

                return (
                  <Box
                    width='100%'
                    sx={{
                      position: 'relative',
                      mt: 0,
                      '& .MuiTypography-root.floating-label': {
                        position: 'absolute',
                        top: fileData ? '-11px' : '8px',
                        insetInlineStart: fileData ? '20px' : '60px',
                        px: '5px',
                        bgcolor: fileData ? 'background.paper' : 'transparent',
                        transition: 'all 0.2s ease',
                        zIndex: 10,
                        fontSize: fileData ? '12px' : '14px',
                        color: error ? 'error.main' : fileData ? 'primary.main' : 'text.secondary',
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    <Typography className='floating-label'>{dictionary?.placeholders?.[label] || label}</Typography>
                    <input
                      hidden
                      id={`file-upload-${name}`}
                      type='file'
                      accept={typeAllowed?.join(', ') || '*'}
                      onChange={handleNormalFileUpload}
                    />

                    <FileCard
                      dictionary={dictionary}
                      fileName={fileData?.name?.split('/').pop() || ''}
                      fileType={fileType}
                      subtitle={
                        fileData
                          ? (FILE_TYPE_META[fileData?.ext as keyof typeof FILE_TYPE_META]?.label ?? 'File')
                          : 'Click to upload'
                      }
                      deleteLoading={deleteLoading}
                      loading={uploadingFile}
                      error={error ? true : false}
                      onUpload={() => document.getElementById(`file-upload-${name}`)?.click()}
                      onDownload={fileData ? () => window.open(fileData.path, '_blank') : undefined}
                      onDelete={fileData ? handleNormalFileDelete : undefined}
                    />

                    {error && (
                      <Typography sx={{ color: 'error.main', marginInlineStart: '10px', marginTop: '5px' }}>
                        {error.message || helpText}
                      </Typography>
                    )}
                  </Box>
                )
              }
            }

            case 'personal_picture': {
              const filesList = getValues('files') || []
              const personalPicFile = filesList.find((f: any) => f.description === name) // ✅ Get by description
              const currentPersonalPic = personalPicFile?.path || '/images/avatars/personal-pic-avatar.jpg'

              const handlePersonalPicUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0]
                if (!file) return

                // Show preview immediately
                // const reader = new FileReader()
                // reader.onload = () => {
                //   setPersonalPic(reader.result as string)
                // }
                // reader.readAsDataURL(file)

                const formData = new FormData()
                formData.append('files[0][file]', file)
                formData.append('fileable_type', screenData?.fileable_type)
                formData.append('files[0][description]', name) // ✅ Use field name as description

                try {
                  setUploadingFile(true)
                  const response = await axios.post(`${backendUrl}/def/archives`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${accessToken}`,
                      'Accept-Language': (locale as Locale) || 'ar'
                    }
                  })

                  const res = response?.data?.data
                  if (res && res[0]) {
                    let currentFiles = getValues('files') || []
                    currentFiles = Array.isArray(currentFiles) ? [...currentFiles] : []

                    // ✅ Find existing file with same description
                    const existingIndex = currentFiles.findIndex((f: any) => f.description === name)

                    const newFile = {
                      id: res[0].id,
                      path: res[0].path,
                      name: res[0].name,
                      ext: res[0].ext,
                      description: name // ✅ Store with description = field name
                    }

                    if (existingIndex !== -1) {
                      currentFiles[existingIndex] = newFile
                    } else {
                      currentFiles.push(newFile)
                    }
                    setValue('files', currentFiles, { shouldValidate: false, shouldDirty: true })

                    // setPersonalPic(res[0].path)
                    toast.success('تم تحميل الصورة بنجاح')
                    clearFormErrors(name)
                  }
                } catch (error) {
                  toast.error('فشل تعيين الصورة الشخصية')
                  console.error('Upload error:', error)
                } finally {
                  setUploadingFile(false)
                }
              }

              const handleDeletePersonalPic = async () => {
                const filesList = getValues('files') || []
                const fileToDelete = filesList.find((f: any) => f.description === name)

                if (!fileToDelete) return

                try {
                  await axios.delete(`${backendUrl}/def/archives/${fileToDelete.id}`, {
                    headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': (locale as Locale) || 'ar' }
                  })

                  // ✅ Remove from files array by description
                  let currentFiles = getValues('files') || []
                  currentFiles = currentFiles.filter((f: any) => f.description !== name)

                  setValue('files', currentFiles, { shouldValidate: true })
                  // setPersonalPic('/images/avatars/personal-pic-avatar.jpg')
                  toast.success('تم حذف الصورة بنجاح')
                } catch (error) {
                  console.error('Delete error:', error)
                  toast.error('حدث خطأ اثناء حذف الصورة')
                }
              }
              return (
                <Box className='relative flex max-sm:flex-col items-center gap-6'>
                  <Box className='flex flex-col items-center'>
                    <Box className='relative'>
                      {personalPicFile && (
                        <Box
                          className='absolute top-0 left-0 p-1 cursor-pointer rounded-full shadow-lg'
                          onClick={handleDeletePersonalPic}
                          title={dictionary?.actions?.['delete_image'] || 'حذف الصورة'}
                          sx={{
                            zIndex: 1000,
                            backgroundColor: 'var(--delete-button-bg, #ef4444)',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'var(--delete-button-hover-bg, #dc2626)',
                              transform: 'scale(1.1)',
                              boxShadow: 'var(--shadow-lg, 0 10px 15px -5px rgba(0,0,0,0.1))'
                            },
                            '&:active': {
                              transform: 'scale(0.95)'
                            },
                            '& i': {
                              color: '#fff',
                              fontSize: '0.9rem'
                            }
                          }}
                        >
                          <i className='ri-delete-bin-7-line' />
                        </Box>
                      )}

                      <label htmlFor={`upload-${name}`} style={{ cursor: disabled ? 'default' : 'pointer' }}>
                        <img
                          height={160}
                          width={160}
                          className='rounded-md shadow-sm border border-divider transition-transform duration-300 hover:scale-[1.02] cursor-pointer'
                          src={currentPersonalPic}
                          alt={label || 'Profile'}
                          style={{ position: 'relative', zIndex: 1 }}
                          onClick={() => {
                            if (mode == 'show') {
                              setPreviewImage(currentPersonalPic)
                            }
                          }}
                        />
                      </label>
                    </Box>

                    {error && (
                      <Typography
                        sx={{
                          color: 'error.main',
                          mt: 1,
                          textAlign: 'center'
                        }}
                      >
                        {error.message || helpText}
                      </Typography>
                    )}
                  </Box>

                  <input
                    hidden
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={handlePersonalPicUpload}
                    id={`upload-${name}`}
                    disabled={disabled}
                  />
                </Box>
              )
            }

            case 'upload_image': {
              // value stored directly as base64
              const value = getValues(name)

              const isBase64 = isBase64File(value)
              const fileInfo = isBase64 ? parseBase64File(value) : null

              const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0]
                if (!file) return

                const reader = new FileReader()

                reader.onload = () => {
                  const base64 = reader.result as string

                  // store base64 directly in RHF
                  setValue(name, base64, { shouldValidate: true })
                }

                reader.readAsDataURL(file)
              }

              const handleDeleteFile = () => {
                setValue(name, null, { shouldValidate: true })
              }

              return (
                <Box
                  className='flex flex-col w-full gap-4'
                  sx={{
                    position: 'relative',
                    mt: 0,
                    '& .MuiTypography-root.floating-label': {
                      position: 'absolute',
                      top: isBase64 ? '-10px' : '15px', // Adjusted for larger card
                      insetInlineStart: '15px',
                      px: '5px',
                      bgcolor: isBase64 ? 'background.paper' : 'transparent',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                      fontSize: isBase64 ? '12px' : '14px',
                      color: error ? 'error.main' : isBase64 ? 'primary.main' : 'text.secondary',
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Typography className='floating-label'>{dictionary?.placeholders?.[label] || label}</Typography>

                  {/* Label wrapper */}
                  <label
                    htmlFor={`upload-${name}`}
                    className={`w-full relative cursor-pointer ${disabled ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    {/* Card */}
                    <Box
                      className='relative w-full h-48 rounded-xl shadow-lg overflow-hidden group transition-opacity duration-300 hover:opacity-80'
                      sx={{ backgroundColor: 'divider' }}
                      title={isBase64 ? 'تغيير الصورة' : 'تحميل الصورة'}
                    >
                      {/* Placeholder */}
                      {!isBase64 ? (
                        <div className='flex flex-col justify-center items-center h-full w-full'>
                          <i className='bi bi-image text-gray-400 text-5xl' />
                          {!disabled && <span className='text-sm text-gray-500 mt-2'>اضغط لتحميل الصورة</span>}
                        </div>
                      ) : (
                        <img
                          src={value}
                          alt={label || 'Preview'}
                          className='w-full h-full object-cover'
                          onClick={() => setPreviewImage(value)}
                        />
                      )}

                      {/* Hover overlay */}
                      {isBase64 && !disabled && (
                        <Box className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <i className='bi bi-camera text-white text-3xl' />
                        </Box>
                      )}

                      {/* Delete Button */}
                      {isBase64 && !disabled && (
                        <Box
                          className='absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-md transition-colors duration-300'
                          onClick={e => {
                            e.stopPropagation()
                            handleDeleteFile()
                          }}
                          title='حذف الصورة'
                        >
                          <i className='bi bi-trash text-white text-lg' />
                        </Box>
                      )}
                    </Box>
                  </label>

                  {/* Hidden Input */}
                  <input
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={handleFileUpload}
                    id={`upload-${name}`}
                    hidden
                    disabled={disabled}
                  />

                  {/* Optional error */}
                  {error && (
                    <Typography sx={{ color: 'error.main', marginInlineStart: '10px' }}>{error.message}</Typography>
                  )}
                </Box>
              )
            }

            case 'color_picker':
              return (
                <ColorPickerField
                  label={dictionary?.placeholders?.[label] || label} // ✅ من props
                  value={effectiveFieldValue || defaultValue || '#7367f0'}
                  onChange={(color: any) => {
                    field.onChange(color)
                    onChange?.(color)
                    clearFormErrors(field.name)
                  }}
                  error={!!error}
                  helperText={error?.message || helpText}
                  required={required}
                  disabled={disabled || mode === 'show'}
                  presetColors={presetColors} // ✅ من props
                  showAlpha={showAlpha} // ✅ من props
                  placeholder={dictionary?.placeholders?.[placeholder] || placeholder}
                />
              )

            case 'icon_picker':
              return (
                <IconPickerField
                  label={dictionary?.placeholders?.[label] || label}
                  value={effectiveFieldValue || defaultValue || ''}
                  onChange={(icon: any) => {
                    field.onChange(icon)
                    onChange?.(icon)
                    clearFormErrors(field.name)
                  }}
                  error={!!error}
                  helperText={error?.message || helpText}
                  required={required}
                  disabled={disabled || mode === 'show'}
                  placeholder={dictionary?.placeholders?.[placeholder] || placeholder}
                  dictionary={dictionary}
                />
              )

            case 'empty':
              return <div></div>
            case 'storage':
              return <div></div>

            default:
              return <></>
          }
        }}
      />

      {/* Image Preview popup */}
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
              direction: 'ltr'
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

export default DynamicFormField
