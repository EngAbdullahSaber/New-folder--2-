// utils/filterObject.ts
// ✅ Import types via @/types/sharedTypes to break the circular dependency:
//    SharedFunctions is exported FROM @/shared, so importing @/shared here would be circular.
import * as Shared from '@/types/sharedTypes'
import { ibanLengths, countryNamesAr } from '@/utils/common-static-list'
import { getLocalizedUrl } from '@/utils/i18n'

import { ExportToExcelOptions } from '@/types/file'
import { isArray, xor } from 'lodash'
import {
  any,
  array,
  BaseSchema,
  boolean,
  custom,
  date,
  email,
  file,
  is,
  length,
  maxLength,
  minLength,
  nonEmpty,
  nullable,
  number,
  object,
  optional,
  pipe,
  regex,
  string,
  transform,
  union
} from 'valibot'

import ExcelJS from 'exceljs'
import JsBarcode from 'jsbarcode'
import { Mode } from '@/types/sharedTypes'
import { excludedPaths } from '@/utils/constants'

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates Saudi mobile number format (9 digits starting with 5 or 10 digits starting with 05)
 */
export const isValidMobile = (mobile: string): boolean => {
  if (!mobile) return false
  const cleanValue = String(mobile).replace(/[\s\-\(\)]/g, '')
  const saudiMobileRegex = /^(05|5)\d{8}$/
  const internationalRegex = /^(\+?966|00966)5\d{8}$/
  return saudiMobileRegex.test(cleanValue) || internationalRegex.test(cleanValue)
}

// export const filterObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
//   console.log(obj)

//   // Filter out properties that are undefined, empty strings, or empty arrays
//   const filteredEntries = Object.entries(obj).filter(([key, value]) => {
//     // Check if the value is not undefined, empty string, or empty array
//     // //console.log(obj.personal_picture)
//     if (value === undefined || value === '' || value === null || obj[key] instanceof File) return false
//     if (value instanceof Date) return true

//     // If value is an array, handle it recursively
//     if (Array.isArray(value)) {
//       // Remove empty objects or empty arrays from the array
//       const filteredArray = value.filter(item => {
//         // Recursively filter objects and arrays inside the array
//         if (typeof item === 'object') {
//           return Object.keys(filterObject(item)).length > 0 // Non-empty objects
//         }
//         return item !== undefined && item !== '' && item !== null // Keep non-empty primitive values
//       })
//       return filteredArray.length > 0 ? true : false // Keep array if it's not empty after filtering
//     }

//     // Check if it's an object and recursively filter it
//     if (typeof value === 'object' && value !== null) {
//       //console.log(value)
//       const filteredObject = filterObject(value) // Recursively filter nested objects
//       return Object.keys(filteredObject).length > 0 // Keep object if it's non-empty
//     }

//     return true // Keep other non-empty values (like numbers, strings)
//   })
//   //console.log(filteredEntries)
//   // Return the filtered object (using type assertion to Partial<T>)
//   return Object.fromEntries(filteredEntries) as Partial<T>
// }

export const filterObject = <T extends Record<string, any>>(
  obj: T,
  fields?: { name: string; modal?: string }[],
  mode?: string,
  seen = new WeakSet<object>(),
  keepEmptyArrays = false
): Partial<T> => {
  if (typeof obj !== 'object' || obj === null) return obj
  if (seen.has(obj)) return {}

  seen.add(obj)

  const fieldMap = fields ? new Map(fields.map(f => [f.name, f])) : undefined
  const result: Record<string, any> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === '' || value === null) return

    if (value instanceof Date) {
      result[key] = value
      return
    }

    if (Array.isArray(value)) {
      const cleanedArray = value
        .map(item =>
          typeof item === 'object' && item !== null ? filterObject(item, fields, mode, seen, keepEmptyArrays) : item
        )
        .filter(
          item =>
            item !== undefined &&
            item !== '' &&
            item !== null &&
            (typeof item !== 'object' || Object.keys(item).length > 0)
        )

      if (cleanedArray.length || keepEmptyArrays) {
        result[key] = cleanedArray
      }
      return
    }

    if (typeof value === 'object') {
      const cleanedObject = filterObject(value, fields, mode, seen)
      if (Object.keys(cleanedObject).length) result[key] = cleanedObject
      return
    }

    result[key] = value
  })

  if (fields && mode === 'search') {
    const transformed: Record<string, any> = {}
    Object.entries(result).forEach(([key, value]) => {
      const modal = fieldMap?.get(key)?.modal
      transformed[modal ? `${modal}.${key}` : key] = value
    })
    return transformed as Partial<T>
  }

  return result as Partial<T>
}

export const formatDatesInPayload = <T>(payload: T): T => {
  if (payload instanceof Date) {
    return formatDateToYMD(payload) as T
  }

  if (Array.isArray(payload)) {
    return payload.map(item => formatDatesInPayload(item)) as T
  }

  if (typeof payload === 'object' && payload !== null) {
    const result: Record<string, any> = {}

    Object.entries(payload).forEach(([key, value]) => {
      result[key] = formatDatesInPayload(value)
    })

    return result as T
  }

  return payload
}

export const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const objectToFormData = (obj: any, formData = new FormData(), parentKey = '') => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const formKey = parentKey ? `${parentKey}[${key}]` : key

      if (value && typeof value === 'object' && !(value instanceof File)) {
        // Recursively process nested objects
        objectToFormData(value, formData, formKey)
      } else {
        // Append key-value pairs to FormData
        formData.append(formKey, value)
      }
    }
  }

  formData.forEach(res => {
    //console.log(res, 'objecttoform')
  })
  return formData
}

export const filterArray = <T extends Record<string, any>>(arr: T[]): T[] => {
  //console.log(arr) // To inspect the array
  // Check if arr is indeed an array
  if (!Array.isArray(arr)) {
    console.error('Expected an array, but got:', arr) // Log an error if it's not an array
    return [] // Return an empty array if the input is not an array
  }

  return arr.filter(item => {
    // Check if the item is an object
    if (typeof item === 'object' && item !== null) {
      // Filter out the object if it has no keys or all keys are undefined, null, or empty
      const hasValidKeys = Object.entries(item).some(
        ([_, value]) => value !== undefined && value !== null && value !== ''
      )
      return hasValidKeys // Keep the item if it has any valid key-value pair
    }
    return false // Exclude non-object items (if needed)
  })
}

export const getCurrentMoodOperation = (mode: Shared.Mode) => {
  switch (mode) {
    case 'add':
      return 'add'
      break
    case 'search':
      return 'search'
      break
    case 'show':
      return 'show'
      break
    case 'edit':
      return 'edit'
      break

    default:
      return ''
      console.warn(`Unhandled mode: ${mode}`)
  }
}

// src/shared/formUtils.ts

export const resetForm = (formMethods: Shared.UseFormReturn<any>, mode: string, fields: string[]) => {
  const defaultValues =
    mode === 'add' || mode === 'search'
      ? Object.fromEntries(fields.map(field => [field, ''])) // Clear specified fields for add/search mode
      : undefined // Use undefined to reset to initial default values

  formMethods.reset(defaultValues) // Reset with either cleared values or initial values

  fields.forEach(field => formMethods.clearErrors(field)) // Clear errors for specified fields
}

/**
 * Auto fills form fields from an API response data object
 * @param formMethods react-hook-form methods (setValue)
 * @param fields array of dynamic form fields to map
 * @param data source data object from API
 * @param options optional mapping and transformation functions
 */
export const autoFillForm = (
  formMethods: { setValue: (name: any, value: any) => void },
  fields: Shared.DynamicFormFieldProps[],
  data: Record<string, any>,
  options?: {
    customMappings?: Record<string, (data: any) => void>
    detailsKeys?: string[]
    updateDetailsData?: (key: string, value: any) => void
  }
) => {
  if (!data) return

  const { setValue } = formMethods

  fields.forEach(field => {
    const fieldName = field.name

    // 1. Check for custom mapping
    if (options?.customMappings?.[fieldName]) {
      options.customMappings[fieldName](data)
      return
    }

    // 2. Direct name mapping
    if (Object.prototype.hasOwnProperty.call(data, fieldName)) {
      setValue(fieldName as any, data[fieldName])
    }

    // 3. Object-to-ID mapping (e.g., if field is 'city_id' and data has 'city' object)
    const objectKey = fieldName.endsWith('_id') ? fieldName.slice(0, -3) : null
    if (objectKey && data[objectKey]) {
      // Set the ID field
      const idValue = typeof data[objectKey] === 'object' ? data[objectKey].id : data[objectKey]
      setValue(fieldName as any, idValue)

      // Also set the object itself (useful for Select/Autocomplete that might need the whole object for display)
      setValue(objectKey as any, data[objectKey])
    }
  })

  // 4. Handle Details Tables
  if (options?.detailsKeys && options?.updateDetailsData) {
    options.detailsKeys.forEach(key => {
      if (data[key] && Array.isArray(data[key])) {
        options.updateDetailsData!(key, data[key])
      }
    })
  }
}

// // Function to generate schema builder dynamically based on the fields configuration
// export const generateSchemaBuilder = (fields: DynamicFormFieldProps[], mode: Mode) => {
//   const schemaFields = fields.reduce((acc: any, field) => {
//     acc[field.name] = typeof field.validation === 'function' ? field.validation(mode) : field.validation

//     return acc
//   }, {})

//   return object(schemaFields)
// }

// export const generateSchemaBuilder = (fields: DynamicFormFieldProps[], mode: Mode) => {
//   const schemaFields = fields.reduce((acc: any, field) => {
//     // Apply default validation if none exists based on requiredModes
//     // //console.log(fields)
//     console.log('field.validation')
//     if (!field.validation) {
//       if (field.requiredModes && field.requiredModes.includes(mode)) {
//         console.log('field.validation')
//         field.validation = () => pipe(getFiledType(field), nonEmpty('هذا الحقل مطلوب'))
//       } else {
//         // console.log('field.validation')
//         field.validation = () => optional(any())
//       }
//     }

//     // If the validation is a function, execute it with the mode
//     acc[field.name] = typeof field.validation === 'function' ? field.validation(mode) : field.validation
//     // //console.log(acc)
//     return acc
//   }, {})

//   // // Exclude 'id' field from the schema if it exists in fields array

//   return object(schemaFields)
// }

export const generateSchemaBuilder = (
  fields: Shared.DynamicFormFieldProps[],
  mode: Mode,
  formValues: Record<string, any> = {}
) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    return object({})
  }

  const safeValues = formValues ?? {}

  const schemaFields = fields.reduce((acc: any, field) => {
    if (!field?.name) return acc

    // ✅ NEW: Check if field is visible
    const visible = isFieldVisible(field, mode, safeValues)

    // ✅ If not visible, make it optional (no validation)
    if (!visible) {
      acc[field.name] = optional(any())
      return acc
    }

    let schema

    // 1️⃣ Custom validation
    if (field.validation) {
      schema = typeof field.validation === 'function' ? field.validation(mode, safeValues) : field.validation
    }

    // 2️⃣ requiredModeCondition (dynamic required based on form values)
    else if (field.requiredModeCondition) {
      let isRequired = false

      try {
        isRequired = field.requiredModeCondition(mode, safeValues)
      } catch (e) {
        console.error(`❌ requiredModeCondition error [${field.name}]`, e)
      }

      if (isRequired) {
        if ((field.type === 'file' || field.type === 'personal_picture') && !field.extraField) {
          schema = custom((value: any) => {
            const files = safeValues?.files || []
            return Array.isArray(files) && files.some((f: any) => f?.description === field.name)
          }, 'هذا الحقل مطلوب')
        } else {
          schema = pipe(
            getFiledType(field, safeValues),
            custom(v => v !== null && v !== undefined && v !== '', 'هذا الحقل مطلوب')
          )
        }
      } else {
        schema = optional(any())
      }
    }

    // 3️⃣ Legacy requiredModes
    else if (field.requiredModes?.includes(mode)) {
      if ((field.type === 'file' || field.type === 'personal_picture') && !field.extraField) {
        schema = custom((value: any) => {
          const files = safeValues?.files || []
          return Array.isArray(files) && files.some((f: any) => f?.description === field.name)
        }, 'هذا الحقل مطلوب')
      } else {
        schema = pipe(
          getFiledType(field, safeValues),
          custom(v => v !== null && v !== undefined && v !== '', 'هذا الحقل مطلوب')
        )
      }
    }

    // 4️⃣ Optional
    else {
      schema = optional(any())
    }

    acc[field.name] = schema
    return acc
  }, {})

  return object(schemaFields)
}

const getFiledType = (field: Shared.DynamicFormFieldProps, formValues: Record<string, any> = {}) => {
  switch (field.type) {
    case 'text':
    case 'password':
      // ✅ Add length validation for text fields
      let textSchema = string('هذا الحقل مطلوب')

      if (field.minLength !== undefined) {
        textSchema = pipe(
          textSchema,
          minLength(field.minLength, `يجب أن يكون الحد الأدنى ${field.minLength} أحرف`)
        ) as any
      }

      if (field.maxLength !== undefined) {
        textSchema = pipe(
          textSchema,
          maxLength(field.maxLength, `يجب أن يكون الحد الأقصى ${field.maxLength} أحرف`)
        ) as any
      }

      if (field.length !== undefined) {
        textSchema = pipe(textSchema, length(field.length, `يجب أن يكون ${field.length} أحرف بالضبط`)) as any
      }

      if (field.validateIban) {
        textSchema = pipe(
          textSchema,
          custom((value: any) => {
            return validateIBAN(value, field.acceptedIbans)
          }, getIbanErrorMessage(field.acceptedIbans))
        ) as any
      }

      return textSchema

    case 'iban':
      let ibanSchema = pipe(
        optional(nullable(union([string('هذا الحقل مطلوب'), number('هذا الحقل مطلوب')]))),
        transform(value => (value == null ? '' : String(value).replace(/\s/g, ''))), // Remove spaces
        nonEmpty('هذا الحقل مطلوب'),
        custom((value: any) => {
          return validateIBAN(value, field.acceptedIbans)
        }, getIbanErrorMessage(field.acceptedIbans))
      ) as BaseSchema<any, any, any>

      return ibanSchema

    case 'email':
      return pipe(string('هذا الحقل مطلوب'), nonEmpty('هذا الحقل مطلوب'), email('يرجى إدخال بريد إلكتروني صحيح'))

    case 'mobile':
      return pipe(
        optional(nullable(union([string('هذا الحقل مطلوب'), number('هذا الحقل مطلوب')]))),
        transform(value => (value == null ? '' : String(value))),
        nonEmpty('هذا الحقل مطلوب'),
        custom((value: any) => {
          // Remove any non-digit characters for validation
          const cleanValue = String(value).replace(/\D/g, '')

          // Saudi mobile number validation
          // Should start with 05 and be 10 digits total
          // Format: 05XXXXXXXX
          const saudiMobileRegex = /^05\d{8}$/

          // Alternative: International format +966 or 00966
          // +966XXXXXXXXX or 00966XXXXXXXXX (after 966, should be 9 digits starting with 5)
          const internationalRegex = /^(\+?966|00966)5\d{8}$/

          return saudiMobileRegex.test(cleanValue) || internationalRegex.test(cleanValue)
        }, 'رقم الجوال غير صحيح. يجب أن يبدأ بـ 05 ويتكون من 10 أرقام')
      ) as BaseSchema<any, any, any>

    case 'time':
      return pipe(
        optional(nullable(string('هذا الحقل مطلوب'))),
        transform(value => (value == null ? '' : String(value))),
        nonEmpty('هذا الحقل مطلوب'),
        custom((value: any) => {
          // Accept HH:mm or HH:mm:ss
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/
          return timeRegex.test(value)
        }, 'الوقت غير صحيح')
      ) as BaseSchema<any, any, any>

    case 'date':
      return pipe(
        optional(nullable(union([string('هذا الحقل مطلوب'), date('هذا الحقل مطلوب')]))),
        transform(value => (value == null ? '' : String(value))),
        nonEmpty('هذا الحقل مطلوب')
      ) as BaseSchema<any, any, any>

    case 'hijri_date':
      return pipe(
        optional(nullable(union([string('هذا الحقل مطلوب'), number('هذا الحقل مطلوب')]))),
        transform(value => {
          if (value == null) return null
          return typeof value === 'number' ? value : parseInt(String(value), 10)
        }),
        custom((value: any) => {
          if (!value) return false

          const valueStr = String(value).padStart(8, '0')
          if (valueStr.length !== 8) return false

          const year = parseInt(valueStr.slice(0, 4))
          const month = parseInt(valueStr.slice(4, 6))
          const day = parseInt(valueStr.slice(6, 8))

          if (year < 1300 || year > 1500) return false
          if (month < 1 || month > 12) return false
          if (day < 1 || day > 30) return false

          return true
        }, 'التاريخ الهجري غير صحيح')
      ) as BaseSchema<any, any, any>

    case 'number':
    case 'amount':
    case 'slider':
      // ✅ Add min/max validation for number fields
      let numberSchema = pipe(
        optional(nullable(union([string('هذا الحقل مطلوب'), number('هذا الحقل مطلوب')]))),
        transform(value => (value == null ? '' : String(value))),
        nonEmpty('هذا الحقل مطلوب'),
        custom((value: any) => {
          const num = Number(value)
          return !isNaN(num)
        }, 'يجب إدخال رقم صحيح')
      ) as BaseSchema<any, any, any>

      if (field.minLength !== undefined) {
        numberSchema = pipe(
          numberSchema,
          custom((value: any) => {
            const num = Number(value)
            return num >= field.minLength!
          }, `القيمة يجب أن تكون ${field.minLength} أو أكثر`)
        ) as BaseSchema<any, any, any>
      }

      if (field.maxLength !== undefined) {
        numberSchema = pipe(
          numberSchema,
          custom((value: any) => {
            const num = Number(value)
            return num <= field.maxLength!
          }, `القيمة يجب أن تكون ${field.maxLength} أو أقل`)
        ) as BaseSchema<any, any, any>
      }

      return numberSchema

    case 'file':
      // ✅ Handle file validation for extraField only (normal files handled above)
      if (field.extraField) {
        if (field.multiple) {
          return pipe(
            optional(nullable(any())),
            transform(value => (Array.isArray(value) ? value : [])),
            array(string('هذا الحقل مطلوب')),
            minLength(1, 'هذا الحقل مطلوب')
          )
        }

        return pipe(
          optional(nullable(any())),
          transform(value => (value == null ? '' : String(value))),
          nonEmpty('هذا الحقل مطلوب')
        )
      } else {
        // For normal files, just return any() - validation handled in generateSchemaBuilder
        return any()
      }

    case 'personal_picture':
      // For personal_picture, just return any() - validation handled in generateSchemaBuilder
      return any()

    case 'select':
      // ✅ Multi select with submitLovKeyProp (array of objects)
      if (field.multiple && field.submitLovKeyProp) {
        return pipe(
          optional(nullable(any())),
          transform(value => (Array.isArray(value) ? value : [])),
          array(any()), // Array of anything
          custom((value: unknown) => {
            if (!Array.isArray(value) || value.length === 0) return false

            return value.every(item => {
              if (typeof item === 'object' && item !== null) {
                // If the key exists, check it's not null/undefined
                if (field.submitLovKeyProp! in item) {
                  return item[field.submitLovKeyProp!] !== null && item[field.submitLovKeyProp!] !== undefined
                } else {
                  // Key doesn't exist, consider it valid (or change this to false if you want strict validation)
                  return true
                }
              } else {
                // For primitive values, just ensure not null/undefined
                return item !== null && item !== undefined
              }
            })
          }, 'يرجى اختيار قيم صحيحة')
        ) as BaseSchema<any, any, any>
      }

      // ✅ Multi select without submitLovKeyProp (array of IDs)
      if (field.multiple) {
        return pipe(
          optional(nullable(any())),
          transform(value => (Array.isArray(value) ? value : [])),
          array(union([string('هذا الحقل مطلوب'), number('هذا الحقل مطلوب')])),
          minLength(1, 'هذا الحقل مطلوب')
        ) as BaseSchema<any, any, any>
      }

      // ✅ Single select
      return pipe(
        optional(nullable(union([string('هذا الحقل مطلوب'), number('هذا الحقل مطلوب')]))),
        transform(value => (value == null ? '' : String(value))),
        nonEmpty('هذا الحقل مطلوب')
      ) as BaseSchema<any, any, any>
    case 'checkbox':
    case 'switch':
      return boolean('هذا الحقل مطلوب')

    case 'radio':
      return pipe(
        optional(nullable(string('هذا الحقل مطلوب'))),
        transform(value => (value == null ? '' : String(value))),
        nonEmpty('هذا الحقل مطلوب')
      ) as BaseSchema<any, any, any>

    case 'rich_text':
    case 'textarea':
      // ✅ Add length validation for textarea/rich_text fields
      let textareaSchema = string('هذا الحقل مطلوب')

      if (field.minLength !== undefined) {
        textareaSchema = pipe(
          textareaSchema,
          minLength(field.minLength, `يجب أن يكون الحد الأدنى ${field.minLength} أحرف`)
        ) as any
      }

      if (field.maxLength !== undefined) {
        textareaSchema = pipe(
          textareaSchema,
          maxLength(field.maxLength, `يجب أن يكون الحد الأقصى ${field.maxLength} أحرف`)
        ) as any
      }

      if (field.length !== undefined) {
        textareaSchema = pipe(textareaSchema, length(field.length, `يجب أن يكون ${field.length} أحرف بالضبط`)) as any
      }

      return textareaSchema

    default:
      return any()
  }
}
// Make sure this function doesn't return null
export const adjustValidationForMode = (
  fields: Shared.DynamicFormFieldProps[],
  mode: Shared.Mode
): Shared.DynamicFormFieldProps[] => {
  // ✅ Guard against null/undefined
  if (!fields || !Array.isArray(fields)) {
    console.error('❌ adjustValidationForMode: fields is null or not an array')
    return []
  }

  return fields.map(field => {
    // ✅ Skip invalid fields
    if (!field) return field

    // Your existing logic...
    return field
  })
}

const getDefaultValueByType = (type: string): any => {
  switch (type) {
    case 'text':
    case 'select':
    case 'textarea':
      return ''
    case 'number':
    case 'amount':
    case 'slider':
      return undefined
    case 'file':
    case 'personal_picture':
      return undefined
    case 'date':
      return null
    case 'checkbox':
    case 'radio':
    case 'switch':
      return false
    default:
      return null
  }
}

export const generateDefaultValues = (fields: Shared.DynamicFormFieldProps[], mode: string) => {
  return fields.reduce((acc: any, field) => {
    acc[field.name] =
      field.name === 'id' && field.type === undefined && mode === 'search'
        ? ''
        : field.defaultValue !== undefined
          ? mode !== 'search'
            ? field.defaultValue
            : ''
          : getDefaultValueByType(field.type || '')
    return acc
  }, {})
}

// في shared/utils أو في نفس الملف
export const isFieldVisible = (
  field: Shared.DynamicFormFieldProps,
  mode: Mode,
  formValues: Record<string, any> = {}
): boolean => {
  // 1️⃣ Check field.visible (legacy boolean)
  if (field.visible === false) {
    return false
  }

  // 2️⃣ Check visibleModes (legacy array)
  if (field.visibleModes && !field.visibleModes.includes(mode)) {
    return false
  }

  // 3️⃣ Check visibleModeCondition (NEW)
  if (field.visibleModeCondition) {
    try {
      const isVisible = field.visibleModeCondition(mode, formValues)
      if (!isVisible) return false
    } catch (e) {
      console.error(`❌ visibleModeCondition error [${field.name}]`, e)
      return false
    }
  }

  // 4️⃣ Check visibleCondition (NEW)
  if (field.visibleCondition) {
    try {
      const isVisible = field.visibleCondition(formValues)
      if (!isVisible) return false
    } catch (e) {
      console.error(`❌ visibleCondition error [${field.name}]`, e)
      return false
    }
  }

  return true
}

export const getGridSize = (
  mode: Shared.Mode,
  customGridSize?:
    | number
    | {
        defaultGridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
        [key: string]: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number } | undefined
      }
    | ((mode: Shared.Mode) => { xs?: number; sm?: number; md?: number; lg?: number; xl?: number })
) => {
  // //console.log('Input Mode:', mode)
  // //console.log('Custom Grid Size:', customGridSize)

  const fallbackGridSize = { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }

  if (typeof customGridSize === 'function') {
    const result = customGridSize(mode)
    //console.log('Function Result:', result)
    return result || fallbackGridSize
  }

  if (typeof customGridSize === 'number') {
    // //console.log('Number Input Detected:', customGridSize)
    const calculateSize = (value: number, type: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
      if (type === 'xs') return 12
      if (type === 'md') {
        if (value >= 1 && value <= 6) return value * 2
        if (value >= 7 && value <= 12) return 12
      }
      if (type === 'sm') {
        if (value >= 1 && value <= 3) return value * 4
        if (value >= 4 && value <= 12) return 12
      }
      return value
    }
    // //console.log('computedSize', customGridSize)
    const computedSize = {
      xs: calculateSize(customGridSize, 'xs'),
      sm: calculateSize(customGridSize, 'sm'),
      md: calculateSize(customGridSize, 'md'),
      lg: customGridSize,
      xl: customGridSize
      // md: customGridSize,
      // sm: customGridSize
    }
    // //console.log('Computed Grid Size for Number:', computedSize)
    return computedSize
  }

  if (customGridSize) {
    // //console.log('Object Input Detected:', customGridSize)
    const result = customGridSize[mode] || customGridSize.defaultGridSize || fallbackGridSize
    // //console.log('Resolved Object Grid Size:', result)
    return result
  }

  // //console.log('Fallback Grid Size:', fallbackGridSize)
  return fallbackGridSize
}

const calculateSize = (value: number, type: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  if (type === 'xs') return 12
  if (type === 'md') {
    if (value >= 1 && value <= 6) return value * 2
    if (value >= 7 && value <= 12) return 12
  }
  if (type === 'sm') {
    if (value >= 1 && value <= 3) return value * 4
    if (value >= 4 && value <= 12) return 12
  }
  return value
}

export const formatErrors = (errorData: any, sentRowsMap?: Record<string, number[]>) => {
  // ✅ استخدم Map لتجميع الأخطاء بدل array
  const errorsMap = new Map<string, any>()

  if (errorData && errorData.errors) {
    for (const key in errorData.errors) {
      const parts = key.split('.')

      // ✅ تحقق إن الـ key فيه على الأقل 3 أجزاء
      if (parts.length < 3) continue

      const detailsKey = parts[0]
      const backendRowIndex = parseInt(parts[1])
      const fieldName = parts.slice(2).join('.') // ✅ دعم nested fields

      if (isNaN(backendRowIndex) || !fieldName) continue

      // ✅ المشكلة 1: الربط الصحيح بين backend index و frontend index
      let frontendRowIndex = backendRowIndex

      if (sentRowsMap && sentRowsMap[detailsKey]) {
        const sentIndices = sentRowsMap[detailsKey]

        // ✅ الـ backend بيرجع index متسلسل (0,1,2...)
        // الـ sentRowsMap[detailsKey][backendIndex] = frontend original index
        const mappedIndex = sentIndices[backendRowIndex]

        if (mappedIndex !== undefined && mappedIndex !== -1) {
          frontendRowIndex = mappedIndex
          console.log(`✅ Mapped ${detailsKey}[${backendRowIndex}] → frontend row [${frontendRowIndex}]`)
        } else {
          console.warn(`❌ No mapping for ${detailsKey}[${backendRowIndex}]`, sentIndices)
        }
      }

      // ✅ المشكلة 2: تجميع الأخطاء في object واحد لكل row+field
      const mapKey = `${detailsKey}__${frontendRowIndex}__${fieldName}`
      const messages = errorData.errors[key]

      if (errorsMap.has(mapKey)) {
        // ✅ أضف الرسائل الجديدة للـ object الموجود
        const existing = errorsMap.get(mapKey)
        existing.message = [existing.message, ...messages].join(' | ')
      } else {
        // ✅ أنشئ object جديد
        errorsMap.set(mapKey, {
          detailsKey,
          rowIndex: frontendRowIndex,
          fieldName,
          message: messages.join(' | ')
        })
      }
    }
  }

  const result = Array.from(errorsMap.values())
  console.log('📋 Formatted errors:', result)
  return result
}

// export const getChangedRows = (detailsArray: any[], detailsFields? :any[]) => {
//   // Filter rows where `rowChanged` is true
//   // return detailsArray
//   const changedRows = detailsArray.filter((row: any) => row.rowChanged === true)

//   // Remove the `rowChanged` property from each changed row
//   const rowsWithoutRowChanged = changedRows.map((row: any) => {
//     const { rowChanged, isNew, ...rest } = row // Destructure to remove `rowChanged`
//     return rest // Return the row without `rowChanged`
//   })

//   return rowsWithoutRowChanged
// }

export const getChangedRows = (detailsArray: any[], detailsFields: any[] = []) => {
  const allowedFieldNames = detailsFields.map(field => field.name)

  return detailsArray
    .filter(row => row.rowChanged === true)
    .map(row => {
      const cleanRow: Record<string, any> = {}

      // ✅ نسخ الحقول المسموحة فقط
      allowedFieldNames.forEach(fieldName => {
        // تجاهل الحقول المحجوزة
        if (
          row[fieldName] !== undefined &&
          fieldName !== 'rowChanged' &&
          fieldName !== 'isNew' &&
          fieldName !== 'tempId'
        ) {
          cleanRow[fieldName] = row[fieldName]
        }
      })

      // ✅ إضافة id إذا كان موجود (للتعديل)
      if (row.id !== undefined && row.id !== null) {
        cleanRow.id = row.id
      }

      // ✅ إضافة tempId فقط للصفوف الجديدة (بدون id)
      if (row.tempId !== undefined && row.id === undefined) {
        cleanRow.tempId = row.tempId
      }

      return cleanRow
    })
}

const resolveOriginalIndex = (detailData: any[], changedRow: any) => {
  if (changedRow.id) {
    return detailData.findIndex(r => r.id === changedRow.id)
  }

  if (changedRow.tempId) {
    return detailData.findIndex(r => r.tempId === changedRow.tempId)
  }

  return detailData.findIndex(row =>
    Object.keys(changedRow).every(k => !['rowChanged', 'isNew', 'tempId'].includes(k) && row[k] === changedRow[k])
  )
}

export const scrollToTop = () => {
  const anchor = document.querySelector('body')

  if (anchor) {
    anchor.scrollIntoView({ behavior: 'smooth' })
  }
}

export const getRecordInformationAsset = (process: number): any => {
  switch (process) {
    case 1:
      return { label: 'إضافة', icon: 'ri-user-add-fill', color: '#666CFF' }
    case 2:
      return { label: 'اخر تحديث', icon: 'ri-edit-line', color: '#FDC453' }
    case 3:
      return { label: 'حذف', icon: 'ri-delete-bin-2-fill', color: '#E64542' }

    default:
      return {} // Fallback for any unexpected types
  }
}

export const getRecordTrackingAsset = (process: number): any => {
  switch (process) {
    case 1:
      return { label: 'إضافة', icon: 'ri-user-add-fill', color: '#666CFF' }
    case 2:
      return { label: 'تعديل', icon: 'ri-edit-line', color: '#FDC453' }
    case 3:
      return { label: 'حذف', icon: 'ri-delete-bin-2-fill', color: '#E64542' }

    default:
      return {} // Fallback for any unexpected types
  }
}

export const maskNumber = (number: string | number): string => {
  let numStr = number.toString() // Ensure it's a string
  return '*'.repeat(numStr.length - 3) + numStr.slice(-3)
}

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')

  if (!localPart || !domain) return email // Handle invalid emails

  return localPart[0] + '*'.repeat(Math.max(localPart.length - 2, 1)) + localPart.slice(-1) + '@' + domain
}

export const checkUserValidation = async (user: any, locale: Shared.Locale): Promise<string> => {
  // ✅ Add delay to ensure everything is ready
  await new Promise(resolve => setTimeout(resolve, 100))

  if (!user) return getLocalizedUrl('/login', locale)

  if (Number(user.password_changed) === 2) {
    return getLocalizedUrl('/change-password', locale)
  }

  const hasChannels = user['channels'] && Array.isArray(user['channels'])
  const hasSms = hasChannels && user['channels'].includes('sms')
  const hasEmail = hasChannels && user['channels'].includes('email')

  if (hasSms && hasEmail) {
    return getLocalizedUrl('/login-verification-code?sms_verify=true&email_verify=true', locale)
  }

  if (hasSms && !hasEmail) {
    return getLocalizedUrl('/login-verification-code?sms_verify=true', locale)
  }

  if (!hasSms && hasEmail) {
    return getLocalizedUrl('/login-verification-code?email_verify=true', locale)
  }

  if (user.acceptance?.id) {
    return getLocalizedUrl('/policy-agreement', locale)
  }

  return getLocalizedUrl('/apps/dashboard/home', locale)
}

export const getFileByDescription = (files: any[], description: string) => {
  if (!Array.isArray(files)) return null
  return files.find(file => file.description === description) || null
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return false
  } else {
    return true
  }
}

export const getShareHolderStatus = (status: any) => {
  if (!status) {
    return {
      label: 'غير محدد',
      variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
      color: 'error' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    }
  }
  switch (status.id) {
    case 1:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 2:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 3:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 4:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 5:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 6:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 7:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    default:
      return {
        label: status.status_desc,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'secondary' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
  }
}

export const getShareHolderSignature = (signature: any) => {
  if (!signature) {
    return {
      label: 'غير محدد',
      variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
      color: 'error' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    }
  }
  switch (signature.status) {
    case 1:
      return {
        label: signature.caption,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    default:
      return {
        label: signature.caption,
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'secondary' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
  }
}

export const getInheritOrderStatus = (status: any) => {
  if (!status) {
    return {
      label: 'غير محدد',
      variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
      color: 'error' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    }
  }
  switch (status) {
    case 1:
      return {
        label: 'جديد',
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'info' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 4:
      return {
        label: 'منفذ',
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    case 5:
      return {
        label: 'ملغى',
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'success' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
    default:
      return {
        label: 'غير محدد',
        variant: 'tonal' as 'filled' | 'outlined' | 'tonal',
        color: 'secondary' as 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
      }
  }
}

export function getItemFromStaticListByValue(value: string | boolean, list: any[]): any {
  if (!value && Number(value) !== 0) {
    return {
      value: null,
      label: 'غير محدد',
      color: 'error'
    }
  }
  return (
    list.find(item => String(item.value) === String(value) || String(item.apiValue) === String(value)) ?? {
      value: null,
      label: 'غير محدد',
      color: 'error'
    }
  )
}
export const parseSearchString = (searchQuery: string): Record<string, any> => {
  if (!searchQuery) return {}

  const params = new URLSearchParams(searchQuery)
  const result: Record<string, any> = {}
  params.forEach((value, key) => {
    if (key === 'extra_fields') {
      try {
        result[key] = JSON.parse(value) // Parse the JSON string
      } catch (error) {
        result[key] = {}
      }
    } else {
      result[key] = value
    }
  })

  return result
}

type ApiField = {
  name: string
  type: any
  label: string | null
  is_required?: number | boolean
  is_multiple?: number | boolean
  options?: any[]
}

type FormField = {
  name: string
  label: string
  type: string
  requiredModes?: Array<'add' | 'edit'>
  modeCondition: (mode: Shared.Mode) => Shared.Mode
  gridSize: number
  options?: any[]
  multiple?: boolean
  extraField: boolean
  visibleModes?: Array<'add' | 'edit'>
}

export const normalizeOptions = (options: any) => {
  if (Array.isArray(options)) return options

  if (typeof options !== 'string') return []

  try {
    const cleaned = options
      .trim()
      .replace(/\n/g, '') // remove new lines
      .replace(/\s+/g, ' ') // collapse spaces
      .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":') // keys → "key":
      .replace(/'/g, '"') // single → double quotes
      .replace(/,\s*]/g, ']') // trailing comma

    const parsed = JSON.parse(cleaned)

    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Invalid options format:', options)
    return []
  }
}

export const mapApiFieldsToFormSchema = <T extends ApiField>(fields: T[]): FormField[] => {
  const result: FormField[] = []

  fields.forEach(field => {
    const baseField: FormField = {
      name: field.name,
      label: field.label ?? '',
      type: field.type,
      modeCondition: (mode: Shared.Mode) => mode,
      gridSize: 4,
      extraField: true
    }

    // required
    if (field.is_required) {
      baseField.requiredModes = ['add', 'edit']
    }

    // select | checkbox | radio
    if (['select', 'checkbox', 'radio'].includes(field.type)) {
      baseField.options = normalizeOptions(field.options)
    }

    // select + multiple
    if (field.type === 'select' && field.is_multiple) {
      baseField.multiple = true
    }

    result.push(baseField)

    // file → extra field
    // if (field.type === 'file') {
    //   result.push({
    //     name: 'files',
    //     label: '',
    //     type: 'storage',
    //     modeCondition: (mode: Shared.Mode) => mode,
    //     gridSize: 12,
    //     visibleModes: ['add', 'edit'],
    //     extraField: true
    //   })
    // }
  })

  return result
}

/**
 * Extract all extraField=true fields from payload
 * @param payload The original payload object
 * @param fields The form fields metadata
 * @returns New payload with extra_field collected
 */
export const extractExtraFields = (
  payload: Record<string, any>,
  fields: Shared.DynamicFormFieldProps[]
): Record<string, any> => {
  const cleanedPayload: Record<string, any> = { ...payload }
  const extraFields: Record<string, any> = {}
  // console.log('Extracting extra fields from payload:', payload)
  fields.forEach(field => {
    const key = field.name
    if (field.extraField && key in cleanedPayload) {
      // console.log('Extracting extra field:', key, cleanedPayload[key])
      extraFields[key] = cleanedPayload[key]
      delete cleanedPayload[key]
    }
  })

  if (Object.keys(extraFields).length > 0) {
    cleanedPayload['extra_fields'] = extraFields
  }

  return cleanedPayload
}

/**
 * Merge extra_fields back into main payload for form display
 */
export const mergeExtraFields = (
  data: Record<string, any>,
  fields: Shared.DynamicFormFieldProps[]
): Record<string, any> => {
  const merged = { ...data }

  if (merged.extra_fields && typeof merged.extra_fields === 'object') {
    Object.keys(merged.extra_fields).forEach(key => {
      // Only include keys that exist in fields as extraField
      const fieldMeta = fields.find(f => f.name === key && f.extraField)
      if (fieldMeta) {
        merged[key] = merged.extra_fields[key]
      }
    })
    delete merged.extra_fields
  }

  return merged
}

export const extractExtraFieldsForSearch = (payload: Record<string, any>, fields: Shared.DynamicFormFieldProps[]) => {
  const extraFieldNames = fields.filter(f => f.extraField).map(f => f.name)

  const extraValues: Record<string, any> = {}
  const mainPayload: Record<string, any> = {}

  Object.entries(payload).forEach(([key, value]) => {
    if (extraFieldNames.includes(key) && value !== undefined && value !== '') {
      extraValues[key] = value
    } else {
      mainPayload[key] = value
    }
  })

  if (Object.keys(extraValues).length > 0) {
    mainPayload.extra_fields = JSON.stringify(extraValues) // ✅ Keep as object
  }

  return mainPayload
}

export const isBase64File = (value?: any): boolean => {
  if (typeof value !== 'string') return false
  return value.startsWith('data:')
}

export const parseBase64File = (base64: string) => {
  const [meta, data] = base64.split(',')
  const mimeMatch = meta.match(/data:(.*);base64/)
  const mime = mimeMatch?.[1] || 'application/octet-stream'

  const extension = mime.split('/')[1] || 'file'

  return { mime, extension, base64Data: base64 }
}

export const downloadBase64File = async (filePath: string, fileName = 'file') => {
  if (!filePath) return

  if (filePath.startsWith('data:')) {
    const link = document.createElement('a')
    link.href = filePath
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return
  }

  try {
    const response = await fetch(filePath)

    if (!response.ok) throw new Error('Network response was not ok')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Delay revocation to ensure download starts
    setTimeout(() => window.URL.revokeObjectURL(url), 100)
  } catch (err) {
    console.warn('Blob download failed, falling back to direct link:', err)

    const link = document.createElement('a')
    link.href = filePath
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const previewBase64File = (base64: string) => {
  window.open(base64, '_blank')
}

type NonNullableDeep<T> =
  T extends Array<infer U>
    ? Array<NonNullableDeep<U>>
    : T extends object
      ? { [K in keyof T as T[K] extends null ? never : K]: NonNullableDeep<T[K]> }
      : T

export function removeNulls<T>(obj: T): NonNullableDeep<T> {
  if (Array.isArray(obj)) {
    return obj.map(item => removeNulls(item)).filter(item => item !== null) as NonNullableDeep<T>
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {} as NonNullableDeep<T>
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = removeNulls((obj as any)[key])
        if (value !== null) {
          ;(newObj as any)[key] = value
        }
      }
    }
    return newObj
  } else if (obj !== null) {
    return obj as NonNullableDeep<T>
  } else {
    return null as any // TS requires this, but it will never appear in result
  }
}

export function excludeKeys(obj: any, keysToOmit: string[]): any {
  if (Array.isArray(obj)) {
    return obj.map(item => excludeKeys(item, keysToOmit))
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => !keysToOmit.includes(key))
        .map(([key, value]) => [key, excludeKeys(value, keysToOmit)])
    )
  }
  return obj
}

export const toggleLoading = (loading: any[], toggle: any[] | any) => {
  return xor(loading, isArray(toggle) ? toggle : [toggle])
}

export const isImageFile = (value?: string) => {
  if (!value) return false

  // Base64 image
  if (value.startsWith('data:image')) return true

  // URL or path
  return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(value)
}

export type FileType = 'image' | 'pdf' | 'excel' | 'word' | 'zip' | 'ppt' | 'text' | 'unknown'

export const getFileType = (filePath?: string): FileType => {
  if (!filePath) return 'unknown'

  /**
   * 1️ Base64 (data:...)
   */
  if (filePath.startsWith('data:')) {
    if (filePath.startsWith('data:image')) return 'image'

    const mimeMatch = filePath.match(/^data:(.+?);base64,/)
    const mime = mimeMatch?.[1]

    switch (mime) {
      case 'application/pdf':
        return 'pdf'
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'word'
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'excel'
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return 'ppt'
      case 'text/plain':
        return 'text'
      case 'application/zip':
      case 'application/x-rar-compressed':
        return 'zip'
      default:
        return 'unknown'
    }
  }

  /**
   * 2️⃣ Normal URL / filename (Arabic-safe)
   */
  const cleanPath = filePath.split('?')[0].split('#')[0]

  let decodedPath = cleanPath
  try {
    decodedPath = decodeURIComponent(cleanPath)
  } catch {
    // ignore decode errors
  }

  const ext = decodedPath.split('.').pop()?.toLowerCase()
  if (!ext) return 'unknown'

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext)) {
    return 'image'
  }

  switch (ext) {
    case 'pdf':
      return 'pdf'
    case 'xls':
    case 'xlsx':
      return 'excel'
    case 'doc':
    case 'docx':
      return 'word'
    case 'ppt':
    case 'pptx':
      return 'ppt'
    case 'zip':
    case 'rar':
      return 'zip'
    case 'txt':
      return 'text'
    default:
      return 'unknown'
  }
}

export const resolveDisplayValueFormField = ({
  value,
  name,
  autoFill,
  user
}: {
  value: any
  name: string
  autoFill?: boolean
  user?: any
}) => {
  // ✅ Auto fill has highest priority
  if (name == 'season' && user) {
    return user?.context?.season
  }
  if (autoFill === true && (value === null || value === undefined)) {
    return 'يولد بشكل آلي'
  }

  if (value === null || value === undefined) {
    return name === 'id' ? 'يولد بشكل آلي' : '-'
  }

  if (Array.isArray(value)) {
    return '-'
  }

  if (typeof value === 'object') {
    if ('value' in value) {
      return value.value || '-'
    }
    return '-'
  }

  return String(value) || (name === 'id' ? 'يولد بشكل آلي' : '-')
}

export const resolveStaticFields = ({ name, type, autoFill }: { name: string; type?: any; autoFill?: boolean }) => {
  // ✅ Auto fill has highest priority
  if (name == 'id' || name == 'season') {
    return true
  } else if (autoFill == true) {
    return true
  }
}

export const formatNumber = (
  value: any,
  decimals: number = 2,
  options?: { currency?: string; locale?: string; useCurrency?: boolean }
): string => {
  if (value === null || value === undefined || value === '') return '-'

  const num = Number(value)
  if (isNaN(num)) return String(value)

  const {
    currency = 'SAR', // 🇸🇦 الريال السعودي افتراضيًا
    locale = 'en-SA', // locale عربي
    useCurrency = true // استخدم العملة افتراضيًا
  } = options || {}

  return num.toLocaleString(locale, {
    style: useCurrency ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Validates email format
 */

/**
 * Validates time format (HH:mm or HH:mm:ss)
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/
  return timeRegex.test(time)
}

/**
 * Validates Hijri date format (YYYYMMDD)
 */
export const isValidHijriDate = (value: any): boolean => {
  if (!value) return false
  const valueStr = String(value).padStart(8, '0')
  if (valueStr.length !== 8) return false
  const year = parseInt(valueStr.slice(0, 4))
  const month = parseInt(valueStr.slice(4, 6))
  const day = parseInt(valueStr.slice(6, 8))
  if (year < 1300 || year > 1500) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 30) return false
  return true
}

/**
 * Validates standard date format
 */
export const isValidDate = (date: any): boolean => {
  if (!date) return false
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}


/**
 * Validates fields in a specific tab based on tabConfig
 */
export const validateTabFields = async (
  tabIndex: number,
  tabConfig: Array<{ label: string; fields: Shared.DynamicFormFieldProps[] }>,
  formMethods: any,
  mode: Shared.Mode,
  dictionary: any
): Promise<{ isValid: boolean; errors: Array<{ field: string; message: string }> }> => {
  if (mode === 'search' || mode === 'show') {
    return { isValid: true, errors: [] }
  }

  const tabFields = tabConfig[tabIndex]?.fields || []
  const values = formMethods.getValues()

  const getResolvedMode = (field: any): Shared.Mode => {
    if (typeof field.modeCondition === 'function') {
      try {
        return field.modeCondition(mode) as Shared.Mode
      } catch (e) {
        console.error(`❌ modeCondition error [${field.name}]`, e)
        return mode
      }
    }
    return (field.modeCondition as Shared.Mode) || mode
  }

  const shouldValidateField = (field: any): boolean => {
    const resolvedMode = getResolvedMode(field)

    // ✅ If resolved mode is 'show' or 'search', skip validation
    if (resolvedMode === 'show' || resolvedMode === 'search') {
      return false
    }

    return true
  }

  // ✅ Helper function to check if field should be shown
  const shouldShowField = (field: any): boolean => {
    if (field.visibleModes && Array.isArray(field.visibleModes)) {
      if (!field.visibleModes.includes(mode)) return false
    }

    if (field.showWhen) {
      const { field: dependsOn, value: expectedValue, hasValue } = field.showWhen

      const currentValue = values[dependsOn]

      // ✅ hasValue support
      if (hasValue) {
        return currentValue !== null && currentValue !== undefined && currentValue !== ''
      }

      if (Array.isArray(expectedValue)) {
        return expectedValue.some(v => String(v) === String(currentValue))
      }

      return String(currentValue) === String(expectedValue)
    }

    return true
  }
  // ✅ Helper: checks if a file/personal_picture field is satisfied
  const isFileFieldSatisfied = (field: any): boolean => {
    if (field.extraField) {
      const value = values[field.name]
      return value !== null && value !== undefined && value !== ''
    }

    const files: any[] = values.files || []
    return Array.isArray(files) && files.some((f: any) => f?.description === field.name)
  }

  // ✅ Helper: validate IBAN
  const isValidIBAN = (iban: string, acceptedCountries?: string[]): boolean => {
    if (!iban) return false

    // Remove spaces and convert to uppercase
    const cleanIban = normalizeIban(iban)

    // Basic length check
    if (cleanIban.length < 15 || cleanIban.length > 34) return false

    // Check if starts with 2 letters (country code)
    if (!/^[A-Z]{2}/.test(cleanIban)) return false

    // Extract country code
    const countryCode = cleanIban.substring(0, 2)

    // Check if country is in accepted list
    if (acceptedCountries && acceptedCountries.length > 0) {
      if (!acceptedCountries.includes(countryCode)) return false
    }

    const expectedLength = ibanLengths[countryCode]
    if (expectedLength && cleanIban.length !== expectedLength) return false

    // MOD-97 checksum validation
    const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4)
    const numericIban = rearranged
      .split('')
      .map(char => {
        const code = char.charCodeAt(0)
        if (code >= 65 && code <= 90) {
          return String(code - 55)
        }
        return char
      })
      .join('')

    // Calculate mod 97
    let remainder = 0
    for (let i = 0; i < numericIban.length; i++) {
      remainder = (remainder * 10 + parseInt(numericIban[i])) % 97
    }

    return remainder === 1
  }

  // ✅ Helper: get field-specific validation error message
  const getValidationErrorMessage = (field: any, fieldValue: any): string | null => {
    // Skip validation if field is empty and not required (handled separately)
    if (!fieldValue || fieldValue === '') return null

    // ✅ Check exact length first (if specified)
    if (field.length !== undefined && typeof fieldValue === 'string') {
      if (fieldValue.length !== field.length) {
        return `يجب أن يكون ${field.length} أحرف بالضبط`
      }
    }

    // ✅ Check minLength (if specified and no exact length)
    if (field.minLength !== undefined && typeof fieldValue === 'string' && field.length === undefined) {
      if (fieldValue.length < field.minLength) {
        return `يجب أن يكون الحد الأدنى ${field.minLength} أحرف`
      }
    }

    // ✅ Check maxLength (if specified and no exact length)
    if (field.maxLength !== undefined && typeof fieldValue === 'string' && field.length === undefined) {
      if (fieldValue.length > field.maxLength) {
        return `يجب أن يكون الحد الأقصى ${field.maxLength} أحرف`
      }
    }

    switch (field.type) {
      case 'email':
        if (!isValidEmail(fieldValue)) {
          return 'يرجى إدخال بريد إلكتروني صحيح'
        }
        break

      case 'mobile':
        if (!isValidMobile(fieldValue)) {
          return 'رقم الجوال غير صحيح. يجب أن يبدأ بـ 05 ويتكون من 10 أرقام'
        }
        break

      case 'time':
        if (!isValidTime(fieldValue)) {
          return 'الوقت غير صحيح. الصيغة الصحيحة: HH:mm'
        }
        break

      case 'hijri_date':
        if (!isValidHijriDate(fieldValue)) {
          return 'التاريخ الهجري غير صحيح'
        }
        break

      case 'date':
        if (!isValidDate(fieldValue)) {
          return 'التاريخ غير صحيح'
        }
        break

      case 'number':
        const numValue = Number(fieldValue)
        if (isNaN(numValue)) {
          return 'يجب إدخال رقم صحيح'
        }
        if (field.min !== undefined && numValue < field.min) {
          return `القيمة يجب أن تكون ${field.min} أو أكثر`
        }
        if (field.max !== undefined && numValue > field.max) {
          return `القيمة يجب أن تكون ${field.max} أو أقل`
        }
        break

      // ✅ NEW: IBAN validation
      case 'iban':
        if (!isValidIBAN(fieldValue, field.acceptedIbans)) {
          return getIbanErrorMessage(field.acceptedIbans)
        }
        break

      case 'select':
        if (field.multiple) {
          if (!Array.isArray(fieldValue) || fieldValue.length === 0) {
            return 'يرجى اختيار عنصر واحد على الأقل'
          }
        } else {
          if (!fieldValue || fieldValue === '') {
            return 'يرجى اختيار عنصر'
          }
        }
        break

      case 'checkbox':
        if (field.mustBeChecked && !fieldValue) {
          return 'يجب الموافقة على هذا الشرط'
        }
        break
    }

    // ✅ IBAN validation for text fields with validateIban flag
    if (field.validateIban && field.type === 'text') {
      if (!isValidIBAN(fieldValue, field.acceptedIbans)) {
        return getIbanErrorMessage(field.acceptedIbans)
      }
    }

    // ✅ Check pattern if specified (after type-specific validation)
    if (field.pattern && typeof fieldValue === 'string') {
      const regex = new RegExp(field.pattern)
      if (!regex.test(fieldValue)) {
        return field.patternMessage || 'الصيغة غير صحيحة'
      }
    }

    return null
  }

  // Get only visible fields in this tab
  const visibleFields = tabFields.filter(field => shouldShowField(field)).filter(field => shouldValidateField(field))

  const errors: Array<{ field: string; message: string }> = []

  // ✅ Two-pass validation: 1) Check required fields, 2) Validate format

  // Pass 1: Check required fields
  const requiredFields = visibleFields.filter(field => {
    // requiredModeCondition takes priority (dynamic)
    if (field.requiredModeCondition) {
      try {
        return field.requiredModeCondition(mode, values)
      } catch (e) {
        console.error(`❌ requiredModeCondition error [${field.name}]`, e)
        return false
      }
    }

    if (field.requiredModes && Array.isArray(field.requiredModes)) {
      return field.requiredModes.includes(mode)
    }

    return field.required === true
  })

  for (const field of requiredFields) {
    let isEmpty = false

    // ✅ FILE / PERSONAL_PICTURE: dedicated check
    if ((field.type === 'file' || field.type === 'personal_picture') && !field.extraField) {
      isEmpty = !isFileFieldSatisfied(field)
    } else {
      // ✅ Generic isEmpty for all other field types
      const fieldValue = values[field.name]

      if (fieldValue === null || fieldValue === undefined) {
        isEmpty = true
      } else if (typeof fieldValue === 'string') {
        isEmpty = fieldValue.trim() === ''
      } else if (Array.isArray(fieldValue)) {
        isEmpty = fieldValue.length === 0
      } else if (typeof fieldValue === 'number') {
        isEmpty = false
      } else if (typeof fieldValue === 'boolean') {
        isEmpty = false
      } else if (typeof fieldValue === 'object') {
        if ('value' in fieldValue) {
          isEmpty = fieldValue.value === null || fieldValue.value === undefined || fieldValue.value === ''
        } else {
          isEmpty = Object.keys(fieldValue).length === 0
        }
      }
    }

    if (isEmpty) {
      const errorMessage = 'هذا الحقل مطلوب'
      errors.push({ field: field.name, message: errorMessage })

      formMethods.setError(field.name, { type: 'manual', message: errorMessage })
    }
  }

  // Pass 2: Validate format/pattern for all visible fields with values
  for (const field of visibleFields) {
    const fieldValue = values[field.name]

    // Skip if already has an error from required check
    const hasRequiredError = errors.some(e => e.field === field.name)
    if (hasRequiredError) continue

    // Skip if field is empty and not required
    if (!fieldValue || fieldValue === '') continue

    // Get field-specific validation error
    const validationError = getValidationErrorMessage(field, fieldValue)

    if (validationError) {
      errors.push({ field: field.name, message: validationError })

      formMethods.setError(field.name, { type: 'manual', message: validationError })
    } else {
      // Clear errors for valid fields
      formMethods.clearErrors(field.name)
    }
  }

  return { isValid: errors.length === 0, errors }
}
/**
 * Gets the tab index for a specific field name
 */
export const getTabIndexForField = (
  fieldName: string,
  tabConfig: Array<{ label: string; fields: Shared.DynamicFormFieldProps[] }>
): number => {
  for (let i = 0; i < tabConfig.length; i++) {
    if (tabConfig[i].fields.some(field => field.name === fieldName)) {
      return i
    }
  }
  return 0 // Default to first tab
}

export const formatApiErrors = (error: any): string[] | any => {
  if (!error) return []

  // لو error جاية string
  if (typeof error === 'string') return [error]

  // لو Laravel / API validation errors
  if (error?.errors && typeof error.errors === 'object') {
    return Object.values(error.errors).flat()
  }

  // fallback
  if (error?.message) return [error.message]

  return ['حدث خطأ غير متوقع']
}

export const getShowModeFields = (fields: Shared.DynamicFormFieldProps[]) => {
  return fields.filter(field => field.modeCondition?.('*') === 'show')
}

export const mapListToLabelValue = (arr: any[] = [], labelProp: string = 'name_ar', keyProp: string = 'id') => {
  if (!arr || !arr.length) return
  return arr.map(item => ({ label: item[labelProp], value: item[keyProp] }))
}

export const getAutoCompleteValue = (type: string, customAutoComplete?: string) => {
  if (customAutoComplete) return customAutoComplete

  // Prevent autofill for sensitive fields
  if (type === 'password') return 'new-password'
  if (type === 'email') return 'off'
  if (type === 'mobile' || type === 'tel') return 'off'

  return 'off' // Default to off for all fields
}

type FilterOperation = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'includes'

interface FilterCondition {
  key: string
  value: any
  operation: FilterOperation
}

export function filterAndMap<T, R>(list: T[] = [], filters: FilterCondition[] = [], mapper: (item: T) => R): R[] {
  return list
    .filter((item: any) =>
      filters.every(({ key, value, operation }) => {
        const itemValue = item[key]

        switch (operation) {
          case '=':
            return itemValue === value

          case '!=':
            return itemValue !== value

          case '>':
            return itemValue > value

          case '<':
            return itemValue < value

          case '>=':
            return itemValue >= value

          case '<=':
            return itemValue <= value

          case 'includes':
            return Array.isArray(itemValue) ? itemValue.includes(value) : String(itemValue).includes(String(value))

          default:
            return true
        }
      })
    )
    .map(mapper)
}

// ✅ Helper function to group fields by model name
export const groupByModelName = (query: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}
  const modelGroups: Record<string, Record<string, any>> = {}

  Object.entries(query).forEach(([key, value]) => {
    // Check if key contains a dot (e.g., "personal.id_no")
    if (key.includes('.')) {
      const parts = key.split('.')
      const modelName = parts[0] // "personal"
      const fieldName = parts.slice(1).join('.') // "id_no" (handles nested like "personal.address.city")

      // Initialize model group if it doesn't exist
      if (!modelGroups[modelName]) {
        modelGroups[modelName] = {}
      }

      // Add field to the model group
      modelGroups[modelName][fieldName] = value
    } else {
      // Regular field (no dot) - add directly to result
      result[key] = value
    }
  })

  // Merge model groups into result
  Object.entries(modelGroups).forEach(([modelName, fields]) => {
    result[modelName] = fields
  })

  return result
}

const normalizeIban = (iban: string): string => {
  return iban
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632)) // Arabic → English
    .replace(/[\u200E\u200F\u202A-\u202E]/g, '') // direction marks
    .replace(/[^A-Za-z0-9]/g, '') // strict cleanup
    .toUpperCase()
}

const mod97 = (numericString: string): number => {
  let remainder = 0

  // Process the string in chunks to avoid integer overflow
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97
  }

  return remainder
}

export const getIbanErrorMessage = (acceptedCountries?: string[]): string => {
  if (!acceptedCountries || acceptedCountries.length === 0) {
    return 'رقم الآيبان غير صحيح'
  }
  console.log(acceptedCountries)
  if (acceptedCountries.length === 1) {
    const countryName = countryNamesAr[acceptedCountries[0]] || acceptedCountries[0]
    return `رقم الآيبان غير صحيح. يجب أن يكون من ${countryName} (${acceptedCountries[0]})`
  }

  return `رقم الآيبان غير صحيح. الدول المقبولة: ${acceptedCountries.join(', ')}`
}
/**
 * Validate IBAN number
 * @param iban - The IBAN string to validate
 * @param acceptedCountries - Optional array of country codes (e.g., ['SA', 'AE'])
 */
export const validateIBAN = (iban: string, acceptedCountries?: string[]): boolean => {
  if (!iban) return false
  const cleanIban = normalizeIban(iban)

  if (cleanIban.length < 15 || cleanIban.length > 34) {
    console.log('❌ IBAN length invalid:', cleanIban.length)
    return false
  }

  if (!/^[A-Z]{2}/.test(cleanIban)) {
    console.log('❌ IBAN must start with 2 letters')
    return false
  }

  const countryCode = cleanIban.substring(0, 2)

  if (acceptedCountries && acceptedCountries.length > 0) {
    if (!acceptedCountries.includes(countryCode)) {
      console.log('❌ Country not accepted:', countryCode)
      return false
    }
  }

  const expectedLength = ibanLengths[countryCode]
  if (expectedLength && cleanIban.length !== expectedLength) {
    console.log(`❌ IBAN length for ${countryCode} should be ${expectedLength}, got ${cleanIban.length}`)
    return false
  }

  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4)

  const numericIban = rearranged
    .split('')
    .map(char => {
      const code = char.charCodeAt(0)
      if (code >= 65 && code <= 90) {
        return String(code - 55)
      }
      return char
    })
    .join('')

  const checksum = mod97(numericIban)

  if (checksum !== 1) {
    console.log('❌ MOD 97 checksum failed:', checksum, '(should be 1)')
    return false
  }

  console.log('✅ IBAN is valid!')
  return true
}

export function getCurrentDateTime() {
  const now = new Date()

  return (
    now.getFullYear() +
    '-' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(now.getDate()).padStart(2, '0') +
    ' ' +
    String(now.getHours()).padStart(2, '0') +
    ':' +
    String(now.getMinutes()).padStart(2, '0') +
    ':' +
    String(now.getSeconds()).padStart(2, '0')
  )
}

export const createDateRangeValidation = (
  compareField: string,
  comparisonType: 'before' | 'after' | 'beforeOrEqual' | 'afterOrEqual',
  errorMessage: string
) => {
  return (mode: Shared.Mode, formValues?: Record<string, any>) => {
    return pipe(
      optional(nullable(union([string('هذا الحقل مطلوب'), date('هذا الحقل مطلوب')]))),
      transform(value => (value == null ? '' : String(value))),
      nonEmpty('هذا الحقل مطلوب'),
      custom((value: any) => {
        if (!value) return true

        const compareValue = formValues?.[compareField]
        if (!compareValue) return true

        const currentDate = new Date(value)
        const compareDate = new Date(compareValue)

        switch (comparisonType) {
          case 'before':
            return currentDate < compareDate
          case 'after':
            return currentDate > compareDate
          case 'beforeOrEqual':
            return currentDate <= compareDate
          case 'afterOrEqual':
            return currentDate >= compareDate
          default:
            return true
        }
      }, errorMessage)
    ) as BaseSchema<any, any, any>
  }
}

export const exportToExcel = async ({
  data,
  columns,
  fileName = 'export',
  sheetName = 'Sheet1',
  dictionary
}: ExportToExcelOptions) => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // ── resolve nested keys like "personal.id_no" ─────────────────────────────
  const resolveNestedValue = (row: any, accessorKey: string): any => {
    if (!accessorKey || !accessorKey.includes('.')) return row[accessorKey]
    return accessorKey.split('.').reduce((obj, key) => (obj != null ? obj[key] : undefined), row)
  }

  // ── format ISO date strings → YYYY-MM-DD ──────────────────────────────────
  const formatDate = (value: any): string => {
    if (!value) return ''
    if (value instanceof Date) return value.toISOString().split('T')[0]
    if (typeof value === 'string' && value.includes('T')) return value.split('T')[0]
    return String(value)
  }

  // ── resolve cell value: badge labels, dates, nested ───────────────────────
  const resolveCellValue = (col: any, rawValue: any): any => {
    if (rawValue === null || rawValue === undefined) return ''

    if ((col.type === 'badge' || col.type === 'select') && Array.isArray(col.list)) {
      const match = col.list.find(
        (item: any) => String(item.value) === String(rawValue) || String(item.apiValue) === String(rawValue)
      )
      return match ? (match.label ?? match.value) : 'غير محدد'
    }

    if (col.type === 'date' || rawValue instanceof Date) return formatDate(rawValue)

    if (typeof rawValue === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(rawValue)) {
      return formatDate(rawValue)
    }

    if (typeof rawValue === 'object') return JSON.stringify(rawValue)
    return rawValue
  }

  // ── Barcode image generation ──────────────────────────────────────────────
  const generateBarcodeImage = (text: string): string | null => {
    if (typeof document === 'undefined') return null
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, text, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 20,
        textMargin: 5,
        height: 50,
        width: 2,
        margin: 5
      })
      return canvas.toDataURL('image/png')
    } catch (e) {
      return null
    }
  }

  // ── Define Columns first (CRITICAL for data mapping) ──────────────────────
  const headerRowTexts = columns.map(col => {
    if (typeof col.header === 'string') {
      return dictionary?.placeholders?.[col.header] || col.header
    }
    return col.accessorKey || col.id || 'Column'
  })

  worksheet.columns = columns.map((col, i) => ({
    header: headerRowTexts[i],
    key: col.accessorKey || col.id || `col_${i}`,
    width: col.type === 'barcode' ? 35 : 20
  }))

  // Style headers
  const headerRow = worksheet.getRow(1)
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 12 }
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF1E40AF' } },
      bottom: { style: 'medium', color: { argb: 'FF1E40AF' } },
      left: { style: 'thin', color: { argb: 'FF93C5FD' } },
      right: { style: 'thin', color: { argb: 'FF93C5FD' } }
    }
  })

  // ── Build rows ────────────────────────────────────────────────────────────
  data.forEach((rowData, r) => {
    const rowValues: any = {}
    columns.forEach(col => {
      const key = col.accessorKey || col.id || ''
      const rawValue = resolveNestedValue(rowData, col.accessorKey)
      // For barcode, we leave cell value empty so only the image shows
      rowValues[key] = col.type === 'barcode' ? '' : resolveCellValue(col, rawValue)
    })

    const worksheetRow = worksheet.addRow(rowValues)
    worksheetRow.height = 80 // Increased height for barcode and text below it

    worksheetRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const col = columns[colNumber - 1]
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      }
      cell.font = { name: 'Arial', size: 10 }
      if (r % 2 === 1) { // Stripe logic (r starts at 0, which is Excel row 2)
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } }
      }

      if (col.type === 'barcode') {
        const barcodeValue = String(resolveNestedValue(rowData, col.accessorKey) || '')
        if (barcodeValue) {
          const base64 = generateBarcodeImage(barcodeValue)
          if (base64) {
            const imageId = workbook.addImage({ base64: base64, extension: 'png' })
            worksheet.addImage(imageId, {
              tl: { col: colNumber - 1, row: worksheetRow.number - 1 } as any,
              br: { col: colNumber, row: worksheetRow.number } as any,
              editAs: 'oneCell'
            })
            // Clear text value so it doesn't overlap with image (optional)
            // cell.value = ''; 
          }
        }
      }
    })
  })

  // ── Column widths auto-fit ────────────────────────────────────────────────
  worksheet.columns.forEach((column: any, i) => {
    const col = columns[i]
    if (col.type === 'barcode') return // Keep fixed width
    
    let maxLength = 0
    column.eachCell({ includeEmpty: true }, (cell: any) => {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) maxLength = columnLength
    })
    column.width = Math.min(Math.max(maxLength + 5, 15), 50)
  })

  // ── Write file ────────────────────────────────────────────────────────────
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const timestamp = new Date().toISOString().split('T')[0]
  
  anchor.href = url
  anchor.download = `${fileName}_${timestamp}.xlsx`
  anchor.click()
  window.URL.revokeObjectURL(url)
}

/**
 * Groups column definitions by their accessorKey pattern
 * Supports both flat keys (e.g., "user_status") and nested keys (e.g., "personal.id_no")
 *
 * @param columns - Array of column definition objects with accessorKey property
 * @returns Grouped object structure matching the accessorKey patterns
 *
 * @example
 * const columns = [
 *   { accessorKey: 'id', header: 'ID' },
 *   { accessorKey: 'personal.id_no', header: 'ID Number' },
 *   { accessorKey: 'personal.full_name_ar', header: 'Full Name' },
 *   { accessorKey: 'user_status', header: 'Status' }
 * ]
 *
 * groupColumnsByAccessorKey(columns)
 * // Returns:
 * // {
 * //   id: true,
 * //   user_status: true,
 * //   personal: {
 * //     id_no: true,
 * //     full_name_ar: true
 * //   }
 * // }
 */
export const groupColumnsByAccessorKey = (
  columns: Array<{ accessorKey: string; [key: string]: any }>
): Record<string, any> => {
  const result: Record<string, any> = {}
  const modelGroups: Record<string, Record<string, any>> = {}

  columns.forEach(column => {
    const { accessorKey } = column

    if (!accessorKey) return

    // Check if accessorKey contains a dot (e.g., "personal.id_no")
    if (accessorKey.includes('.')) {
      const parts = accessorKey.split('.')
      const modelName = parts[0] // "personal"
      const fieldName = parts.slice(1).join('.') // "id_no" (handles nested like "personal.address.city")

      // Initialize model group if it doesn't exist
      if (!modelGroups[modelName]) {
        modelGroups[modelName] = {}
      }

      // Add field to the model group (set to true as placeholder)
      modelGroups[modelName][fieldName] = true
    } else {
      // Regular field (no dot) - add directly to result
      result[accessorKey] = true
    }
  })

  // Merge model groups into result
  Object.entries(modelGroups).forEach(([modelName, fields]) => {
    result[modelName] = fields
  })

  return result
}

// utils/calculateWorkAndSalary.ts
export interface WorkSalaryInput {
  start_date: string | Date
  end_date: string | Date
  daily_salary: number
}

export interface WorkSalaryOutput {
  work_days: number
  salary: number
}

/**
 * Calculates the number of work days and total salary.
 * @param input - Object containing start_date, end_date, and daily_salary
 * @returns Object with work_days and salary, or null if invalid input
 */
export const calculateWorkAndSalary = (input: WorkSalaryInput): WorkSalaryOutput | null => {
  const { start_date, end_date, daily_salary } = input

  if (!start_date || !end_date || daily_salary === undefined) {
    return null
  }

  const start = new Date(start_date)
  const end = new Date(end_date)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return null
  }

  const workDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const salary = workDays * daily_salary

  return { work_days: workDays, salary }
}

export const checkFormTabDisplaySubmitBtns = (tabValue: number, lastTabValue: number, mode: Shared.Mode) => {
  if (mode !== 'add') {
    return true
  } else if (Number(tabValue) === Number(lastTabValue)) {
    return true
  } else {
    return false
  }
}

export const createDetailsRow = (withDefaults: boolean, fields: any) => {
  const row: Record<string, any> = {}
  if (withDefaults) {
    fields.forEach((field: any) => {
      if (field.defaultValue !== undefined) {
        row[field.name] = field.defaultValue
      }
    })
  }
  return row
}

export function generateColor() {
  let color: string
  do {
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`
  } while (color.length < 7) // Ensure valid hex format
  return color
}

export const transformArrayObjects = (obj: Record<string, any>) => {
  const result: Record<string, any> = { ...obj }

  Object.keys(result).forEach(key => {
    const value = result[key]

    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
      const transformed: Record<string, any> = {}

      value.forEach((item: Record<string, any>) => {
        Object.keys(item).forEach(field => {
          const fieldValue = item[field]

          if (typeof fieldValue === 'number') {
            if (!transformed[field]) transformed[field] = []
            transformed[field].push(fieldValue)
          }

          if (typeof fieldValue === 'string') {
            if (!transformed[field]) transformed[field] = []
            transformed[field].push(fieldValue)
          }
        })
      })

      // Convert string arrays to comma string
      Object.keys(transformed).forEach(field => {
        if (transformed[field].every((v: any) => typeof v === 'string')) {
          transformed[field] = transformed[field].join(',')
        }
      })

      result[key] = transformed
    }
  })

  return result
}

// export const replaceDetailsUnlessExcluded = (pathname: string, isHref?: boolean) => {
//   if (!pathname) return pathname
//   if (isHref) console.log('fffff', pathname)

//   const [, locale, ...rest] = pathname.split('/')
//   const pathAfterLocale = '/' + rest.join('/')

//   // If path after locale is excluded → return original pathname
//   if (excludedPaths.includes(pathAfterLocale)) {
//     return isHref ? pathname.replace('/details', '/list') : pathname.replace('/details?mode=add', '/list')
//   }

//   // Replace ONLY last segment if it's "details"
//   if (rest[rest.length - 1] === 'details') {
//     rest[rest.length - 1] = 'list'
//   }

//   return `/${locale}/${rest.join('/')}`
// }

export const replaceDetailsUnlessExcluded = (pathname: string) => {
  if (!pathname) return pathname

  const [, locale, ...rest] = pathname.split('/')

  if (rest.length === 0) return pathname // just in case

  // Always replace the last segment with 'list'
  rest[rest.length - 1] = 'list'

  return `/${locale}/${rest.join('/')}`
}

export const validateDatesInPeriod = (row: any, period: any): { valid: boolean; message?: string } => {
  const { start_date, end_date } = row

  if (!start_date || !end_date) {
    return { valid: true } // Skip validation if dates/period not set
  }

  if (!period) {
    return {
      valid: false,
      message: 'الفترة غير موجودة'
    }
  }

  const periodStart = new Date(period.start_date)
  const periodEnd = new Date(period.end_date)
  const nominationStart = new Date(start_date)
  const nominationEnd = new Date(end_date)

  // Set time to 00:00:00 for accurate date comparison
  periodStart.setHours(0, 0, 0, 0)
  periodEnd.setHours(0, 0, 0, 0)
  nominationStart.setHours(0, 0, 0, 0)
  nominationEnd.setHours(0, 0, 0, 0)

  // Check start_date is before end_date
  if (nominationStart > nominationEnd) {
    return {
      valid: false,
      message: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'
    }
  }

  // Check if start_date is within period
  if (nominationStart < periodStart || nominationStart > periodEnd) {
    return {
      valid: false,
      message: `تاريخ البداية خارج نطاق الفترة\n(${period.start_date} - ${period.end_date})`
    }
  }

  // Check if end_date is within period
  if (nominationEnd < periodStart || nominationEnd > periodEnd) {
    return {
      valid: false,
      message: `تاريخ النهاية خارج نطاق الفترة\n(${period.start_date} - ${period.end_date})`
    }
  }

  return { valid: true }
}

export const resolvePath = (obj: any, path: string) => {
  return path.split('.').reduce((acc: any, key: string) => {
    if (acc === undefined || acc === null) return null
    return acc[key]
  }, obj)
}

export const getIdPath = (path: string) => {
  const parts = path.split('.')
  parts.pop() // remove last key (name)
  return parts.length ? `${parts.join('.')}.id` : 'id'
}
export const toOptions = (
  items: any[] | undefined,
  locale?: string,
  labelArProp = 'name_ar',
  labelLaProp = 'name_la',
  valueProp = 'id'
) => {
  return (
    items?.map((item: any) => ({
      label: locale === 'ar' ? item[labelArProp] : item[labelLaProp],
      value: item[valueProp],
      ...item
    })) || []
  )
}

export const normalizeMrz = (value: string) => {
  if (!value) return ''

  return value
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, '') // remove ALL spaces safely
    .toUpperCase()
}

const normalizeMrzDate = (value?: string | null) => {
  if (!value || value.length !== 6) return null

  const yy = parseInt(value.slice(0, 2), 10)
  const mm = value.slice(2, 4)
  const dd = value.slice(4, 6)

  // simple century rule (you can improve later)
  const year = yy <= 25 ? 2000 + yy : 1900 + yy

  return `${year}-${mm}-${dd}`
}

export const parseMrz = (value: string) => {
  const text = (value ?? '').toString().trim()

  let lines = text
    .split(/\n/)
    .map(line => line.replace(/\s/g, '').toUpperCase())
    .filter(Boolean)

  // -----------------------------
  // 🔥 SINGLE LINE HANDLING
  // -----------------------------
  if (lines.length === 1) {
    const raw = lines[0]

    // Passport TD3 (88 chars)
    if (/^[A-Z0-9<]{88}$/.test(raw)) {
      lines = [raw.slice(0, 44), raw.slice(44, 88)]
    }

    // ID card TD1 (90 chars)
    else if (/^[A-Z0-9<]{90}$/.test(raw)) {
      lines = [raw.slice(0, 30), raw.slice(30, 60), raw.slice(60, 90)]
    }

    // ❌ cannot safely parse
    else {
      return {
        raw: text,
        lines,
        format: 'unknown',
        valid: false
      }
    }
  }

  const parsed: Record<string, any> = {
    raw: text,
    lines,
    format: 'unknown',
    documentType: null,
    issuingCountry: null,
    lastName: null,
    firstName: null,
    passportNumber: null,
    passportNumberCheck: null,
    nationality: null,
    birthDate: null,
    normalizeBirthdDate: null,
    birthDateCheck: null,
    sex: null,
    expiryDate: null,
    normalizedExpiryDate: null,
    personalNumber: null,
    personalNumberCheck: null,
    finalCheck: null,
    valid: false
  }

  const getNames = (nameStr: string) => {
    const [surname, given] = nameStr.split('<<')
    return {
      lastName: surname?.replace(/</g, ' ').trim() || null,
      firstName: given?.replace(/</g, ' ').trim() || null
    }
  }

  // -----------------------------
  // 🟢 PASSPORT (TD3)
  // -----------------------------
  if (lines.length === 2 && lines[0].length === 44 && lines[1].length === 44) {
    const [line1, line2] = lines

    parsed.format = 'passport'
    parsed.documentType = line1.slice(0, 2).replace(/</g, '') || null
    parsed.issuingCountry = line1.slice(2, 5) || null
    Object.assign(parsed, getNames(line1.slice(5)))

    parsed.passportNumber = line2.slice(0, 9).replace(/</g, '') || null
    parsed.passportNumberCheck = line2[9] || null
    parsed.nationality = line2.slice(10, 13) || null
    parsed.birthDate = line2.slice(13, 19) || null
    parsed.normalizeBirthdDate = normalizeMrzDate(line2.slice(13, 19))
    parsed.birthDateCheck = line2[19] || null
    parsed.sex = line2[20] || null
    parsed.expiryDate = line2.slice(21, 27) || null
    parsed.normalizedExpiryDate = normalizeMrzDate(line2.slice(21, 27))
    parsed.personalNumber = line2.slice(28, 42).replace(/</g, '') || null
    parsed.personalNumberCheck = line2[42] || null
    parsed.finalCheck = line2[43] || null

    const isValid =
      parsed.documentType &&
      parsed.issuingCountry?.length === 3 &&
      parsed.passportNumber &&
      parsed.nationality?.length === 3 &&
      parsed.birthDate?.length === 6 &&
      parsed.expiryDate?.length === 6 &&
      ['M', 'F', '<'].includes(parsed.sex)

    parsed.valid = Boolean(isValid)

    return parsed
  }

  // -----------------------------
  // 🟢 ID CARD (TD1)
  // -----------------------------
  if (lines.length === 3 && lines.every(l => l.length === 30)) {
    const [line1, line2, line3] = lines

    parsed.format = 'id_card'
    parsed.documentType = line1.slice(0, 2).replace(/</g, '') || null
    parsed.issuingCountry = line1.slice(2, 5) || null
    Object.assign(parsed, getNames(line1.slice(5)))

    parsed.passportNumber = line2.slice(0, 9).replace(/</g, '') || null
    parsed.passportNumberCheck = line2[9] || null
    parsed.nationality = line2.slice(10, 13) || null
    parsed.birthDate = line2.slice(13, 19) || null
    parsed.normalizeBirthdDate = normalizeMrzDate(line2.slice(13, 19))

    parsed.birthDateCheck = line2[19] || null
    parsed.sex = line2[20] || null
    parsed.expiryDate = line2.slice(21, 27) || null
    parsed.normalizedExpiryDate = normalizeMrzDate(line2.slice(21, 27))

    parsed.personalNumber = line3.slice(0, 14).replace(/</g, '') || null
    parsed.personalNumberCheck = line3[14] || null
    parsed.finalCheck = line3[29] || null

    const isValid =
      parsed.documentType &&
      parsed.issuingCountry?.length === 3 &&
      parsed.passportNumber &&
      parsed.nationality?.length === 3 &&
      parsed.birthDate?.length === 6

    parsed.valid = Boolean(isValid)

    return parsed
  }

  return parsed
}

export const truncateText = (html: string, maxLength: number) => {
  const temp = document.createElement('div')
  temp.innerHTML = html
  const text = temp.textContent || temp.innerText || ''

  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
