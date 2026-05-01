'use client'
import { ListComponent, userStatusList, yesNoList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },

  // { accessorKey: 'personal_id', header: 'personal_id', width: '15%', isRef: true, component: UserProfileDetails },
  { accessorKey: 'personal.id_no', header: 'id_no', width: '15%' },
  { accessorKey: 'personal.full_name_ar', header: 'full_name_ar', align: 'text-right' },
  { accessorKey: 'expire_date', header: 'exp_date', type: 'date', width: '15%', align: 'text-start' },
  { accessorKey: 'historical_data_access', header: 'historical_data', width: '10%', type: 'badge', list: yesNoList },
  {
    accessorKey: 'user_status',
    header: 'status',
    width: '10%',
    type: 'badge',
    list: userStatusList,
    align: 'text-center'
  }
]

const UserList = () => (
  <ListComponent title='users' columns={columns} apiEndpoint='/aut/users' routerUrl='/apps/aut/user' />
)

export default UserList
