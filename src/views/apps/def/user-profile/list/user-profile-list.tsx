// DepartmentTypeList.tsx
'use client'
import { ListComponent } from '@/shared'
import { format } from 'date-fns'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'personal_picture',
    header: '',
    align: 'text-start',
    type: 'personalPicture',
    width: '4%',
    reportExclude: true
  },
  { accessorKey: 'full_name_ar', header: 'full_name_ar', align: 'text-right' },
  {
    accessorKey: 'full_name_la',
    header: 'full_name_la',
    combine: ['fir_name_la', 'far_name_la', 'fam_name_la'], // Combine logic for the column,
    align: 'text-left'
  },
  { accessorKey: 'id_no', header: 'id_no', width: '10%' },
  {
    accessorKey: 'birth_date',
    width: '10%',
    header: 'birth_date',
    type: 'date'
  },
  { accessorKey: 'pass_no', header: 'pass_no', width: '10%' }
]

const UserProfilesList = () => (
  <ListComponent
    title='user_profiles'
    columns={columns}
    apiEndpoint='/def/personal'
    routerUrl='/apps/def/user-profile'
  />
)

export default UserProfilesList
