'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'template_name', header: 'name', align: 'text-start' }
]

const TemplateList = () => (
  <ListComponent title='templates' columns={columns} apiEndpoint='/aut/templates' routerUrl='/apps/aut/template' />
)

export default TemplateList
