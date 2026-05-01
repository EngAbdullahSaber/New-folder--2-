'use client'
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Card,
  Typography,
  Box,
  Checkbox,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Grid
} from '@/shared'
import type { Locale } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import CustomAvatar from '@/@core/components/mui/Avatar'
import classNames from 'classnames'
import { useSessionHandler } from '@/shared'
import { Mode } from 'fs'
import CustomBadge from '@/@core/components/mui/Badge'
import { getOperatorConfig } from '@/configs/environment'

export interface CheckboxRadioGridProps {
  title?: string
  type: 'checkbox' | 'radio'
  gridSize?: number
  apiUrl?: string
  labelProp?: string
  keyProp?: string
  editProp?: string
  options?: Array<{ label: string; value: any }>
  initialData?: any[]
  onDataChange?: (selectedValues: any[]) => void
  mode: Mode
  locale?: any
  name?: string
  disabled?: boolean
  submitKey?: string // For array of objects: [{submitKey: value}]
  simpleArray?: boolean // ✅ NEW: For array of IDs: [1, 2, 3]
}

export const CheckboxRadioGrid: React.FC<CheckboxRadioGridProps> = ({
  title = '',
  type,
  gridSize = 4,
  apiUrl = '',
  labelProp = 'name',
  keyProp = 'id',
  options: staticOptions = [],
  initialData = [],
  onDataChange,
  mode,
  locale = 'ar',
  name = '',
  editProp,
  submitKey,
  simpleArray = false, // ✅ Default to false (current behavior)
  disabled = false
}) => {
  const { accessToken } = useSessionHandler()
  const [dictionary, setDictionary] = useState<any>(null)
  const [options, setOptions] = useState<Array<{ label: string; value: any }>>([])
  const [selectedValues, setSelectedValues] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { apiUrl: backendUrl } = getOperatorConfig()
  const onDataChangeRef = useRef(onDataChange)

  useEffect(() => {
    onDataChangeRef.current = onDataChange
  }, [onDataChange])

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  const hasFetchedRef = useRef(false)
  const staticOptionsStringRef = useRef('')

  // Fetch options from API or use static options
  useEffect(() => {
    if (staticOptions && staticOptions.length > 0) {
      const optionsString = JSON.stringify(staticOptions)
      if (staticOptionsStringRef.current !== optionsString) {
        staticOptionsStringRef.current = optionsString
        setOptions(staticOptions)
      }
      return
    }

    if (apiUrl && accessToken && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      setLoading(true)

      fetch(`${backendUrl}${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': locale
        }
      })
        .then(res => res.json())
        .then(data => {
          const items = data.data || data
          const mapped = items.map((item: any) => ({
            label: item[labelProp],
            value: item[keyProp]
          }))
          setOptions(mapped)
        })
        .catch(err => {
          console.error('Failed to fetch options:', err)
          hasFetchedRef.current = false
        })
        .finally(() => setLoading(false))
    }
  }, [apiUrl, accessToken, labelProp, keyProp, locale, staticOptions])

  useEffect(() => {
    hasFetchedRef.current = false
  }, [apiUrl])

  // ✅ Initialize selected values from initialData
  useEffect(() => {
    if (!Array.isArray(initialData) || initialData.length === 0 || options.length === 0) {
      setSelectedValues([])
      return
    }

    // ✅ CASE 1: Simple array mode - initialData is already [1, 2, 3]
    if (simpleArray) {
      const normalizedValues = initialData.map(item => {
        // If item is already a primitive (number/string), use it
        if (typeof item === 'number' || typeof item === 'string') {
          return typeof options[0]?.value === 'string' ? String(item) : item
        }
        // If item is an object (shouldn't happen in simpleArray mode, but handle it)
        const key = editProp ?? keyProp
        return typeof options[0]?.value === 'string' ? String(item[key]) : item[key]
      })

      setSelectedValues(normalizedValues)
      return
    }

    // ✅ CASE 2: Object array mode (current behavior)
    const key = editProp ?? keyProp

    const normalizedValues = initialData.map(item => {
      // If submitKey is provided and item has that key
      if (submitKey && typeof item === 'object' && item !== null && item[submitKey] !== undefined) {
        return typeof options[0]?.value === 'string' ? String(item[submitKey]) : item[submitKey]
      }
      // If item is an object, extract the key
      else if (typeof item === 'object' && item !== null) {
        return typeof options[0]?.value === 'string' ? String(item[key]) : item[key]
      }
      // If item is already a primitive
      return typeof options[0]?.value === 'string' ? String(item) : item
    })

    setSelectedValues(normalizedValues)
  }, [initialData, options, simpleArray, submitKey, editProp, keyProp, name])

  // ✅ Handle checkbox change
  const handleCheckboxChange = useCallback(
    (value: any, checked: boolean) => {
      setSelectedValues(prev => {
        const newValues = checked ? [...prev, value] : prev.filter(v => v !== value)

        // ✅ CASE 1: Simple array mode - return [1, 2, 3]
        if (simpleArray) {
          setTimeout(() => {
            onDataChangeRef.current?.(newValues.length > 0 ? newValues : [])
          }, 0)
          return newValues
        }

        // ✅ CASE 2: Object array mode - return [{submitKey: 1}, {submitKey: 2}]
        const output = submitKey ? newValues.map(v => ({ [submitKey]: Number(v) })) : newValues

        setTimeout(() => {
          onDataChangeRef.current?.(output.length > 0 ? output : [])
        }, 0)

        return newValues
      })
    },
    [submitKey, simpleArray, name]
  )

  // Handle radio change
  const handleRadioChange = useCallback(
    (value: any) => {
      setSelectedValues([value])

      // ✅ Simple array mode returns the value as-is
      if (simpleArray) {
        setTimeout(() => {
          onDataChangeRef.current?.([value])
        }, 0)
      } else {
        setTimeout(() => {
          onDataChangeRef.current?.([value])
        }, 0)
      }
    },
    [simpleArray]
  )

  const isSelected = useCallback(
    (value: any) => {
      return selectedValues.some(v => String(v) === String(value))
    },
    [selectedValues]
  )

  const gridColumns = useMemo(() => {
    return Math.floor(12 / gridSize)
  }, [gridSize])

  // Render for show mode
  if (mode === 'show') {
    const selectedOptions = options.filter(opt => selectedValues.some(v => String(v) === String(opt.value)))

    return (
      <Card className='shadow-xs'>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center' }} className='m-3'>
            <CustomAvatar skin='light' color={'primary'} size={30}>
              <i className={classNames('ri-checkbox-multiple-line', 'text-lg')} />
            </CustomAvatar>
            <Typography className='mx-2' variant='h6'>
              {dictionary?.titles?.[title] || title}
            </Typography>
          </div>
        )}

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {selectedOptions.map((option, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: gridColumns }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    // gap: 4.5,
                    p: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    backgroundColor: 'success.lighter'
                  }}
                >
                  <CustomBadge
                    color={'success'}
                    badgeContent={<i className={`icon-base ri ri-check-line`}></i>}
                    tonal='true'
                    sx={{ marginInlineStart: '35px' }}
                  />
                  <Typography>{option.label}</Typography>
                </Box>
              </Grid>
            ))}
            {selectedOptions.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography color='text.secondary'>لا توجد عناصر محددة</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Card>
    )
  }

  // Render for add/edit mode
  return (
    <Card className='shadow-xs'>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center' }} className='m-3'>
          <CustomAvatar skin='light' color={'primary'} size={30}>
            <i className={classNames('ri-checkbox-multiple-line', 'text-lg')} />
          </CustomAvatar>
          <Typography className='mx-2' variant='h6'>
            {dictionary?.titles?.[title] || title}
          </Typography>
        </div>
      )}

      <Box sx={{ p: 3 }}>
        {loading ? (
          <Typography>جاري التحميل...</Typography>
        ) : type === 'checkbox' ? (
          <Grid container spacing={2}>
            {options.map((option, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: gridColumns }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isSelected(option.value)}
                      onChange={e => handleCheckboxChange(option.value, e.target.checked)}
                      disabled={disabled}
                    />
                  }
                  label={option.label}
                  sx={{
                    height: '40px',
                    width: '100%',
                    m: 0,
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <FormControl component='fieldset' disabled={disabled} sx={{ width: '100%' }}>
            <RadioGroup value={selectedValues[0] || ''} onChange={e => handleRadioChange(e.target.value)}>
              <Grid container spacing={2}>
                {options.map((option, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: gridColumns }}>
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                      sx={{
                        height: '40px',
                        width: '100%',
                        m: 0,
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
        )}
      </Box>
    </Card>
  )
}

export default CheckboxRadioGrid
