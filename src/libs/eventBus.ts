'use client'

export const eventBus = new EventTarget()

export const emitEvent = (name: string, detail?: unknown) => {
  eventBus.dispatchEvent(new CustomEvent(name, { detail }))
}

export const onEvent = (name: string, handler: (event: CustomEvent) => void) => {
  eventBus.addEventListener(name, handler as EventListener)
  return () => eventBus.removeEventListener(name, handler as EventListener)
}
