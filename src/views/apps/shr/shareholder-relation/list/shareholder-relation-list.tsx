
// DepartmentTypeList.tsx
'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'relation_desc', header: 'relation_desc', },


]

const ShareholderRelationList = () => (
  <ListComponent title='shareholder_relations' columns={columns} apiEndpoint='/shr/shr-relations' routerUrl='/apps/shr/shareholder-relation' />
)

export default ShareholderRelationList
