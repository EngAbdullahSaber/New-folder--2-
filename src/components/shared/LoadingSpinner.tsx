import { Box, CircularProgress, Fade, Skeleton } from '@mui/material'
import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
  fullscreen?: boolean
  size?: number
  color?: 'primary' | 'secondary' | 'inherit'
  type?: 'spinner' | 'skeleton'
  skeletonHeight?: number | string
  skeletonWidth?: number | string
  loading?: boolean // New prop to control visibility
  transitionDuration?: number // Duration in milliseconds
}

const LoadingSpinner = ({
  fullscreen = false,
  size = 40,
  color = 'primary',
  type = 'spinner',
  skeletonHeight = 40,
  skeletonWidth = '100%',
  loading = true,
  transitionDuration = 300
}: LoadingSpinnerProps) => {
  const [shouldRender, setShouldRender] = useState(loading)

  useEffect(() => {
    if (loading) {
      setShouldRender(true)
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, transitionDuration)
      return () => clearTimeout(timer)
    }
  }, [loading, transitionDuration])

  // Don't render anything if not loading and animation is complete
  if (!shouldRender) return null

  // Render spinner with fade
  const spinner = (
    <Fade in={loading} timeout={transitionDuration}>
      <Box display='flex' alignItems='center' justifyContent='center' width='100%' height='100%'>
        <CircularProgress size={size} color={color} />
      </Box>
    </Fade>
  )

  // Render skeleton with fade
  const skeleton = (
    <Fade in={loading} timeout={transitionDuration}>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        width='100%'
        height='100%'
        gap={2}
      >
        <Skeleton variant='rectangular' width={skeletonWidth} height={skeletonHeight} />
        <Skeleton animation='wave' width={skeletonWidth} />
      </Box>
    </Fade>
  )

  const content = type === 'spinner' ? spinner : skeleton

  if (fullscreen) {
    return (
      <Fade in={loading} timeout={transitionDuration}>
        <Box position='relative' width='100%' height='calc(100vh - 90px)'>
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: theme => theme.zIndex.modal + 1,
               backdropFilter: 'blur(4px)',
              transition: `opacity ${transitionDuration}ms ease-in-out`
            }}
          >
            {content}
          </Box>
        </Box>
      </Fade>
    )
  }

  return content
}

export default LoadingSpinner
