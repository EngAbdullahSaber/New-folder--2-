// MUI Imports
import type { Theme } from '@mui/material/styles'

const pickers: Theme['components'] = {
  MuiDatePicker: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
          }
        }
      }
    }
  },
  MuiMobileDatePicker: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
          }
        }
      }
    }
  },
  MuiDesktopDatePicker: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
          }
        }
      }
    }
  },
  MuiDateTimePicker: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
          }
        }
      }
    }
  },
  MuiTimePicker: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
          }
        }
      }
    }
  },
  MuiPickersOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 'var(--mui-shape-customBorderRadius-md) !important',
        '& .MuiOutlinedInput-notchedOutline': {
          borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
        }
      }
    }
  },
  MuiPickersInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
      }
    }
  },
  MuiPickersInput: {
    styleOverrides: {
      root: {
        borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
      }
    }
  },
  MuiPickersFilledInput: {
    styleOverrides: {
      root: {
        borderRadius: 'var(--mui-shape-customBorderRadius-md) !important'
      }
    }
  }
}

export default pickers
