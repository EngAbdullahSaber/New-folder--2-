// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '40%', align: 'text-right' },
  { accessorKey: 'name_la', header: 'name_la', width: '40%', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const BanksList = () => (
  <ListComponent title='banks' columns={columns} apiEndpoint='/def/banks' routerUrl='/apps/def/bank' />
)

export default BanksList
