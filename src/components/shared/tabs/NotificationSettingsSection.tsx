// src/components/shared/tabs/NotificationSettingsSection.tsx
'use client'
import React from 'react'
import { Box, Typography, FormControlLabel } from '@mui/material'
import { Checkbox } from '@/shared'
import { useDialogDetailsForm } from '@/contexts/dialogDetailsFormContext'

interface NotificationSettingsSectionProps {
  row: any
  rowIndex: number
  dictionary: any
  handleInputChange: (index: number, name: string, value: any) => void
  onAcceptToggle?: (enabled: boolean) => void
  onRejectToggle?: (enabled: boolean) => void
}

export const NotificationSettingsSection: React.FC<NotificationSettingsSectionProps> = ({
  row,
  rowIndex,
  dictionary,
  handleInputChange,
  onAcceptToggle,
  onRejectToggle
}) => {
  const { mode } = useDialogDetailsForm()
  // ✅ الوصول الصحيح للـ notification_config
  const notificationConfig = row?.notification_config || {}
  const approveNotification = notificationConfig?.approveNotification || {}
  const rejectNotification = notificationConfig?.rejectNotification || {}

  const acceptEnabled = !!approveNotification?.enabled
  const rejectEnabled = !!rejectNotification?.enabled

  const handleAcceptToggle = (checked: boolean) => {
    // ✅ تحديث الـ notification_config بشكل صحيح
    const updatedConfig = {
      ...notificationConfig,
      approveNotification: checked
        ? {
            enabled: true,
            priority: approveNotification?.priority || 'high',
            notifications_templates: approveNotification?.notifications_templates || []
          }
        : { enabled: false, priority: 'high', notifications_templates: [] }
    }

    handleInputChange(rowIndex, 'notification_config', updatedConfig)
    onAcceptToggle?.(checked)
  }

  const handleRejectToggle = (checked: boolean) => {
    // ✅ تحديث الـ notification_config بشكل صحيح
    const updatedConfig = {
      ...notificationConfig,
      rejectNotification: checked
        ? {
            enabled: true,
            priority: rejectNotification?.priority || 'high',
            notifications_templates: rejectNotification?.notifications_templates || []
          }
        : { enabled: false, priority: 'high', notifications_templates: [] }
    }

    handleInputChange(rowIndex, 'notification_config', updatedConfig)
    onRejectToggle?.(checked)
  }

  return (
    <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant='h6' gutterBottom>
        {dictionary?.placeholders?.notification_settings || 'Notification Settings'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControlLabel
          control={
            <Checkbox
              disabled={mode === 'show'}
              checked={acceptEnabled}
              onChange={e => handleAcceptToggle(e.target.checked)}
            />
          }
          label={dictionary?.placeholders?.enable_approve_notification || 'Enable Approve Notification'}
        />

        <FormControlLabel
          control={
            <Checkbox
              disabled={mode === 'show'}
              checked={rejectEnabled}
              onChange={e => handleRejectToggle(e.target.checked)}
            />
          }
          label={dictionary?.placeholders?.enable_reject_notification || 'Enable Reject Notification'}
        />
      </Box>
    </Box>
  )
}
