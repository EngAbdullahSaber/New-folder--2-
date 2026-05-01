'use client'
import {
  allowanceScopeList,
  contentTypeList,
  DynamicColumnDef,
  handoverFlowTypeList,
  handoverMethodList,
  ListComponent,
  statusList,
  transactionTypeList,
  yesNoList
} from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'name',
    header: 'name',
    align: 'text-start',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'list_table_name',
    header: 'list_table_name',
    align: 'text-start',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    type: 'badge',
    list: statusList,
    align: 'text-center',
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const MahderServiceTypeList = () => (
  <ListComponent
    title='mahader_service_types'
    columns={columns}
    apiEndpoint='/haj/mahader-service-types'
    routerUrl='/haj/mahder-service-type'
    enableFilters={true}
  />
)

export default MahderServiceTypeList
