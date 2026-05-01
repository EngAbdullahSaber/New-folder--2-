import * as Shared from '@/shared'
import { interviewTableFields } from './field-definitions'

/**
 * Field indices for tab configuration
 */
export const FIELD_INDICES = {
  BASIC_INFO_START: 0,
  BASIC_INFO_END: 28,
  IDENTITY_INFO_START: 22,
  IDENTITY_INFO_END: 27,
  CONTACT_INFO_START: 28,
  CONTACT_INFO_END: 49,
  NATIONAL_ADDRESS_START: 42,
  NATIONAL_ADDRESS_END: 49,
  BANK_INFO_START: 49,
  BANK_INFO_END: 52,
  LANGUAGES_START: 27,
  LANGUAGES_END: 28,
  JOB_INFO_START: 52,
  JOB_INFO_END: 66,
  EXPERIENCE_INFO_START: 66
}

/**
 * Creates tab configuration for the form
 */
export const createTabConfig = (fields: Shared.DynamicFormFieldProps[]) => [
  {
    label: 'basic_information',
    fields: [
      ...fields.slice(FIELD_INDICES.BASIC_INFO_START, FIELD_INDICES.BASIC_INFO_END),
      ...fields.slice(FIELD_INDICES.BANK_INFO_START, FIELD_INDICES.BANK_INFO_END)
    ]
  },
  {
    label: 'contact_information',
    fields: fields.slice(FIELD_INDICES.CONTACT_INFO_START, FIELD_INDICES.CONTACT_INFO_END)
  },
  {
    label: 'job_information',
    fields: fields.slice(FIELD_INDICES.JOB_INFO_START, FIELD_INDICES.JOB_INFO_END)
  },
  {
    label: 'experience_information',
    fields: fields.slice(FIELD_INDICES.EXPERIENCE_INFO_START)
  }
]

/**
 * Creates print tab configuration
 */
export const createPrintTabConfig = (fields: Shared.DynamicFormFieldProps[]) => [
  {
    label: 'basic_information',
    fields: [
      ...fields.slice(FIELD_INDICES.BASIC_INFO_START, FIELD_INDICES.BASIC_INFO_END),
      ...fields.slice(FIELD_INDICES.BANK_INFO_START, FIELD_INDICES.BANK_INFO_END)
    ]
  },
  {
    label: 'contact_information',
    fields: fields.slice(FIELD_INDICES.CONTACT_INFO_START, FIELD_INDICES.CONTACT_INFO_END)
  },
  {
    label: 'job_information',
    fields: fields.slice(FIELD_INDICES.JOB_INFO_START, FIELD_INDICES.JOB_INFO_END)
  },
  {
    label: 'experience_information',
    fields: fields.slice(FIELD_INDICES.EXPERIENCE_INFO_START)
  }
]

/**
 * Creates details configuration for the form
 */
export const createDetailsConfig = (
  experienceFields: Shared.DynamicFormTableFieldProps[],
  courseFields: Shared.DynamicFormTableFieldProps[],
  appSettings?: any
) => [
  {
    key: 'request_nationalities',
    fields: [
      {
        name: 'nationality_id',
        label: 'nationality',
        type: 'select' as const,
        apiUrl: '/def/nationalities',
        labelProp: 'name_ar',
        keyProp: 'id',
        viewProp: 'nationality.name_ar',
        options: appSettings?.app_setting_nationalities?.map((n: any) => ({ value: n.id, label: n.name_ar })) ?? []
      }
    ],
    title: 'application_nationalities'
  },
  {
    key: 'request_desired_jobs',
    fields: [
      {
        name: 'job_id',
        label: 'job',
        type: 'select' as const,
        apiUrl: '/sys/list/21',
        labelProp: 'name',
        keyProp: 'id',
        viewProp: 'job.name',
        options: appSettings?.app_setting_desires ?? []
      }
    ],
    title: 'application_desired_jobs'
  },
  {
    key: 'request_cities',
    fields: [
      {
        name: 'id',
        label: 'city',
        type: 'select' as const,
        apiUrl: '/def/cities',
        labelProp: 'name_ar',
        keyProp: 'id',
        viewProp: 'city.name_ar'
      }
    ],
    title: 'request_cities'
  },
  { key: 'request_experiences', fields: experienceFields, title: 'request_experience' },
  { key: 'request_courses', fields: courseFields, title: 'request_courses' }
]

/**
 * Initial details data structure
 */
export const INITIAL_DETAILS_DATA = {
  request_experiences: [],
  request_nationalities: [],
  request_desired_jobs: [],
  request_courses: [],
  request_cities: [],
  request_desired_job_approvals: []
}

/**
 * Details tables configuration
 */
export const createDetailsTablesConfig = (
  experienceFields: Shared.DynamicFormTableFieldProps[],
  courseFields: Shared.DynamicFormTableFieldProps[]
) => ({
  request_experiences: { fields: experienceFields, trackIndex: true },
  request_courses: { fields: courseFields, trackIndex: true },
  request_desired_job_approvals: { fields: interviewTableFields, trackIndex: true },
  request_cities: {
    fields: [],
    trackIndex: false
  },
  request_nationalities: {
    fields: [],
    trackIndex: false
  },
  request_desired_jobs: {
    fields: [],
    trackIndex: false
  }
})

/**
 * Creates exclude fields configuration
 */
export const createExcludeFields = (fields: Shared.DynamicFormFieldProps[]) => [
  {
    action: 'search' as const,
    fields: [
      { name: 'general_conditions_html', type: 'storage' as const, label: '' },
      { name: 'terms_conditions_html', type: 'storage' as const, label: '' },
      { name: 'privacy_policy_html', type: 'storage' as const, label: '' },
      { name: 'general_conditions', type: 'storage' as const, label: '' }
    ]
  },
  {
    action: 'add' as const,
    fields: [
      ...Shared.getShowModeFields(fields),
      { name: 'general_conditions_html', type: 'storage' as const, label: '' },
      { name: 'terms_conditions_html', type: 'storage' as const, label: '' },
      { name: 'privacy_policy_html', type: 'storage' as const, label: '' },
      { name: 'general_conditions', type: 'storage' as const, label: '' }
    ]
  },
  {
    action: 'edit' as const,
    fields: [
      ...Shared.getShowModeFields(fields),
      { name: 'general_conditions_html', type: 'storage' as const, label: '' },
      { name: 'terms_conditions_html', type: 'storage' as const, label: '' },
      { name: 'privacy_policy_html', type: 'storage' as const, label: '' },
      { name: 'general_conditions', type: 'storage' as const, label: '' }
    ]
  }
]
