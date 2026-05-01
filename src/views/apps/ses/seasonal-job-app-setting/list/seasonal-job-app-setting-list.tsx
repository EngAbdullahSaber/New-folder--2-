'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'season', header: 'season', width: '10%' },
  { accessorKey: 'seasonal_open_date', header: 'seasonal_open_date', type: 'date' },
  { accessorKey: 'seasonal_close_date', header: 'seasonal_close_date', type: 'date' },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const SeasonalJobAppSettingList = () => (
  <ListComponent
    title='seasonal_jobs_app_settings'
    columns={columns}
    apiEndpoint='/ses/app-settings'
    routerUrl='/apps/ses/seasonal-job-app-setting'
  />
)

export default SeasonalJobAppSettingList
