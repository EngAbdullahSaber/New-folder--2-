'use client'
import { companyContractorRequestStatus, companyContractorStatus, ListComponent } from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'commercial_no', header: 'commercial_no', width: '12%', align: 'text-start' },
  { accessorKey: 'contractor_company_name_ar', header: 'contractor_company_name_ar', align: 'text-right' },

  // { accessorKey: 'contractor_company_name_la', header: 'contractor_company_name_la', align: 'text-left' },
  { accessorKey: 'coordinator_name', header: 'coordinator_name', align: 'text-right', width: '17%' },
  { accessorKey: 'mobile', header: 'his_mobile', align: 'text-start', width: '10%' },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-start',
    type: 'badge',
    list: companyContractorStatus
  }
]

const ContractorCompanyList = ({ scope }: ComponentGeneralProps) => {
  return (
    <ListComponent
      title='contractor_companies'
      columns={columns}
      apiEndpoint={`/acs/${scope === 'user' ? 'my-contractor-companies' : 'contractor-companies'}`}
      routerUrl={`/apps/acs/contractor-company/${scope}`}
    />
  )
}

export default ContractorCompanyList
