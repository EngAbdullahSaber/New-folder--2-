'use client'

import * as Shared from '@/shared'
import { ComponentGeneralProps, ComponentNoticeGeneralProps } from '@/types/pageModeType'
import { useRouter } from 'next/navigation'

const NoticeOrderDetails = ({ scope }: ComponentNoticeGeneralProps) => {
  const [selectedParentCategory, setSelectedParentCategory] = Shared.useState()
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const fields: Shared.DynamicFormFieldProps[] = Shared.useMemo(
    () => [
      {
        name: 'id',
        label: 'id',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4
      },
      // {
      //   name: 'season',
      //   label: 'season',
      //   type: 'select',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 4,
      //   defaultValue: ''
      // },

      {
        name: 'notice_date',
        label: 'notice_date',
        type: 'date_time',
        now: true,
        // requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => {
          return mode
        },
        gridSize: 4,
        disableCondition(mode, dataObject) {
          if (mode == 'add' || mode == 'edit') return true
          else return false
        },
      },

      {
        name: 'notice_importance_id',
        label: 'notice_importance_id',
        type: 'select',
        apiUrl: '/jos/notice-importances',
        labelProp: 'name_ar',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 4,
        viewProp: "noticeImportance.name_ar",
      },

      {
        name: 'parnet_category_id',
        label: 'notice_parent_category',
        apiUrl: '/jos/notice-categories',
        labelProp: 'name',
        keyProp: 'id',
        type: "select",
        viewProp: "noticeParentCategory.name",

        modeCondition: (mode: Shared.Mode) => mode,
        // requiredModes: ['add', 'edit'],
        gridSize: 6
      },

      {
        name: 'category_id',
        label: 'notice_sub_category',
        type: 'select',
        apiUrl: selectedParentCategory ? '/jos/notice-categories' : undefined,
        labelProp: 'name',
        keyProp: 'id',
        viewProp: 'noticeCategory.name',
        queryParams: {
          parent_id: selectedParentCategory
        },
        modeCondition: (mode: Shared.Mode) => mode,
        // requiredModes: ['add', 'edit'],
        gridSize: 6
      },
      {
        name: 'notice_title',
        label: 'notice_title',
        type: 'text',
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },

      {
        name: 'notice_type',
        label: 'notice_type',
        type: 'toggle',
        options: Shared.noticeTypeList,
        requiredModes: ['add', 'edit'],
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12,
        // requiredModeCondition: (mode: Shared.Mode) => {
        //   if ((mode === "edit" || mode === "add") && (scope === "department")) {
        //     return false
        //   }

        //   return true
        // },
        // visibleModeCondition: (mode: Shared.Mode) => {
        //   if ((mode === "edit" || mode === "add") && (scope === "department")) {
        //     return false
        //   }

        //   return true
        // }
      },



      {
        name: 'notice_content',
        label: 'notice_content',
        type: 'rich_text',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      },


      {
        name: 'notice_way_id',
        label: 'notice_order_way',
        type: 'select',
        apiUrl: '/jos/notice-ways',
        labelProp: 'name_ar',
        keyProp: 'id',
        viewProp: 'noticeWay.name_ar',
        modeCondition: (mode: Shared.Mode) => mode,
        visibleModeCondition: (mode: Shared.Mode) => {
          if (scope === "department") return false
          return true
        },
        gridSize: 6
      },

      {
        name: 'notice_status_type_id',
        label: 'status',
        type: 'select',
        apiUrl: '/jos/notice-status-types',
        labelProp: 'name_ar',
        modeCondition: (mode: Shared.Mode) => mode,
        // requiredModes: ['add', 'edit'],
        gridSize: 6,
        viewProp: "noticeStatusType.name_ar",
        visibleModeCondition: (mode: Shared.Mode) => {
          if (mode === "search" || mode === "show") return true

          if (scope == 'operation-center') return true

          return false
        },
        requiredModeCondition: (mode: Shared.Mode) => {
          if (scope === "department") return false
          if (scope === "operation-center") return true

          return true
        },
        displayWithBadge: true,
        badgeColor: 'info'
      },

      {
        name: 'notice_department_id',
        label: 'notice_department',
        type: 'select',
        apiUrl: '/def/departments',
        labelProp: 'department_name_ar',
        keyProp: "id",
        viewProp: 'department.department_name_ar',
        modeCondition: (mode: Shared.Mode) => mode,
        cache: false,
        visibleModeCondition: (mode: Shared.Mode) => {
          if (scope == 'department') return false
          if (scope == 'operation-center') return true
          else return true
        },
        // requiredModeCondition: (mode: Shared.Mode) => {
        //   if (scope == 'operation-center' && (mode == 'add' || mode == 'edit')) return true
        //   else return false
        // },
      },
      {
        name: 'issued_department_id',
        label: 'department',
        type: 'select',
        // requiredModes: ['add', 'edit'],
        apiUrl: '/def/departments',
        labelProp: 'department_name_ar',
        keyProp: "id",
        viewProp: 'issuedDepartment.department_name_ar',
        modeCondition: (mode: Shared.Mode) => {
          if (scope == 'department') return null as any
          if (scope == 'operation-center') {
            if (mode == 'add' || mode == 'edit') return null as any
            else return mode
          }
          else return mode
        },
        cache: false
      },
      {
        name: 'reference_id',
        label: 'reference_id',
        type: 'number',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 6,
        visibleModeCondition: (mode: Shared.Mode) => {
          if (scope == 'department') return false
          else if (scope == 'operation-center') return true
          else return true
        }
      },

      {
        name: 'scope',
        label: 'scope',
        type: 'storage',
        modeCondition: (mode: Shared.Mode) => mode,
        gridSize: 12
      }

      // {
      //   name: 'status',
      //   label: 'status',
      //   type: 'select',
      //   options: Shared.statusList,
      //   requiredModes: ['add', 'edit'],
      //   defaultValue: '1',
      //   modeCondition: (mode: Shared.Mode) => mode,
      //   gridSize: 6
      // }
    ],
    [selectedParentCategory]
  )

  const noticesOrderDetailsFields: Shared.DynamicFormTableFieldProps[] = [
    {
      name: 'noticed_department_id',
      label: 'noticed_department',
      type: 'select',
      apiUrl: '/def/departments',
      labelProp: 'department_name_ar',
      keyProp: 'id',
      viewProp: 'noticeDepartment.department_name_ar',
      requiredModes: ['add', 'edit'],
      gridSize: 4,
      align: 'start',
      width: '30%'
    },
    {
      name: 'noticed_personal_id',
      label: 'noticed_personal_id',
      type: 'select',
      apiUrl: '/def/personal',
      labelProp: 'id',
      keyProp: 'id',
      displayProps: ['id_no', 'full_name_ar'],
      gridSize: 4,
      cache: false,
      viewProp: 'personal.full_name_ar',
      searchProps: ['id_no', 'full_name_ar', 'id'],
      width: '30%'
    },
    // {
    //   name: 'notice_status_type_id',
    //   label: 'status',
    //   type: 'select',
    //   apiUrl: '/jos/notice-status-types',
    //   labelProp: 'name_ar',
    //   viewProp: 'noticeStatusType.name_ar',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   requiredModes: ['add', 'edit'],
    //   width: '20%',
    //   gridSize: 6
    // }
    // {
    //   name: 'status',
    //   label: 'status',
    //   type: 'select',
    //   options: Shared.statusList,
    //   requiredModes: ['add', 'edit'],
    //   defaultValue: '1',
    //   modeCondition: (mode: Shared.Mode) => mode,
    //   gridSize: 6
    // }
  ]

  // const noticesOrderDReplyFields: Shared.DynamicFormTableFieldProps[] = [
  //   {
  //     name: 'reply_content',
  //     label: 'reply_content',
  //     type: 'text',
  //     gridSize: 4,
  //     width: '40%',
  //     align: 'start'
  //   },
  //   {
  //     name: 'notice_status_type_id',
  //     label: 'notice_status_type_details',
  //     type: 'select',
  //     apiUrl: '/jos/notice-status-types',
  //     labelProp: 'name',
  //     viewProp: 'category.name',
  //     modeCondition: (mode: Shared.Mode) => mode,
  //     requiredModes: ['add', 'edit'],
  //     width: '40%',
  //     gridSize: 6
  //   }
  // ]

  type dataModelFormData = Shared.InferFieldType<typeof fields>

  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    locale,
    dataModel,
    openDocumentsDialog,
    closeDocumentsDialog,
    getDetailsErrors,
    setDetailsData,
    detailsData,
    detailsHandlers,
    openRecordInformationDialog,
    closeRecordInformationDialog
  } = Shared.useRecordForm<dataModelFormData>({
    apiEndpoint: '/jos/notice-orders',
    routerUrl: { default: `/apps/jos/notice-order/${scope}` },
    fields: fields,
    initialDetailsData: {
      noticeOrderDetails: [],
      // notices_order_d_reply: []
    },
    detailsTablesConfig: {
      noticeOrderDetails: { fields: noticesOrderDetailsFields, trackIndex: true },
      // notices_order_d_reply: { fields: noticesOrderDReplyFields, trackIndex: true }
    }
  })

  const { setValue, getValues, watch } = formMethods

  const parentCategory = watch('parnet_category_id')

  Shared.useEffect(() => {
    setValue('scope', scope.replace('-', '_'))
  }, [scope])

  Shared.useEffect(() => {
    setValue("category_id", null)
    setSelectedParentCategory(parentCategory)
  }, [parentCategory])

  Shared.useEffect(() => {
    if (mode === "add" && scope === "department") {
      setValue("notice_way_id", "3")
    }
  }, [mode, scope])

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Grid container spacing={2}>
        <Shared.Grid size={{ xs: 12 }}>
          <Shared.Header
            locale={locale}
            title={`notice_orders`}
            mode={mode}
            onMenuOptionClick={handleMenuOptionClick}
            onCancel={goBack}
            showOnlyOptions={['add', "delete", "print", "search"]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
          <Shared.FormComponent
            locale={locale}
            fields={fields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              {
                key: 'noticeOrderDetails',
                fields: noticesOrderDetailsFields,
                title: 'notices_order_details'
              },
              // {
              //   key: 'notices_order_d_reply',
              //   fields: noticesOrderDReplyFields,
              //   title: 'notices_order_d_reply'
              // }
            ]}
          />
        </Shared.Grid>

        <Shared.Grid size={{ xs: 12 }} className='previewCard'>
          <Shared.FormComponent locale={locale} fields={fields} mode={mode} screenMode={mode} />
        </Shared.Grid>

        {scope == 'operation-center' && (
          <Shared.Grid size={{ xs: 12 }}>
            <Shared.DynamicFormTable
              fields={noticesOrderDetailsFields}
              title='notices_order_details'
              initialData={detailsData['noticeOrderDetails']} // Pass the details data
              onDataChange={detailsHandlers?.noticeOrderDetails}
              mode={mode}
              errors={getDetailsErrors('noticeOrderDetails')}
              apiEndPoint={`/jos/notice-orders/${dataModel.id}/noticeOrderDetails`}
              detailsKey='noticeOrderDetails'
              locale={locale}
              // rowModal={true}
              dataObject={dataModel}
            />
          </Shared.Grid>
        )}

        {/* <Shared.Grid size={{ xs: 12 }}>
          <Shared.DynamicFormTable
            fields={noticesOrderDReplyFields}
            title='notices_order_d_reply'
            initialData={detailsData['notices_order_d_reply']} // Pass the details data
            onDataChange={detailsHandlers?.notices_order_d_reply}
            mode={mode}
            errors={getDetailsErrors('notices_order_d_reply')}
            apiEndPoint={`/jos/notices-orders/${dataModel.id}/notices_order_d_reply`}
            detailsKey='notices_order_d_reply'
            locale={locale}
            // rowModal={true}
            dataObject={dataModel}
          />
        </Shared.Grid> */}

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
          <Shared.FormActions locale={locale} onCancel={goBack} onSaveSuccess={onSubmit} mode={mode} />
        </Shared.Grid>
      </Shared.Grid>
    </Shared.FormProvider>
  )
}

export default NoticeOrderDetails
