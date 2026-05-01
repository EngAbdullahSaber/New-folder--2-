'use client'
import { SQLDebugProvider } from '@/contexts/sqlDebugContext'

export default function SQLDebugWrapper({ children }: { children: React.ReactNode }) {
  return <SQLDebugProvider>{children}</SQLDebugProvider>
}
