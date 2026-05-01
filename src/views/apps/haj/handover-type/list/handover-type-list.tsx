'use client'
import {
  allowanceScopeList,
  contentTypeList,
  handoverFlowTypeList,
  handoverMethodList,
  ListComponent,
  statusList,
  transactionTypeList,
  yesNoList
} from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'handover_type_description', header: 'name', align: 'text-start' },
  {
    accessorKey: 'content_type',
    header: 'content_type',
    width: '10%',
    align: 'text-start',
    // type: 'badge',
    list: contentTypeList
  },
  {
    accessorKey: 'transaction_type_id',
    header: 'transaction_type_id',
    width: '10%',
    align: 'text-start',
    // type: 'badge',
    list: transactionTypeList
  },
  {
    accessorKey: 'handover_flow_type',
    header: 'handover_flow_type',
    width: '10%',
    align: 'text-start',
    // type: 'badge',
    list: handoverFlowTypeList
  },
  // {
  //   accessorKey: 'handover_method',
  //   header: 'handover_method',
  //   width: '10%',
  //   align: 'text-start',
  //   type: 'badge',
  //   list: handoverMethodList
  // },
  // {
  //   accessorKey: 'is_monitored',
  //   header: 'is_monitored',
  //   width: '10%',
  //   align: 'text-start',
  //   type: 'badge',
  //   list: yesNoList
  // },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const HandoverTypeList = () => (
  <ListComponent
    title='handover_types'
    columns={columns}
    apiEndpoint='/haj/handover-types'
    routerUrl='/haj/handover-type'
  />
)

export default HandoverTypeList
