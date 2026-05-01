'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'relation_desc', header: 'relation_desc' },
]

const ShrRelativityList = () => (
  <ListComponent title='shr_relative' columns={columns} apiEndpoint='/shr/shr-relativities' routerUrl='/apps/shr/shr-relative' />
)

export default ShrRelativityList
