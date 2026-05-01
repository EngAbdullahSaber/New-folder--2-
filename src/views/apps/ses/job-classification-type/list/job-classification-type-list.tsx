// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name', header: 'name', align: 'text-right' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const JobClassificationTypeList = () => (
  <ListComponent
    title='job_classification_types'
    columns={columns}
    apiEndpoint='/ses/job-classification-types'
    routerUrl='/apps/ses/job-classification-type'
  />
)

export default JobClassificationTypeList
