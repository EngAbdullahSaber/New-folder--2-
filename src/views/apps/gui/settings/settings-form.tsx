'use client'

import { useForm, useFieldArray, FormProvider, Controller } from 'react-hook-form'
import { Grid, Button, TextField, Divider, CircularProgress } from '@mui/material'
import {
  apiClient,
  DynamicFormField,
  fetchRecords,
  handleSave,
  Locale,
  toast,
  useContext,
  useEffect,
  useParams,
  useSessionHandler,
  useState
} from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import { LoadingContext } from '@/contexts/loadingContext'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

type SettingItem = {
  key: string
  type: 'file' | 'text' | 'upload_image' | 'email' | 'empty'
  required?: boolean
  grid?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
  }
  fielableType?: string
}

type SettingsFormData = {
  settings: { key: string; value: string | File | null }[]
}

const DEFAULT_SETTINGS: SettingItem[] = [
  // { key: 'files', type: 'storage', required: false },
  { key: 'logo_light', type: 'upload_image', grid: { xs: 12, md: 6 }, required: false, fielableType: 'def_settings' },
  { key: 'logo_dark', type: 'upload_image', grid: { xs: 12, md: 6 }, required: false, fielableType: 'def_settings' },
  { key: 'email', type: 'email', grid: { xs: 12, md: 6 }, required: true },
  { key: 'mobile', type: 'text', grid: { xs: 12, md: 6 }, required: true },
  { key: 'address', type: 'text', grid: { xs: 12, md: 6 }, required: true },
  { key: 'copyright', type: 'text', grid: { xs: 12, md: 6 }, required: true }
]

const SettingsForm = () => {
  const params = useParams()
  const { lang: locale } = params
  const [dictionary, setDictionary] = useState<any>(null)
  const { accessToken } = useSessionHandler()
  const { loading } = useContext(LoadingContext)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const methods = useForm<SettingsFormData>({
    defaultValues: {
      settings: DEFAULT_SETTINGS.map(s => ({ key: s.key, value: '' }))
    }
  })

  const { reset } = methods

  const normalizeBackendSettings = (apiSettings: any[]) => {
    const values: (string | null)[] = []

    apiSettings.forEach(item => {
      if (item?.value != null) {
        values.push(item.value)
      }
    })

    return values
  }

  useEffect(() => {
    const getSettings = async () => {
      try {
        setLoadingDetails(true)
        const response = await apiClient.get('/def/settings', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': locale
          }
        })

        const apiSettings = response.data.data as any[]
        const mappedSettings = DEFAULT_SETTINGS.map(setting => {
          const backendItem = apiSettings.find(item => item.key === setting.key)

          return {
            key: setting.key,
            value: backendItem?.value ?? '',
            id: backendItem?.id || ''
          }
        })

        reset({ settings: mappedSettings })
      } catch (err) {
      } finally {
        setLoadingDetails(false)
      }
    }
    if (accessToken) getSettings()
  }, [accessToken])

  useEffect(() => {
    const fetchDictionary = async () => {
      const res = await getDictionary(locale as Locale)
      setDictionary(res)
    }
    fetchDictionary()
  }, [locale])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = methods

  const { fields } = useFieldArray({
    control,
    name: 'settings'
  })
  const onSubmit = async (data: SettingsFormData) => {
    try {
      setSubmitLoading(true)
      // const response = await handleSave('/def/settings', locale as Locale, data?.settings, null, accessToken, true)
      const response = await apiClient.put('/def/settings/bulk-update', data.settings, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept-Language': locale
        }
      })
      toast.success('تمت العميلة بنجاح')
    } catch (err) {
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loadingDetails) {
    return <LoadingSpinner type='skeleton' />
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {fields.map((field, index) => {
            const setting = DEFAULT_SETTINGS[index]

            return (
              <Grid
                key={field.id}
                size={{
                  xs: setting.grid?.xs ?? 12,
                  sm: setting.grid?.sm,
                  md: setting.grid?.md,
                  lg: setting.grid?.lg
                }}
              >
                <Controller
                  name={`settings.${index}.value`}
                  control={control}
                  rules={
                    setting.required
                      ? { required: { value: true, message: 'الحقل مطلوب' } }
                      : { required: { value: false, message: '' } }
                  }
                  render={({ field, fieldState }) => {
                    const error = fieldState.error?.message

                    return (
                      <DynamicFormField
                        {...field}
                        label={setting.key}
                        // name={setting.key}
                        type={setting.type}
                        locale={locale as Locale}
                        // control={control}
                      />
                    )
                  }}
                />
              </Grid>
            )
          })}
          <Divider />
          {/* ACTIONS */}
          <Grid size={{ xs: 12 }} display={'flex'} justifyContent={'flex-end'}>
            <Button
              loadingIndicator={<CircularProgress color='info' size={'1rem'} />}
              loadingPosition='start'
              loading={submitLoading}
              type='submit'
              variant='contained'
            >
              {dictionary?.actions?.['save']}
            </Button>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  )
}

export default SettingsForm
