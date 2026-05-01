import * as Shared from '@/shared'

interface AppSettings {}

/**
 * Custom hook to fetch and manage app settings
 */
export const useAppSettings = (
  accessToken: string | undefined,
  mode: Shared.Mode,
  dataModelId: number | undefined,
  locale: string | string[] | undefined,
  formMethods: any,
  shouldBlockAccess: boolean
) => {
  const [appSettings, setAppSettings] = Shared.useState<AppSettings>()

  Shared.useEffect(() => {
    const fetchAppSettings = async () => {
      if (!accessToken || shouldBlockAccess) return

      try {
        const { data } = await Shared.apiClient.get('/aut/app-settings-by-season', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept-Language': locale
          }
        })

        const settings = data?.data
        if (settings) {
          setAppSettings(settings)
        }
      } catch (err) {
        console.error('Error fetching app settings:', err)
      }
    }

    const shouldFetch = mode === 'add' || mode === 'search' || ((mode === 'show' || mode === 'edit') && dataModelId)

    if (shouldFetch) {
      fetchAppSettings()
    }
  }, [accessToken, mode, dataModelId, locale, formMethods, shouldBlockAccess])

  return appSettings
}
