'use client'
import { Chip, getShareHolderSignature, getShareHolderStatus, ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'sholder_code', header: 'shareholder_code', width: '8%', isIdentifier: true },
  {
    accessorKey: 'full_name_ar',
    header: 'shareholder_name',
    cell: ({ row }: any) => {
      return <div className='text-xs text-start'>{row?.original?.personal?.full_name_ar}</div>
    },

  },

  {
    accessorKey: 'id_no',
    header: 'id_no',
    cell: ({ row }: any) => {
      return <div className='text-xs text-center'>{row?.original?.personal?.id_no}</div>
    },
    width: '8%'
  },
  {
    accessorKey: 'relation_desc',
    header: 'shr_relation',
    cell: ({ row }: any) => {
      return <div className='text-xs text-center'>{row?.original?.relation?.relation_desc}</div>
    },
    width: '8%'
  },
  { accessorKey: 'total_shares', header: 'total_shares', width: '5%' },
  {
    accessorKey: 'status',
    header: 'shr_status',
    cell: ({ row }: any) => {
      const status = getShareHolderStatus(row?.original?.status);
      return (
        <div className='text-center'>
          <Chip
            variant={status.variant}
            label={status.label}
            size='small'
            color={status.color}
          />
        </div>
      )
    },
    width: '10%'
  },
  {
    accessorKey: 'attachments',
    header: 'archive_no',
    cell: ({ row }: any) => {
      return <div className='text-xs text-center'>{row?.original?.attachments?.length || '0'}</div>
    },
    width: '5%'
  },
  {
    accessorKey: 'acceptance',
    header: 'signature',
    cell: ({ row }: any) => {
      const acceptance = getShareHolderSignature(row?.original?.acceptance[0]);
      return (
        <div className='text-center'>
          <Chip
            variant={acceptance.variant}
            label={acceptance.label}
            size='small'
            color={acceptance.color}
          />
        </div>
      )
    },
    width: '10%'
  },



]

const ShareholderProfileList = () => (
  <ListComponent title='shareholder_profile' columns={columns} apiEndpoint='/shr/shareholders' routerUrl='/apps/shr/shareholder-profile' />
)

export default ShareholderProfileList
