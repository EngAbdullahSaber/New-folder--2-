// hooks/useFileUploadTable.ts
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getOperatorConfig } from '@/configs/environment'

interface UseFileUploadTableProps {
  name: string
  accessToken: string
  rowIndex: number
  updateRow: (rowIndex: number, fieldName: string, value: any) => void
  typeAllowed?: string[]
  sizeAllowed?: number
  fileableType?: string
}

export const useFileUploadTable = ({
  name,
  accessToken,
  rowIndex,
  updateRow,
  typeAllowed = [],
  sizeAllowed,
  fileableType = 'GENERAL'
}: UseFileUploadTableProps) => {
  const [uploading, setUploading] = useState(false)
  const { apiUrl } = getOperatorConfig()
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    // Validation
    if (typeAllowed.length && !typeAllowed.includes(selectedFile.type)) {
      toast.error(`نوع الملف غير مدعوم! الأنواع المسموح بها: ${typeAllowed.join(', ')}`)
      return
    }

    if (sizeAllowed && selectedFile.size > sizeAllowed) {
      toast.error(`حجم الملف يتجاوز الحد المسموح به (${(sizeAllowed / 1024 / 1024).toFixed(2)} MB)`)
      return
    }

    setUploading(true)

    const formData = new FormData()
    formData.append('files[0][file]', selectedFile)
    formData.append('files[0][description]', name)
    formData.append('fileable_type', fileableType)

    try {
      const response = await axios.post(`${apiUrl}/def/archives`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      })

      const uploadedFile = response?.data?.data?.[0]
      if (uploadedFile) {
        // Update row with file data
        updateRow(rowIndex, 'files', [
          {
            id: uploadedFile.id,
            path: uploadedFile.path,
            name: uploadedFile.name,
            ext: uploadedFile.ext,
            description: name
          }
        ])
        toast.success('تم رفع الملف بنجاح')
      }
    } catch (error) {
      toast.error('فشل رفع الملف')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileDelete = async (fileId: number) => {
    try {
      await axios.delete(`${apiUrl}/def/archives/${fileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      // Clear file from row
      updateRow(rowIndex, 'files', [])
      toast.success('تم حذف الملف بنجاح')
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الملف')
      console.error(error)
    }
  }

  const handleFileDownload = (filePath: string) => {
    if (!filePath) {
      toast.error('لا يوجد ملف للتحميل')
      return
    }
    window.open(filePath, '_blank')
  }

  return { handleFileUpload, handleFileDelete, handleFileDownload, uploading }
}
