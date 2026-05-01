// app/api/ai-chatbot/route.ts
// ─── Next.js API Route — Claude Proxy ─────────────────────────────────────
// This keeps your API key safe on the server side.

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, history = [], systemPrompt } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Build messages array with history
    const messages = [...history, { role: 'user', content: message }]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: systemPrompt,
        messages
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Claude API error:', err)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || ''

    // Parse and validate JSON response from Claude
    let parsed
    try {
      // Strip any accidental markdown code fences
      const cleaned = rawText.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      // Fallback: treat raw text as plain message
      parsed = {
        message: rawText || 'تم معالجة طلبك.',
        action: null
      }
    }

    return NextResponse.json({ content: parsed })
  } catch (error) {
    console.error('Chatbot route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
