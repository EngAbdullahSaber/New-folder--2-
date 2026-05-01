import ADILLALOGO from '@/@core/svg/adilla-logo'
import DALEELLOGO from '@/@core/svg/daleel-logo'
import { FC } from 'react'

// src/config/environment.ts
type OperatorConfig = {
  name: string
  apiUrl: string
  nextAuthUrl: string
  domain: string
  faviconPath: string // ✅ Add this
  title: string
  domainLogo: FC<any>
  domainGif: any
  darkImage: string
  lightImage: string
  mapApiKey: string
  printHeader: {
    logoImage: string // ✅ moved here
    season: string
    administration: string
    address: string
    capital: string
  }
}

const OPERATOR_CONFIGS: Record<string, OperatorConfig> = {
  'hms.adilla.com.sa': {
    name: 'Adilla',
    apiUrl: 'https://hmsapi-dev.adilla.com.sa/api',
    nextAuthUrl: 'https://hms.adilla.com.sa',
    domain: 'adilla.com.sa',
    faviconPath: '/favicons/adilla',
    title: 'شركة الأدلاء',
    domainLogo: ADILLALOGO,
    domainGif: '/images/logos/adilla.gif',
    darkImage: '/images/pages/auth-v1-mask-4-dark.png',
    lightImage: '/images/pages/auth-v1-mask-4-light.png',
    mapApiKey: 'AIzaSyD3_JUpG24WCghn2vPKehI1qJmkV7KFjWo',
    printHeader: {
      logoImage: 'adilla.gif',
      season: '1447',
      administration: 'شركة الأدلاء',
      address: 'المدينة المنورة - ص.ب: 4486 - السجل التجاري: 45563217853',
      capital: '13,400,000,000,000 ريال سعودي (مدفوع بالكامل)'
    }
  },
  'hms.daleelalzowar.sa': {
    name: 'Daleel',
    apiUrl: 'https://hmsapi.daleelalzowar.sa/api',
    nextAuthUrl: 'https://hms.daleelalzowar.sa',
    domain: 'daleelalzowar.sa',
    faviconPath: '/favicons/daleel',
    title: 'دليل الزوار',
    domainLogo: DALEELLOGO,
    domainGif: '/images/logos/daleel.gif',
    darkImage: '/images/pages/auth-v1-mask-3-dark.png',
    lightImage: '/images/pages/auth-v1-mask-3-light.png',
    mapApiKey: 'AIzaSyD3_JUpG24WCghn2vPKehI1qJmkV7KFjWo',
    printHeader: {
      logoImage: 'daleel-logo.jpg',
      season: '1447',
      administration: 'دليل الزوار',
      address: 'مكة المكرمة - السجل التجاري: 123456789',
      capital: '5,000,000 ريال سعودي'
    }
  },
  'localhost:3000': {
    name: 'Local',
    apiUrl: 'https://hmsapi.daleelalzowar.sa/api',
    nextAuthUrl: 'http://localhost:3000',
    domain: 'localhost',
    faviconPath: '/favicons/default',
    title: 'Localhost',
    domainLogo: ADILLALOGO,
    domainGif: '/images/logos/adilla.gif',
    darkImage: '/images/pages/auth-v1-mask-2-dark.png',
    lightImage: '/images/pages/auth-v1-mask-2-light.png',
    mapApiKey: 'AIzaSyD3_JUpG24WCghn2vPKehI1qJmkV7KFjWo',
    printHeader: {
      logoImage: 'daleel-logo.jpg',
      season: 'DEV',
      administration: 'بيئة التطوير',
      address: 'Localhost Environment',
      capital: '-'
    }
    //   name: 'Daleel',
    //   apiUrl: 'https://hmsapi.daleelalzowar.sa/api',
    //   nextAuthUrl: 'https://hms.daleelalzowar.sa',
    //   domain: 'daleelalzowar.sa',
    //   faviconPath: '/favicons/daleel',
    //   title: 'دليل الزوار',
    //   domainLogo: DALEELLOGO,
    //   domainGif: '/images/logos/daleel.gif',
    //   darkImage: '/images/pages/auth-v1-mask-3-dark.png',
    //   lightImage: '/images/pages/auth-v1-mask-3-light.png',
    //   mapApiKey: 'AIzaSyD3_JUpG24WCghn2vPKehI1qJmkV7KFjWo',
    //   printHeader: {
    //     logoImage: 'daleel-logo.jpg',
    //     season: '1447',
    //     administration: 'دليل الزوار',
    //     address: 'مكة المكرمة - السجل التجاري: 123456789',
    //     capital: '5,000,000 ريال سعودي'
    //   }
  }
}

// ✅ Helper to find config by hostname
function findConfigByHostname(hostname: string): OperatorConfig {
  // Direct match
  if (OPERATOR_CONFIGS[hostname]) {
    return OPERATOR_CONFIGS[hostname]
  }

  // Partial match
  for (const [key, config] of Object.entries(OPERATOR_CONFIGS)) {
    if (hostname.includes(key) || hostname.includes(config.domain)) {
      return config
    }
  }

  // Default based on environment
  const defaultKey = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'hms.adilla.com.sa'
  return OPERATOR_CONFIGS[defaultKey]
}

// ✅ Main function
export function getOperatorConfig(hostname?: string): OperatorConfig {
  // Client-side
  if (typeof window !== 'undefined') {
    const host = window.location.host
    return findConfigByHostname(host)
  }

  // Server-side - use provided hostname
  if (hostname) {
    return findConfigByHostname(hostname)
  }

  // Fallback to environment variables
  const envHost = process.env.HOSTNAME || process.env.VERCEL_URL
  if (envHost) {
    return findConfigByHostname(envHost)
  }

  // Final fallback
  const fallbackHost = process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'hms.adilla.com.sa'
  return findConfigByHostname(fallbackHost)
}

// ✅ Don't export a static config anymore
// export const config = getOperatorConfig()
