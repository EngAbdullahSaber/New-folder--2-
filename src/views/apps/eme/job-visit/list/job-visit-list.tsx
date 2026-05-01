'use client'
import * as Shared from '@/shared'
import { jobVisitStatusList } from '@/shared'
import { Condition, Operator } from '@/types/components/statistics'

const JobVisitList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null
  const router = Shared.useRouter()
  const { lang: locale } = Shared.useParams()

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '5%' },
      // { accessorKey: 'city.name_ar', header: 'city', width: '12%', align: 'text-start' },
      // { accessorKey: 'department.department_name_ar', header: 'department', width: '15%', align: 'text-start' },
      // { accessorKey: 'service_type.name', header: 'service_type_id', width: '15%', align: 'text-start' },
      {
        accessorKey: 'form_type.short_name',
        header: 'form_type_id',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/eme/form-types',
        filterLabelProp: 'name',
        filterKeyProp: 'id',
        filterAccessorKey: 'form_type_id'
      },
      {
        accessorKey: 'reference.reference_name',
        header: 'reference',
        width: '12%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/eme/service-area-references',
        filterDisplayProps: ['register_no', 'reference_id', 'reference_name', 'service_type_name'],
        filterSearchProps: ['reference_id', 'reference_name'],
        filterKeyProp: 'reference_id',
        filterAccessorKey: 'reference_id'
      },
      {
        accessorKey: 'visit_date',
        header: 'visit_date',
        width: '10%',
        align: 'text-center',
        type: 'date',
        enableFilter: true,
        filterType: 'date'
      },
      {
        accessorKey: 'team.name',
        header: 'team',
        width: '8%',
        align: 'text-start',

        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/eme/teams',
        filterLabelProp: 'name',
        filterKeyProp: 'id',
        filterAccessorKey: 'team_id',
        filterQueryParams: {
          ...(typeof (user?.personal_id !== 'undefined') ? { team_members: { personal_id: user?.personal_id } } : {})
        }
      },
      {
        accessorKey: 'visit_no',
        header: 'visit_no',
        width: '8%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'text'
      },

      // { accessorKey: 'serial_no', header: 'serial_no', width: '10%', align: 'text-start' },
      {
        accessorKey: 'status',
        header: 'status',
        width: '12%',
        type: 'badge',
        list: jobVisitStatusList,
        align: 'text-center',
        enableFilter: true,
        filterType: 'select',
        filterOptions: jobVisitStatusList
      }
    ],
    [user]
  )

  const rowOptions = [
    { text: 'edit', action: 'edit', visible: true },
    { text: 'delete', action: 'delete', visible: true },
    {
      text: 'create_visit',
      action: 'create_visit',
      icon: 'ri-add-box-line',
      color: 'warning',
      isExternal: true,
      disabled: (row: any) => String(row.status) !== '1'
    }
  ]

  const handleRowOptionClick = (action: string, id: any, row: any) => {
    if (action === 'create_visit' || action === 'edit') {
      const target = action === 'create_visit' || String(row?.status) !== '1' ? 'last' : 'previous'

      let editAction = ''
      if (target == 'last') editAction = 'create'

      const url = Shared.getLocalizedUrl(
        `/apps/eme/job-visit/details?id=${id}&mode=edit&visitTarget=${target}&action=${action == 'edit' ? 'update' : action == 'create_visit' ? 'create' : ''}`,
        locale as Shared.Locale
      )

      router.push(url)

      return true
    }
  }

  if (shouldBlockAccess) return <AccessBlockedScreen />

  const statsConfig: Shared.StatCardConfig[] = [
    // {
    //   field: 'status',
    //   sectionTitle: 'status',
    //   gridSize: 12,
    //   chartOptions: {
    //     gridSize: 3,
    //     icon: 'ri-information-line',
    //     totalIcon: 'ri-database-2-line',
    //     unknownIcon: 'ri-question-line',
    //     color: 'info',
    //     unknownLabel: 'غير محدد',
    //     totalLabel: 'الإجمالي'
    //   },
    //   options: mahderStatusList
    // }
    {
      field: 'form_type_id',
      keyTitle: 'form_type_id',
      sectionTitle: 'form_type_id',
      type: 'card',
      gridSize: 12,
      relations: {
        name: 'form_type',
        column: 'name'
      },
      chartOptions: {
        icon: 'ri-file-text-line',
        totalIcon: 'ri-database-2-line',
        color: 'info',
        unknownIcon: 'ri-question-line',
        gridSize: 3
      }
      // filter: {
      //   condition: Condition.AND,
      //   rules: [
      //     {
      //       field: 'city_id',
      //       operator: Operator.EQ,
      //       value: [cityId]
      //     }
      //   ]
      // }
    }
  ]

  return (
    <Shared.ListComponent
      title='job_visit'
      columns={columns}
      apiEndpoint='/eme/job-visits'
      routerUrl='/apps/eme/job-visit'
      listView={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
      rowOptions={rowOptions}
      onRowOptionClick={handleRowOptionClick}
      showStats={true}
      statsConfig={statsConfig}
      enableFilters={true}
    />
  )
}

export default JobVisitList
