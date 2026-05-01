import React, { useEffect, useState, useMemo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  IconButton,
  Divider
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { getRecordInformationAsset, Locale } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'

interface RecordInformationTypeData {
  action: number
  user: any
  date: string
  time: string
  deviceIpAddress: string
}

interface AuditUser {
  id: number
  personal_id: number
  full_name_ar: string
}

interface AuditFields {
  created_by: string
  created_at: string
  created_from: string
  creator: AuditUser
  updated_by: string | null
  updated_at: string | null
  updated_from: string | null
  updater: AuditUser | null
  deleted_by: string | null
  deleted_at: string | null
  deleted_from: string | null
  deleter: AuditUser | null
}

interface RecordInformationProps {
  recordInformations?: RecordInformationTypeData[]
  dataModel?: any
  open: boolean
  onClose: () => void
  locale?: any
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3),
  fontSize: '0.875rem'
}))

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  '& i': {
    fontSize: '1.25rem'
  }
}))

export const RecordInformation: React.FC<RecordInformationProps> = ({
  recordInformations = [],
  dataModel,
  open,
  onClose,
  locale = ''
}) => {
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  // Generate records from dataModel if provided
  const generatedRecords: RecordInformationTypeData[] = useMemo(() => {
    if (!dataModel?.audit_fields) return recordInformations

    const audit_fields = dataModel.audit_fields as AuditFields
    const records: RecordInformationTypeData[] = []

    // Add created record
    const createdDate = new Date(audit_fields.created_at)
    records.push({
      action: 1,
      user: audit_fields?.creator || null,
      date: createdDate.toLocaleDateString('en-CA'), // YYYY-MM-DD format
      time: createdDate.toLocaleTimeString('en-GB'), // HH:MM:SS format
      deviceIpAddress: audit_fields.created_from || ''
    })

    // Add updated record if exists
    if (audit_fields.updated_at && audit_fields.updater) {
      const updatedDate = new Date(audit_fields.updated_at)
      records.push({
        action: 2,
        user: audit_fields?.updater || null,
        date: updatedDate.toLocaleDateString('en-CA'),
        time: updatedDate.toLocaleTimeString('en-GB'),
        deviceIpAddress: audit_fields.updated_from || ''
      })
    }

    // Add deleted record if exists
    if (audit_fields.deleted_at && audit_fields.deleter) {
      const deletedDate = new Date(audit_fields.deleted_at)
      records.push({
        action: 3,
        user: audit_fields?.deleter || null,
        date: deletedDate.toLocaleDateString('en-CA'),
        time: deletedDate.toLocaleTimeString('en-GB'),
        deviceIpAddress: audit_fields.deleted_from || ''
      })
    }

    return records
  }, [dataModel, recordInformations])

  const displayRecords = dataModel ? generatedRecords : recordInformations

  if (!dictionary) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          boxShadow: 'var(--mui-customShadows-xl)'
        }
      }}
    >
      <DialogTitle
        sx={{
          p: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant='h6'>{dictionary?.actions?.record?.['information'] || 'معلومات السجل'}</Typography>
        <IconButton size='small' onClick={onClose} sx={{ color: 'text.secondary' }}>
          <i className='ri-close-line' />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'var(--mui-palette-action-hover)' }}>
                <StyledTableCell sx={{ color: 'text.primary' }}>
                  {dictionary?.placeholders?.['list'] || 'قائمة'}
                </StyledTableCell>
                <StyledTableCell sx={{ color: 'text.primary' }}>
                  {dictionary?.placeholders?.['user_name'] || 'اسم المستخدم'}
                </StyledTableCell>
                <StyledTableCell sx={{ color: 'text.primary' }}>
                  {dictionary?.placeholders?.['process_date_time'] || 'تاريخ و وقت العملية'}
                </StyledTableCell>
                <StyledTableCell sx={{ color: 'text.primary' }}>
                  {dictionary?.placeholders?.['device_ip'] || 'عنوان الجهاز (IP)'}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayRecords.length ? (
                displayRecords.map((record, index) => {
                  const asset = getRecordInformationAsset(record.action)
                  return (
                    <TableRow key={index} hover>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconWrapper
                            sx={{
                              bgcolor: alpha(asset.color, 0.1),
                              color: asset.color
                            }}
                          >
                            <i className={asset.icon} />
                          </IconWrapper>
                          <Typography variant='body2'>{asset.label}</Typography>
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography variant='body2' color='text.primary'>
                          {`(${record.user?.id}) ${record.user?.full_name_ar}`}
                        </Typography>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'text.secondary',
                              bgcolor: 'action.selected',
                              px: 2,
                              py: 0.5,
                              borderRadius: '4px',
                              gap: 1
                            }}
                          >
                            <i className='ri-calendar-line' style={{ fontSize: '1rem' }} />
                            <Typography variant='caption'>{record.date}</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'text.secondary',
                              bgcolor: 'action.selected',
                              px: 2,
                              py: 0.5,
                              borderRadius: '4px',
                              gap: 1
                            }}
                          >
                            <i className='ri-time-line' style={{ fontSize: '1rem' }} />
                            <Typography variant='caption'>{record.time}</Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>

                      <StyledTableCell>
                        <Typography
                          variant='caption'
                          sx={{
                            fontFamily: 'monospace',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            color: 'text.secondary'
                          }}
                        >
                          {record.deviceIpAddress}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={4} align='center' sx={{ py: 10 }}>
                    <Box sx={{ color: 'text.disabled', textAlign: 'center' }}>
                      <i className='ri-database-2-line' style={{ fontSize: '3rem', opacity: 0.3 }} />
                      <Typography sx={{ mt: 2 }}>
                        {dictionary?.messages?.['there_is_no_records'] || 'لا توجد سجلات'}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default RecordInformation
