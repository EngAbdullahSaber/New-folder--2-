'use client'
import { allowanceScopeList, ListComponent, statusList, yesNoList } from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'name_ar', header: 'name', align: 'text-right' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const PassportUnitTypeList = () => (
  <ListComponent
    title='passport_unit_type'
    columns={columns}
    apiEndpoint={`/haj/passport-unit-types`}
    routerUrl={`/haj/passport-unit-type`}
  />
)

export default PassportUnitTypeList
