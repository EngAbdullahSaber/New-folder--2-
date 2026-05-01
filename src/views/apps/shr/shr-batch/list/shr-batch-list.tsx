'use client'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { format, ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'batch_type',
    header: 'batch_type',
    cell: ({ row }: any) => {
      return <div className='text-xs text-start'>{row?.original?.shareType?.type_desc}</div>
    },
  },

  {
    accessorKey: 'payment_date',
    width: '20%',
    header: 'due_date',
    cell: ({ row }: any) => {
      const paymentDate = row.original.payment_date || ''
      const date = new Date(paymentDate)
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },

  { accessorKey: 'share_amount', header: 'share_amount', width: '15%' },

  {
    accessorKey: 'status',
    header: 'status',
    cell: ({ row }: any) => {
      return (
        <div className='text-center'>
          <CustomIconButton size='small' color='success' variant='contained'>
            <i className="ri-check-fill"></i>
          </CustomIconButton>
        </div>

      )
    },
    width: '5%'
  },




]

const ShrBatchList = () => (
  <ListComponent title='shr_batches' columns={columns} apiEndpoint='/shr/shr-payment' routerUrl='/apps/shr/shr-batch' />
)

export default ShrBatchList
