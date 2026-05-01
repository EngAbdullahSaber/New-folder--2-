'use client'
import * as Shared from '@/shared'
import { useDispatch } from 'react-redux'
import { setUserData, setFilterWithCity, setIsTabActive } from '@/redux-store/slices/userSlice'

import { useForm, FormProvider, Controller } from 'react-hook-form'
import { Grid, Button, Divider, CircularProgress, Card, CardHeader, CardContent } from '@mui/material'
import {
  DynamicFormField,
  Locale,
  toast,
  useContext,
  useEffect,
  useParams,
  useSessionHandler,
  useState,
  useRouter,
  apiClient
} from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import { LoadingContext } from '@/contexts/loadingContext'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useSuccessApi } from '@/contexts/successApiProvider'
import { useRegisterPageTab } from '@/hooks/useRegisterPageTab'

type UserSettingsFormData = {
  city_id: any
  active_department_id: any
  season_ids: any
  financial_year_ids: any
  personal_id: any
  filter_with_city: boolean
}

const UserSettingsForm = () => {
  const router = useRouter()
  const params = useParams()
  const { lang: locale } = params
  const [dictionary, setDictionary] = useState<any>(null)
  const { user, userDepartments, accessToken, update, filter_with_city: reduxFilterWithCity } = useSessionHandler()
  const dispatch = useDispatch()
  const { loading } = useContext(LoadingContext)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const { setSuccess } = useSuccessApi()

  // Register this page as a tab
  useRegisterPageTab(dictionary?.navigation?.userSettings || 'إعدادات المستخدم', 'ri-settings-4-line')

  const methods = useForm<UserSettingsFormData>({
    defaultValues: {
      city_id: null,
      active_department_id: null,
      season_ids: null,
      financial_year_ids: null,
      personal_id: null,
      filter_with_city: true
    }
  })

  const { reset, handleSubmit, control } = methods

  useEffect(() => {
    const fetchDictionary = async () => {
      const res = await getDictionary(locale as Locale)
      setDictionary(res)
    }
    fetchDictionary()
  }, [locale])

  useEffect(() => {
    if (dictionary && user) {
      reset({
        city_id: user?.context?.city_id,
        active_department_id: user?.context?.department_id,
        season_ids: user?.context?.season,
        financial_year_ids: user?.context?.year,
        personal_id: user?.personal_id,
        filter_with_city: reduxFilterWithCity
      })

      setLoadingDetails(false)
    }
  }, [dictionary, user, reset, reduxFilterWithCity])

  const onSubmit = async (data: UserSettingsFormData) => {
    try {
      setSubmitLoading(true)

      // Prepare API Payload
      const apiPayload = {
        department_id: data.active_department_id,
        city_id: Number(data.city_id),
        season: data.season_ids,
        year: data.financial_year_ids
      }

      // Sync with Redux persist store
      dispatch(setFilterWithCity(data.filter_with_city))

      // 1. Save to API
      const response = await apiClient.put('/def/context', apiPayload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const newContext = response.data?.context

      // Update session context
      const updatedUser = {
        ...user,
        context: {
          ...user?.context,
          ...newContext
        }
      }

      // 1. Update Redux (immediate UI update)
      dispatch(setUserData(updatedUser))

      // 2. Update session context (persists to next-auth)
      if (update) {
        await update({
          user: {
            context: updatedUser.context
          }
        })
      }

      // toast.success(dictionary?.messages?.success || 'تم حفظ الإعدادات بنجاح')
      setSuccess('تم حفظ الإعدادات بنجاح')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error(dictionary?.messages?.error || 'حدث خطأ ما')
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loadingDetails || !dictionary) {
    return <LoadingSpinner type='skeleton' />
  }

  const fieldsConfig = [
    {
      name: 'city_id',
      label: dictionary?.titles?.cities || 'Cities',
      type: 'select',
      options: Shared.toOptions(user?.user_cities, locale as string),
      defaultValue: user?.context?.city_id,
      multiple: false,
      gridSize: { xs: 12, md: 6 }
    },
    {
      name: 'active_department_id',
      label: dictionary?.titles?.active_department || 'Active Department',
      type: 'select',
      options: userDepartments?.map((d: any) => ({
        label: locale === 'ar' ? d.department_name_ar : d.department_name_la,
        value: d.id
      })),
      labelProp: 'label',
      keyProp: 'value',
      multiple: false,
      gridSize: { xs: 12, md: 6 }
    },
    {
      name: 'season_ids',
      label: dictionary?.titles?.season || 'Season',
      type: 'select',
      apiUrl: '/def/seasons',
      labelProp: 'id',
      keyProp: 'id',
      apiMethod: 'POST',
      multiple: false,
      gridSize: { xs: 12, md: 6 }
    },
    {
      name: 'financial_year_ids',
      label: dictionary?.titles?.financial_years || 'Financial Years',
      type: 'select',
      options: [
        { value: '2026', label: '2026' },
        { value: '2025', label: '2025' }
      ],
      labelProp: 'label',
      keyProp: 'value',
      multiple: false,
      gridSize: { xs: 12, md: 6 }
    },
    // {
    //   name: 'personal_id',
    //   label: dictionary?.titles?.personal || 'Personal',
    //   type: 'select',
    //   apiUrl: '/def/personal',
    //   labelProp: 'full_name_ar',
    //   keyProp: 'id',
    //   apiMethod: 'GET',
    //   multiple: false,
    //   gridSize: { xs: 12 }
    // },
    {
      name: 'filter_with_city',
      label: 'فلترة البيانات حسب المدينة',
      type: 'switch',
      disabled: !user?.user_groups?.some((group: any) => (group?.id ? Number(group.id) : Number(group)) === 1),
      defaultValue: true,
      gridSize: { xs: 12, md: 6 }
    }
  ]

  return (
    <Card>
      <CardHeader title={dictionary?.navigation?.userSettings || 'إعدادات المستخدم'} />
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={5}>
              {fieldsConfig.map(field => (
                <Grid key={field.name} size={field.gridSize}>
                  <DynamicFormField
                    name={field.name}
                    label={field.label}
                    type={field.type as any}
                    apiUrl={field.apiUrl}
                    options={field.options}
                    labelProp={field.labelProp}
                    keyProp={field.keyProp}
                    apiMethod={field.apiMethod as any}
                    multiple={field.multiple}
                    locale={locale as Locale}
                    control={control}
                    disabled={field.disabled}
                    defaultValue={field.defaultValue}
                    onChange={(val: any) => {
                      // Handled by react-hook-form Controller internally
                    }}
                  />
                </Grid>
              ))}

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  loadingIndicator={<CircularProgress color='info' size='1rem' />}
                  loading={submitLoading}
                  type='submit'
                  variant='contained'
                >
                  {dictionary?.actions?.save || 'حفظ'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default UserSettingsForm
