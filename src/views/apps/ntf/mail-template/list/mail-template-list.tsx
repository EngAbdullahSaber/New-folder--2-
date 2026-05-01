'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'template_name', header: 'template_name', align: 'text-start' },
  { accessorKey: 'subject', header: 'subject', align: 'text-start' },
  { accessorKey: 'job_hh', header: 'job_hh', align: 'text-start', width: '20%', type: 'time' },
  {
    accessorKey: 'start_date',
    header: 'start_end_date',
    type: 'date',
    combine: ['start_date', 'end_date'],
    width: '15%'
  },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const MailTemplateList = () => (
  <ListComponent
    title='mail_templates'
    columns={columns}
    apiEndpoint='/ntf/mail-templates'
    routerUrl='/apps/ntf/mail-template'
  />
)

export default MailTemplateList
