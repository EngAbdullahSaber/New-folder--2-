/**
 * sharedTypes.ts
 *
 * A TYPES-ONLY re-export module used by SharedFunctions.ts to avoid the circular
 * dependency that would occur if it imported from '@/shared' (which exports SharedFunctions).
 *
 * Only add type exports here — no runtime values.
 */

// Mode types
export type { Mode, SearchMode } from '@/types/pageModeType'

// Form types
export type { UseFormReturn, SubmitHandler, DefaultValues, FieldValues } from 'react-hook-form'

// Component types
export type { DynamicFormFieldProps } from '@/types/components/dynamicFormField'
export type { DynamicTableProps } from '@/types/components/dynamicDataTable'

export type { PaginatedTableProps } from '@/types/components/dynamicTablePagination'
export type { HeaderOption } from '@/types/components/headerOptions'
export type { MenuOption } from '@/types/components/rowOptions'
export type { TabConfig, TabContentProps, DialogDetailsFormContextType } from '@/types/components/dialogDetailsForm'
export type { InferFieldType } from '@/types/generateInterface'
export type { DynamicFormTableFieldProps } from '@/types/components/dynamicFormDetailsTable'

// i18n types
export type { Locale } from '@/configs/i18n'
