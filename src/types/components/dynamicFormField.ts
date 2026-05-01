import { Color } from '@mui/material'
import type { Mode, SearchMode } from '../pageModeType'
import type { Option } from './listOfValue'
import { DynamicFormTableFieldProps } from './dynamicFormDetailsTable'

export interface ModalConfig {
  open?: boolean // Whether the modal can be opened
  title?: string // Modal title
  description?: string // Modal description or subtitle
  icon?: React.ReactNode // Icon in the modal header
  confirmText?: string // Confirm button text
  cancelText?: string // Cancel button text
  component?: React.ComponentType<any> // Custom modal component
  props?: Record<string, any> // Props to pass to the modal
  onConfirm?: () => void
  onClose?: () => void
  names?: string[]
}

type ShowWhenConfig = {
  field: string
  value?: string | string[]
  hasValue?: boolean
  operator?: 'equals' | 'notEquals'
}
export interface DynamicFormFieldProps {
  name: string
  label: string
  mode?: Mode
  screenMode?: Mode
  showWhen?: ShowWhenConfig
  showPrimary?: boolean
  type?:
    | 'text'
    | 'barcode'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'textarea'
    | 'date'
    | 'date_time'
    | 'date_range'
    | 'file'
    | 'number'
    | 'slider'
    | 'email'
    | 'personal_picture'
    | 'temp'
    | 'empty'
    | 'password'
    | 'rich_text'
    | 'hijri_date'
    | 'amount'
    | 'time'
    | 'mobile'
    | 'upload_image'
    | 'storage'
    | 'iban'
    | 'toggle'
    | 'multi_file'
    | 'color_picker'
    | 'icon_picker'
    | 'iconBadge'
    | 'checkboxToggle'
    | 'switch'

  use24Hours?: boolean
  now?: boolean
  pickerInputType?: 'input' | 'clock'
  options?: Option[]
  apiUrl?: string
  required?: boolean
  rowIndex?: number
  disabled?: boolean
  placeholder?: string
  readOnly?: boolean
  control?: any
  modalConfig?: ModalConfig
  errors?: {
    message?: string
    minLengthError?: string
    maxLengthError?: string
    patternError?: string
  }
  onChange?: (value: any, rowIndex?: number, obj?: any) => void
  onBlur?: (value: any, rowIndex?: number) => void
  onFocus?: () => void
  onKeyUp?: (event: KeyboardEvent) => void
  onKeyDown?: (event: KeyboardEvent) => void
  disableCondition?: boolean | ((mode: Mode, dataObject?: Record<string, any>) => boolean)
  keyProp?: string
  labelProp?: string
  defaultValue?: any
  requiredModes?: Mode[]
  readOnlyModes?: Mode[]
  visibleModes?: Mode[]
  requiredModeCondition?: (mode: Mode, formValues: Record<string, any>) => boolean
  visibleCondition?: (formValues: Record<string, any>) => boolean
  visibleModeCondition?: (mode: Mode, formValues: Record<string, any>) => boolean
  modeCondition?: (mode: Mode, formValues?: Record<string, any>) => Mode | string
  validation?: (mode: Mode, formValues?: Record<string, any>) => Mode | string | any
  visible?: boolean
  dependencies?: { field: string; value: any }[]
  helpText?: string
  tooltip?: string
  /**
   * When this field's value changes (user interaction, NOT initial data load),
   * automatically clear the listed sibling field names in the form.
   * Example: when `ltc_id` changes, clear `bus_id` and `driver_id`.
   */
  clearOnParentChange?: string[]
  /**
   * Dot-notation path inside the API dataModel to sync a local state variable
   * on initial load (edit/show modes). Used by useCascadeFields.
   * Example: 'ltc.business_id' → reads dataModel.ltc.business_id
   */
  syncFromDataModel?: string

  // Define default grid size separately
  defaultGridSize?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }

  // Mode-specific grid sizes
  gridSize?:
    | number
    | {
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
      }
    | ((mode: Mode) => number)

  optionSource?: 'static' | 'dynamic'
  fieldComponent?: React.ElementType
  width?: string
  lovKeyName?: any
  className?: string
  queryParams?: any
  children?: DynamicFormFieldProps[]
  viewProp?: string | string[]
  editProp?: string
  dataObject?: any
  inputAdornment?: any
  gridRef?: any
  locale?: any
  cacheWithDifferentKey?: boolean
  cache?: Boolean
  displayProps?: string[]
  typeAllowed?: any[]
  sizeAllowed?: any
  modal?: string
  isDetailsField?: boolean
  multiple?: boolean
  extraField?: boolean
  searchProps?: string[]
  searchMode?: SearchMode
  showHijri?: boolean
  showTime?: boolean
  searchInBackend?: boolean
  fileableType?: string
  autoFill?: boolean
  apiMethod?: 'POST' | 'GET'
  verificationRequired?: boolean
  maxLength?: number
  minLength?: number
  length?: number
  multipleKeyProp?: string
  submitLovKeyProp?: string
  showRefreshButton?: boolean
  isStaticProp?: boolean
  autoComplete?: string
  validateIban?: boolean // ✅ Enable IBAN validation for text fields
  acceptedIbans?: string[] // ✅ Array of accepted country codes (e.g., ['SA', 'AE'])
  selectFirstValue?: boolean
  maxFiles?: number
  presetColors?: string[]
  showAlpha?: boolean
  displayWithBadge?: boolean
  badgeColor?: 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
  /** When the API returns a nested object, specify the key(s) to extract the array from.
   * Use a string for a single key (e.g. 'departments') or an array of keys to merge
   * multiple arrays (e.g. ['departments', 'seasonal_departments']). */
  responseDataKey?: string | string[]
  showCurrency?: boolean
  perPage?: number
  skipDataSuffix?: boolean
}

export interface FormComponentProps {
  fields: DynamicFormFieldProps[]
  mode: Mode
  screenMode: Mode
  tabConfig?: {
    label: string
    fields: any[]
  }[]
  headerConfig?: {
    title?: string
    icon?: {
      name: string
      color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    }
  }
  locale?: any
  showHeaderPrint?: boolean
  allFormFields?: DynamicFormFieldProps[]
  dataObject?: any
  printForm?: boolean
  printInline?: boolean
  detailsConfig?: {
    title: string
    key: string
    fields: DynamicFormFieldProps[]
  }[]
  showBarcode?: boolean
  recordId?: string
  showTitlePrint?: boolean

  renderAfterFields?: (context: {
    values: Record<string, any>
    errors: Record<string, any>
    mode: Mode
  }) => React.ReactNode
}

export interface FieldConfigMaster {
  type: 'input' | 'select' | 'checkbox' | 'text' // Include 'text' type for flexibility
  label: string // For display purposes (column name)
  name: string // Name of the field, used to access form values
  options?: { value: string; label: string }[] // For select fields
  required: boolean
  readOnly?: boolean // Optional property to mark fields as read-only
}

// ✅ في useRecordForm.ts - Type Definition

export interface OnSubmitParams {
  /**
   * تجاهل فحص التغييرات تمامًا - السماح بالحفظ حتى لو لم تحدث أي تعديلات
   * Use Case: عند الحاجة لإعادة حفظ البيانات أو تحديث timestamp بدون تعديلات
   * Example: إعادة إرسال طلب للموافقة
   */
  skipChangeTracking?: boolean

  /**
   * إخفاء رسالة "لم يتم إجراء تعديلات" ولكن لا يزال يمنع الحفظ إذا لم تحدث تغييرات
   * Use Case: عندما تريد فحص التغييرات بشكل صامت بدون إزعاج المستخدم
   * Example: محاولة حفظ تلقائي في الخلفية
   */
  silentNoChanges?: boolean

  /**
   * تخطي جميع عمليات التحقق (tabs + details + custom validation)
   * Use Case: الحفظ السريع كمسودة بدون التحقق من صحة البيانات
   * Example: حفظ تلقائي أثناء الكتابة (auto-save draft)
   */
  skipValidation?: boolean

  /**
   * تخطي التحقق من صحة التبويبات فقط
   * Use Case: عندما تريد التحقق من الجداول التفصيلية فقط
   * Example: حفظ بيانات جدول معين بدون التحقق من الحقول الرئيسية
   */
  skipTabValidation?: boolean

  /**
   * تخطي التحقق من صحة الجداول التفصيلية فقط
   * Use Case: عندما تريد التحقق من الحقول الرئيسية فقط
   * Example: حفظ البيانات الأساسية قبل إضافة التفاصيل
   */
  skipDetailValidation?: boolean

  /**
   * نفس skipChangeTracking - اسم بديل أكثر وضوحًا
   * Use Case: فرض الحفظ بغض النظر عن أي شيء
   */
  forceSubmit?: boolean

  /**
   * رسالة نجاح مخصصة تظهر بعد الحفظ
   * Use Case: عرض رسالة خاصة بحسب السياق
   * Example: "تم قبول الترشيح بنجاح" بدلاً من "تم الحفظ بنجاح"
   */

  sendFullData?: boolean

  customSuccessMessage?: string

  /**
   * رسالة خطأ مخصصة تظهر عند فشل الحفظ
   * Use Case: عرض رسالة خاصة بحسب نوع الخطأ المتوقع
   * Example: "فشل إرسال الطلب للموافقة"
   */
  customErrorMessage?: string

  /**
   * api مختلفة عند الحفظ او التعديل اعتماداً عن ال Mode
   * Use Case:  تغيير ال api عن المرسلة لل use record form
   * Example: "الحفظ باستخدام api مختلفة"
   */
  apiEndPointModeCondition?: { mode: Mode | '*'; apiUrl: string }[]

  /**
   * دالة تُنفذ قبل بدء عملية الحفظ
   * Use Case: التحقق المخصص أو تحضير البيانات قبل الإرسال
   * Return: true للمتابعة، false لإلغاء الحفظ
   */
  onBeforeSubmit?: (data: any, detailsData: any) => boolean | Promise<boolean>

  /**
   * دالة تُنفذ بعد نجاح عملية الحفظ
   * Use Case: إجراءات إضافية بعد الحفظ (مثل إرسال إشعار، تحديث بيانات أخرى)
   */
  onAfterSubmit?: (response: any, mode: Mode) => void | Promise<void>
}

//شرح ال save
// // ✅ حفظ تلقائي كل 30 ثانية بدون رسائل
// useEffect(() => {
//   const autoSave = setInterval(() => {
//     submitWithParams({
//       silentNoChanges: true,      // لا تظهر رسالة "لم يتم إجراء تعديلات"
//       skipValidation: true,        // لا تتحقق من الصحة (مسودة)
//       customSuccessMessage: ''     // لا تظهر رسالة نجاح
//     })
//   }, 30000)

//   return () => clearInterval(autoSave)
// }, [])

// // ✅ زر "حفظ كمسودة" - يحفظ حتى لو البيانات غير كاملة
// <Button onClick={() => submitWithParams({
//   skipValidation: true,           // تجاهل كل التحقق من الصحة
//   skipChangeTracking: true,       // احفظ حتى لو ما في تغييرات
//   customSuccessMessage: 'تم حفظ المسودة بنجاح'
// })}>
//   حفظ كمسودة
// </Button>

// // ✅ إرسال للموافقة مع التحقق الكامل
// async function handleSubmitForApproval() {
//   await submitWithParams({
//     skipChangeTracking: false,    // تحقق من وجود تغييرات
//     skipValidation: false,         // تحقق من صحة كل شيء
//     customSuccessMessage: 'تم إرسال الطلب للموافقة بنجاح',

//     // ✅ تحقق مخصص قبل الإرسال
//     onBeforeSubmit: async (data, details) => {
//       // تحقق إضافي قبل الإرسال
//       if (!data.manager_approval) {
//         setError('يجب الحصول على موافقة المدير أولاً')
//         return false
//       }
//       return true
//     },

//     // ✅ بعد النجاح، أرسل للموافقة
//     onAfterSubmit: async (response, mode) => {
//       const savedId = response?.data?.data?.id
//       await apiClient.post('/approvals/submit', { request_id: savedId })
//     }
//   })
// }

// // ✅ حفظ البيانات الرئيسية فقط بدون الجداول التفصيلية
// <Button onClick={() => submitWithParams({
//   skipDetailValidation: true,    // تجاهل التحقق من الجداول
//   customSuccessMessage: 'تم حفظ البيانات الأساسية'
// })}>
//   حفظ البيانات الأساسية
// </Button>

// // ✅ إعادة إرسال البيانات حتى لو لم تتغير
// async function handleResubmit() {
//   await submitWithParams({
//     forceSubmit: true,             // احفظ حتى لو ما في تغييرات
//     customSuccessMessage: 'تم إعادة إرسال الطلب بنجاح',

//     onBeforeSubmit: async () => {
//       // إضافة timestamp لتتبع إعادة الإرسال
//       setValue('resubmitted_at', new Date().toISOString())
//       return true
//     }
//   })
// }

// // ✅ في useDocumentVerificationApprovalForm.ts

// async function handleEmpProcess(status: number, targetData?: any) {
//   if (status === 1) {
//     // ✅ قبول الترشيح
//     await submitWithParams({
//       silentNoChanges: true,       // لا تظهر رسالة "لم يتم تعديل"
//       skipChangeTracking: false,   // تحقق من التغييرات لكن بصمت
//       customSuccessMessage: 'تم حفظ البيانات وقبول الترشيح بنجاح',

//       onAfterSubmit: async (response) => {
//         // بعد الحفظ، أرسل طلب القبول
//         const savedData = response?.data?.data
//         await handleNominationProcess(1, 'user', savedData)
//       }
//     })
//   } else if (status === 2) {
//     // ✅ رفض الترشيح - لا حاجة للحفظ
//     await handleNominationProcess(2, 'user', dataModel)
//   }
// }

// // ✅ حفظ على مراحل
// async function handleCompleteRegistration() {
//   // المرحلة 1: حفظ البيانات الشخصية
//   const step1 = await submitWithParams({
//     skipDetailValidation: true,    // تجاهل الجداول في المرحلة الأولى
//     customSuccessMessage: '',       // لا تظهر رسالة بعد

//     onAfterSubmit: async (response) => {
//       const userId = response?.data?.data?.id

//       // المرحلة 2: رفع المستندات
//       await uploadDocuments(userId)

//       // المرحلة 3: إرسال للمراجعة
//       await submitForReview(userId)
//     }
//   })
// }

// // ✅ تحقق مختلف حسب نوع المستخدم
// async function handleSaveBasedOnUserType(userType: string) {
//   if (userType === 'admin') {
//     // المسؤول لا يحتاج تحقق كامل
//     await submitWithParams({
//       skipValidation: true,
//       customSuccessMessage: 'تم الحفظ (وضع المسؤول)'
//     })
//   } else if (userType === 'employee') {
//     // الموظف يحتاج تحقق كامل
//     await submitWithParams({
//       skipValidation: false,
//       customSuccessMessage: 'تم إرسال الطلب للمراجعة',

//       onBeforeSubmit: async (data) => {
//         // تحقق إضافي للموظفين
//         if (!data.supervisor_id) {
//           setError('يجب اختيار المشرف')
//           return false
//         }
//         return true
//       }
//     })
//   }
// }

// // ✅ إعادة المحاولة بعد فشل
// async function handleSaveWithRetry() {
//   try {
//     await submitWithParams({
//       customErrorMessage: 'فشل الحفظ. جاري إعادة المحاولة...',

//       onAfterSubmit: async (response) => {
//         console.log('✅ تم الحفظ بنجاح')
//       }
//     })
//   } catch (error) {
//     // إعادة المحاولة مرة واحدة بدون تحقق
//     await submitWithParams({
//       skipValidation: true,
//       forceSubmit: true,
//       customErrorMessage: 'فشل الحفظ بعد إعادة المحاولة'
//     })
//   }
// }

// // ✅ حفظ عدة سجلات
// async function handleBulkSave(records: any[]) {
//   for (const record of records) {
//     // تحميل البيانات
//     await fetchRecord({ url: `/api/records/${record.id}` })

//     // تعديل
//     setValue('status', 'approved')

//     // حفظ صامت
//     await submitWithParams({
//       silentNoChanges: true,
//       skipValidation: true,
//       customSuccessMessage: '', // لا رسالة لكل سجل

//       onAfterSubmit: async (response) => {
//         console.log(`✅ Record ${record.id} saved`)
//       }
//     })
//   }

//   // رسالة واحدة في النهاية
//   setSuccess(`تم حفظ ${records.length} سجل بنجاح`)
// }

// // ✅ في useDocumentVerificationApprovalForm.ts - مثال كامل

// export const useDocumentVerificationApprovalForm = (scope: string) => {
//   const {
//     onSubmit,
//     submitWithParams,
//     dataModel,
//     // ... rest
//   } = Shared.useRecordForm({
//     // ... config
//   })

//   // ✅ 1. حفظ عادي (مع التحقق الكامل)
//   const handleNormalSave = async () => {
//     await submitWithParams({
//       // استخدم الإعدادات الافتراضية - كل شيء مفعّل
//     })
//   }

//   // ✅ 2. حفظ كمسودة (بدون تحقق)
//   const handleSaveDraft = async () => {
//     await submitWithParams({
//       skipValidation: true,
//       customSuccessMessage: 'تم حفظ المسودة'
//     })
//   }

//   // ✅ 3. قبول الطلب (مع معالجة إضافية)
//   const handleAccept = async () => {
//     await submitWithParams({
//       silentNoChanges: true,
//       customSuccessMessage: 'تم قبول الطلب بنجاح',

//       onBeforeSubmit: async (data) => {
//         // تحقق قبل القبول
//         if (!data.bank_id || !data.iban_no) {
//           setError('يجب إكمال البيانات البنكية قبل القبول')
//           return false
//         }
//         return true
//       },

//       onAfterSubmit: async (response) => {
//         // إرسال للموافقة النهائية
//         await handleNominationProcess(1, scope, response?.data?.data)
//       }
//     })
//   }

//   // ✅ 4. رفض الطلب (بدون حفظ)
//   const handleReject = async () => {
//     // لا حاجة للحفظ، مباشرة للرفض
//     await handleNominationProcess(2, scope, dataModel)
//   }

//   // ✅ 5. إرجاع للتعديل (مع ملاحظات)
//   const handleReturn = async (notes: string) => {
//     await submitWithParams({
//       skipChangeTracking: true, // احفظ الملاحظات حتى لو ما في تغييرات
//       customSuccessMessage: 'تم إرجاع الطلب للتعديل',

//       onBeforeSubmit: async (data) => {
//         // إضافة الملاحظات
//         setValue('return_notes', notes)
//         setValue('returned_at', new Date().toISOString())
//         return true
//       },

//       onAfterSubmit: async (response) => {
//         await handleNominationProcess(3, scope, response?.data?.data)
//       }
//     })
//   }

//   return {
//     onSubmit,
//     handleNormalSave,
//     handleSaveDraft,
//     handleAccept,
//     handleReject,
//     handleReturn
//   }
// }
