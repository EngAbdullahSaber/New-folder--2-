'use client'

import React, { useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Box, CircularProgress, useParams, type Locale } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'

// Dynamic import for LeafletMap because it needs 'window'
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <CircularProgress />
    </Box>
  )
})

interface MapLocation {
  coordinates: string
  title: string
}

interface MapViewerProps {
  coordinates?: string
  title?: string
  locations?: MapLocation[]
  fallbackCenter?: [number, number]
  readOnly?: boolean
  onMarkerDragEnd?: (index: number, latAddress: string) => void
  onMapClick?: (latAddress: string) => void
}

export const MapViewer = ({ 
  coordinates, 
  title, 
  locations, 
  fallbackCenter,
  readOnly = true, 
  onMarkerDragEnd,
  onMapClick 
}: MapViewerProps) => {
  const { lang: locale } = useParams()
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    if (locale) {
      getDictionary(locale as Locale).then(setDictionary)
    }
  }, [locale])

  // If single coordinates passed, wrap in locations array for unified processing
  const finalLocations: MapLocation[] = useMemo(() => {
    const defaultTitle = dictionary?.titles?.camp_location || 'موقع المخيم'
    const finalTitle = title || defaultTitle
    return locations || (coordinates ? [{ coordinates, title: finalTitle }] : [])
  }, [locations, coordinates, title, dictionary])

  const markers = useMemo(() => {
    return finalLocations.map(loc => {
      if (!loc.coordinates) return null
      const parts = loc.coordinates.split(',').map(n => n.trim())
      if (parts.length < 2) return null
      const [lng, lat] = parts
      return { lat: parseFloat(lat), lng: parseFloat(lng), title: loc.title }
    }).filter((m): m is { lat: number; lng: number; title: string } => m !== null && !isNaN(m.lat) && !isNaN(m.lng))
  }, [finalLocations])

  // Split view for readOnly vs editing
  if (markers.length === 0 && readOnly) {
     return (
       <Box sx={{ p: 10, textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>
         {dictionary?.messages?.no_locations_found_detailed || 'لم نتمكن من العثور على أي مواقع مسجلة لهذا السجل.'}
       </Box>
     )
  }

  return (
    <Box sx={{ width: '100%', height: readOnly ? '80vh' : '400px', p: readOnly ? 3 : 0 }}>
      {/* Map Container - Full Space */}
      <Box 
        sx={{ 
          height: '100%',
          width: '100%',
          borderRadius: readOnly ? 'var(--mui-shape-customBorderRadius-lg)' : 'var(--mui-shape-customBorderRadius-md)', 
          overflow: 'hidden', 
          border: '1px solid', 
          borderColor: 'divider', 
          boxShadow: readOnly ? (theme => `0 12px 40px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.12)'}`) : 'none',
          position: 'relative'
        }}
      >
        <LeafletMap 
          markers={markers} 
          fallbackCenter={fallbackCenter}
          readOnly={readOnly} 
          onMarkerDragEnd={onMarkerDragEnd}
          onMapClick={onMapClick}
          dictionary={dictionary}
        />
      </Box>
    </Box>
  )
}

export default MapViewer
