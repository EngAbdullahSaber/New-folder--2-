'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },

  // { accessorKey: 'season', header: 'season', width: '10%' },
  {
    accessorKey: 'di_driver_identification_id',
    header: 'di_driver_identification_id',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'di_driver_name',
    header: 'di_driver_name',
    align: 'text-start',
    enableFilter: true,
    filterType: 'text'
  },
  {
    accessorKey: 'lu_nationality.name_ar',
    header: 'nationality',
    width: '12%',
    align: 'text-start',
    enableFilter: true,
    filterApiUrl: '/def/nationalities',
    filterAccessorKey: 'lu_nationality_id',
    filterLabelProp: 'name_ar',
    filterKeyProp: 'id',
    filterType: 'select'
  },
  {
    accessorKey: 'di_mobile_no',
    header: 'mobile',
    width: '7%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'text'
  },
  { accessorKey: 'lu_land_trans_company.name_ar', header: 'transport_company', width: '20%', align: 'text-start' },
  {
    accessorKey: 'state',
    header: 'status',
    width: '5%',
    type: 'badge',
    list: statusList,
    align: 'text-center',
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const DriverList = () => (
  <ListComponent
    title='haj_driver'
    columns={columns}
    apiEndpoint='/haj/drivers'
    routerUrl='/apps/haj/driver'
    listView={true}
    enableFilters={true}
  />
)

export default DriverList
