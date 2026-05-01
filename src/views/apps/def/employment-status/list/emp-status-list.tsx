'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'emp_status_name', header: 'name', align: 'text-start' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const EmploymentStatusList = () => (
  <ListComponent
    title='emp_status'
    columns={columns}
    apiEndpoint='/def/employment-statuses'
    routerUrl='/apps/def/employment-status'
  />
)

export default EmploymentStatusList
