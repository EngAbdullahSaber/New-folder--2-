// src/hooks/useOperatorConfig.ts
'use client'

import { useState, useEffect } from 'react'

type OperatorConfig = {
  name: string
  backendUrl: string
  nextAuthUrl: string
  domain: string
  faviconPath: string // ✅ Add this
  title: string
}

const OPERATOR_CONFIGS: Record<string, OperatorConfig> = {
  'hms.adilla.com.sa': {
    name: 'Adilla',
    backendUrl: 'https://hmsapi-dev.adilla.com.sa/api',
    nextAuthUrl: 'https://hms.adilla.com.sa',
    domain: 'adilla.com.sa',
    faviconPath: '/favicons/adilla',
    title: 'Adilla HMS'
  },
  'hms.daleelalzowar.sa': {
    name: 'Daleel',
    backendUrl: 'https://hmsapi.daleelalzowar.sa/api',
    nextAuthUrl: 'https://hms.daleelalzowar.sa',
    domain: 'daleelalzowar.sa',
    faviconPath: '/favicons/daleel',
    title: 'Daleel HMS'
  },
  'localhost:3000': {
    name: 'Local',
    backendUrl: 'https://hmsapi-dev.adilla.com.sa/api',
    nextAuthUrl: 'http://localhost:3000',
    domain: 'localhost',
    faviconPath: '/favicons/default',
    title: 'HMS Dev'
  }
}

export function useOperatorConfig() {
  const [config, setConfig] = useState<OperatorConfig>(OPERATOR_CONFIGS['hms.adilla.com.sa'])

  useEffect(() => {
    const hostname = window.location.host
    setConfig(OPERATOR_CONFIGS[hostname] || OPERATOR_CONFIGS['hms.adilla.com.sa'])
  }, [])

  return config
}
