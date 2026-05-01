'use client'

import { ListComponent, statusList } from '@/shared'
import type { StatCardConfig, FilterTabConfig } from '@/types/components/dynamicDataTable'
import { AggregateFunction, StatisticsConfig } from '@/types/components/statistics'

const columns = [
  { accessorKey: 'id', header: 'id', width: '15%' },
  { accessorKey: 'name_ar', header: 'name_ar', width: '20%', align: 'text-right' },
  { accessorKey: 'name_la', header: 'name_la', width: '20%', align: 'text-left' },
  { accessorKey: 'short_name', header: 'short_name', width: '15%', align: 'text-center' },
  { accessorKey: 'country.name_ar', header: 'country', width: '30%', align: 'text-right' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

// const statsConfig: StatCardConfig[] = [
//   // {
//   //   title: 'الإجمالى',
//   //   field: 'ALL', // ✅ special case
//   //   icon: 'ri-map-pin-line',
//   //   color: 'primary',
//   //   showChart: false
//   // },
//   {
//     field: 'status',
//     icon: 'ri-information-line', // fallback
//     showChart: false,
//     sectionTitle: 'status',
//     type: 'bar',
//     // gridSize: 3,
//     options: statusList
//     // filterTabsConfig: [
//     //   { label: 'نشط', value: '1', icon: 'ri-checkbox-circle-fill', iconColor: '#4caf50' },
//     //   { label: 'غير نشط', value: '2', icon: 'ri-close-circle-fill', iconColor: '#9e9e9e' }
//     // ]
//   },
//   {
//     field: 'country_id',
//     keyTitle: 'country_id',
//     icon: 'ri-earth-line',
//     sectionTitle: 'country_id',
//     color: 'info',
//     type: 'area',
//     showChart: false,
//     unknownLabel: 'غير محدد'
//   }
// ]

// const filterTabsConfig: FilterTabConfig[] = statusList.map(item => ({
//   label: item.label,
//   value: item.value,
//   field: 'status',
//   icon: item.icon,
//   iconColor: item.color === 'success' ? '#4caf50' : item.color === 'error' ? '#9e9e9e' : undefined
// }))

//  {name: "status", options:statusList}

// const filterTabsConfig: FilterTabConfig[] = [
//   { label: 'نشط', value: '1', icon: 'ri-checkbox-circle-fill', iconColor: '#4caf50' },
//   { label: 'غير نشط', value: '2', icon: 'ri-close-circle-fill', iconColor: '#9e9e9e' }
// ]

// const initialStatistics: StatisticsConfig[] = [
//   { group_by: ['status'], aggregates: { key: 'id', function: AggregateFunction.COUNT } },
//   { group_by: ['country_id'], aggregates: { key: 'id', function: AggregateFunction.COUNT } }
// ]

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

    options: statusList
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
const CitiesList = () => {
  return (
    <ListComponent
      title='cities'
      columns={columns}
      apiEndpoint='/def/cities'
      routerUrl='/apps/def/city'
      showStats={true}
      statsConfig={statsConfig}
      filterTabsConfig={[{ name: 'status', options: statusList }]}
      // initialStatistics={initialStatistics}
    />
  )
}

export default CitiesList
