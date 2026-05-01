'use client'
import { ListComponent, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-start' },
  { accessorKey: 'hajj_company_quota', header: 'dh_company_quota', width: '7%', type: 'amount', showCurrency: false },
  { accessorKey: 'land_quota', header: 'land_quota', width: '7%', type: 'amount', showCurrency: false },
  { accessorKey: 'sea_quota', header: 'sea_quota', width: '7%', type: 'amount', showCurrency: false },
  { accessorKey: 'air_quota', header: 'air_quota', width: '7%', type: 'amount', showCurrency: false },
  { accessorKey: 'haj_mission_quota', header: 'total_quota', width: '10%', type: 'amount', showCurrency: false }
]

const MissionList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='missions'
      columns={columns}
      apiEndpoint='/haj/missions'
      routerUrl='/apps/haj/mission'
      //  extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default MissionList
