import * as Shared from '@/shared'

/**
 * Custom hook to sync general conditions based on mode
 */
export const useGeneralConditionsSync = (mode: Shared.Mode, formMethods: any) => {
  Shared.useEffect(() => {
    const conditionFields = ['general_conditions', 'terms_conditions', 'privacy_policy']
    const value = mode === 'add' ? null : true

    conditionFields.forEach(field => {
      formMethods.setValue(field, value)
    })
  }, [mode, formMethods])
}
