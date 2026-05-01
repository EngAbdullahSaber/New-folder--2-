'use client'
import { ListComponent, statusList } from '@/shared'
import type * as Shared from '@/shared'

const columns: Shared.DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'way_id', align: 'text-center', width: '10%', enableFilter: true, filterType: 'number' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right', enableFilter: true, filterType: 'text' },
  { accessorKey: 'name_la', header: 'name_la', align: 'text-left', enableFilter: true, filterType: 'text' },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: statusList,
    enableFilter: true,
    filterType: 'select',
    options: statusList
  }
]

const NoticeWayList = () => (
  <ListComponent
    title='notice_ways'
    columns={columns}
    listView={true}
    enableFilters={true}
    apiEndpoint='/jos/notice-ways'
    routerUrl='/apps/jos/notice-way'
  />
)

export default NoticeWayList
