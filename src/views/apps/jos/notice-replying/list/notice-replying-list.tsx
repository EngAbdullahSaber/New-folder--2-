'use client'
import * as Shared from '@/shared'
import { useRouter } from 'next/navigation'
import { DynamicColumnDef, ListComponent, noticeTypeList, statusList } from '@/shared'
import { ComponentNoticeGeneralProps } from '@/types/pageModeType'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%', align: 'text-center' },
  { accessorKey: 'notice_title', header: 'notice_title', align: 'text-right', enableFilter: true, filterType: 'text' },

  {
    accessorKey: 'notice_date',
    header: 'notice_date',
    align: 'text-right',
    type: 'date',
    enableFilter: true,
    filterType: 'date',
    width: '10%',
    showTime: true,
    showHijri: false
  },


  {
    accessorKey: 'noticeParentCategory.name', header: 'notice_parent_category', align: 'text-start', enableFilter: true, filterType: 'select',
    filterAccessorKey: "parent_category_id",
    filterApiUrl: '/jos/notice-categories',
    filterLabelProp: 'name',
    width: "7%"
  },


  {
    accessorKey: 'notice_type',
    header: 'notice_type',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: noticeTypeList,
    enableFilter: true,
    filterType: 'select',
    filterOptions: noticeTypeList
  },
  {
    accessorKey: 'noticeStatusType.name_ar',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    badgeColor: "info",
    enableFilter: true,
    filterType: 'select',
    filterApiUrl: '/jos/notice-status-types',
    filterLabelProp: 'name_ar',
    filterAccessorKey: "notice_status_type_id",
  },
  {
    accessorKey: 'noticeImportance.name_ar', header: 'notice_importance_id', align: 'text-start', enableFilter: true, filterType: 'text',
    filterAccessorKey: "notice_importance_id",
    width: "7%"
  },

  {
    accessorKey: 'noticeDepartment.department_name_ar', header: 'notice_department', align: 'text-start', enableFilter: true, filterType: 'select',
    filterAccessorKey: "issued_department_id",
    filterApiUrl: '/def/departments',
    filterLabelProp: 'department_name_ar',
    width: "10%"
  },
  {
    accessorKey: 'noticeCategory.name', header: 'notice_sub_category', align: 'text-start', enableFilter: true, filterType: 'select',
    filterAccessorKey: "category_id",
    filterApiUrl: '/jos/notice-categories',
    filterLabelProp: 'name',
    width: "7%"
  },

  {
    accessorKey: 'noticeWay.name_ar', header: 'notice_order_way',
    width: "10%", align: 'text-right', enableFilter: true, filterType: 'select',
    filterAccessorKey: "notice_way_id",
    filterApiUrl: '/jos/notice-ways',
    filterLabelProp: 'name_ar',
  },

]



const NoticeReplyingList = ({ scope }: ComponentNoticeGeneralProps) => {
  const router = useRouter()
  const { lang: locale } = Shared.useParams()

  const rowOptions = [
    {
      text: 'chat',
      action: 'chat',
      icon: 'ri-chat-3-line',
      color: 'primary',
      isExternal: true
    }
  ]

  const handleRowOptionClick = (action: string, id: any, row: any) => {
    if (action === 'chat') {
      const url = Shared.getLocalizedUrl(
        `/apps/jos/notice-replying/${scope}/details?id=${id}&mode=edit`,
        locale as Shared.Locale
      )
      router.push(url)
      return true
    }
  }

  return (
    <ListComponent
      title='notice_replying'
      columns={columns}
      apiEndpoint='/jos/notice-orders'
      routerUrl={`/apps/jos/notice-replying/${scope}`}
      enableFilters={true}
      collapsible={true}
      rowOptions={rowOptions}
      showOnlyOptions={['chat', 'print', 'delete', 'export']}
      onRowOptionClick={handleRowOptionClick}
    />
  )
}

export default NoticeReplyingList
