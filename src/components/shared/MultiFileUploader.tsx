'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { List, ListItem, Avatar, Button, IconButton, Typography, Box, LinearProgress, Chip } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getOperatorConfig } from '@/configs/environment'
import type { Locale } from '@/shared'

// ===== TYPES =====
export interface UploadedFile {
  id: number
  path: string
  name: string
  ext: string
  description: string // ✅ This identifies which field the file belongs to
  size?: number
  uploadProgress?: number
  error?: string
}

interface MultiFileUploaderProps {
  fieldName: string // ✅ Used as description to identify files
  label?: string
  fileableType?: string
  accessToken: string
  locale?: Locale
  typeAllowed?: string[]
  sizeAllowed?: number
  maxFiles?: number
  allFiles: UploadedFile[] // ✅ All files in the row (including other fields)
  onFilesChange: (allFiles: UploadedFile[]) => void // ✅ Returns ALL files
  disabled?: boolean
  dictionary?: any
}

// ===== COMPONENT =====
export const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({
  fieldName,
  label,
  fileableType = 'GENERAL',
  accessToken,
  locale = 'ar',
  typeAllowed = [],
  sizeAllowed = 5 * 1024 * 1024,
  maxFiles = 10,
  allFiles = [],
  onFilesChange,
  disabled = false,
  dictionary
}) => {
  const { apiUrl } = getOperatorConfig()

  // ✅ Filter files for THIS field only
  const currentFieldFiles = allFiles.filter(f => f.description === fieldName)

  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  // ===== FILE VALIDATION =====
  const validateFile = useCallback(
    (file: File): string | null => {
      if (typeAllowed.length > 0 && !typeAllowed.includes(file.type)) {
        return `نوع الملف غير مدعوم. الأنواع المسموح بها: ${typeAllowed.join(', ')}`
      }

      if (file.size > sizeAllowed) {
        return `حجم الملف ${file.name} يتجاوز الحد المسموح (${(sizeAllowed / 1024 / 1024).toFixed(2)} MB)`
      }

      // ✅ Check max files for THIS field only
      if (currentFieldFiles.length >= maxFiles) {
        return `الحد الأقصى للملفات في هذا الحقل هو ${maxFiles}`
      }

      return null
    },
    [typeAllowed, sizeAllowed, currentFieldFiles.length, maxFiles]
  )

  // ===== UPLOAD SINGLE FILE =====
  const uploadFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      const formData = new FormData()
      formData.append('files[0][file]', file)
      formData.append('files[0][description]', fieldName) // ✅ Set description to fieldName
      formData.append('fileable_type', fileableType)
      formData.append('is_granted', 'true')

      try {
        const tempId = `temp-${Date.now()}-${Math.random()}`
        setUploadProgress(prev => ({ ...prev, [tempId]: 0 }))

        const response = await axios.post(`${apiUrl}/def/archives`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': locale
          },
          onUploadProgress: progressEvent => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0
            setUploadProgress(prev => ({ ...prev, [tempId]: progress }))
          }
        })

        const uploadedFile = response?.data?.data?.[0]

        if (uploadedFile) {
          setUploadProgress(prev => {
            const updated = { ...prev }
            delete updated[tempId]
            return updated
          })

          return {
            id: uploadedFile.id,
            path: uploadedFile.path,
            name: uploadedFile.name,
            ext: uploadedFile.ext,
            description: fieldName, // ✅ Set description to fieldName
            size: file.size
          }
        }

        return null
      } catch (error: any) {
        console.error('Upload error:', error)
        setUploadProgress(prev => {
          const updated = { ...prev }
          const keys = Object.keys(prev).filter(k => k.startsWith('temp-'))
          if (keys.length > 0) delete updated[keys[keys.length - 1]]
          return updated
        })
        throw error
      }
    },
    [apiUrl, accessToken, locale, fieldName, fileableType]
  )

  // ===== HANDLE DROP =====
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return

      setUploading(true)

      const validFiles: File[] = []
      const errors: string[] = []

      acceptedFiles.forEach(file => {
        const error = validateFile(file)
        if (error) {
          errors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      if (errors.length > 0) {
        errors.forEach(err => toast.error(err))
      }

      const uploadPromises = validFiles.map(file => uploadFile(file))

      try {
        const results = await Promise.allSettled(uploadPromises)

        const successfulUploads: UploadedFile[] = []
        let failedCount = 0

        results.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            successfulUploads.push(result.value)
          } else {
            failedCount++
            toast.error(`فشل رفع الملف: ${validFiles[index].name}`)
          }
        })

        if (successfulUploads.length > 0) {
          // ✅ Merge with existing files from ALL fields
          const updatedAllFiles = [...allFiles, ...successfulUploads]
          onFilesChange(updatedAllFiles)
          toast.success(`تم رفع ${successfulUploads.length} ملف بنجاح`)
        }
      } catch (error) {
        toast.error('حدث خطأ أثناء رفع الملفات')
      } finally {
        setUploading(false)
      }
    },
    [allFiles, validateFile, uploadFile, onFilesChange, disabled]
  )

  // ===== DROPZONE CONFIG =====
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading,
    multiple: true,
    accept: typeAllowed.length > 0 ? typeAllowed.reduce((acc, type) => ({ ...acc, [type]: [] }), {}) : undefined
  })

  // ===== DELETE FILE =====
  const handleDeleteFile = useCallback(
    async (file: UploadedFile) => {
      if (disabled) return

      try {
        await axios.delete(`${apiUrl}/def/archives/${file.id}?is_granted=true`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': locale
          }
        })

        // ✅ Remove ONLY this file from ALL files
        const updatedAllFiles = allFiles.filter(f => f.id !== file.id)
        onFilesChange(updatedAllFiles)
        toast.success('تم حذف الملف بنجاح')
      } catch (error) {
        toast.error('فشل حذف الملف')
        console.error(error)
      }
    },
    [allFiles, apiUrl, accessToken, locale, onFilesChange, disabled]
  )

  // ===== REMOVE ALL FILES FOR THIS FIELD =====
  const handleRemoveAll = useCallback(async () => {
    if (disabled || currentFieldFiles.length === 0) return

    try {
      const deletePromises = currentFieldFiles.map(file =>
        axios.delete(`${apiUrl}/def/archives/${file.id}?is_granted=true`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Accept-Language': locale
          }
        })
      )

      await Promise.all(deletePromises)

      // ✅ Remove ALL files for THIS field, keep others
      const updatedAllFiles = allFiles.filter(f => f.description !== fieldName)
      onFilesChange(updatedAllFiles)
      toast.success('تم حذف جميع الملفات')
    } catch (error) {
      toast.error('فشل حذف بعض الملفات')
      console.error(error)
    }
  }, [currentFieldFiles, allFiles, apiUrl, accessToken, locale, onFilesChange, disabled, fieldName])

  // ===== DOWNLOAD FILE =====
  const handleDownload = useCallback((filePath: string) => {
    if (!filePath) {
      toast.error('لا يوجد ملف للتحميل')
      return
    }
    window.open(filePath, '_blank')
  }, [])

  // ===== RENDER FILE PREVIEW =====
  const renderFilePreview = useCallback((file: UploadedFile) => {
    const ext = file.ext?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return (
        <img width={38} height={38} alt={file.name} src={file.path} style={{ borderRadius: 4, objectFit: 'cover' }} />
      )
    }

    const iconMap: Record<string, string> = {
      pdf: 'ri-file-pdf-line',
      doc: 'ri-file-word-line',
      docx: 'ri-file-word-line',
      xls: 'ri-file-excel-line',
      xlsx: 'ri-file-excel-line',
      ppt: 'ri-file-ppt-line',
      pptx: 'ri-file-ppt-line',
      zip: 'ri-file-zip-line',
      rar: 'ri-file-zip-line'
    }

    const iconClass = iconMap[ext] || 'ri-file-text-line'

    return <i className={iconClass} style={{ fontSize: 24 }} />
  }, [])

  // ===== FORMAT FILE SIZE =====
  const formatFileSize = useCallback((bytes: number = 0) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }, [])

  // ===== RENDER =====
  return (
    <Box>
      {label && (
        <Typography variant='subtitle2' sx={{ mb: 1, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          p: 3,
          textAlign: 'center',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          opacity: disabled || uploading ? 0.6 : 1,
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: disabled || uploading ? 'divider' : 'primary.main',
            bgcolor: disabled || uploading ? 'background.paper' : 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} disabled={disabled || uploading} />

        <Avatar variant='rounded' sx={{ width: 48, height: 48, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
          <i className='ri-upload-2-line' style={{ fontSize: 24 }} />
        </Avatar>

        <Typography variant='h6' sx={{ mb: 1 }}>
          {isDragActive
            ? dictionary?.placeholders?.['drop_files_here'] || 'أفلت الملفات هنا'
            : dictionary?.placeholders?.['drop_or_click'] || 'اسحب الملفات أو انقر للرفع'}
        </Typography>

        <Typography variant='body2' color='text.secondary'>
          {dictionary?.placeholders?.['allowed_files'] || 'الملفات المسموح بها'}:{' '}
          {typeAllowed.length > 0 ? typeAllowed.join(', ') : dictionary?.placeholders?.['all_files'] || 'جميع الأنواع'}
        </Typography>

        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
          {dictionary?.placeholders?.['max_size'] || 'الحد الأقصى'}: {formatFileSize(sizeAllowed)} •{' '}
          {dictionary?.placeholders?.['max_files'] || 'عدد الملفات'}: {maxFiles}
        </Typography>
      </Box>

      {Object.keys(uploadProgress).length > 0 && (
        <Box sx={{ mt: 2 }}>
          {Object.entries(uploadProgress).map(([key, progress]) => (
            <Box key={key} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant='caption'>جاري الرفع...</Typography>
                <Typography variant='caption'>{progress}%</Typography>
              </Box>
              <LinearProgress variant='determinate' value={progress} />
            </Box>
          ))}
        </Box>
      )}

      {/* ✅ Show ONLY files for THIS field */}
      {currentFieldFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant='subtitle2' color='text.secondary'>
              {dictionary?.placeholders?.['uploaded_files'] || 'الملفات المرفوعة'} ({currentFieldFiles.length}/
              {maxFiles})
            </Typography>
            {!disabled && (
              <Button size='small' color='error' onClick={handleRemoveAll} disabled={uploading}>
                {dictionary?.actions?.['remove_all'] || 'حذف الكل'}
              </Button>
            )}
          </Box>

          <List
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 'var(--mui-shape-customBorderRadius-md)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {currentFieldFiles.map((file, index) => (
              <ListItem
                key={file.id}
                sx={{
                  borderBottom: index < currentFieldFiles.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'action.hover',
                      borderRadius: 'var(--mui-shape-customBorderRadius-md)'
                    }}
                  >
                    {renderFilePreview(file)}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant='body2' noWrap sx={{ fontWeight: 500 }}>
                      {file.name}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {formatFileSize(file.size)}
                    </Typography>
                  </Box>

                  <Chip label={file.ext?.toUpperCase() || 'FILE'} size='small' color='primary' variant='outlined' />

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size='small' onClick={() => handleDownload(file.path)} title='تحميل'>
                      <i className='ri-download-2-line' style={{ fontSize: 18 }} />
                    </IconButton>

                    {!disabled && (
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => handleDeleteFile(file)}
                        disabled={uploading}
                        title='حذف'
                      >
                        <i className='ri-delete-bin-line' style={{ fontSize: 18 }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}

export default MultiFileUploader
