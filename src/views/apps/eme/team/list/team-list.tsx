'use client'
import {
  DynamicColumnDef,
  ListComponent,
  statusList,
  toOptions,
  useCityAccess,
  useMemo,
  useSessionHandler
} from '@/shared'

const TeamList = () => {
  const { user, filter_with_city } = useSessionHandler()
  const { locale } = useCityAccess()
  const cityId = user?.context?.city_id || null
  console.log('User Data:', user)
  console.log('Filter With City Setting:', filter_with_city)

  const columns: DynamicColumnDef[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '5%' },
      {
        accessorKey: 'name',
        header: 'name',
        width: '30%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'text'
      },
      {
        accessorKey: 'city.name_ar',
        header: 'city',
        width: '20%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterOptions: toOptions(user?.user_cities, locale as string),
        filterAccessorKey: 'city_id'
      },
      {
        accessorKey: 'team_type.name',
        header: 'team_type',
        width: '20%',
        align: 'text-start',
        enableFilter: true,
        filterApiUrl: '/eme/team-types',
        filterLabelProp: 'name',
        filterKeyProp: 'id',
        filterAccessorKey: 'team_type_id',
        filterType: 'select'
      },
      {
        accessorKey: 'service_type.name',
        header: 'service_type_id',
        width: '20%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/eme/service-types',
        filterLabelProp: 'name',
        filterKeyProp: 'id',
        filterAccessorKey: 'service_type_id'
      },
      {
        accessorKey: 'status',
        header: 'status',
        width: '10%',
        align: 'text-center',
        type: 'badge',
        list: statusList,
        enableFilter: true,
        filterType: 'select',
        filterOptions: statusList
      }
    ],
    [user]
  )
  return (
    <ListComponent
      title='team'
      columns={columns}
      apiEndpoint='/eme/teams'
      routerUrl='/apps/eme/team'
      listView={true}
      enableFilters={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default TeamList
