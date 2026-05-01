// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '30%', align: 'text-right' },
  { accessorKey: 'name_la', header: 'name_la', width: '30%', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const BusTypesList = () => (
  <ListComponent title='buses_types' columns={columns} apiEndpoint='/def/bus-types' routerUrl='/apps/def/bus-type' />
)

export default BusTypesList
