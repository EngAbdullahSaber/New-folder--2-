'use client'
import { ListComponent, portTypeList, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'srv_code', header: 'business_id', width: '10%', align: 'text-center' },
  { accessorKey: 'port_name_ar', header: 'name_ar', width: '40%', align: 'text-right' },
    { accessorKey: 'port_code', header: 'code', width: '10%', align: 'text-center' },
  { accessorKey: 'port_type', header: 'type', width: '15%', align: 'text-center', type: 'badge', list: portTypeList },
  { accessorKey: 'status', header: 'status', width: '15%', align: 'text-center', type: 'badge', list: statusList }
]

const PortsList = () =>   {
    const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
  <ListComponent title='ports' columns={columns} 
  apiEndpoint='/def/ports' routerUrl='/apps/def/port'
       extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default PortsList
