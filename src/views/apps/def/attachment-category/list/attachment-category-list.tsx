// DepartmentTypeList.tsx
'use client'
import { ListComponent } from '@/shared'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },
  { accessorKey: 'accept_extensions', header: 'accept_extensions', width: '10%' },
  { accessorKey: 'attachment_cat_desc', header: 'attachment_cat_desc' },


]

const AttachmentCategoryList = () => (
  <ListComponent title='attachment-categories' columns={columns} apiEndpoint='/def/attach-categories' routerUrl='/apps/def/attachment-category' />
)

export default AttachmentCategoryList
