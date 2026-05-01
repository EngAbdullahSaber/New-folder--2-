'use client'

import * as Shared from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const TaskDetails = ({ scope }: ComponentGeneralProps) => {
  const fields: Shared.DynamicFormFieldProps[] = [
    {
      name: 'id',
      label: 'id',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 8
    },
    {
      name: 'season',
      label: 'season',
      type: 'number',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4
    },
    {
      name: 'curriculum_id',
      label: 'curriculum',
      type: 'select',
      apiUrl: '/cur/curriculums',
      requiredModes: ['add', 'edit'],
      labelProp: 'name',
      keyProp: 'id',

      // lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      viewProp: 'curriculum.name',
      gridSize: 4
    },
    {
      name: 'stage_id',
      label: 'stage',
      type: 'select',
      apiUrl: '/cur/stages',
      requiredModes: ['add', 'edit'],
      labelProp: 'name',
      keyProp: 'id',

      // lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4,
      viewProp: 'stage.name'
    },
    {
      name: 'path_id',
      label: 'path',
      type: 'select',
      apiUrl: '/cur/paths',
      requiredModes: ['add', 'edit'],
      labelProp: 'name',
      keyProp: 'id',

      // lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4,
      viewProp: 'path.name'
    },
    {
      name: 'milestone_id',
      label: 'milestone',
      type: 'select',
      apiUrl: '/cur/milestones',
      requiredModes: ['add', 'edit'],
      labelProp: 'name',
      keyProp: 'id',

      // lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },

    {
      name: 'category_id',
      label: 'category',
      type: 'select',
      options: Shared.taskCategoryList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },

    {
      name: 'code',
      label: 'code',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },

    {
      name: 'start_date',
      label: 'start_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4,
      visibleModes: ['add', 'edit', 'show']
    },
    {
      name: 'end_date',
      label: 'end_date',
      type: 'date',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4,
      visibleModes: ['add', 'edit', 'show']
    },

    {
      name: 'start_date',
      label: 'start_date',
      type: 'date_range',
      visibleModes: ['search'],
      gridSize: 6
    },
    {
      name: 'end_date',
      label: 'end_date',
      type: 'date_range',
      visibleModes: ['search'],
      gridSize: 6
    },

    {
      name: 'supporting_document_type',
      label: 'supporting_document_type',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },
    {
      name: 'department_responsible_id',
      label: 'department_responsible',
      type: 'select',
      apiUrl: '/def/departments',
      requiredModes: ['add', 'edit'],
      labelProp: 'department_name_ar',
      keyProp: 'id',

      // lovKeyName: 'id',
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4,
      viewProp: 'department_responsible.department_name_ar'
    },
    {
      name: 'person_responsible_id',
      label: 'person_responsible',
      type: 'select',
      apiUrl: '/def/personal',
      requiredModes: [],
      displayProps: ['id_no', 'full_name_ar'],
      labelProp: 'full_name_ar',
      keyProp: 'id',
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4,
      viewProp: 'person_responsible.full_name_ar'
    },
    {
      name: 'followup_agency',
      label: 'followup_agency',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },
    {
      name: 'followup_person_responsible',
      label: 'followup_person_responsible',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },
    {
      name: 'support_agency',
      label: 'support_agency',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },
    {
      name: 'support_person_responsible',
      label: 'support_person_responsible',
      type: 'text',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },
    {
      name: 'progress_percent',
      label: 'progress_percent',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.taskProgressList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 4
    },

    {
      name: 'operational_tasks',
      label: 'operational_tasks',
      type: 'textarea',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 12
    },

    {
      name: 'task_description',
      label: 'task_description',
      type: 'textarea',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 12
    },
    {
      name: 'notes',
      label: 'notes',
      type: 'textarea',
      requiredModes: [],
      modeCondition: (mode: Shared.Mode) => {
        if (scope == 'admin') return mode
        else if (mode == 'search') return 'search'
        else return 'show'
      },
      gridSize: 12
    }
  ]

  const followUpFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'description',
      label: 'description',
      type: 'text',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      align: 'start',

      // hideInTable: true
      width: '50%'
    },
    {
      name: 'progress_percent',
      label: 'progress_percent',
      type: 'number',
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 6,
      width: '10%'
    },
    {
      name: 'support_document',
      label: 'support_document',
      type: 'file',
      required: false,
      width: '15%',
      gridSize: 6,
      fileableType: scope == 'user' ? 'cur_my_followups' : 'cur_followups'
    },
    {
      name: 'files',
      label: '',
      type: 'storage',
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 12,
      visibleModes: ['add', 'edit']
    },

    {
      name: 'status',
      label: 'status',
      type: 'select',
      options: Shared.taskProgressList,
      requiredModes: ['add', 'edit'],
      modeCondition: (mode: Shared.Mode) => {
        return mode
      },
      gridSize: 4,
      width: '15%'
    }
  ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    errors,
    setOpenDocumentsDialog,
    openDocumentsDialog,
    setOpenRecordInformationDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog,
    openRecordTrackingDialog,
    setOpenRecordTrackingDialog,
    locale,
    dataModel,
    closeDocumentsDialog,
    detailsHandlers,
    getDetailsErrors
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: `/cur/${scope == 'user' ? 'my-tasks' : 'tasks'}`,
    routerUrl: { default: `/apps/cur/task/${scope}` },
    fields: fields,
    initialDetailsData: {
      followups: []
    },
    detailsTablesConfig: {
      followups: { fields: followUpFields, trackIndex: true }
    }
  })

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title={'tasks'}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={followUpFields}
            title='followups'
            initialData={detailsData['followups']}
            onDataChange={detailsHandlers?.followups}
            mode={mode}
            errors={getDetailsErrors('followups')}
            apiEndPoint={`/acs/company-contractor-requests/${dataModel.id}/followups`}
            detailsKey='followups'
            locale={locale}
            dataObject={dataModel}
            enableDelete={scope == 'admin'}

            // rowModal
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
          <Shared.FormActions locale={locale} onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>
      </Shared.Grid>

      <Shared.Grid size={{ xs: 12 }}>
        <Shared.FileUploadWithTabs
          open={openDocumentsDialog}
          onClose={() => closeDocumentsDialog()}
          locale={locale}
          attachments={dataModel?.attachments}
          recordId={dataModel?.id}
        />
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default TaskDetails
