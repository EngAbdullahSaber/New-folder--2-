'use client'

import React, { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePageTabs } from '@/contexts/pageTabsContext'
import { MODE_LABELS, MODE_COLORS } from '@/hooks/useRegisterPageTab'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// dnd-kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'


// ─── chrome-like tab ─────────────────────────────────────────────────────────

// Draggable Tab Item Component
const SortableTabChip = ({
  tab,
  isActive,
  onActivate,
  onClose
}: {
  tab: any
  isActive: boolean
  onActivate: () => void
  onClose: () => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : (isActive ? 30 : 10),
    cursor: 'pointer',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center h-12   px-1 transition-all duration-300 group`}
      onClick={onActivate}
      {...attributes}
      {...listeners}
    >
      <TabChipContent 
        tab={tab} 
        isActive={isActive} 
        onClose={onClose} 
        isDragging={isDragging} 
      />
    </div>
  )
}

// Just the visual content to be reused in DragOverlay
const TabChipContent = ({
  tab,
  isActive,
  onClose,
  isDragging = false
}: {
  tab: any
  isActive: boolean
  onClose?: () => void
  isDragging?: boolean
}) => {
  const isDark = typeof window !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false

  const activeColor = '#FF6B00' // Vibrant orange from image
  const inactiveColor = 'var(--mui-palette-text-secondary)'
  const primaryTextColor = 'var(--mui-palette-text-primary)'

  return (
    <>
      <div className="relative mx-2 flex items-center gap-2.5 z-20 select-none whitespace-nowrap h-full">
        <div className="flex items-center gap-2.5">
          {isActive && (
            <i className="ri-check-line text-green-600 dark:text-green-400 text-[1rem] font-bold animate-in fade-in zoom-in duration-300" />
          )}

          <div
            className="text-[0.85rem] font-medium transition-colors duration-300 flex items-center gap-2"
            style={{ 
              color: isActive ? activeColor : inactiveColor,
            }}
          >
            <span>{tab.title}</span>
            
            {/* {tab.mode && tab.mode !== 'list' && tab.title !== 'جديد' && (
              <div className="flex items-center gap-2.5">
                <span className="opacity-30 text-[0.7rem] font-bold select-none mt-[-1px]">»</span>
                <span 
                  className="text-[0.6rem] px-1.5 py-0.5 rounded bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.08)] border border-[rgba(0,0,0,0.1)] dark:border-[rgba(255,255,255,0.1)] font-bold uppercase tracking-wider"
                  style={{ 
                    color: isActive ? activeColor : 'inherit',
                    borderColor: isActive ? `${activeColor}40` : undefined,
                  }}
                >
                  {MODE_LABELS[tab.mode] ?? tab.mode}
                </span>
              </div>
            )} */}
          </div>
        </div>

        {/* Close Button - More subtle now */}
        {!tab.pinned && onClose && (
          <button
            onClick={e => {
              e.stopPropagation()
              onClose()
            }}
            className={`flex items-center justify-center w-5 h-5 rounded-full hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 ml-1 ${
              isActive ? 'opacity-40 hover:opacity-100' : 'opacity-0 group-hover:opacity-40 hover:opacity-100'
            }`}
          >
            <i className="ri-close-line text-[0.8rem]" />
          </button>
        )}
      </div>

      {/* Active Underline Indicator */}
      {isActive && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full transition-all duration-300"
          style={{ backgroundColor: activeColor }}
        />
      )}
    </>
  )
}

// ─── main bar ────────────────────────────────────────────────────────────────
export const PageTabBar = () => {
  const { tabs, activeTabId, setActiveTab, closeTab, openNewTab, setTabs } = usePageTabs()
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const { lang: locale } = useParams()
  const router = useRouter()

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Avoid accidental drags when clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setTabs((items: any[]) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
    setActiveDragId(null)
  }

  const handleActivate = (tab: any) => {
    setActiveTab(tab.id)
    if (tab.url) router.push(tab.url)
  }

  const handleClose = (tabId: string) => {
    closeTab(tabId)
    const remaining = tabs.filter(t => t.id !== tabId)
    if (activeTabId === tabId) {
      if (remaining.length > 0) {
        const idx = tabs.findIndex(t => t.id === tabId)
        const nextActive = remaining[Math.max(0, idx - 1)]
        if (nextActive.url) router.push(nextActive.url)
      } else {
        router.push(getLocalizedUrl('/apps/dashboard/home', locale as Locale))
      }
    }
  }

  const activeDragTab = activeDragId ? tabs.find(t => t.id === activeDragId) : null

  return (
    <div
      className="flex flex-wrap items-center gap-x-6 px-4"
      style={{
        background: 'var(--mui-palette-background-default)',
       }}
    >
      <div className="flex flex-wrap border-b border-divider my-3 items-end h-full flex-grow">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={tabs.map(t => t.id)} 
            strategy={horizontalListSortingStrategy}
          >
            {tabs.map((tab) => (
              <SortableTabChip
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onActivate={() => handleActivate(tab)}
                onClose={() => handleClose(tab.id)}
              />
            ))}
          </SortableContext>

          <DragOverlay 
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.4',
                  },
                },
              }),
            }}
          >
            {activeDragTab ? (
              <div
                className="relative flex items-center h-12   cursor-grabbing border-b-[2.5px] border-[#FF6B00]"
                style={{
                  zIndex: 2000,
                  background: 'var(--mui-palette-background-paper)',
                }}
              >
                <TabChipContent 
                   tab={activeDragTab} 
                   isActive={true} 
                   isDragging={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Plus Button - Now part of the wrap flow */}
        <button
          onClick={openNewTab}
          type="button"
          className="relative mx-2 cursor-pointer z-[100] flex items-center justify-center w-8 h-8 mb-2 mr-3 ml-6 rounded-full hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(255,255,255,0.1)] transition-all bg-[#f0f0f0] dark:bg-[rgba(255,255,255,0.08)] border border-divider "
          title="جديد"
        >
          <i className="ri-add-line text-[1.2rem] text-primary" />
        </button>
      </div>

 

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

export default PageTabBar
