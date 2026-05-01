'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', align: 'text-start', enableFilter: true, filterType: 'text' },
  {
    accessorKey: 'order_no',
    header: 'order_no',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: statusList,
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const JobTitleList = () => (
  <ListComponent
    title='job_title'
    columns={columns}
    apiEndpoint='/eme/job-titles'
    routerUrl='/apps/eme/job-title'
    listView={true}
    enableFilters={true}
  />
)

export default JobTitleList
