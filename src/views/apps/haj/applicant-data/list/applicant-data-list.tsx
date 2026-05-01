'use client'
import {
  Box,
  DynamicColumnDef,
  genderOptions,
  hajjCardStatus,
  ListComponent,
  Locale,
  passportTypeList,
  statusList,
  Tooltip,
  useEffect,
  useParams,
  useState,
  useTheme
} from '@/shared'
import { getDictionary } from '@/utils/getDictionary'

const ApplicantDataList = () => {
  const [dictionary, setDictionary] = useState<any>(null)
  const { lang: locale } = useParams()

  useEffect(() => {
    getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])
  const columns: DynamicColumnDef[] = [
    // { accessorKey: 'id', header: 'id', width: '5%' },
    {
      accessorKey: 'ad_union_no',
      header: 'ad_union_no',
      width: '10%',
      align: 'text-center',
      fetchKey: 'id',
      isIdentifier: true,
      routerUrl: '/apps/haj/applicant-data',
      enableFilter: true,
      filterType: 'number'
    },
    // {
    //   accessorKey: 'ad_border_number',
    //   header: 'ad_border_number',
    //   width: '10%',
    //   align: 'text-center'
    // },
    {
      accessorKey: 'ad_full_name_en',
      header: 'name',
      align: 'text-right',
      enableFilter: true,
      filterType: 'text',
      
      cell: ({ row }: any) => {
        return (
          <div className={`text-xs ${row?.original.ad_full_name_ar ? 'text-right' : 'text-left'}`}>
            {row.original.ad_full_name_ar ?? row.original.ad_full_name_en}
          </div>
        )
      },
      
    },
    {
      accessorKey: 'ad_gender',
      header: 'ad_gender',
      type: 'badge',
      list: genderOptions,
      width: '7%',
      align: 'text-center',
      enableFilter: true,
      filterType: 'select',
      filterOptions: genderOptions,
      cell: ({ row }: any) => {
        const data = row.original
        const theme = useTheme()

        const genderConfig = genderOptions.find(option => Number(option.value) === Number(data?.ad_gender))

        return (
          <Tooltip title={genderConfig ? genderConfig.label : ''} arrow placement='top'>
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  color: genderConfig ? `${genderConfig.color}.main` : 'text.disabled',
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: '4px'
                }}
              >
                <i className={genderConfig?.icon || 'ri-question-line'} style={{ fontSize: '1.2rem', lineHeight: 1 }} />
              </Box>
            </span>
          </Tooltip>
        )
      }
    },
    { accessorKey: 'ad_date_of_birth',
       header: 'ad_date_of_birth', 
       width: '10%', align: 'text-center', type: 'date',
       enableFilter: true,filterType: 'date' },

    {
      accessorKey: 'current_nationality.name_ar',
      header: 'nationality',
      width: '13%',
      align: 'text-start',
      enableFilter: true,
      filterType: 'select',
      filterApiUrl: '/def/nationalities',
      filterLabelProp: 'name_ar',
      filterKeyProp: 'id',
      filterAccessorKey: 'ad_current_nationality_id'
    },

    {
      accessorKey: 'ad_passport_no',
      header: 'ad_passport_no',
      width: '10%',
      align: 'text-center',
      enableFilter: true,
      filterType: 'text'
    },

    {
      accessorKey: 'nusuk_cards',
      header: 'nusuk_cards',
      align: 'text-center',
      width: '10%',
 
      cell: ({ row }: any) => {
        const data = row.original?.applicant_data || row.original
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
    },

    {
      accessorKey: 'receptedHajjes.owner_department.department_name_ar',
      header: 'assign_service',
      width: '12%',
      align: 'text-start',
  
    },
    {
      accessorKey: 'requester.name_ar',
      header: 'ad_entity_id',
      width: '12%',
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
    }

    // {
    //   accessorKey: 'ad_spc_company_mecca.company_name_ar',
    //   header: 'spc_id',
    //   width: '13%',
    //   align: 'text-start'
    // },

    // {
    //   accessorKey: 'ad_spc_company_madina.company_name_ar',
    //   header: 'ad_spc_company_id_madina',
    //   width: '13%',
    //   align: 'text-start'
    // },
  ]

  return (
    <ListComponent
      title='applicant_data'
      columns={columns}
      apiEndpoint='/haj/applicants'
      routerUrl='/apps/haj/applicant-data'
      listView={true}
      fetchKey='id'
      enableFilters={true}
    />
  )
}

export default ApplicantDataList
