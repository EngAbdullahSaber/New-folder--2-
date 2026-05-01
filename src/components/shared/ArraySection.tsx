import CustomAvatar from '@/@core/components/mui/Avatar'
import { Locale } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import { Card, CardContent, Typography, Box, Divider, GridSize, Grid } from '@mui/material'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

type ColumnConfig<T> = { key: keyof T; render?: (row: T, index: number) => React.ReactNode; flexBasis?: string }

type Props<T> = {
  title?: string
  subtitle?: string
  data?: T[]
  columns: ColumnConfig<T>[]
  emptyText?: string
  locale?: any
  gridSize?: GridSize | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', GridSize>>
}

function ArraySection<T extends Record<string, any>>({
  title,
  subtitle,
  data = [],
  columns,
  emptyText = '—',
  locale = '',
  gridSize = { xs: 12, md: 4 }
}: Props<T>) {
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])

  if (!data.length) return null

  return (
    <Card
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: '0 !important' }}>
        {/* Section Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2.5,
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                : 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(168,85,247,0.03) 100%)',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CustomAvatar
            skin='light'
            color={'primary'}
            size={36}
            sx={{ boxShadow: '0 2px 8px rgba(99,102,241,0.25)', flexShrink: 0 }}
          >
            <i className={classNames('ri-align-justify', 'text-lg')} />
          </CustomAvatar>

          <Box sx={{ ml: 1.5 }}>
            <Typography
              variant='h6'
              sx={{
                fontWeight: 600,
                fontSize: '0.9375rem',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                color: 'text.primary'
              }}
            >
              {dictionary?.titles?.[title || 'main_information']}
            </Typography>
            {subtitle && (
              <Typography variant='caption' sx={{ color: 'text.secondary', lineHeight: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Rows as grid */}
        <Box sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            {data.map((row, rowIndex) => (
              <Grid
                key={rowIndex}
                size={gridSize}
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  background: theme =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                    borderColor: 'primary.light'
                  },
                  // Subtle top accent line on hover
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    borderRadius: '8px 8px 0 0'
                  },
                  '&:hover::before': { opacity: 1 }
                }}
              >
                {columns.map((col, colIndex) => (
                  <Box
                    key={String(col.key)}
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'flex-start',
                      mb: colIndex < columns.length - 1 ? 1.5 : 0,
                      pb: colIndex < columns.length - 1 ? 1.5 : 0,
                      borderBottom: colIndex < columns.length - 1 ? '1px dashed' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography
                      variant='subtitle2'
                      sx={{
                        color: 'text.disabled',
                        fontWeight: 600,
                        fontSize: '0.6875rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        minWidth: 90,
                        pt: '2px',
                        flexShrink: 0
                      }}
                    >
                      {row[col.key]}
                    </Typography>

                    <Typography
                      variant='body2'
                      sx={{
                        color: 'text.primary',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        wordBreak: 'break-word'
                      }}
                    >
                      {col.render ? col.render(row, rowIndex) : (row[col.key] ?? emptyText)}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ArraySection
