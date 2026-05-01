'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'business_id', header: 'business_id', width: '10%', align: 'text-center' },
  { accessorKey: 'company_name_ar', header: 'company_name_ar', align: 'text-right' },
  { accessorKey: 'mission.name_ar', header: 'mission', width: '25%%', align: 'text-start' },
  { accessorKey: 'seasonal_assigned_quota', header: 'seasonal_assigned_quota',  width: '12%', align: 'text-center', type: 'amount', showCurrency: false },
  { accessorKey: 'hc_state', header: 'status', width: '7%', align: 'text-center', type: 'badge', list: statusList }
]

const DhcHajCompanyList = () => (
  <ListComponent
    title='dhc_haj_company'
    columns={columns}
    apiEndpoint='/haj/dhc-hajj-companies'
    routerUrl='/apps/haj/dhc-haj-company'
    listView={true}
  />
)

export default DhcHajCompanyList
