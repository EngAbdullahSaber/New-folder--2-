'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right' },
  { accessorKey: 'name_la', header: 'name_la', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const LocationList = () => (
  <ListComponent title='locations'
   columns={columns} apiEndpoint='/def/locations' 
   routerUrl='/apps/def/location'
         mapLocation={['y_axis', 'x_axis']}
 />
)

export default LocationList
