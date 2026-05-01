'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'seasonal_department.department_name_ar',
    header: 'seasonal_department',
    align: 'text-start',
    type: 'text'
  },

  {
    accessorKey: 'job.name',
    header: 'job',
    align: 'text-start',
    type: 'text'
  },

  {
    accessorKey: 'max_employees',
    header: 'max_employees',
    width: '15%',
    align: 'text-start',
    type: 'text'
  },

  // {
  //   accessorKey: 'max_female_percentage',
  //   header: 'max_female_percentage',
  //   width: '10%',
  //   align: 'text-start',
  //   type: 'text'
  // },
  // {
  //   accessorKey: 'max_non_saudi_percentage',
  //   header: 'max_non_saudi_percentage',
  //   width: '10%',
  //   align: 'text-start',
  //   type: 'text'
  // },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const ApprovedJobCenterList = () => (
  <ListComponent
    title='approved_job_centers'
    columns={columns}
    apiEndpoint='/ses/approved-job-centers'
    routerUrl='/apps/ses/approved-job-center'
  />
)

export default ApprovedJobCenterList
