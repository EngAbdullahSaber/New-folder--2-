// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import LangRedirect from '@components/LangRedirect'

// Config Imports
import { i18n } from '@configs/i18n'

// ℹ️ Next.js makes requests with `_next` prefix for static/asset files
const invalidLangs = ['_next']

const TranslationWrapper = ({ lang, children }: { lang: Locale } & ChildrenType) => {
  const doesLangExist = i18n.locales.includes(lang)
  const isInvalidLang = invalidLangs.includes(lang)

  return doesLangExist || isInvalidLang ? children : <LangRedirect />
}

export default TranslationWrapper
