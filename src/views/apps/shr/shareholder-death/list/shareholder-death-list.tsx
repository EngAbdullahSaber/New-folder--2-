'use client'
import { Chip, format, getShareHolderStatus, ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'sholder_id',
    header: 'shareholder_name',
    cell: ({ row }: any) => {
      return <div className='text-xs text-start'>{` (${row?.original?.sholder_id})  ${row?.original?.personal?.full_name_ar}`}</div>
    },
  },

  {
    accessorKey: 'death_date',
    width: '15%',
    header: 'death_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.death_date || ''
      const date = new Date(dateVal)
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },

  { accessorKey: 'death_cert_no', header: 'death_cert_no', width: '15%' },
  {
    accessorKey: 'death_cert_date',
    width: '15%',
    header: 'death_cert_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.death_cert_date || ''
      const date = new Date(dateVal)
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },




  // {
  //   accessorKey: 'status',
  //   header: 'shr_status',
  //   cell: ({ row }: any) => {
  //     const status = getShareHolderStatus(row?.original?.status);
  //     return (
  //       <div className='text-center'>
  //         <Chip
  //           variant={status.variant}
  //           label={status.label}
  //           size='small'
  //           color={status.color}
  //         />
  //       </div>
  //     )
  //   },
  //   width: '10%'
  // },




]

const ShareholderDeathList = () => (
  <ListComponent title='shareholders_death' columns={columns} apiEndpoint='/shr/shareholder-deaths' routerUrl='/apps/shr/shareholder-death' />
)

export default ShareholderDeathList
