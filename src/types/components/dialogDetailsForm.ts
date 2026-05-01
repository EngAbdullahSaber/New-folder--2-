// src/types/dialogDetailsForm.ts
import type { Mode } from '@/shared'

export interface TabContentProps {
  row: any
  rowIndex: number
  dictionary: any
  errors: any[]
  handleInputChange: (index: number, name: string, value: any) => void
  mode: Mode
  tabConfig?: TabConfig
}

export interface TabConfig {
  key: string
  label: string
  enabled?: boolean | ((row: any) => boolean)
  component?: React.ComponentType<TabContentProps>
  fields?: any[]
}

export interface DialogDetailsFormContextType {
  row: any
  rowIndex: number
  fields: any[]
  dictionary: any
  errors: any[]
  handleInputChange: (index: number, name: string, value: any) => void
  tabs?: TabConfig[]
  mode: Mode
}
