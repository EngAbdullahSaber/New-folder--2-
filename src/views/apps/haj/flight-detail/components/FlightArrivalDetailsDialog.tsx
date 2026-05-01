'use client'

import React from 'react'
import dayjs from 'dayjs'
import {
  DialogContent,
  Grid,
  Box,
  Typography,
  Divider,
  Chip,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
} from '@/shared'
import { useSettings } from '@/@core/hooks/useSettings'
import { useParams } from 'next/navigation'
import { getDictionary } from '@/utils/getDictionary'
import type { Locale } from '@configs/i18n'
import { useEffect, useState } from 'react'

interface FlightArrivalDetailsDialogProps {
  id: any
  onClose?: () => void
  data?: any
  open?: boolean
}

// ─── Label + Value row used in info cards ────────────────────────────────────
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
    <Typography variant='body2' color='text.secondary' >
      {label}
    </Typography>
    <Typography variant='body2' sx={{   color: 'text.primary', textAlign: 'end' }}>
      {value || '—'}
    </Typography>
  </Box>
)

// ─── Section title ────────────────────────────────────────────────────────────
const SectionTitle = ({
  icon,
  label,
}: {
  icon: string
  label: string
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className={icon} style={{ fontSize: 18, color: 'inherit' }} />
    </Box>
    <Typography
      variant='subtitle2'
      sx={{
         color: 'text.primary',
        fontSize: '0.875rem',
      }}
    >
      {label}
    </Typography>
  </Box>
)

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string
  label: string
  value: number | string
  color: string
}) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        border: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: color,
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          mb: 1.5,
          borderRadius:  'var(--mui-shape-customBorderRadius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
          color: color,
        }}
      >
        <i className={icon} style={{ fontSize: 22 }} />
      </Box>
      <Typography variant='h5' sx={{ lineHeight: 1, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.75rem'}}>
        {label}
      </Typography>
    </Box>
  )
}

// ─── Group Card ─────────────────────────────────────────────────────────────
const GroupCard = ({ 
  group, 
  dictionary, 
  isDark, 
  theme 
}: { 
  group: any; 
  dictionary: any; 
  isDark: boolean; 
  theme: any 
}) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'action.hover',
      transition: 'all 0.2s ease',
      mb: 2,
      
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ 
          width: 40, height: 40, borderRadius: 'var(--mui-shape-customBorderRadius-md)', 
          bgcolor: 'action.selected', 
          color: 'primary.main',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <i className='ri-group-line' style={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {group.name}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {dictionary.placeholders.travel_agency}
          </Typography>
        </Box>
      </Box>
      <Chip 
        label={`${group.pilgrims} ${dictionary.placeholders.number_of_pilgrims}`}
        size='small'
        sx={{ 
          height: 24, fontSize: '0.7rem', fontWeight: 600,
          bgcolor: 'success.light',
          color: 'primary.contrastText',
          border: '1px solid',
          borderColor: 'success.main'
        }}
      />
    </Box>

    <Grid container spacing={2}>
      <Grid size={{ xs: 6 }}>
        <Box sx={{ p: 1.5, borderRadius: 'var(--mui-shape-customBorderRadius-md)', bgcolor: 'action.hover' }}>
          <Typography variant='caption' color='text.disabled' sx={{ display: 'block', mb: 0.5 }}>
            {dictionary.placeholders.service_center}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className='ri-building-4-line' style={{ fontSize: 14, color: theme.palette.info.main }} />
            <Typography variant='body2' sx={{ fontWeight: 500 }}>{group.center}</Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6 }}>
        <Box sx={{ p: 1.5, borderRadius: 'var(--mui-shape-customBorderRadius-md)', bgcolor: 'action.hover' }}>
          <Typography variant='caption' color='text.disabled' sx={{ display: 'block', mb: 0.5 }}>
            {dictionary.placeholders.nationality_id}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className='ri-flag-line' style={{ fontSize: 14, color: theme.palette.secondary.main }} />
            <Typography variant='body2' sx={{ fontWeight: 500 }}>{group.nationality}</Typography>
          </Box>
        </Box>
      </Grid>                      
    </Grid>

    {group.contract && (
      <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className='ri-file-list-3-line' style={{ fontSize: 16, color: theme.palette.warning.main }} />
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>{group.contract.hotel}</Typography>
         </Box>
                   <IconButton 
            size='small' 
            component='a' 
            href={`https://www.google.com/maps?q=${group.contract.lat},${group.contract.lang}`}
            target='_blank'
            sx={{ 
              color: 'error.main',
              bgcolor: 'action.hover',
              borderRadius: 'var(--mui-shape-customBorderRadius-md)',
              '&:hover': { 
                bgcolor: 'action.selected',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            <i className='ri-map-pin-2-fill' style={{ fontSize: 18 }} />
          </IconButton>
      </Box>
    )}
  </Box>
)

// ─── Info Card Wrapper ────────────────────────────────────────────────────────
const InfoCard = ({ children, title, icon }: { children: React.ReactNode; title?: string; icon?: string }) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const isDark = settings.mode === 'dark'
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: '100%',
       }}
    >
      {title && <SectionTitle icon={icon || ''} label={title} />}
      {children}
    </Box>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const FlightArrivalDetailsDialog = ({ id, onClose, data, open }: FlightArrivalDetailsDialogProps) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const isDark = settings.mode === 'dark'
  const params = useParams()
  const lang = params.lang as Locale
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(lang).then(setDictionary)
  }, [lang])

  if (!dictionary) return null

  // ── Derived data ──────────────────────────────────────────────
  const scheduledDate = data?.timestamp ? dayjs(data.timestamp).format('YYYY-MM-DD') : '—'
  const scheduledTime = data?.timestamp ? dayjs(data.timestamp).format('HH:mm') : '—'
  const flightNo = data?.flight_no || '—'
  const airline = data?.air_trans_company_name_ar || data?.air_trans_company_name_en || '—'
  const terminal = data?.airport_code || '—'
  const capacity = data?.max_capacity ?? 0

  const stats = [
    { label: dictionary.placeholders.number_of_pilgrims, value: capacity.toLocaleString(), icon: 'ri-team-line', color: '#6366f1' },
    { label: dictionary.placeholders.checked_in, value: 0, icon: 'ri-user-follow-line', color: '#10b981' },
    { label: dictionary.placeholders.estimated_no_of_buses_short, value: 0, icon: 'ri-bus-2-line', color: '#f59e0b' },
    { label: dictionary.navigation.nationalities, value: 2, icon: 'ri-global-line', color: '#ec4899' },
  ]

  const mockGroups = [
    {
      id: 'G1',
      name: 'Jannat Travels',
      center: 'M001',
      nationality: 'Bangladesh',
      pilgrims: capacity,
      contract: {
        hotel: 'فندق أرجوان السعادة',
           lang:"22",
        lat:"32"
      }
    },
    {
      id: 'G2',
      name: 'Al-Ansar Group',
      center: 'M005',
      nationality: 'Pakistan',
      pilgrims: 45,
      contract: {
        hotel: 'فندق منازل المختارة',
         lang:"22",
        lat:"32"
      }
    }
  ]

  const Content = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── HEADER ──────────────────────────────────────────────── */}
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <Box
        sx={{
          mb: 3,
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
         
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 'var(--mui-shape-customBorderRadius-md)',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'common.white',
              boxShadow: theme.shadows[2],
            }}
          >
            <i className='ri-flight-land-line' style={{ fontSize: 24 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant='h5' sx={{ fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>
              {dictionary.titles.flight_arrival_details}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 'var(--mui-shape-customBorderRadius-md)', bgcolor: 'action.hover' }}>
                <i className='ri-calendar-line' style={{ fontSize: 14, color: 'success.contrastText'}} />
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {scheduledDate}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: 'var(--mui-shape-customBorderRadius-md)', bgcolor: 'action.hover' }}>
                <i className='ri-time-line' style={{ fontSize: 14,           color: 'success.contrastText'}} />
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {scheduledTime}
                </Typography>
              </Box>
              <Chip
                label={flightNo}
                size='small'
                sx={{ 
                  height: 28, 
                  px: 1,
                  fontSize: '0.85rem', 
                  fontWeight: 700,
                  bgcolor: theme.palette.primary.main,
                  color: 'common.white',
                 }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2,
            py: 1,
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <Box sx={{ 
            width: 28, height: 28, borderRadius: 'var(--mui-shape-customBorderRadius-sm)', 
            bgcolor: 'action.selected',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className='ri-plane-line' style={{ fontSize: 16, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant='subtitle1' sx={{ fontWeight: 600, color: 'text.primary' }}>
            {airline}
          </Typography>
        </Box>
      </Box>

      {/* ── BODY ────────────────────────────────────────────────── */}
      <DialogContent sx={{ p: { xs: 4, sm: 5 } }}>
        <Grid container spacing={3}>

          {/* ── Route Visualizer Card ─────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                p: 3,
                borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              {/* ── Origin → Transport → Destination ── */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 3,
                }}
              >
                {/* Origin */}
                <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 2,
                      py: 0.5,
                      mb: 0.75,
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                      bgcolor: 'success.light',
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{   color: 'primary.contrastText', fontSize: '0.72rem' }}
                    >
                      {dictionary.placeholders.origin}
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{   color: 'text.primary' }}>
                    {data?.origin || '—'}
                  </Typography>
                </Box>

                {/* Connector line + transport icon */}
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'relative',
                  }}
                >
                  {/* left dot */}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      flexShrink: 0,
                    }}
                  />
                  {/* dashed line left */}
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      borderTop: '2px dashed',
                      borderColor: 'success.main',
                    }}
                  />
                  {/* bus icon bubble */}
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'background.paper',
                      border: '2px solid',
                      borderColor: 'success.main',
                      flexShrink: 0,
                    }}
                  >
                    <i className='ri-bus-2-line' style={{ fontSize: 20, color: theme.palette.success.main }} />
                  </Box>
                  {/* dashed line right */}
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      borderTop: '2px dashed',
                      borderColor: 'success.main',
                    }}
                  />
                  {/* right dot */}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      flexShrink: 0,
                    }}
                  />
                </Box>

                {/* Destination */}
                <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 2,
                      py: 0.5,
                      mb: 0.75,
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                      bgcolor: 'primary.light',
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{                         color: 'primary.contrastText',
 fontSize: '0.72rem' }}
                    >
                      {dictionary.placeholders.destination || dictionary.placeholders.airport_code}
                    </Typography>
                  </Box>
                  <Typography variant='body2' sx={{   color: 'text.primary' }}>
                    {terminal}
                  </Typography>
                </Box>
              </Box>

              {/* ── Info tiles row ─────────────────────────────────── */}
              <Grid container spacing={2}>
                {/* Terminal / Hall */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      py: 4,
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                       
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.25,
                        mb: 1,
                        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        bgcolor: 'warning.light',
                        color: 'primary.contrastText',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    >
                      {dictionary.placeholders.gate || 'الصالة'}
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.gate || '—'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Actual Arrival Time */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                      
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.25,
                        mb: 1,
                        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        bgcolor: 'success.light',
                        color: 'primary.contrastText',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    >
                      {dictionary.placeholders.actual_time}
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {data?.actual_time || '—'}
                    </Typography>
                    <Typography variant='caption' color='text.disabled' sx={{ display: 'block', mt: 0.25 }}>
                      {data?.actual_date || scheduledDate}
                    </Typography>
                  </Box>
                </Grid>

                {/* Scheduled Flight Time */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                    
                      bgcolor: 'background.paper',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.25,
                        mb: 1,
                        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                      }}
                    >
                      {dictionary.placeholders.scheduled_time}
                    </Typography>
                    <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {scheduledTime}
                    </Typography>
                    <Typography variant='caption' color='text.disabled' sx={{ display: 'block', mt: 0.25 }}>
                      {scheduledDate}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* ── Stats ─────────────────────────────────────────── */}
          {stats.map((stat, i) => (
            <Grid size={{ xs: 6, sm: 3 }} key={i}>
              <StatCard {...stat} />
            </Grid>
          ))}

          {/* ── Groups and Services ───────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <InfoCard title={dictionary.titles.groups_and_services} icon='ri-community-line'>
              <Divider sx={{ mb: 3, opacity: 0.5 }} />
              <Grid container spacing={3}>
                {mockGroups.map((group) => (
                  <Grid size={{ xs: 12, md: 6 }} key={group.id}>
                    <GroupCard 
                      group={group} 
                      dictionary={dictionary} 
                      isDark={isDark} 
                      theme={theme} 
                    />
                  </Grid>
                ))}
              </Grid>
            </InfoCard>
          </Grid>

        </Grid>
      </DialogContent>
    </Box>
  )

  // If Dialog wrapper is needed
  if (open !== undefined) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius:  'var(--mui-shape-customBorderRadius-md)',
            overflow: 'hidden',
          }
        }}
      >
        <Content />
      </Dialog>
    )
  }

  // Return as standalone component
  return <Content />
}

export default FlightArrivalDetailsDialog
