'use client'

import { Tabs, Tab, Box, Typography, styled, alpha, useTheme } from '@/shared'

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  minHeight: 0,
  padding: theme.spacing(3, 5),
  marginRight: theme.spacing(2),
  transition: 'all 0.2s ease-in-out',
  color: theme.palette.text.secondary,
  opacity: 0.7,

  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 1,
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
  },

  '&.Mui-selected': {
    color: theme.palette.primary.main,
     opacity: 1
  }
}))

interface FilterTabItem {
  value: string
  label: string
  count?: number | string
  icon?: string
  iconColor?: string
}

interface FilterTabsProps {
  tabs: FilterTabItem[]
  activeTab: string
  onChange: (value: string) => void
}

const FilterTabs = ({ tabs, activeTab, onChange }: FilterTabsProps) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ width: '100%', mb: 4, position: 'relative' }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onChange(newValue)}
        aria-label='filter tabs'
        variant='scrollable'
        scrollButtons='auto'
        sx={{
          minHeight: 0,
          '& .MuiTabs-indicator': {
            height: 3,
            backgroundColor: 'primary.main',
            borderRadius: '10px'
          },
          '& .MuiTabs-flexContainer': {
            borderBottom: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {tabs.map(tab => {
          const isSelected = activeTab === tab.value

          return (
            <StyledTab
              key={tab.value}
              value={tab.value}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'inherit'
                  }}
                >
                  {tab.icon && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: tab.iconColor ? alpha(tab.iconColor, 0.15) : 'transparent',
                        color: tab.iconColor || 'inherit'
                      }}
                    >
                      <i className={tab.icon} style={{ fontSize: '1.1rem' }} />
                    </Box>
                  )}
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 'inherit',
                      color: isSelected ? 'primary.main' : isDark ? 'text.primary' : 'text.secondary',
                      fontSize: '0.9rem'
                    }}
                  >
                    {tab.label}
                  </Typography>
                  {tab.count !== undefined && (
                    <Box
                      sx={{
                        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.15) : isDark ? alpha('#fff', 0.1) : alpha('#000', 0.05),
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        px: 1.2,
                        py: 0.2,
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                         minWidth: '24px',
                        textAlign: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {tab.count}
                    </Box>
                  )}
                </Box>
              }
            />
          )
        })}
      </Tabs>
    </Box>
  )
}

export default FilterTabs
