'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton
} from '@mui/material'
import { useRouter } from 'next/navigation'
import ListOfValue from './ListOfValue'

export interface ListSettingField {
  name: string
  label: string
  apiUrl?: string
  options?: any[]
  labelProp: string
  keyProp: string
  storageKey: string
  lovKeyName?: string
  apiMethod?: 'GET' | 'POST'
  searchInBackend?: boolean
  cache?: boolean
  responseDataKey?: string
  multiple?: boolean
  defaultValue?: any
}

interface GenericSettingsDialogProps {
  open: boolean
  onClose: () => void
  title: string
  field: ListSettingField
  dictionary: any
  lang: string
}

export const GenericSettingsDialog = ({
  open,
  onClose,
  title,
  field,
  dictionary,
  lang
}: GenericSettingsDialogProps) => {
  const router = useRouter()
  const [selectedValue, setSelectedValue] = useState<any>(field.multiple ? [] : null)

  useEffect(() => {
    if (open) {
      const saved = sessionStorage.getItem(field.storageKey)
      if (saved) {
        try {
          setSelectedValue(JSON.parse(saved))
        } catch (e) {
          console.error(`Failed to parse ${field.storageKey} from sessionStorage`, e)
        }
      } else {
        setSelectedValue(field.defaultValue !== undefined ? field.defaultValue : (field.multiple ? [] : null))
      }
    }
  }, [open, field.storageKey, field.multiple, field.defaultValue])

  const lovField: any = {
    name: field.name,
    label: field.label,
    multiple: field.multiple ?? false,
    apiUrl: field.apiUrl,
    options: field.options,
    labelProp: field.labelProp,
    keyProp: field.keyProp,
    apiMethod: field.apiMethod || 'POST',
    searchInBackend: field.searchInBackend ?? true,
    cache: field.cache ?? true,
    responseDataKey: field.responseDataKey,
    gridSize: 12
  }

  const handleSave = () => {
    sessionStorage.setItem(field.storageKey, JSON.stringify(selectedValue))
    onClose()
    router.refresh()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle className='flex justify-between items-center'>
        <Typography variant='h6'>{title}</Typography>
        <IconButton onClick={onClose} size='small'>
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4} className='mbs-2'>
          <Grid size={{ xs: 12 }}>
            <ListOfValue
              field={lovField}
              row={{ [field.lovKeyName || field.name]: selectedValue }}
              rowIndex={0}
              handleInputChange={(index, name, value, object) => {
                // If object is provided (array of selected items), use it, otherwise use value
                setSelectedValue(object || value)
              }}
              errors={{}}
              apiUrl={field.apiUrl || ''}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', alignItems: 'center' }}>
        <Button onClick={onClose} variant='outlined' color='error'>
          {dictionary?.actions?.cancel || 'Cancel'}
        </Button>
        <Button onClick={handleSave} variant='contained' color='primary'>
          {dictionary?.actions?.save || 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
