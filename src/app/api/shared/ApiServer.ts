// src/api/server.ts
import axios from 'axios'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/libs/auth'

export const apiServer = axios.create({
  baseURL: process.env.API_URL, // Use backend env variable
  headers: { 'Content-Type': 'application/json' }
})

// Middleware to inject the server-side JWT token
export async function withAuthHeaders(headers: Record<string, string> = {}) {
  const session: any = await getServerSession(authOptions) // Server-only access to session
  const token = session?.user?.accessToken

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// Example server-side API call
export async function fetchServerData(endpoint: string) {
  const headers = await withAuthHeaders()

  return apiServer.get(endpoint, { headers })
}
