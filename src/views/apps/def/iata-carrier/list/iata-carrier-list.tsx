'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '7%' },
  {
    accessorKey: 'srv_code',
    header: 'srv_code',
    width: '15%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'name_ar',
    header: 'name_ar',
    align: 'text-right',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'name_en',
    header: 'name_la',
    align: 'text-left',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: statusList,
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const IataCarrierList = () => (
  <ListComponent
    title='iata_carrier'
    columns={columns}
    apiEndpoint='/def/iata-carriers'
    routerUrl='/apps/def/iata-carrier'
    listView={true}
    enableFilters={true}
  />
)

export default IataCarrierList
