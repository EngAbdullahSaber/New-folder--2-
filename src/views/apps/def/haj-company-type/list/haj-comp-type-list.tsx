// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'desc_ar', header: 'desc_ar', width: '30%', align: 'text-right' },
  { accessorKey: 'desc_la', header: 'desc_la', width: '30%', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const HajCompanyTypesList = () => (
  <ListComponent
    title='haj_companies_types'
    columns={columns}
    apiEndpoint='/def/haj-companies-types'
    routerUrl='/apps/def/haj-company-type'
  />
)

export default HajCompanyTypesList
