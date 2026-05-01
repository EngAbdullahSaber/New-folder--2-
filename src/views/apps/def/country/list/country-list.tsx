// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '25%', align: 'text-right' },
  { accessorKey: 'name_la', header: 'name_la', width: '25%', align: 'text-left' },
  { accessorKey: 'moi_number', header: 'moi_no', width: '15%', align: 'text-center' },
  { accessorKey: 'mofa_number', header: 'mofa_no', width: '15%', align: 'text-center' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const CountriesList = () => (
  <ListComponent title='countries' columns={columns} apiEndpoint='/def/countries' routerUrl='/apps/def/country' />
)

export default CountriesList
