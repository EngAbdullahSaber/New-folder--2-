// src/contexts/sqlDebugContext.tsx (Complete with Event Listener)

'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import { flushPendingQueries, setListenerReady } from '@/app/api/shared/ApiClient'
import { toast, useSessionHandler } from '@/shared'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import type { Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface SQLQuery {
  id: string
  query: string
  timestamp: Date
  endpoint: string
  method: string
  curl: string
  status?: number
  error?: string
}

interface SQLDebugContextType {
  queries: SQLQuery[]
  addQuery: (query: string, endpoint: string, method: string, curl: string, status?: number, error?: string) => void
  clearQueries: () => void
  isVisible: boolean
  toggleVisibility: () => void
  isEnabled: boolean
  toggleEnabled: () => void
  showCurl: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════════════════

const SQLDebugContext = createContext<SQLDebugContextType | undefined>(undefined)

// ═══════════════════════════════════════════════════════════════════════════
// Provider
// ═══════════════════════════════════════════════════════════════════════════

export const SQLDebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queries, setQueries] = useState<SQLQuery[]>([])
  const [isEnabled, setIsEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { canSeeCurl } = useSessionHandler()
  const [mounted, setMounted] = useState(false)
  const { screenData } = useScreenPermissions('*') // ✅ Get screen data inside component

  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ✅ Handle Hydration & Initial State
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('sql-debug-enabled')
    if (stored !== null) {
      setIsEnabled(stored === 'true')
    } else {
      setIsEnabled(true) // Default to true
    }
  }, [])

  const addQuery = useCallback(
    (query: string, endpoint: string, method: string, curl: string, status?: number, error?: string) => {
      const newQuery: SQLQuery = {
        id: `${Date.now()}-${Math.random()}`,
        query,
        timestamp: new Date(),
        endpoint,
        method,
        curl,
        status,
        error
      }

      setQueries(prev => [newQuery, ...prev].slice(0, 50))
    },
    []
  )

  const clearQueries = useCallback(() => {
    setQueries([])
  }, [])

  useEffect(() => {
    if (!mounted) return

    clearQueries()
  }, [pathname, searchParams, mounted, clearQueries])

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev)
  }, [])

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('sql-debug-enabled', String(newValue))
      }
      return newValue
    })
  }, [])

  // ✅ Listen for SQL debug events from axios interceptor

  useEffect(() => {
    if (!isEnabled || !mounted) return

    const handleSQLDebug = (event: CustomEvent) => {
      const { query, endpoint, method, curl, status, error } = event.detail

      addQuery(query, endpoint, method, curl, status, error)
    }

    window.addEventListener('sql-debug', handleSQLDebug as EventListener)

    // ✅ بعد ما الـ listener اتسجل، أرسل الـ pending queries
    setTimeout(() => {
      flushPendingQueries()
    }, 100) // ✅ setTimeout صغير يضمن إن الـ listener سجّل فعلًا

    return () => {
      window.removeEventListener('sql-debug', handleSQLDebug as EventListener)
    }
  }, [isEnabled, addQuery, mounted])

  return (
    <SQLDebugContext.Provider
      value={{
        queries,
        addQuery,
        clearQueries,
        isVisible,
        toggleVisibility,
        isEnabled,
        toggleEnabled,
        showCurl: canSeeCurl // ✅
      }}
    >
      {children}
      {mounted && isEnabled && queries.length > 0 && canSeeCurl && <SQLDebugPanel screenData={screenData} />}
    </SQLDebugContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

export const useSQLDebug = () => {
  const context = useContext(SQLDebugContext)
  if (!context) {
    throw new Error('useSQLDebug must be used within SQLDebugProvider')
  }
  return context
}

// ═══════════════════════════════════════════════════════════════════════════
// Debug Panel Component
// ═══════════════════════════════════════════════════════════════════════════

const SQLDebugPanel: React.FC<{ screenData?: { object_name_ar?: string } }> = ({ screenData }) => {
  const { queries, clearQueries, isVisible, toggleVisibility, showCurl } = useSQLDebug()
  const [userNote, setUserNote] = useState('')
  const [expandedQueries, setExpandedQueries] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<Record<string, 'sql' | 'curl'>>({})
  const [copyDialogOpen, setCopyDialogOpen] = useState(false)
  const params = useParams()
  const { lang: locale } = params
  const [dictionary, setDictionary] = useState<any>(null)
  useEffect(() => {
    getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])
  const availableTabs = showCurl ? (['sql', 'curl'] as const) : (['sql'] as const)
  const getTab = (id: string) => activeTab[id] || 'sql'
  const setTab = (id: string, tab: 'sql' | 'curl') => {
    setActiveTab(prev => ({ ...prev, [id]: tab }))
  }

  const toggleQuery = (id: string) => {
    setExpandedQueries(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const copyQuery = (query: string) => {
    navigator.clipboard.writeText(query)
    // Optional: Show toast notification
  }

  if (!isVisible) {
    const hasErrors = queries.some(q => (q.status && q.status >= 400) || q.error)

    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999
        }}
      >
        <Tooltip title='Show SQL Queries'>
          <IconButton
            onClick={toggleVisibility}
            sx={{
              bgcolor: hasErrors ? 'error.main' : 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: hasErrors ? 'error.dark' : 'primary.dark' },
              width: 56,
              height: 56,
              boxShadow: 3,
              animation: hasErrors ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)'
                },
                '70%': {
                  boxShadow: '0 0 0 15px rgba(244, 67, 54, 0)'
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)'
                }
              }
            }}
          >
            <i className='ri-database-2-line' style={{ fontSize: 24 }} />
            {queries.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  bgcolor: hasErrors ? 'error.main' : 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 'bold'
                }}
              >
                {hasErrors ? queries.filter(q => (q.status && q.status >= 400) || q.error).length : queries.length}
              </Box>
            )}
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  return (
    <>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 600,
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: '70vh',
          zIndex: 9999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 6
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className='ri-database-2-line' style={{ fontSize: 20 }} />
            <Typography variant='h6' sx={{ fontSize: 16 }}>
              SQL Debug ({queries.length})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {queries.some(q => (q.status && q.status >= 400) || q.error) && (
              <Tooltip
                title={locale === 'ar' ? 'نسخ جميع المشاكل' : 'Copy All Problems'}
                arrow
                placement='top'
                PopperProps={{
                  sx: { zIndex: 9999 }
                }}
              >
                <IconButton
                  size='small'
                  onClick={() => {
                    const errorCurls = queries
                      .filter(q => (q.status && q.status >= 400) || q.error)
                      .map(q => q.curl)
                      .join(
                        '\n************************************************************************************************\n'
                      )

                    setCopyDialogOpen(true)
                    const reportMetadata = generateReportMetadata(errorCurls, screenData, userNote)
                    // navigator.clipboard.writeText(reportMetadata)
                  }}
                  sx={{ color: 'white' }}
                >
                  <i className='ri-file-copy-line' />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Clear All'>
              <IconButton size='small' onClick={clearQueries} sx={{ color: 'white' }}>
                <i className='ri-delete-bin-line' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Minimize'>
              <IconButton size='small' onClick={toggleVisibility} sx={{ color: 'white' }}>
                <i className='ri-arrow-down-s-line' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Note Input */}

        {/* Queries List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {queries.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'text.secondary'
              }}
            >
              <i className='ri-database-2-line' style={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant='body2' sx={{ mt: 2 }}>
                No queries yet
              </Typography>
            </Box>
          ) : (
            queries.map(query => {
              const isExpanded = expandedQueries.has(query.id)
              return (
                <Paper
                  key={query.id}
                  elevation={1}
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {/* Query Header */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleQuery(query.id)}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box
                          sx={{
                            px: 1,
                            py: 0.25,
                            bgcolor: query.status && query.status >= 400 ? 'error.main' : getMethodColor(query.method),
                            color: 'white',
                            borderRadius: 1,
                            fontSize: 11,
                            fontWeight: 'bold'
                          }}
                        >
                          {query.method} {query.status || ''}
                        </Box>
                        <Typography
                          variant='body2'
                          sx={{
                            fontSize: 12,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {query.endpoint}
                        </Typography>
                      </Box>
                      <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: 11 }}>
                        {query.timestamp.toLocaleTimeString()}
                      </Typography>

                      {query.error && (
                        <Typography
                          variant='caption'
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            color: 'error.main',
                            fontSize: 11
                          }}
                        >
                          {query.error}
                        </Typography>
                      )}
                    </Box>
                    {/* <IconButton size='small'>
                    <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`} />
                  </IconButton> */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {(query.status && query.status >= 400) || query.error ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip
                            title={locale === 'ar' ? 'نسخ المشكلة الواحدة' : 'Copy Single Problem'}
                            arrow
                            placement='top'
                            PopperProps={{
                              sx: { zIndex: 9999 }
                            }}
                          >
                            <span>
                              <IconButton
                                size='small'
                                onClick={async e => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const reportMetadata = generateReportMetadata(query.curl, screenData)
                                  await navigator.clipboard.writeText(reportMetadata)
                                }}
                              >
                                <i className='ri-file-line' />
                              </IconButton>
                            </span>
                          </Tooltip>

                          {/* <Tooltip title='Report to Dev (WhatsApp)' arrow placement='top'>
                          <IconButton
                            size='small'
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              const reportMetadata = generateReportMetadata(query.curl, screenData)
                              const phoneNumber = '+966566710798'
                              const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(reportMetadata)}`
                              window.open(url, '_blank')
                            }}
                            sx={{
                              color: '#25D366',
                              bgcolor: 'rgba(37, 211, 102, 0.1)',
                              '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.2)' }
                            }}
                          >
                            <i className='ri-whatsapp-fill' />
                          </IconButton>
                        </Tooltip> */}
                        </Box>
                      ) : null}

                      <IconButton size='small'>
                        <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`} />
                      </IconButton>
                    </Box>
                  </Box>
                  {/* Query Content */}
                  <Collapse in={isExpanded}>
                    <Box sx={{ bgcolor: 'background.default' }}>
                      {/* ✅ Tab Switcher */}
                      <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
                        {availableTabs.length > 1 && (
                          <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
                            {availableTabs.map(tab => (
                              <Box
                                key={tab}
                                onClick={() => setTab(query.id, tab)}
                                sx={{
                                  px: 2,
                                  py: 1,
                                  cursor: 'pointer',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  color: getTab(query.id) === tab ? 'primary.main' : 'text.secondary',
                                  borderBottom: '2px solid',
                                  borderColor: getTab(query.id) === tab ? 'primary.main' : 'transparent',
                                  transition: 'all 0.2s',
                                  '&:hover': { color: 'primary.main' }
                                }}
                              >
                                {tab === 'sql' ? '🗄 SQL' : '🖥 cURL'}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* ✅ Content */}
                      <Box
                        sx={{
                          position: 'relative',
                          bgcolor: '#1e1e1e',
                          color: '#d4d4d4',
                          p: 2,
                          pt: 1.5,
                          fontFamily: 'monospace',
                          fontSize: 12,
                          maxHeight: 200,
                          overflow: 'auto'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1, gap: 1 }}>
                          <Tooltip title='Copy' arrow placement='top'>
                            <IconButton
                              size='small'
                              onClick={() => copyQuery(getTab(query.id) === 'sql' ? query.query : query.curl)}
                              sx={{
                                bgcolor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                              }}
                            >
                              <i className='ri-file-copy-line' style={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          {/* <Tooltip title='Send to WhatsApp' arrow placement='top'>
                          <IconButton
                            size='small'
                            onClick={() => {
                              const text = getTab(query.id) === 'sql' ? query.query : query.curl
                              const phoneNumber = '+201126054336'
                              const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`
                              window.open(url, '_blank')
                            }}
                            sx={{
                              bgcolor: 'rgba(37, 211, 102, 0.2)',
                              color: '#25D366',
                              '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.3)' }
                            }}
                          >
                            <i className='ri-whatsapp-line' style={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip> */}
                        </Box>

                        <pre
                          style={{
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                            textAlign: 'left',
                            direction: 'ltr'
                          }}
                        >
                          {getTab(query.id) === 'sql' ? formatSQL(query.query) : query.curl || 'No cURL available'}
                        </pre>
                      </Box>
                    </Box>
                  </Collapse>
                </Paper>
              )
            })
          )}
        </Box>
      </Paper>

      {/* Copy Dialog */}
      <Dialog
        open={copyDialogOpen}
        onClose={() => setCopyDialogOpen(false)}
        maxWidth='md'
        fullWidth
        sx={{ zIndex: 10000 }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {dictionary?.navigation?.details || (locale === 'ar' ? 'تفاصيل التقرير' : 'Report Details')}
          <IconButton onClick={() => setCopyDialogOpen(false)} size='small'>
            <i className='ri-close-line' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={
              dictionary?.placeholders?.remarks ||
              (locale === 'ar' ? 'إضافة ملاحظة للمطور...' : 'Add a note for the developer...')
            }
            placeholder={locale === 'ar' ? 'مثلاً: المشكلة تظهر عند الحفظ...' : 'e.g. Error happens on save...'}
            fullWidth
            multiline
            size='small'
            value={userNote}
            onChange={e => setUserNote(e.target.value)}
            variant='filled'
            autoFocus
            rows={12}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          {/* <div className='flex justify-between'> */}
          <Button onClick={() => setCopyDialogOpen(false)}>
            {dictionary?.actions?.cancel || (locale === 'ar' ? 'إلغاء' : 'Cancel')}
          </Button>
          <Button
            variant='contained'
            startIcon={<i className='ri-save-line' />}
            onClick={() => {
              const errorQueries = queries.filter(q => (q.status && q.status >= 400) || q.error)
              console.log({ errorQueries })
              const errorCurls = queries
                .filter(q => (q.status && q.status >= 400) || q.error)
                .map(q => q.curl)
                .join('\n**********************************\n')
              const fullReport = generateReportMetadata(errorCurls, screenData, userNote)
              navigator.clipboard.writeText(fullReport)
              toast.success(locale === 'ar' ? 'تم حفظ ونسخ التقرير بنجاح' : 'Report saved and copied successfully')
              setCopyDialogOpen(false)
            }}
          >
            {locale === 'ar' ? 'حفظ ونسخ التقرير' : 'Save & Copy Report'}
          </Button>
          {/* </div> */}
        </DialogActions>
      </Dialog>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════
// ✅ دالة تحقق من صلاحية المستخدم
const generateReportMetadata = (curl: string, screenData?: { object_name_ar?: string }, note?: string): string => {
  const screenName = screenData?.object_name_ar
    ? screenData.object_name_ar
    : typeof window !== 'undefined'
      ? document.title.split('-')[0].split('|')[0].trim() || 'Unknown Screen'
      : 'Unknown Screen'

  return `🚀 *SYSTEM REPORT*
🖥 *الشاشة:* ${screenName}
📍 *الرابط:* ${typeof window !== 'undefined' ? window.location.href : ''}
🕒 *الوقت:* ${new Date().toLocaleString('ar-EG')}
${note ? `📝 *ملاحظة:* ${note}` : ''}
--------------------------------
🛠 *CURL:*
\`\`\`
${curl}
\`\`\`
`
}

const formatSQL = (sql: string): string => {
  return sql
    .replace(/\bselect\b/gi, 'SELECT')
    .replace(/\bfrom\b/gi, '\nFROM')
    .replace(/\bwhere\b/gi, '\nWHERE')
    .replace(/\band\b/gi, '\n  AND')
    .replace(/\bor\b/gi, '\n  OR')
    .replace(/\border by\b/gi, '\nORDER BY')
    .replace(/\bgroup by\b/gi, '\nGROUP BY')
    .replace(/\bhaving\b/gi, '\nHAVING')
    .replace(/\blimit\b/gi, '\nLIMIT')
    .replace(/\boffset\b/gi, 'OFFSET')
    .replace(/\bjoin\b/gi, '\nJOIN')
    .replace(/\bleft join\b/gi, '\nLEFT JOIN')
    .replace(/\bright join\b/gi, '\nRIGHT JOIN')
    .replace(/\binner join\b/gi, '\nINNER JOIN')
}

const getMethodColor = (method: string): string => {
  const colors: Record<string, string> = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2'
  }
  return colors[method.toUpperCase()] || '#999'
}
