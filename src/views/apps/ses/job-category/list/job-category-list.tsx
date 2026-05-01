'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'job.name', header: 'job', align: 'text-start' },
  { accessorKey: 'job_classification_types.name', header: 'job_classification_type', align: 'text-start' },
  { accessorKey: 'daily_rate', header: 'daily_rate', width: '10%', align: 'text-center', type: 'amount' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const JobCategoryList = () => (
  <ListComponent
    title='job_categories'
    columns={columns}
    apiEndpoint='/ses/job-categories'
    routerUrl='/apps/ses/job-category'
  />
)

export default JobCategoryList
