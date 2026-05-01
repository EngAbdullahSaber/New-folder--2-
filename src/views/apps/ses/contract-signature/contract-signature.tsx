'use client'

import React, { useMemo, useEffect, useState, useCallback } from 'react'
import * as Shared from '@/shared'
import { useWarningApi } from '@/contexts/warningApiProvider'
import { getDictionary } from '@/utils/getDictionary'
import { useContractSignature } from './hooks/useContractSignature'
import { useContractSignatureAccessControl } from './hooks/useContractSignatureAccessControl'

// ==================== Component ====================

interface ContractSignatureProps {
  initialData?: any
  onSuccess?: () => void
}

const ContractSignature = ({ initialData, onSuccess }: ContractSignatureProps) => {
  const {
    formMethods,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale,
    onSubmit,
    detailsData,
    setDetailsData,
    getDetailsErrors,
    setError,

    contractConditionFields,
    fields,
    nominationInfoFields,
    handleSignContract,
    handleRejectContract,
    notes,
    setNotes,
    setWarning,
    dataModel,
    printFields
  } = useContractSignature()
  const { warning } = useWarningApi()

  const { shouldBlockAccess, isLocked, currentMessage } = useContractSignatureAccessControl(
    dataModel,
    'user',
    (setError as any) || (() => {}),
    (setWarning as any) || (() => {})
  )

  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Shared.Locale).then((res: any) => setDictionary(res))
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
            {currentMessage ||
              dictionary?.messages?.access_contract_signature_denied ||
              'Access contract signature denied'}
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
            title={'contract_signature'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            headerConfig={{ title: 'personal_info' }}
            fields={printFields || []}
            mode='show'
            screenMode='show'
          />
        </Shared.Grid>

        {/* User Sections */}
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
          </Shared.Grid>
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='system-view'>
          <Shared.DynamicFormTable
            fields={contractConditionFields as any}
            initialData={detailsData.contract_conditions}
            onDataChange={data => setDetailsData((prev: any) => ({ ...prev, contract_conditions: data }))}
            locale={locale}
            title='contract_conditions'
            mode={'show'}
            errors={getDetailsErrors?.('contract_conditions')}
          />
        </Shared.Grid>

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
                label={(locale === 'ar' ? 'ملاحظات' : 'Notes') + ' *'}
                placeholder={locale === 'ar' ? 'أدخل ملاحظاتك هنا...' : 'Enter your notes here...'}
                value={notes}
                disabled={isLocked}
                onChange={e => setNotes(e.target.value)}
              />
            </Shared.Grid>

            <Shared.Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Shared.Button
                variant='outlined'
                color='error'
                disabled={isLocked}
                onClick={handleRejectContract}
                startIcon={<i className='ri-close-circle-line' />}
              >
                {dictionary?.actions?.reject_signature || (locale === 'ar' ? 'رفض التوقيع' : 'Reject Signing')}
              </Shared.Button>
              <Shared.Button
                variant='contained'
                color='primary'
                disabled={isLocked}
                onClick={handleSignContract}
                startIcon={<i className='ri-edit-2-line' />}
              >
                {dictionary?.actions?.sign_contract || (locale === 'ar' ? 'توقيع العقد' : 'Sign Contract')}
              </Shared.Button>
            </Shared.Grid>
          </Shared.Grid>
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default ContractSignature
