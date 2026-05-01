'use client'
import type { DynamicColumnDef } from '@/shared';
import { ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%', align: 'text-center' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '20%', align: 'text-right', enableFilter: true, filterType: 'text' },
  { accessorKey: 'name_la', header: 'name_la', width: '20%', align: 'text-left', enableFilter: true, filterType: 'text' },
  { accessorKey: 'min_time', header: 'min_time', width: '7%', align: 'text-center', enableFilter: true, filterType: 'number' },
  { accessorKey: 'max_time', header: 'max_time', width: '7%', align: 'text-center', enableFilter: true, filterType: 'number' },
  { accessorKey: 'order_no', header: 'order_no', width: '7%', align: 'text-center', enableFilter: true, filterType: 'number' },
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

const NoticeImportanceList = () => (
  <ListComponent
    title='notice_importances'
    columns={columns}
    apiEndpoint='/jos/notice-importances'
    routerUrl='/apps/jos/notice-importance'
    enableFilters={true}
    showOnlyOptions={['add', 'edit', 'delete', 'export', 'print', 'search']}
  />
)

export default NoticeImportanceList
