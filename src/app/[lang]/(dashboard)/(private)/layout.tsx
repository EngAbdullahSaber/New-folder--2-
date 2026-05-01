// Updated Layout Component

import React from 'react'
// MUI Imports
import Button from '@mui/material/Button'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/vertical/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import ScrollToTop from '@core/components/scroll-to-top'
import AuthGuard from '@/hocs/AuthGuard'

// Context Import
import { TabsProvider } from '@/contexts/tabsContext'
import { PageTabsProvider } from '@/contexts/pageTabsContext'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'
import { Alert } from '@mui/material'
import ErrorHandler from '@/components/shared/ErrorHandler'
import SuccessHandler from '@/components/shared/SuccessHandler'
import { LOVProvider } from '@/contexts/lovContext'
import Customizer from '@/@core/components/customizer'
import InfoHandler from '@/components/shared/InfoAlertHandler'
import WarningHandler from '@/components/shared/WarningAlertHandler'
import { AIChatbotProvider } from '@/contexts/aiChatbotContext'
import AIChatbotWidget from '@/views/pages/ai-chatbot-widget'
import SQLDebugWrapper from '@/components/shared/SQLDebugWrapper'
const Layout = async (props: ChildrenType & { params: Promise<{ lang: string }> }) => {
  const params = await props.params

  const { children } = props

  // Type guard to ensure lang is a valid Locale
  const lang: Locale = i18n.locales.includes(params.lang as Locale) ? (params.lang as Locale) : i18n.defaultLocale

  // Vars
  const direction = i18n.langDirection[lang]
  const dictionary = await getDictionary(lang)
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <AuthGuard locale={lang}>
        {/* Wrap everything in AIChatbotProvider so it appears in both layouts */}
        {/* <AIChatbotProvider dictionary={dictionary} lang={lang}>
          <AIChatbotWidget />
        </AIChatbotProvider> */}
        <LayoutWrapper
          systemMode={systemMode}
          verticalLayout={
            <VerticalLayout
              navigation={<Navigation dictionary={dictionary} mode={mode} />}
              navbar={<Navbar />}
              footer={<VerticalFooter />}
            >
              <ErrorHandler />
              <SuccessHandler />
              <InfoHandler />
              <WarningHandler />
              <SQLDebugWrapper>{children}</SQLDebugWrapper>
            </VerticalLayout>
          }
          horizontalLayout={
            <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
              <ErrorHandler />
              <SuccessHandler />
              <InfoHandler />
              <WarningHandler />
              <LOVProvider>{children}</LOVProvider>
            </HorizontalLayout>
          }
        />
        <ScrollToTop className='mui-fixed'>
          <Button
            variant='contained'
            className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          >
            <i className='ri-arrow-up-line' />
          </Button>
        </ScrollToTop>
        <Customizer dir={direction} />
      </AuthGuard>
    </Providers>
  )
}

export default Layout
