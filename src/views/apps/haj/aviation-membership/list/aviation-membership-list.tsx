// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'desc_ar', header: 'desc_ar', align: 'text-right'},
  { accessorKey: 'desc_la', header: 'desc_la', align: 'text-left'},
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }


]

const AviationMembershipList = () => (
  <ListComponent title='aviation_memberships' columns={columns} apiEndpoint='/haj/aviation-memberships' routerUrl='/apps/haj/aviation-membership' />
)

export default AviationMembershipList
