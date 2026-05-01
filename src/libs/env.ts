// src/lib/env.ts
export function getApiUrl(): string {
  // Client-side
  if (typeof window !== 'undefined') {
    const hostname = window.location.host

    switch (hostname) {
      case 'hms.adilla.com.sa':
        return 'https://hmsapi.adilla.com.sa/api'
      case 'hms.daleelalzowar.sa':
        return 'https://hmsapi.daleel.com.sa/api'
      default:
        return 'https://hmsapi.adilla.com.sa/api'
    }
  }

  // Server-side - use process.env.HOSTNAME or VERCEL_URL
  const hostname = process.env.HOSTNAME || process.env.VERCEL_URL || ''

  if (hostname.includes('daleel')) {
    return 'https://hmsapi.daleel.com.sa/api'
  }

  return 'https://hmsapi.adilla.com.sa/api'
}

export function getNextAuthUrl(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.host

    switch (hostname) {
      case 'hms.adilla.com.sa':
        return 'https://hms.adilla.com.sa'
      case 'hms.daleelalzowar.sa':
        return 'https://hms.daleelalzowar.sa'
      case 'localhost:3000':
        return 'http://localhost:3000'
      default:
        return 'https://hms.adilla.com.sa'
    }
  }

  return process.env.NEXTAUTH_URL || 'https://hms.adilla.com.sa'
}
