// Third-party Imports
//import 'server-only'

// Type Imports
// import type { Locale } from '@configs/i18n'

// const dictionaries = {
//   en: () => import('@/data/dictionaries/en.json').then(module => module.default),
//   // fr: () => import('@/data/dictionaries/fr.json').then(module => module.default),
//   ar: () => import('@/data/dictionaries/ar.json').then(module => module.default)
// }

// export const getDictionary = async (locale: Locale) => dictionaries[locale]()

// import type { Locale } from '@configs/i18n'

// function deepMerge(target: any, source: any): any {
//   const output = { ...target }
//   for (const key in source) {
//     if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
//       output[key] = deepMerge(target[key], source[key])
//     } else {
//       output[key] = source[key]
//     }
//   }
//   return output
// }

// export const getDictionary = async (locale: Locale) => {
//   if (typeof window === 'undefined') return {}

//   const pathname = window.location.pathname
//   const segments = pathname.split('/').filter(Boolean)
//   const appsIndex = segments.indexOf('apps')
//   const moduleName = appsIndex !== -1 ? segments[appsIndex + 1] : null
//   if (!moduleName) return {}

//   try {
//     // Load base dictionary
//     const baseDict = await import(`@/data/dictionaries/${locale}.json`).then(m => m.default)

//     // Load module dictionary
//     const moduleDict = await import(`@/data/dictionaries/apps/${moduleName}/${locale}.json`).then(m => m.default)

//     // Deep merge: nested objects are merged
//     const merged = deepMerge(baseDict, moduleDict)

//     return merged
//   } catch {
//     return {}
//   }
// }

import type { Locale } from '@configs/i18n'

function deepMerge(target: any, source: any): any {
  const output = { ...target }

  for (const key in source) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      output[key] = deepMerge(target[key], source[key])
    } else {
      output[key] = source[key]
    }
  }

  return output
}

export const getDictionary = async (locale: Locale) => {
  const baseDict = await import(`@/data/dictionaries/${locale}.json`).then(m => m.default)

  if (typeof window === 'undefined') {
    // Server returns base dictionary
    return baseDict
  }

  const pathname = window.location.pathname
  const segments = pathname.split('/').filter(Boolean)
  const appsIndex = segments.indexOf('apps')
  const moduleName = appsIndex !== -1 ? segments[appsIndex + 1] : null

  if (!moduleName) return baseDict

  try {
    const moduleDict = await import(`@/data/dictionaries/apps/${moduleName}/${locale}.json`).then(m => m.default)

    return deepMerge(baseDict, moduleDict)
  } catch {
    return baseDict
  }
}
