'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right' },
  { accessorKey: 'name_en', header: 'name_la', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const RouteList = () => (
  <ListComponent title='routes' columns={columns} apiEndpoint='/def/routes' routerUrl='/apps/def/route' />
)

export default RouteList
