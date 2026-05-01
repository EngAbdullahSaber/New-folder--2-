// app/api/auth/[...nextauth]/route.ts
import { createAuthOptions } from '@/libs/auth'
import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'

async function handler(req: NextRequest, context: any) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'

  const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')

  process.env.NEXTAUTH_URL = `${protocol}://${host}`

  // Pass hostname to createAuthOptions so multi-tenant auth works
  const authOptions = createAuthOptions(host)

  return await NextAuth(authOptions)(req, context)
}

export { handler as GET, handler as POST }
