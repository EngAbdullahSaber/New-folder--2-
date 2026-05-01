'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import { useParams, useRouter, usePathname } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import { Title, Description } from '@radix-ui/react-dialog'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'
import { useMenu } from '@/contexts/menuContext'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { getDictionary } from '@/utils/getDictionary'

// Style Imports
import './styles.css'
import NoResult from './NoResult'

/* ----------------------------------
 * Helpers
 * ---------------------------------- */

type Item = {
  id: string
  name: string
  url: string
  icon?: string
}

type Section = {
  title: string
  items: Item[]
}

export const menuToSearchSections = (menu: any[]): Section[] => {
  const sections: Section[] = []

  menu.forEach((system, systemIndex) => {
    const items: Item[] = []

    system.children?.forEach((level1: any) => {
      level1.children?.forEach((item: any, itemIndex: number) => {
        if (!item.href) return

        items.push({
          id: `${systemIndex}-${itemIndex}`,
          name: item.label,
          url: item.href,
          icon: system.icon
        })
      })
    })

    if (items.length) {
      sections.push({
        title: system.label,
        items
      })
    }
  })

  return sections
}

type SearchItemProps = {
  children: ReactNode
  value: string
  url: string
  currentPath: string
  onSelect?: () => void
}

const SearchItem = ({ children, value, currentPath, url, onSelect = () => {} }: SearchItemProps) => {
  return (
    <CommandItem
      onSelect={onSelect}
      value={value}
      className={classnames({
        'active-searchItem': currentPath === url.replace('//', '/').replace('details', 'list')
      })}
    >
      {children}
    </CommandItem>
  )
}

const CommandFooter = ({ dictionary }: { dictionary: any }) => {
  return (
    <div cmdk-footer=''>
      <div className='flex items-center gap-1'>
        <kbd>
          <i className='ri-arrow-up-line text-base' />
        </kbd>
        <kbd>
          <i className='ri-arrow-down-line text-base' />
        </kbd>
        <span>{dictionary?.search?.['to_navigate'] || 'to navigate'}</span>
      </div>
      <div className='flex items-center gap-1'>
        <kbd>
          <i className='ri-corner-down-left-line text-base' />
        </kbd>
        <span>{dictionary?.search?.['to_open'] || 'to open'}</span>
      </div>
      <div className='flex items-center gap-1'>
        <kbd>esc</kbd>
        <span>{dictionary?.search?.['to_close'] || 'to close'}</span>
      </div>
    </div>
  )
}

/* ----------------------------------
 * Main Component
 * ---------------------------------- */

const NavSearch = () => {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const router = useRouter()
  const pathName = usePathname()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const { horizontalMenuData, verticalMenuData } = useMenu()
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Locale).then(setDictionary)
  }, [locale])

  // ✅ ALWAYS call hooks
  const sections = useMemo(
    () => menuToSearchSections(horizontalMenuData || verticalMenuData || []),
    [horizontalMenuData]
  )

  const filteredSections = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return sections

    return sections
      .map(section => {
        const sectionMatches = section.title.toLowerCase().includes(q)

        const filteredItems = sectionMatches
          ? section.items
          : section.items.filter(item => item.name.toLowerCase().includes(q))

        return filteredItems.length ? { ...section, items: filteredItems } : null
      })
      .filter(Boolean) as Section[]
  }, [sections, searchValue])

  const onSearchItemSelect = (item: Item) => {
    router.push(getLocalizedUrl(item.url, locale as Locale))
    setOpen(false)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  useEffect(() => {
    if (!open && searchValue !== '') {
      setSearchValue('')
    }
  }, [open])

  // 👇 CONDITIONAL RENDER (SAFE)
  if (!sections.length) {
    return null
  }

  return (
    <>
      {isBreakpointReached || settings.layout === 'horizontal' ? (
        <IconButton onClick={() => setOpen(true)}>
          <i className='ri-search-line' />
        </IconButton>
      ) : (
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => setOpen(true)}>
          <IconButton>
            <i className='ri-search-line' />
          </IconButton>
          <div className='text-textDisabled'>{dictionary?.search?.['search_for_screen'] || 'Search for screen'} ⌘K</div>
        </div>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className='flex items-center justify-between border-be pli-4 plb-3 gap-2'>
          <Title hidden />
          <Description hidden />
          <i className='ri-search-line' />
          <CommandInput value={searchValue} onValueChange={setSearchValue} />
          <span className='text-textDisabled'>[esc]</span>
          <i className='ri-close-line cursor-pointer' onClick={() => setOpen(false)} />
        </div>

        <CommandList
          className='
    p-2 mb-2
    [&>div]:grid
    [&>div]:grid-cols-2
    [&>div]:gap-4
  '
        >
          {filteredSections.length ? (
            filteredSections.map(section => (
              <CommandGroup
                key={section.title}
                heading={section.title}
                className='grid-cols-1 flex flex-col rounded-lg border border-divider'
              >
                {section.items.slice(0, 6).map((item, index) => (
                  <SearchItem
                    key={`${section?.title}-${item?.id}-${index}`}
                    value={`${item.name} ${section.title}`}
                    currentPath={pathName}
                    url={getLocalizedUrl(item.url, locale as Locale)}
                    onSelect={() => onSearchItemSelect(item)}
                  >
                    {item.icon && <i className={`${item.icon} text-xl`} />}
                    {item.name}
                  </SearchItem>
                ))}
              </CommandGroup>
            ))
          ) : (
            <CommandEmpty className='col-span-2'>
              <div className='p-4 text-center text-textDisabled'>
                <NoResult searchValue={searchValue} setOpen={setOpen} />
              </div>
            </CommandEmpty>
          )}
        </CommandList>

        <CommandFooter dictionary={dictionary} />
      </CommandDialog>
    </>
  )
}

export default NavSearch
