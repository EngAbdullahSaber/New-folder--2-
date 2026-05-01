// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
import Cookies from 'js-cookie'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { GenerateVerticalMenu, transformBackendDataToMenuData } from '@/components/GenerateMenu'
import verticalMenuData from '@/data/navigation/verticalMenuData'
import { fetchRecords, fetchRecords_GET, Locale, useContext, useEffect, useSessionHandler, useState } from '@/shared'
import { VerticalMenuDataType } from '@/types/menuTypes'
import { useErrorApi } from '@/contexts/errorApiProvider'
import { useSuccessApi } from '@/contexts/successApiProvider'
import { useMenu } from '@/contexts/menuContext'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // const { session, accessToken } = useSessionHandler()

  // const [menuData, setMenuData] = useState<VerticalMenuDataType[]>([])
  // const { setError } = useErrorApi()
  // const { setSuccess } = useSuccessApi()
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // const [dictionary, setDictionary] = useState<any>(null)
  // const { lang: locale } = useParams()
  // useEffect(() => {
  //   getDictionary(locale as Locale).then((res: any) => {
  //     setDictionary(res)
  //   })
  // }, [locale])

  // useEffect(() => {
  //   const fetchSystemObjects = async () => {
  //     if (!accessToken) return

  //     /* cache menu logic */

  //     const cacheKey = 'systemObjectsCache'
  //     // const cachedData: any = localStorage.getItem(cacheKey)

  //     // if (cachedData) {
  //     //   console.log('Loaded from cache:', JSON.parse(cachedData))
  //     //   const transformedMenu = transformBackendDataToMenuData(JSON.parse(cachedData), dictionary, locale as Locale,)

  //     //   setMenuData(transformedMenu)
  //     //   return
  //     // }

  //     try {
  //       const { data }: any = await fetchRecords_GET(
  //         '/aut/menu',
  //         0,
  //         300,
  //         '',
  //         accessToken,
  //         session?.user?.locale,
  //         setError,
  //         setSuccess
  //       )
  //       console.log('Fetched data:', data)

  //       const transformedMenu = transformBackendDataToMenuData(data['system'], dictionary)

  //       // حفظ البيانات في التخزين المحلي
  //       localStorage.setItem(cacheKey, JSON.stringify(data['system']))
  //       setMenuData(transformedMenu)
  //     } catch (error) {
  //       console.error('Error fetching system objects:', error)
  //     }
  //   }

  //   fetchSystemObjects()
  // }, [session])

  // console.log('menuData', menuData)

  const { verticalMenuData } = useMenu()

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* <GenerateVerticalMenu menuData={verticalMenuData(dictionary)} /> */}
        {(() => {
           return <GenerateVerticalMenu menuData={verticalMenuData} />
        })()}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
