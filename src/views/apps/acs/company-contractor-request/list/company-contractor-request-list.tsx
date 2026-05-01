'use client'
import { companyContractorRequestStatus, ListComponent, statusList } from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'contractor_company.contractor_company_name_ar',
    header: 'contractor_company',
    align: 'text-right',
    width: '50%'
  },
  {
    accessorKey: 'contractor_type.contractor_type_name_ar',
    header: 'contractor_type',
    align: 'text-start'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: companyContractorRequestStatus
  }
]

const CompanyContractorRequestList = ({ scope }: ComponentGeneralProps) => (
  <ListComponent
    title='company_contractor_requests'
    columns={columns}
    apiEndpoint={`/acs/${scope === 'user' ? 'my-company-contractor-requests' : 'company-contractor-requests'}`}
    routerUrl={`/apps/acs/company-contractor-request/${scope}`}
  />
)

export default CompanyContractorRequestList
