'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useAIChatbot, ChatMessage, ChatAction } from '@/contexts/aiChatbotContext'

// ─── Action config ─────────────────────────────────────────────────────────
const actionColors: Record<string, string> = {
  navigate: 'var(--mui-palette-primary-main)',
  filter: 'var(--mui-palette-info-main)',
  delete: 'var(--mui-palette-error-main)',
  export: 'var(--mui-palette-success-main)',
  create: 'var(--mui-palette-warning-main)',
  update: 'var(--mui-palette-secondary-main)',
  info: 'var(--mui-palette-info-main)'
}

const actionIcons: Record<string, string> = {
  navigate: '↗',
  filter: '⌕',
  delete: '⌫',
  export: '↑',
  create: '+',
  update: '✎',
  info: 'i'
}

// ─── Message Bubble ────────────────────────────────────────────────────────
const MessageBubble = ({
  msg,
  onExecute,
  onCancel,
  dictionary,
  lang
}: {
  msg: ChatMessage
  onExecute: (id: string) => void
  onCancel: (id: string) => void
  dictionary: any
  lang: string
}) => {
  const isUser = msg.role === 'user'
  const accentColor = msg.action ? (actionColors[msg.action.type] || 'var(--mui-palette-primary-main)') : 'var(--mui-palette-primary-main)'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        animation: 'msgIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexDirection: isUser ? 'row-reverse' : 'row' }}>
        {/* Avatar dot */}
        <div
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            flexShrink: 0,
            marginBottom: '4px',
            background: isUser ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-secondary-main)',
            boxShadow: isUser ? '0 0 8px var(--mui-palette-primary-main)' : '0 0 8px var(--mui-palette-secondary-main)'
          }}
        />

        {/* Bubble */}
        <div
          style={{
            maxWidth: '78%',
            background: isUser
              ? 'var(--mui-palette-primary-mainOpacity)'
              : 'var(--mui-palette-background-paper)',
            border: isUser
              ? '1px solid var(--mui-palette-primary-main)'
              : '1px solid var(--mui-palette-divider)',
            borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
            padding: '10px 14px',
            color: 'var(--mui-palette-text-primary)',
            fontSize: '13px',
            lineHeight: '1.65',
            direction: 'rtl',
            letterSpacing: '0.01em'
          }}
        >
          {msg.content}
        </div>
      </div>

      {/* Action Card */}
      {msg.action && msg.status === 'pending' && (
        <div
          style={{
            marginTop: '8px',
            marginRight: isUser ? '15px' : '0',
            marginLeft: isUser ? '0' : '15px',
            background: 'var(--mui-palette-action-hover)',
            border: `1px solid ${accentColor}33`,
            borderLeft: isUser ? undefined : `2px solid ${accentColor}`,
            borderRight: isUser ? `2px solid ${accentColor}` : undefined,
            borderRadius: '10px',
            padding: '10px 12px',
            direction: 'rtl',
            animation: 'msgIn 0.3s ease-out'
          }}
        >
          {/* Action label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '5px',
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
                color: accentColor,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              {actionIcons[msg.action.type]}
            </span>
            <span style={{ color: accentColor, fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em' }}>
              {msg.action.label}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => onExecute(msg.id)}
              style={{
                flex: 1,
                padding: '7px',
                borderRadius: '8px',
                border: `1px solid ${accentColor}55`,
                cursor: 'pointer',
                background: `${accentColor}18`,
                color: accentColor,
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                transition: 'all 0.18s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${accentColor}30`
                e.currentTarget.style.borderColor = `${accentColor}88`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `${accentColor}18`
                e.currentTarget.style.borderColor = `${accentColor}55`
              }}
            >
              {dictionary?.chatbot?.actions?.confirm || 'تأكيد'}
            </button>
              <button
                onClick={() => onCancel(msg.id)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid var(--mui-palette-divider)',
                  color: 'var(--mui-palette-text-secondary)',
                  fontSize: '11.5px',
                  transition: 'all 0.18s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--mui-palette-divider)'
                  e.currentTarget.style.color = 'var(--mui-palette-text-primary)'
                  e.currentTarget.style.background = 'var(--mui-palette-action-hover)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--mui-palette-divider)'
                  e.currentTarget.style.color = 'var(--mui-palette-text-secondary)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {dictionary?.chatbot?.actions?.cancel || 'إلغاء'}
              </button>
          </div>
        </div>
      )}

      {/* Status */}
      {msg.action && msg.status === 'executed' && (
        <div style={{ fontSize: '10px', color: 'var(--mui-palette-success-main)', marginTop: '4px', marginLeft: isUser ? '0' : '15px', marginRight: isUser ? '15px' : '0', direction: 'rtl', letterSpacing: '0.03em' }}>
          {dictionary?.chatbot?.actions?.executed || '✓ تم التنفيذ'}
        </div>
      )}
      {msg.action && msg.status === 'cancelled' && (
        <div style={{ fontSize: '10px', color: 'var(--mui-palette-text-secondary)', marginTop: '4px', marginLeft: isUser ? '0' : '15px', marginRight: isUser ? '15px' : '0', direction: 'rtl' }}>
          {dictionary?.chatbot?.actions?.cancelled || '— إلغاء'}
        </div>
      )}

      {/* Time */}
      <div
        style={{
          fontSize: '10px',
          color: 'var(--mui-palette-text-disabled)',
          marginTop: '4px',
          marginRight: isUser ? '15px' : '0',
          marginLeft: isUser ? '0' : '15px',
          direction: 'rtl'
        }}
      >
        {msg.timestamp.toLocaleTimeString(lang === 'en' ? 'en-US' : 'ar-EG', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

// ─── Typing Dots ───────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8aa' }} />
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 16px 16px 16px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#38bdf8',
            opacity: 0.6,
            animation: `blink 1.1s ease-in-out ${i * 0.18}s infinite`
          }}
        />
      ))}
    </div>
  </div>
)

// ─── Main Widget ───────────────────────────────────────────────────────────
export const AIChatbotWidget = () => {
  const {
    isOpen, isMinimized, messages, isLoading,
    openChat, closeChat, toggleMinimize,
    sendMessage, executeAction, cancelAction, clearMessages,
    dictionary, lang
  } = useAIChatbot()

  const QUICK_SUGGESTIONS = [
    { label: dictionary?.chatbot?.quick_suggestions?.dashboard || '📊 لوحة التحكم', text: dictionary?.chatbot?.suggestions_text?.dashboard || 'روح لوحة التحكم' },
    { label: dictionary?.chatbot?.quick_suggestions?.employees || '👥 الموظفين', text: dictionary?.chatbot?.suggestions_text?.employees || 'افتح شاشة الموظفين' },
    { label: dictionary?.chatbot?.quick_suggestions?.export || '📤 تصدير', text: dictionary?.chatbot?.suggestions_text?.export || 'صدّر البيانات الحالية لـ Excel' },
    { label: dictionary?.chatbot?.quick_suggestions?.smart_search || '🔍 بحث ذكي', text: dictionary?.chatbot?.suggestions_text?.smart_search || 'ابحث عن السجلات الجديدة هذا الشهر' }
  ]

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [unread, setUnread] = useState(0)
  const [hoverFab, setHoverFab] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen && messages.length > 1) setUnread(p => p + 1)
  }, [messages.length])

  useEffect(() => {
    if (isOpen) setUnread(0)
  }, [isOpen])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600&display=swap');

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes blink {
          0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
          40% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes fabIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes winIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ripple {
          0%   { box-shadow: 0 0 0 0 rgba(56,189,248,0.25); }
          70%  { box-shadow: 0 0 0 14px rgba(56,189,248,0); }
          100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); }
        }

        .cb-root * { font-family: 'IBM Plex Sans Arabic', sans-serif; box-sizing: border-box; }

        .cb-scroll::-webkit-scrollbar { width: 3px; }
        .cb-scroll::-webkit-scrollbar-track { background: transparent; }
        .cb-scroll::-webkit-scrollbar-thumb { background: var(--mui-palette-primary-mainOpacity); border-radius: 99px; }

        .cb-textarea::placeholder { color: var(--mui-palette-text-disabled); }
        .cb-textarea:focus { outline: none; }

        .cb-suggestion {
          padding: 5px 11px;
          border-radius: 99px;
          font-size: 11.5px;
          cursor: pointer;
          background: var(--mui-palette-background-paper);
          border: 1px solid var(--mui-palette-divider);
          color: var(--mui-palette-text-secondary);
          transition: all 0.18s;
          white-space: nowrap;
          direction: rtl;
        }
        .cb-suggestion:hover {
          background: var(--mui-palette-primary-mainOpacity);
          border-color: var(--mui-palette-primary-main);
          color: var(--mui-palette-primary-main);
        }

        .cb-hdr-btn {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          background: transparent;
          color: var(--mui-palette-text-secondary);
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s;
        }
        .cb-hdr-btn:hover { background: var(--mui-palette-action-hover); color: var(--mui-palette-text-primary); }
      `}</style>

      {/* ── FAB ── */}
      {!isOpen && (
        <button
          onClick={openChat}
          onMouseEnter={() => setHoverFab(true)}
          onMouseLeave={() => setHoverFab(false)}
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '28px',
            zIndex: 9999,
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            border: '1px solid var(--mui-palette-divider)',
            background: 'var(--mui-palette-primary-main)',
            backdropFilter: 'blur(16px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fabIn 0.3s cubic-bezier(0.34,1.56,0.64,1), ripple 2.8s ease-out 1s infinite',
            transform: hoverFab ? 'scale(1.07) translateY(-2px)' : 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: hoverFab
              ? '0 12px 40px var(--mui-palette-primary-mainOpacity)'
              : '0 8px 24px rgba(0,0,0,0.4)',
          }}
          title={dictionary?.chatbot?.title || 'المساعد الذكي'}
        >
          {/* Geometric AI icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="4" fill="var(--mui-palette-common-white)" opacity="0.9"/>
            <circle cx="11" cy="3.5" r="1.5" fill="var(--mui-palette-common-white)" opacity="0.7"/>
            <circle cx="11" cy="18.5" r="1.5" fill="var(--mui-palette-common-white)" opacity="0.7"/>
            <circle cx="3.5" cy="11" r="1.5" fill="var(--mui-palette-common-white)" opacity="0.7"/>
            <circle cx="18.5" cy="11" r="1.5" fill="var(--mui-palette-common-white)" opacity="0.7"/>
            <line x1="11" y1="5" x2="11" y2="7" stroke="var(--mui-palette-common-white)" strokeWidth="1" opacity="0.4"/>
            <line x1="11" y1="15" x2="11" y2="17" stroke="var(--mui-palette-common-white)" strokeWidth="1" opacity="0.4"/>
            <line x1="5" y1="11" x2="7" y2="11" stroke="var(--mui-palette-common-white)" strokeWidth="1" opacity="0.4"/>
            <line x1="15" y1="11" x2="17" y2="11" stroke="var(--mui-palette-common-white)" strokeWidth="1" opacity="0.4"/>
          </svg>

          {unread > 0 && (
            <div style={{
              position: 'absolute', top: '-5px', right: '-5px',
              background: '#f87171', color: '#fff', borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, border: '2px solid #0f172a'
            }}>
              {unread > 9 ? '9+' : unread}
            </div>
          )}
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="cb-root"
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '28px',
            zIndex: 9999,
            width: '370px',
            height: isMinimized ? '58px' : '560px',
            borderRadius: '18px',
            background: 'var(--mui-palette-background-paper)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--mui-palette-divider)',
            boxShadow: 'var(--mui-customShadows-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'winIn 0.28s cubic-bezier(0.34,1.2,0.64,1)',
            transition: 'height 0.28s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          {/* ── Subtle top glow bar ── */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)',
            pointerEvents: 'none'
          }} />

          {/* ── Header ── */}
          <div style={{
            padding: '12px 14px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isMinimized ? 'none' : '1px solid var(--mui-palette-divider)'
          }}>
            {/* Left: identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Icon */}
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'var(--mui-palette-primary-mainOpacity)',
                border: '1px solid var(--mui-palette-primary-mainOpacity)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="4" fill="var(--mui-palette-primary-main)" opacity="0.9"/>
                  <circle cx="11" cy="3.5" r="1.5" fill="var(--mui-palette-secondary-main)" opacity="0.6"/>
                  <circle cx="11" cy="18.5" r="1.5" fill="var(--mui-palette-secondary-main)" opacity="0.6"/>
                  <circle cx="3.5" cy="11" r="1.5" fill="var(--mui-palette-secondary-main)" opacity="0.6"/>
                  <circle cx="18.5" cy="11" r="1.5" fill="var(--mui-palette-secondary-main)" opacity="0.6"/>
                  <line x1="11" y1="5" x2="11" y2="7" stroke="var(--mui-palette-primary-main)" strokeWidth="1.2" opacity="0.35"/>
                  <line x1="11" y1="15" x2="11" y2="17" stroke="var(--mui-palette-primary-main)" strokeWidth="1.2" opacity="0.35"/>
                  <line x1="5" y1="11" x2="7" y2="11" stroke="var(--mui-palette-primary-main)" strokeWidth="1.2" opacity="0.35"/>
                  <line x1="15" y1="11" x2="17" y2="11" stroke="var(--mui-palette-primary-main)" strokeWidth="1.2" opacity="0.35"/>
                </svg>
              </div>
              <div>
                <div style={{ color: 'var(--mui-palette-text-primary)', fontWeight: 600, fontSize: '13px', direction: 'rtl', letterSpacing: '-0.01em' }}>
                  {dictionary?.chatbot?.title || 'المساعد الذكي'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', direction: 'rtl' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--mui-palette-success-main)', boxShadow: '0 0 6px var(--mui-palette-success-mainOpacity)' }} />
                  <span style={{ color: 'var(--mui-palette-text-secondary)', fontSize: '10.5px' }}>{dictionary?.chatbot?.status_available || 'متاح '}</span>
                </div>
              </div>
            </div>

            {/* Right: controls */}
            <div style={{ display: 'flex', gap: '2px' }}>
              <button className="cb-hdr-btn" onClick={clearMessages} title={dictionary?.chatbot?.clear_history || 'مسح'}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                </svg>
              </button>
              <button className="cb-hdr-btn" onClick={toggleMinimize} title={isMinimized ? (dictionary?.chatbot?.expand || 'توسيع') : (dictionary?.chatbot?.minimize || 'تصغير')}>
                {isMinimized
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                }
              </button>
              <button className="cb-hdr-btn" onClick={closeChat} title={dictionary?.chatbot?.close || 'إغلاق'}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--mui-palette-error-mainOpacity)'; e.currentTarget.style.color = 'var(--mui-palette-error-main)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--mui-palette-text-secondary)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                className="cb-scroll"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px 14px 4px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {messages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} onExecute={executeAction} onCancel={cancelAction} dictionary={dictionary} lang={lang} />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div style={{ padding: '4px 14px 10px', display: 'flex', flexWrap: 'wrap', gap: '5px', direction: 'rtl' }}>
                  {QUICK_SUGGESTIONS.map(s => (
                    <button
                      key={s.text}
                      className="cb-suggestion"
                      onClick={() => sendMessage(s.text)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ padding: '10px 12px 12px', flexShrink: 0, borderTop: '1px solid var(--mui-palette-divider)' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-end',
                    background: 'var(--mui-palette-action-hover)',
                    border: '1px solid var(--mui-palette-divider)',
                    borderRadius: '12px',
                    padding: '9px 10px 9px 9px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)')}
                  onBlurCapture={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  <textarea
                    ref={inputRef}
                    className="cb-textarea"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={dictionary?.chatbot?.input_placeholder || 'اكتب أمرك...'}
                    disabled={isLoading}
                    rows={1}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      color: 'var(--mui-palette-text-primary)',
                      fontSize: '13px',
                      lineHeight: '1.55',
                      direction: 'rtl',
                      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                      maxHeight: '72px',
                      overflowY: 'auto',
                      letterSpacing: '0.01em'
                    }}
                    onInput={e => {
                      const el = e.currentTarget
                      el.style.height = 'auto'
                      el.style.height = Math.min(el.scrollHeight, 72) + 'px'
                    }}
                  />

                  {/* Send button */}
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '9px',
                      cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                      background: input.trim() && !isLoading
                        ? 'var(--mui-palette-primary-mainOpacity)'
                        : 'transparent',
                      border: input.trim() && !isLoading
                        ? '1px solid var(--mui-palette-primary-main)'
                        : '1px solid var(--mui-palette-divider)',
                      color: input.trim() && !isLoading ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-disabled)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.18s'
                    }}
                    onMouseEnter={e => {
                      if (input.trim() && !isLoading) {
                        e.currentTarget.style.background = 'rgba(56,189,248,0.22)'
                        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (input.trim() && !isLoading) {
                        e.currentTarget.style.background = 'rgba(56,189,248,0.15)'
                        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'
                      }
                    }}
                    title={dictionary?.chatbot?.send || 'إرسال'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '5px', color: 'var(--mui-palette-text-disabled)', fontSize: '10px', direction: 'rtl', letterSpacing: '0.02em' }}>
                  {dictionary?.chatbot?.footer_hint || 'Enter للإرسال · Shift+Enter سطر جديد'}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AIChatbotWidget
