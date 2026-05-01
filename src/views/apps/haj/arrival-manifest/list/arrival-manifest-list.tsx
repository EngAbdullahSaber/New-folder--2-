'use client'
import { ListComponent, statusList, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
import { AggregateFunction } from '@/types/components/statistics'
import { is } from 'valibot'

 

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
  // {
  //   field: 'manifest_prt_id',
  //   keyTitle: 'manifest_prt_id',
  //   sectionTitle: 'port',
  //   type: 'card',
  //   gridSize: 12,
  //   relations: {
  //     name: 'port',
  //     column: 'port_name_ar'
  //   },
  //   chartOptions: {
  //     icon: 'ri-plane-line',
  //     totalIcon: 'ri-database-2-line',
  //     color: 'info',
  //     unknownIcon: 'ri-question-line',
  //     gridSize: 3
  //   }
  // },
  {
    field: 'manifest_prt_id',
    keyTitle: 'manifest_prt_id',
    sectionTitle: 'port',
    type: 'card',
    gridSize: 12,
    chartOptions: {
      icon: 'ri-plane-line',
      totalIcon: 'ri-database-2-line',
      color: 'info',
      unknownIcon: 'ri-question-line',
      gridSize: 3
    },

    aggregates: { key: 'manifest_passport_count', function: AggregateFunction.SUM },
    relations: { name: 'port', column: 'port_name_ar' },
    resultKey: 'sum'
  }

  // {
  //   group_by: ['manifest_prt_id'],
  //   aggregates: { key: 'manifest_passport_count', function: 'sum' },
  //   relations: { name: 'port', column: 'port_name_ar' }
  // }
]

const ArrivalManifestList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      {
        accessorKey: 'manifest_id',
        header: 'manifest_id',
        width: '8%',
        align: 'text-center',
        fetchKey: 'id',
        routerUrl: '/haj/arrival-manifest',
        isIdentifier: true,
        type: 'barcode',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'manifest_trip_date',
        header: 'flight_date',
        width: '10%',
        align: 'text-center',
        type: 'date',  
          enableFilter: true,
    filterType: 'date'
      },
      {
        accessorKey: 'port.port_name_ar',
        header: 'manifest_prt_id',
        width: '15%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/ports',
        filterLabelProp: 'port_name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'manifest_prt_id'
      },
      {
        accessorKey: 'land_tran_company.ltc_name_ar',
        header: 'manifest_ltc_id',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/transportation-companies',
        filterLabelProp: 'ltc_name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'manifest_ltc_id'
      },

      {
        accessorKey: 'house_name_ar',
        header: 'house',
        align: 'text-start',
        cell: ({ row }: any) => {
          const { house_contract_id, house_business_id, house_name_ar } = row?.original || {}
          const values = [house_contract_id, house_business_id, house_name_ar]
            .filter(v => v != null && v !== '') // removes null/undefined/empty
            .join(' - ')
          return <div className='text-xs text-start'>{values || '-'}</div>
        },
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/haj/houses',
        filterLabelProp: 'house_commercial_name_ar',
        filterKeyProp: 'business_id',
        filterAccessorKey: 'house_business_id',
        model: 'house_contract'
      },

      {
        accessorKey: 'house_contract.requester.name_ar',
        header: 'house_contract_requester',
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
        filterSearchProps: ['name_ar', 'type_name'],
        model: 'house_contract'
      },

      {
        accessorKey: 'house_contract_id',
        header: 'house_contract_id',
        align: 'text-start'
      },

      {
        accessorKey: 'manifest_bi_id',
        header: 'manifest_bi_id',
        width: '10%',
        align: 'text-start',
        combine: ['bus.bi_operating_card_no', 'bus.bi_plate_no']
      },

      {
        accessorKey: 'manifest_passport_count',
        header: 'total_hajj',
        width: '5%',
        align: 'text-center',
        type: 'amount',
        showCurrency: false
      },

      {
        accessorKey: 'state',
        header: 'status',
        width: '5%',
        type: 'badge',
        list: statusList,
        align: 'text-center'
      }
    ],
    []
  )

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='arrival_manifest'
      columns={columns}
      apiEndpoint='/haj/arrival-manifests'
      routerUrl='/apps/haj/arrival-manifest'
      listView={true}
      enableFilters={true}
      showStats={true}
      statsConfig={statsConfig}
      collapsible={true}
      enableColumnVisibility={true}
      maxVisibleColumns={6}
      mapLocation={['house_longitude', 'house_latitude']}

      //  extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default ArrivalManifestList
