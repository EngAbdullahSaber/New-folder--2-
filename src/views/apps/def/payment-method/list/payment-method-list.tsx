// DepartmentTypeList.tsx
'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'desc_ar', header: 'desc_ar', width: '20%', align: 'text-right' },
  { accessorKey: 'desc_la', header: 'desc_la', width: '20%', align: 'text-left' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const PaymentMethodsList = () => (
  <ListComponent
    title='payment_methods'
    columns={columns}
    apiEndpoint='/def/payment-methods'
    routerUrl='/apps/def/payment-method'
  />
)

export default PaymentMethodsList
