// DepartmentTypeList.tsx
'use client'
import { ListComponent, useSessionHandler } from '@/shared'
import * as Shared from '@/shared'
const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  {
    accessorKey: 'first_name',
    header: 'name',
    combine: ['first_name_ar,father_name_ar', 'grandfather_name_ar', 'family_name_ar']
  },
  { accessorKey: 'id_no', header: 'id_no' },
  { accessorKey: 'passport_no', header: 'pass_no' },
  { accessorKey: 'card_id', header: 'card_id' }
]

const RepresentativeList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
    <ListComponent
      title='representatives'
      columns={columns}
      apiEndpoint='/def/representatives'
      routerUrl='/apps/def/representative'
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default RepresentativeList
