'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'tdo_id', header: 'tdo_id', width: '5%', isIdentifier: true },
  { accessorKey: 'spc.company_name_ar', header: 'tdo_spc_id', type: 'text', align: 'text-center' },
  {
    accessorKey: 'service_center.service_center_name_ar',
    header: 'tdo_service_group_id',
    type: 'text',
    align: 'text-center'
  },
  {
    accessorKey: 'path.name_ar',
    header: 'path_id',
    type: 'text',
    align: 'text-center'
  },
  { accessorKey: 'tdo_deportation_date', header: 'tdo_deportation_date', type: 'date', align: 'text-center' },

  { accessorKey: 'tdo_no_of_adult', header: 'tdo_no_of_adult', align: 'text-center', width: '5%' },
  { accessorKey: 'tdo_no_of_child', header: 'tdo_no_of_child', align: 'text-center', width: '5%' },
  { accessorKey: 'tdo_no_of_infant', header: 'tdo_no_of_infant', align: 'text-center', width: '5%' },
  { accessorKey: 'state', header: 'status', type: 'badge', list: statusList, width: '5%', align: 'text-center' }
]

const TafweejDeportationOrderList = () => (
  <ListComponent
    title='tafweej_deportation_orders'
    columns={columns}
    apiEndpoint='/haj/tafweej-deportation-orders'
    routerUrl='/haj/tafweej-deportation-order'
  />
)

export default TafweejDeportationOrderList
