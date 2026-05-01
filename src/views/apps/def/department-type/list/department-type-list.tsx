// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'department_type_name', header: 'department_type_name', width: '60%', align: 'text-start' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const DepartmentTypeList = () => (
  <ListComponent
    title='department_types'
    columns={columns}
    apiEndpoint='/def/department-types'
    routerUrl='/apps/def/department-type'
  />
)

export default DepartmentTypeList
