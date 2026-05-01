'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%', },
  { accessorKey: 'order_no', header: 'order_no', width: '10%' },
  { accessorKey: 'type_desc', header: 'type_desc', },
]

const ShareTypeList = () => (
  <ListComponent title='share_types' columns={columns} apiEndpoint='/shr/shr-types' routerUrl='/apps/shr/share-type' />
)

export default ShareTypeList
