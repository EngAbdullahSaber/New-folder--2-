'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'type_desc', header: 'type_desc', },
]

const DelegationTypeList = () => (
  <ListComponent title='shr_delegation_type' columns={columns} apiEndpoint='/shr/delegation-types' routerUrl='/apps/shr/shr-delegation-type' />
)

export default DelegationTypeList
