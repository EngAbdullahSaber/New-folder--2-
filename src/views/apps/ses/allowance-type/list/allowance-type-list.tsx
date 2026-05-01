'use client'
import { allowanceScopeList, ListComponent, statusList, yesNoList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name', header: 'name', align: 'text-right' },
  {
    accessorKey: 'allowance_scope',
    header: 'allowance_scope',
    align: 'text-start',
    type: 'badge',
    list: allowanceScopeList
  },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const AllowanceTypeList = () => (
  <ListComponent
    title='allwances'
    columns={columns}
    apiEndpoint='/ses/allowance-types'
    routerUrl='/apps/ses/allowance-type'
  />
)

export default AllowanceTypeList
