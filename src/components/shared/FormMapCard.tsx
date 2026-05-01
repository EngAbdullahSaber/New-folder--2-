'use client'

import React from 'react'
import { 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  CustomAvatar, 
  MapViewer, 
  useFormContext,
  useSessionHandler,
  useMemo
} from '@/shared'
import type { Mode } from '@/shared'

interface CoordinateField {
  name: string | [string, string]
  title: string
}

interface FormMapCardProps {
  title?: string
  icon?: string
  coordinateFields: CoordinateField[]
  mode: Mode
  dictionary: any
}

export const FormMapCard = ({
  title,
  icon = 'ri-map-pin-line',
  coordinateFields,
  mode,
  dictionary
}: FormMapCardProps) => {
  const { watch, setValue, getValues } = useFormContext()
  const { user } = useSessionHandler()

  // Watch for coordinates and city_id
  const watchNames = coordinateFields.flatMap(f => (Array.isArray(f.name) ? f.name : [f.name]))
  const watchedValues = watch([...watchNames, 'city_id'])
  const selectedCityId = getValues('city_id')

  const fallbackCenter = useMemo((): [number, number] | undefined => {
    const cityIdToUse = selectedCityId || user?.context?.city_id
    if (!cityIdToUse) return undefined

    // Mapping of common city IDs to their coordinates
    const cityCoordinatesMap: Record<string, [number, number]> = {
      '603': [21.4225, 39.8262], // Makkah
      '605': [24.4672, 39.6111], // Madinah
      '1': [21.4225, 39.8262],   // Generic Makkah ID fallback
      '2': [24.4672, 39.6111],   // Generic Madinah ID fallback
      '3': [21.5433, 39.1728],   // Jeddah
      '4': [21.4326, 39.8055],   // Mina
      '5': [21.3486, 39.9708]    // Arafat
    }

    const city = user?.user_cities?.find((c: any) => String(c.id) === String(cityIdToUse))
    
    // If city object has coordinates, use them
    if (city?.latitude && city?.longitude) {
      return [parseFloat(city.latitude), parseFloat(city.longitude)]
    }

    // Try finding by ID string first
    let coords = cityCoordinatesMap[String(cityIdToUse)]

    // Fallback: search by name if ID didn't match (for cities like Jeddah or Taif with unknown IDs)
    if (!coords && city) {
      const cityName = (city.name_la || '').toLowerCase()
      if (cityName.includes('jeddah')) coords = [21.5433, 39.1728]
      else if (cityName.includes('taif')) coords = [21.2854, 40.4258]
      else if (cityName.includes('makkah') || cityName.includes('meccah')) coords = [21.4225, 39.8262]
      else if (cityName.includes('madina')) coords = [24.4672, 39.6111]
    }

    return coords
  }, [selectedCityId, user?.context?.city_id, user?.user_cities])

  const locations = coordinateFields
    .map(field => {
      let coords = ''

      if (Array.isArray(field.name)) {
        const [lat, lng] = field.name
        const latVal = getValues(lat)
        const lngVal = getValues(lng)

        // For MapViewer, we need "lng,lat"
        if (latVal && lngVal) {
          coords = `${lngVal},${latVal}`
        }
      } else {
        coords = getValues(field.name)
      }

      return {
        coordinates: coords,
        title: dictionary?.actions?.[field.title] || dictionary?.placeholders?.[field.title] || dictionary?.titles?.[field.title] || dictionary?.[field.title] || field.title
      }
    })
    .filter(l => l.coordinates)

  const handleMarkerDragEnd = (idx: number, coords: string) => {
    // Identify which field set this corresponds to
    const activeFields = coordinateFields.filter(f => {
      if (Array.isArray(f.name)) {
        return getValues(f.name[0]) && getValues(f.name[1])
      }
      return getValues(f.name)
    })

    const field = activeFields[idx]
    if (!field) return

    // coords is "lng,lat"
    const [lng, lat] = coords.split(',').map(c => c.trim())

    if (Array.isArray(field.name)) {
      setValue(field.name[0], lat, { shouldDirty: true }) // Latitude
      setValue(field.name[1], lng, { shouldDirty: true }) // Longitude
    } else {
      setValue(field.name, coords, { shouldDirty: true })
    }
  }

  const handleMapClick = (coords: string) => {
    if (mode === 'show') return

    // coords is "lng,lat"
    const [lng, lat] = coords.split(',').map(c => c.trim())

    // Find first empty record
    const emptyField = coordinateFields.find(f => {
      if (Array.isArray(f.name)) {
        return !getValues(f.name[0]) || !getValues(f.name[1])
      }
      return !getValues(f.name)
    })

    if (emptyField) {
      if (Array.isArray(emptyField.name)) {
        setValue(emptyField.name[0], lat, { shouldDirty: true })
        setValue(emptyField.name[1], lng, { shouldDirty: true })
      } else {
        setValue(emptyField.name, coords, { shouldDirty: true })
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }} className='mb-3'>
          <CustomAvatar skin='light' color='primary' size={30}>
            <i className={`${icon} text-lg`} />
          </CustomAvatar>
          <Typography className='mx-2' variant='h6'>
            {title || dictionary?.coordinates_in_map || 'إحداثيات في الخريطة'}
          </Typography>
        </Box>
        <MapViewer
          locations={locations}
          fallbackCenter={fallbackCenter}
          readOnly={mode === 'show'}
          onMarkerDragEnd={handleMarkerDragEnd}
          onMapClick={handleMapClick}
        />
      </CardContent>
    </Card>
  )
}

export default FormMapCard
