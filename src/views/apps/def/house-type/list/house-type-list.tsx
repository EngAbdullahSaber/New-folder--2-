// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '30%', align: 'text-right'},
  { accessorKey: 'name_la', header: 'name_la', width: '30%', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const HouseTypesList = () => (
  <ListComponent title='house_types' columns={columns} apiEndpoint='/def/house-types' routerUrl='/apps/def/house-type' />
)

export default HouseTypesList
