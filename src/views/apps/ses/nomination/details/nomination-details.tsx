'use client'

import { useState } from 'react'
import GenericInfoDialog from '@/components/shared/GenericInfoDialog'
import * as Shared from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'
import { useNominationForm } from '../hooks/useNominationForm'
import { useDialog } from '@/contexts/dialogContext'
import { getDictionary } from '@/utils/getDictionary'
import { validateDatesInPeriod } from '@/shared'
import { set } from 'lodash'

const NominationDetails = ({ scope }: ComponentGeneralProps) => {
  const {
    selectedDepartment,
    setSelectedDepartment,
    approvedJobs,
    setApprovedJobs,
    user,
    accessToken,
    departmentOptions,
    personal,
    status,
    fields,
    budgetFields,
    nominatingPersonsFields,
    formMethods,
    recordId,
    mode,
    handleMenuOptionClick,
    handleCancel,
    locale,
    updateDetailsData,
    dataModel,
    detailsData,
    detailsHandlers,
    getDetailsErrors,
    closeDocumentsDialog,
    openDocumentsDialog,
    onSubmit,
    centerClassification,
    setError,
    searchFields,
    statusFields,
    clearDetailErrors,
    validateDetailRow,
    validateAllDetailTables,
    submitWithParams,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    appSetting
  } = useNominationForm(scope)

  const { openDialog } = useDialog()
  const [dictionary, setDictionary] = useState<any>(null)
  const [componentValid, setComponentValid] = useState<any>(null)
  console.log('appSettings', appSetting)
  Shared.useEffect(() => {
    getDictionary(locale as Shared.Locale).then(res => setDictionary(res))
  }, [locale])

  // Animation for the info button
  const pulseKeyframes = `
    @keyframes pulse-info {
      0% { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0.4); transform: scale(1); }
      50% { box-shadow: 0 0 0 10px rgba(38, 198, 249, 0); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0); transform: scale(1); }
    }
  `
  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={`nomination_season_employees`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={[...fields, ...budgetFields]}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              { key: 'nominating_users', fields: nominatingPersonsFields, title: 'nominating_users' }
              // { key: 'extraFields', fields: dynamicExtraFields, title: 'extra_information' }
            ]}
          />
        </Shared.Grid>
        {mode !== 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
            <Shared.Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <style>{pulseKeyframes}</style>
              <Shared.Button
                color='info'
                startIcon={<i className='ri-information-line' />}
                onClick={() =>
                  openDialog(GenericInfoDialog, {
                    sections: [
                      {
                        title: dictionary?.titles?.budget || 'الميزانية',
                        icon: 'ri-money-dollar-circle-line',
                        type: 'fields',
                        fields: budgetFields
                      },
                      {
                        title: dictionary?.titles?.approved_jobs || 'الوظائف المعتمدة',
                        icon: 'ri-briefcase-line',
                        type: 'items',
                        items: approvedJobs,
                        renderItem: (row: any) => (
                          <Shared.Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, height: '100%' }}>
                            <Shared.Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 2
                              }}
                            >
                              <Shared.Typography
                                variant='subtitle1'
                                sx={{
                                  fontWeight: 700,
                                  color: 'text.primary',
                                  lineHeight: 1.4,
                                  flexGrow: 1
                                }}
                              >
                                {row.name}
                              </Shared.Typography>
                              <Shared.Chip
                                label={`${row.employees} ${dictionary?.labels?.employees || 'موظف'}`}
                                size='small'
                                color='primary'
                                variant='tonal'
                                sx={{ fontWeight: 600, flexShrink: 0 }}
                              />
                            </Shared.Box>

                            <Shared.Divider sx={{ borderStyle: 'dashed', my: 0.5, borderColor: 'divider' }} />

                            <Shared.Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                p: 1.5,
                                borderRadius: '10px',
                                transition: 'background-color 0.2s ease',
                                backgroundColor: theme =>
                                  theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.02)',
                                '&:hover': {
                                  backgroundColor: theme =>
                                    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.04)'
                                }
                              }}
                            >
                              <Shared.Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 36,
                                  height: 36,
                                  borderRadius: '8px',
                                  backgroundColor: theme =>
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(38, 198, 249, 0.1)'
                                      : 'rgba(38, 198, 249, 0.12)',
                                  color: 'info.main',
                                  border: theme =>
                                    theme.palette.mode === 'dark' ? '1px solid rgba(38, 198, 249, 0.2)' : 'none',
                                  boxShadow: theme =>
                                    theme.palette.mode === 'dark' ? 'none' : '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                              >
                                <i className='ri-calendar-line' style={{ fontSize: '1.3rem' }} />
                              </Shared.Box>
                              <Shared.Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Shared.Typography
                                  variant='caption'
                                  sx={{
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    mb: 0.2,
                                    opacity: 0.8
                                  }}
                                >
                                  {dictionary?.labels?.work_period || 'مدة العمل'}
                                </Shared.Typography>
                                <Shared.Typography
                                  variant='body2'
                                  sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.95rem' }}
                                >
                                  {row.days} {dictionary?.labels?.days || 'يوم عمل'}
                                </Shared.Typography>
                              </Shared.Box>
                            </Shared.Box>
                          </Shared.Box>
                        )
                      }
                    ],
                    locale,
                    dictionary,
                    formMethods
                  })
                }
                sx={{
                  px: 6,
                  py: 2.5,
                  borderRadius: '12px',
                  fontWeight: 300,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  background: theme =>
                    `linear-gradient(135deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}05 100%)`,
                  border: theme => `1px solid ${theme.palette.info.main}30`,
                  animation: 'pulse-info 2.5s infinite ease-in-out',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: theme => `${theme.palette.info.main}25`,
                    borderColor: 'info.main',
                    transform: 'translateY(-2px)',
                    boxShadow: theme => `0 6px 20px -5px ${theme.palette.info.main}40`
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                {dictionary?.titles?.budget_details || 'عرض الميزانية والوظائف المعتمدة'}
              </Shared.Button>
            </Shared.Box>
          </Shared.Grid>
        )}

        {recordId && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              locale={locale}
              fields={nominatingPersonsFields}
              mode={mode}
              screenMode={mode}
              headerConfig={{ title: 'nominating_users' }}
            />
          </Shared.Grid>
        )}
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

        <Shared.Grid size={{ xs: 12 }}>
          {mode === 'add' && (
            <Shared.Grid size={{ xs: 12 }}>
              <Shared.DynamicFormTable
                title='employees'
                onChangeRow={(row, rowIndex, object = {}) => {
                  // Take daily_rate from object if it exists
                  const daily_salary = object['daily_rate'] ?? row['daily_salary']
                  const isCompanyNominated = scope === 'department' ? 2 : 1

                  const updatedRow = {
                    ...row,
                    daily_salary,
                    department_id: selectedDepartment,
                    is_company_nominated: isCompanyNominated
                  }

                  const { start_date, end_date } = updatedRow

                  // ✅ OPTION 1: Remove validation completely (let validateAllDetailTables handle it)
                  // Just update the row
                  updateDetailsData('nominating_users', updatedRow, rowIndex)

                  // Recalculate workdays & salary if dates and daily_salary are valid
                  if (start_date && end_date && daily_salary !== undefined) {
                    const recalculated = Shared.calculateWorkAndSalary(updatedRow)
                    updateDetailsData(
                      'nominating_users',
                      {
                        ...updatedRow,
                        ...recalculated,
                        department_id: selectedDepartment,
                        is_company_nominated: isCompanyNominated
                      },
                      rowIndex
                    )
                  }
                }}
                fields={nominatingPersonsFields}
                initialData={detailsData['nominating_users']}
                onDataChange={detailsHandlers?.nominating_users}
                mode={mode}
                errors={getDetailsErrors('nominating_users')}
                apiEndPoint={`/ses/nominations/${scope}`}
                detailsKey='nominating_users'
                locale={locale}
                dataObject={dataModel}
              />
            </Shared.Grid>
          )}

          {/* {dynamicExtraFields && dynamicExtraFields.length > 0 && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FormComponent
              headerConfig={{ title: 'extra_information' }}
              locale={locale}
              fields={dynamicExtraFields}
              mode={mode}
              screenMode={mode}
            />
          </Shared.Grid>
        )} */}

          <Shared.Grid size={{ xs: 12 }}>
            <Shared.FileUploadWithTabs
              open={openDocumentsDialog}
              onClose={() => closeDocumentsDialog()}
              locale={locale}
              attachments={dataModel.attachments}
              recordId={dataModel.id}
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
              locale={locale}
              mode={mode}
              onCancel={handleCancel}
              onSaveSuccess={data => {
                // submitWithParams({ sendFullData: true })
                onSubmit(data)
              }}
            />
          </Shared.Grid>
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default NominationDetails
