// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '20%', align: 'text-right' },
  { accessorKey: 'name_en', header: 'name_en', width: '20%', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '12%', type: 'badge', list: statusList, align: 'text-center' }
]

const PathsList = () => (
  <ListComponent title='paths' columns={columns} apiEndpoint='/def/paths' routerUrl='/apps/def/path' />
)

export default PathsList
