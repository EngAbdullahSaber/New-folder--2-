'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'business_id', header: 'business_id', width: '7%%', align: 'text-center' },
  { accessorKey: 'company_name_ar', header: 'company_name_ar', width: '30%', align: 'text-right' },
  // { accessorKey: 'city.name_ar', header: 'city', width: '12%%', align: 'text-center' },
  { accessorKey: 'country.name_ar', header: 'country', width: '30%%', align: 'text-start' },
  { accessorKey: 'seasonal_assigned_quota', header: 'seasonal_assigned_quota', width: '12%', align: 'text-center' },
  { accessorKey: 'hc_state', header: 'status', type: 'badge', width: '7%%', list: statusList, align: 'text-center' }
]

const IhcHajCompanyList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='spc_company'
      columns={columns}
      apiEndpoint='/haj/ihc-hajj-companies'
      routerUrl='/apps/haj/ihc-haj-company'
      listView={true}
      //  extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default IhcHajCompanyList
