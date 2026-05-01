'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'department.department_name_ar', header: 'department', width: '20%', align: 'text-start' },
  { accessorKey: 'form_type.name', header: 'form_type_id', width: '20%', align: 'text-start' },
  { accessorKey: 'service_type.name', header: 'service_type_id', width: '20%', align: 'text-start' },
  { accessorKey: 'team.name', header: 'team', width: '20%', align: 'text-start' },
  // { accessorKey: 'order_date', header: 'date', width: '15%', align: 'text-start', type: 'date' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const TeamJobOrderList = () => (
  <ListComponent
    title='team_job_order'
    columns={columns}
    apiEndpoint='/eme/team-job-orders'
    routerUrl='/apps/eme/team-job-order'
    listView={true}
  />
)

export default TeamJobOrderList
