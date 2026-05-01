'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', width: '60%', align: 'text-start' },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const StageList = () => (
  <ListComponent
    title='stage'
    columns={columns}
    apiEndpoint='/cur/stages'
    routerUrl='/apps/cur/stage'
    listView={true}
  />
)

export default StageList
