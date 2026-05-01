// DepartmentTypeList.tsx
'use client'
import { jobTypes, ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name', header: 'name', width: '50%', align: 'text-right' },
  { accessorKey: 'type', header: 'type', width: '10%', type: 'badge', list: jobTypes },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const JobList = () => <ListComponent title='jobs' columns={columns} apiEndpoint='/def/jobs' routerUrl='/apps/def/job' />

export default JobList
