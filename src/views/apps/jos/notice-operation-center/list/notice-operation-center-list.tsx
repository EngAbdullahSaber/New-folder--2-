'use client'
import { ListComponent, statusList } from '@/shared'
import type * as Shared from '@/shared'

const columns: Shared.DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '10%', enableFilter: true, filterType: 'number', align: 'text-center' },
  { accessorKey: 'business_id', header: 'business_id', width: '10%', enableFilter: true, filterType: 'number', align: 'text-center' },
  {
    accessorKey: 'department.department_name_ar',
    header: 'department_id',
    enableFilter: true, width: '30',
    filterType: 'select',
    filterLabelProp: 'department_name_ar',
    filterKeyProp: 'id',
    filterApiUrl: '/def/departments',
    align: 'text-start'
  },
  {
    accessorKey: 'adminPersonal.full_name_ar',
    header: 'admin_personal_id',
    align: 'text-start',
    enableFilter: true,
    filterType: 'select',
    width: '30%',
    filterApiUrl: '/def/personal',
    filterSearchProps: ['full_name_ar', 'id'],
    filterLabelProp: 'full_name_ar',
    filterKeyProp: 'id',
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '15%',
    align: 'text-center',
    type: 'badge',
    list: statusList,
    enableFilter: true,
    filterType: 'select',
    options: statusList
  }
]

const NoticeOperationCenterList = () => (
  <ListComponent
    title='notice_operation_centers'
    columns={columns}
    listView={true}
    enableFilters={true}
    apiEndpoint='/jos/notice-operation-centers'
    routerUrl='/apps/jos/notice-operation-center'
  />
)

export default NoticeOperationCenterList
