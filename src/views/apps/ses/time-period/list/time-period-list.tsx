'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'period_name', header: 'name' },
  { accessorKey: 'total_hours', header: 'total_hours', width: '15%' },
  { accessorKey: 'start_time', header: 'start_time', width: '15%', type: 'time' },
  { accessorKey: 'end_time', header: 'end_time', width: '15%', type: 'time' },

  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const TimePeriodList = () => (
  <ListComponent
    title='time_periods'
    columns={columns}
    apiEndpoint='/ses/time-periods'
    routerUrl='/apps/ses/time-period'
  />
)

export default TimePeriodList
