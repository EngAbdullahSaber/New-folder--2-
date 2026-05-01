// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '20%', align: 'text-right' },
  { accessorKey: 'name_la', header: 'name_la', width: '20%', align: 'text-left' },
  { accessorKey: 'age_from', header: 'from', width: '10%', align: 'text-center' },
  { accessorKey: 'age_to', header: 'to', width: '10%', align: 'text-center' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const AgeStagesList = () => (
  <ListComponent title='age_stages' columns={columns} apiEndpoint='/def/age-stages' routerUrl='/apps/def/age-stage' />
)

export default AgeStagesList
