'use client'
import {
  format,
  getItemFromStaticListByValue,
  ListComponent,
  shrInheritLegacyStatus,
  shrInheritLegacyTypes
} from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'shareholderDeathPersonal',
    header: 'shareholder_death_id',
    cell: ({ row }: any) => {
      return (
        <div className='text-xs text-start'>{` (${row?.original?.shareholderDeathPersonal?.id})  ${row?.original?.shareholderDeathPersonal?.full_name_ar}`}</div>
      )
    }
  },
  { accessorKey: 'internal_descition_no', header: 'internal_descition_no', width: '8%' },
  {
    accessorKey: 'internal_descition_date',
    width: '10%',
    header: 'internal_descition_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.internal_descition_date || ''
      const date = new Date(dateVal)
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },

  { accessorKey: 'descion_no', header: 'descion_no', width: '10%' },

  {
    accessorKey: 'descition_date',
    width: '10%',
    header: 'descition_date',
    cell: ({ row }: any) => {
      const dateVal = row.original.descition_date || ''
      const date = new Date(dateVal)
      const formattedDate = format(date, 'yyyy-MM-dd')
      return <div className='text-xs text-center'>{formattedDate}</div>
    }
  },
  {
    accessorKey: 'shareholderDeathPersonal',
    header: 'shareholder_death_id',
    cell: ({ row }: any) => {
      return (
        <div className='text-xs text-center'>{`${getItemFromStaticListByValue(row?.original?.fractions_status, shrInheritLegacyTypes)}`}</div>
      )
    },
    width: '10%'
  },

  {
    accessorKey: 'status',
    header: 'status',
    cell: ({ row }: any) => {
      return (
        <div className='text-xs text-center'>{`${getItemFromStaticListByValue(row?.original?.status, shrInheritLegacyStatus)}`}</div>
      )
    },
    width: '10%'
  }
]

const ShrInheritLegacyList = () => (
  <ListComponent
    title='inherit_legacy'
    columns={columns}
    apiEndpoint='/shr/inherit-legacies'
    routerUrl='/apps/shr/shr-inherit-legacy'
  />
)

export default ShrInheritLegacyList
