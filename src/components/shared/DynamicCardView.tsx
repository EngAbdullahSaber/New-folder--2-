'use client'

import React from 'react'
import { Box, Typography, Chip } from '@mui/material'
import { alpha, useTheme } from '@mui/material'
import { resolveCell } from './ResolveDataTableCell'
import CustomIconButton from './CustomIconButton'
import CustomTooltipButton from './CustomTooltipButton'
import OptionMenu from '@core/components/option-menu'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import type { MenuOption } from '@/shared'
import { MapViewer } from '@/shared'

interface DynamicCardViewProps {
  columns: any[]
  data: any[]
  onRowOptionClick: (action: string, id: any, customUrl?: string) => void
  openDialog?: (component: any, value: any) => void
  dictionary?: any
  fetchKey?: string
  showOnlyOptions?: Array<'add' | 'edit' | 'delete' | 'search' | 'chat' | 'print' | 'export' | (string & {})>
  rowOptions?: MenuOption[]
  mapLocation?: string[]
}

export const DynamicCardView: React.FC<DynamicCardViewProps> = ({
  columns,
  data,
  onRowOptionClick,
  openDialog,
  dictionary,
  fetchKey = 'id',
  showOnlyOptions = [],
  rowOptions = [],
  mapLocation = []
}) => {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const { canEdit, showEditButton, canDelete } = useScreenPermissions('list')

  const shouldRender = (action: string, standardPermission: boolean) => {
    if (showOnlyOptions && showOnlyOptions.length > 0) {
      return showOnlyOptions.includes(action as any)
    }
    return standardPermission
  }

  const defaultRowOptions: MenuOption[] = (
    rowOptions.length
      ? rowOptions
      : [
        { text: 'edit', action: 'edit', visible: true },
        { text: 'delete', action: 'delete', visible: true }
      ]
  )
    .filter(option => option.visible !== false)
    .filter(option => shouldRender(option.action, true))

  // ✅ استثنِ أعمدة النظام
  const displayCols = columns.filter(col => col.accessorKey !== 'id' && !col.isIdentifier && col.type !== 'storage')

  const identifierCol = columns.find(col => col.accessorKey === 'id' || col.isIdentifier)

  const SingleCard = ({ row }: { row: any }) => {
    const rowId = row[fetchKey] || row.id
    const identifierValue = identifierCol ? row[identifierCol.accessorKey] : row.id

    return (
      <Box
        sx={{
          borderRadius: `${theme.shape.customBorderRadius.md}px`,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {

            boxShadow: isDark
              ? `0 3px 7px ${alpha(theme.palette.common.black, 0.4)}`
              : `0 3px 7px ${alpha(theme.palette.primary.main, 0.12)}`,
            borderColor: 'primary.main'
          }
        }}
      >
        {/* ✅ Card Header */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'customColors.tableHeaderBg'
          }}
        >
          {/* ID Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.4,
              borderRadius: `${theme.shape.customBorderRadius.lg}px`,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
              cursor: identifierCol ? 'pointer' : 'default'
            }}
            onClick={() => identifierCol && onRowOptionClick('show', rowId)}
          >
            <i className='ri-hashtag' style={{ fontSize: 11, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'primary.main' }}>{identifierValue}</Typography>
          </Box>

          {/* ✅ Actions */}
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {shouldRender('edit', canEdit && showEditButton) && (
              <CustomTooltipButton title={dictionary?.actions?.['edit']} arrow>
                <CustomIconButton
                  color='warning'
                  size='small'
                  onClick={e => {
                    e.stopPropagation()
                    onRowOptionClick('edit', rowId)
                  }}
                  sx={{ width: 28, height: 28 }}
                >
                  <i className='ri-pencil-line' style={{ fontSize: 14 }} />
                </CustomIconButton>
              </CustomTooltipButton>
            )}

            {shouldRender('delete', canDelete) && (
              <CustomTooltipButton title={dictionary?.actions?.['delete']} arrow>
                <CustomIconButton
                  color='error'
                  size='small'
                  onClick={e => {
                    e.stopPropagation()
                    onRowOptionClick('delete', rowId)
                  }}
                  sx={{ width: 28, height: 28 }}
                >
                  <i className='ri-delete-bin-6-line' style={{ fontSize: 14 }} />
                </CustomIconButton>
              </CustomTooltipButton>
            )}

            {/* ✅ UNIFIED MAP ACTION */}
            {mapLocation && mapLocation.length > 0 && (
              <CustomTooltipButton title='عرض المواقع' arrow>
                <CustomIconButton
                  color='info'
                  size='small'
                  onClick={e => {
                    e.stopPropagation()
                    const locations = mapLocation
                      .map(key => ({
                        coordinates: row[key],
                        title: dictionary?.actions?.[key] || key.replace('_', ' ')
                      }))
                      .filter(loc => loc.coordinates)

                    if (locations.length > 0) {
                      openDialog?.(MapViewer, { locations })
                    }
                  }}
                  sx={{ width: 28, height: 28, bgcolor: alpha(theme.palette.info.main, 0.1) }}
                >
                  <i className='ri-map-pin-2-line' style={{ fontSize: 14 }} />
                </CustomIconButton>
              </CustomTooltipButton>
            )}

            {defaultRowOptions.length > 0 && (
              <div onClick={e => e.stopPropagation()}>
                <OptionMenu
                  iconButtonProps={{ size: 'small' }}
                  iconClassName='text-textSecondary text-[18px]'
                  options={defaultRowOptions.map(option => ({
                    text: dictionary?.actions?.[option.text],
                    icon: option.icon,
                    disabled: option.disabled,
                    menuItemProps: {
                      onClick: () => onRowOptionClick(option.action, rowId)
                    }
                  }))}
                />
              </div>
            )}
          </Box>
        </Box>

        {/* ✅ Card Body */}
        <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {displayCols.map((col, idx) => {
            const CellComponent = resolveCell(col, {
              onRowOptionClick,
              openDialog: openDialog as any,
              dictionary
            })
            const label = dictionary?.placeholders?.[col.header as string] || col.header

            return (
              <Box
                key={col.accessorKey}
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'start',
                  gap: 3,
                  py: 1.4,
                  borderBottom: idx < displayCols.length - 1 ? '1px dashed' : 'none',
                  borderColor: 'divider'
                }}
              >
                {/* Label */}
                <Typography
                  variant='caption'
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '10.5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    minWidth: 70
                  }}
                >
                  {label}
                </Typography>



                <Box sx={{ flexShrink: 0, maxWidth: '55%', textAlign: 'start' }}>
                  <CellComponent row={{ original: row }} getValue={() => row[col.accessorKey]} />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        p: 2,
        // ✅ Responsive grid
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(3, 1fr)'
        }
      }}
    >
      {data.map(row => (
        <SingleCard key={row[fetchKey] || row.id} row={row} />
      ))}
    </Box>
  )
}

export default DynamicCardView
