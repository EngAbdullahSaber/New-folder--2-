'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'department_name_ar',
    header: 'name_ar',
    align: 'text-right'
  },
  { accessorKey: 'short_name_ar', header: 'short_name_ar', width: '17%', align: 'text-right' },
  {
    accessorKey: 'parent_department.department_name_ar',
    header: 'main_department',
    width: '25%',
    align: 'text-right'
  },
  { accessorKey: 'order_no', header: 'order_no', width: '10%', align: 'text-center' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const SeasonalDepartmentList = () => (
  <ListComponent
    title='seasonal_departments'
    selectable={true}
    columns={columns}
    apiEndpoint='/def/seasonal-departments'
    routerUrl='/apps/def/seasonal-department'
    listView={true}
  />
)

export default SeasonalDepartmentList
