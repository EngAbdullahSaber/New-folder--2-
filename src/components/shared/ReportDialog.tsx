'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Paper,
  CircularProgress,
  Stack,
  IconButton,
  Chip
} from '@mui/material'
import { toast } from 'react-toastify'
import { useDialog } from '@/contexts/dialogContext'
import { useSessionHandler } from '@/shared'
import axios from 'axios'
import { getOperatorConfig } from '@/configs/environment'

interface ReportDialogProps {
  open: boolean
  model: string
  columns: { accessorKey: string; header: string | React.ReactNode; reportExclude?: boolean }[]
  dictionary: any
  locale: string
  filters?: any[]
  onClose?: () => void
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  model,
  columns,
  dictionary,
  locale,
  filters = [],
  onClose
}) => {
  const { closeDialog } = useDialog()
  const { accessToken } = useSessionHandler()
  const { apiUrl } = getOperatorConfig()

  const handleClose = onClose || closeDialog
  
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf')
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [limit, setLimit] = useState<number | 'all'>(500)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setExportType('pdf')
      setOrientation('portrait')
      setLimit(500)
      setSelectedColumns(
        columns
          .filter(
            col =>
              col.accessorKey &&
              col.accessorKey !== 'select' &&
              col.accessorKey !== 'options' &&
              col.reportExclude !== true
          )
          .map(col => col.accessorKey)
      )
      setLoading(false)
    }
  }, [open, columns])

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey) ? prev.filter(key => key !== columnKey) : [...prev, columnKey]
    )
  }

  const handleSelectAll = () => {
    const availableColumns = columns
      .filter(col => col.accessorKey !== 'options' && col.accessorKey !== 'select' && col.reportExclude !== true)
      .map(col => col.accessorKey)
    
    if (selectedColumns.length === availableColumns.length) {
      setSelectedColumns([])
    } else {
      setSelectedColumns(availableColumns)
    }
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const payload = {
        model,
        columns: selectedColumns,
        filters,
        export: exportType,
        orientation: exportType === 'pdf' ? orientation : undefined,
        limit: limit === 'all' ? '*' : limit
      }

      const response = await axios.post(`${apiUrl}/reports/generate`, payload, {
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${model}_${new Date().getTime()}.${exportType === 'pdf' ? 'pdf' : 'xlsx'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(dictionary?.messages?.report_generated || 'تم إنشاء التقرير بنجاح')
      handleClose()
    } catch (error) {
      console.error('Report generation failed:', error)
      toast.error(dictionary?.messages?.report_failed || 'فشل إنشاء التقرير')
    } finally {
      setLoading(false)
    }
  }

  const availableColumns = columns.filter(
    col => col.accessorKey !== 'options' && col.accessorKey !== 'select' && col.reportExclude !== true
  )

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 'var(--mui-shape-customBorderRadius-lg)',
          bgcolor: 'background.paper',
          backgroundImage: 'none',
        }
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 4,
           display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box>
          <Typography variant='h6' sx={{  fontSize: '1.125rem', mb: 0.8 }}>
            {dictionary?.titles?.generate_report || 'إنشاء تقرير'}
          </Typography>
         
        </Box>
        <IconButton
          onClick={handleClose}
          size='small'
          sx={{
            color: 'text.secondary',
          }}
        >
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* Section 1: Export Configuration */}
          <Box>
            <Typography
              variant='subtitle2'
              sx={{
                 mb: 2,
                color: 'text.primary'
              }}
            >
              {dictionary?.sections?.export_config || 'تفاصيل التقرير'}
            </Typography>

          <Stack 
  direction="row" 
  spacing={3} 
  sx={{ 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }}
>
  {/* Export Type */}
  <Box sx={{ flex: 1, maxWidth: '300px',height:100 }}>
    <Typography
      variant="body2"
      sx={{
         mb: 1.5,
        color: 'text.secondary',
        textAlign: 'start'
      }}
    >
      {dictionary?.placeholders?.report_format || 'صيغة التقرير'}
    </Typography>
    <Stack direction="row" spacing={0} sx={{ width: '100%', height:45 }}>
      <Button
        variant={exportType === 'pdf' ? 'contained' : 'outlined'}
        onClick={() => setExportType('pdf')}
        startIcon={<i className="ri-file-pdf-line" />}
        sx={{
          flex: 1,
          py: 1.5,
          textTransform: 'none',
          borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderBottomLeftRadius: 'var(--mui-shape-customBorderRadius-md)',
          borderRight: exportType === 'pdf' ? 'none' : '1px solid',
          ...(exportType === 'pdf' && {
           })
        }}
      >
        PDF
      </Button>
      <Button
        variant={exportType === 'excel' ? 'contained' : 'outlined'}
        onClick={() => setExportType('excel')}
        startIcon={<i className="ri-file-excel-2-line" />}
        sx={{
          flex: 1,
          py: 1.5,
          textTransform: 'none',
         borderTopRightRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderBottomRightRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          borderLeft: exportType === 'excel' ? 'none' : '1px solid',
          marginLeft: '-1px',
          ...(exportType === 'excel' && {
           })
        }}
      >
        Excel
      </Button>
    </Stack>
    <Typography
      variant="caption"
      sx={{
        mt: 1,
        color: 'text.secondary',
        display: 'block',
        textAlign: 'start',
        fontSize: '0.65rem'
      }}
    >
      اختر صيغة الملف التى ترغب فى تنزيلها
    </Typography>
  </Box>

  {/* Orientation - Only for PDF */}
  {exportType === 'pdf' && (
    <Box sx={{ flex: 1, maxWidth: '300px' ,height:100 }}>
      <Typography
        variant="body2"
        sx={{
           mb: 1.5,
          color: 'text.secondary',
          textAlign: 'start'
        }}
      >
        {dictionary?.placeholders?.page_orientation || 'اتجاه الصفحة'}
      </Typography>
      <Stack direction="row" spacing={0} sx={{ width: '100%', height:45 }}>
        <Button
          variant={orientation === 'portrait' ? 'contained' : 'outlined'}
          onClick={() => setOrientation('portrait')}
          startIcon={<i className="ri-smartphone-line" />}
          sx={{
            flex: 1,
            py: 1.5,
            textTransform: 'none',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderBottomLeftRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderRight: orientation === 'portrait' ? 'none' : '1px solid',
            ...(orientation === 'portrait' && {
             })
          }}
        >
          {dictionary?.options?.portrait || 'عمودي'}
        </Button>
        <Button
          variant={orientation === 'landscape' ? 'contained' : 'outlined'}
          onClick={() => setOrientation('landscape')}
          startIcon={
            <i 
              className="ri-tablet-line" 
              style={{ 
                transform: 'rotate(90deg)',
                display: 'inline-block'
              }} 
            />
          }
          sx={{
            flex: 1,
            py: 1.5,
            textTransform: 'none',
             borderTopRightRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderBottomRightRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderLeft: orientation === 'landscape' ? 'none' : '1px solid',
            marginLeft: '-1px',
            ...(orientation === 'landscape' && {
             })
          }}
        >
          {dictionary?.options?.landscape || 'أفقي'}
        </Button>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          mt: 1,
          color: 'text.secondary',
          display: 'block',
          textAlign: 'start',
        fontSize: '0.65rem'
        }}
      >
        يظهر هذا لخيار فقط عند انشاء تقارير
      </Typography>
    </Box>
  )}

  {/* Export Range */}
  <Box sx={{ flex: 1, maxWidth: '300px',height:100 }}>
    <Typography
      variant="body2"
      sx={{
         mb: 1.5,
        color: 'text.secondary',
        textAlign: 'start'
      }}
    >
      {dictionary?.placeholders?.export_range || 'نطاق التصدير'}
    </Typography>
  
    <Stack direction="row" spacing={0} sx={{ width: '100%', height: 45 }}>
      <Button
        variant={limit === 500 ? 'contained' : 'outlined'}
        onClick={() => setLimit(500)}
        startIcon={<i className="ri-list-check" />}
        sx={{
          flex: 1,
          py: 1.5,
          textTransform: 'none',
          borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderBottomLeftRadius: 'var(--mui-shape-customBorderRadius-md)',
          borderRight: limit === 500 ? 'none' : '1px solid',
          ...(limit === 500 && {
           })
        }}
      >
        {dictionary?.options?.limited || '500 سجل'}
      </Button>
      <Button
        variant={limit === 'all' ? 'contained' : 'outlined'}
        onClick={() => setLimit('all')}
        startIcon={<i className="ri-stack-line" />}
        sx={{
          flex: 1,
          py: 1.5,
          textTransform: 'none',
        borderTopRightRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderBottomRightRadius: 'var(--mui-shape-customBorderRadius-md)',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          borderLeft: limit === 'all' ? 'none' : '1px solid',
          marginLeft: '-1px',
          ...(limit === 'all' && {
           })
        }}
      >
        {dictionary?.options?.all || 'جميع السجلات'}
      </Button>
    </Stack>
  
    <Typography
      variant="caption"
      sx={{
        mt: 1,
        color: 'text.secondary',
        display: 'block',
        textAlign: 'start',
        fontSize: '0.65rem'
      }}
    >
      اختر ما اذا كنت تريد تصدير الدفعة المحددة فقط او جميع السجلات المطابقة
    </Typography>
  </Box>
</Stack>
          </Box>

          {/* Section 2: Column Selection */}
          <Box>
            <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
              <Typography
                variant='subtitle2'
                sx={{
                  color: 'text.primary'
                }}
              >
                {dictionary?.placeholders?.select_columns || 'الأعمدة التي ترغب في تضمينها داخل التقرير'}
              </Typography>
              <Stack direction='row' spacing={1} alignItems='center'>
                
                <Button
                  size='small'
                  onClick={handleSelectAll}
                  sx={{
                    textTransform: 'none',
                     minWidth: 'auto'
                  }}
                >
                  {selectedColumns.length === availableColumns.length
                    ? dictionary?.actions?.deselect_all || 'إلغاء تحديد الكل'
                    : dictionary?.actions?.select_all || 'تحديد الكل'}
                </Button>
              </Stack>
            </Stack>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                maxHeight: 320,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: 6
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'divider',
                  borderRadius: 1.2
                }
              }}
            >
              <Grid container spacing={1.5}>
                {availableColumns.map(col => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={col.accessorKey}>
                    <Paper
                      elevation={0}
                      onClick={() => handleColumnToggle(col.accessorKey)}
                      sx={{
                        p: 1.5,
                        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
                        border: '1px solid',
                        borderColor: selectedColumns.includes(col.accessorKey)
                          ? 'primary.main'
                          : 'divider',
                        bgcolor: selectedColumns.includes(col.accessorKey)
                          ? 'primary.lightOpacity'
                          : 'background.paper',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          }
                      }}
                    >
                      <FormControlLabel
                        onClick={e => e.stopPropagation()}
                        control={
                          <Checkbox
                            checked={selectedColumns.includes(col.accessorKey)}
                            onChange={() => handleColumnToggle(col.accessorKey)}
                            size='small'
                            sx={{ p: 0, mr: 1 }}
                          />
                        }
                        label={
                          <Typography
                            variant='body2'
                            sx={{
                               fontSize: '0.875rem'
                            }}
                          >
                            {typeof col.header === 'string'
                              ? dictionary?.placeholders?.[col.header] || col.header
                              : col.header}
                          </Typography>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          p: 3,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          justifyContent: 'space-between',
          gap: 1.5
        }}
      >  <Button
          onClick={handleGenerate}
          variant='contained'
          disabled={loading || selectedColumns.length === 0}
          startIcon={
            loading ? (
              <CircularProgress size={16} thickness={4} sx={{ color: 'inherit' }} />
            ) : (
              <i className='ri-download-2-line' />
            )
          }
          sx={{
            px: 3,
                      mt: 3,

            py: 2,
            textTransform: 'none',
             borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            
          }}
        >
          {loading
            ? dictionary?.actions?.generating || 'جاري الإنشاء...'
            : dictionary?.actions?.generate || 'إنشاء تقرير'}
        </Button>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant='outlined'
          sx={{
            px: 3,
            py: 2,                      mt:3,

            textTransform: 'none',
             borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          }}
        >
          {dictionary?.actions?.cancel || 'إلغاء'}
        </Button>
      
      </DialogActions>
    </Dialog>
  )
}

export default ReportDialog
