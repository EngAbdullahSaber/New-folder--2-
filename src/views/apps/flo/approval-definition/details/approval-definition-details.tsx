'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { Stepper, Step, StepLabel } from '@mui/material'
import {
  DynamicFormFieldProps,
  DynamicFormTable,
  fetchRecordById,
  FormActions,
  handleSave,
  Header,
  Mode,
  excludeKeys,
  removeNulls,
  toast,
  useSessionHandler
} from '@/shared'
import { useRouter } from 'next/navigation'
import type { Locale } from '@configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
import { useMenuActions } from '@/hooks/useMenuActions'
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'
import CustomIconButton from '@core/components/mui/IconButton'
import { NotificationTabContent } from '@/components/shared/tabs/NotificationTabContent'
import type { TabConfig } from '@/types/components/dialogDetailsForm'

import '@/libs/styles/tiptapEditor.css'
import RichTextEditor from '@/components/shared/RichTextEditor'
import ItemDetails from '@/components/shared/ItemDetails'
import { DynamicFormTableFieldProps } from '@/types/components/dynamicFormDetailsTable'

// Types
type StepType = {
  name: string
  code: string
  order_no: number
  type: string
  approver_type: string
  approver_settings: string[]
  can_reject: boolean
  can_delegate: boolean
  next_step_code: string
  previous_step_code: string
  depends_on_step_code: string
  rowChanged: boolean
  isNew: boolean
  notification_config?: [
    approveNotification?: {
      enabled: boolean
      priority: string
      notifications_templates: any[]
    },
    rejectNotification?: {
      enabled: boolean
      priority: string
      notifications_templates: any[]
    }
  ]
}

type VersionType = {
  version_number: number
  rowChanged: boolean
  is_current: number
  change_reason: string
  change_notes: string
  changes_summary: string
  isNew: boolean
  approvalSteps: StepType[]
}

type ObjectModel = {
  name: string
  code: string
  model_type: string
  description: string
  status: number
  conditions: any[]
  approvalDefinitionVersions: VersionType[]
}

const stepsLabels = ['main_information', 'release_definitions', 'release_steps_definition']

// Editor Toolbar Component
const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null

  const buttons = [
    { action: 'bold', icon: 'ri-bold' },
    { action: 'underline', icon: 'ri-underline' },
    { action: 'italic', icon: 'ri-italic' },
    { action: 'strike', icon: 'ri-strikethrough' },
    { action: { textAlign: 'left' }, icon: 'ri-align-left', align: 'left' },
    { action: { textAlign: 'center' }, icon: 'ri-align-center', align: 'center' },
    { action: { textAlign: 'right' }, icon: 'ri-align-right', align: 'right' },
    { action: { textAlign: 'justify' }, icon: 'ri-align-justify', align: 'justify' }
  ]

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      {buttons.map((btn, idx) => {
        const isActive = typeof btn.action === 'string' ? editor.isActive(btn.action) : editor.isActive(btn.action)

        const handleClick = () => {
          if (typeof btn.action === 'string') {
            const method =
              `toggle${btn.action.charAt(0).toUpperCase() + btn.action.slice(1)}` as keyof typeof editor.chain
            ;(editor.chain().focus() as any)[method]().run()
          } else if (btn.align) {
            editor.chain().focus().setTextAlign(btn.align).run()
          }
        }

        return (
          <CustomIconButton
            key={idx}
            {...(isActive && { color: 'primary' })}
            variant='outlined'
            size='small'
            onClick={handleClick}
          >
            <i className={classnames(btn.icon, { 'text-textSecondary': !isActive })} />
          </CustomIconButton>
        )
      })}
    </div>
  )
}

// Steps Fields Configuration
const getStepsFields: () => DynamicFormTableFieldProps[] = () => [
  { name: 'code', label: 'code', type: 'text', required: true, width: '20%' },
  { name: 'name', label: 'step_name', type: 'text', required: true, width: '20%' },
  { name: 'order_no', label: 'order_no', type: 'number', required: true, width: '10%' },
  {
    name: 'type',
    label: 'type',
    type: 'select',
    options: [
      { label: 'تسلسلي', value: 'sequential' },
      { label: 'متوازي', value: 'parallel' },
      { label: 'شرطي', value: 'conditional' }
    ],
    required: true,
    width: '20%'
  },
  {
    name: 'approver_type',
    label: 'approver_type',
    type: 'select',
    options: [
      { label: 'المدير المباشر', value: 'direct_manager' },
      { label: 'مدير إدارة', value: 'department_manager' },
      { label: 'اشخاص محددين', value: 'specific_users' }
    ],
    required: true,
    width: '20%'
  },

  {
    name: 'approver_settings',
    label: 'approver_settings',
    type: 'select',
    apiUrl: '/def/personal',
    labelProp: 'id',
    keyProp: 'id',
    modeCondition: (mode: Mode) => mode,
    displayProps: ['id_no', 'full_name_ar'],
    gridSize: 6,
    cache: false,
    viewProp: 'personal.full_name_ar',
    showWhen: {
      field: 'approver_type',
      value: ['direct_manager', 'specific_users']
    },
    hideInTable: true,
    multiple: true
    // modal: 'personal'
  },

  {
    name: 'approver_settings',
    label: 'approver_settings',
    type: 'select',
    required: true,
    width: '10%',
    apiUrl: '/def/departments',
    labelProp: 'department_name_ar',
    keyProp: 'id',
    multiple: true,
    showWhen: {
      field: 'approver_type',
      value: ['department_manager']
    },
    hideInTable: true
  },

  {
    name: 'next_step_code',
    label: 'next_step_code',
    type: 'text',
    required: false,
    width: '8%',
    gridSize: 4,
    hideInTable: true
  },
  {
    name: 'previous_step_code',
    label: 'previous_step_code',
    type: 'text',
    required: false,
    width: '8%',
    gridSize: 4,
    hideInTable: true
  },
  {
    name: 'depends_on_step_code',
    label: 'depends_on_step_code',
    type: 'text',
    required: false,
    width: '8%',
    gridSize: 4,
    hideInTable: true
  },
  { name: 'can_reject', label: 'can_reject', type: 'checkbox', required: false, width: '5%', hideInTable: true },
  { name: 'can_delegate', label: 'can_delegate', type: 'checkbox', required: false, width: '5%', hideInTable: true }
]

// Notification Tabs Configuration
const getNotificationTabs = (): TabConfig[] => [
  {
    key: 'approve_notification',
    label: 'approve_notification',
    // ✅ تحديث الشرط للـ format الجديد
    enabled: row => !!row?.notification_config?.approveNotification?.enabled,
    component: props => <NotificationTabContent {...props} notificationType='approve' />
  },
  {
    key: 'reject_notification',
    label: 'reject_notification',
    // ✅ تحديث الشرط للـ format الجديد
    enabled: row => !!row?.notification_config?.rejectNotification?.enabled,
    component: props => <NotificationTabContent {...props} notificationType='reject' />
  }
]

const ApprovalDefinitionDetails = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline
    ],
    content: '<p>Keep your account secure with authentication step.</p>'
  })

  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const modeParam = searchParams.get('mode') as Mode

  const [mode, setMode] = useState<Mode>(modeParam || 'add')
  const [activeStep, setActiveStep] = useState(0)
  const [wizardData, setWizardData] = useState<ObjectModel>({
    name: '',
    code: '',
    model_type: '',
    description: '',
    status: 1,
    conditions: [],
    approvalDefinitionVersions: []
  })
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0)
  const [resetKey, setResetKey] = useState(Date.now())
  const [dictionary, setDictionary] = useState<any>(null)
  const { accessToken } = useSessionHandler()

  const methods = useForm({
    mode: 'onChange',
    defaultValues: wizardData
  })

  const params = useParams()

  const { lang: locale } = params
  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = methods

  // Load dictionary
  useEffect(() => {
    getDictionary(locale as Locale).then(setDictionary)
  }, [locale])

  // Fetch existing object if editing
  useEffect(() => {
    if (id && mode !== 'add' && accessToken) {
      fetchRecordById(`/flo/approval-definitions`, id, accessToken, locale as Locale, (data: any) => {
        setWizardData({
          ...excludeKeys(data, [
            'created_at',
            'updated_at',
            'is_active',
            'deactivated_at',
            'pending_requests_strategy',
            'average_approval_time',
            'requests_count',
            'successful_requests_count',
            'activated_at',
            'apply_to_new_requests_only',
            'reevaluate_pending_requests',
            'approval_definition_id',
            'timeout_hours',
            'timeout_action',
            'send_reminder',
            'reminder_time_unit',
            'reminder_time',
            'reminder_repeat_time',
            'reminder_repeat',
            'reject_reasons'
          ]),
          status: data.is_active
        })
        reset({ ...data, status: data.is_active })
      })
    }
  }, [id, mode, reset, accessToken])

  const handleVersionChange = (index: number) => {
    setSelectedVersionIndex(index)
    setResetKey(Date.now())
  }

  const removeEmptyObjects = (value: any): any => {
    if (Array.isArray(value)) {
      return value
        .map(removeEmptyObjects)
        .filter(v => v !== undefined && v !== null && !(typeof v === 'object' && Object.keys(v).length === 0))
    }

    if (value && typeof value === 'object') {
      const result: any = {}

      for (const key in value) {
        const cleaned = removeEmptyObjects(value[key])

        if (
          cleaned !== undefined &&
          cleaned !== null &&
          !(typeof cleaned === 'object' && Object.keys(cleaned).length === 0)
        ) {
          result[key] = cleaned
        }
      }

      return Object.keys(result).length > 0 ? result : undefined
    }

    return value
  }

  const cleanWizardData = (data: ObjectModel) => {
    const cleanedVersions = (data.approvalDefinitionVersions || [])
      .filter(v => v?.version_number != null && String(v.version_number).trim() !== '')
      .map(version => {
        const approvalSteps = (version.approvalSteps || [])
          .filter(step => step && Object.keys(step).length > 0)
          .map(step => {
            const { rowChanged, isNew, ...cleanStep } = step

            if (cleanStep.notification_config) {
              const { approveNotification, rejectNotification }: any = cleanStep.notification_config

              if (approveNotification?.notifications_templates) {
                approveNotification.notifications_templates = approveNotification.notifications_templates
                  .filter((t: any) => t && Object.keys(t).length > 0)
                  .map(({ rowChanged, isNew, ...t }: any) => t)
              }

              if (rejectNotification?.notifications_templates) {
                rejectNotification.notifications_templates = rejectNotification.notifications_templates
                  .filter((t: any) => t && Object.keys(t).length > 0)
                  .map(({ rowChanged, isNew, ...t }: any) => t)
              }
            }

            return cleanStep
          })

        const { rowChanged, isNew, ...cleanVersion } = version
        return { ...cleanVersion, approvalSteps }
      })

    const cleanedConditions = (data.conditions || [])
      .filter(cond => cond && Object.keys(cond).length > 0)
      .map(({ rowChanged, isNew, ...cleanCond }) => cleanCond)

    const { approvalDefinitionVersions, conditions, ...rest } = data

    return removeEmptyObjects({
      ...rest,
      approvalDefinitionVersions: cleanedVersions,
      conditions: cleanedConditions
    })
  }

  const saveWizardData = async (data: any) => {
    try {
      const response = await handleSave('/flo/approval-definitions', locale as Locale, data, id, accessToken, true)
      // toast.success('تم الحفظ بنجاح')
      setMode('show')
    } catch (err) {
      console.error('Failed to save object', err)
      // toast.error('فشل في الحفظ')
    }
  }

  const handleNext = () => {
    if (activeStep === 0) {
      handleSubmit((data: any) => {
        const requiredFields = ['name', 'code', 'status']
        const missing = requiredFields.filter(field => !data[field])
        if (missing.length > 0) {
          toast.error('الرجاء ملء جميع الحقول المطلوبة في المعلومات الرئيسية')
          return
        }

        setWizardData(prev => ({
          ...prev,
          name: data.name,
          code: data.code,
          status: data.status,
          description: data?.description,
          conditions: prev.conditions
        }))
        setActiveStep(1)
      })()
    } else if (activeStep === 1) {
      const versionsFilled = wizardData.approvalDefinitionVersions.some(
        v => v.version_number != null && String(v.version_number).trim() !== ''
      )
      if (!versionsFilled) {
        toast.error('يجب إدخال رقم نسخة واحد على الأقل')
        return
      }
      setActiveStep(2)
    } else if (activeStep === 2) {
      const cleanedData = cleanWizardData(wizardData)
      const invalidVersion = cleanedData.approvalDefinitionVersions.some(
        (v: any) => !v.approvalSteps || v.approvalSteps.length === 0
      )
      if (invalidVersion) {
        toast.error('يجب إضافة خطوة واحدة على الأقل لكل نسخة')
        return
      }
      setWizardData(cleanedData as ObjectModel)
      saveWizardData(cleanedData)
    }
  }

  const handleBack = () => setActiveStep(prev => prev - 1)

  const { handleMenuOptionClick } = useMenuActions({
    locale: locale as Locale,
    routerUrl: { default: '/apps/flo/approval-definition' },
    setMode,
    formMethods: methods,
    defaultValues: wizardData,
    resetForm: (fm, _, fields) => fields.forEach(f => fm.setValue(f, '')),
    setDetailsData: () => {
      setWizardData({
        name: '',
        code: '',
        model_type: '',
        description: '',
        status: 1,
        conditions: [],
        approvalDefinitionVersions: []
      })
      setActiveStep(0)
    }
  })

  // Get current version steps safely
  const currentVersionSteps = wizardData.approvalDefinitionVersions[selectedVersionIndex]?.approvalSteps || []
  return (
    <>
      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Header title='approval_mechanisms' mode={mode} onMenuOptionClick={handleMenuOptionClick} locale={locale} />
          </Grid>
          {mode === 'show' ? (
            <Grid size={{ xs: 12 }}>
              <ItemDetails
                sections={[
                  {
                    titleKey: 'main_information',
                    fields: [
                      { name: 'id', label: 'id', type: 'number', xl: 12, lg: 12, md: 12, sm: 12, xs: 12 },
                      { name: 'name', label: 'name', type: 'text' },
                      { name: 'code', label: 'code', type: 'text' },
                      { name: 'status', label: 'status', type: 'text' },
                      {
                        name: 'description',
                        label: 'description',
                        type: 'rich_text',

                        xl: 12,
                        lg: 12,
                        md: 12,
                        sm: 12,
                        xs: 12
                      },
                      {
                        name: 'conditions',
                        label: 'conditions_definition',
                        type: 'table',
                        apiEndPoint: `/flo/approval-definitions/${id}/conditions`,
                        fields: [
                          { name: 'field', label: 'field_name', type: 'text', required: true, width: '30%' },
                          {
                            name: 'operator',
                            label: 'operator',
                            type: 'select',
                            options: [
                              { label: 'eq', value: 'eq' },
                              { label: 'neq', value: 'neq' },
                              { label: 'in', value: 'in' },
                              { label: 'nin', value: 'nin' }
                            ],
                            required: true,
                            width: '30%'
                          },
                          { name: 'value', label: 'value', type: 'text', required: true, width: '30%' }
                        ]
                      }
                    ]
                  },
                  {
                    titleKey: 'release_definitions',
                    fields: [
                      {
                        name: 'approvalDefinitionVersions',
                        label: '',
                        apiEndPoint: `/flo/approval-definitions/${id}/approvalDefinitionVersions`,
                        type: 'table',
                        fields: [
                          {
                            name: 'version_number',
                            label: 'version_number',
                            type: 'number',
                            required: true,
                            width: '20%'
                          },
                          {
                            name: 'is_current',
                            label: 'is_current',
                            type: 'radio',
                            required: true,
                            width: '5%',
                            options: [{ label: '', value: 1 }]
                          },
                          { name: 'change_reason', label: 'change_reason', type: 'text', required: true, width: '20%' },
                          { name: 'change_notes', label: 'change_notes', type: 'text', required: true, width: '20%' },
                          {
                            name: 'changes_summary',
                            label: 'change_summary',
                            type: 'text',
                            required: true,
                            width: '20%'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    titleKey: 'release_steps_definition',
                    fields: [
                      {
                        name: 'name',
                        label: 'version_number',
                        type: 'text',
                        xs: 12,
                        md: 12,
                        lg: 12,
                        xl: 12,
                        render: () => {
                          return (
                            <>
                              {wizardData.approvalDefinitionVersions.length === 0 ? (
                                <Typography>الرجاء إضافة إصدار واحد على الأقل</Typography>
                              ) : (
                                <>
                                  {/* <Grid container spacing={2}> */}
                                  <Grid size={{ xs: 12, md: 12, xl: 12 }}>
                                    <Grid size={{ xs: 4, md: 4, xl: 4 }} pb={'10px'}>
                                      <FormControl fullWidth required>
                                        <InputLabel>اختر النسخة</InputLabel>
                                        <Select
                                          value={selectedVersionIndex}
                                          label='اختر النسخة'
                                          onChange={e => handleVersionChange(Number(e.target.value))}
                                          size='small'
                                        >
                                          {wizardData.approvalDefinitionVersions
                                            .filter(
                                              v => v.version_number != null && String(v.version_number).trim() !== ''
                                            )
                                            .map((v, i) => (
                                              <MenuItem key={i} value={i}>
                                                النسخة {v.version_number}
                                              </MenuItem>
                                            ))}
                                        </Select>
                                        {wizardData.approvalDefinitionVersions.length === 0 && (
                                          <FormHelperText error>يجب اختيار إصدار</FormHelperText>
                                        )}
                                      </FormControl>
                                    </Grid>
                                    {/* </Grid> */}

                                    {/* ✅ DynamicFormTable مع rowModal و tabs للإشعارات */}
                                    <DynamicFormTable
                                      // title='release_steps_definition'
                                      fields={getStepsFields()}
                                      initialData={currentVersionSteps}
                                      mode={mode}
                                      rowModal={true}
                                      rowModalConfig={{
                                        title: 'step_details',
                                        showNotificationSettings: true, // يظهر checkboxes في الـ Main Tab
                                        tabs: getNotificationTabs() // Tabs للإشعارات
                                      }}
                                      errors={[]}
                                      apiEndPoint={`/flo/approval-definitions/${id}/approvalDefinitionVersions`}
                                      onDataChange={steps => {
                                        // const newVersions = [...wizardData.approvalDefinitionVersions]
                                        // if (newVersions[selectedVersionIndex]) {
                                        //   newVersions[selectedVersionIndex].approvalSteps = steps
                                        //   setWizardData(prev => ({
                                        //     ...prev,
                                        //     approvalDefinitionVersions: newVersions
                                        //   }))
                                        // }
                                      }}
                                      locale='ar'
                                      resetKey={resetKey}
                                    />
                                  </Grid>
                                </>
                              )}
                            </>
                          )
                        }
                      }
                    ]
                  }
                ]}
                mode='show'
                dictionary={dictionary}
                data={wizardData}
                locale={locale as string}
              />
            </Grid>
          ) : (
            <>
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ p: 4 }}>
                      <Stepper activeStep={activeStep} alternativeLabel>
                        {stepsLabels.map(label => (
                          <Step key={label}>
                            <StepLabel>{dictionary?.titles?.[label]}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>

                      <Box sx={{ mt: 4 }}>
                        {/* Step 1: General Info */}
                        {activeStep === 0 && (
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: 'الاسم مطلوب' }}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={dictionary?.placeholders?.name}
                                        fullWidth
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                        size='small'
                                      />
                                    )}
                                  />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                  <Controller
                                    name='code'
                                    control={control}
                                    rules={{ required: 'الكود مطلوب' }}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={dictionary?.placeholders?.code}
                                        fullWidth
                                        error={!!errors.code}
                                        helperText={errors.code?.message}
                                        size='small'
                                      />
                                    )}
                                  />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                  <FormControl fullWidth required>
                                    <InputLabel>{dictionary?.placeholders?.status}</InputLabel>
                                    <Select
                                      value={wizardData.status ? '1' : '2'}
                                      label={dictionary?.placeholders?.status}
                                      size='small'
                                      onChange={e =>
                                        setWizardData(prev => ({
                                          ...prev,
                                          status: e.target.value === '1' ? 1 : 0
                                        }))
                                      }
                                    >
                                      <MenuItem value='1'>نشط</MenuItem>
                                      <MenuItem value='2'>غير نشط</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                  {/* <Typography className='mbe-1'>{dictionary?.placeholders?.description}</Typography>
                            <Card className='p-0 border shadow-none'>
                              <CardContent className='p-0'>
                                <EditorToolbar editor={editor} />
                                <Divider className='mli-5' />
                                <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex' />
                              </CardContent>
                            </Card> */}

                                  <Controller
                                    name='description'
                                    control={control}
                                    // rules={{ required: 'الوصف مطلوب' }}
                                    render={({ field }) => (
                                      <RichTextEditor
                                        {...field}
                                        label={dictionary?.placeholders?.description}
                                        placeholder={dictionary?.placeholders?.description}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                      />
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <DynamicFormTable
                                title='conditions_definition'
                                fields={[
                                  { name: 'field', label: 'field_name', type: 'text', required: true, width: '30%' },
                                  {
                                    name: 'operator',
                                    label: 'operator',
                                    type: 'select',
                                    options: [
                                      { label: 'eq', value: 'eq' },
                                      { label: 'neq', value: 'neq' },
                                      { label: 'in', value: 'in' },
                                      { label: 'nin', value: 'nin' }
                                    ],
                                    required: true,
                                    width: '30%'
                                  },
                                  { name: 'value', label: 'value', type: 'text', required: true, width: '30%' }
                                ]}
                                initialData={wizardData.conditions}
                                mode={mode}
                                apiEndPoint={`/flo/approval-definitions/${id}/conditions`}
                                errors={[]}
                                onDataChange={conditions =>
                                  setWizardData(prev => ({ ...prev, conditions: conditions }))
                                }
                                locale={locale as string}
                              />
                            </Grid>
                          </Grid>
                        )}

                        {/* Step 2: Versions */}
                        {activeStep === 1 && (
                          <DynamicFormTable
                            title='release_definitions'
                            fields={[
                              {
                                name: 'version_number',
                                label: 'version_number',
                                type: 'number',
                                required: true,
                                width: '20%'
                              },
                              {
                                name: 'is_current',
                                label: 'is_current',
                                type: 'radio',
                                required: true,
                                width: '5%',
                                options: [{ label: '', value: 1 }]
                              },
                              {
                                name: 'change_reason',
                                label: 'change_reason',
                                type: 'text',
                                required: true,
                                width: '20%'
                              },
                              {
                                name: 'change_notes',
                                label: 'change_notes',
                                type: 'text',
                                required: true,
                                width: '20%'
                              },
                              {
                                name: 'changes_summary',
                                label: 'change_summary',
                                type: 'text',
                                required: true,
                                width: '20%'
                              }
                            ]}
                            initialData={wizardData.approvalDefinitionVersions}
                            mode={mode}
                            errors={[]}
                            apiEndPoint={`/flo/approval-definitions/${id}/approvalDefinitionVersions`}
                            onDataChange={versions =>
                              setWizardData(prev => ({
                                ...prev,
                                approvalDefinitionVersions: versions
                              }))
                            }
                            locale='ar'
                          />
                        )}

                        {/* Step 3: Steps per Selected Version */}
                        {activeStep === 2 && (
                          <>
                            {wizardData.approvalDefinitionVersions.length === 0 ? (
                              <Typography>الرجاء إضافة إصدار واحد على الأقل</Typography>
                            ) : (
                              <>
                                <Grid container spacing={2}>
                                  <Grid size={{ xs: 12, md: 4 }}>
                                    <FormControl fullWidth required>
                                      <InputLabel>اختر النسخة</InputLabel>
                                      <Select
                                        value={selectedVersionIndex}
                                        label='اختر النسخة'
                                        onChange={e => handleVersionChange(Number(e.target.value))}
                                        size='small'
                                      >
                                        {wizardData.approvalDefinitionVersions
                                          .filter(
                                            v => v.version_number != null && String(v.version_number).trim() !== ''
                                          )
                                          .map((v, i) => (
                                            <MenuItem key={i} value={i}>
                                              النسخة {v.version_number}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                      {wizardData.approvalDefinitionVersions.length === 0 && (
                                        <FormHelperText error>يجب اختيار إصدار</FormHelperText>
                                      )}
                                    </FormControl>
                                  </Grid>
                                </Grid>

                                {/* ✅ DynamicFormTable مع rowModal و tabs للإشعارات */}
                                <DynamicFormTable
                                  title='release_steps_definition'
                                  fields={getStepsFields()}
                                  initialData={currentVersionSteps}
                                  mode={mode}
                                  rowModal={true}
                                  rowModalConfig={{
                                    title: 'step_details',
                                    showNotificationSettings: true, // يظهر checkboxes في الـ Main Tab
                                    tabs: getNotificationTabs() // Tabs للإشعارات
                                  }}
                                  errors={[]}
                                  apiEndPoint={`/flo/approval-definitions/${id}/approvalDefinitionVersions`}
                                  onDataChange={steps => {
                                    const newVersions = [...wizardData.approvalDefinitionVersions]
                                    if (newVersions[selectedVersionIndex]) {
                                      newVersions[selectedVersionIndex].approvalSteps = steps
                                      setWizardData(prev => ({
                                        ...prev,
                                        approvalDefinitionVersions: newVersions
                                      }))
                                    }
                                  }}
                                  locale='ar'
                                  resetKey={resetKey}
                                />
                              </>
                            )}
                          </>
                        )}

                        {/* Navigation Buttons */}
                        <div className='flex justify-between items-center flex-wrap gap-6 mt-3'>
                          <Button
                            variant='outlined'
                            color='error'
                            onClick={activeStep === 0 ? () => router.back() : handleBack}
                          >
                            {activeStep === 0 ? 'إلغاء' : 'العودة'}
                          </Button>

                          <Button variant='contained' onClick={handleNext}>
                            {activeStep < stepsLabels.length - 1 ? 'التالي' : 'حفظ'}
                          </Button>
                        </div>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </FormProvider>
    </>
  )
}

export default ApprovalDefinitionDetails
