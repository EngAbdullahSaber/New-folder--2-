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
    accessorKey: 'business_id',
    header: 'business_id',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'order_no',
    header: 'order_no',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'mahader_count',
    header: 'mahader_count',
    width: '10%',
    align: 'text-center'
    // enableFilter: true,
    // filterType: 'number'
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

const MahderCategoryList = () => (
  <ListComponent
    title='mahader_categories'
    columns={columns}
    apiEndpoint='/haj/mahader-categories'
    routerUrl='/haj/mahder-category'
    enableFilters={true}
  />
)

export default MahderCategoryList
