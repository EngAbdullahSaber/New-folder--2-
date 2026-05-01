// // components/vertical/VerticalLayout.tsx
// 'use client'
// import React, { useEffect } from 'react'
// import { useTabs } from '@/contexts/tabsContext'

// type VerticalLayoutProps = {
//   children: React.ReactNode
//   navigation?: React.ReactNode
//   navbar?: React.ReactNode
//   footer?: React.ReactNode
// }

// const VerticalLayout = ({ navigation, navbar, footer, children }: VerticalLayoutProps) => {
//   const { tabs, activeTab, setActiveTab, deleteTab, addTab, updateTabContent } = useTabs()

//   // Function to handle tab content change (simulating menu clicks)
//   const handleMenuClick = (menu: string) => {
//     const newContent = <div>{menu} Content</div>  // Dynamically render content for menu

//     if (activeTab) {
//       // If there's an active tab, update its content
//       updateTabContent(activeTab, newContent)
//     } else {
//       // If no active tab, create a new one with the menu content
//       addTab(menu, newContent)
//     }
//   }

//   return (
//     <div className="flex flex-auto rtl">
//       {/* Navigation */}
//       {navigation || null}

//       {/* Content Wrapper */}
//       <div className="flex flex-col min-is-0 is-full">
//         {/* Navbar */}
//         {navbar || null}

//         {/* Tab Headers */}
//         <div className="tabs-header flex justify-between items-center p-3 bg-gray-100">
//           <ul className="nav nav-tabs flex flex-row-reverse" role="tablist">
//             {tabs.map((tab) => (
//               <li key={tab.id} className="nav-item" role="presentation">
//                 <button
//                   className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
//                   onClick={() => setActiveTab(tab.id)}
//                 >
//                   {tab.title}
//                 </button>
//                 <span
//                   className="text-danger cursor-pointer ml-2"
//                   onClick={() => deleteTab(tab.id)}
//                 >
//                   &times;
//                 </span>
//               </li>
//             ))}
//             <li className="nav-item">
//               <button
//                 className="nav-link"
//                 onClick={() => addTab('New Tab', <div>New Tab Content</div>)}
//               >
//                 + New
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Active Tab Content */}
//         <div className="tab-content flex-grow p-4">
//           {tabs.find((tab) => tab.id === activeTab)?.content}
//         </div>

//         {/* Footer */}
//         {footer || null}
//       </div>
//     </div>
//   )
// }

// export default VerticalLayout

// React Imports

'use client'
import { useEffect, useState, type ReactNode } from 'react'
import classnames from 'classnames'
import type { ChildrenType } from '@core/types'
import LayoutContent from './components/vertical/LayoutContent'
import { verticalLayoutClasses } from './utils/layoutClasses'
import StyledContentWrapper from './styles/vertical/StyledContentWrapper'
import { HeaderPrint } from '@/shared'

import { usePageTabs } from '@/contexts/pageTabsContext'
import PageTabBar from '@/components/layout/shared/PageTabBar'

type VerticalLayoutProps = ChildrenType & {
  navigation?: ReactNode
  navbar?: ReactNode
  footer?: ReactNode
}

const VerticalLayout = (props: VerticalLayoutProps) => {
  const { navbar, footer, navigation, children } = props
  const { activeTabId, tabs } = usePageTabs()
  const activeTab = tabs.find(t => t.id === activeTabId)
  const isBlankTab = activeTabId?.startsWith('new-tab-') || (activeTab && !activeTab.url)

  return (
    <div className={classnames(verticalLayoutClasses.root, 'flex flex-auto')}>
      {navigation || null}
      <StyledContentWrapper
        className={classnames(verticalLayoutClasses.contentWrapper, 'flex flex-col min-is-0 is-full')}
      >
        {navbar || null}
        {/* Render children */}
        <LayoutContent>
           <PageTabBar />
           {/* Rendering children even when isBlankTab is true, but hidden, 
               so that useRegisterPageTab() can run and "fill" the blank tab 
               when the user navigates from the sidebar. */}
           <div className={classnames('flex-grow flex flex-col', { 'hidden': isBlankTab })}>
             {children}
           </div>

           {isBlankTab && (
             <div className="flex-grow flex items-center justify-center p-12 min-h-[400px]">
               <div className="text-center opacity-30 select-none">
                 <i className="ri-layout-grid-line mx-auto text-[6rem] block mb-4" />
                 <h2 className="text-[1.5rem]">مساحة عمل جديدة</h2>
                 <p>حدد شاشة من القائمة الجانبية للبدء</p>
               </div>
             </div>
           )}
        </LayoutContent> {/* Render the updated children array */}
        {footer || null}
      </StyledContentWrapper>
    </div>
  )
}

export default VerticalLayout
