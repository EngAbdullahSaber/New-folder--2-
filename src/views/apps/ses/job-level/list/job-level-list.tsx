// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name', header: 'name', width: '60%', align: 'text-right' },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const JobLevelList = () => (
  <ListComponent title='job_levels' columns={columns} apiEndpoint='/ses/job-levels' routerUrl='/apps/ses/job-level' />
)

export default JobLevelList
