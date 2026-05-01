'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', align: 'text-start', enableFilter: true, filterType: 'text' },
  {
    accessorKey: 'form_type.short_name',
    header: 'form_type_id',
    width: '40%',
    align: 'text-start',
    enableFilter: true,
    filterType: 'select',
    filterApiUrl: '/eme/form-types',
    filterLabelProp: 'name',
    filterKeyProp: 'id',
    filterAccessorKey: 'form_type_id'
  },

  {
    accessorKey: 'order_no',
    header: 'order_no',
    width: '5%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    type: 'badge',
    list: statusList,
    align: 'text-center',
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const FormGroupElementList = () => (
  <ListComponent
    title='form_group_elements'
    columns={columns}
    apiEndpoint='/eme/form-group-elements'
    routerUrl='/apps/eme/form-group-element'
    listView={true}
    enableFilters={true}
  />
)

export default FormGroupElementList
