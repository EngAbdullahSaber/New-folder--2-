import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { getOperatorConfig } from '@/configs/environment'

interface UseFileUploadProps {
  name: string
  accessToken: string
  getValues: any
  setValue: any
  multiple?: boolean
  typeAllowed?: string[]
  sizeAllowed?: number
  fileableType?: string
}

export const useFileUpload = ({
  name,
  accessToken,
  getValues,
  setValue,
  multiple = false,
  typeAllowed = [],
  sizeAllowed,
  fileableType = 'GENERAL'
}: UseFileUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<any[]>([]) // store File + API id info
  const [fileNames, setFileNames] = useState<string[]>([])
  const { apiUrl } = getOperatorConfig()

  // Upload handler
  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>, callback?: (value: any) => void) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : []
    if (!selectedFiles.length) return

    const validFiles: File[] = []

    selectedFiles.forEach(file => {
      if (typeAllowed.length && !typeAllowed.includes(file.type)) {
        toast.error(`نوع الملف غير مدعوم! الأنواع المسموح بها: ${typeAllowed.join(', ')}`)
        return
      }
      if (sizeAllowed && file.size > sizeAllowed) {
        toast.error(`حجم الملف يتجاوز الحد المسموح به (${(sizeAllowed / 1024 / 1024).toFixed(2)} MB)`)
        return
      }
      validFiles.push(file)
    })

    if (!validFiles.length) return

    const newPreviews = await Promise.all(
      validFiles.map(
        file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
      )
    )

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles
    const updatedPreviews = multiple ? [...previews, ...newPreviews] : newPreviews
    const updatedNames = validFiles.map(f => f.name)

    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    setFileNames(multiple ? [...fileNames, ...updatedNames] : updatedNames)

    // API upload
    const formData = new FormData()
    updatedFiles.forEach((file, index) => {
      formData.append(`files[${index}][file]`, file)
      formData.append(`files[${index}][description]`, name)
    })
    formData.append('fileable_type', fileableType)

    try {
      const response = await axios.post(`${apiUrl}/def/archives`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const res = response?.data?.data || []
      const filesList = getValues('files') || []

      res.forEach((f: any) => {
        const index = filesList.findIndex((file: any) => file.description === name)
        if (index !== -1) {
          filesList[index] = { id: f.id, path: f.path }
        } else {
          filesList.push({ id: f.id, description: name, path: f.path })
        }
      })

      setValue('files', filesList)
      callback?.(filesList)
      toast.success('تم رفع الملفات بنجاح')
    } catch (error) {
      toast.error('فشل رفع الملفات')
      console.error(error)
    }
  }

  // Delete handler
  const deleteFile = async (index: number, callback?: (value: any) => void) => {
    const fileId = files[index]?.id
    if (!fileId) {
      // Remove local files if no API id yet
      const updatedFiles = files.filter((_, i) => i !== index)
      const updatedPreviews = previews.filter((_, i) => i !== index)
      const updatedNames = fileNames.filter((_, i) => i !== index)
      const updatedValues = multiple ? updatedPreviews : updatedPreviews[0] || null

      setFiles(updatedFiles)
      setPreviews(updatedPreviews)
      setFileNames(updatedNames)
      setValue(name, updatedValues)
      callback?.(updatedValues)
      return
    }

    try {
      await axios.delete(`${apiUrl}/def/archives/${fileId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      const filesList = getValues('files')?.filter((f: any) => f.id !== fileId) || []

      const updatedFiles = files.filter((_, i) => i !== index)
      const updatedPreviews = previews.filter((_, i) => i !== index)
      const updatedNames = fileNames.filter((_, i) => i !== index)

      setFiles(updatedFiles)
      setPreviews(updatedPreviews)
      setFileNames(updatedNames)
      setValue('files', filesList)
      setValue(name, multiple ? updatedPreviews : updatedPreviews[0] || null)
      callback?.(filesList)
      toast.success('تم حذف الملف بنجاح')
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الملف')
      console.error(error)
    }
  }

  // Download handler
  const downloadFile = (index: number) => {
    const fileUrl = files[index]?.path
    if (!fileUrl) return toast.error('لا يوجد ملف للتحميل')
    window.open(fileUrl, '_blank')
  }

  return { previews, files, fileNames, handleInputChange, deleteFile, downloadFile }
}
