'use client'
import { DynamicColumnDef, ListComponent, statusList } from '@/shared'

const columns: DynamicColumnDef[] = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', align: 'text-start', enableFilter: true, filterType: 'text' },
  {
    accessorKey: 'order_no',
    header: 'checklist_element_group',
    width: '10%',
    align: 'text-center',
    enableFilter: true,
    filterType: 'number'
  },
  {
    accessorKey: 'status',
    header: 'status',
    width: '10%',
    align: 'text-center',
    type: 'badge',
    list: statusList,
    enableFilter: true,
    filterType: 'select',
    filterOptions: statusList
  }
]

const ChecklistElementList = () => (
  <ListComponent
    title='checklist_element'
    columns={columns}
    apiEndpoint='/eme/checklist-elements'
    routerUrl='/apps/eme/checklist-element'
    listView={true}
    enableFilters={true}
  />
)

export default ChecklistElementList
