'use client'
import { ListComponent, statusList } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '5%' },
  { accessorKey: 'name', header: 'name', align: 'text-start' },
  { accessorKey: 'code', header: 'code', width: '20%' },
  { accessorKey: 'status', header: 'status', width: '10%', type: 'badge', list: statusList, align: 'text-center' }
]

const CurriculumList = () => (
  <ListComponent title='curriculum' columns={columns} apiEndpoint='/cur/curriculums' routerUrl='/apps/cur/curriculum' />
)

export default CurriculumList
