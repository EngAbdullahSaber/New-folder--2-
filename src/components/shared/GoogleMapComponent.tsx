'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Box, CircularProgress, Typography, IconButton, Stack, alpha, useTheme } from '@/shared'
import { getOperatorConfig } from '@/configs/environment'

interface MapMarker {
  lat: number
  lng: number
  title: string
}

interface GoogleMapComponentProps {
  markers: MapMarker[]
}

const containerStyle = {
  width: '100%',
  height: '100%'
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ markers }) => {
  const theme = useTheme()
  const { mapApiKey } = getOperatorConfig()
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapApiKey
  })

  // Calculate center of all markers
  const center = useMemo(() => {
    if (markers.length === 0) return { lat: 21.4225, lng: 39.8262 } // Default to Makkah
    const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length
    const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length
    return { lat, lng }
  }, [markers])

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds()
    markers.forEach(marker => {
      bounds.extend({ lat: marker.lat, lng: marker.lng })
    })
    
    if (markers.length > 1) {
      map.fitBounds(bounds)
    } else if (markers.length === 1) {
      map.setCenter({ lat: markers[0].lat, lng: markers[0].lng })
      map.setZoom(15)
    }
    
    setMap(map)
  }, [markers])

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null)
  }, [])

  if (!isLoaded) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        styles: theme.palette.mode === 'dark' ? darkMapStyle : []
      }}
    >
      {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={{ lat: marker.lat, lng: marker.lng }}
          title={marker.title}
          onClick={() => setSelectedMarker(marker)}
          animation={window.google.maps.Animation.DROP}
        />
      ))}

      {selectedMarker && (
        <InfoWindow
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <Box sx={{ p: 1, minWidth: 150 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              {selectedMarker.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {`${selectedMarker.lat.toFixed(6)}, ${selectedMarker.lng.toFixed(6)}`}
            </Typography>
          </Box>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

// Dark mode styles for Google Maps
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }]
  }
]

export default GoogleMapComponent
