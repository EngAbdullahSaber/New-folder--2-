import { DynamicFormFieldProps } from './dynamicFormField'

export interface Option {
  [key: string]: any // This allows dynamic keys
  label: string
  value: string | number | null
  id?: number
}

export interface CustomAutocompleteProps {
  field: DynamicFormFieldProps
  row: Record<string, any>
  rowIndex: number
  handleInputChange: (index: number, field: string, value: any, object?: any) => void
  errors: any
  apiUrl: string
  disabled?: boolean
  initialData?: any[]
  value?: any
  multiple?: boolean
  selectFirstValue?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
}
