'use client'
import { ListComponent, statusList } from '@/shared'
import type * as Shared from '@/shared'

const columns: Shared.DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', align: 'text-center', width: '10%', enableFilter: true, filterType: 'number' },
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

const NoticeStatusTypeList = () => (
  <ListComponent
    title='notice_status_types'
    columns={columns}
    enableFilters={true}
    apiEndpoint='/jos/notice-status-types'
    routerUrl='/apps/jos/notice-status-type'
  />
)

export default NoticeStatusTypeList
