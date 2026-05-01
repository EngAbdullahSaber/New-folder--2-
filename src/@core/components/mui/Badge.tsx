'use client'

// MUI Imports
import MuiBadge from '@mui/material/Badge'
import type { BadgeProps } from '@mui/material/Badge'
import { styled } from '@mui/material/styles'

export type CustomBadgeProps = BadgeProps & {
  tonal?: 'true' | 'false'
}

const Badge = styled(MuiBadge)<CustomBadgeProps>(({ tonal, color }) => {
  return {
    ...(tonal === 'true' && {
      '& .MuiBadge-badge.MuiBadge-standard': {
        color: `var(--mui-palette-${color}-main)`,
        backgroundColor: `var(--mui-palette-${color}-lightOpacity)`,
        borderRadius: '50%',
        minWidth: 24,
        height: 24,
        padding: 0
      }
    })
  }
})

const CustomBadge = (props: CustomBadgeProps) => <Badge {...props} />

export default CustomBadge
