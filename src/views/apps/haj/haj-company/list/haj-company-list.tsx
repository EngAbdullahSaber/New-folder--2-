// DepartmentTypeList.tsx
'use client'
import { ListComponent } from '@/shared'
import { format } from 'date-fns'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right', width: '20%' },
  { accessorKey: 'reg_no', header: 'reg_no', width: '15%' },
  {
    accessorKey: 'reg_date_la',
    width: '10%',
    header: 'reg_date_la',
    cell: ({ row }: any) => {
      const regDate = row.original.reg_date_la || ''
      const formattedRegDate = regDate.replace(' ', 'T')
      const date = new Date(formattedRegDate)
      if (isNaN(date.getTime())) {
        // If the date is invalid, handle the error gracefully
        return <div className='text-xs text-center'>Invalid Date</div>
      }
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },

  { accessorKey: 'haj_quota', header: 'haj_quota', width: '10%' }
]

const HajCompanyList = () => (
  <ListComponent
    title='haj_companies'
    columns={columns}
    apiEndpoint='/haj/haj-companies'
    routerUrl='/apps/haj/haj-company'
  />
)

export default HajCompanyList
