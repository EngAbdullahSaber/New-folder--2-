// src/components/shared/tabs/NotificationTabContent.tsx
'use client'
import React from 'react'
import { Box, Typography, TextField, MenuItem } from '@mui/material'
import { DynamicFormTable } from '@/shared'
import type { TabContentProps } from '@/types/components/dialogDetailsForm'

interface NotificationTabContentProps extends TabContentProps {
  notificationType: 'approve' | 'reject'
}

export const NotificationTabContent: React.FC<NotificationTabContentProps> = ({
  row,
  rowIndex,
  dictionary,
  handleInputChange,
  mode,
  notificationType
}) => {
  // ✅ الوصول الصحيح للـ notification_config
  const notificationConfig = row?.notification_config || {}
  const notificationKey = notificationType === 'approve' ? 'approveNotification' : 'rejectNotification'
  const notificationData = notificationConfig[notificationKey] || {}

  const notificationFields = [
    {
      name: 'to',
      label: 'to',
      type: 'select' as const,
      options: [
        { label: 'ALL', value: 'ALL' },
        { label: 'Next Step', value: 'nextstep' },
        { label: 'Requester', value: 'requester' }
      ],
      required: true,
      width: '15%'
    },
    {
      name: 'email',
      label: 'email',
      type: 'select' as const,
      apiUrl: '/ntf/mail-templates',
      labelProp: 'template_name',
      keyProp: 'id',
      width: '20%'
    },
    {
      name: 'sms',
      label: 'sms',
      type: 'select' as const,
      apiUrl: '/ntf/sms-msg-templates',
      labelProp: 'msg_desc',
      keyProp: 'id',
      width: '20%'
    },
    {
      name: 'push',
      label: 'push',
      type: 'select' as const,
      // visible: false,
      options: [
        // { label: 'Template 1', value: '1' },
        // { label: 'Template 2', value: '2' },
        // { label: 'Template 3', value: '3' }
      ],
      width: '20%'
    },
    {
      name: 'inapp',
      label: 'inapp',
      type: 'select' as const,
      options: [
        // { label: 'Template 1', value: '1' },
        // { label: 'Template 2', value: '2' },
        // { label: 'Template 3', value: '3' }
      ],
      width: '20%'
    }
  ]

  const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ✅ تحديث الـ notification_config بشكل صحيح
    const updatedConfig = {
      ...notificationConfig,
      [notificationKey]: {
        ...notificationData,
        priority: e.target.value
      }
    }

    handleInputChange(rowIndex, 'notification_config', updatedConfig)
  }

  const handleNotificationDataChange = (updatedData: any[]) => {
    // ✅ تحديث الـ notification_config بشكل صحيح
    const updatedConfig = {
      ...notificationConfig,
      [notificationKey]: {
        ...notificationData,
        enabled: true,
        priority: notificationData?.priority || 'high',
        notifications_templates: updatedData
      }
    }

    handleInputChange(rowIndex, 'notification_config', updatedConfig)
  }

  const titleKey = notificationType === 'approve' ? 'approve_notification' : 'reject_notification'

  return (
    <Box>
      <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
        {dictionary?.placeholders?.[titleKey] ||
          (notificationType === 'approve' ? 'Approve Notification' : 'Reject Notification')}
      </Typography>

      <Box sx={{ my: 3 }}>
        <TextField
          select
          label={dictionary?.placeholders?.priority || 'Priority'}
          value={notificationData?.priority || 'high'}
          onChange={handlePriorityChange}
          sx={{ width: 200 }}
          size='small'
          disabled={mode === 'show'}
        >
          <MenuItem value='high'>{dictionary?.options?.high || 'High'}</MenuItem>
          <MenuItem value='medium'>{dictionary?.options?.medium || 'Medium'}</MenuItem>
          <MenuItem value='low'>{dictionary?.options?.low || 'Low'}</MenuItem>
        </TextField>
      </Box>

      <DynamicFormTable
        fields={notificationFields}
        title='notification_templates'
        initialData={notificationData?.notifications_templates || []}
        mode={mode}
        errors={[]}
        onDataChange={handleNotificationDataChange}
        locale='ar'
        rowModal={false}
      />
    </Box>
  )
}
