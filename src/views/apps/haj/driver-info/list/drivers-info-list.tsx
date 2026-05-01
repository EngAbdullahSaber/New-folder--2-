// DepartmentTypeList.tsx
'use client'
import * as Shared from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'season', header: 'season', width: '10%' },
  { accessorKey: 'ltc_id', header: 'ltc_id' },
  { accessorKey: 'driver_name', header: 'driver_name', align: 'text-start' },
  { accessorKey: 'driver_id', header: 'driver_id', width: '15%' },
  { accessorKey: 'mobile_no', header: 'mobile_no', width: '15%' },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    type: 'badge',
    list: Shared.statusList,
    align: 'text-center'
  }
]

const DriversInfoList = () => (
  <Shared.ListComponent
    title='drivers_info'
    columns={columns}
    apiEndpoint='/haj/drivers-infos'
    routerUrl='/apps/haj/driver-info'
  />
)

export default DriversInfoList
