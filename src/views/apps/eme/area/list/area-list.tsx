'use client'
import { DynamicColumnDef, ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', align: 'text-start', enableFilter: true, filterType: 'text' },
  {
    accessorKey: 'service_type.name',
    header: 'service_type_id',
    width: '20%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'select',
    filterApiUrl: '/eme/service-types',
    filterLabelProp: 'name',
    filterKeyProp: 'id',
    filterAccessorKey: 'service_type_id'
  },
  {
    accessorKey: 'order_no',
    header: 'order_no',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
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
]

const AreaList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='area'
      columns={columns}
      apiEndpoint='/eme/areas'
      routerUrl='/apps/eme/area'
      listView={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
      enableFilters={true}
    />
  )
}

export default AreaList
