// DepartmentTypeList.tsx
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
    accessorKey: 'parent.department_name_ar',
    header: 'main_department',
    width: '23%',
    align: 'text-right'
  },
  // { accessorKey: 'order_no', header: 'order_no', width: '5%', align: 'text-center' },
  { accessorKey: 'status', header: 'status', width: '5%', align: 'text-start', type: 'badge', list: statusList }
]

const DepartmentList = () => (
  <ListComponent
    title='departments'
    selectable={true}
    columns={columns}
    apiEndpoint='/def/departments'
    routerUrl='/apps/def/department'
    listView={true}
    mapLocation={['y_axis', 'x_axis']}
  />
)

export default DepartmentList
