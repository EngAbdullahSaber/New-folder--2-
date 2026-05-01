'use client'
import { ListComponent, statusList, yesNoList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'msg_desc', header: 'msg_desc', align: 'text-right' },

  {
    accessorKey: 'send_immediate',
    header: 'send_immediate',
    type: 'badge',
    list: yesNoList,
    width: '15%'
  },

  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const SmsTemplateList = () => (
  <ListComponent
    title='sms_templates'
    columns={columns}
    apiEndpoint='/ntf/sms-msg-templates'
    routerUrl='/apps/ntf/sms-template'
  />
)

export default SmsTemplateList
