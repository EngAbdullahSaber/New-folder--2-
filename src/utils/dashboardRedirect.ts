
const STORAGE_KEY = 'pending_dashboard_type'
const EXPIRATION_TIME = 60 * 30 * 1000 // 30 minutes in milliseconds
const ONLY_IAM_KEY = 'pending_only_iam'

interface StoredType {
  value: string
  expiry: number
}

const isClient = typeof window !== 'undefined'

export const storeDashboardType = (typeValue: string) => {
  if (!isClient) return
  const data: StoredType = {
    value: typeValue,
    expiry: Date.now() + EXPIRATION_TIME
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const getStoredDashboardType = (): string | null => {
  if (!isClient) return null
  const itemStr = localStorage.getItem(STORAGE_KEY)
  if (!itemStr) return null

  try {
    const item: StoredType = JSON.parse(itemStr)
    if (Date.now() > item.expiry) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return item.value
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const clearStoredDashboardType = () => {
  if (!isClient) return
  localStorage.removeItem(STORAGE_KEY)
}


export const storeOnlyIam = (value: string) => {
  if (!isClient) return
  const data: StoredType = {
    value,
    expiry: Date.now() + EXPIRATION_TIME
  }
  localStorage.setItem(ONLY_IAM_KEY, JSON.stringify(data))
}

export const getStoredOnlyIam = (): string | null => {
  if (!isClient) return null
  const itemStr = localStorage.getItem(ONLY_IAM_KEY)
  if (!itemStr) return null

  try {
    const item: StoredType = JSON.parse(itemStr)
    if (Date.now() > item.expiry) {
      localStorage.removeItem(ONLY_IAM_KEY)
      return null
    }
    return item.value
  } catch (e) {
    localStorage.removeItem(ONLY_IAM_KEY)
    return null
  }
}

export const clearStoredOnlyIam = () => {
  if (!isClient) return
  localStorage.removeItem(ONLY_IAM_KEY)
}
