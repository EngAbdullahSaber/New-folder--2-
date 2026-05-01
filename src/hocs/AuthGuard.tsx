// Third-party Imports
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

// Util Imports
import { createAuthOptions } from '@/libs/auth'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000'
  const protocol = headersList.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')

  process.env.NEXTAUTH_URL = `${protocol}://${host}`

  const session = await getServerSession(createAuthOptions(host))

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
