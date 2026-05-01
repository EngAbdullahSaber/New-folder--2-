// DepartmentTypeList.tsx
'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'name',
    header: 'name',
    width: '60%',
    align: 'text-right'
  }
]

const RoleList = () => (
  <ListComponent
    title='permission_set'
    selectable={true}
    columns={columns}
    apiEndpoint='/aut/roles'
    routerUrl='/apps/aut/role'
    listView={true}
  />
)

export default RoleList
