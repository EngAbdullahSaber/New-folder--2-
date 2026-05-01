// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right', width: '30%' },
  { accessorKey: 'name_la', header: 'name_la', align: 'text-left', width: '30%' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }


]

const LandTranCompanyList = () => (
  <ListComponent title='land_tran_companies' columns={columns} apiEndpoint='/def/land-tran-companies' routerUrl='/apps/def/land-tran-company' />
)

export default LandTranCompanyList
