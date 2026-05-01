// src/app/[lang]/[...not-found]/page.tsx

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'

interface NotFoundPageProps {
  params: Promise<{
    lang: Locale
  }>
}

const NotFoundPage = async ({ params }: NotFoundPageProps) => {
  // Await params (required in Next.js 15)
  const { lang } = await params

  // Vars
  const direction = i18n.langDirection[lang]
  const mode = await getServerMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
