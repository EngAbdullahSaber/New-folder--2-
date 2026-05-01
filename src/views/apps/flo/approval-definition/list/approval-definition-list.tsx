'use client'
import { ListComponent } from '@/shared'
const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'code', header: 'code', width: '15%' },
  { accessorKey: 'name', header: 'name' }
]

const ApprovalDefinitionList = () => (
  <ListComponent
    title='approval_mechanisms'
    columns={columns}
    apiEndpoint='/flo/approval-definitions'
    routerUrl='/apps/flo/approval-definition'
  />
)

export default ApprovalDefinitionList
