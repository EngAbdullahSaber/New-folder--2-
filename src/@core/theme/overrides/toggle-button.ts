// MUI Imports
import type { Theme } from '@mui/material/styles'

const toggleButton: Theme['components'] = {
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        ...(ownerState.size === 'small' && {
          borderRadius: 'var(--mui-shape-customBorderRadius-sm)'
        }),
        ...(ownerState.size === 'large' && {
          borderRadius: 'var(--mui-shape-customBorderRadius-lg)'
        })
      })
    }
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        '&:not(.Mui-selected):not(.Mui-disabled)': {
          color: 'var(--mui-palette-text-secondary)'
        }
      },
      sizeSmall: {
        borderRadius: 'var(--mui-shape-customBorderRadius-sm)'
      },
      sizeLarge: {
        borderRadius: 'var(--mui-shape-customBorderRadius-lg)'
      }
    }
  }
}

export default toggleButton
