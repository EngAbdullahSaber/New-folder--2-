'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'season', header: 'season', width: '5%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right' },
  { accessorKey: 'haj_quota', header: 'haj_quota', },
  { accessorKey: 'heb_no', header: 'heb_no', },

]

const EstBranchList = () => (
  <ListComponent title='est-branches' columns={columns} apiEndpoint='/haj/hajj-est-branches' routerUrl='/apps/haj/est-branch' />
)

export default EstBranchList
