// app/[lang]/(dashboard)/apps/haj/receptions/details/page.tsx
'use client'

import * as Shared from '@/shared'
import { ComponentGeneralReceptionProps } from '@/types/pageModeType'
import { useReceptionFields } from './hooks/useReceptionFields'
import { useAppSettings } from '../../hooks/useAppSettings'

const ReceptionDetails = ({ scope }: ComponentGeneralReceptionProps) => {
  const { isPrintMode } = Shared.usePrintMode()
  const { shouldBlockAccess, AccessBlockedScreen, dictionary, locale } = Shared.useCityAccess()
  const { user, accessToken } = Shared.useSessionHandler()

  // ─── Reactive state for cascading field dependencies ───────────────────────
  const [selectedReceptionType, setSelectedReceptionType] = Shared.useState<any>(undefined)
  const [selectedCityId, setSelectedCityId] = Shared.useState<any>(undefined)
  const [selectedPortId, setSelectedPortId] = Shared.useState<any>(undefined)
  const [selectedPortCityId, setSelectedPortCityId] = Shared.useState<any>(undefined)
  const [selectedPortCode, setSelectedPortCode] = Shared.useState<any>(undefined)
  const [selectedLandTranId, setSelectedLandTranId] = Shared.useState<any>(undefined)
  const [selectedIsTransportationCenter, setSelectedIsTransportationCenter] = Shared.useState<any>(undefined)

  // ─── Build field definitions via the dedicated fields hook ─────────────────
  const fields = useReceptionFields({
    selectedReceptionType,
    selectedCityId,
    appSetting: undefined, // replaced by appSettings below after form init
    user,
    locale: locale as string,
    selectedPortId,
    selectedPortCityId,
    selectedPortCode,
    selectedLandTranId,
    selectedIsTransportationCenter,
    mode: 'add', // placeholder; real mode comes from useRecordForm,
    setValue: () => { },
    setSelectedCityId,
    setSelectedPortId,
    setSelectedPortCode,
    setSelectedPortCityId,
    setSelectedLandTranId,
    scope: scope
  })

  const {
    autoReceptionFields,
    tab1Fields: _tab1Fields,
    tab2Fields: _tab2Fields,
    tab3Fields: _tab3Fields,
    tab4Fields: _tab4Fields,
    systemFields,
    receptionDetailsFields,
    allFields
  } = fields

  type ReceptionFormData = Shared.InferFieldType<typeof allFields>

  // Separate reusable validator
  const validateReceptionDetailsRow = (row: any, rowIndex: number, allRows: any[] = []) => {
    const errors: { fieldName: string; message: string }[] = []

    const requiredFields = [
      { fieldName: 'nation_id', message: 'حقل الجنسية مطلوب' },
      { fieldName: 'contract_id', message: 'حقل العقد مطلوب' },
      { fieldName: 'hajj_count', message: 'حقل عدد الحجاج مطلوب' },
      { fieldName: 'passport_count', message: 'حقل عدد الجوازات مطلوب' },
      { fieldName: 'copy_passport_count', message: 'حقل عدد نسخ الجوازات مطلوب' },
      { fieldName: 'hajj_wo_passport_count', message: 'حقل حجاج بدون جواز مطلوب' },
      { fieldName: 'passport_wo_hajj_count', message: 'حقل جوازات بدون حج مطلوب' }
    ]

    // Check if user entered at least one value in row
    const hasAnyValue = requiredFields.some(field => {
      const value = row[field.fieldName]
      return value !== undefined && value !== null && value !== ''
    })

    // If row started, all fields become required
    if (hasAnyValue) {
      requiredFields.forEach(field => {
        const value = row[field.fieldName]

        if (value === undefined || value === null || value === '') {
          errors.push({
            fieldName: field.fieldName,
            message: field.message
          })
        }
      })
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // ─── Core form hook ────────────────────────────────────────────────────────
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale: formLocale,
    dataModel,
    openDocumentsDialog,
    closeDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    getDetailsErrors,
    detailsData,
    detailsHandlers,
    setDetailsData,
    setWarning
  } = Shared.useRecordForm<ReceptionFormData>({
    apiEndpoint: '/haj/receptions',
    routerUrl: { default: `/apps/haj/reception/${scope}` },
    fields: allFields,
    initialDetailsData: {
      reception_details: []
    },
    detailsTablesConfig: {
      reception_details: { fields: receptionDetailsFields, trackIndex: true }
    },
    customDetailValidators: {
      reception_details: (row: any, rowIndex: number) => {
        const errors: any = []

        const requiredFields = [
          { fieldName: 'nation_id', message: 'حقل الجنسية مطلوب' },
          { fieldName: 'contract_id', message: 'حقل العقد مطلوب' },
          { fieldName: 'hajj_count', message: 'حقل عدد الحجاج مطلوب' },
          { fieldName: 'passport_count', message: 'حقل عدد الجوازات مطلوب' }
          // { fieldName: 'copy_passport_count', message: 'حقل عدد نسخ الجوازات مطلوب' },
          // { fieldName: 'hajj_wo_passport_count', message: 'حقل حجاج بدون جواز مطلوب' },
          // { fieldName: 'passport_wo_hajj_count', message: 'حقل جوازات بدون حج مطلوب' }
        ]

        const hasAnyValue = requiredFields.some(field => {
          const value = row[field.fieldName]
          return value !== undefined && value !== null && value !== ''
        })

        if (hasAnyValue) {
          requiredFields.forEach(field => {
            const value = row[field.fieldName]

            if (value === undefined || value === null || value === '') {
              errors.push({
                fieldName: field.fieldName,
                message: field.message
              })
            }
          })
        }

        return {
          valid: errors.length === 0,
          errors
        }
      }
    },
    transformPayload: (payload: any, detailsData: any) => {
      return {
        ...payload,
        flight_id: payload.flight_id ? String(payload.flight_id) : undefined,
        reception_details: (detailsData.reception_details || []).filter(
          (row: any) => row && Object.keys(row).length > 0
        )
      }
    }
  })

  const { setValue, watch, getValues } = formMethods
  const currentLocale = ((formLocale ?? locale) as string) || 'ar'

  // ─── "Get Info" handler ────────────────────────────────────────────────────
  const [isFetchingInfo, setIsFetchingInfo] = Shared.useState(false)

  const handleGetInfo = Shared.useCallback(async () => {
    setWarning('')

    const formValues = getValues() as any
    const receptionType = formValues['reception_type']
    const manifestId = formValues['manifest_id']
    const tdmId = formValues['tdm_id']

    if (receptionType === '1' && !manifestId) {
      setWarning('رقم المنافيست مطلوب')
      return
    }

    if (receptionType === '2' && !tdmId) {
      setWarning('رقم كشف التنقل بين المدن مطلوب')
      return
    }
    setIsFetchingInfo(true)
    try {
      const { data } = await Shared.apiClient.post(
        '/haj/receptions/reception-by-type/data',
        {
          reception_type: receptionType ? Number(receptionType) : undefined,
          ...(receptionType === '1' && manifestId ? { manifest_id: Number(manifestId) } : {}),
          ...(receptionType === '2' && tdmId ? { tdm_id: Number(tdmId) } : {}),
          is_granted: true
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': currentLocale ?? 'ar'
          }
        }
      )

      const info = data?.data ?? data
      if (!info) {
        setWarning('يرجي التأكد من رقم الكشف')
        return
      }

      // ─── Helper: only set if value is not null/undefined ──────────────────
      const setIfPresent = (field: string, value: any) => {
        if (value !== undefined && value !== null) setValue(field as any, value)
      }

      // Tab 1 — reception information
      setIfPresent('season', info.season)
      setIfPresent('reception_no', info.reception_no)
      setIfPresent('reception_date', info.reception_date)
      setIfPresent('reception_city_id', info.reception_city_id)
      // setIfPresent('reception_department_id', info.reception_department_id)
      // setIfPresent('service_department_id', info.service_department_id)
      setIfPresent('guiding_m_id', info.guiding_m_id)
      setIfPresent('spc_business_id', info.spc_business_id)
      setIfPresent('auto_process_type', info.auto_process_type != null ? String(info.auto_process_type) : null)

      // Tab 2 — arrival details (type 1)
      setIfPresent('port_id', info.port_id)
      setIfPresent('path_id', info.path_id)
      setIfPresent('route_id', info.am_route_id)
      setIfPresent('flight_id', info.flight_id != null ? String(info.flight_id) : null)

      // Tab 3 — transportation
      // is_trasnpotation_center is NOT in the response — infer it:
      //   ltc_id present  → value '1' (transportation center)
      //   bus_type present → value '2' (external / own transport)
      const inferredIsCenter = info.ltc_id != null ? '1' : info.bus_type != null ? '2' : null
      if (inferredIsCenter) {
        setValue('is_trasnpotation_center' as any, inferredIsCenter)
        setSelectedIsTransportationCenter(inferredIsCenter)
      }
      console.log(info.ltc_id)
      setIfPresent('ltc_id', info.ltc_id)
      setIfPresent('bus_id', info.bus_id)
      setIfPresent('driver_id', info.driver_id)
      setIfPresent('bus_type', info.bus_type)
      setIfPresent('plate_no', info.plate_no)
      setIfPresent('driver_name', info.driver_name)
      setIfPresent('driver_identification_no', info.driver_identification_no)

      // Handover
      setIfPresent('handover_status', info.handover_status != null ? String(info.handover_status) : null)

      // ─── Reception details table ───────────────────────────────────────
      if (Array.isArray(info.reception_details) && info.reception_details.length > 0) {
        const mappedDetails = info.reception_details.map((row: any) => ({
          contract_id: row.contract_id,
          nation_id: row.nation_id,
          hajj_count: row.hajj_count,
          passport_count: row.passport_count,
          copy_passport_count: row.copy_passport_count,
          hajj_wo_passport_count: row.hajj_wo_passport_count,
          passport_wo_hajj_count: row.passport_wo_hajj_count
        }))

        setDetailsData((prev: any) => ({ ...prev, reception_details: mappedDetails }))
        console.log('Mapped details:', mappedDetails)
        console.log('Original details from API:', detailsData)
      }

      // ─── Sync derived cascade states ──────────────────────────────────
      if (info.reception_city_id) setSelectedCityId(info.reception_city_id)
      if (info.ltc_id) setSelectedLandTranId(info.ltc_id)

      // port_id is returned as a number — the response does NOT include the
      // nested port object, so we fetch port details to get port_code & city_id
      // which are needed to enable the flight_id select apiUrl.
      if (info.port_id) {
        setSelectedPortId(info.port_id)
        try {
          const portRes = await Shared.apiClient.get(`/def/ports/${info.port_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Accept-Language': currentLocale ?? 'ar'
            }
          })
          const portData = portRes.data?.data ?? portRes.data
          if (portData?.port_code) setSelectedPortCode(portData.port_code)
          if (portData?.city_id) setSelectedPortCityId(portData.city_id)
        } catch {
          // non-critical — flight dropdown just won't load
        }
      }
    } catch (err) {
      setWarning('يرجي التأكد من رقم الكشف')
      console.error('Failed to fetch reception info:', err)
    } finally {
      setIsFetchingInfo(false)
    }
  }, [
    getValues,
    accessToken,
    currentLocale,
    setValue,
    setDetailsData,
    setSelectedCityId,
    setSelectedPortId,
    setSelectedPortCode,
    setSelectedPortCityId,
    setSelectedLandTranId,
    setSelectedIsTransportationCenter,
    detailsData
  ])

  // ─── App settings (city-aware department type IDs) ─────────────────────────
  const appSettings = useAppSettings(
    accessToken,
    mode,
    dataModel?.id,
    formLocale ?? locale,
    formMethods,
    shouldBlockAccess
  )

  // ─── Rebuild fields with real mode + appSettings ───────────────────────────
  const liveFields = useReceptionFields({
    selectedReceptionType,
    selectedCityId,
    appSetting: appSettings,
    user,
    locale: (formLocale ?? locale) as string,
    selectedPortId,
    selectedPortCityId,
    selectedPortCode,
    selectedLandTranId,
    selectedIsTransportationCenter,
    mode,
    setValue,
    setSelectedCityId,
    setSelectedPortId,
    setSelectedPortCode,
    setSelectedPortCityId,
    setSelectedLandTranId,
    scope
  })

  const {
    autoReceptionFields: liveAutoFields,
    tab1Fields: liveTab1Fields,
    tab2Fields: liveTab2Fields,
    tab3Fields: liveTab3Fields,
    tab4Fields: liveTab4Fields,
    receptionDetailsFields: liveDetailsFields
  } = liveFields

  // ─── Watch reactive values for cascading UI ────────────────────────────────
  const watchedReceptionType = watch('reception_type')
  const watchedManifestId = watch('manifest_id')
  const watchedTdmId = watch('tdm_id')
  const watchedCityId = watch('reception_city_id')
  const watchedIsTransCenter = watch('is_trasnpotation_center')

  // ─── Reset logic on identifier change (Add mode only) ─────────────────────
  const prevIds = Shared.useRef({
    type: watchedReceptionType,
    manifest: watchedManifestId,
    tdm: watchedTdmId
  })

  Shared.useEffect(() => {
    if (mode !== 'add') return

    const { type, manifest, tdm } = prevIds.current
    const changed =
      watchedReceptionType !== type ||
      (watchedReceptionType === '1' && watchedManifestId !== manifest) ||
      (watchedReceptionType === '2' && watchedTdmId !== tdm)

    if (changed) {
      // Clear all fields except the identifiers
      const fieldsToClear = [
        'season',
        'reception_no',
        'reception_date',
        'reception_city_id',
        'reception_department_id',
        'service_department_id',
        'guiding_m_id',
        'spc_business_id',
        'auto_process_type',
        'port_id',
        'path_id',
        'route_id',
        'flight_id',
        'is_trasnpotation_center',
        'ltc_id',
        'bus_id',
        'driver_id',
        'bus_type',
        'plate_no',
        'driver_name',
        'driver_identification_no',
        'handover_status'
      ]

      fieldsToClear.forEach(f => {
        if (f === 'reception_city_id') {
          setValue(f as any, user?.context?.city_id)
        } else {
          setValue(f as any, null)
        }
      })

      // Clear details table
      setDetailsData({ reception_details: [] })

      // Reset cascade states
      setSelectedCityId(user?.context?.city_id)
      setSelectedPortId(undefined)
      setSelectedPortCode(undefined)
      setSelectedPortCityId(undefined)
      setSelectedLandTranId(undefined)
      setSelectedIsTransportationCenter(undefined)

      // Sync refs
      prevIds.current = {
        type: watchedReceptionType,
        manifest: watchedManifestId,
        tdm: watchedTdmId
      }
    }
  }, [watchedReceptionType, watchedManifestId, watchedTdmId, mode, setValue, setDetailsData, user])

  Shared.useEffect(() => {
    setSelectedReceptionType(watchedReceptionType)
  }, [watchedReceptionType])

  Shared.useEffect(() => {
    setSelectedCityId(watchedCityId ?? undefined)
  }, [watchedCityId])

  // ─── Hydrate port/city state from dataModel on edit/show load ──────────────
  // onChange fires only on manual user interaction; on edit/show mode the form
  // is pre-filled from the API response without triggering onChange, so we must
  // sync the derived state (port code, port city, port id, land trans id) here.
  Shared.useEffect(() => {
    if (!dataModel?.id) return

    // Port-related state → drives flight_id apiUrl
    if (dataModel?.port?.port_code) {
      setSelectedPortCode(dataModel.port.port_code)
    }
    if (dataModel?.port?.city_id) {
      setSelectedPortCityId(dataModel.port.city_id)
    }
    if (dataModel?.port_id) {
      setSelectedPortId(dataModel.port_id)
    }

    // City → drives reception_department_id / service_department_id apiUrls
    if (dataModel?.reception_city_id) {
      setSelectedCityId(dataModel.reception_city_id)
    }

    // Land transport company → drives bus_id / driver_id apiUrls
    if (dataModel?.ltc?.business_id) {
      setSelectedLandTranId(dataModel.ltc.business_id)
    }
  }, [dataModel?.id])

  Shared.useEffect(() => {
    setSelectedIsTransportationCenter(watchedIsTransCenter != null ? String(watchedIsTransCenter) : undefined)
  }, [watchedIsTransCenter])

  // ─── Access guard ──────────────────────────────────────────────────────────
  if (shouldBlockAccess && (mode === 'add' || mode === 'edit')) return <AccessBlockedScreen />

  // ─── Show "Get Info" button only for reception types 1 & 2 ────────────────
  const showInfoButton = selectedReceptionType === '1' || selectedReceptionType === '2'

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        {/* Header */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='receptions'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={currentLocale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={[...liveAutoFields, ...liveTab1Fields, ...liveTab2Fields, ...liveTab3Fields]}
            mode={mode}
            screenMode={mode}
            detailsConfig={[{ key: 'reception_details', fields: receptionDetailsFields, title: 'reception_details' }]}
          />
        </Shared.Grid>

        {/* ── Auto Reception: type toggle + manifest_id / tdm_id ── */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent
            headerConfig={{ title: 'auto_reception_information' }}
            locale={currentLocale}
            fields={liveAutoFields}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        {/* ── Get Info Action Button ── */}
        {showInfoButton && mode !== 'search' && (
          <Shared.Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <style>{pulseKeyframes}</style>
            <Shared.Button
              color='info'
              onClick={handleGetInfo}
              disabled={isFetchingInfo}
              startIcon={
                isFetchingInfo ? (
                  <Shared.CircularProgress size={20} color='inherit' />
                ) : (
                  <i className='ri-information-line' />
                )
              }
              sx={actionButtonStyles}
            >
              {dictionary?.titles?.get_info || 'جلب البيانات'}
            </Shared.Button>
          </Shared.Grid>
        )}

        {/* ── Tab 1: Reception Information (season, no, date, city, depts, guide) ── */}
        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'reception_information' }}
            locale={currentLocale}
            fields={liveTab1Fields}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        {/* ── Tab 2: Arrival Details (port, path, route, flight) — type 1 only ── */}
        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'arrival_details' }}
            locale={currentLocale}
            fields={liveTab2Fields}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        {/* ── Tab 3: Transportation (is_center, ltc/bus/driver OR bus_type/plate/driver_name) ── */}
        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent
            headerConfig={{ title: 'transportation' }}
            locale={currentLocale}
            fields={liveTab3Fields}
            mode={mode}
            screenMode={mode}
            printForm={false}
          />
        </Shared.Grid>

        {/* ── Reception Details Table ── */}
        <Shared.Grid size={{ xs: 12 }} style={{ display: !isPrintMode ? 'block' : 'none' }}>
          <Shared.DynamicFormTable
            fields={liveDetailsFields}
            calculationRowConfig={calculationRowConfig}
            title='reception_details'
            initialData={detailsData['reception_details']}
            onDataChange={detailsHandlers?.reception_details}
            mode={mode}
            errors={getDetailsErrors('reception_details')}
            apiEndPoint={`/haj/receptions/${dataModel?.id}/receptionDetails`}
            detailsKey='reception_details'
            locale={currentLocale}
            dataObject={dataModel}
          />
        </Shared.Grid>

        {/* ── Footer Actions ── */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormActions locale={currentLocale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>

        {/* ── Dialogs ── */}
        <Shared.FileUploadWithTabs
          open={openDocumentsDialog}
          onClose={closeDocumentsDialog}
          locale={currentLocale}
          attachments={dataModel?.attachments}
          recordId={dataModel?.id}
        />

        <Shared.RecordInformation
          open={openRecordInformationDialog}
          onClose={closeRecordInformationDialog}
          locale={currentLocale}
          dataModel={dataModel}
        />
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

// ─── Constants ────────────────────────────────────────────────────────────────

const calculationRowConfig = {
  enabled: true,
  title: 'Total',
  columns: {
    hajj_count: { operation: 'sum' as const },
    passport_count: { operation: 'sum' as const },
    copy_passport_count: { operation: 'sum' as const },
    hajj_wo_passport_count: { operation: 'sum' as const },
    passport_wo_hajj_count: { operation: 'sum' as const }
  }
}

const pulseKeyframes = `
  @keyframes pulse-info {
    0%   { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0.4); transform: scale(1); }
    50%  { box-shadow: 0 0 0 10px rgba(38, 198, 249, 0); transform: scale(1.02); }
    100% { box-shadow: 0 0 0 0 rgba(38, 198, 249, 0); transform: scale(1); }
  }
`

const actionButtonStyles = {
  px: 6,
  py: 2,
  borderRadius: 'var(--mui-shape-customBorderRadius-md)',
  fontWeight: 300,
  fontSize: '0.95rem',
  textTransform: 'none',
  letterSpacing: '0.02em',
  background: (theme: any) =>
    `linear-gradient(135deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}05 100%)`,
  border: (theme: any) => `1px solid ${theme.palette.info.main}30`,
  animation: 'pulse-info 2.5s infinite ease-in-out',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: (theme: any) => `${theme.palette.info.main}25`,
    borderColor: 'info.main',
    transform: 'translateY(-2px)',
    boxShadow: (theme: any) => `0 6px 20px -5px ${theme.palette.info.main}40`
  },
  '&:active': { transform: 'translateY(0)' }
}

export default ReceptionDetails
