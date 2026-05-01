'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  InputBase,
  Paper
} from '@mui/material'
import { availableIcons } from '@/utils/icon-list'

interface IconPickerFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: boolean
  helperText?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  dictionary?: any
}

export const IconPickerField: React.FC<IconPickerFieldProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled,
  required,
  placeholder,
  dictionary
}) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ Verify RemixIcon is loaded
  useEffect(() => {
    const link = document.querySelector('link[href*="remixicon"]')
    if (!link) {
      console.warn('⚠️ RemixIcon CSS not found. Icons may not display correctly.')
    }
  }, [])

  const filteredIcons = useMemo(() => {
    return availableIcons.filter(icon => icon.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [searchTerm])

  const handleOpen = () => {
    if (!disabled) setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSearchTerm('')
  }

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName)
    handleClose()
  }

  return (
    <>
      <TextField
        label={label}
        value={value || ''}
        fullWidth
        required={required}
        error={error}
        helperText={helperText}
        disabled={disabled}
        placeholder={placeholder || dictionary?.actions?.search_icons || 'Choose an icon...'}
        onClick={handleOpen}
        slotProps={{
          input: {
            readOnly: true,
            startAdornment: value ? (
              <InputAdornment position='start'>
                {/* ✅ Added inline styles to force display */}
                <i
                  className={value}
                  style={{
                    fontSize: '1.25rem',
                    display: 'inline-block',
                    lineHeight: 1,
                    verticalAlign: 'middle'
                  }}
                />
              </InputAdornment>
            ) : null,
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton size='small' edge='end' onClick={handleOpen} disabled={disabled}>
                  <i className='ri-search-line' style={{ display: 'inline-block' }} />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            cursor: disabled ? 'default' : 'pointer'
          }
        }}
        size='small'
      />

      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h6'>{dictionary?.actions?.select_icon || 'Select Icon'}</Typography>
            <IconButton onClick={handleClose} size='small'>
              <i className='ri-close-line' style={{ display: 'inline-block' }} />
            </IconButton>
          </Box>
          <Paper
            component='div'
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              border: '1px solid var(--mui-palette-divider)'
            }}
            elevation={0}
          >
            <Box sx={{ ml: 1, color: 'text.secondary', display: 'flex' }}>
              <i className='ri-search-line' style={{ display: 'inline-block' }} />
            </Box>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
              placeholder={dictionary?.actions?.search_icons || 'Search icons...'}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </Paper>
        </DialogTitle>
        <DialogContent sx={{ p: '0 16px 16px', maxHeight: '400px' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
              gap: 1,
              mt: 1
            }}
          >
            {filteredIcons.map(icon => (
              <Box
                key={icon}
                onClick={() => handleSelectIcon(icon)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'all 0.2s',
                  backgroundColor: value === icon ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                  borderColor: value === icon ? 'var(--mui-palette-primary-main)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'var(--mui-palette-action-hover)',
                    borderColor: 'var(--mui-palette-divider)'
                  }
                }}
              >
                {/* ✅ Fixed icon display with proper styles */}
                <i
                  className={icon}
                  style={{
                    fontSize: '1.5rem',
                    marginBottom: '8px',
                    color: value === icon ? 'var(--mui-palette-primary-main)' : 'inherit',
                    display: 'inline-block', // ✅ Critical for icon display
                    lineHeight: 1,
                    fontStyle: 'normal', // ✅ Override any italic styles
                    verticalAlign: 'middle'
                  }}
                />
                <Typography
                  variant='caption'
                  sx={{
                    fontSize: '10px',
                    textAlign: 'center',
                    wordBreak: 'break-all',
                    color: 'text.secondary',
                    lineHeight: 1.1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                  title={icon}
                >
                  {icon.replace('ri-', '').replace('bi-', '')}
                </Typography>
              </Box>
            ))}
          </Box>
          {filteredIcons.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color='text.secondary'>
                {dictionary?.actions?.no_icons_found
                  ? dictionary.actions.no_icons_found.replace('{searchTerm}', searchTerm)
                  : `No icons found for "${searchTerm}"`}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
