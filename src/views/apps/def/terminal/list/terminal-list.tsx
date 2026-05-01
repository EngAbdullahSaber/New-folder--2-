'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'terminal_id', header: 'bussines_id', width: '10%', align: 'text-center' },
  { accessorKey: 'terminal_name_ar', header: 'name_ar', width: '35%', align: 'text-right' },
  { accessorKey: 'terminal_code', header: 'code', width: '10%', align: 'text-center' },
  { accessorKey: 'port.port_name_ar', header: 'port', width: '30%', align: 'text-right' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const TerminalList = () => (
  <ListComponent title='terminals' columns={columns} apiEndpoint='/def/terminals' routerUrl='/apps/def/terminal' />
)

export default TerminalList
