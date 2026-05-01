import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

export const useNavigation = () => {
  const serializeQuery = (data?: Record<string, any>) => {
    if (!data) return ''

    const params = new URLSearchParams()

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return
      }

      if (typeof value === 'object') {
        params.append(key, JSON.stringify(value))
      } else if (typeof value === 'string') {
        // ✅ If it's already a JSON string of an object, don't re-stringify
        try {
          const parsed = JSON.parse(value)
          if (typeof parsed === 'object' && parsed !== null) {
            params.append(key, value) // already serialized, use as-is
            return
          }
        } catch {
          // not a JSON string, treat normally
        }
        params.append(key, value)
      } else {
        params.append(key, String(value))
      }
    })

    return params.toString()
  }

  const navigateWithQuery = (routerUrl: string, router: any, locale: Locale, data?: Partial<Record<string, any>>) => {
    const queryString = serializeQuery(data)

    const url = queryString ? `${routerUrl}?${queryString}` : routerUrl

    router.push(getLocalizedUrl(url, locale))
  }

  return { navigateWithQuery }
}
