'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'bi_naqaba_bus_id',
    header: 'naqaba_bus_id',
    width: '15%',
    align: 'text-center',

    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'bi_plate_no',
    header: 'plate_no',
    width: '15%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'text'
  },

  // { accessorKey: 'bi_chassis_no', header: 'chassis_no', width: '10%', align: 'text-start' },
  {
    accessorKey: 'bi_operating_card_no',
    header: 'operating_card_no',
    width: '15%',
    align: 'text-center',

    enableFilter: true,
    filterType: 'text'
  },

  // { accessorKey: 'bi_manufacturing_year', header: 'manufacturing_year', width: '10%', align: 'text-start' },
  {
    accessorKey: 'lu_land_trans_company.ltc_name_ar',
    header: 'transport_company',
    width: '20%',
    align: 'text-start',
    enableFilter: true,
    filterType: 'select',
    filterApiUrl: '/def/transportation-companies',
    filterLabelProp: 'ltc_name_ar',
    filterKeyProp: 'id'
  },

  // { accessorKey: 'bi_machine_no', header: 'machine_no', width: '10%', align: 'text-start' },
  {
    accessorKey: 'state',
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

const BusList = () => (
  <ListComponent
    title='bus'
    columns={columns}
    apiEndpoint='/haj/buses'
    routerUrl='/apps/haj/bus'
    enableFilters={true}
    listView={true}
  />
)

export default BusList
