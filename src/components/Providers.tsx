// React Imports
import { Suspense } from 'react'

// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'
import ReduxProvider from '@/redux-store/ReduxProvider'

// Component Imports
import ParamCapture from './ParamCapture'

// Styled Component Imports
import AppReactToastify from '@/libs/styles/AppReactToastify'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import { ErrorApiProvider } from '@/contexts/errorApiProvider'
import { SuccessApiProvider } from '@/contexts/successApiProvider'
import ErrorHandler from './shared/ErrorHandler'
import SuccessHandler from './shared/SuccessHandler'
import LoadingContextProvider from '@/contexts/loadingContext'
import { MenuProvider } from '@/contexts/menuContext'
import DateProvider from './DateProvider'
import { WarningApiProvider } from '@/contexts/warningApiProvider'
import { InfoApiProvider } from '@/contexts/infoApiProvider'
import { LOVProvider } from '@/contexts/lovContext'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = async (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = await getMode()
  const settingsCookie = await getSettingsFromCookie()
  const systemMode = await getSystemMode()

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <VerticalNavProvider>
        <WarningApiProvider>
          <InfoApiProvider>
            <SuccessApiProvider>
              <ErrorApiProvider>
                <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
                  <ThemeProvider direction={direction} systemMode={systemMode}>
                    <ReduxProvider>
                      <MenuProvider>
                        <LoadingContextProvider>
                          <LOVProvider>
                            <DateProvider>
                              <Suspense fallback={null}>
                                <ParamCapture />
                              </Suspense>
                              {children}
                            </DateProvider>
                          </LOVProvider>
                        </LoadingContextProvider>
                      </MenuProvider>
                    </ReduxProvider>
                    <AppReactToastify direction={direction} hideProgressBar />
                  </ThemeProvider>
                </SettingsProvider>
              </ErrorApiProvider>
            </SuccessApiProvider>
          </InfoApiProvider>
        </WarningApiProvider>
      </VerticalNavProvider>
    </NextAuthProvider>
  )
}

export default Providers
