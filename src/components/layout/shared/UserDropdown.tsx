'use client'

// React Imports
import { useRef, useState, useEffect, useMemo } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

// Third-party Imports
import { signOut } from 'next-auth/react'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { useSessionHandler, GenericSettingsDialog, type ListSettingField } from '@/shared'
import { useUserDataOperations } from '@/hooks/useUserDataOperations'
import { getDictionary } from '@/utils/getDictionary'
import { useDispatch } from 'react-redux'
import { clearMenu } from '@/redux-store/slices/menuSlice'
import { persistor } from '@/redux-store'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

// Styled component for value display
const ValueDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '0.725rem',
  color: 'var(--mui-palette-text-secondary)',
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  backgroundColor: 'var(--mui-palette-action-hover)',
  padding: '3px 10px',
  borderRadius: 'var(--mui-shape-customBorderRadius-sm)',
  marginTop: '4px',
  border: '1px solid var(--mui-palette-divider)',
  width: 'fit-content',
  maxWidth: '100%'
}))

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [activeConfig, setActiveConfig] = useState<{ title: string; field: ListSettingField } | null>(null)
  const [dictionary, setDictionary] = useState<any>(null)
  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)
  // Hooks
  const router = useRouter()
  const { user, userDepartments, userCities, personal, accessToken, update, status, isAuthenticated } = useSessionHandler()
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const { clearUserData, refreshUserData } = useUserDataOperations()
  const dispatch = useDispatch()

  // ✅ Computed values using useMemo instead of state to ensure immediate updates
  const currentValues = useMemo(() => {
    if (!user) {
      return {
        department: '',
        season: '',
        year: '',
        city: '',
        personalName: ''
      }
    }

    // 1. Handle City Display
    let cityDisplay = ''
    if (user?.context?.city_id) {
      const foundCity = userCities?.find((c: any) => String(c.id) === String(user.context.city_id))
      if (foundCity) {
        cityDisplay = locale === 'ar' ? foundCity.name_ar : foundCity.name_la
      }
    }

    // 2. Handle Department Display
    let departmentDisplay = ''
    if (user?.context?.department_id) {
      const foundDept = userDepartments?.find((d: any) => String(d.id) === String(user.context.department_id))
      if (foundDept) {
        departmentDisplay = locale === 'ar' ? foundDept.department_name_ar : foundDept.department_name_la
      }
    }

    // 3. Handle Special Substitute Display
    let personalDisplay = user?.personal?.full_name_ar || user?.full_name_ar || ''
    if (user?.personal_id && user?.personal_id !== user?.id) {
      personalDisplay = user?.full_name_ar || ''
    }

    return {
      department: departmentDisplay,
      season: user?.context?.season || '',
      year: user?.context?.year || '',
      city: cityDisplay,
      personalName: personalDisplay
    }
  }, [user, locale, userCities, userDepartments])

  // Fetch dictionary
  useEffect(() => {
    const fetchDict = async () => {
      const dict = await getDictionary(locale as Locale)
      setDictionary(dict)
    }
    fetchDict()
  }, [locale])

  useEffect(() => {
    // Check if we have a session but are missing the metadata arrays (cities/depts)
    const needsRefresh = isAuthenticated && user &&
      (!userCities || userCities.length === 0 ||
        !userDepartments || userDepartments.length === 0);

    if (needsRefresh) {
      console.log('🔄 UserDropdown: User metadata missing or empty, triggering refreshUserData...')
      refreshUserData().then(() => {
        // Force Next.js to refresh the route and sync client/server data
        router.refresh()
      })
    }
  }, [user, refreshUserData, isAuthenticated, userCities, userDepartments, router])

  const handleDropdownOpen = () => {
    setOpen(!open)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      // ✅ Stop auto-saving state to storage
      await persistor.pause()

      // ✅ Explicitly clear Redux status
      dispatch(clearMenu())
      clearUserData()

      // ✅ Purge Redux Persist storage (removes persist:root key)
      await persistor.purge()

      // ✅ Slight delay to ensure pending writes are finished before final clear
      await new Promise(resolve => setTimeout(resolve, 50))

      // ✅ Force removal of the persistence key and clear all storage
      localStorage.removeItem('persist:root')
      localStorage.clear()
      sessionStorage.clear()

      // ✅ Redirect to login page
      await signOut({ callbackUrl: `${window.location.origin}/${locale}/login`, redirect: true })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Helper function to render menu item with value
  const renderMenuItemWithValue = (icon: string, label: string, value: string, emptyMessage?: string) => (
    <MenuItem
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 3,
        borderRadius: '10px',
        border: '1px solid var(--mui-palette-divider)',
        cursor: 'auto',
        transition: 'all 0.2s ease',
        '&:hover': {
          border: '1px solid var(--mui-palette-primary-main)',
          transform: 'translateY(-2px)',
          backgroundColor: 'transparent'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            bgcolor: 'var(--mui-palette-primary-lightOpacity)',
            p: 1.5,
            color: 'var(--mui-palette-primary-main)'
          }}
        >
          <i className={icon} style={{ fontSize: '1.25rem' }} />
        </Box>
        <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        {value ? (
          <ValueDisplay variant='caption'>{value}</ValueDisplay>
        ) : (
          <ValueDisplay variant='caption' sx={{ fontStyle: 'italic', opacity: 0.7 }}>
            {emptyMessage || dictionary?.common?.notSet || 'غير محدد'}
          </ValueDisplay>
        )}
      </Box>
    </MenuItem>
  )

  if (!dictionary) return null



  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          alt={user?.full_name_ar || ''}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
          title={user?.full_name_ar || ''}
          src={
            personal?.files?.length
              ? personal.files.find((res: any) => res.description === 'personal_picture')?.path || ''
              : ''
          }
        >
          {user?.full_name_ar?.charAt(0) || ''}
        </Avatar>
      </Badge>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[300px] max-is-[calc(100vw-32px)] sm:min-is-[450px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper
              elevation={settings.skin === 'bordered' ? 0 : 8}
              {...(settings.skin === 'bordered' && { className: 'border' })}
            >
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList
                  sx={{
                    p: 1,
                    maxHeight: 'calc(100vh - 100px)',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {/* User Info Header */}
                  <Box className='flex items-center plb-2 pli-2 gap-3' tabIndex={-1}>
                    <Avatar
                      alt={user?.full_name_ar || ''}
                      title={user?.full_name_ar || ''}
                      sx={{ width: 44, height: 44 }}
                      src={
                        personal?.files?.length
                          ? personal.files.find((res: any) => res.description === 'personal_picture')?.path || ''
                          : ''
                      }
                    >
                      {user?.full_name_ar?.charAt(0) || ''}
                    </Avatar>
                    <Box className='flex items-start flex-col' sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant='body2' className='font-medium' color='text.primary' noWrap>
                        {user?.full_name_ar || ''}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' noWrap>
                        {user?.email || ''}
                      </Typography>
                      {user?.position && (
                        <Chip label={user.position} size='small' variant='outlined' sx={{ mt: 0.5, height: 20 }} />
                      )}
                    </Box>
                  </Box>

                  <Divider className='mlb-2' />

                  {/* Profile Link */}
                  <MenuItem
                    className='gap-3 pli-2'
                    onClick={e =>
                      handleDropdownClose(e, `/apps/def/user-profile/details?id=${user?.personal_id}&mode=show`)
                    }
                  >
                    <i className='ri-user-3-line' style={{ fontSize: '1.25rem' }} />
                    <Typography color='text.primary'>
                      {dictionary?.navigation?.userProfile || 'الملف الشخصي'}
                    </Typography>
                  </MenuItem>
                  {/* App Settings */}
                  {/* 
                  <MenuItem className='gap-3 pli-2' onClick={e => handleDropdownClose(e, '/apps/gui/setting')}>
                    <i className='ri-settings-4-line' style={{ fontSize: '1.25rem' }} />
                    <Typography color='text.primary'>{dictionary?.navigation?.settings || 'إعدادات النظام'}</Typography>
                  </MenuItem> */}
                  {/* User Settings */}

                  <MenuItem className='gap-3 pli-2' onClick={e => handleDropdownClose(e, '/apps/gui/setting/user')}>
                    <i className='ri-settings-4-line' style={{ fontSize: '1.25rem' }} />
                    <Typography color='text.primary'>
                      {dictionary?.navigation?.userSettings || 'إعدادات المستخدم'}
                    </Typography>
                  </MenuItem>
                  {/* Change Password */}
                  <MenuItem className='gap-3 pli-2' onClick={e => handleDropdownClose(e, '/change-password')}>
                    <i className='ri-key-line' style={{ fontSize: '1.25rem' }} />
                    <Typography color='text.primary'>
                      {dictionary?.navigation?.resetPassword || 'تغيير كلمة المرور'}
                    </Typography>
                  </MenuItem>
                  <Divider className='mlb-2' />

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                      gap: 3,
                      p: 3
                    }}
                  >
                    {renderMenuItemWithValue(
                      'ri-map-pin-line',
                      dictionary?.actions?.change_city || 'تغيير المدينة',
                      currentValues.city,
                      dictionary?.common?.noCity || 'لم يتم تحديد مدينة'
                    )}

                    {renderMenuItemWithValue(
                      'ri-building-line',
                      dictionary?.actions?.change_active_department || 'تغيير الإدارة النشطة',
                      currentValues.department,
                      dictionary?.common?.noDepartment || 'لا يوجد إدارة'
                    )}

                    {renderMenuItemWithValue(
                      'ri-history-line',
                      dictionary?.actions?.historical_data || 'البيانات التاريخية',
                      currentValues.season,
                      dictionary?.common?.noSeason || 'لا يوجد موسم'
                    )}

                    {renderMenuItemWithValue(
                      'ri-calendar-event-line',
                      dictionary?.actions?.financial_years || 'تغيير السنوات المالية',
                      currentValues.year,
                      dictionary?.common?.noYear || 'لا يوجد سنة'
                    )}

                    <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                      {renderMenuItemWithValue(
                        'ri-user-shared-line',
                        dictionary?.actions?.substitute_employee || 'الدخول كموظف بديل',
                        currentValues.personalName,
                        dictionary?.common?.noSubstitute || 'لا يوجد بديل'
                      )}
                    </Box>
                  </Box>

                  <Divider className='mlb-2' />

                  {/* Logout Button */}
                  <Box className='flex items-center plb-1 pli-2'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={handleUserLogout}
                    >
                      {dictionary?.actions?.logout || 'تسجيل الخروج'}
                    </Button>
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/* Settings Dialog */}
      {activeConfig && (
        <GenericSettingsDialog
          open={settingsDialogOpen}
          onClose={() => setSettingsDialogOpen(false)}
          title={activeConfig.title}
          field={activeConfig.field}
          dictionary={dictionary}
          lang={locale as string}
        />
      )}
    </>
  )
}

export default UserDropdown
