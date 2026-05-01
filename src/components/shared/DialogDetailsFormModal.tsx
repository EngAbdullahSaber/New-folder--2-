// src/components/shared/DialogDetailsFormModal.tsx
'use client'
import React, { useState, useMemo } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box } from '@mui/material'
import { DialogDetailsFormProvider } from '@/contexts/dialogDetailsFormContext'
import { ModalFieldsRenderer } from './ModalFieldsRenderer'
import { NotificationSettingsSection } from './tabs/NotificationSettingsSection'
 import type { Mode } from '@/shared'
import type { TabConfig, TabContentProps, DialogDetailsFormContextType } from '@/types/components/dialogDetailsForm'

// Re-export
export type { TabConfig, TabContentProps }

interface DialogDetailsFormModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  deleteRow?: (e: React.MouseEvent, rowIndex: number, rowId?: any) => void
  onChangeRow?: (row: any, rowIndex: number, object?: any) => void
  row: any
  rowIndex: number
  fields: any[]
  dictionary: any
  errors: any[]
  handleInputChange: (index: number, name: string, value: any) => void
  mode: Mode
  tabs?: TabConfig[]
  title?: string
  showDelete?: boolean
  showNotificationSettings?: boolean // لإظهار إعدادات الإشعارات في الـ Main Tab
  mainTabExtra?: React.ReactNode // محتوى إضافي في الـ Main Tab
  detailsKey?: string
  dataObject: any
}

const TabPanel: React.FC<{ children?: React.ReactNode; value: number; index: number }> = ({
  children,
  value,
  index
}) => (
  <div role='tabpanel' hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
)

export const DialogDetailsFormModal: React.FC<DialogDetailsFormModalProps> = ({
  open,
  onClose,
  onSave,
  deleteRow,
  row,
  rowIndex,
  fields,
  dictionary,
  errors,
  handleInputChange,
  mode,
  tabs = [],
  title,
  showDelete = true,
  showNotificationSettings = false,
  mainTabExtra,
  detailsKey = '',
  dataObject,
  onChangeRow
}) => {
  const [tabValue, setTabValue] = useState(0)

  // حساب الـ Tabs المفعلة
  const activeTabs = useMemo(() => {
    const mainTab: TabConfig = {
      key: 'main',
      label: 'main_details',
      enabled: true,
      fields: fields
    }

    return [mainTab, ...tabs].filter(tab => {
      if (typeof tab.enabled === 'function') {
        return tab.enabled(row)
      }
      return tab.enabled !== false
    })
  }, [tabs, row, fields])

  const contextValue: DialogDetailsFormContextType = {
    row,
    rowIndex,
    fields,
    dictionary,
    errors,
    handleInputChange,
    tabs: activeTabs,
    mode
  }

  const renderTabContent = (tab: TabConfig, index: number) => {
    const commonProps: TabContentProps = {
      row,
      rowIndex,
      dictionary,
      errors,
      handleInputChange,
      mode,
      tabConfig: tab
    }

    // الـ Main Tab
    if (tab.key === 'main') {
      return (
        <>
          <ModalFieldsRenderer
            onChangeRow={onChangeRow}
            detailsKey={detailsKey}
            dataObject={dataObject}
            fields={tab.fields}
          />
          {showNotificationSettings && (
            <NotificationSettingsSection
              row={row}
              rowIndex={rowIndex}
              dictionary={dictionary}
              handleInputChange={handleInputChange}
            />
          )}
          {mainTabExtra}
        </>
      )
    }

    // لو فيه component مخصص
    if (tab.component) {
      const CustomComponent = tab.component
      return <CustomComponent {...commonProps} />
    }

    // لو فيه fields فقط
    if (tab.fields) {
      return <ModalFieldsRenderer detailsKey={detailsKey} dataObject={dataObject} fields={tab.fields} />
    }

    return null
  }

  return (
    <DialogDetailsFormProvider value={contextValue}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='xl'>
        <DialogTitle>{title || dictionary?.titles?.details || 'تفاصيل'}</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ width: '100%' }}>
            {activeTabs.length > 1 && (
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant='fullWidth'>
                {activeTabs.map(tab => (
                  <Tab key={tab.key} label={dictionary?.placeholders?.[tab.label] || tab.label} />
                ))}
              </Tabs>
            )}

            {activeTabs.map((tab, index) => (
              <TabPanel key={tab.key} value={tabValue} index={index}>
                {renderTabContent(tab, index)}
              </TabPanel>
            ))}
          </Box>
        </DialogContent>
        <div className='flex items-center'>
          <DialogActions className='flex flex-1'>
            {showDelete && deleteRow && mode !== 'show' && (
              <Button
                onClick={e => deleteRow(e, rowIndex, row?.pivot?.id || row?.id)}
                color='error'
                variant='outlined'
                startIcon={<i className='ri-delete-bin-7-line' />}
              >
                {dictionary?.actions?.delete || 'حذف'}
              </Button>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Button onClick={onClose} color='inherit'>
              {dictionary?.actions?.cancel || 'إلغاء'}
            </Button>

            {mode !== 'show' && (
              <Button onClick={onSave} color='primary' variant='contained'>
                {dictionary?.actions?.save || 'حفظ'}
              </Button>
            )}
          </DialogActions>
        </div>
      </Dialog>
    </DialogDetailsFormProvider>
  )
}
