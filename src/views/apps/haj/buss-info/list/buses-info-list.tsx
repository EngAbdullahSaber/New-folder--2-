// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'
import * as Shared from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'naqaba_bus_id', header: 'naqaba_bus_id', width: '15%' },
  { accessorKey: 'chassis_no', header: 'chassis_no' },
  { accessorKey: 'manufacturing_year', header: 'manufacturing_year', width: '15%' },
  { accessorKey: 'capacity', header: 'capacity', width: '10%' },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const BusesInfoList = () => (
  <ListComponent title='busses_info' columns={columns} apiEndpoint='/haj/buses-infos' routerUrl='/apps/haj/buss-info' />
)

export default BusesInfoList
