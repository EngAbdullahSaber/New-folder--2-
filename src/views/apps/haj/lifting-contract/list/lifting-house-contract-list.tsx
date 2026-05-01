'use client'
import { ListComponent } from '@/shared'
import { format } from 'date-fns'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'season', header: 'season' },
  { accessorKey: 'lhc_contract_no', header: 'contract_no' },

  {
    accessorKey: 'lhc_date',

    header: 'contract_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.lhc_date || ''
      const formattedDateVal = dateVal.replace(' ', 'T')
      const date = new Date(formattedDateVal)
      if (isNaN(date.getTime())) {
        // If the date is invalid, handle the error gracefully
        return <div className='text-xs text-center'>Invalid Date</div>
      }
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },
  {
    accessorKey: 'lhc_start_date',

    header: 'start_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.lhc_start_date || ''
      const formattedDateVal = dateVal.replace(' ', 'T')
      const date = new Date(formattedDateVal)
      if (isNaN(date.getTime())) {
        // If the date is invalid, handle the error gracefully
        return <div className='text-xs text-center'>Invalid Date</div>
      }
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },
  {
    accessorKey: 'lhc_end_date',

    header: 'exp_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.lhc_end_date || ''
      const formattedDateVal = dateVal.replace(' ', 'T')
      const date = new Date(formattedDateVal)
      if (isNaN(date.getTime())) {
        // If the date is invalid, handle the error gracefully
        return <div className='text-xs text-center'>Invalid Date</div>
      }
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },

  { accessorKey: 'lhc_total_pilgrims', header: 'total_haj_quota', },
  { accessorKey: 'lhc_pilgrim_price', header: 'pilgrim_price' },
  { accessorKey: 'lhc_total_price', header: 'total_price' },
]

const LiftingContractList = () => (
  <ListComponent title='lifting_contracts' columns={columns} apiEndpoint='/haj/lifting-house-contracts' routerUrl='/apps/haj/lifting-contract' />
)

export default LiftingContractList
