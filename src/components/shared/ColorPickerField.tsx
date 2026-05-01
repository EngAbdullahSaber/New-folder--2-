'use client'

import React, { useState, useRef } from 'react'
import { TextField, Popover, Box, IconButton, Chip, styled } from '@mui/material'
import { HexColorPicker, HexColorInput } from 'react-colorful'

// ─── Styled Components ─────────────────────────────────────────────────────
const ColorPreview = styled('div')<{ color: string }>(({ color }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: color,
  border: '2px solid var(--mui-palette-divider)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
}))

const PresetColorChip = styled(Chip)<{ colorValue: string }>(({ colorValue }) => ({
  backgroundColor: colorValue,
  color: getContrastColor(colorValue),
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.8
  }
}))

// ─── Helper: Get contrast color for text ───────────────────────────────────
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155 ? '#000000' : '#FFFFFF'
}

// ─── Main Color Picker Field ───────────────────────────────────────────────
interface ColorPickerFieldProps {
  label?: string
  value?: string
  onChange: (color: string) => void
  error?: boolean
  helperText?: string
  required?: boolean
  disabled?: boolean
  presetColors?: string[]
  showAlpha?: boolean
  placeholder?: string
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
  label = 'Color',
  value = '#7367f0',
  onChange,
  error = false,
  helperText,
  required = false,
  disabled = false,
  presetColors = [
    '#7367f0', // Primary
    '#22c55e', // Success
    '#f59e0b', // Warning
    '#ef4444', // Error
    '#06b6d4', // Info
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f97316' // Orange
  ],
  showAlpha = false,
  placeholder = 'اختر لون'
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColorChange = (newColor: string) => {
    onChange(newColor)
  }

  const handlePresetClick = (color: string) => {
    onChange(color)
    handleClose()
  }

  const open = Boolean(anchorEl)

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        value={value}
        onClick={handleClick}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        InputProps={{
          size: 'small',
          readOnly: true,
          startAdornment: (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              <ColorPreview
                color={value}
                onClick={handleClick}
                style={{ height: '20px', width: '20px', margin: '5px' }}
              />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' onClick={handleClick} disabled={disabled}>
              <i className='ri-palette-line' />
            </IconButton>
          )
        }}
        sx={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          '& .MuiInputBase-input': {
            cursor: disabled ? 'not-allowed' : 'pointer'
          }
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              mt: 1,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderRadius: 2
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 250 }}>
          {/* Color Picker */}
          <HexColorPicker color={value} onChange={handleColorChange} />

          {/* Hex Input */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                backgroundColor: value,
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
            <TextField
              fullWidth
              size='small'
              value={value}
              onChange={e => handleColorChange(e.target.value)}
              placeholder='#7367f0'
              inputProps={{
                maxLength: 7,
                style: { fontFamily: 'monospace', textTransform: 'uppercase' }
              }}
            />
          </Box>

          {/* Preset Colors */}
          {presetColors && presetColors.length > 0 && (
            <Box>
              <Box sx={{ fontSize: 12, fontWeight: 600, mb: 1, color: 'text.secondary' }}>ألوان سريعة</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {presetColors.map(color => (
                  <Box
                    key={color}
                    onClick={() => handlePresetClick(color)}
                    sx={{
                      //   width: 32,
                      //   height: 32,
                      borderRadius: 1,
                      backgroundColor: color,
                      cursor: 'pointer',
                      border: value === color ? '3px solid' : '1px solid',
                      borderColor: value === color ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  )
}
