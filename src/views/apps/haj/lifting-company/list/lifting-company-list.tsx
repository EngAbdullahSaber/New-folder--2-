'use client'
import { ListComponent, useSessionHandler } from '@/shared'
import { format } from 'date-fns'
import * as Shared from '@/shared'
const LiftingCompanyList = () => {
  const { shouldBlockAccess, AccessBlockedScreen, filter_with_city, user, locale } = Shared.useCityAccess()
  const cityId = user?.context?.city_id || null

  const columns: Shared.DynamicColumnDef[] = Shared.useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '10%', enableFilter: true, filterType: 'number' },
      { accessorKey: 'name_ar', header: 'name_ar', align: 'text-right', width: '20%', enableFilter: true },
      { accessorKey: 'quota', header: 'quota', width: '10%', enableFilter: true, filterType: 'number' },
      { accessorKey: 'reg_no', header: 'reg_no', width: '10%', enableFilter: true },
      {
        accessorKey: 'reg_date',
        width: '10%',
        header: 'reg_date',
        enableFilter: true,
        filterType: 'date',
          cell: ({ row }: any) => {
          const regDate = row.original.reg_date || ''
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

      {
        accessorKey: 'reg_expire_date',
        width: '10%',
        header: 'reg_expire_date',
          cell: ({ row }: any) => {
          const regDate = row.original.reg_expire_date || ''
          const formattedRegDate = regDate.replace(' ', 'T')
          const date = new Date(formattedRegDate)
          if (isNaN(date.getTime())) {
            // If the date is invalid, handle the error gracefully
            return <div className='text-xs text-center'>Invalid Date</div>
          }
          const formattedDate = format(date, 'yyyy-MM-dd')
          return <div className='text-xs text-center'>{formattedDate}</div>
        }
      }
    ],
    []
  )

  if (shouldBlockAccess) return <AccessBlockedScreen />

  return (
  <ListComponent title='lifting_companies' 
  columns={columns} apiEndpoint='/haj/lifting-companies'
      routerUrl='/apps/haj/lifting-company'
      enableFilters={true}
      extraQueryParams={filter_with_city ? { city_id: cityId } : {}}
    />
  )
}

export default LiftingCompanyList
