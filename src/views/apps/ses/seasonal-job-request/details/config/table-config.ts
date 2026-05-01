import * as Shared from '@/shared'
import { FIELD_INDICES } from './form-config'
import { interviewFields, interviewTableFields } from './field-definitions'

/**
 * Creates table configurations for the shared form
 */
export const createTableConfigs = (
  dataModel: any | undefined,
  appSettings: any,
  experienceFields: Shared.DynamicFormTableFieldProps[],
  courseFields: Shared.DynamicFormTableFieldProps[],
  scope?: string,
  mode?: Shared.Mode
) => ({
  basicInformationTables: [],

  jobInformationTables: [
    {
      dataKey: 'request_nationalities',
      fields: [],
      title: 'application_nationalities',
      type: 'checkbox' as const,
      options: appSettings?.app_setting_nationalities ?? [],
      mode: scope === 'interviewer' ? 'show' : undefined,
      keyProp: 'nationality_id',
      labelProp: 'name_ar',
      submitKey: 'id',
      apiEndPoint: `/ses/seasonal-request/${dataModel?.id}/request_nationalities`
    },
    {
      dataKey: 'request_cities',
      keyProp: 'id',
      fields: [],
      title: 'request_cities',
      mode: scope === 'interviewer' ? 'show' : undefined,
      editProp: 'id',
      apiUrl: '/sys/list/1',
      labelProp: 'name_ar',
      type: 'checkbox' as const,
      apiEndPoint: `/ses/seasonal-request/${dataModel?.id}/request_cities`,
      submitKey: 'id'
    },
    {
      dataKey: 'request_desired_jobs',
      mode: scope === 'interviewer' ? 'show' : undefined,
      keyProp: 'job_id',
      fields: [],
      title: 'application_desired_jobs',
      options: appSettings?.app_setting_desires ?? [],

      labelProp: 'name',
      type: 'checkbox' as const,
      apiEndPoint: `/ses/seasonal-request/${dataModel?.id}/request_desired_jobs`,
      submitKey: 'id'
    }
  ],

  experienceInformationTables: [
    {
      dataKey: 'request_experiences',
      fields: experienceFields,
      title: 'request_experience',
      mode: scope === 'interviewer' ? 'show' : undefined,
      rowModal: false,
      apiEndPoint: `/ses/seasonal-request/${dataModel?.id}/request_experiences`
    },
    {
      dataKey: 'request_courses',
      mode: scope === 'interviewer' ? 'show' : undefined,
      fields: courseFields,
      title: 'request_courses',
      rowModal: false,
      apiEndPoint: `/ses/seasonal-request/${dataModel?.id}/request_courses`
    }
  ],

  interviewerTables: [
    {
      dataKey: 'request_desired_job_approvals',
      fields: [
        {
          name: 'job_id',
          label: 'job',
          type: 'select',
          // apiUrl: '/sys/list/21',
          labelProp: 'name',
          keyProp: 'department_id',
          required: true,
          width: '30%',
          apiMethod: 'GET',
          viewProp: 'job.name',
          resetFieldsOnChange: ['department_id'],
          options:
            appSettings?.app_setting_desires.map((item: any) => ({
              ...item,
              label: item.name,
              value: item.job_id
            })) ?? []
        },
        {
          name: 'department_id',
          label: 'hr_current_department',
          // showWhen: {
          //   field: 'job_id',
          //   hasValue: true
          // },
          // queryParamsFunction: (row: any) => ({ job_id: row.job_id }),
          apiUrlFunction: (row: any) => (row?.job_id ? `/ses/approved-job-centers/${row?.job_id}/departments` : null),
          type: 'select',
          // apiUrl: '/def/seasonal-departments',
          labelProp: 'department_name_ar',
          keyProp: 'id',
          // queryParams: { internal_department: true },
          width: '30%',
          // modeCondition: (mode: Shared.Mode) => (departmentOptions.length > 1 ? mode : 'show'),
          requiredModes: ['add', 'edit'],
          gridSize: 6,
          viewProp: 'department.department_name_ar',
          onChange(value: any) {},
          apiMethod: 'GET'
        }
      ],
      title: 'request_desired_job_approvals',
      rowModal: false,
      apiEndPoint: `/ses/request-desired-job-approvals`
    }
  ]
})

const createRoleTabs = (scope?: string, tableConfigs?: any) => {
  if (scope === 'interviewer') {
    return [
      {
        label: 'request_review',
        fields: interviewFields,
        tables: tableConfigs.interviewerTables
      }
    ]
  }

  return []
}
/**
 * Creates the complete shared form tab configuration
 */
export const createSharedFormTabConfig = (
  fields: Shared.DynamicFormFieldProps[],
  dataModel: any | undefined,
  appSettings: any,
  experienceFields: Shared.DynamicFormTableFieldProps[],
  courseFields: Shared.DynamicFormTableFieldProps[],
  scope?: string,
  mode?: Shared.Mode
) => {
  const tableConfigs = createTableConfigs(dataModel, appSettings, experienceFields, courseFields, scope, mode)

  const baseTabs = [
    {
      label: 'basic_information',
      fields: fields.slice(FIELD_INDICES.BASIC_INFO_START, FIELD_INDICES.IDENTITY_INFO_START),
      extraSections: [
        {
          fields: fields.slice(FIELD_INDICES.IDENTITY_INFO_START, FIELD_INDICES.IDENTITY_INFO_END),
          label: 'identity_information',
          gridSize: 12
        },
        {
          fields: fields.slice(FIELD_INDICES.BANK_INFO_START, FIELD_INDICES.BANK_INFO_END),
          label: 'bank_information',
          gridSize: 12
        },
        {
          fields: fields.slice(FIELD_INDICES.LANGUAGES_START, FIELD_INDICES.LANGUAGES_END),
          label: 'languages',
          gridSize: 12
        }
      ],
      tables: tableConfigs.basicInformationTables
    },
    {
      label: 'contact_information',
      fields: fields.slice(FIELD_INDICES.CONTACT_INFO_START, FIELD_INDICES.NATIONAL_ADDRESS_START),
      extraSections: [
        {
          fields: fields.slice(FIELD_INDICES.NATIONAL_ADDRESS_START, FIELD_INDICES.NATIONAL_ADDRESS_END),
          label: 'national_address_information',
          gridSize: 12
        }
      ]
    },
    {
      label: 'job_information',
      fields: fields.slice(FIELD_INDICES.JOB_INFO_START, FIELD_INDICES.JOB_INFO_END),
      tables: tableConfigs.jobInformationTables
    },
    {
      label: 'experience_information',
      fields: [],
      tables: tableConfigs.experienceInformationTables,
      extraSections: [
        {
          fields: fields.slice(FIELD_INDICES.EXPERIENCE_INFO_START),
          label: 'approve_consent',
          gridSize: 12
        }
      ]
    }
  ]

  /**
   * ✅ Combine base tabs + role tabs
   */
  return [...baseTabs, ...createRoleTabs(scope, tableConfigs)]
}
