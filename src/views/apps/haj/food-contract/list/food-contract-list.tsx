// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'

const FoodContractList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      { accessorKey: 'id', header: 'contract_no', width: '5%', enableFilter: true, filterType: 'number' },

      {
        accessorKey: 'provider.name_ar',
        header: 'food_contract_provider',
        width: '30%',
        align: 'text-start',
        showPrimaryKey: 'business_id',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/haj/provider-requests',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'provider_entity_id',
        filterQueryParams: { type: [6] },
        filterDisplayProps: ['name_ar', 'type_name'],
        filterSearchProps: ['name_ar', 'type_name']
      },

      {
        accessorKey: 'requester.name_ar',
        header: 'food_contract_requester',
        width: '25%',
        align: 'text-start',
        showPrimaryKey: 'business_id',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/haj/provider-requests',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'requester_entity_id',
        filterQueryParams: { type: [1, 2, 3] },
        filterDisplayProps: ['name_ar', 'type_name'],
        filterSearchProps: ['name_ar', 'type_name']
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
        width: '7%',
        align: 'text-center',
        type: 'amount',
        showCurrency: false,
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'amount',
        header: 'contract_amount',
        width: '12%',
        align: 'text-center',
        type: 'amount',
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
      title='food_contract'
      columns={columns}
      apiEndpoint='/haj/food-contracts'
      routerUrl='/apps/haj/food-contract'
      enableFilters={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default FoodContractList
