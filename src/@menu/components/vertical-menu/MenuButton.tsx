// React Imports
import { cloneElement, createElement, forwardRef } from 'react'
import type { ForwardRefRenderFunction } from 'react'

// Third-party Imports
import classnames from 'classnames'
import { css } from '@emotion/react'

// Type Imports
import type { ChildrenType, MenuButtonProps } from '../../types'

// Component Imports
import { RouterLink } from '../RouterLink'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'
import { useUserData } from '@/hooks/useUserData'

type MenuButtonStylesProps = Partial<ChildrenType> & {
  level: number
  active?: boolean
  disabled?: boolean
  isCollapsed?: boolean
  isPopoutWhenCollapsed?: boolean
}

export const menuButtonStyles = (props: MenuButtonStylesProps) => {
  // Props
  const { level, disabled, children, isCollapsed, isPopoutWhenCollapsed } = props

  return css({
    display: 'flex',
    alignItems: 'center',
    minBlockSize: '30px',
    textDecoration: 'none',
    color: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
    paddingInlineEnd: '20px',
    paddingInlineStart: `${level === 0 ? 20 : (isPopoutWhenCollapsed && isCollapsed ? level : level + 1) * 20}px`,

    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: '#f3f3f3'
    },

    '&:focus-visible': {
      outline: 'none',
      backgroundColor: '#f3f3f3'
    },

    ...(disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      color: '#adadad'
    }),

    // All the active styles are applied to the button including menu items or submenu
    [`&.${menuClasses.active}`]: {
      ...(!children && { color: 'white' }),
      backgroundColor: children ? '#f3f3f3' : '#765feb'
    }
  })
}
const MenuButton: ForwardRefRenderFunction<HTMLAnchorElement, MenuButtonProps> = (props, ref) => {
  const {
    className,
    component,
    children,

    // ❌ filter out ALL non-DOM props here
    objectOrder,
    level,
    isCollapsed,
    isPopoutWhenCollapsed,
    active,
    disabled,

    // ✅ only valid DOM props remain here
    ...rest
  } = props as any

  const { userData } = useUserData()

  if (component) {
    if (typeof component === 'string') {
      return createElement(
        component,
        {
          className: classnames(className),
          ...rest,
          ref
        },
        children
      )
    } else {
      const { className: classNameProp, ...componentProps } = component.props as any

      return cloneElement(
        component,
        {
          className: classnames(className, classNameProp),
          ...componentProps,
          ...rest,
          ref
        },
        children
      )
    }
  }

  // If there is no component but href is defined → RouterLink
  if (rest.href) {
    return (
      <RouterLink ref={ref} className={className} href={rest.href} {...rest}>
        {children}
        {userData?.id === 53204 && (
          <span
            style={{
              backgroundColor: 'var(--mui-palette-action-hover)',
              color: 'var(--mui-palette-text-secondary)',
              borderRadius: '4px',
              paddingInline: '5px',
              marginInlineStart: 'auto',
              fontSize: '9px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--mui-palette-divider)',
              minWidth: '16px'
            }}
          >
            {objectOrder}
          </span>
        )}
      </RouterLink>
    )
  }

  // Default fallback → anchor
  return (
    <a ref={ref} className={className} {...rest}>
      {children}
    </a>
  )
}

export default forwardRef(MenuButton)
