'use client'
import { ListComponent, objectTypeList, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'object_name_ar',
    header: 'name',
    width: '15%',
    align: 'text-right'
  },

  {
    accessorKey: 'route_name',
    header: 'route_name',
    width: '17%',
    align: 'text-left'
  },

  {
    accessorKey: 'route_path',
    header: 'route_path',
    width: '20%',
    align: 'text-left'
  },

  {
    accessorKey: 'object_order',
    header: 'order_no',
    width: '7%',
    align: 'text-center'
  },

  {
    accessorKey: 'object_type',
    header: 'object_type',
    type: 'badge',
    list: objectTypeList,
    width: '7%'
  },
  { accessorKey: 'status', header: 'status', width: '7%', align: 'text-center', type: 'badge', list: statusList }
]

const ObjectList = () => (
  <ListComponent
    title='objects_list'
    selectable={true}
    columns={columns}
    apiEndpoint='/aut/objects'
    routerUrl='/apps/aut/object'
    listView={true}
  />
)

export default ObjectList
