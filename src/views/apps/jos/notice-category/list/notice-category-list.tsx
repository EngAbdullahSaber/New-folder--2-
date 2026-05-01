'use client'
import { ListComponent, statusList } from '@/shared'
import * as Shared from '@/shared'

const columns: Shared.DynamicColumnDef[] = [
  {
    accessorKey: 'id',
    header: 'id',
    width: '5%',
    enableFilter: true,
    filterType: 'number',
    align: 'text-center'
  },
  {
    accessorKey: 'name',
    header: 'name',
    align: 'text-start',
    enableFilter: true,
    filterType: 'text'
  },


  {
    accessorKey: 'parentCategory.name',
    header: 'parent_id',
    align: 'text-start',
    enableFilter: true,
    filterType: 'select',
    filterAccessorKey: "parent_id",
    filterApiUrl: '/jos/notice-categories',
    filterLabelProp: 'name',
    width: "15%"
  },


  {
    accessorKey: 'noticeOperationCenter.department.department_name_ar',
    header: 'center_business_id',
    align: 'text-start',
    enableFilter: true,
    filterType: 'select',
    filterAccessorKey: "center_business_id",
    filterApiUrl: '/jos/notice-operation-centers',
    filterLabelProp: 'department_name_ar',
    width: "15%"
  },



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
  },
]

const NoticeCategoryList = () => (
  <ListComponent
    title='notice_categories'
    columns={columns}
    enableFilters={true}
    listView={true}
    apiEndpoint='/jos/notice-categories'
    routerUrl='/apps/jos/notice-category'
  />
)

export default NoticeCategoryList
