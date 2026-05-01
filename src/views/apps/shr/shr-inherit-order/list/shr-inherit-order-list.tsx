'use client'
import { Chip, format, getInheritOrderStatus, getItemFromStaticListByValue, ListComponent, shrInheritLegacyStatus, shrInheritLegacyTypes } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'sholder_id',
    header: 'shareholder_death_id',
    cell: ({ row }: any) => {
      return <div className='text-xs text-start'>{` (${row?.original?.shareholder?.personal?.id})  ${row?.original?.shareholder?.personal?.full_name_ar}`}</div>
    },
  },
  { accessorKey: 'decision_id', header: 'internal_descition_no', width: '8%' },
  {
    accessorKey: 'decision_date',
    width: '10%',
    header: 'internal_descition_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.decision_date || ''
      const date = new Date(dateVal)
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },

  { accessorKey: 'sholder_share_count', header: 'sholder_share_count', width: '10%' },
  { accessorKey: 'inherit_share_count', header: 'inherit_share_count', width: '10%' },

  {
    accessorKey: 'status',
    header: 'shr_status',
    cell: ({ row }: any) => {
      const status = getInheritOrderStatus(row?.original?.status);
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



]

const ShrInheritOrderList = () => (
  <ListComponent title='inherit_order' columns={columns} apiEndpoint='/shr/inherit-order' routerUrl='/apps/shr/shr-inherit-order' />
)

export default ShrInheritOrderList
