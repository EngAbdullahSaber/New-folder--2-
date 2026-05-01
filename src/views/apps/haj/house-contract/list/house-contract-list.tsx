// DepartmentTypeList.tsx
'use client'
import { ListComponent, useSessionHandler } from '@/shared'
import { format } from 'date-fns'
import * as Shared from '@/shared'

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
    sectionTitle: 'house_contract_requester',
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

const HouseContractList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      { accessorKey: 'id', header: 'contract_no', width: '7%', enableFilter: true, filterType: 'number' },

      {
        accessorKey: 'provider.name_ar',
        header: 'house_contract_provider',
        align: 'text-start',
        width: '22%',
        showPrimaryKey: 'business_id',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/haj/provider-requests',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'provider_entity_id',
        filterQueryParams: { type: [4, 5] }
      },

      {
        accessorKey: 'requester.name_ar',
        header: 'house_contract_requester',
        align: 'text-start',
        width: '22%',
        showPrimaryKey: 'business_id',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/haj/provider-requests',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterDisplayProps:['name_ar','type_name'],
        filterSearchProps:['name_ar','type_name'],
        filterAccessorKey: 'requester_entity_id',
        filterQueryParams: { type: [1, 2, 3] }
      },

      {
        accessorKey: 'contract_start_date',
        header: 'start_end_date',
        type: 'date',
        combine: ['contract_start_date', 'contract_end_date'],
        width: '15%',
   
      },
      {
        accessorKey: 'number_of_pilgrims',
        header: 'number_of_pilgrims',
        type: 'amount',
        width: '7%',
        align: 'text-center',
        showCurrency: false,
        enableFilter: true,
        filterType: 'number'
      }
    ],
    []
  )

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='house_contracts'
      columns={columns}
      apiEndpoint='/haj/house-contracts'
      routerUrl='/apps/haj/house-contract'
      enableFilters={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
      showStats={true}
      statsConfig={statsConfig}
    />
  )
}

export default HouseContractList
