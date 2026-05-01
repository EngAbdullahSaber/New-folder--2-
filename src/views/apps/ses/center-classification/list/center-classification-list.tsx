'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'department.department_name_ar', header: 'department', align: 'text-start' },
  { accessorKey: 'job_classification_type.name', header: 'job_classification_type', align: 'text-start' },
  {
    accessorKey: 'start_date',
    header: 'start_end_date',
    type: 'date',
    combine: ['start_date', 'end_date'],
    width: '15%'
  },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const CenterClassificationList = () => (
  <ListComponent
    title='center_classifications'
    columns={columns}
    apiEndpoint='/ses/center-classifications'
    routerUrl='/apps/ses/center-classification'
  />
)

export default CenterClassificationList
