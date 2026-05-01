import { styled, Tooltip, tooltipClasses } from '@mui/material'

export const CustomTooltipButton = styled(({ className, ...props }: any) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '0.7rem', // Adjust font size here
    padding: theme.spacing(0.5, 1)
  }
}))

export default CustomTooltipButton
