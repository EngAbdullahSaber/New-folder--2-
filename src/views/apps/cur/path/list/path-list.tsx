'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', align: 'text-start' },

  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const PathList = () => (
  <ListComponent title='path' columns={columns} apiEndpoint='/cur/paths' routerUrl='/apps/cur/path' listView={true} />
)

export default PathList
