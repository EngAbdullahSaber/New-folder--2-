import * as Shared from '@/shared'

interface PersonalData {
  id?: number
  fir_name_ar?: string
  far_name_ar?: string
  gra_name_ar?: string
  fam_name_ar?: string
  fir_name_la?: string
  far_name_la?: string
  gra_name_la?: string
  fam_name_la?: string
  birth_place?: string
  birth_date?: string
  id_no?: string
  id_source?: string
  id_issue_date?: string
  id_exp_date?: string
  nationality?: {
    name_ar?: string
  }
  gender?: string
}

/**
 * Maps personal data to form field names
 */
const mapPersonalDataToFormFields = (personal: PersonalData) => ({
  personal_id: personal?.id,
  fir_name_ar: personal?.fir_name_ar,
  far_name_ar: personal?.far_name_ar,
  gra_name_ar: personal?.gra_name_ar,
  fam_name_ar: personal?.fam_name_ar,
  fir_name_la: personal?.fir_name_la,
  far_name_la: personal?.far_name_la,
  gra_name_la: personal?.gra_name_la,
  fam_name_la: personal?.fam_name_la,
  birth_place: personal?.birth_place,
  birth_date: personal?.birth_date,
  id_no: personal?.id_no,
  id_type: personal?.id_source,
  id_issue_date: personal?.id_issue_date,
  id_exp_date: personal?.id_exp_date,
  nation_id: personal?.nationality?.name_ar,
  gender: personal?.gender
})

/**
 * Custom hook to auto-fill personal data in add mode
 */
export const usePersonalDataAutoFill = (personal: PersonalData | undefined, mode: Shared.Mode, formMethods: any) => {
  Shared.useEffect(() => {
    if (!personal || mode !== 'add') return

    const personalData = mapPersonalDataToFormFields(personal)

    Object.entries(personalData).forEach(([key, value]) => {
      if (value && !formMethods.getValues(key)) {
        formMethods.setValue(key, value, { shouldValidate: false })
      }
    })
  }, [mode, personal, formMethods])
}
