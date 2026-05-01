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
    accessorKey: 'transportation_company.ltc_name_ar',
    header: 'transportation_company_id',
    width: '10%',
    type: 'number',
    align: 'center'
  },

  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const NeqabaConfirmationList = () => (
  <ListComponent
    title='naqaba_confirmations'
    columns={columns}
    apiEndpoint='/haj/naqaba-confirmations'
    routerUrl='/haj/neqaba-confirmation'
  />
)

export default NeqabaConfirmationList
