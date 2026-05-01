'use client'

import * as Shared from '@/shared'



interface NoticeReplyingDetailsTableProps {
  locale: string
  initialData: any[]
  onDataChange: (data: any[]) => void
  errors?: any
  mode?: any
  fields: any[]
  apiEndPoint: string
  detailsKey: string
  dataObject: any
}

const NoticeReplyingDetailsTable = ({
  locale,
  initialData,
  onDataChange,
  errors,
  mode,
  fields,
  apiEndPoint,
  detailsKey,
  dataObject
}: NoticeReplyingDetailsTableProps) => {
  const { isPrintMode } = Shared.usePrintMode()
  return (
    <Shared.Box sx={{
      mt: 2,
      p: 3,
      bgcolor: 'background.paper',
      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
      border: '1px solid',
      borderColor: 'divider'
    }}

      style={{ display: !isPrintMode ? 'block' : 'none' }}>
      <Shared.DynamicFormTable
        fields={fields}
        title='notices_order_details'
        initialData={initialData}
        onDataChange={onDataChange}
        mode={mode}
        errors={errors}
        detailsKey={detailsKey}
        locale={locale}
        apiEndPoint={apiEndPoint}
        dataObject={dataObject}


      />
    </Shared.Box>
  )
}

export default NoticeReplyingDetailsTable
