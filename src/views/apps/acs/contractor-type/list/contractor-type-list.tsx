'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'contractor_type_name_ar', header: 'contractor_type_name_ar', align: 'text-right' },
  { accessorKey: 'contractor_type_name_la', header: 'contractor_type_name_la', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const ContractorTypeList = () => (
  <ListComponent
    title='contractor_types'
    columns={columns}
    apiEndpoint='/acs/contractor-types'
    routerUrl='/apps/acs/contractor-type'
  />
)

export default ContractorTypeList
