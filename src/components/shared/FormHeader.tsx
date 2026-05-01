'use client'

import {
  Button,
  Typography,
  Menu,
  MenuItem,
  useFormContext,
  useState,
  getCurrentMoodOperation,
  useEffect,
  useContext
} from '@/shared'

import type { Locale, MenuOption, Mode } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import CustomIconButton, { CustomIconBtn } from './CustomIconButton'
import CustomTooltipButton from './CustomTooltipButton'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import { LoadingContext } from '@/contexts/loadingContext'
import LoadingSpinner from './LoadingSpinner'
interface HeaderProps {
  title: string
  onCancel?: () => void
  onSaveSuccess?: (data: any) => void
  menuOptions?: MenuOption[]
  mode: Mode
  onMenuOptionClick: (action: string) => void
  locale?: any
  showOnlyOptions?: Array<'add' | 'edit' | 'delete' | 'search' | 'print'>
  canAdd?: boolean
  canEdit?: boolean
  canSearch?: boolean
  canDelete?: boolean
  canPrint?: boolean
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onCancel,
  onSaveSuccess,
  menuOptions = [],
  mode,
  onMenuOptionClick,
  locale = '',
  showOnlyOptions = [],
  canAdd: propAdd,
  canEdit: propEdit,
  canSearch: propSearch,
  canDelete: propDelete,
  canPrint: propPrint
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { handleSubmit } = useFormContext()
  const [dictionary, setDictionary] = useState<any>(null)
  const permissions = useScreenPermissions(mode)

  const canAdd = propAdd !== undefined ? propAdd : permissions.canAdd
  const canEdit = propEdit !== undefined ? propEdit : permissions.canEdit
  const canSearch = propSearch !== undefined ? propSearch : permissions.canSearch
  const canDelete = propDelete !== undefined ? propDelete : permissions.canDelete
  const canPrint = propPrint !== undefined ? propPrint : permissions.canPrint
  const canShowRecordInfo = permissions.showRecordInfoButton

  const showAddButton =
    propAdd !== undefined ? propAdd && !['add', 'edit', 'search'].includes(mode) : permissions.showAddButton
  const showPrintButton = propPrint !== undefined ? propPrint && ['show'].includes(mode) : permissions.showPrintButton
  const showEditButton =
    propEdit !== undefined ? propEdit && ['show', 'list'].includes(mode) : permissions.showEditButton
  const showSearchButton =
    propSearch !== undefined ? propSearch && !['add', 'edit', 'search'].includes(mode) : permissions.showSearchButton
  const { screenData, canOpenArchive } = permissions
  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  const canShowAction = (action: string) => {
    // If prop not passed → allow all
    if (!showOnlyOptions || showOnlyOptions.length === 0) return true

    return showOnlyOptions.includes(action as any)
  }

  // Handle menu open
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  // Handle menu close
  const handleMenuClose = (option: MenuOption) => {
    setAnchorEl(null)
    if (option.action) onMenuOptionClick(option.action)
  }

  const visibleMenuOptions: MenuOption[] = (
    menuOptions.length
      ? menuOptions
      : [
        {
          text: dictionary?.actions?.['add'],
          action: 'add',
          visible: mode === 'add' || mode === 'edit' ? false : true
        },
        {
          text: dictionary?.actions?.['search'],
          action: 'search',
          visible: mode === 'add' || mode === 'edit' || mode === 'search' ? false : true
        },
        { text: dictionary?.actions?.['edit'], action: 'edit', visible: mode === 'show' ? true : false },
        { text: dictionary?.actions?.['delete'], action: 'delete', visible: mode === 'show' ? true : false },
        {
          text: dictionary?.actions?.['list'],
          action: 'list',
          visible: mode === 'show' || mode === 'search' ? true : false
        },
        {
          text: dictionary?.actions?.archive?.['documents'],
          action: 'documents',
          visible: mode === 'show' || mode === 'edit' ? true : false
        },
        {
          text: dictionary?.actions?.record?.['information'],
          action: 'record_info',
          visible: mode === 'show' || mode === 'edit' ? true : false
        },
        {
          text: dictionary?.actions?.record?.['tracking'],
          action: 'record_track',
          visible: mode === 'show' || mode === 'edit' ? true : false
        }
      ]
  ).filter(option => option.visible !== false)

  // Extra Actions
  const extraActions = [
    {
      text: dictionary?.actions?.archive?.['documents'],
      action: 'documents',
      visible: (mode === 'show' || mode === 'edit') && canOpenArchive,
      icon: 'ri-folder-2-line',
      color: 'rgb(0 200 83)'
    },
    {
      text: dictionary?.actions?.record?.['information'],
      action: 'record_info',
      visible: canShowRecordInfo,
      icon: 'ri-file-info-line',
      color: 'rgb(33 150 243)'
    },
    {
      text: dictionary?.actions?.record?.['tracking'],
      action: 'record_track',
      visible: false, //mode === 'show' || mode === 'edit',
      icon: 'ri-timeline-view',
      color: 'rgb(156 39 176)'
    }
  ]

  // Determine save button label based on mode
  const toggleArrowIcon = (
    <svg width='23' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g id='remix-icons/line/system/2arrow-left-s-line'>
        <path
          id='Vector'
          d='M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z'
          fill='var(--mui-palette-text-primary)'
        />
        <path
          id='Vector_2'
          d='M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z'
          fill='var(--mui-palette-text-disabled)'
        />
      </g>
    </svg>
  )
  const { loading } = useContext(LoadingContext)
  if (loading.includes('details')) return <LoadingSpinner type='skeleton' skeletonHeight={450} />
  return (
    <div className='flex flex-wrap sm:items-center justify-between my-3 max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h5' color={'primary-main'}>
          {screenData?.object_name_ar} {toggleArrowIcon} {dictionary?.actions?.[getCurrentMoodOperation(mode)]}
        </Typography>
      </div>

      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        {/* <Button variant='outlined' color='error' onClick={onCancel}>
          {dictionary?.actions?.['backToList']}
        </Button> */}

        <div className='flex items-center gap-2'>
          {canAdd && showAddButton && canShowAction('add') && (
            <CustomTooltipButton title={dictionary?.actions?.['add']} arrow>
              <CustomIconBtn
                customColor='rgb(114 225 40)'
                variant='outlined'
                size='small'
                onClick={() => onMenuOptionClick('add')}
              >
                <i className='ri-add-line' />
              </CustomIconBtn>
            </CustomTooltipButton>
          )}

          {canEdit && showEditButton && canShowAction('edit') && (
            <CustomTooltipButton title={dictionary?.actions?.['edit']} arrow>
              <CustomIconBtn
                customColor='rgb(253 181 40)'
                variant='outlined'
                size='small'
                onClick={() => onMenuOptionClick('edit')}
              >
                <i className='ri-pencil-line' />
              </CustomIconBtn>
            </CustomTooltipButton>
          )}
          {canPrint && showPrintButton && canShowAction('print') && (
            <CustomTooltipButton title={dictionary?.actions?.['print']} arrow>
              <CustomIconBtn
                customColor='rgb(102 108 255)'
                variant='outlined'
                size='small'
                onClick={() => onMenuOptionClick('print')}
              >
                <i className='ri-printer-line' />
              </CustomIconBtn>
            </CustomTooltipButton>
          )}
          {canSearch && canShowAction('search') && (
            <>
              <CustomTooltipButton title={dictionary?.actions?.['list']} arrow>
                <CustomIconBtn
                  customColor='rgb(109 120 141)'
                  color='primary'
                  variant='outlined'
                  size='small'
                  onClick={() => onMenuOptionClick('list')}
                >
                  <i className='ri-list-unordered' />
                </CustomIconBtn>
              </CustomTooltipButton>

              <CustomTooltipButton title={dictionary?.actions?.['search']} arrow>
                <CustomIconBtn
                  customColor='rgb(38 198 249)'
                  color='primary'
                  variant='outlined'
                  size='small'
                  onClick={() => onMenuOptionClick('search')}
                >
                  <i className='ri-search-line' />
                </CustomIconBtn>
              </CustomTooltipButton>
            </>
          )}

          <CustomTooltipButton title={dictionary?.actions?.['reload'] || 'Reload'} arrow>
            <CustomIconBtn
              customColor='rgb(0 188 212)'
              variant='outlined'
              size='small'
              onClick={() => onMenuOptionClick('reset')}
            >
              <i className='ri-refresh-line' />
            </CustomIconBtn>
          </CustomTooltipButton>

          {extraActions
            .filter(action => action.visible)
            .map(action => (
              <CustomTooltipButton key={action.action} title={action.text} arrow>
                <CustomIconBtn
                  customColor={action.color}
                  variant='outlined'
                  size='small'
                  onClick={() => onMenuOptionClick(action.action)}
                >
                  <i className={action.icon} />
                </CustomIconBtn>
              </CustomTooltipButton>
            ))}
        </div>

        {/* Keep the button and menu rendered, but hide them conditionally */}
        {/* <Button
          color='secondary'
          variant='outlined'
          endIcon={<i className='ri-arrow-down-s-line' />}
          aria-controls='options-menu'
          aria-haspopup='true'
          onClick={handleMenuOpen}
          style={{ display: visibleMenuOptions.length > 0 ? 'inline-flex' : 'none' }}
        >
          {dictionary?.actions?.['options']}
        </Button> */}
        {/* <Menu
          keepMounted
          id='options-menu'
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
        >
          {visibleMenuOptions.map((option, index) => (
            <MenuItem key={index} disabled={option.disabled} onClick={() => handleMenuClose(option)}>
              {option.text}
            </MenuItem>
          ))}
        </Menu> */}
      </div>
    </div>
  )
}

export default Header
