import { StatOption } from '@/shared'

export const flightDirectionList = [
  { label: 'وصول', value: 'A', apiValue: 'ARRIVAL', color: 'info' },
  { label: 'مغادرة', value: 'D', apiValue: 'DEPARTURE', color: 'warning' }
]
export const mahderStatusList = [
  { label: 'جديد', value: '1', color: 'info', icon: 'ri-flashlight-line' },
  { label: 'قيد المعالجة', value: '2', color: 'warning', icon: 'ri-time-line' },
  { label: 'مرفوض', value: '3', color: 'error', icon: 'ri-close-circle-line' },
  { label: 'تمت الموافقة', value: '4', color: 'success', icon: 'ri-checkbox-circle-fill' }
]
export const mahderParticpantStatusList = [
  { label: 'تم الإرسال', value: '1', color: 'info', icon: 'ri-flashlight-line' },
  { label: 'قيد المعالجة', value: '2', color: 'warning', icon: 'ri-time-line' },
  { label: 'مرفوض', value: '3', color: 'error', icon: 'ri-close-circle-line' },
  { label: 'تمت الموافقة', value: '4', color: 'success', icon: 'ri-checkbox-circle-fill' }
]
export const flightTypeList = [
  { label: 'منتظمة', value: '1', apiValue: 'SCHEDULED', color: 'primary' },
  // رحلات الخطوط المنتظمة - مواعيد ثابتة على مدار السنة

  { label: 'مستأجرة', value: '2', apiValue: 'CHARTER', color: 'secondary' },
  // رحلات مستأجرة خصيصاً لموسم الحج أو العمرة

  { label: 'إضافية', value: '3', apiValue: 'EXTRA', color: 'warning' },
  // رحلات إضافية في أوقات الذروة (رمضان - موسم الحج)

  { label: 'خاصة', value: '4', apiValue: 'PRIVATE', color: 'info' }
  // رحلات VIP أو وفود رسمية
]
export const aircraftTypeList = [
  // ═══ Narrow Body ═══
  { label: 'A320', value: 'A320', apiValue: 'A320', color: 'primary', body: 'NARROW' },
  { label: 'A321', value: 'A321', apiValue: 'A321', color: 'primary', body: 'NARROW' },
  { label: 'A319', value: 'A319', apiValue: 'A319', color: 'primary', body: 'NARROW' },
  { label: 'B737', value: 'B737', apiValue: 'B737', color: 'primary', body: 'NARROW' },
  { label: 'B738', value: 'B738', apiValue: 'B738', color: 'primary', body: 'NARROW' },

  // ═══ Wide Body ═══
  { label: 'A380', value: 'A380', apiValue: 'A380', color: 'info', body: 'WIDE' },
  { label: 'A350', value: 'A350', apiValue: 'A350', color: 'info', body: 'WIDE' },
  { label: 'A330', value: 'A330', apiValue: 'A330', color: 'info', body: 'WIDE' },
  { label: 'B777', value: 'B777', apiValue: 'B777', color: 'info', body: 'WIDE' },
  { label: 'B787', value: 'B787', apiValue: 'B787', color: 'info', body: 'WIDE' },
  { label: 'B747', value: 'B747', apiValue: 'B747', color: 'info', body: 'WIDE' }
]

export const flightStateList = [
  { label: 'مؤكدة', value: '1', apiValue: 'CONFIRMED', color: 'success' },
  { label: 'ملغاة', value: '2', apiValue: 'CANCELLED', color: 'error' }
]

export const statusList = [
  { label: 'نشط', value: '1', color: 'success', icon: 'ri-checkbox-circle-fill' },
  { label: 'غير نشط', value: '2', color: 'error', icon: 'ri-close-circle-fill' }
]

export const noticeTypeList = [
  { label: 'ملاحظة', value: '1', color: 'info', icon: 'ri-information-line' },
  { label: 'اقتراح', value: '2', color: 'success', icon: 'ri-lightbulb-line' },
  { label: 'شكوى', value: '3', color: 'error', icon: 'ri-alert-line' },
  { label: 'إثبات حالة', value: '4', color: 'warning', icon: 'ri-file-list-3-line' }
]

export const fetchTypeList = [
  { label: 'جلب بيانات الاستقبال فقط', value: '1', color: 'info', icon: 'ri-checkbox-circle-fill' },
  { label: 'جلب بيانات الاستقبال مع الحجاج', value: '2', color: 'info', icon: 'ri-close-circle-fill' }
]

export const passportArchiveFetchList = [
  { label: 'جلب البيانات بدلالة كشف الاستقبال', value: '1', color: 'info', icon: 'ri-checkbox-circle-fill' },
]


export const contentTypeList = [
  { label: 'جوازات', value: '1', color: 'info' },
  { label: 'حقائب', value: '2', color: 'info' }
]
export const timeUnitList = [
  { label: 'يوم', value: '1', color: 'info' },
  { label: 'ساعة', value: '2', color: 'info' },
  { label: 'دقيقة', value: '3', color: 'info' }
]
export const checkFlagList = [
  { label: 'غير مستلم', value: '1', color: 'info' },
  { label: 'مستلم', value: '2', color: 'info' },
  { label: 'مرفوض', value: '3', color: 'info' }
]
export const processStatusList = [
  { label: 'جديد', value: '1', color: 'info' },
  { label: 'تمت المعالجة', value: '2', color: 'info' },
  { label: 'لم تتم المعالجة', value: '3', color: 'info' }
]
export const handoverMethodList = [
  { label: 'باظهار بيانات التفاصيل', value: '1', color: 'info' },
  { label: 'بإخفاء بيانات التفاصيل', value: '2', color: 'info' }
]
export const transactionTypeList = [
  { label: 'إستلام و تسليم', value: '1', color: 'info' },
  { label: 'تسليم واستلام', value: '2', color: 'info' },
  { label: 'طلب جوازات', value: '3', color: 'info' },
  { label: 'طلب نقل عهدة', value: '4', color: 'info' }
]
export const handoverFlowTypeList = [
  { label: 'تداول بين إدارات فرعية', value: '1', color: 'info' },
  { label: 'تداول بين إدارات داخلية', value: '2', color: 'info' },
  { label: 'تداول مع جهات  خارجية', value: '3', color: 'info' }
]

export const dataSourceList = [
  { label: 'مركز المعلومات', value: '1', color: 'info' },
  { label: 'إعداد داخلي', value: '2', color: 'primary' }
]
export const tdoTypeList = [
  { label: 'مغادرة من المنافذ', value: '1', color: 'info' },
  { label: 'تنقل بين المدن', value: '2', color: 'primary' }
]
export const preArrivalEntryTypeList = [
  { label: 'ممثل الحجاج', value: '1', color: 'info' },
  { label: 'شركة تقديم الخدمة', value: '2', color: 'primary' }
]
export const cardPrintingStatusList = [
  { label: 'تمت الطباعة', value: '1', color: 'success', icon: 'ri-printer-line' },
  { label: 'لم تتم الطباعة', value: '2', color: 'error', icon: 'ri-printer-cloud-line' },
  { label: 'تم التحويل للطباعة', value: '3', color: 'warning', icon: 'ri-refresh-line' }
]

export const portTypeList = [
  { label: 'جوي', value: '1', color: 'success' },
  { label: 'بري', value: '2', color: 'info' },
  { label: 'بحري', value: '3', color: 'primary' }
]

export const handoverStatusList = [
  { label: 'تم إستلام الجوازات', value: '1', color: 'success' },
  { label: 'جزء من الجوازات غير مستلم', value: '2', color: 'info' },
  { label: 'كامل الجوازات غير مستلم', value: '3', color: 'primary' }
]
export const receptionTypeList = [
  { label: 'قدوم من المنافذ', value: '1', color: 'info', icon: 'ri-plane-line' },
  { label: 'التنقل بين المدن', value: '2', color: 'primary', icon: 'ri-bus-line' }
]
export const autoProcessTypeList = [
  { label: 'إستقبال آلي', value: '1', color: 'info' },
  { label: 'استقبال يدوي', value: '2', color: 'primary' }
]
export const VerificationApprovalStatusList = [
  { label: 'لم يتم التدقيق', value: null, color: 'success' },
  { label: 'تم التدقيق', value: '2', color: 'error' }
]
export const isCompanyNominatedList = [
  { label: 'ادارة الشركة', value: '1', color: 'info' },
  { label: 'رئيس المركز', value: '2', color: 'primary' }
]
export const interviewerStatusList = [
  { label: 'تم التدقيق', value: '1', color: 'success' },
  { label: 'لم يتم التدقيق', value: null, color: 'error' }
]
export const interviewerReviewedStatusList = [
  { label: 'تم التدقيق', value: '1', color: 'success' },
  { label: 'لم يتم التدقيق', value: '2', color: 'error' }
]
export const jobVisitStatusList = [
  {
    label: 'لم تزار',
    helperText: 'لم يتم تنفيذ الزيارة',
    value: '1',
    color: 'primary',
    icon: 'ri-information-off-line'
  },
  {
    label: 'الموقع سليم',
    helperText: 'جميع البنود مطابقة',
    value: '2',
    color: 'success',
    icon: 'ri-checkbox-circle-line'
  },
  {
    label: 'بحاجة الى زيارة أخرى',
    helperText: 'ملاحظات تستوجب متابعة',
    value: '3',
    color: 'warning',
    icon: 'ri-error-warning-line'
  },
  {
    label: 'الموقع غير مؤهل',
    helperText: 'غير مطابق للاشتراطات',
    value: '4',
    color: 'error',
    icon: 'ri-close-circle-line'
  }
]

export const formElementPriorityList = [
  { label: 'منخفض', value: '1', color: 'info', icon: 'ri-checkbox-circle-fill' },
  { label: 'متوسط', value: '2', color: 'warning', icon: 'ri-checkbox-circle-fill' },
  { label: 'عالى', value: '3', color: 'error', icon: 'ri-close-circle-fill' }
]

export const deliverStaffUniform = [
  {
    label: 'تسليم لأول مرة ',
    value: '1',
    color: 'warning',
    icon: 'ri-shirt-line'
  },
  {
    label: 'تسليم بدل فاقد',
    value: '2',
    color: 'error',
    icon: 'ri-refresh-line'
  }
]
export const deliverAllStaffUniform = [
  {
    label: 'لم يتم التسليم',
    value: '0',
    color: 'error',
    icon: 'ri-shirt-line'
  },
  {
    label: 'تسليم لأول مرة ',
    value: '1',
    color: 'warning',
    icon: 'ri-shirt-line'
  },
  {
    label: 'تسليم بدل فاقد',
    value: '2',
    color: 'primary',
    icon: 'ri-refresh-line'
  }
]
export const formTypesList = [
  { label: 'سليمة', value: '1', color: 'success' },
  { label: 'غير سليمة', value: '2', color: 'error' }
]
export const recurrenceTypeList = [
  { label: 'مرة واحدة', value: '1', color: 'primary' },
  { label: 'يومياً', value: '2', color: 'success' },
  { label: 'أسبوعياً', value: '3', color: 'warning' },
  { label: 'شهرياً', value: '4', color: 'error' }
]

export const contractTypeList = [
  { label: 'نظامي', value: '1', color: 'success' },
  { label: 'أجير', value: '2', color: 'error' }
]
export const genderOptions = [
  { label: 'ذكر', value: '1', color: 'success', icon: 'bi bi-person-standing' },
  { label: 'أنثى', value: '2', color: 'info', icon: 'bi bi-person-standing-dress' }
]
export const taskProgressList = [
  { label: 'لم يتم الإنجاز', value: '1', color: 'error' },
  { label: 'جارى العمل', value: '2', color: 'primary' },
  { label: 'تم العمل', value: '3', color: 'success' }
]

export const employmentStatusList = [
  { label: 'موظف حكومي', value: '1', color: 'success' },
  { label: 'موظف قطاع خاص', value: '2', color: 'info' },
  { label: 'صاحب عمل خاص', value: '3', color: 'warning' },
  { label: 'طالب', value: '4', color: 'error' },
  { label: 'متفرغ', value: '5', color: 'primary' }
]

export const taskCategoryList = [
  { label: 'منخفض', value: '1', color: 'success' },
  { label: 'متوسط', value: '2', color: 'info' },
  { label: 'عالى', value: '3', color: 'error' }
]
export const workAbilityStatusList = [
  { label: 'قادر على العمل ميدانياً', value: '1', color: 'success' },
  { label: 'لا أستطيع العمل ميدانياً', value: '2', color: 'error' },
  { label: 'ميدانى وإداراى', value: '3', color: 'primary' },
  { label: 'من أصحاب الهمم', value: '4', color: 'error' }
]

export const userStatusList = [
  { label: 'نشط', value: '1', color: 'success' },
  { label: 'غير نشط', value: '2', color: 'error' },
  { label: 'بحاجة إلى تفعيل', value: '3', color: 'warning' }
]

export const passwordChangedList = [
  { label: 'مطلوب تغييرها', value: '2', color: 'warning' },
  { label: 'غير مطلوب', value: '1', color: 'success' }
]

export const verifyCodeList = [
  { label: 'مطلوب', value: '1', color: 'warning' },
  { label: 'مطلوب من خارج الشبكة', value: '2', color: 'info' },
  { label: 'غير مطلوب', value: '3', color: 'success' }
]

export const yesNoList = [
  { label: 'نعم', value: '1', apiValue: true, color: 'success' },
  { label: 'لا', value: '2', apiValue: false, color: 'error' }
]
export const allowanceTypeList = [
  { label: 'مبلغ ثابت', value: '1', color: 'success' },
  { label: 'نسبة مئوية', value: '2', color: 'error' }
]
export const otherYesNoList = [
  { label: 'نعم', value: '1', color: 'success' },
  { label: 'لا', value: '0', color: 'error' }
]
export const jobTypes = [
  { label: 'وظيفة دائمة', value: '1', color: 'success' },
  { label: 'وظيفة موسمية', value: '2', color: 'error' },
  { label: 'كلاهما', value: '3', color: 'error' }
]

export const shareTypeInOutTypes = [
  { label: 'إضافة', value: '1', color: 'success' },
  { label: 'خصم', value: '2', color: 'error' }
]

export const shrPaymentMethodList = [
  { label: 'شيك', value: '1', color: 'info' },
  { label: 'حوالة بنكية', value: '2', color: 'primary' }
]

export const templateTypeList = [
  { label: 'Custome', value: '1' },
  { label: 'Trigger', value: '2' },
  { label: 'job', value: '3' }
]

export const templateProcessStatusList = [
  { label: 'جديد', value: 1, color: 'success' },
  { label: 'قديم', value: 2, color: 'info' }
]

export const shrBankStatus = [
  { label: 'فعال', value: '1', color: 'success' },
  { label: 'غير فعال', value: '2', color: 'error' }
]

export const shrPayStatus = [
  { label: 'إيقاف', value: '1', color: 'error' },
  { label: 'غير صرف', value: '2', color: 'warning' }
]

export const shrAmountType = [
  { label: 'إضافات', value: '1', color: 'success' },
  { label: 'خصومات', value: '2', color: 'error' },
  { label: 'سلف', value: '3', color: 'warning' }
]

export const shrInheritLegacyTypes = [
  { label: 'من غير كسور', value: '1', color: 'success' },
  { label: 'بكسور وتم التوافق', value: '2', color: 'info' },
  { label: 'بكسور ولم يتم التوافق', value: '3', color: 'error' }
]

export const shrInheritLegacyStatus = [
  { label: 'جديد', value: '1', color: 'info' },
  { label: 'قيد الاعتماد', value: '2', color: 'warning' },
  { label: 'معتمد', value: '3', color: 'success' },
  { label: 'غير معتمد', value: '4', color: 'success' }
]

export const papersAuditListStatus = [
  { label: 'تم تدقيق الأوراق الثبوتية', value: '1', color: 'info' },
  { label: 'تم رفض التدقيق', value: '2', color: 'warning' },
  { label: 'بحاجة الى الإرجاع', value: '3', color: 'success' }
]
export const companyContractorRequestStatus = [
  { label: 'جديد', value: '1', color: 'info' },
  { label: 'تحت الأجراء والتدقيق', value: '2', color: 'warning' },
  { label: 'معتمد', value: '3', color: 'success' },
  { label: 'غير معتمد', value: '4', color: 'error' }
  // { label: 'مُعاد للاستكمال', value: '5', color: 'warning' }
]

export const companyContractorStatus = [
  { label: 'جديد', value: '1', color: 'info' },
  { label: 'تحت الأجراء والتدقيق', value: '2', color: 'warning' },
  { label: 'معتمد', value: '3', color: 'success' },
  { label: 'غير معتمد', value: '4', color: 'error' },
  { label: 'مُعاد للاستكمال', value: '5', color: 'warning' }
]

export const projectContractRequestStatus = [
  { label: 'جديد', value: '1', color: 'info' },
  { label: 'تحت الأجراء والتدقيق', value: '2', color: 'warning' },
  { label: 'تم التعاقد', value: '3', color: 'success' },
  { label: 'مرفوض', value: '4', color: 'error' }
]

export const formFieldTypes = [
  { label: 'نص', value: 'text' },
  { label: 'رقم', value: 'number' },
  { label: 'بريد إلكتروني', value: 'email' },
  { label: 'ملف', value: 'file' },
  { label: 'قائمة منسدلة', value: 'select' },
  { label: 'تاريخ', value: 'date' },
  { label: 'زر اختيار', value: 'checkbox' },
  { label: 'مختار الأيقونات', value: 'icon_picker' }
]
export const allowanceScopeList = [
  { label: 'لجميع الموظفين ولكامل مدة العقد', value: '1', color: 'info' },
  { label: 'عدد محدد في اليوم الواحد', value: '2', color: 'primary' }
]

export const maritalStatusList = [
  { label: 'أعزب', value: '1' },
  { label: 'متزوج', value: '2' },
  { label: 'مطلق', value: '3' },
  { label: 'أرمل', value: '4' }
]

export const identityTypeList = [
  { label: 'مواطن', value: '1', color: 'success' },
  { label: 'ابن مواطن', value: '4', color: 'info' },
  { label: 'زوج مواطنة', value: '3', color: 'warning' },
  { label: 'مقيم', value: '2', color: 'primary' }
]

export const userDepartmentTypeList = [
  { label: 'توظيف', value: '1', color: 'primary' },
  { label: 'فرعية', value: '2', color: 'info' },
  { label: 'أخرى', value: '3', color: 'success' }
]

export const objectTypeList = [
  { label: 'نظام', value: '1', color: 'primary' },
  { label: 'قائمة', value: '2', color: 'info' },
  { label: 'شاشة', value: '3', color: 'success' }
]

export const CONTRACT_STATUS_MESSAGES: Record<string, string> = {
  '3': 'تم التعاقد عليه',
  '4': 'تم رفض طلب التعاقد'
}

export const bloodTypeList = [
  { label: '-A', value: 'A-', apiValue: '1', color: 'error' },
  { label: '+A', value: 'A+', apiValue: '2', color: 'error' },

  { label: '-B', value: 'B-', apiValue: '3', color: 'warning' },
  { label: '+B', value: 'B+', apiValue: '4', color: 'warning' },

  { label: '-AB', value: 'AB-', apiValue: '5', color: 'info' },
  { label: '+AB', value: 'AB+', apiValue: '6', color: 'info' },

  { label: '-O', value: 'O-', apiValue: '7', color: 'success' },
  { label: '+O', value: 'O+', apiValue: '8', color: 'success' }
]

// ✅ IBAN Lengths by Country Code
export const ibanLengths: Record<string, number> = {
  // Middle East & GCC
  SA: 24, // Saudi Arabia
  AE: 23, // United Arab Emirates
  BH: 22, // Bahrain
  KW: 30, // Kuwait
  QA: 29, // Qatar
  OM: 23, // Oman
  JO: 30, // Jordan
  LB: 28, // Lebanon
  EG: 29, // Egypt
  IQ: 23, // Iraq
  PS: 29, // Palestine
  IL: 23, // Israel

  // Europe
  AL: 28, // Albania
  AD: 24, // Andorra
  AT: 20, // Austria
  AZ: 28, // Azerbaijan
  BE: 16, // Belgium
  BA: 20, // Bosnia and Herzegovina
  BG: 22, // Bulgaria
  HR: 21, // Croatia
  CY: 28, // Cyprus
  CZ: 24, // Czech Republic
  DK: 18, // Denmark
  EE: 20, // Estonia
  FO: 18, // Faroe Islands
  FI: 18, // Finland
  FR: 27, // France
  GE: 22, // Georgia
  DE: 22, // Germany
  GI: 23, // Gibraltar
  GR: 27, // Greece
  GL: 18, // Greenland
  HU: 28, // Hungary
  IS: 26, // Iceland
  IE: 22, // Ireland
  IT: 27, // Italy
  XK: 20, // Kosovo
  LV: 21, // Latvia
  LI: 21, // Liechtenstein
  LT: 20, // Lithuania
  LU: 20, // Luxembourg
  MT: 31, // Malta
  MD: 24, // Moldova
  MC: 27, // Monaco
  ME: 22, // Montenegro
  NL: 18, // Netherlands
  MK: 19, // North Macedonia
  NO: 15, // Norway
  PL: 28, // Poland
  PT: 25, // Portugal
  RO: 24, // Romania
  SM: 27, // San Marino
  RS: 22, // Serbia
  SK: 24, // Slovakia
  SI: 19, // Slovenia
  ES: 24, // Spain
  SE: 24, // Sweden
  CH: 21, // Switzerland
  TR: 26, // Turkey
  UA: 29, // Ukraine
  GB: 22, // United Kingdom
  VA: 22, // Vatican City

  // Africa
  DZ: 26, // Algeria
  AO: 25, // Angola
  BJ: 28, // Benin
  BF: 28, // Burkina Faso
  BI: 27, // Burundi
  CM: 27, // Cameroon
  CV: 25, // Cape Verde
  CG: 27, // Congo
  CI: 28, // Ivory Coast
  GA: 27, // Gabon
  GW: 25, // Guinea-Bissau
  IR: 26, // Iran
  MA: 28, // Morocco
  MG: 27, // Madagascar
  ML: 28, // Mali
  MR: 27, // Mauritania
  MU: 30, // Mauritius
  MZ: 25, // Mozambique
  NE: 28, // Niger
  SN: 28, // Senegal
  TG: 28, // Togo
  TN: 24, // Tunisia

  // Central & South America
  BR: 29, // Brazil
  CR: 22, // Costa Rica
  DO: 28, // Dominican Republic
  GT: 28, // Guatemala
  SV: 28, // El Salvador

  // Asia Pacific
  PK: 24, // Pakistan
  TL: 23, // East Timor
  VG: 24, // British Virgin Islands

  // Other
  BY: 28, // Belarus
  KZ: 20, // Kazakhstan
  LC: 32, // Saint Lucia
  SC: 31 // Seychelles
}

// ✅ Country Names in Arabic
export const countryNamesAr: Record<string, string> = {
  // Middle East & GCC
  SA: 'السعودية',
  AE: 'الإمارات',
  BH: 'البحرين',
  KW: 'الكويت',
  QA: 'قطر',
  OM: 'عمان',
  JO: 'الأردن',
  LB: 'لبنان',
  EG: 'مصر',
  IQ: 'العراق',
  PS: 'فلسطين',
  IL: 'إسرائيل',

  // Europe
  AL: 'ألبانيا',
  AD: 'أندورا',
  AT: 'النمسا',
  AZ: 'أذربيجان',
  BE: 'بلجيكا',
  BA: 'البوسنة والهرسك',
  BG: 'بلغاريا',
  HR: 'كرواتيا',
  CY: 'قبرص',
  CZ: 'التشيك',
  DK: 'الدنمارك',
  EE: 'إستونيا',
  FO: 'جزر فارو',
  FI: 'فنلندا',
  FR: 'فرنسا',
  GE: 'جورجيا',
  DE: 'ألمانيا',
  GI: 'جبل طارق',
  GR: 'اليونان',
  GL: 'جرينلاند',
  HU: 'المجر',
  IS: 'آيسلندا',
  IE: 'أيرلندا',
  IT: 'إيطاليا',
  XK: 'كوسوفو',
  LV: 'لاتفيا',
  LI: 'ليختنشتاين',
  LT: 'ليتوانيا',
  LU: 'لوكسمبورغ',
  MT: 'مالطا',
  MD: 'مولدوفا',
  MC: 'موناكو',
  ME: 'الجبل الأسود',
  NL: 'هولندا',
  MK: 'مقدونيا الشمالية',
  NO: 'النرويج',
  PL: 'بولندا',
  PT: 'البرتغال',
  RO: 'رومانيا',
  SM: 'سان مارينو',
  RS: 'صربيا',
  SK: 'سلوفاكيا',
  SI: 'سلوفينيا',
  ES: 'إسبانيا',
  SE: 'السويد',
  CH: 'سويسرا',
  TR: 'تركيا',
  UA: 'أوكرانيا',
  GB: 'المملكة المتحدة',
  VA: 'الفاتيكان',

  // Africa
  DZ: 'الجزائر',
  AO: 'أنغولا',
  BJ: 'بنين',
  BF: 'بوركينا فاسو',
  BI: 'بوروندي',
  CM: 'الكاميرون',
  CV: 'الرأس الأخضر',
  CG: 'الكونغو',
  CI: 'ساحل العاج',
  GA: 'الغابون',
  GW: 'غينيا بيساو',
  IR: 'إيران',
  MA: 'المغرب',
  MG: 'مدغشقر',
  ML: 'مالي',
  MR: 'موريتانيا',
  MU: 'موريشيوس',
  MZ: 'موزمبيق',
  NE: 'النيجر',
  SN: 'السنغال',
  TG: 'توغو',
  TN: 'تونس',

  // Central & South America
  BR: 'البرازيل',
  CR: 'كوستاريكا',
  DO: 'جمهورية الدومينيكان',
  GT: 'غواتيمالا',
  SV: 'السلفادور',

  // Asia Pacific
  PK: 'باكستان',
  TL: 'تيمور الشرقية',
  VG: 'جزر العذراء البريطانية',

  // Other
  BY: 'بيلاروسيا',
  KZ: 'كازاخستان',
  LC: 'سانت لوسيا',
  SC: 'سيشل'
}

// ✅ Country Names in English
export const countryNamesEn: Record<string, string> = {
  // Middle East & GCC
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  BH: 'Bahrain',
  KW: 'Kuwait',
  QA: 'Qatar',
  OM: 'Oman',
  JO: 'Jordan',
  LB: 'Lebanon',
  EG: 'Egypt',
  IQ: 'Iraq',
  PS: 'Palestine',
  IL: 'Israel',

  // Europe
  AL: 'Albania',
  AD: 'Andorra',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BE: 'Belgium',
  BA: 'Bosnia and Herzegovina',
  BG: 'Bulgaria',
  HR: 'Croatia',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  EE: 'Estonia',
  FO: 'Faroe Islands',
  FI: 'Finland',
  FR: 'France',
  GE: 'Georgia',
  DE: 'Germany',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  HU: 'Hungary',
  IS: 'Iceland',
  IE: 'Ireland',
  IT: 'Italy',
  XK: 'Kosovo',
  LV: 'Latvia',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MT: 'Malta',
  MD: 'Moldova',
  MC: 'Monaco',
  ME: 'Montenegro',
  NL: 'Netherlands',
  MK: 'North Macedonia',
  NO: 'Norway',
  PL: 'Poland',
  PT: 'Portugal',
  RO: 'Romania',
  SM: 'San Marino',
  RS: 'Serbia',
  SK: 'Slovakia',
  SI: 'Slovenia',
  ES: 'Spain',
  SE: 'Sweden',
  CH: 'Switzerland',
  TR: 'Turkey',
  UA: 'Ukraine',
  GB: 'United Kingdom',
  VA: 'Vatican City',

  // Africa
  DZ: 'Algeria',
  AO: 'Angola',
  BJ: 'Benin',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  CM: 'Cameroon',
  CV: 'Cape Verde',
  CG: 'Congo',
  CI: 'Ivory Coast',
  GA: 'Gabon',
  GW: 'Guinea-Bissau',
  IR: 'Iran',
  MA: 'Morocco',
  MG: 'Madagascar',
  ML: 'Mali',
  MR: 'Mauritania',
  MU: 'Mauritius',
  MZ: 'Mozambique',
  NE: 'Niger',
  SN: 'Senegal',
  TG: 'Togo',
  TN: 'Tunisia',

  // Central & South America
  BR: 'Brazil',
  CR: 'Costa Rica',
  DO: 'Dominican Republic',
  GT: 'Guatemala',
  SV: 'El Salvador',

  // Asia Pacific
  PK: 'Pakistan',
  TL: 'East Timor',
  VG: 'British Virgin Islands',

  // Other
  BY: 'Belarus',
  KZ: 'Kazakhstan',
  LC: 'Saint Lucia',
  SC: 'Seychelles'
}

export const passportTypeList = [
  { label: 'عادي', value: '1', color: 'info' },
  { label: 'دبلوماسى', value: '2', color: 'warning' },
  { label: 'جواز سفر خاص', value: '3', color: 'primary' },
  { label: 'تذكرة مرور', value: '4', color: 'success' }
]

export const manifestTypeList = [
  { label: 'منافيست', value: '1', color: 'info' },
  { label: 'تنقل بين المدن', value: '2', color: 'primary' }
  // { label: 'إستقبال', value: '3', color: 'primary' },
]

export const hajjCardStatus = [
  {
    label: 'سجل جديد',
    value: 'New Record',
    color: 'primary',
    icon: 'ri-file-add-line'
  },
  {
    label: 'تم قبول الدفعة من مزود الخدمة',
    value: 'Batch Accepted by Service Provider',
    color: 'info',
    icon: 'ri-checkbox-circle-line'
  },
  {
    label: 'في الطريق إلى مركز التوزيع',
    value: 'In Route to Distribution Center',
    color: 'warning',
    icon: 'ri-truck-line'
  },
  {
    label: 'تم الإلغاء',
    value: 'Canceled',
    color: 'error',
    icon: 'ri-close-circle-line'
  },
  {
    label: 'تم التحقق',
    value: 'Validated',
    color: 'success',
    icon: 'ri-shield-check-line'
  },
  {
    label: 'تم الإرسال للطباعة',
    value: 'Sent to Print',
    color: 'secondary',
    icon: 'ri-printer-line'
  }
]
