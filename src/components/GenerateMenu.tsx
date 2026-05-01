// React Imports
import { useEffect, useState, type ReactNode } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Chip from '@mui/material/Chip'
import type { ChipProps } from '@mui/material/Chip'

// Type Imports
import type { Locale } from '@configs/i18n'
import type {
  VerticalMenuDataType,
  VerticalSectionDataType,
  VerticalSubMenuDataType,
  VerticalMenuItemDataType,
  HorizontalMenuDataType,
  HorizontalSubMenuDataType,
  HorizontalMenuItemDataType
} from '@/types/menuTypes'

// Component Imports
import { SubMenu as HorizontalSubMenu, MenuItem as HorizontalMenuItem } from '@menu/horizontal-menu'
import { SubMenu as VerticalSubMenu, MenuItem as VerticalMenuItem, MenuSection } from '@menu/vertical-menu'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { getDictionary } from '@/utils/getDictionary'
import { useScreenPermissions } from '@/hooks/useScreenPermission'

export const transformBackendDataToMenuData = (
  systemData: any[],
  dictionary: any = '',
  locale: Locale = 'ar'
): VerticalMenuDataType[] => {
  return systemData.map(item => {
    const {
      id,
      object_name_ar,
      object_name_la,
      object_type,
      children,
      style,
      route_name,
      default_action,
      route_path,
      object_order
    } = item
    // Handle SYSTEM (type 1) - Create Menu Sections
    if (object_type === 1) {
      const subMenu: VerticalSubMenuDataType = {
        label: object_name_ar,
        objectOrder: object_order,
        children: children ? transformBackendDataToMenuData(children, dictionary, locale) : [],
        // Add default icon for sections
        ...(style ? { icon: style } : { icon: 'ri-apps-line' })
      }
      return subMenu
    }

    // Handle MENU (type 2) - Create SubMenus
    if (object_type === 2) {
      const subMenu: VerticalSubMenuDataType = {
        label: object_name_ar,
        objectOrder: object_order,
        children: children ? transformBackendDataToMenuData(children, dictionary, locale) : [],
        icon: (style || 'ri-add-circle-line') + ' text-[22px]'
      }
      return subMenu
    }

    // Handle SCREEN (type 3) - Create Menu Items
    if (object_type === 3) {
      const menuItem: VerticalMenuItemDataType = {
        label: dictionary?.navigation?.[object_name_ar] || object_name_ar,
        objectOrder: object_order,
        href: `/apps/${route_path}${getDefaultAction(default_action, route_path)}`
        // icon: 'ri-file-line', // Default file icon
        // exactMatch: false,
        //excludeLang: true, // Adjust based on your routing needs
        //prefix: undefined,
        // suffix: undefined
      }
      return menuItem
    }

    // Fallback for unknown types
    return {
      label: 'Unknown Item',
      href: '#',
      icon: 'ri-error-warning-line'
    } as VerticalMenuItemDataType
  })
}

export const transformBackendDataToHorizontalMenu = (
  systemData: any[],
  dictionary: any = '',
  locale: Locale = 'ar'
): HorizontalMenuDataType[] => {
  return systemData.map(item => {
    const {
      id,
      object_name_ar,
      object_name_la,
      object_type,
      children,
      style,
      route_name,
      default_action,
      route_path,
      object_order
    } = item
    ///// Handle SYSTEM (type 1) - Create Menu Sections
    if (object_type === 1) {
      const subMenu: HorizontalSubMenuDataType = {
        label: object_name_ar,
        objectOrder: object_order,
        children: children ? transformBackendDataToHorizontalMenu(children, dictionary, locale) : [],
        // Add default icon for sections
        ...(style ? { icon: style } : { icon: 'ri-apps-line' })
      }
      return subMenu
    }

    ///// Handle MENU (type 2) - Create SubMenus
    if (object_type === 2) {
      const subMenu: HorizontalSubMenuDataType = {
        label: object_name_ar,
        objectOrder: object_order,

        children: children ? transformBackendDataToHorizontalMenu(children, dictionary, locale) : [],
        icon: (style || 'ri-add-circle-line') + ' text-[22px]'
      }
      return subMenu
    }
   
    //// Handle SCREEN (type 3) - Create Menu Items
    if (object_type === 3) {
      const menuItem: HorizontalMenuItemDataType = {
        label: dictionary?.navigation?.[object_name_ar] || object_name_ar,
        objectOrder: object_order,

        href: `/apps/${route_path}${getDefaultAction(default_action, route_path)}`
        // icon: 'ri-file-line', // Default file icon
        // exactMatch: false,
        //excludeLang: true, // Adjust based on your routing needs
        //prefix: undefined,
        // suffix: undefined
      }
      return menuItem
    }

    ///// Fallback for unknown types
    return {
      label: 'Unknown Item',
      href: '#',
      icon: 'ri-error-warning-line'
    } as HorizontalMenuItemDataType
  })
}

const getDefaultAction = (defaultAction: any, routePath: string = '') => {
  // ✅ تنظيف المسار
  const cleanPath = routePath.trim()

  // ✅ إذا كان المسا
  // ر لا ينتهي بـ / -> شاشة مباشرة (مثل: /dashboard أو /settings)
  if (!cleanPath.endsWith('/')) {
    return '' // لا نضيف شيء
  }

  // ✅ إذا كان المسار ينتهي بـ / -> يحتاج details أو list
  if (Number(defaultAction) === 1) {
    return 'details?mode=add'
  } else if (Number(defaultAction) === 2) {
    return 'list'
  } else if (Number(defaultAction) === 3) {
    return 'details?mode=search'
  } else {
    return 'list'
  }
}
// Generate a menu from the menu data array
export const GenerateVerticalMenu = ({ menuData }: { menuData: VerticalMenuDataType[] }) => {
  // Hooks
  const { lang: locale } = useParams()

  const renderMenuItems = (data: VerticalMenuDataType[]) => {
    // Use the map method to iterate through the array of menu data
    return data.map((item: VerticalMenuDataType, index) => {
      const menuSectionItem = item as VerticalSectionDataType
      const subMenuItem = item as VerticalSubMenuDataType
      const menuItem = item as VerticalMenuItemDataType

      // Check if the current item is a section
      if (menuSectionItem.isSection) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, isSection, ...rest } = menuSectionItem

        // If it is, return a MenuSection component and call generateMenu with the current menuSectionItem's children
        return (
          <MenuSection key={index} {...rest}>
            {children && renderMenuItems(children)}
          </MenuSection>
        )
      }

      // Check if the current item is a sub menu
      if (subMenuItem.children) {
        const { children, icon, prefix, suffix, ...rest } = subMenuItem

        const Icon = icon ? <i className={icon} /> : null

        const subMenuPrefix: ReactNode =
          prefix && (prefix as ChipProps).label ? (
            <Chip size='small' {...(prefix as ChipProps)} />
          ) : (
            (prefix as ReactNode)
          )

        const subMenuSuffix: ReactNode =
          suffix && (suffix as ChipProps).label ? (
            <Chip size='small' variant='tonal' {...(suffix as ChipProps)} />
          ) : (
            (suffix as ReactNode)
          )

        ///// If it is, return a SubMenu component and call generateMenu with the current subMenuItem's children
        return (
          <VerticalSubMenu
            key={index}
            prefix={subMenuPrefix}
            suffix={subMenuSuffix}
            {...rest}
            {...(Icon && { icon: Icon })}
          >
            {children && renderMenuItems(children)}
          </VerticalSubMenu>
        )
      }

      // If the current item is neither a section nor a sub menu, return a MenuItem component
      const { label, excludeLang, icon, prefix, suffix, ...rest } = menuItem

      // Localize the href
      const href = rest.href?.startsWith('http')
        ? rest.href
        : rest.href && (excludeLang ? rest.href : getLocalizedUrl(rest.href, locale as Locale))

      const Icon = icon ? <i className={icon} /> : null

      const menuItemPrefix: ReactNode =
        prefix && (prefix as ChipProps).label ? <Chip size='small' {...(prefix as ChipProps)} /> : (prefix as ReactNode)

      const menuItemSuffix: ReactNode =
        suffix && (suffix as ChipProps).label ? (
          <Chip size='small' variant='tonal' {...(suffix as ChipProps)} />
        ) : (
          (suffix as ReactNode)
        )

      return (
        <VerticalMenuItem
          key={index}
          prefix={menuItemPrefix}
          suffix={menuItemSuffix}
          {...rest}
          href={href}
          {...(Icon && { icon: Icon })}
        >
          {label}
        </VerticalMenuItem>
      )
    })
  }

  return <>{renderMenuItems(menuData)}</>
}

// Generate a menu from the menu data array
export const GenerateHorizontalMenu = ({ menuData }: { menuData: HorizontalMenuDataType[] }) => {
  // Hooks
  const { lang: locale } = useParams()

  const renderMenuItems = (data: HorizontalMenuDataType[]) => {
    // Use the map method to iterate through the array of menu data
    return data.map((item: HorizontalMenuDataType, index) => {
      const subMenuItem = item as HorizontalSubMenuDataType
      const menuItem = item as HorizontalMenuItemDataType

      // Check if the current item is a sub menu
      if (subMenuItem.children) {
        const { children, icon, prefix, suffix, ...rest } = subMenuItem

        const Icon = icon ? <i className={icon} /> : null

        const subMenuPrefix: ReactNode =
          prefix && (prefix as ChipProps).label ? (
            <Chip size='small' {...(prefix as ChipProps)} />
          ) : (
            (prefix as ReactNode)
          )

        const subMenuSuffix: ReactNode =
          suffix && (suffix as ChipProps).label ? (
            <Chip size='small' variant='tonal' {...(suffix as ChipProps)} />
          ) : (
            (suffix as ReactNode)
          )

        // If it is, return a SubMenu component and call generateMenu with the current subMenuItem's children
        return (
          <HorizontalSubMenu
            key={index}
            prefix={subMenuPrefix}
            suffix={subMenuSuffix}
            {...rest}
            {...(Icon && { icon: Icon })}
          >
            {children && renderMenuItems(children)}
          </HorizontalSubMenu>
        )
      }

      // If the current item is not a sub menu, return a MenuItem component
      const { label, excludeLang, icon, prefix, suffix, ...rest } = menuItem

      // Localize the href
      const href = rest.href?.startsWith('http')
        ? rest.href
        : rest.href && (excludeLang ? rest.href : getLocalizedUrl(rest.href, locale as Locale))

      const Icon = icon ? <i className={icon} /> : null

      const menuItemPrefix: ReactNode =
        prefix && (prefix as ChipProps).label ? <Chip size='small' {...(prefix as ChipProps)} /> : (prefix as ReactNode)

      const menuItemSuffix: ReactNode =
        suffix && (suffix as ChipProps).label ? (
          <Chip size='small' variant='tonal' {...(suffix as ChipProps)} />
        ) : (
          (suffix as ReactNode)
        )

      return (
        <HorizontalMenuItem
          key={index}
          prefix={menuItemPrefix}
          suffix={menuItemSuffix}
          {...rest}
          href={href}
          {...(Icon && { icon: Icon })}
        >
          {label}
        </HorizontalMenuItem>
      )
    })
  }

  return <>{renderMenuItems(menuData)}</>
}
