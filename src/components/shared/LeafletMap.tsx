'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Box, Typography, Menu, MenuItem, ListItemIcon, ListItemText, toast, alpha } from '@/shared'

// Fix default marker icon issues in Next.js/React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface MarkerData {
  lat: number
  lng: number
  title: string
}

interface LeafletMapProps {
  markers: MarkerData[]
  fallbackCenter?: [number, number]
  readOnly?: boolean
  onMarkerDragEnd?: (index: number, latAddress: string) => void
  onMapClick?: (latAddress: string) => void
  dictionary?: any
}

// Helper to handle clicks on the map
function MapEvents({ onClick, enabled }: { onClick?: (latAddress: string) => void, enabled: boolean }) {
  useMapEvents({
    click(e) {
      if (enabled && onClick) {
        onClick(`${e.latlng.lng.toFixed(14)},${e.latlng.lat.toFixed(14)}`)
      }
    },
  })
  return null
}

// Helper to auto-fit bounds
function FitBounds({ markers }: { markers: any[] }) {
  const map = useMap()
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, markers])
  return null
}

const LeafletMap: React.FC<LeafletMapProps> = ({ markers, fallbackCenter, readOnly = true, onMarkerDragEnd, onMapClick, dictionary }) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    marker: MarkerData
  } | null>(null)

  if (typeof window === 'undefined') return null

  const handleContextMenu = (event: L.LeafletMouseEvent, marker: MarkerData) => {
    // Prevent the default browser context menu
    L.DomEvent.stopPropagation(event.originalEvent)
    L.DomEvent.preventDefault(event.originalEvent)

    setContextMenu({
      mouseX: event.originalEvent.clientX,
      mouseY: event.originalEvent.clientY,
      marker: marker
    })
  }

  const handleClose = () => {
    setContextMenu(null)
  }

  const copyCoordinates = () => {
    if (contextMenu) {
      const coords = `${contextMenu.marker.lng.toFixed(6)}, ${contextMenu.marker.lat.toFixed(6)}`
      navigator.clipboard.writeText(coords)
      toast.success(dictionary?.messages?.coordinates_copied || 'تم نسخ الإحداثيات بنجاح')
    }
    handleClose()
  }

  const shareLocation = async () => {
    if (contextMenu) {
      const shareUrl = `https://www.google.com/maps?q=${contextMenu.marker.lat},${contextMenu.marker.lng}`
      if (navigator.share) {
        try {
          await navigator.share({
            title: contextMenu.marker.title,
            text: `${dictionary?.placeholders?.location || 'الموقع'}: ${contextMenu.marker.title}\n${dictionary?.placeholders?.coordinates_label || 'الإحداثيات'}: ${contextMenu.marker.lat},${contextMenu.marker.lng}`,
            url: shareUrl
          })
        } catch (err) {
          window.open(shareUrl, '_blank')
        }
      } else {
        window.open(shareUrl, '_blank')
      }
    }
    handleClose()
  }

  const openInGoogleMaps = () => {
    if (contextMenu) {
      const url = `https://www.google.com/maps?q=${contextMenu.marker.lat},${contextMenu.marker.lng}`
      window.open(url, '_blank')
    }
    handleClose()
  }

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={markers.length > 0 ? [markers[0].lat, markers[0].lng] : (fallbackCenter || [21.4225, 39.8262])}
        zoom={markers.length > 0 ? 13 : (fallbackCenter ? 12 : 13)}
        style={{ height: '100%', width: '100%', background: '#f5f5f5' }}
      >
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='&copy; Google Maps'
        />
        <MapEvents onClick={onMapClick} enabled={!readOnly} />
        {markers.map((marker, idx) => (
          <Marker 
            key={idx} 
            position={[marker.lat, marker.lng]}
            draggable={!readOnly}
            eventHandlers={{
              contextmenu: (e) => handleContextMenu(e, marker),
              dragend: (e) => {
                if (onMarkerDragEnd) {
                  const latLng = e.target.getLatLng()
                  onMarkerDragEnd(idx, `${latLng.lng.toFixed(14)},${latLng.lat.toFixed(14)}`)
                }
              }
            }}
          >
            <Popup>
              <Box sx={{ textAlign: 'center', p: 1 }}>
                <Typography variant="subtitle2" sx={{  mb: 1, color: '#000000' }}>
                  {marker.title}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#444444', fontWeight: 600 }}>
                  {`${marker.lng.toFixed(6)}, ${marker.lat.toFixed(6)}`}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
        {readOnly && <FitBounds markers={markers} />}
      </MapContainer>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: 180,
            boxShadow: theme => `0 10px 25px ${alpha(theme.palette.common.black, 0.15)}`,
            zIndex: 2000
          }
        }}
      >
        <MenuItem onClick={copyCoordinates}>
          <ListItemIcon>
            <i className="ri-file-copy-line" />
          </ListItemIcon>
          <ListItemText>{dictionary?.actions?.copy_coordinates || 'نسخ الإحداثيات'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={shareLocation}>
          <ListItemIcon>
            <i className="ri-share-line" />
          </ListItemIcon>
          <ListItemText>{dictionary?.actions?.share_location || 'مشاركة الموقع'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={openInGoogleMaps}>
          <ListItemIcon>
            <i className="ri-map-2-line" />
          </ListItemIcon>
          <ListItemText>{dictionary?.actions?.open_in_google_maps || 'فتح في خرائط جوجل'}</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default LeafletMap
