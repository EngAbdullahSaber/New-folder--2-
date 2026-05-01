'use client'

import { useSettings } from '@/@core/hooks/useSettings'
/**
 * MahderDetails Component
 *
 * This component manages the creation, viewing, and editing of "Mahder" records.
 * It features a main form for general information and two detailed tables for
 * Associated Entities and Participants.
 */

import * as Shared from '@/shared'
import { isValidMobile } from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'
import Swal from 'sweetalert2'

// --- Types ---
interface AssociateRow {
  mahader_service_type_id: string | number | null
  service_type_name: string
  service_type: { name: string }
  entity_name: string
  entity_id: string | number
  rowChanged?: boolean
}

interface ParticipantRow {
  department_id: string | number | null
  department_name: string
  department: any
  name: string
  mobile: string
  rowChanged?: boolean
}

// --- Helpers ---

/**
 * Ensures mobile numbers have a leading zero if they are 9-digit Saudi numbers
 */
const fixMobileFormat = (m: any) => {
  if (!m) return m
  const s = String(m).trim()
  if (/^5\d{8}$/.test(s)) return `0${s}`
  return s
}

const pulseKeyframes = `
  @keyframes pulse-info {
    0% {
      box-shadow: 0 0 0 0 rgba(38, 198, 249, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(38, 198, 249, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(38, 198, 249, 0);
    }
  }
`

const MahderDetails = ({ scope }: ComponentGeneralProps) => {
  const { accessToken } = Shared.useSessionHandler()
  const { lang: locale } = Shared.useParams()
  const { settings } = useSettings()

  let theme = settings.mode == 'dark' ? 'dark' : 'light'

  // --- Main Form Field Definitions ---
  const fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      { name: 'id', label: 'id', modeCondition: (mode: Shared.Mode) => mode, gridSize: 3 },
      {
        name: 'season',
        label: 'season',
        type: 'select',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3,
        defaultValue: ''
      },
      {
        name: 'datetime',
        label: 'mahder_datetime',
        type: 'date_time',
        now: true,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },
      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.mahderStatusList,
        visibleModes: ['show', 'search'],
        requiredModes: ['add', 'edit'],
        defaultValue: '1',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },
      {
        name: 'department_id',
        label: 'department',
        type: 'select',
        apiUrl: '/def/seasonal-departments',
        labelProp: 'department_name_ar',
        viewProp: 'department.department_name_ar',
        visibleModes: ['show', 'search'],
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        keyProp: 'id',
        gridSize: 6
      },
      {
        name: 'category_id',
        label: 'category_id',
        type: 'select',
        apiUrl: '/haj/mahader-categories',
        labelProp: 'name',
        viewProp: 'category.name',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => (mode === 'add' || mode === 'search' ? mode : 'show'),
        keyProp: 'id',
        gridSize: 6,
        onChange: value => updateDescriptionAndAction(value.object)
      },
      {
        name: 'title',
        label: 'title',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },
      {
        name: 'description',
        label: 'description',
        type: 'rich_text',
        visibleModes: ['add', 'edit', 'show'],
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },
      {
        name: 'action_taken',
        label: 'action_taken',
        type: 'rich_text',
        visibleModes: ['add', 'edit', 'show'],
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit'],
        gridSize: 12
      }
    ],
    []
  )

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  // --- Form & Record Logic Hook ---
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    dataModel,
    openDocumentsDialog,
    closeDocumentsDialog,
    setDetailsData,
    detailsData,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    dictionary,
    setSuccess,
    setError
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/haj/mahaders',
    routerUrl: { default: `/apps/haj/mahder/${scope}` },
    fields,
    initialDetailsData: {
      mahader_associates: [],
      mahader_participants: []
    },
    detailsTablesConfig: {
      mahader_associates: {
        fields: [
          { name: 'entity_id', label: 'entity', type: 'text' },
          { name: 'entity_name', label: 'name', type: 'text' }
        ],
        trackIndex: true
      },
      mahader_participants: {
        fields: [
          { name: 'department_id', label: 'department', type: 'text' },
          { name: 'department_name', label: 'department', type: 'text' },
          { name: 'name', label: 'employee', type: 'text', required: true },
          { name: 'mobile', label: 'mobile', type: 'mobile', required: true }
        ],
        trackIndex: true
      }
    },
    customDetailValidators: {
      mahader_participants: (row: any) => {
        if (row.mobile && !isValidMobile(row.mobile)) {
          return {
            valid: false,
            errors: [
              {
                fieldName: 'mobile',
                message: locale === 'ar' ? 'رقم الجوال غير صحيح' : 'Invalid mobile number'
              }
            ]
          }
        }
        return { valid: true, errors: [] }
      }
    },
    transformPayload: (payload: any, detailsData: any) => {
      return {
        ...payload,
        mahader_associates: (detailsData['mahader_associates'] || []).filter((item: any) => !!item.entity_id),
        mahader_participants: (detailsData['mahader_participants'] || [])
          .filter((item: any) => !!item.name || !!item.mobile)
          .map((item: any) => ({
            ...item,
            mobile: item.mobile
          }))
      }
    },
    defaultSubmitParams: { forceSubmit: true }
  })

  const { setValue } = formMethods

  // --- Handlers ---

  /**
   * Updates form defaults based on selected category
   */
  const updateDescriptionAndAction = Shared.useCallback(
    async (obj: any) => {
      if (!obj) return

      setValue('action_taken', obj.default_action_taken ?? obj.defualt_action_taken ?? '')
      setValue('description', obj.default_statement ?? obj.defualt_statement ?? '')

      if (obj.id) {
        try {
          const { data } = await Shared.apiClient.get(`/haj/mahader-categories/${obj.id}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          const categoryData = data.data

          const newAssociates =
            categoryData.mahder_category_associates || categoryData.mahader_category_associates || []
          const newParticipants =
            categoryData.mahder_category_participants || categoryData.mahader_category_participants || []

          setDetailsData({
            mahader_associates: newAssociates.map(
              (item: any): AssociateRow => ({
                mahader_service_type_id: item.mahader_service_type_id ?? item.service_type?.id ?? item.id ?? null,
                service_type_name: item.name ?? item.service_type?.name ?? '',
                service_type: item.service_type || { name: item.name ?? '' },
                entity_name: '',
                entity_id: '',
                rowChanged: true
              })
            ),
            mahader_participants: newParticipants.map(
              (item: any): ParticipantRow => ({
                department_id: item.department_id ?? item.department?.id ?? null,
                department_name: item.department?.department_name_ar ?? '',
                department: item.department,
                name: '',
                mobile: '',
                rowChanged: true
              })
            )
          })
        } catch (error) {
          console.error('Error fetching category details', error)
        }
      }
    },
    [accessToken, setDetailsData, setValue]
  )

  /**
   * Handles resending a participant invite
   */
  const handleResendParticipant = Shared.useCallback(
    async (row: any) => {
      const result = await Swal.fire({
        title: locale === 'ar' ? 'هل أنت متأكد ؟' : 'Are you sure?',
        html:
          locale === 'ar'
            ? `<div style="font-size: 1.1rem; margin-top: 10px;">يرجي تأكيد إعادة الارسال الي (${row.name}) علي رقم (${row.mobile})</div>`
            : `<div style="font-size: 1.1rem; margin-top: 10px;">Please confirm resend to (${row.name}) on (${row.mobile})</div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: locale === 'ar' ? 'تأكيد' : 'Confirm',
        cancelButtonText: locale === 'ar' ? 'إلغاء' : 'Cancel',
        backdrop: true,
        allowOutsideClick: false,
        customClass: {
          container: 'swal-over-modal'
        },
        theme: theme as any
      })

      if (!result.isConfirmed) return

      try {
        Shared.emitEvent('loading', { type: 'create' })
        await Shared.apiClient.post(`/haj/mahaders/resend/${row.id}`, null, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': locale
          }
        })
        setSuccess(locale === 'ar' ? 'تمت إعادة الارسال بنجاح' : 'Resent successfully')
        Shared.scrollToTop()
      } catch (error: any) {
        setError(
          error?.response?.data?.message || (locale === 'ar' ? 'حدث خطأ أثناء إعادة الإرسال' : 'Error during resend')
        )
        Shared.scrollToTop()
      } finally {
        Shared.emitEvent('loading', { type: 'create' })
      }
    },
    [accessToken, locale, setError, setSuccess]
  )

  // --- Table Configuration ---

  const associatesColumns: Shared.GenericTableColumnConfig[] = Shared.useMemo(
    () => [
      {
        key: 'service_type_name',
        label: 'name',
        type: 'text',
        width: '50%',
        align: 'start',
        viewProp: 'service_type.name',
        ...(mode === 'edit' && { render: (row: any) => row.service_type?.name || row.service_type_name || '' })
      },
      {
        key: 'entity_id',
        label: 'entity',
        type: mode === 'show' ? 'text' : 'select',
        viewProp: 'entity_name',
        width: '50%',
        apiUrl: (row: any) => `/haj/mahader-service-types/${row.mahader_service_type_id}/list`,
        labelProp: 'name',
        keyProp: 'id',
        align: 'start',
        apiMethod: 'POST',
        searchInBackend: true,
        skipDataSuffix: true,
        onChange: (value: any, object?: any) => ({
          entity_id: value || '',
          entity_name: value ? object?.name || object?.label || '' : ''
        })
      }
    ],
    [mode]
  )

  const participantsColumns: Shared.GenericTableColumnConfig[] = Shared.useMemo(() => {
    const base: Shared.GenericTableColumnConfig[] = [
      {
        key: 'department_name',
        width: '45%',
        label: 'department',
        type: 'text',
        align: 'start',
        viewProp: 'department.department_name_ar'
      },
      {
        key: 'name',
        label: 'employee',
        type: mode === 'show' ? 'text' : 'input',
        width: '45%',
        align: 'start',
        placeholder: 'enter_name',
        viewProp: 'name'
      },
      {
        key: 'mobile',
        label: 'mobile',
        width: '30%',
        type: mode === 'show' ? 'text' : 'input',
        placeholder: 'enter_mobile',
        align: 'start',
        viewProp: 'mobile',
        error: (row: any) => !!row.mobile && !isValidMobile(row.mobile),
        errorMessage: (row: any) =>
          !!row.mobile && !isValidMobile(row.mobile)
            ? dictionary?.messages?.invalid_mobile ||
              (locale === 'ar' ? 'رقم الجوال غير صحيح' : 'Invalid mobile number')
            : ''
      }
    ]

    if (mode === 'show') {
      base.push(
        {
          key: 'status',
          label: 'status',
          width: '10%',
          type: 'badge',
          align: 'center',
          viewProp: 'status',
          list: Shared.mahderParticpantStatusList
        },
        {
          key: 'resend',
          label: 'resend',
          width: '10%',
          align: 'center',
          render: (row: any) =>
            row.status !== 4 && (
              <Shared.CustomIconBtn
                title={dictionary?.actions?.resend || 'resend'}
                onClick={e => {
                  e.stopPropagation()
                  handleResendParticipant(row)
                }}
                color='info'
              >
                <i className='ri-send-plane-line' />
              </Shared.CustomIconBtn>
            )
        }
      )
    }

    return base
  }, [mode, dictionary, locale, handleResendParticipant])

  // --- Table Row Handlers ---

  const createTableHandlers = (key: string) => ({
    onToggleAll: () => {},
    onToggleRow: () => {},
    onUpdateRow: (index: number, data: any) => {
      setDetailsData(prev => {
        const updated = [...(prev[key] || [])]
        if (updated[index]) {
          const cleanData = { ...data }
          delete cleanData.selected
          updated[index] = { ...updated[index], ...cleanData }
        }
        return { ...prev, [key]: updated }
      })
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const associatesHandlers = Shared.useMemo(
    () => createTableHandlers('mahader_associates'),
    [detailsData.mahader_associates]
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const participantsHandlers = Shared.useMemo(
    () => createTableHandlers('mahader_participants'),
    [detailsData.mahader_participants]
  )

  // --- Render ---

  if (!dictionary) return <Shared.LoadingSpinner type='skeleton' />

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        {/* Page Header */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title='mahader'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
          />
        </Shared.Grid>

        {/* Main Information Form Card */}
        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields.map(field => ({ ...field, disabled: mode === 'show' }))}
            mode={mode}
            screenMode={mode}
          />
        </Shared.Grid>

        {/* Documents Button */}
        {(mode == 'edit' || mode == 'show') && (
          <Shared.Grid size={{ xs: 12 }} sx={{ mt: 6, mb: 1 }}>
            <Shared.Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <style>{pulseKeyframes}</style>
              <Shared.Button
                color='info'
                startIcon={<i className='ri-file-text-line' />}
                onClick={() => handleMenuOptionClick('documents')}
                sx={{
                  px: 10,
                  py: 2.5,
                  borderRadius: '12px',
                  fontWeight: 600,
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
                {dictionary?.actions?.documents || (locale === 'ar' ? 'الوثائق' : 'Documents')}
              </Shared.Button>
            </Shared.Box>
          </Shared.Grid>
        )}

        {/* Associated Entities Table Card */}
        {mode !== 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.GenericSelectionTable
              data={detailsData['mahader_associates'] || []}
              columns={associatesColumns}
              {...associatesHandlers}
              dictionary={dictionary}
              locale={locale as string}
              mode={mode}
              title='mahader_associates'
              headerIcon='ri-links-line'
              iconColor='info'
              hideCheckbox
            />
          </Shared.Grid>
        )}

        {/* Participants Table Card */}
        {mode !== 'search' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.GenericSelectionTable
              data={detailsData['mahader_participants'] || []}
              columns={participantsColumns}
              {...participantsHandlers}
              dictionary={dictionary}
              locale={locale as string}
              mode={mode}
              title='mahader_participants'
              headerIcon='ri-group-line'
              iconColor='warning'
              hideCheckbox
            />
          </Shared.Grid>
        )}

        {/* Footer Actions */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>

        {/* Dialogs */}
        <Shared.FileUploadWithTabs
          open={openDocumentsDialog}
          onClose={closeDocumentsDialog}
          locale={locale}
          attachments={dataModel.attachments}
          recordId={dataModel.id}
        />
        <Shared.RecordInformation
          open={openRecordInformationDialog}
          onClose={closeRecordInformationDialog}
          locale={locale}
          dataModel={dataModel}
        />
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default MahderDetails
