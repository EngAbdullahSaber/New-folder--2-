'use client'
import { useSuccessApi } from '@/contexts/successApiProvider'
import {
  ListComponent,
  mahderStatusList,
  useState,
  useSessionHandler,
  useParams,
  apiClient,
  emitEvent,
  toast,
  scrollToTop,
  StatCardConfig,
  DynamicColumnDef
} from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },

  {
    accessorKey: 'datetime',
    header: 'mahder_datetime',
    type: 'date',
    showTime: true,
    width: '10%',
    enableFilter: true,
    filterType: 'date'
  },

  {
    accessorKey: 'title',
    header: 'title',
    align: 'text-start',
    enableFilter: true,
    filterType: 'text'
  },

  {
    accessorKey: 'department.department_name_ar',
    header: 'department',
    width: '20%',
    align: 'text-start',
    enableFilter: true,
    filterType: 'select',
    filterApiUrl: '/def/seasonal-departments',
    filterLabelProp: 'department_name_ar',
    filterKeyProp: 'id',
    filterAccessorKey: 'department_id'
  },

  {
    accessorKey: 'category.name',
    header: 'category',
    width: '15%',
    align: 'text-start',
    enableFilter: true,
    filterAccessorKey: 'category_id',
    filterType: 'select',
    filterApiUrl: '/haj/mahader-categories',
    filterLabelProp: 'name',
    filterKeyProp: 'id'
  },

  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    type: 'badge',
    list: mahderStatusList,
    align: 'text-center',
    enableFilter: true,
    filterType: 'select',
    filterOptions: mahderStatusList
  }
]

const statsConfig: StatCardConfig[] = [
  {
    field: 'status',
    sectionTitle: 'status',
    gridSize: 12,
    chartOptions: {
      gridSize: 3,
      icon: 'ri-information-line',
      totalIcon: 'ri-database-2-line',
      unknownIcon: 'ri-question-line',
      color: 'info',
      unknownLabel: 'غير محدد',
      totalLabel: 'الإجمالي'
    },

    options: mahderStatusList
  }
  // {
  //   field: 'country_id',
  //   keyTitle: 'country_id',
  //   sectionTitle: 'country_id',
  //   type: 'pie',
  //   gridSize: 12,
  //   relations: {
  //     name: 'country',
  //     column: 'name_ar'
  //   },
  //   chartOptions: {
  //     icon: 'ri-information-line',
  //     totalIcon: 'ri-database-2-line',
  //     color: 'info',
  //     unknownIcon: 'ri-question-line',
  //     gridSize: 12
  //   }
  // }
]

const MahderList = ({ scope }: ComponentGeneralProps) => {
  const { user, userDepartments } = useSessionHandler()

  return (
    <ListComponent
      title='mahader'
      columns={columns}
      apiEndpoint='/haj/mahaders'
      routerUrl={`/haj/mahder/${scope}`}
      extraQueryParams={scope === 'department' ? { department_id: userDepartments.map((item: any) => item.id) } : {}}
      showStats={true}
      statsConfig={statsConfig}
      filterTabsConfig={[{ name: 'status', options: mahderStatusList }]}
      enableFilters={true}
    />
  )
}

export default MahderList
