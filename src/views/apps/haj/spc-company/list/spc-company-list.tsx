'use client'
import { ListComponent, otherYesNoList, statusList, yesNoList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'business_id', header: 'business_id', width: '7%', align: 'text-center' },
  {
    accessorKey: 'commercial_registration_number',
    header: 'commercial_registration_number',
    width: '10%',
    align: 'text-center'
  },
  { accessorKey: 'company_name_ar', header: 'company_name_ar', width: '30%', align: 'text-right' },
  {
    accessorKey: 'seasonal_assigned_quota',
    header: 'seasonal_assigned_quota',
    width: '10%',
    align: 'text-center',
    type: 'amount',
    showCurrency: false
  },
  {
    accessorKey: 'is_servicing_local_applicant',
    header: 'is_servicing_local_applicant_short',
    width: '7%',
    align: 'text-start',
    type: 'badge',
    list: otherYesNoList
  },
  {
    accessorKey: 'is_servicing_external_applicant',
    header: 'is_servicing_external_applicant_short',
    width: '7%',
    align: 'text-start',
    type: 'badge',
    list: otherYesNoList
  },
  { accessorKey: 'hc_state', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const SpcCompanyList = () => (
  <ListComponent
    title='spc_company'
    columns={columns}
    apiEndpoint='/haj/spc-companies'
    routerUrl='/apps/haj/spc-company'
    listView={true}
  />
)

export default SpcCompanyList
