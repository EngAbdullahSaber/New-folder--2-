'use client'

import * as Shared from '@/shared'
import type { Locale } from '@/configs/i18n'

// Import fields from notice-replying

interface NoticeReplyingMasterFormProps {
  locale: string
  data?: any
  fields: any[]
  mode: string
}

const NoticeReplyingMasterForm = ({ locale, data, fields, mode }: NoticeReplyingMasterFormProps) => {
  return (
    <Shared.Box sx={{
      mb: 4,
      pb: 3,
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <Shared.FormComponent
        locale={locale as string}
        fields={fields}
        mode={mode as Shared.Mode ?? "show"}
        screenMode='show'
        dataObject={data}
        printForm={false}
      />
    </Shared.Box>
  )
}

export default NoticeReplyingMasterForm
