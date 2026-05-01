// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'description_ar', header: 'description_ar', width: '30%', align: 'text-right'},
    { accessorKey: 'description_la', header: 'description_la', width: '30%', align: 'text-left'},
    { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const HouseBenefitsList = () => (
  <ListComponent
    title='house_benefits'
    columns={columns}
    apiEndpoint='/def/house-benefit-types'
    routerUrl='/apps/def/house-benefit-type'
  />
)

export default HouseBenefitsList
