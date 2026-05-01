'use client'

import React, { useEffect, useState } from 'react'
import * as Shared from '@/shared'
import { useWarningApi } from '@/contexts/warningApiProvider'
import { getDictionary } from '@/utils/getDictionary'
import { useDeliverStaffUniform } from '../hooks/deliver-staff-uniform-details'
import { useDeliverAccessControl } from '../hooks/useDeliverAccessControlAccessControl'

interface DeliverStaffUniformDetailsProps {}

const DeliverStaffUniformDetails = ({}: DeliverStaffUniformDetailsProps) => {
  const {
    formMethods,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale,
    fields,
    statusFields,
    statusFieldsShow,
    handleSignContract,
    handleRejectContract,
    notes,
    setNotes,
    onSubmit,
    printFields,
    searchFields,
    statusSearchFields,
    dataModel,
    nominationInfoFields,
    setError,
    setWarning,
    closeRecordInformationDialog,
    openRecordInformationDialog
  } = useDeliverStaffUniform()

  const { warning } = useWarningApi()
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Shared.Locale).then((res: any) => setDictionary(res))
  }, [locale])

  const { shouldBlockAccess, isLocked, currentMessage } = useDeliverAccessControl(
    dataModel,
    'user',
    setError,
    setWarning
  )
  if (shouldBlockAccess) {
    return (
      <Shared.Card sx={{ my: 4 }}>
        <Shared.CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 20,
            textAlign: 'center',
            minHeight: '400px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Shared.Box
            sx={{
              mb: 6,
              width: 100,
              height: 100,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'warning.lighter',
              color: 'warning.main',
              fontSize: '3.5rem',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'warning.main',
                animation: 'ripple 1.5s infinite ease-out',
                opacity: 0
              },
              '@keyframes ripple': {
                '0%': { transform: 'scale(1)', opacity: 0.5 },
                '100%': { transform: 'scale(1.5)', opacity: 0 }
              }
            }}
          >
            <i className='ri-shield-keyhole-line' />
          </Shared.Box>

          <Shared.Typography
            variant='body1'
            sx={{
              color: 'text.secondary',
              maxWidth: 500,
              mx: 'auto',
              mb: 8,
              lineHeight: 1.6
            }}
          >
            {currentMessage || dictionary?.messages?.access_denied || 'Access denied'}
          </Shared.Typography>
        </Shared.CardContent>
      </Shared.Card>
    )
  }
 
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={4}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'deliver_staff_uniform'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
            canSearch={true}
            canPrint={true}
          />
        </Shared.Grid>

        {/* Print Preview */}
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'personal_info' }}
            fields={printFields || []}
            mode='show'
            screenMode='show'
          />
        </Shared.Grid>

        {/* Search Mode Section */}
        {mode === 'search' && (
          <>
            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={searchFields}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'personal_info' }}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormComponent
                locale={locale}
                fields={statusSearchFields}
                mode={mode}
                screenMode={mode}
                headerConfig={{ title: 'deliver_type' }}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }}>
              <Shared.FormActions onSaveSuccess={onSubmit} onCancel={handleCancel} mode={mode} locale={locale} />
            </Shared.Grid>
          </>
        )}

        {/* Form Sections */}
        {mode !== 'search' && (
          <>
            <Shared.Grid size={{ xs: 12 }} className='system-view'>
              <Shared.Grid container spacing={4}>
                {fields && (
                  <Shared.Grid size={{ xs: 12 }}>
                    <Shared.FormComponent
                      locale={locale}
                      headerConfig={{ title: 'personal_info' }}
                      fields={fields}
                      mode={mode}
                      screenMode={mode}
                    />
                  </Shared.Grid>
                )}
                {nominationInfoFields && (
                  <Shared.Grid size={{ xs: 12 }}>
                    <Shared.FormComponent
                      locale={locale}
                      headerConfig={{ title: 'job_information' }}
                      fields={nominationInfoFields}
                      mode={mode}
                      screenMode={mode}
                    />
                  </Shared.Grid>
                )}
                {(statusFields && mode !== 'show') && (
                  <Shared.Grid size={{ xs: 12 }}>
                    <Shared.FormComponent
                      locale={locale}
                      headerConfig={{ title: 'deliver_type' }}
                      fields={statusFields}
                      mode={mode}
                      screenMode={mode}
                    />
                  </Shared.Grid>
                )}
              {  mode === 'show'  && (
                  <Shared.Grid size={{ xs: 12 }}>
                    <Shared.FormComponent
                      locale={locale}
                      headerConfig={{ title: 'deliver_type' }}
                      fields={statusFieldsShow}
                      mode={mode}
                      screenMode={mode}
                    />
                  </Shared.Grid>
                )}
              </Shared.Grid>
            </Shared.Grid>

            {(mode === 'add' || mode === 'edit') && (
             <Shared.Grid
              size={{ xs: 12 }}
              sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}
              className='system-view'
            >
              <Shared.Grid container spacing={4}>
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={locale === 'ar' ? 'ملاحظات' : 'Notes'}
                  placeholder={locale === 'ar' ? 'أدخل ملاحظاتك هنا...' : 'Enter your notes here...'}
                  value={notes}
                  disabled={isLocked}
                  onChange={e => setNotes(e.target.value)}
                />
              </Shared.Grid>
               

                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.RecordInformation
                    open={openRecordInformationDialog}
                    onClose={() => closeRecordInformationDialog()}
                    locale={locale}
                    dataModel={dataModel}
                  />
                </Shared.Grid>

                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormActions
                    mode={mode}
                     onSaveSuccess={handleSignContract}
                    saveLabelKey='deliver'
                    editLabelKey='deliver'
                    cancelLabelKey='cancel'
                    locale={locale}
                    disabled={isLocked}
                  />
                </Shared.Grid>
              </Shared.Grid>
            </Shared.Grid>
            )}
          </>
        )}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default DeliverStaffUniformDetails
