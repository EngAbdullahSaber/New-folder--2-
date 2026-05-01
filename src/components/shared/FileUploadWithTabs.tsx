'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Tabs,
  Tab,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Badge,
  TextField,
  Grid,
  TableContainer,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material'
import axios from 'axios'
import { getDictionary } from '@/utils/getDictionary'
import { Locale, toast, useSessionHandler } from '@/shared'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import Swal from 'sweetalert2'
import CustomAvatar from '@/@core/components/mui/Avatar'
import classNames from 'classnames'
import { getOperatorConfig } from '@/configs/environment'
import { useSettings } from '@/@core/hooks/useSettings'
import tableStyles from '@core/styles/table.module.css'
import CustomIconBtn from './CustomIconButton'
import CustomTooltipButton from './CustomTooltipButton'

interface Archive {
  id: number
  path: string
  ext: string
  description: string
  name: string
}

interface AttachmentCategory {
  id: number
  name: string
  archives: Archive[]
  accept_extensions?: string | null
  order_no?: string
}

interface ScreenAttachmentCategory {
  id: number
  attachment_cat_desc: string
  accept_extensions: string | null
  created_at: string
  info_json: any
  order_no: string
}

interface FileUploadWithTabsProps {
  attachments: AttachmentCategory[]
  open: boolean
  onClose: () => void
  locale?: any
  onUploadSuccess?: () => void
  onDeleteSuccess?: () => void
  recordId: any
}

export const FileUploadWithTabs: React.FC<FileUploadWithTabsProps> = ({
  attachments = [],
  open,
  onClose,
  locale = 'ar',
  onUploadSuccess,
  onDeleteSuccess,
  recordId
}) => {
  const [selectedType, setSelectedType] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('')
  const [newFile, setNewFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [dictionary, setDictionary] = useState<any>(null)
  const { accessToken } = useSessionHandler()
  const { screenData, canAddArchive, canDeleteArchive, canOpenArchive } = useScreenPermissions('show')
  const { apiUrl } = getOperatorConfig()
  const { settings } = useSettings()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const hasInitialized = useRef(false)
  const prevAttachmentsRef = useRef<string>('')

  useEffect(() => {
    getDictionary(locale).then(setDictionary)
  }, [locale])

  useEffect(() => {
    if (activeTab) setSelectedType(activeTab)
  }, [activeTab])

  useEffect(() => {
    setShowForm(false)
    setNewFile(null)
    setDescription('')
  }, [activeTab])

  const mergedCategories = useMemo(() => {
    const screenCategories: ScreenAttachmentCategory[] = screenData?.attachment_categories || []
    return screenCategories.map((screenCat: ScreenAttachmentCategory) => {
      const matchingAttachment = attachments.find(att => att.id === screenCat.id)
      return {
        id: screenCat.id,
        name: screenCat.attachment_cat_desc,
        accept_extensions: screenCat.accept_extensions,
        order_no: screenCat.order_no,
        archives: matchingAttachment?.archives || []
      }
    })
  }, [screenData?.attachment_categories, attachments])

  const [localAttachments, setLocalAttachments] = useState<AttachmentCategory[]>([])

  useEffect(() => {
    if (open && !hasInitialized.current) {
      setLocalAttachments(mergedCategories)
      if (mergedCategories.length > 0) {
        setActiveTab(String(mergedCategories[0].id))
        setSelectedType(String(mergedCategories[0].id))
      }
      hasInitialized.current = true
      prevAttachmentsRef.current = JSON.stringify(attachments)
    }
    if (!open) {
      hasInitialized.current = false
      prevAttachmentsRef.current = ''
    }
  }, [open, mergedCategories, attachments])

  useEffect(() => {
    if (!open || !hasInitialized.current) return
    const currentAttachmentsString = JSON.stringify(attachments)
    if (currentAttachmentsString !== prevAttachmentsRef.current) {
      prevAttachmentsRef.current = currentAttachmentsString
      setLocalAttachments(prev =>
        prev.map(cat => {
          const matchingAttachment = attachments.find(att => att.id === cat.id)
          if (matchingAttachment) return { ...cat, archives: matchingAttachment.archives }
          return cat
        })
      )
    }
  }, [attachments, open])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setNewFile(event.target.files[0])
    }
  }

  const handleUploadFile = async () => {
    if (!newFile || !description || !selectedType) {
      toast.error(dictionary?.messages?.fill_all_fields || 'Please fill all fields')
      return
    }
    const formData = new FormData()
    formData.append('fileable_type', screenData?.fileable_type)
    formData.append('fileable_id', recordId)
    formData.append('files[0][file]', newFile)
    formData.append('files[0][attachment_category_id]', selectedType)
    formData.append('files[0][description]', description)

    try {
      const response = await axios.post(`${apiUrl}/def/archives`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': (locale as Locale) || 'ar'
        }
      })
      setLocalAttachments(prev =>
        prev.map(cat => {
          if (cat.id.toString() === selectedType) {
            return { ...cat, archives: [...cat.archives, response.data.data[0]] }
          }
          return cat
        })
      )
      setNewFile(null)
      setDescription('')
      setShowForm(false)
      onUploadSuccess?.()
      toast.success(dictionary?.messages?.upload_success || 'File uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(dictionary?.messages?.upload_error || 'Error uploading file')
    }
  }

  const handleDeleteFile = async (fileId: number) => {
    const result = await Swal.fire({
      title: dictionary?.messages?.confirm_delete || 'Are you sure you want to delete this file?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: dictionary?.actions?.delete || 'حذف',
      cancelButtonText: dictionary?.actions?.cancel || 'إلغاء',
      backdrop: true,
      allowOutsideClick: false,
      customClass: { container: 'swal-over-modal' },
      theme: settings.mode == 'dark' ? 'dark' : 'light'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/def/archives/${fileId}`, {
          headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': (locale as Locale) || 'ar' }
        })
        setLocalAttachments(prev =>
          prev.map(cat => ({
            ...cat,
            archives: cat.archives.filter(archive => archive.id !== fileId)
          }))
        )
        onDeleteSuccess?.()

        Swal.fire({
          title: dictionary?.messages?.delete_success || 'Deleted successfully',
          icon: 'success',
          confirmButtonText: 'تأكيد'
        })

        toast.success(dictionary?.messages?.delete_success || 'File deleted successfully')
      } catch (error) {
        console.error('Delete error:', error)
        toast.error(dictionary?.messages?.delete_error || 'Error deleting file')
      }
    }
  }

  const handleDownloadFile = async (name: string) => {
    try {
      const resp = await axios.get(`${apiUrl}/def/archives/download?file=${name}`, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Accept-Language': (locale as Locale) || 'ar' },
        responseType: 'blob'
      })
      const fileURL = window.URL.createObjectURL(new Blob([resp.data]))
      const link = document.createElement('a')
      link.href = fileURL
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(fileURL)
    } catch (error) {
      console.error('Error downloading file:', error)
      toast.error(dictionary?.messages?.download_error || 'Error downloading file')
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setNewFile(null)
    setDescription('')
    onClose()
  }

  const categories = localAttachments.map(cat => ({
    value: String(cat.id),
    label: cat.name
  }))

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='xl'
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          height: isMobile ? '100%' : '90vh',
          maxHeight: isMobile ? '100%' : '90vh'
        }
      }}
    >
      {/* ── Dialog Title ── matches system pattern (Avatar + title + close) */}
      <DialogTitle sx={{ pb: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' color={'primary'} size={30}>
              <i className={classNames('ri-folder-2-line', 'text-lg')} />
            </CustomAvatar>
            <Typography className='mx-2' variant='h6'>
              {dictionary?.titles?.archives || 'المرفقات'}
            </Typography>
          </div>
          <IconButton onClick={handleClose} size='small'>
            <i className='ri-close-line' />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 5 }}>

        {/* ── Permission / empty state messages ── */}
        {localAttachments.length === 0 && (
          <Typography textAlign='center' my={4} color='text.secondary'>
            {dictionary?.messages?.add_categories_first ||
              'No attachment categories available. Please configure categories first.'}
          </Typography>
        )}

        {!canOpenArchive && (
          <Typography textAlign='center' my={4} color='text.secondary'>
            {dictionary?.messages?.you_do_not_have_permission_to_show_attachments ||
              'You do not have permission to view attachments.'}
          </Typography>
        )}

        {/* ── Add button ── */}
        {!showForm && localAttachments.length > 0 && canAddArchive && (
          <Box display='flex' justifyContent='flex-end' mb={4}>
            <CustomTooltipButton title={dictionary?.actions?.add || 'Add'} arrow>
              <CustomIconBtn
                customColor='rgb(114 225 40)'
                variant='outlined'
                size='small'
                onClick={() => {
                  setSelectedType(activeTab)
                  setShowForm(true)
                }}
              >
                <i className='ri-add-line' />
              </CustomIconBtn>
            </CustomTooltipButton>
          </Box>
        )}

        {/* ── Upload form ── */}
        {showForm && (
          <Box
            sx={{
              mb: 4,
              p: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 'var(--mui-shape-customBorderRadius-md)',
              bgcolor: 'background.default'
            }}
          >
            {/* Section header matching system style */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CustomAvatar skin='light' color='primary' size={28}>
                <i className='ri-upload-2-line' style={{ fontSize: '1rem' }} />
              </CustomAvatar>
              <Typography className='mx-2' variant='h6' sx={{ fontWeight: 600 }}>
                {dictionary?.actions?.archive?.archive_document || 'رفع ملف'}
              </Typography>
            </Box>

            <Grid container spacing={3} alignItems='flex-start'>
              {/* Category (disabled – context from active tab) */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>{dictionary?.placeholders?.category || 'Category'}</InputLabel>
                  <Select
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value)}
                    label={dictionary?.placeholders?.category || 'Category'}
                    disabled
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  size='small'
                  label={dictionary?.placeholders?.description_ar || 'Description'}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </Grid>

              {/* File picker */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Button
                  component='label'
                  variant='outlined'
                  color='primary'
                  size='small'
                  fullWidth
                  startIcon={<i className='ri-upload-cloud-2-line' />}
                  sx={{ height: '38px' }}
                >
                  {dictionary?.actions?.archive?.choose_document || 'Choose File'}
                  <input type='file' hidden onChange={handleFileSelect} />
                </Button>
                {newFile && (
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ display: 'block', mt: 0.5, textAlign: 'center' }}
                    noWrap
                  >
                    {newFile.name}
                  </Typography>
                )}
              </Grid>

              {/* Submit */}
              <Grid size={{ xs: 12, sm: 3 }}>
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  size='small'
                  onClick={handleUploadFile}
                  disabled={!newFile || !description || !selectedType}
                  startIcon={<i className='ri-check-line' />}
                  sx={{ height: '38px' }}
                >
                  {dictionary?.actions?.archive?.archive_document || 'Upload'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ── Tabs + Table ── */}
        {localAttachments.length > 0 && (
          <>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant='scrollable'
              scrollButtons='auto'
              sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 0 }}
            >
              {localAttachments.map(cat => (
                <Tab
                  key={cat.id}
                  value={String(cat.id)}
                  label={
                    <Badge
                      badgeContent={cat.archives.length}
                      color='primary'
                      sx={{
                        '& .MuiBadge-badge': {
                          position: 'absolute',
                          top: 3,
                          left: '100%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '0.75rem'
                        }
                      }}
                    >
                      <span className='px-2'>{cat.name}</span>
                    </Badge>
                  }
                />
              ))}
            </Tabs>

            {localAttachments.map(cat => (
              <div key={cat.id} hidden={activeTab !== String(cat.id)}>
                <TableContainer>
                  <Table className={tableStyles.table}>
                    <TableHead>
                      <tr>
                        <th style={{ width: '5%' }} className='text-center'>
                          {dictionary?.placeholders?.index || '#'}
                        </th>
                        <th style={{ width: '55%' }} className='text-start'>
                          {dictionary?.placeholders?.description || 'الوصف'}
                        </th>
                        <th style={{ width: '15%' }} className='text-center'>
                          {dictionary?.placeholders?.type || 'النوع'}
                        </th>
                        <th style={{ width: '25%' }} className='text-center'>
                          {dictionary?.actions?.options || 'خيارات'}
                        </th>
                      </tr>
                    </TableHead>
                    <TableBody>
                      {cat.archives.length > 0 ? (
                        cat.archives.map((archive, index) => (
                          <tr key={archive.id}>
                            <td className='text-center'>{index + 1}</td>
                            <td>{archive.description}</td>
                            <td className='text-center'>
                              <Chip
                                label={archive.ext?.toUpperCase() || 'FILE'}
                                size='small'
                                variant='tonal'
                                color='primary'
                              />
                            </td>
                            <td className='text-center'>
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                {canOpenArchive && (
                                  <CustomTooltipButton title={dictionary?.actions?.view || 'عرض'} arrow>
                                    <CustomIconBtn
                                      size='small'
                                      variant='outlined'
                                      customColor='rgb(38 198 249)'
                                      onClick={() => window.open(archive.path, '_blank')}
                                    >
                                      <i className='ri-eye-line' />
                                    </CustomIconBtn>
                                  </CustomTooltipButton>
                                )}
                                {canOpenArchive && (
                                  <CustomTooltipButton title={dictionary?.actions?.download || 'تحميل'} arrow>
                                    <CustomIconBtn
                                      size='small'
                                      variant='outlined'
                                      customColor='rgb(102 108 255)'
                                      onClick={() => handleDownloadFile(archive.name)}
                                    >
                                      <i className='ri-download-2-line' />
                                    </CustomIconBtn>
                                  </CustomTooltipButton>
                                )}
                                {canDeleteArchive && (
                                  <CustomTooltipButton title={dictionary?.actions?.delete || 'حذف'} arrow>
                                    <CustomIconBtn
                                      size='small'
                                      variant='outlined'
                                      customColor='rgb(255 76 81)'
                                      onClick={() => handleDeleteFile(archive.id)}
                                    >
                                      <i className='ri-delete-bin-line' />
                                    </CustomIconBtn>
                                  </CustomTooltipButton>
                                )}
                              </Box>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className='text-center py-6'>
                            <Typography color='text.secondary' variant='body2'>
                              {dictionary?.messages?.no_files_in_this_category || 'لا توجد ملفات في هذا التصنيف'}
                            </Typography>
                          </td>
                        </tr>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            ))}
          </>
        )}
      </DialogContent>

      {/* ── Dialog Actions ── */}
      <DialogActions sx={{ px: 5, py: 3 }}>
        <Button onClick={handleClose} color='inherit'>
          {dictionary?.actions?.close || 'إغلاق'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
