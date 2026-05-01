'use client'
// React Imports
import type { ReactNode } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports
import { HorizontalNavProvider } from '@menu/contexts/horizontalNavContext'
import { usePageTabs } from '@/contexts/pageTabsContext'

// Component Imports
import LayoutContent from './components/horizontal/LayoutContent'
import PageTabBar from '@/components/layout/shared/PageTabBar'

// Util Imports
import { horizontalLayoutClasses } from './utils/layoutClasses'

// Styled Component Imports
import StyledContentWrapper from './styles/horizontal/StyledContentWrapper'

type HorizontalLayoutProps = ChildrenType & {
  header?: ReactNode
  footer?: ReactNode
}

const HorizontalLayout = (props: HorizontalLayoutProps) => {
  // Props
  const { header, footer, children } = props
  const { activeTabId, tabs } = usePageTabs()
  const activeTab = tabs.find(t => t.id === activeTabId)
  const isBlankTab = activeTabId?.startsWith('new-tab-') || (activeTab && !activeTab.url)

  return (
    <div className={classnames(horizontalLayoutClasses.root, 'flex flex-auto')}>
      <HorizontalNavProvider>
        <StyledContentWrapper className={classnames(horizontalLayoutClasses.contentWrapper, 'flex flex-col is-full')}>
          {header || null}
          <LayoutContent>
            <PageTabBar />
            <div className={classnames('flex-grow flex flex-col', { 'hidden': isBlankTab })}>
              {children}
            </div>

            {isBlankTab && (
              <div className="flex-grow flex items-center justify-center p-12 min-h-[400px]">
                <div className="text-center opacity-30 select-none">
                  <i className="ri-layout-grid-line text-[6rem] block mb-4 mx-auto" />
                  <h2 className="text-[1.5rem]">مساحة عمل جديدة</h2>
                  <p>حدد شاشة من القائمة للبدء</p>
                </div>
              </div>
            )}
          </LayoutContent>
          {footer || null}
        </StyledContentWrapper>
      </HorizontalNavProvider>
    </div>
  )
}

export default HorizontalLayout
