'use client'
import { ListComponent, projectContractRequestStatus, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'project_name', header: 'project_name', align: 'text-right' },
  { accessorKey: 'project_budget', header: 'project_budget', align: 'text-start', width: '20%', type: 'amount' },
  {
    accessorKey: 'start_date',
    header: 'start_end_date',
    type: 'date',
    combine: ['start_date', 'end_date'],
    width: '15%'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: statusList
  }
]

const ProjectList = () => (
  <ListComponent title='projects' columns={columns} apiEndpoint='/acs/projects' routerUrl='/apps/acs/project' />
)

export default ProjectList
