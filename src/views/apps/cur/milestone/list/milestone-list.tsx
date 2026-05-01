'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', width: '60%', align: 'text-start' },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const MilestoneList = () => (
  <ListComponent
    title='milestone'
    columns={columns}
    apiEndpoint='/cur/milestones'
    routerUrl='/apps/cur/milestone'
    listView={true}
  />
)

export default MilestoneList
