'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'status_desc', header: 'status_desc', },



]

const ShrStatusList = () => (
  <ListComponent title='shr_status' columns={columns} apiEndpoint='/shr/shr-statuses' routerUrl='/apps/shr/shr-status' />
)

export default ShrStatusList
