'use client'
import {
  apiClient,
  Box,
  ListComponent,
  receptionTypeList,
  StatCardConfig,
  Tooltip,
  useParams,
  useSessionHandler,
  useState,
  useEffect,
  useTheme
} from '@/shared'
import { Locale } from '@/shared'
import { ComponentGeneralReceptionProps } from '@/types/pageModeType'
import { useAppSettings } from '../../hooks/useAppSettings'

const ReceptionList = ({ scope }: ComponentGeneralReceptionProps) => {
  const { user, accessToken } = useSessionHandler()
  const { lang: locale } = useParams()
  const [departmentIds, setDepartmentIds] = useState<number[]>([])
  const [isReady, setIsReady] = useState(scope !== 'service-department' && scope !== 'reception-department')
  const [appSetting, setAppSetting] = useState<any>()

  const appSettings = useAppSettings(accessToken, 'list', 0, (locale as string) || 'ar', {}, false)

  useEffect(() => {
    if (appSettings) {
      setAppSetting(appSettings)
    } else {
      setAppSetting(null)
    }
  }, [appSettings])

  useEffect(() => {
    if (scope !== 'service-department' && scope !== 'reception-department') return
    if (!appSetting || !accessToken) return

    const isService = scope === 'service-department'
    const typeId = isService ? appSetting?.service_department_type_id : appSetting?.reception_department_type_id

    if (!typeId) {
      setIsReady(true)
      return
    }

    const fetchDepartments = async () => {
      try {
        const response: any = await apiClient.post(
          '/aut/user/departments',
          { department_types: { id: typeId } },
          { headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': locale } }
        )
        const ids = (response?.data?.data || []).map((dept: any) => dept.id)
        setDepartmentIds(ids)
      } catch (error) {
        console.error('Failed to fetch departments', error)
      } finally {
        setIsReady(true)
      }
    }

    fetchDepartments()
  }, [appSetting, accessToken, scope, locale])

  // ✅ Build extraQueryParams based on scope
  const extraQueryParams = (() => {
    if (scope === 'service-department') {
      return { service_department_id: departmentIds }
    }
    if (scope === 'reception-department') {
      return { reception_department_id: departmentIds }
    }
    return {}
  })()

  const columns = [
    {
      accessorKey: 'reception_no',
      header: 'reception_no',
      width: '7%',
      align: 'text-center',
      fetchKey: 'id',
      isIdentifier: true,
      routerUrl: `/apps/haj/reception/${scope}`
    },
    {
      accessorKey: 'reception_type',
      header: 'reception_type',
      align: 'text-center',
      width: '10%',
      list: receptionTypeList,
      type: 'badge',

      cell: ({ row }: any) => {
        const data = row.original
        const theme = useTheme()

        const statusConfig = [
          {
            key: 'reception_type',
            icon:
              Number(data?.reception_type) === 1
                ? 'ri-plane-line'
                : Number(data?.reception_type) === 2
                  ? 'ri-bus-line'
                  : 'ri-info-line',
            color:
              Number(data?.reception_type) === 1 ? 'info' : Number(data?.reception_type) === 2 ? 'primary' : 'disabled'
          }
        ]

        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
            {statusConfig.map(status => (
              <Tooltip key={status.key} title={''} arrow placement='top'>
                <span style={{ display: 'flex' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      color: status.color === 'disabled' ? 'text.disabled' : `${status.color}.main`,
                      transition: 'all 0.2s ease-in-out',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.2)', bgcolor: theme.palette.action.hover }
                    }}
                  >
                    <i className={status.icon} style={{ fontSize: '1.2rem', lineHeight: 1 }} />
                  </Box>
                </span>
              </Tooltip>
            ))}
          </Box>
        )
      }
    },
    {
      accessorKey: 'manifest_id',
      header: 'document_no',
      width: '10%',
      align: 'text-center',
      cell: ({ row }: any) => (
        <div className='text-xs text-center'>{row.original.manifest_id ?? row.original.tdm_id}</div>
      )
    },
    {
      accessorKey: 'reception_date',
      header: 'reception_date',
      width: '10%',
      align: 'text-start',
      type: 'date'
    },
    ...(scope !== 'reception-department'
      ? [
          {
            accessorKey: 'reception_department.department_name_ar',
            header: 'reception_department_id',
            width: '15%',
            align: 'text-start'
          }
        ]
      : []),
    ...(scope !== 'service-department'
      ? [
          {
            accessorKey: 'service_department.department_name_ar',
            header: 'service_department_id',
            width: '15%',
            align: 'text-start'
          }
        ]
      : []),
    { accessorKey: 'total_hajj', header: 'total_hajj', width: '10%', align: 'text-center' }
  ]

  const statsConfig: StatCardConfig[] = [
    {
      field: 'reception_type',
      sectionTitle: 'reception_type',
      gridSize: 12,
      chartOptions: {
        gridSize: 3,
        icon: 'ri-information-line',
        totalIcon: 'ri-database-2-line',
        unknownIcon: 'ri-question-line',
        color: 'info',
        unknownLabel: 'غير محدد',
        totalLabel: 'الإجمالي'
      },
      options: receptionTypeList
    },
    {
      field: 'service_department_id',
      keyTitle: 'service_department_id',
      sectionTitle: 'service_department_id',
      type: 'bar',
      gridSize: 12,
      relations: { name: 'service_department', column: 'department_name_ar' },
      chartOptions: {
        icon: 'ri-layout-grid-line',
        totalIcon: 'ri-database-2-line',
        color: 'info',
        unknownIcon: 'ri-question-line',
        gridSize: 12
      }
    }
  ]

  if (!isReady) return null

  return (
    <ListComponent
      title='reception'
      columns={columns}
      apiEndpoint='/haj/receptions'
      routerUrl={`/apps/haj/reception/${scope}`}
      listView={true}
      showStats={true}
      statsConfig={statsConfig}
      extraQueryParams={extraQueryParams}
    />
  )
}

export default ReceptionList
