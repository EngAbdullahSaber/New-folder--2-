'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import { format } from 'date-fns'
import * as Shared from '@/shared'
import { is } from 'valibot'


const HouseList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      {
        accessorKey: 'business_id',
        header: 'house_id',
        width: '7%',
        align: 'text-center',
        isIdentifier: true,
        fetchKey: 'id',
        routerUrl: '/haj/house',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'house_city.name_ar',
        header: 'city',
        align: 'text-center',
        width: '8%',
        enableFilter: true,
        filterType: 'select',
        filterOptions: Shared.toOptions(user?.user_cities, locale as string),
        filterLabelProp: 'label',
        filterKeyProp: 'value',
        filterAccessorKey: 'house_city_id'
      },
      {
        accessorKey: 'houses_type.name_ar',
        header: 'house_type',
        align: 'text-center',
        width: '8%',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/house-types',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'house_type'
      },
      {
        accessorKey: 'house_commercial_name_ar',
        header: 'name',
        align: 'text-start',
        enableFilter: true,
        filterType: 'text'
      },
      { accessorKey: 'house_owner_name', header: 'house_owner', align: 'text-start', width: '20%', enableFilter: true },
      { accessorKey: 'house_total_rooms', header: 'rooms', width: '5%', enableFilter: true, filterType: 'number' },
      {
        accessorKey: 'house_guest_capacity',
        header: 'house_guests',
        width: '5%',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'house_state',
        header: 'status',
        width: '5%',
        align: 'text-center',
        type: 'badge',
        list: statusList,
 
      }
    ],
    [user?.user_cities, locale]
  )

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
    field: 'house_city_id',
    keyTitle: 'house_city_id',
    sectionTitle: 'city',
    type: 'card',
    gridSize: 12,
    relations: {
      name: 'house_city',
      column: 'name_ar'
    },
    chartOptions: {
      icon: 'ri-map-pin-line',
      totalIcon: 'ri-database-2-line',
      color: 'info',
      unknownIcon: 'ri-question-line',
      gridSize: 3
    }
  }
]
  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='houses'
      columns={columns}
      apiEndpoint='/haj/houses'
      routerUrl='/apps/haj/house'
      mapLocation={[
        'house_my_map_address_longitude??house_map_address_longitude',
        'house_my_map_address_latitude??house_map_address_latitude'
      ]}
      extraQueryParams={filter_with_city ? { house_city_id: cityId } : {}}
      showStats={true}    
        enableFilters={true}

      statsConfig={statsConfig}
    />
  )
}

export default HouseList
