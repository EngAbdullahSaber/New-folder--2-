// DepartmentTypeList.tsx
'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right', width: '20%' },
  { accessorKey: 'name_la', header: 'name_la', align: 'text-left', width: '20%' }


]

const EstList = () => (
  <ListComponent title='ests' columns={columns} apiEndpoint='/haj/ests' routerUrl='/apps/haj/est' />
)

export default EstList
