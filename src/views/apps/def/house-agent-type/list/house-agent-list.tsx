// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'description_ar', header: 'description_ar', width: '30%', align: 'text-right'},
  { accessorKey: 'description_la', header: 'description_la', width: '30%', align: 'text-left'},
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const HouseAgentsList = () => (
  <ListComponent
    title='house_agents'
    columns={columns}
    apiEndpoint='/def/house-agent-types'
    routerUrl='/apps/def/house-agent-type'
  />
)

export default HouseAgentsList
