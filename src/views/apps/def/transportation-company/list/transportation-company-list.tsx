'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  // { accessorKey: 'season', header: 'season', width: '10%' },
  {
    accessorKey: 'business_id',
    header: 'business_id',
    width: '7%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'ltc_naqaba_id',
    header: 'ltc_naqaba_id',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'ltc_name_ar',
    header: 'ltc_name_ar',
    align: 'text-right',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'ltc_name_la',
    header: 'ltc_name_la',
    align: 'text-left',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'ltc_state',
    header: 'status',
    width: '10%',
    type: 'badge',
    list: statusList,
    align: 'text-center',
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const TransportationCompanyList = () => (
  <ListComponent
    title='transportation_company'
    columns={columns}
    apiEndpoint='/def/transportation-companies'
    routerUrl='/apps/def/transportation-company'
    listView={true}
    enableFilters={true}
  />
)

export default TransportationCompanyList
