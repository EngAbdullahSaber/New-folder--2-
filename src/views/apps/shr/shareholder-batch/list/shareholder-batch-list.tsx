'use client'

import CustomIconButton from '@/@core/components/mui/IconButton'
import { getItemFromStaticListByValue, ListComponent, shrPaymentMethodList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'payment_season',
    header: 'payment_season',
    cell: ({ row }: any) => {
      return <div className='text-xs text-center'>{row?.original?.payment?.season}</div>
    },
    width: '8%'
  },
  { accessorKey: 'shr_payment_m_id', header: 'payment_sn', width: '8%' },
  {
    accessorKey: 'sholder_id',
    header: 'shareholder_name',
    cell: ({ row }: any) => {
      return (
        <div className='text-xs text-start'>{` (${row?.original?.shareholder?.personal_code})  ${row?.original?.shareholder?.personal?.full_name_ar}`}</div>
      )
    }
  },
  { accessorKey: 'amount', header: 'due_amount', width: '10%' },
  {
    accessorKey: 'account_type',
    header: 'payment_method',
    cell: ({ row }: any) => {
      return (
        <div className='text-xs text-center'>
          {getItemFromStaticListByValue(row?.original?.account_type, shrPaymentMethodList)}
        </div>
      )
    },
    width: '8%'
  },

  {
    accessorKey: 'pay_stop_flag',
    header: 'pay_stop_flag',
    cell: ({ row }: any) => {
      let val = row?.original?.pay_stop_flag
      return (
        <div className='text-center'>
          <CustomIconButton size='small' color={val == 2 ? 'success' : 'error'} variant='contained'>
            <i className={val == 2 ? 'ri-check-fill' : 'ri-close-fill'}></i>
          </CustomIconButton>
        </div>
      )
    },
    width: '8%'
  }
]

const ShareholderBatchList = () => (
  <ListComponent
    title='shareholders_batch'
    columns={columns}
    apiEndpoint='/shr/shr-shareholders-payment'
    routerUrl='/apps/shr/shareholder-batch'
  />
)

export default ShareholderBatchList
