'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns: Shared.DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'provider.name_ar',
    header: 'transportation_contract_provider',
    width: '30%',
    align: 'text-start',
    showPrimaryKey: 'business_id',
    filterType: 'select',
    filterAccessorKey: 'provider_entity_id',
    filterApiUrl: '/haj/provider-requests',
    filterQueryParams: { type: [7] },
    filterLabelProp: 'name_ar',
    filterKeyProp: 'id',
    enableFilter: true
  },
  {
    accessorKey: 'requester.name_ar',
    header: 'transportation_contract_requester',
    width: '25%',
    align: 'text-start',
    showPrimaryKey: 'business_id',
    enableFilter: true,
    filterType: 'select',
    filterApiUrl: '/haj/provider-requests',
    filterQueryParams: { type: [1, 2, 3] },
    filterLabelProp: 'name_ar',
    filterAccessorKey: 'requester_entity_id'
  },
  {
    accessorKey: 'contract_start_date',
    combine: ['contract_start_date', 'contract_end_date'],
    header: 'start_end_date',
    width: '15%',
    align: 'text-center',
    type: 'date',
    enableFilter: true,
    filterType: 'dateRange'
  },
  {
    accessorKey: 'number_of_pilgrims',
    header: 'number_of_pilgrims',
    width: '7%',
    align: 'text-center',
    type: 'amount',
    showCurrency: false,
    enableFilter: true,
    filterType: 'number'
  }

  // { accessorKey: 'spc.company_name_ar', header: 'spc_id', width: '13%', align: 'text-start' },
  // {
  //   accessorKey: 'amount',
  //   header: 'contract_amount',
  //   width: '10%',
  //   align: 'text-center',
  //   type: 'amount',
  //   showCurrency: false
  // },
  // { accessorKey: 'state', header: 'status', width: '7%', align: 'text-start', list: statusList, type: 'badge' }
]

const statsConfig: Shared.StatCardConfig[] = [
  // {
  //   field: 'status',
  //   sectionTitle: 'status',
  //   gridSize: 12,
  //   chartOptions: {
  //     gridSize: 3,
  //     icon: 'ri-information-line',
  //     totalIcon: 'ri-database-2-line',
  //     unknownIcon: 'ri-question-line',
  //     color: 'info',
  //     unknownLabel: 'غير محدد',
  //     totalLabel: 'الإجمالي'
  //   },
  //   options: mahderStatusList
  // }
  {
    field: 'requester_entity_id',
    keyTitle: 'requester_entity_id',
    sectionTitle: 'transportation_contract_requester',
    type: 'card',
    gridSize: 12,
    relations: {
      name: 'requester',
      column: 'name_ar'
    },
    chartOptions: {
      icon: 'ri-group-line',
      totalIcon: 'ri-database-2-line',
      color: 'info',
      unknownIcon: 'ri-question-line',
      gridSize: 3
    }
  }
]

const TransportationContractList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='transportation_contract'
      columns={columns}
      apiEndpoint='/haj/transportation-contracts'
      routerUrl='/apps/haj/transportation-contract'
      listView={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
      showStats={true}
      statsConfig={statsConfig}
      enableFilters={true}
    />
  )
}

export default TransportationContractList
