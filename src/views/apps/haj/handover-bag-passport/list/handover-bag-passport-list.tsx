'use client'
import {
  allowanceScopeList,
  contentTypeList,
  handoverFlowTypeList,
  handoverMethodList,
  ListComponent,
  statusList,
  transactionTypeList,
  useSessionHandler,
  yesNoList
} from '@/shared'
import { ComponentGeneralHandoverProps } from '@/types/pageModeType'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  // { accessorKey: 'name', header: 'name', align: 'text-right' },
  {
    accessorKey: 'content_type',
    header: 'content_type',
    width: '10%',
    align: 'text-start',
    type: 'badge',
    list: contentTypeList
  },
  {
    accessorKey: 'transaction_type_id',
    header: 'transaction_type_id',
    width: '10%',
    align: 'text-start',
    type: 'badge',
    list: transactionTypeList
  },
  {
    accessorKey: 'handover_flow_type',
    header: 'handover_flow_type',
    width: '10%',
    align: 'text-start',
    type: 'badge',
    list: handoverFlowTypeList
  },
  {
    accessorKey: 'handover_method',
    header: 'handover_method',
    width: '10%',
    align: 'text-start',
    type: 'badge',
    list: handoverMethodList
  },
  {
    accessorKey: 'is_monitored',
    header: 'is_monitored',
    width: '10%',
    align: 'text-start',
    type: 'badge',
    list: yesNoList
  },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const HandoverBagPassportList = ({ scope }: ComponentGeneralHandoverProps) => {
  const { userPassportUnits } = useSessionHandler()

  return (
    <ListComponent
      title='handover_bag_passports'
      columns={columns}
      apiEndpoint='/haj/handover-bag-passports'
      routerUrl={`/haj/handover-bag-passport/${scope}`}
      showOnlyOptions={scope == 'receiver' ? ['edit', 'search', 'print'] : []}
      extraQueryParams={
        scope == 'sender'
          ? {
              ...(typeof userPassportUnits && userPassportUnits.length > 0
                ? { sender_unit_id: userPassportUnits.map((item: any) => item.id) }
                : {})
            }
          : scope == 'receiver'
            ? {
                ...(typeof userPassportUnits && userPassportUnits.length > 0
                  ? { receiver_unit_id: userPassportUnits.map((item: any) => item.id) }
                  : {})
              }
            : {}
      }
    />
  )
}

export default HandoverBagPassportList
