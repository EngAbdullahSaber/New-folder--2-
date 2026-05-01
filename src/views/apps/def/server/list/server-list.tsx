'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'server_ip', header: 'server_ip', width: '10%' },
  { accessorKey: 'server_a_name', header: 'server_a_name', }
]

const ServersList = () => (
  <ListComponent title='servers' columns={columns} apiEndpoint='/def/servers' routerUrl='/apps/def/server' />
)

export default ServersList
