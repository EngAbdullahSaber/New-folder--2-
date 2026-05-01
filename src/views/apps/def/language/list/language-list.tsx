'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'lang_name_ar', header: 'name_ar' },
  { accessorKey: 'lanuage_name_la', header: 'name_la' },
  { accessorKey: 'status', header: 'status', width: '10%', align: 'text-center', type: 'badge', list: statusList }
]

const LanguageList = () => (
  <ListComponent title='languages' columns={columns} apiEndpoint='/def/languages' routerUrl='/apps/def/language' />
)

export default LanguageList
