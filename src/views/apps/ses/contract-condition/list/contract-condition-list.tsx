'use client'
import { Box, contractTypeList, ListComponent, statusList, truncateText } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  {
    accessorKey: 'contract_type',
    header: 'contract_type',
    width: '10%',
    align: 'text-start',
    list: contractTypeList,
    type: 'select'
  },

  { accessorKey: 'order_no', header: 'order_no', width: '10%', align: 'text-center' },

  {
    accessorKey: 'descrepition',
    header: 'contract',
    width: '60%',
    align: 'text-start',
    cell: ({ row }: any) => {
      const rawHtml = row.original.descrepition || '-'
      const truncated = truncateText(rawHtml, 100)

      return <Box sx={{ color: '#666', fontSize: '12px' }}>{truncated}</Box>
    }
  },

  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const ContractConditionList = () => (
  <ListComponent
    title='contract_condition'
    columns={columns}
    apiEndpoint='/ses/contract-conditions'
    routerUrl='/apps/ses/contract-condition'
    listView={true}
  />
)

export default ContractConditionList
