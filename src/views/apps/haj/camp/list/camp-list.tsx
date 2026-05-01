'use client'

import * as Shared from '@/shared'
import { useMemo } from 'react'

const CampList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  
  const columns: Shared.DynamicColumnDef[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '5%', enableFilter: true, filterType: 'number' },
      {
        accessorKey: 'mena_camp_square_name_ar',
        header: 'mena_camp_square_name_ar',
        align: 'text-right',
        enableFilter: true
      },
      {
        accessorKey: 'mena_camp_capacity',
        header: 'mena_camp_capacity',
        width: '10%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'mena_camp_zone_id',
        header: 'mena_camp_zone_id',
        width: '10%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'mena_camp_gate_no',
        header: 'mena_camp_gate_no',
        width: '10%',
        align: 'text-center',
        enableFilter: true
      },
      {
        accessorKey: 'mena_camp_street_no',
        header: 'mena_camp_street_no',
        width: '10%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'arafat_camp_id',
        header: 'arafat_camp_id',
        width: '10%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      }
    ],
    []
  )

  return (
    <Shared.ListComponent
      title='camp'
      columns={columns}
      apiEndpoint='/haj/camps'
      routerUrl='/apps/haj/camp'
      listView={true}
      enableFilters={true}
      mapLocation={['mena_my_coordinates??mena_coordinates', 'arafat_my_coordinates??arafat_coordinates']}
    />
  )
}

export default CampList
