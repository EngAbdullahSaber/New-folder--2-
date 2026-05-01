'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  action?: ChatAction
  status?: 'pending' | 'confirmed' | 'executed' | 'cancelled'
}

export interface ChatAction {
  type: 'navigate' | 'filter' | 'delete' | 'export' | 'create' | 'update' | 'info'
  label: string
  payload: Record<string, any>
  requiresConfirmation: boolean
}

interface AIChatbotContextType {
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]
  isLoading: boolean
  openChat: () => void
  closeChat: () => void
  toggleMinimize: () => void
  sendMessage: (text: string) => Promise<void>
  executeAction: (messageId: string) => Promise<void>
  cancelAction: (messageId: string) => void
  clearMessages: () => void
  dictionary: any // Add dictionary to context
  lang: string
}

const AIChatbotContext = createContext<AIChatbotContextType | null>(null)

// ─── System Prompt Builder ─────────────────────────────────────────────────
const buildSystemPrompt = (screenContext?: string, lang: string = 'ar') => `
أنت مساعد ذكي داخل نظام إدارة متكامل (ERP). مهمتك مساعدة المستخدم في:
١. التنقل بين الشاشات
٢. تنفيذ العمليات (بحث، حذف، تصدير، إنشاء)
٣. اتخاذ القرارات بناءً على البيانات

الشاشات المتاحة في النظام:
- /dashboard → لوحة التحكم الرئيسية
- /employees → إدارة الموظفين
- /departments → الأقسام
- /salaries → الرواتب
- /attendance → الحضور والغياب
- /reports → التقارير
- /settings → الإعدادات

${screenContext ? `السياق الحالي: ${screenContext}` : ''}

قواعد الرد:
- رد دائماً بـ JSON فقط بدون أي نص خارجه
- لا تضع markdown أو backticks حول الـ JSON

صيغة الرد الإلزامية:
{
  "message": "رسالة واضحة ومختصرة للمستخدم باللغة (${lang === 'ar' ? 'العربية' : 'الإنجليزية'})",
  "action": {
    "type": "navigate | filter | delete | export | create | update | info | none",
    "label": "وصف العملية باللغة (${lang === 'ar' ? 'العربية' : 'الإنجليزية'})",
    "payload": {},
    "requiresConfirmation": false
  } | null
}

أمثلة:
- "روح شاشة الموظفين" → navigate إلى /employees
- "ابحث عن موظفين تعينوا 2024" → filter بفلاتر محددة
- "صدّر البيانات" → export
- "احذف السجلات المعلقة" → delete مع requiresConfirmation: true
`

// ─── Provider ─────────────────────────────────────────────────────────────
export const AIChatbotProvider = ({
  children,
  onNavigate,
  onFilter,
  onAction,
  screenContext,
  dictionary,
  lang = 'ar'
}: {
  children: React.ReactNode
  onNavigate?: (path: string) => void
  onFilter?: (filters: Record<string, any>) => void
  onAction?: (action: ChatAction) => Promise<void>
  screenContext?: string
  dictionary: any
  lang?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: dictionary?.chatbot?.welcome_message || 'مرحباً! 👋 أنا مساعدك الذكي. قولي عايز تعمل إيه أو تروح فين وأنا هساعدك فوراً.',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const openChat = useCallback(() => {
    setIsOpen(true)
    setIsMinimized(false)
  }, [])

  const closeChat = useCallback(() => setIsOpen(false), [])
  const toggleMinimize = useCallback(() => setIsMinimized(p => !p), [])
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: dictionary?.chatbot?.welcome_message || 'مرحباً! 👋 أنا مساعدك الذكي. قولي عايز تعمل إيه أو تروح فين وأنا هساعدك فوراً.',
        timestamp: new Date()
      }
    ])
  }, [])

  // ─── Send Message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMsg])
      setIsLoading(true)

      try {
        // Build conversation history for context
        const history = messages
          .filter(m => m.id !== 'welcome')
          .slice(-6) // last 6 messages for context window
          .map(m => ({ role: m.role, content: m.content }))

        const response = await fetch('/api/ai-chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history,
            systemPrompt: buildSystemPrompt(screenContext, lang)
          })
        })

        if (!response.ok) throw new Error('API error')

        const data = await response.json()
        const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: parsed.message,
          timestamp: new Date(),
          action: parsed.action?.type !== 'none' ? parsed.action : undefined,
          status: parsed.action?.type !== 'none' ? 'pending' : undefined
        }

        setMessages(prev => [...prev, assistantMsg])

        // Auto-execute non-destructive actions (navigate, filter, info)
        if (parsed.action && !parsed.action.requiresConfirmation) {
          await executeActionPayload(assistantMsg.id, parsed.action)
          setMessages(prev => prev.map(m => (m.id === assistantMsg.id ? { ...m, status: 'executed' } : m)))
        }
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: dictionary?.chatbot?.error_message || 'عذراً، حصل خطأ. حاول تاني. 🔄',
            timestamp: new Date()
          }
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, screenContext, dictionary, lang]
  )

  // ─── Execute Action Payload ───────────────────────────────────────────────
  const executeActionPayload = useCallback(
    async (msgId: string, action: ChatAction) => {
      switch (action.type) {
        case 'navigate':
          onNavigate?.(action.payload.path)
          break
        case 'filter':
          onFilter?.(action.payload.filters)
          break
        default:
          await onAction?.(action)
      }
    },
    [onNavigate, onFilter, onAction]
  )

  // ─── Confirm & Execute Action ────────────────────────────────────────────
  const executeAction = useCallback(
    async (messageId: string) => {
      const msg = messages.find(m => m.id === messageId)
      if (!msg?.action) return

      setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, status: 'executed' } : m)))

      await executeActionPayload(messageId, msg.action)

      setMessages(prev => [
        ...prev,
        {
          id: `confirm-${Date.now()}`,
          role: 'assistant',
          content: `${dictionary?.chatbot?.actions?.executed || '✓ تم التنفيذ'} "${msg.action!.label}" ${dictionary?.chatbot?.actions?.success || 'بنجاح!'}`,
          timestamp: new Date()
        }
      ])
    },
    [messages, executeActionPayload, dictionary]
  )

  const cancelAction = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => (m.id === messageId ? { ...m, status: 'cancelled' } : m)))
  }, [])

  return (
    <AIChatbotContext.Provider
      value={{
        isOpen,
        isMinimized,
        messages,
        isLoading,
        openChat,
        closeChat,
        toggleMinimize,
        sendMessage,
        executeAction,
        cancelAction,
        clearMessages,
        dictionary,
        lang
      }}
    >
      {children}
    </AIChatbotContext.Provider>
  )
}

export const useAIChatbot = () => {
  const ctx = useContext(AIChatbotContext)
  if (!ctx) throw new Error('useAIChatbot must be used inside AIChatbotProvider')
  return ctx
}
