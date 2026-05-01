'use client'

import PolicyAgreement from '@/components/shared/PolicyAgreement'
import * as Shared from '@/shared'

const ObjectDetails = () => {
  const [selectedObjectType, setSelectedObjectType] = Shared.useState<any>()
  const [currentMode, setCurrentMode] = Shared.useState<Shared.Mode>('show')
  const fields = Shared.useMemo<Shared.DynamicFormFieldProps[]>(
    (): Shared.DynamicFormFieldProps[] => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'platform_id',
        label: 'platform_id',
        type: 'select',
        options: [
          { label: 'ويب', value: '1' },
          { label: 'موبايل', value: '2' }
        ],
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
        // defaultValue: '2'
      },

      {
        name: 'status',
        label: 'status',
        type: 'select',
        options: Shared.statusList,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
        // defaultValue: '1'
      },
      {
        name: 'object_name_ar',
        label: 'name_ar',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'object_name_la',
        label: 'name_la',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'object_type',
        label: 'object_type',
        type: 'select',
        options: Shared.objectTypeList,
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: ['add', 'edit'],
        onChange: result => {
          setSelectedObjectType(result.value)
        },
        gridSize: 4
      },

      {
        name: 'parent_id',
        label: 'parent_id',
        type: 'select',
        apiUrl: '/aut/objects',
        labelProp: 'object_name_ar',
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        lovKeyName: 'id',
        visible:
          currentMode == 'search' && selectedObjectType ? true : selectedObjectType == 3 || selectedObjectType == 2,
        queryParams: {
          object_type: selectedObjectType == '2' ? '1' : selectedObjectType == '3' ? '2' : null
        },
        requiredModes: ['add', 'edit'],
        gridSize: 4,
        viewProp: ['parent.id', 'parent.object_name_ar'],
        cache: false,
        displayProps: ['object_name_ar', 'parent.object_name_ar']
      },

      {
        name: 'description',
        label: 'description',
        type: 'rich_text',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },

      {
        name: 'object_order',
        label: 'object_order',
        type: 'number',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },

      {
        name: 'non_print_header',
        label: 'non_print_header',
        type: 'select',
        options: [
          { label: 'نعم', value: '1' },
          { label: 'لا', value: '0' }
        ],
        requiredModes: selectedObjectType == '1' || selectedObjectType == '2' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
        // defaultValue: '1'
      },

      {
        name: 'route_name',
        label: 'route_name',
        type: 'text',
        // apiUrl: '/aut/route-names',
        // labelProp: 'name',
        // keyProp: 'name',
        modeCondition: (mode: Shared.Mode) => mode,
        requiredModes: selectedObjectType == '1' || selectedObjectType == '2' ? [] : ['add', 'edit'],
        gridSize: 3
        //lovKeyName: 'route_name',
        // cache: false,
        // apiMethod: 'GET'
      },

      {
        name: 'route_path',
        label: 'route_path',
        type: 'text',
        requiredModes: selectedObjectType == '1' || selectedObjectType == '2' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 3
      },

      {
        name: 'private_object',
        label: 'private_object',
        type: 'select',
        // defaultValue: '1',
        options: [
          { label: 'نعم', value: '1' },
          { label: 'لا', value: '2' }
        ],
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'default_action',
        label: 'default_action',
        type: 'select',
        // defaultValue: '2',
        options: [
          { label: 'إضافة', value: '1' },
          { label: 'قائمة', value: '2' },
          { label: 'إستعلام', value: '3' }
        ],
        requiredModes: selectedObjectType == '1' || selectedObjectType == '2' ? [] : ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      {
        name: 'master_table',
        label: 'master_table',
        type: 'text',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },

      // {
      //   name: 'server_production_id',
      //   label: 'server_production_id',
      //   type: 'select',
      //   apiUrl: '/def/servers',
      //   labelProp: 'server_a_name',
      //   keyProp: 'id',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   //lovKeyName: 'server_id',
      //   // requiredModes: ['add', 'edit'],
      //   gridSize: 4
      // },

      // {
      //   name: 'server_warehouse_id',
      //   label: 'server_warehouse_id',
      //   type: 'select',
      //   apiUrl: '/def/servers',
      //   labelProp: 'server_a_name',
      //   keyProp: 'id',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   //lovKeyName: 'server_id',
      //   // requiredModes: ['add', 'edit'],
      //   gridSize: 4
      // },

      {
        name: 'style',
        label: 'style',
        type: 'text',
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },

      {
        name: 'store',
        label: 'add',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'add' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'update',
        label: 'edit',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'edit' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'destroy',
        label: 'delete',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'delete' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'index',
        label: 'search',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'search' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'show',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'print' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'audit_fields',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'audit_fields' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },

      {
        name: 'archive_open',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'open_documents' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'archive_add',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'add_documents' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'archive_destroy',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'delete_documents' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },

      {
        name: 'need_approval',
        label: '',
        type: 'checkbox',
        // defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'need_approval' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'approval_history_allowance',
        label: '',
        type: 'checkbox',
        // defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'approval_history_allowance' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'approval_ids',
        label: 'choose_approval_mechanism',
        type: 'select',
        apiUrl: '/flo/approval-definitions',
        displayProps: ['name', 'code'],
        keyProp: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        multiple: true,
        gridSize: 12,

        cache: false
      },
      {
        name: 'print_excel',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'print_excel' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      },
      {
        name: 'print_pdf',
        label: '',
        type: 'checkbox',
        defaultValue: true, // Default value for checkbox
        options: [{ value: 'true', label: 'print_pdf' }],
        onChange: value => console.log('Selected:', value),
        gridSize: 6,
        modeCondition: (mode: Shared.Mode) => mode
      }
    ],
    [selectedObjectType, currentMode]
  )
  const attachmentCategoryDetailsFields = Shared.useMemo<Shared.DynamicFormTableFieldProps[]>(
    () => [
      {
        name: 'id',
        label: 'category_type',
        type: 'select',
        required: true,
        apiUrl: '/def/attach-categories',
        labelProp: 'attachment_cat_desc',
        keyProp: 'id',
        width: '30%',
        viewProp: 'attachment_cat_desc',
        //lovKeyName: 'attach_cat_id'
        cache: false
        // defaultValue: '3'
      },
      {
        name: 'order_no',
        label: 'order_no',
        type: 'number',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        width: '30%'
      }
    ],
    []
  )

  const extraDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'type',
      label: 'type',
      type: 'select',
      options: Shared.formFieldTypes,
      width: '15%',
      gridSize: 6
    },
    {
      name: 'name',
      label: 'field_name',
      type: 'text',
      width: '20%',
      gridSize: 6,
      align: 'start'
    },
    {
      name: 'label',
      label: 'label',
      type: 'text',
      width: '20%',
      gridSize: 6,
      visible: true,
      align: 'start'
    },
    {
      name: 'placeholder',
      label: 'placeholder',
      type: 'text',
      width: '15%',
      gridSize: 6,
      hideInTable: true,
      align: 'center'
    },
    {
      name: 'options',
      label: 'options',
      type: 'text',
      width: '15%',
      gridSize: 12,
      // hideInTable: true,
      showWhen: {
        field: 'type',
        value: ['checkbox', 'select']
      },
      hideInTable: true
    },

    {
      name: 'frontend_validation_rules',
      label: 'frontend_validation_rules',
      type: 'text',
      width: '15%',
      gridSize: 12,
      hideInTable: true
    },
    {
      name: 'backend_validation_rules',
      label: 'backend_validation_rules',
      type: 'text',
      width: '15%',
      gridSize: 12,
      hideInTable: true
    },
    {
      name: 'is_required',
      label: 'is_required',
      type: 'checkbox',
      // defaultValue: true, // Default value for checkbox
      options: [{ value: 'true', label: 'is_required' }],
      onChange: (value: any) => console.log('Selected:', value),
      width: '15%',
      gridSize: 12
    },
    {
      name: 'is_multiple',
      label: 'is_multiple',
      type: 'checkbox',
      // defaultValue: true, // Default value for checkbox
      options: [{ value: 'true', label: 'is_multiple' }],
      onChange: (value: any) => console.log('Selected:', value),
      width: '15%',
      gridSize: 12,
      showWhen: {
        field: 'type',
        value: 'select'
      }
    }
  ]
  // attachmentCategoyDetails

  type objectFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    detailsData,
    setDetailsData,
    errors,
    locale,
    dataModel,
    detailsHandlers,
    getDetailsErrors,
    closeDocumentsDialog,
    openDocumentsDialog,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm({
    apiEndpoint: '/aut/objects',
    routerUrl: { default: '/apps/aut/object' },
    fields: fields,
    initialDetailsData: {
      attachment_categories: [],
      extraFields: []
    },
    excludeFields: [{ action: 'search', fields: fields.slice(16) }],
    classifiedObjects: [
      { objectName: 'approval_config', fields: ['need_approval', 'approval_history_allowance', 'approval_ids'] }
    ],
    detailsTablesConfig: {
      attachment_categories: { fields: attachmentCategoryDetailsFields, trackIndex: true },
      extraFields: { fields: extraDetailsFields, trackIndex: true }
    }
  })
  const { setValue, getValues } = formMethods
  const objectType = formMethods.watch('object_type')

  Shared.useEffect(() => {
    setSelectedObjectType(objectType)
  }, [objectType])

  Shared.useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={4}>
        {/* Header */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            title='system_components_configuration'
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={handleCancel}
            locale={locale}
          />
        </Shared.Grid>

        {/* Preview */}
        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        {/* ================= MAIN ROW ================= */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Grid container spacing={4}>
            {/* ===== RIGHT SIDE (8 cols) ===== */}
            <Shared.Grid size={{ xs: 12, md: 8 }}>
              <Shared.Grid container spacing={4}>
                {/* Main Information */}
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormComponent
                    fields={fields.slice(0, 8)}
                    headerConfig={{ title: 'main_information' }}
                    mode={mode}
                    screenMode={mode}
                    locale={locale}
                  />
                </Shared.Grid>

                {/* Software Properties */}
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormComponent
                    fields={fields.slice(8, 16)}
                    headerConfig={{ title: 'software_properties' }}
                    mode={mode}
                    screenMode={mode}
                    locale={locale}
                  />
                </Shared.Grid>
              </Shared.Grid>
            </Shared.Grid>

            {/* ===== LEFT SIDE (4 cols) ===== */}
            <Shared.Grid size={{ xs: 12, md: 4 }}>
              <Shared.Grid container spacing={4} direction='column'>
                {/* Actions */}
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormComponent
                    fields={fields.slice(16, 22)}
                    headerConfig={{ title: 'actions' }}
                    mode={mode}
                    screenMode={mode}
                    locale={locale}
                  />
                </Shared.Grid>

                {/* Reports */}
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormComponent
                    fields={fields.slice(28, 30)}
                    headerConfig={{ title: 'reports' }}
                    mode={mode}
                    screenMode={mode}
                    locale={locale}
                  />
                </Shared.Grid>

                {/* Archive */}
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormComponent
                    fields={fields.slice(22, 25)}
                    headerConfig={{ title: 'archive' }}
                    mode={mode}
                    screenMode={mode}
                    locale={locale}
                  />
                </Shared.Grid>

                {/* Duplicate Archive */}
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.FormComponent
                    fields={fields.slice(25, 28)} // أو fields أخرى لو مختلفة
                    headerConfig={{ title: 'approval_settings' }}
                    mode={mode}
                    screenMode={mode}
                    locale={locale}
                  />
                </Shared.Grid>
              </Shared.Grid>
            </Shared.Grid>
          </Shared.Grid>
        </Shared.Grid>

        {/* Tables & Attachments */}
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={attachmentCategoryDetailsFields}
            title='archiving_categories'
            initialData={detailsData['attachment_categories']}
            mode={mode}
            errors={getDetailsErrors('attachment_categories')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/aut/objects/${dataModel.id}/attachment_categories`}
            detailsKey='attachment_categories'
            locale={locale}
            dataObject={dataModel}
            onDataChange={detailsHandlers?.attachment_categories}
            rowModal={false}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={extraDetailsFields}
            title='extra_fields'
            initialData={detailsData['extraFields']}
            onDataChange={detailsHandlers?.extraFields}
            mode={mode}
            errors={getDetailsErrors('extraFields')}
            // apiEndPoint='/aut/objects'
            apiEndPoint={`/aut/objects/${dataModel.id}/extraFields`}
            detailsKey='extraFields'
            locale={locale}
            rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }}>
          <Shared.FileUploadWithTabs
            open={openDocumentsDialog}
            onClose={closeDocumentsDialog}
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
          <Shared.FormActions onCancel={handleCancel} onSaveSuccess={onSubmit} mode={mode} locale={locale} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default ObjectDetails
