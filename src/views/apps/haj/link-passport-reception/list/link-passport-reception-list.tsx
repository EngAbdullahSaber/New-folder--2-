'use client'
import { useSettings } from '@/@core/hooks/useSettings'
import {
  allowanceScopeList,
  apiClient,
  Box,
  cardPrintingStatusList,
  contentTypeList,
  DynamicColumnDef,
  emitEvent,
  genderOptions,
  hajjCardStatus,
  handoverFlowTypeList,
  handoverMethodList,
  ListComponent,
  LoadingContext,
  LoadingSpinner,
  Locale,
  onEvent,
  statusList,
  toast,
  Tooltip,
  transactionTypeList,
  useCallback,
  useContext,
  useEffect,
  useParams,
  useSessionHandler,
  useState,
  useTheme,
  yesNoList
} from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'
import { getDictionary } from '@/utils/getDictionary'
import { unsubscribe } from 'diagnostics_channel'
import Swal from 'sweetalert2'
import { useAppSettings } from '../../hooks/useAppSettings'
import { getOperatorConfig } from '@/configs/environment'

const LinkPassportReceptionList = ({ scope }: ComponentGeneralProps) => {
  const { user, accessToken } = useSessionHandler()
  const [appSetting, setAppSetting] = useState<any>()
  const { lang: locale } = useParams()
  const [dictionary, setDictionary] = useState<any>(null)
  const { settings } = useSettings()
  let theme = settings.mode == 'dark' ? 'dark' : 'light'
  const { darkImage, lightImage, title, apiUrl } = getOperatorConfig()
  const [departmentIds, setDepartmentIds] = useState<number[]>([])
  const [isReady, setIsReady] = useState(scope !== 'department') // إذا مش department، جاهز فوراً

  useEffect(() => {
    getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])

  const columns: DynamicColumnDef[] = [
    // { accessorKey: 'id', header: 'id', width: '5%' },
    {
      accessorKey: 'ad_union_no',
      header: 'ad_union_no',
      width: '7%',
      align: 'text-center',
      showPrimary: false,
      isIdentifier: true,
      fetchKey: 'id',
      routerUrl: `/apps/haj/link-passport-reception/${scope}`,
      enableFilter: true,
      filterType: 'number'
    },

    {
      accessorKey: 'applicantData.ad_full_name_en',
      header: 'name',
      align: 'text-left',
      showPrimary: false,
      enableFilter: true,
      filterType: 'text',
      width: '20%'

    },
    // {
    //   accessorKey: 'ad_gender',
    //   header: 'ad_gender',
    //   type: 'selectIcon',
    //   list: genderOptions,
    //   width: '7%',
    //   align: 'text-center',
    //   showPrimary: false
    // },
    // {
    //   accessorKey: 'ad_date_of_birth',
    //   header: 'birth_date',
    //   width: '10%',
    //   align: 'text-center',
    //   type: 'date',
    //   showPrimary: false
    // },

    {
      accessorKey: 'nationality_name_ar',
      header: 'nationality',
      width: '10%',
      align: 'text-start',
      showPrimary: false,
      enableFilter: true,
      filterType: 'select',
      filterApiUrl: '/def/nationalities',
      filterLabelProp: 'name_ar',
      filterKeyProp: 'id',
      filterAccessorKey: 'nation_id'
    },

    {
      accessorKey: 'passport_no',
      header: 'ad_passport_no',
      width: '6%',
      align: 'text-center',
      showPrimary: false,
      enableFilter: true,
      filterType: 'text'
    },

    {
      accessorKey: 'applicantData.requester.name_ar',
      header: 'ad_entity_id',
      width: '20%',
      align: 'text-start',
      enableFilter: true,
      filterType: 'select',
      filterApiUrl: '/haj/provider-requests',
      filterLabelProp: 'name_ar',
      filterKeyProp: 'id',
      filterAccessorKey: 'ad_entity_id',
      filterQueryParams: { type: [1, 2, 3] },
      filterDisplayProps: ['name_ar', 'type_name'],
      filterSearchProps: ['name_ar', 'type_name']
    },

    {
      accessorKey: 'ownerDepartment.department_name_ar',
      header: 'heb_id',
      width: '10%',
      align: 'text-start',
      showPrimary: false,
    },

    {
      accessorKey: 'passportArchiving.cabinet_no',
      header: 'save_location',
      width: '7%',
      showPrimary: false,
      align: 'text-center',
      enableFilter: true,
      filterType: 'number',
      cell: ({ row }: any) => {
        return (
          <div className={`text-xs text-center`}>
            {row?.original?.passportArchiving?.cabinet_no} / {row?.original?.passportArchiving?.shelf_no}
          </div>
        )
      }
    },
    // {
    //   accessorKey: 'passport_archiving_shelf_no',
    //   header: 'shelf_no',
    //   width: '5%',
    //   showPrimary: false,
    //   align: 'text-center'
    // },
    {
      accessorKey: 'companyApplicantData.serial_no',
      header: 'serial',
      width: '5%',
      showPrimary: false,
      align: 'text-center',
      enableFilter: true,
      filterType: 'number',
    },
    {
      accessorKey: 'passportArchiving.shelf_no',
      header: 'nusuk_cards',
      align: 'text-center',
      width: '10%',



      cell: ({ row }: any) => {
        const data = row.original?.applicantData || row.original
        const theme = useTheme()

        const cardStatusValue = data?.card?.card_status_id || data?.card_status_id
        const currentStatus = hajjCardStatus.find(s => s.value === cardStatusValue)

        const statusConfig = {
          icon: currentStatus?.icon || 'ri-question-line',
          tooltip: currentStatus ? currentStatus.label : locale === 'ar' ? 'غير محدد' : 'Undefined',
          color: currentStatus?.color || 'secondary'
        }

        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Tooltip title={statusConfig.tooltip} arrow placement='top'>
              <span style={{ display: 'flex' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    color: statusConfig.color === 'disabled' ? 'text.disabled' : `${statusConfig.color}.main`,
                    transition: 'all 0.2s ease-in-out',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      bgcolor: theme.palette.action.hover
                    }
                  }}
                >
                  <i className={statusConfig.icon} style={{ fontSize: '1.2rem', lineHeight: 1 }} />
                </Box>
              </span>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  useEffect(() => {
    const unsubscribeDownload = onEvent('list:print-data', async (event: CustomEvent) => {
      const { rows } = event.detail || {}

      const archIds = rows.map((item: any) => item.archiving_id)

      try {
        emitEvent('loading', { type: 'download' })

        const response: any = await apiClient.post(
          `/haj/passports-archiving/stickers`,
          {
            archiving_ids: archIds
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Accept-Language': locale
            },
            responseType: 'blob'
          }
        )
        emitEvent('list:reset')

        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)

        window.open(url)

        const link = document.createElement('a')
        link.href = url
        link.download = 'card.pdf'
        link.click()
        toast.success(
          dictionary?.messages?.download_success ||
          (locale === 'ar' ? 'تم تحميل ملف PDF بنجاح' : 'PDF downloaded successfully')
        )
      } catch (err: any) {
        console.error('Download failed', err)
        toast.error(
          dictionary?.messages?.download_failed || (locale === 'ar' ? 'فشل تحميل ملف PDF' : 'Failed to download PDF')
        )
      } finally {
        emitEvent('loading', { type: 'download' })
      }
    })

    return () => {
      unsubscribeDownload()
    }
  }, [locale, accessToken, dictionary])

  const { loading } = useContext(LoadingContext)
  const isDownloading = loading.includes('download')

  const handleRowOptionClick = useCallback(
    async (action: string, id: any, row: any) => {
      if (action === 'delete') {
        const applicant_data_id = row?.applicantData.id
        const department_id = row?.owner_department_id

        if (!applicant_data_id || !department_id) {
          toast.error(locale === 'ar' ? 'بيانات ناقصة للحذف' : 'Missing data for deletion')
          return true
        }

        const result = await Swal.fire({
          title: locale === 'ar' ? 'هل أنت متأكد ؟' : 'Are you sure?',
          html:
            locale === 'ar'
              ? `<div style="font-size: 1.1rem; margin-top: 10px;">يرجى تأكيد حذف (${row.ad_full_name || row.name
              }) رقم الجواز (${row.passport_no || row.ad_passport_no})</div>`
              : `<div style="font-size: 1.1rem; margin-top: 10px;">Please confirm delete (${row.ad_full_name || row.name
              }) Passport No. (${row.passport_no || row.ad_passport_no})</div>`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: locale === 'ar' ? 'تأكيد' : 'Confirm',
          cancelButtonText: locale === 'ar' ? 'إلغاء' : 'Cancel',
          backdrop: true,
          allowOutsideClick: false,
          customClass: {
            container: 'swal-over-modal'
          },
          theme: theme as any
        })

        if (!result.isConfirmed) return true

        try {
          await apiClient.post(
            '/haj/recepted-hajjees/delete',
            {
              department_id,
              applicant_data_id
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Accept-Language': locale
              }
            }
          )

          toast.success(locale === 'ar' ? 'تم الحذف بنجاح' : 'Deleted successfully')
          emitEvent('list:reset')
        } catch (error) {
          console.error('Delete failed', error)
          toast.error(locale === 'ar' ? 'فشل الحذف' : 'Delete failed')
        }
        return true
      }
      return false
    },
    [accessToken, locale, dictionary]
  )

  const appSettings = useAppSettings(accessToken, 'list', 0, (locale as string) || 'ar', {}, false)
  useEffect(() => {
    if (appSettings) {
      // City has value
      setAppSetting(appSettings)
    } else {
      // Is Transportation Center is empty - clear everything
      setAppSetting(null)
    }
  }, [appSettings, appSetting])

  useEffect(() => {
    if (scope !== 'department') return
    if (!appSetting?.service_department_type_id || !accessToken) return

    const fetchDepartments = async () => {
      try {
        const response: any = await apiClient.post(
          '/aut/user/departments',
          { department_types: { id: appSetting.service_department_type_id } },
          { headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': locale } }
        )

        const ids = (response?.data?.data || []).map((dept: any) => dept.id)
        setDepartmentIds(ids)
      } catch (error) {
        console.error('Failed to fetch departments', error)
      } finally {
        setIsReady(true) // ✅ حتى لو فشل، اعرض الـ list
      }
    }

    fetchDepartments()
  }, [appSetting?.service_department_type_id, accessToken, scope, locale])

  // ✅ في الـ return
  if (!isReady) return <LoadingSpinner type='skeleton' />

  return (
    <ListComponent
      title='link_passport_reception'
      columns={columns}
      apiEndpoint='/haj/recepted-hajjees'
      routerUrl={`/apps/haj/link-passport-reception/${scope}`}
      showOnlyOptions={['add', 'search', 'delete', 'print', 'export']}
      onRowOptionClick={handleRowOptionClick}
      enableFilters={true}
      extraActionConfig={{
        action: 'list:print-data',
        title: 'print_data',
        icon: <i className='ri-printer-cloud-line' />,
        color: 'rgb(255 152 0)',
        loading: isDownloading
      }}
      extraQueryParams={
        scope === 'department' && departmentIds.length > 0 ? { owner_department_id: departmentIds } : {}
      }
    />
  )
}

export default LinkPassportReceptionList
