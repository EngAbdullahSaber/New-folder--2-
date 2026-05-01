// Next Imports
import { headers } from 'next/headers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'
import 'bootstrap-icons/font/bootstrap-icons.css'

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Style Imports
import '@/app/globals.css'
import '@assets/iconify-icons/generated-icons.css'
import 'remixicon/fonts/remixicon.css'

// Providers & Contexts
import { TabFormProvider } from '@/contexts/useTabForm'
import { PrintModeProvider } from '@/contexts/usePrintModeContext'
import { DialogProvider } from '@/contexts/dialogContext'
import { PageTabsProvider } from '@/contexts/pageTabsContext'
import { TabsProvider } from '@/contexts/tabsContext'
import Providers from '@/components/Providers'

// Utils
import { getSystemMode } from '@/@core/utils/serverHelpers'

import type { Metadata } from 'next'
import { getOperatorConfig } from '@/configs/environment'
import { InitColorSchemeScript } from '@mui/material'
import { InactivityProvider } from '@/contexts/inactivityWarningProvider'

export async function generateMetadata(): Promise<Metadata> {
  let host = 'localhost:3000'

  try {
    const headersList = await headers()
    host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  } catch (e) {
    // headers not available
  }

  const config = getOperatorConfig(host)

  return {
    title: config.title,
    icons: {
      icon: [{ url: `${config.faviconPath}/favicon.ico` }]
    }
  }
}

const RootLayout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {
  const params = await props.params

  const { children } = props

  // Type guard to ensure lang is a valid Locale
  const lang: Locale = i18n.locales.includes(params.lang as Locale) ? (params.lang as Locale) : i18n.defaultLocale

  // Vars
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[lang]

  return (
    <TranslationWrapper lang={lang}>
      <html id='__next' lang={lang} dir={direction} suppressHydrationWarning>
        <body className='flex is-full min-bs-full flex-auto flex-col'>
          <Providers direction={direction}>
            <PrintModeProvider>
              <TabFormProvider>
                <PageTabsProvider>
                  <TabsProvider>
                    <DialogProvider>
                      <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
                      <InactivityProvider timeout={600000} warningTime={60} debounceTime={5000} enabled={true}>
                        {children}
                      </InactivityProvider>
                    </DialogProvider>
                  </TabsProvider>
                </PageTabsProvider>
              </TabFormProvider>
            </PrintModeProvider>
          </Providers>
        </body>
      </html>
    </TranslationWrapper>
  )
}

export default RootLayout
