'use client'
import { allowanceScopeList, ListComponent, statusList, yesNoList } from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'passport_units_name_ar', header: 'name', align: 'text-right' },
  { accessorKey: 'short_name_ar', width: '20%', header: 'short_name_ar', align: 'text-right' },
  { accessorKey: 'order_no', width: '10%', header: 'order_no', align: 'text-center' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const PassportUnitList = ({ scope }: ComponentGeneralProps) => (
  <ListComponent
    title='passport_units'
    columns={columns}
    apiEndpoint={`/haj/passport-units${scope === 'department' ? '/departments' : ''}`}
    routerUrl={`/haj/passport-unit/${scope}`}
    showOnlyOptions={scope === 'department' ? ['edit', 'export', 'print', 'search'] : undefined}
  />
)

export default PassportUnitList
