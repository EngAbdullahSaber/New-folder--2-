'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'season', header: 'season', width: '10%' },
  { accessorKey: 'greg_season', header: 'greg_season', width: '10%' },
  {
    accessorKey: 'first_season_start_end_date',
    header: 'first_season_start_end_date',
    type: 'date',
    combine: ['season1_start', 'season1_end'],
    width: '25%'
  },
  {
    accessorKey: 'second_season_start_end_date',
    header: 'second_season_start_end_date',
    type: 'date',
    combine: ['season1_start', 'season2_end'],
    width: '25%'
  },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const SeasonList = () => (
  <ListComponent title='seasons' columns={columns} apiEndpoint='/def/seasons' routerUrl='/apps/def/season' />
)

export default SeasonList
