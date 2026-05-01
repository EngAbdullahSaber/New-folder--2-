import type { ReactNode } from 'react'

import type { Mode } from '../pageModeType'
import type { DynamicFormFieldProps } from './dynamicFormField'
import type { TabConfig } from './dialogDetailsForm'
import { GroupItem, RatingGroup } from '@/components/shared/dynamicGroupedRatingTable'

/**
 * Configuration for a single column calculation
 * Supports multiple operations and custom transformations
 */
export interface ColumnCalculationConfig {
  /** Operation type: sum, avg, min, max, count, or custom */
  operation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'custom'

  showCurrnecy?: boolean

  /** Optional transformation function to apply to each value before calculation */
  transform?: (value: any) => number

  /** Optional transformation function to apply to the final result */
  finalTransform?: (result: number) => any

  /** Custom calculation function for 'custom' operation type */
  customFunction?: (values: any[], rows: any[]) => any
}

/**
 * Configuration for the calculation row (total/summary row)
 */
export interface CalculationRowConfig {
  /** Enable calculation row */
  enabled?: boolean

  /** Title for the calculation row (e.g., "الإجمالي" for Total) */
  title?: string

  /** Column-wise calculation configurations */
  columns?: {
    [fieldName: string]: ColumnCalculationConfig
  }
}

export interface FieldConfigDetails {
  type: 'input' | 'select' | 'checkbox'
  label: string // For display purposes (column name)
  key: string // For storing value in the row object
  options?: { value: string; label: string }[] // For select fields
  required: boolean
}

export interface DynamicFormTableFieldProps extends DynamicFormFieldProps {
  hideInTable?: boolean
  queryParamsFunction?: (row: Record<string, any>, rowIndex: number) => Record<string, any>
  showWhen?: {
    field: string
    value: string | string[]
    hasValue?: boolean
    operator?: 'equals' | 'notEquals'
  }

  apiUrlFunction?: (row: Record<string, any>, rowIndex: number) => string // ✅ NEW
  resetFieldsOnChange?: string[]
  disableField?: (row: Record<string, any>, rowIndex: number) => boolean
  align?: any
  showInModal?: boolean | ((item: GroupItem, group: RatingGroup, rowData?: any) => boolean)
}

export interface DynamicFormTableProps {
  fields: DynamicFormTableFieldProps[]
  onDataChange: (data: any[]) => void
  title?: string
  initialData?: any[]
  mode: Mode
  errors: any[]
  apiEndPoint?: string
  defaultEmptyRows?: number
  locale?: any
  dataObject?: any
  detailsKey?: string
  children?: ReactNode
  resetKey?: string | number
  rowModal?: boolean
  defaultValueForSearch?: boolean
  rowModalConfig?: {
    tabs?: TabConfig[]
    title?: string
    showDelete?: boolean
    showNotificationSettings?: boolean
  }
  onlyOpenModalonButton?: boolean
  enableDelete?: boolean
  enableEmptyRows?: boolean
  onChangeRow?: (row: any, rowIndex: number, object?: any) => void
  onNewRow?: (row: Record<string, any>, rowIndex: number) => Record<string, any>
  /** Optional calculation row configuration for showing totals/summaries */
  calculationRowConfig?: CalculationRowConfig
}
