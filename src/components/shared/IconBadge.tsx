import { Box, Typography, useTheme } from '@mui/material'

interface IconBadgeOption {
  value: string | number | null
  label?: string
  icon?: string | React.ReactNode
  color?: 'success' | 'error' | 'warning' | 'info' | 'default'
}

const IconBadge = ({
  value,
  options = [],
  dictionary
}: {
  value: any
  options: IconBadgeOption[]
  dictionary?: any
}) => {
  const theme: any = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const matched =
    value != null && value !== ''
      ? options.find(opt => String(opt.value) === String(value))
      : options.find(opt => String(opt.color) === 'error')

  if (!matched) {
    return (
      <Typography
        variant='body2'
        sx={{
          color: isDark ? '#475569' : '#94a3b8',
          fontSize: 12
        }}
      >
        —
      </Typography>
    )
  }

  const colorMap: Record<string, any> = {
    success: {
      bgLight: 'rgba(34,197,94,0.10)',
      bgDark: 'rgba(34,197,94,0.18)',
      borderLight: 'rgba(34,197,94,0.35)',
      borderDark: 'rgba(34,197,94,0.55)',
      iconLight: '#16a34a',
      iconDark: '#4ade80'
    },
    error: {
      bgLight: 'rgba(239,68,68,0.10)',
      bgDark: 'rgba(239,68,68,0.18)',
      borderLight: 'rgba(239,68,68,0.35)',
      borderDark: 'rgba(239,68,68,0.55)',
      iconLight: '#dc2626',
      iconDark: '#f87171'
    },
    warning: {
      bgLight: 'rgba(234,179,8,0.10)',
      bgDark: 'rgba(234,179,8,0.18)',
      borderLight: 'rgba(234,179,8,0.35)',
      borderDark: 'rgba(234,179,8,0.55)',
      iconLight: '#ca8a04',
      iconDark: '#facc15'
    },
    info: {
      bgLight: 'rgba(59,130,246,0.10)',
      bgDark: 'rgba(59,130,246,0.18)',
      borderLight: 'rgba(59,130,246,0.35)',
      borderDark: 'rgba(59,130,246,0.55)',
      iconLight: '#2563eb',
      iconDark: '#60a5fa'
    },
    default: {
      bgLight: 'rgba(148,163,184,0.12)',
      bgDark: 'rgba(148,163,184,0.20)',
      borderLight: 'rgba(148,163,184,0.35)',
      borderDark: 'rgba(148,163,184,0.50)',
      iconLight: '#64748b',
      iconDark: '#94a3b8'
    }
  }

  const palette = colorMap[matched.color ?? 'default']
  const bg = isDark ? palette.bgDark : palette.bgLight
  const border = isDark ? palette.borderDark : palette.borderLight
  const iconColor = isDark ? palette.iconDark : palette.iconLight

  const iconName = typeof matched.icon === 'string' ? matched.icon : null

  return (
    <Box className='flex items-center gap-2'>
      <Box
        title={dictionary?.placeholders?.[matched.label ?? ''] ?? matched.label ?? ''}
        sx={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: bg,
          border: `1.5px solid ${border}`,
          color: iconColor,
          fontSize: '0.85rem',
          lineHeight: 1,
          boxShadow: `0 1px 4px ${border}`,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            transform: 'scale(1.15)',
            boxShadow: `0 2px 8px ${border}`
          }
        }}
      >
        {iconName ? <i className={iconName} style={{ fontSize: '0.8rem' }} /> : matched.icon}
      </Box>

      <Typography sx={{ color: border }} variant='body2'>
        {dictionary?.placeholders?.[matched.label ?? ''] ?? matched.label}
      </Typography>
    </Box>
  )
}

export default IconBadge
