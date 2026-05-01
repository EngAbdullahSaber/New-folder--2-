import * as Shared from '@/shared'
import { cleanupGlobalStyle } from '@iconify/tools/lib/index.js'

/**
 * Custom hook to handle Nafath authentication check
 */
export const useNafathAccessControl = (
  user: any,
  domain: string,
  mode: Shared.Mode,
  setError: (error: string) => void
) => {
  const [shouldBlockAccess, setShouldBlockAccess] = Shared.useState(false)
  Shared.useEffect(() => {
    const isAddMode = mode === 'add'
    const isNotLocalhost = domain !== 'localhost' && domain !== 'adilla.com.sa'
    const isNotNafathAuth = user?.authMethod !== 'nafath'

    if (user && isNotLocalhost && isAddMode && isNotNafathAuth) {
      setError('يجب الدخول لهذه الشاشة عبر خدمه النفاذ الوطنى فقط')
      setShouldBlockAccess(true)
    }
  }, [user, mode, domain, setError])

  return shouldBlockAccess
}
