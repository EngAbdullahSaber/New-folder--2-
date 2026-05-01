// configs/auth.ts
import CredentialProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import { getOperatorConfig } from '@/configs/environment'

export const filterObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const filteredEntries = Object.entries(obj).filter(([key, value]) => {
    if (value === undefined || value === '' || value === null) return false

    if (typeof value === 'object' && value !== null) {
      const filteredObject = filterObject(value)
      return Object.keys(filteredObject).length > 0
    }

    return true
  })

  return Object.fromEntries(filteredEntries) as Partial<T>
}

export function createAuthOptions(hostname?: string): NextAuthOptions {
  return {
    providers: [
      CredentialProvider({
        name: 'Credentials',
        type: 'credentials',
        credentials: {},
        async authorize(credentials) {
          const config = getOperatorConfig(hostname)

          const { id, password, verify_code, email_verify_code, method, token, msgId, nameId } = credentials as {
            id: string
            password: string
            verify_code: string
            email_verify_code: string
            method: string
            token: string
            msgId: string
            nameId: string
          }

          try {
            const apiUrl = `${config.apiUrl}/${method || 'login'}`

            const res = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'ar',
                'User-Agent': 'NextAuth-Server',
                Accept: '*'
              },
              body: JSON.stringify({ id, password, verify_code, email_verify_code, token, msgId, nameId })
            })

            const data = await res.json()

            if (res.status === 401 || res.status === 404) {
              throw new Error(JSON.stringify(data))
            }

            if (res.status === 200) {
              return {
                ...data['data'],
                authMethod: method === 'nafath/login' ? 'nafath' : 'credentials'
              }
            } else {
              throw new Error(JSON.stringify(data))
            }
          } catch (e: any) {
            throw new Error(e.message)
          }
        }
      })
    ],

    debug: true,

    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60
    },

    pages: {
      signIn: '/login',
      signOut: '/login',
      error: '/login'
    },

    callbacks: {
      async jwt({ token, user, trigger, session }: any) {
        if (trigger === 'update' && session?.user) {
          return { ...token, ...session.user }
        }

        if (user) {
          // ✅ Store only minimal essential data in JWT
          return {
            ...token,
            accessToken: user.token,
            id: user?.id,
            personal_id: user?.personal_id,
            email: user?.email,
            mobile: user?.mobile,
            full_name_ar: user?.full_name_ar,
            accessTokenExpires: Date.now() + 60 * 60 * 1000,
            refreshToken: user.refresh_token,
            // ✅ Store only IDs and essential info, not full objects
            context: user.context,
            user_groups: user.user_groups?.map((g: any) => g.id), // Only store IDs
            has_personal: !!user.personal, // Boolean flag
            personal_picture: user.files?.find((f: any) => f.description === 'personal_picture')?.path || null,
            authMethod: user.authMethod,
            isNew: user.isNew || false,
            channels: user.channels || [], // Store channels if needed for routing
            acceptance: user.acceptance || null // Store acceptance status if relevant for routing
          }
        }

        if (typeof token.accessTokenExpires === 'number' && Date.now() >= token.accessTokenExpires) {
          try {
            return token
          } catch (error) {
            return { ...token, error: 'RefreshAccessTokenError' }
          }
        }

        return token
      },

      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        if (url.startsWith('/')) {
          return `${baseUrl}${url}`
        }

        try {
          const urlOrigin = new URL(url).origin
          const baseOrigin = new URL(baseUrl).origin

          if (urlOrigin === baseOrigin) {
            return url
          }
        } catch (error) {
          // Invalid URL, fall through to return baseUrl
        }

        return baseUrl
      },

      async session({ session, token }: any) {
        // ✅ Return minimal session data
        session.user = {
          id: token.id,
          personal_id: token.personal_id,
          email: token.email,
          mobile: token.mobile,
          full_name_ar: token.full_name_ar,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          context: token.context,
          user_groups: token.user_groups,
          has_personal: token.has_personal,
          personal_picture: token.personal_picture,
          authMethod: token.authMethod,
          isNew: token.isNew,
          channels: token.channels,
          acceptance: token.acceptance
        }

        return session
      }
    }
  }
}

export const authOptions: NextAuthOptions = createAuthOptions()
