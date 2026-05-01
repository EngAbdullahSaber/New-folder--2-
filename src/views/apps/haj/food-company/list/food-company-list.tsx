'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'


const FoodCompanyList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '8%', enableFilter: true, filterType: 'number' },
      {
        accessorKey: 'business_id',
        header: 'business_id',
        width: '8%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'fc_reg_no',
        header: 'reg_no',
        width: '10%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'fc_name_ar',
        header: 'name_ar',
        width: '35%',
        align: 'text-right',
        enableFilter: true,
        filterType: 'text'
      },
      {
        accessorKey: 'city.name_ar',
        header: 'city',
        width: '12%',
        align: 'text-right',
        enableFilter: true,
        filterType: 'select',
        filterOptions: Shared.toOptions(user?.user_cities, locale as string),
        filterLabelProp: 'label',
        filterKeyProp: 'value',
        filterAccessorKey: 'fc_city_id'
      },
      {
        accessorKey: 'state',
        header: 'status',
        width: '10%',
        type: 'badge',
        list: statusList,
        align: 'text-center',
        enableFilter: true,
        filterType: 'select',
        filterOptions: statusList,
        filterAccessorKey: 'state'
      }
    ],
    [user?.user_cities, locale]
  )

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='food_company'
      columns={columns}
      apiEndpoint='/haj/food-companies'
      routerUrl='/apps/haj/food-company'
      enableFilters={true}
      mapLocation={['my_longitude??longitude', 'my_latitude??latitude']}
      extraQueryParams={filter_with_city ? { fc_city_id: cityId } : {}}
    />
  )
}

export default FoodCompanyList
