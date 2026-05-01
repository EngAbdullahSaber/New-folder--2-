'use client'

import { useState } from 'react'
import * as Shared from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'
import { getDictionary } from '@/utils/getDictionary'
import { useDocumentVerificationApprovalForm } from '../hooks/useDocumentVerificationApprovalForm'
import { useNominationApprovalAccessControl } from '../hooks/useNominationApprovalAccessControl'
import { usePrintMode } from '@/contexts/usePrintModeContext'

const DocumentVerificationApprovalDetails = ({ scope }: ComponentGeneralProps) => {
  const {
    formMethods,
    mode,
    handleMenuOptionClick,
    handleCancel,
    onSubmit,
    locale,
    statusFields,
    handleAcceptNomination,
    handleRejectNomination,
    handleReturnNomination,
    userPersonalFields,
    userAddressFields,
    userProfessionalFields,
    userBankFields,
    nominationInfoFields,
    searchFields,
    dataModel,
    setError,
    handleEmpProcess,
    notes,
    setNotes,
    setWarning,
    printFields,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = useDocumentVerificationApprovalForm(scope)

  const { isPrintMode } = usePrintMode()

  const [dictionary, setDictionary] = useState<any>(null)
  const { shouldBlockAccess, isLocked, currentMessage } = useNominationApprovalAccessControl(
    dataModel,
    scope,
    setError,
    setWarning
  )

  Shared.useEffect(() => {
    getDictionary(locale as Shared.Locale).then(res => setDictionary(res))
  }, [locale])

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
            {currentMessage}
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
            title={scope === 'user' ? 'nomination_details' : 'nomination_verification_approval'}
            mode={isLocked ? 'show' : mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
            showOnlyOptions={['delete', 'search', 'print']}
            canEdit={scope === 'user' && !isLocked}
            canSearch={true}
            canPrint={true}
          />
        </Shared.Grid>

        {/* Print View Section - single FormComponent, all data in one block */}
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'personal_info' }}
            fields={printFields}
            mode='show'
            screenMode='show'
          />
        </Shared.Grid>

        {/* Search Mode Section */}
        {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={searchFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'personal_info' }}
            />
          </Shared.Grid>
        )}
        {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={statusFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'status' }}
            />
          </Shared.Grid>
        )}
        {mode === 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormActions onSaveSuccess={onSubmit} onCancel={handleCancel} mode={mode} locale={locale} />
          </Shared.Grid>
        )}
        {/* User Scope: Divided Sections */}
        {mode !== 'search' && scope === 'user' && (
          <Shared.Grid size={{ xs: 12 }} className='system-view'>
            <Shared.Grid container spacing={4}>
              {/* Personal Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'personal_info' }}
                  fields={userPersonalFields}
                  mode={isLocked ? 'show' : mode}
                  screenMode={isLocked ? 'show' : mode}
                />
              </Shared.Grid>

              {/* Address Information */}
              {/* <Shared.Grid size={{ xs: 8 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'address_info' }}
                  fields={userAddressFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>


              <Shared.Grid size={{ xs: 4 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'professional_info' }}
                  fields={userProfessionalFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid> */}

              {/* Bank Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'bank_info' }}
                  fields={userBankFields}
                  mode={isLocked ? 'show' : mode}
                  screenMode={isLocked ? 'show' : mode}
                />
              </Shared.Grid>

              {/* Nomination Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'elected_info' }}
                  fields={nominationInfoFields}
                  mode={isLocked ? 'show' : mode}
                  screenMode={isLocked ? 'show' : mode}
                />
              </Shared.Grid>

              {/* Notes Field */}
              <Shared.Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
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

              {/* Save Actions */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormActions
                  onSaveSuccess={() => {
                    console.log('indezzzz')
                    handleEmpProcess(1)
                  }}
                  onCancel={() => handleEmpProcess(2)}
                  mode={isLocked ? 'show' : mode}
                  editLabelKey='approve'
                  saveLabelKey='approve'
                  cancelLabelKey='reject'
                  locale={locale}
                  canEdit={scope === 'user' && !isLocked}
                  canAdd={scope === 'user' && !isLocked}
                  canSearch={scope === 'user'}
                />
              </Shared.Grid>
            </Shared.Grid>
          </Shared.Grid>
        )}
        {/* Department/HR Scope: Review Requests */}
        {mode !== 'search' && (scope === 'department' || scope === 'hr') && (
          <Shared.Grid size={{ xs: 12 }} className='system-view'>
            <Shared.Grid container spacing={4}>
              {/* Personal Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'personal_info' }}
                  fields={userPersonalFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>

              {/* Address Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'address_info' }}
                  fields={userAddressFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>

              {/* Professional Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'professional_info' }}
                  fields={userProfessionalFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>

              {/* Bank Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'bank_info' }}
                  fields={userBankFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>

              {/* Nomination Information */}
              <Shared.Grid size={{ xs: 12 }}>
                <Shared.FormComponent
                  locale={locale}
                  headerConfig={{ title: 'employment_information' }}
                  fields={nominationInfoFields}
                  mode={mode}
                  screenMode={mode}
                />
              </Shared.Grid>

              {/* Approval actions handled below at the end of the container */}
            </Shared.Grid>
          </Shared.Grid>
        )}

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.RecordInformation
            open={openRecordInformationDialog}
            onClose={() => closeRecordInformationDialog()}
            locale={locale}
            dataModel={dataModel}
          />
        </Shared.Grid>

        {mode !== 'show' && mode !== 'search' && (scope === 'department' || scope === 'hr') && (
          <>
            {/* Notes Field */}
            <Shared.Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
              <Shared.TextField
                fullWidth
                multiline
                rows={3}
                label={locale === 'ar' ? 'ملاحظات' : 'Notes'}
                placeholder={locale === 'ar' ? 'أدخل ملاحظاتك هنا...' : 'Enter your notes here...'}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'space-between' }}>
              <Shared.Grid sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Shared.Button
                  variant='outlined'
                  color='error'
                  onClick={handleCancel}
                  startIcon={<i className='ri-close-line' />}
                >
                  {dictionary?.actions?.cancel || 'إلغاء'}
                </Shared.Button>
              </Shared.Grid>
              <Shared.Grid sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Shared.Button
                  variant='contained'
                  color='error'
                  onClick={() => handleRejectNomination(scope)}
                  startIcon={<i className='ri-close-circle-line' />}
                >
                  {scope === 'hr' ? dictionary?.actions?.rejectHR : dictionary?.actions?.rejectVerification || 'رفض'}
                </Shared.Button>
                <Shared.Button
                  variant='contained'
                  color='warning'
                  onClick={() => handleReturnNomination(scope)}
                  startIcon={<i className='ri-arrow-go-back-line' />}
                >
                  {scope === 'hr' ? dictionary?.actions?.returnHR : dictionary?.actions?.return || 'بحاجة إلى الإرجاع'}
                </Shared.Button>
                <Shared.Button
                  variant='contained'
                  onClick={() => handleAcceptNomination(scope)}
                  startIcon={<i className='ri-check-line' />}
                >
                  {scope === 'hr'
                    ? dictionary?.actions?.approveHR
                    : dictionary?.actions?.approveVerification || 'اعتماد'}
                </Shared.Button>
              </Shared.Grid>
            </Shared.Grid>
          </>
        )}
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default DocumentVerificationApprovalDetails
