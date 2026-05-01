'use client'
import { ListComponent } from '@/shared'
import * as Shared from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'requset_date', header: 'request_date', type: 'date', width: '15%' },
  // { accessorKey: 'department.department_name_ar', header: 'department', width: '20%' },
  { accessorKey: 'personal.full_name_ar', header: 'personal' },
  { accessorKey: 'template.template_name', header: 'template', width: '20%' },
  {
    accessorKey: 'process_status',
    header: 'status',
    width: '15%',
    type: 'badge',
    list: Shared.templateProcessStatusList,
    align: 'text-center'
  }
]

const TemplateRequestList = () => (
  <ListComponent
    title='requests'
    columns={columns}
    apiEndpoint='/aut/template-requests'
    routerUrl='/apps/aut/template-request'
  />
)

export default TemplateRequestList
