'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'business_id', header: 'business_id', width: '10%', align: 'text-center' },
  { accessorKey: 'service_center_code', header: 'service_center_code', width: '12%', align: 'text-start' },
  { accessorKey: 'service_center_name_ar', header: 'service_center_name_ar', width: '25%', align: 'text-right' },
  { accessorKey: 'spc.company_name_ar', header: 'spc_id', width: '20%', align: 'text-start' },
  { accessorKey: 'city.name_ar', header: 'city', width: '15%', align: 'text-start' },
  { accessorKey: 'state', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const ServiceCenterList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />
  return (
    <ListComponent
      title='servic_centers'
      columns={columns}
      apiEndpoint='/haj/service-centers'
      routerUrl='/apps/haj/service-center'
      listView={true}
      //  extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default ServiceCenterList
