'use client'
import { ListComponent, projectContractRequestStatus, statusList } from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'contract_type.contract_type_name_ar',
    header: 'contract_type',
    width: '10%'
  },

  {
    accessorKey: 'contractor_company.contractor_company_name_ar',
    header: 'contractor_company'
  },
  {
    accessorKey: 'contract_budget',
    header: 'contract_budget',
    width: '20%',
    type: 'amount'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: projectContractRequestStatus
  }
]

const ProjectContractList = ({ scope }: ComponentGeneralProps) => (
  <ListComponent
    title='project_contracts'
    columns={columns}
    apiEndpoint={`/acs/${scope === 'user' ? 'my-project-contracts' : 'project-contracts'}`}
    routerUrl={`/apps/acs/project-contract/${scope}`}
    showOnlyOptions={scope == 'user' ? ['edit', 'search', 'print'] : []}
  />
)

export default ProjectContractList
