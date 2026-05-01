'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'contract_type_name_ar', header: 'contract_type_name_ar', align: 'text-right' },
  { accessorKey: 'contract_type_name_la', header: 'contract_type_name_la', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const ContractTypeList = () => (
  <ListComponent
    title='contract_types'
    columns={columns}
    apiEndpoint='/acs/contract-types'
    routerUrl='/apps/acs/contract-type'
  />
)

export default ContractTypeList
