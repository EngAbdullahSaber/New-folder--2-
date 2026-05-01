import type { DynamicFormFieldProps } from '@/shared'

type FieldTypeMap = {
  text: string
  select: string
  textarea: string
  number: number
  file: File
  date: Date
  date_time: any
  date_range: any
  checkbox: boolean
  radio: boolean
  slider: []
  email: string
  personal_picture: File
  temp: any
  empty: any
  barcode: string
  password: string
  rich_text: string
  hijri_date: number // ✅ Added - stored as string (8 digits: YYYYMMDD)
  amount: number
  time: string
  mobile: string
  upload_image: string
  storage: string
  iban: number
  toggle: string | any
  multi_file: File[]
  color_picker: string
  icon_picker: string
  iconBadge: string | number
  checkboxToggle: any
  switch: boolean
}

export type InferFieldType<T extends { name: string; type?: keyof FieldTypeMap; defaultValue?: any }[]> = {
  [K in T[number] as K['name']]: K['name'] extends 'id' // Special case for 'id' to default to type 'text' (string) if `type` is undefined
    ? K['defaultValue'] extends undefined
      ? string // default type for 'id' when no defaultValue is specified
      : K['defaultValue'] extends string
        ? string
        : K['defaultValue'] extends number
          ? number
          : K['defaultValue'] extends boolean
            ? boolean
            : K['defaultValue'] extends Array<any>
              ? K['defaultValue']
              : K['defaultValue'] extends Date
                ? Date
                : K['defaultValue'] extends File
                  ? File
                  : unknown
    : K['type'] extends 'email' // Special case for 'email' to treat it as 'text' (string)
      ? string
      : K['type'] extends 'personal_picture' // Handle 'personal_picture' as File
        ? File
        : K['type'] extends 'hijri_date' // ✅ Special case for 'hijri_date' to treat it as string
          ? number
          : // Default case for other fields: infer from defaultValue or type
            K['defaultValue'] extends undefined
            ? K['type'] extends keyof FieldTypeMap
              ? FieldTypeMap[K['type']]
              : unknown
            : K['defaultValue'] extends string
              ? string
              : K['defaultValue'] extends number
                ? number
                : K['defaultValue'] extends boolean
                  ? boolean
                  : K['defaultValue'] extends Array<any>
                    ? K['defaultValue']
                    : K['defaultValue'] extends Date
                      ? Date
                      : K['defaultValue'] extends File
                        ? File
                        : unknown
}
