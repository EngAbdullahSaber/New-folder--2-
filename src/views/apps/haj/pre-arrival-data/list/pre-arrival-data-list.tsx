'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
import { access } from 'fs'

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
    field: 'port_name_ar',
    keyTitle: 'port_name_ar',
    sectionTitle: 'port',
    type: 'radialBar',
    gridSize: 12,
    relations: {
      name: 'portCity',
      column: 'name_ar'
    },
    chartOptions: {
      icon: 'ri-information-line',
      totalIcon: 'ri-database-2-line',
      color: '#4caf50',
      unknownIcon: 'ri-question-line',
      gridSize: 3
    }
  }
]

const PreArrivalDataList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '5%', enableFilter: true, filterType: 'number' },

      {
        accessorKey: 'house_contract.requester.name_ar',
        header: 'house_contract_requester',
        align: 'text-start',
        enableFilter: true,
        filterType: 'text'
      },
      {
        accessorKey: 'port.port_name_ar',
        header: 'port_name_ar',
        width: '15%',
        align: 'text-right',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/ports',
        filterLabelProp: 'port_name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'port_id'
      },
      {
        accessorKey: 'fight_details.flight_date',
        header: 'flight_date',
        width: '8%',
        align: 'text-center',
        type: 'date',
        showHijri: false,
        enableFilter: true,
        filterType: 'date',
        showTime: true
      },
      {
        accessorKey: 'fight_details.flight_no',
        header: 'flight_no',
        width: '6%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number',
        showPrimary: false
      },
      {
        accessorKey: 'fight_details.air_trans_company_name_ar',
        header: 'air_trans_company',
        width: '10%',
        align: 'text-right',
        showPrimary: false,
        enableFilter: true,
        filterType: 'text',

        cell: ({ row }: any) => {
          return (
            <div className='text-xs text-start'>
              {row?.original?.fight_details?.air_trans_company_name_ar ??
                row.original?.fight_details?.air_trans_company_name_en}
            </div>
          )
        }
      },

      { accessorKey: 'house_name_ar', header: 'house_name_ar', align: 'text-right', enableFilter: true },
      {
        accessorKey: 'house_contract_id',
        header: 'house_contract_id',
        width: '5%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'pai_no_of_pilgrims',
        header: 'pai_no_of_pilgrims',
        width: '5%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      }
    ],
    []
  )

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='pre_arrival_data'
      columns={columns}
      apiEndpoint='/haj/pre-arrivals'
      routerUrl='/apps/haj/pre-arrival-data'
      listView={true}
      //  extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
      showStats={true}
      enableFilters={true}
      statsConfig={statsConfig}
      // filterTabsConfig={[{ name: 'status', options: statusList }]}
    />
  )
}

export default PreArrivalDataList
