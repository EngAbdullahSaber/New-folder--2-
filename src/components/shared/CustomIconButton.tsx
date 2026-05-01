import { Button, styled } from '@mui/material'

export const CustomIconBtn = styled(Button, {
  shouldForwardProp: prop => prop !== 'customColor'
})<{
  customColor?: string
  size?: 'small' | 'large' | 'medium'
  variant?: 'outlined' | 'contained' | 'text'
}>(({ theme, size = 'medium', variant, customColor = '' }) => {
  // Function to generate `rgb(a, b, c / opacity)` from `rgb(a, b, c)`
  const withOpacity = (color: string, opacity: number) => {
    if (color.startsWith('rgb')) {
      return color.replace(')', ` / ${opacity})`).replace(',', '')
    }
    return color // Fallback for unsupported formats
  }

  return {
    ...(size === 'small'
      ? {
          fontSize: '20px',
          padding: theme.spacing(variant === 'outlined' ? 1.5 : 1.2),
          '& i, & svg': {
            fontSize: 'inherit'
          }
        }
      : size === 'large'
        ? {
            fontSize: '24px',
            padding: theme.spacing(variant === 'outlined' ? 2 : 2.25),
            '& i, & svg': {
              fontSize: 'inherit'
            }
          }
        : {
            fontSize: '22px',
            padding: theme.spacing(variant === 'outlined' ? 1.75 : 2),
            '& i, & svg': {
              fontSize: 'inherit'
            }
          }),
    '&:not(.Mui-disabled)': {
      color: customColor,
      backgroundColor: 'transparent',
      borderColor: withOpacity(customColor, 0.16)
    },
    '&:hover, &:active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))': {
      '&:not(.Mui-disabled)': {
        backgroundColor: withOpacity(customColor, 0.12) + '!important',
        borderColor: withOpacity(customColor, 0.5)
      }
    },
    minWidth: '10px !important'
  }
})

export default CustomIconBtn
