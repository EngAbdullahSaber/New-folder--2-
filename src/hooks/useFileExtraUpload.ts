import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'

interface UseFileExtraUploadProps {
  name: string
  setValue: any
  multiple?: boolean
  typeAllowed?: string[]
  sizeAllowed?: number
}

export const useFileExtraUpload = ({
  name,
  setValue,
  multiple = false,
  typeAllowed = [],
  sizeAllowed
}: UseFileExtraUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const { clearErrors } = useFormContext()
  // Handle file selection
  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>, callback?: (value: any) => void) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : []
    if (!selectedFiles.length) return

    const validFiles: File[] = []

    for (const file of selectedFiles) {
      if (typeAllowed.length && !typeAllowed.includes(file.type)) {
        toast.error(`نوع الملف غير مدعوم: ${file.type}`)
        return
      }
      if (sizeAllowed && file.size > sizeAllowed) {
        toast.error(`حجم الملف يتجاوز ${(sizeAllowed / 1024 / 1024).toFixed(2)} MB`)
        return
      }
      validFiles.push(file)
    }

    if (!validFiles.length) return

    // Convert to base64 for preview
    const base64Values = await Promise.all(
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

    const names = validFiles.map(file => file.name)

    setFileNames(prev => (multiple ? [...prev, ...names] : names))
    setPreviews(multiple ? prev => [...prev, ...base64Values] : base64Values)
    setFiles(multiple ? prev => [...prev, ...validFiles] : validFiles)
    clearErrors(name)
    // Set value directly in field.name (binary/base64)
    const value = multiple ? base64Values : base64Values[0]
    setValue(name, value)
    callback?.(value)
  }

  // Download a file
  const downloadFile = (index: number) => {
    const file = files[index]
    if (!file) return toast.error('لا يوجد ملف للتحميل')

    const url = previews[index]
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
  }

  // Delete a file
  const deleteFile = (index: number, callback?: (value: any) => void) => {
    if (!files[index]) return
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    const updatedNames = fileNames.filter((_, i) => i !== index)
    const updatedValues = multiple ? updatedPreviews : updatedPreviews[0] || null

    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    setFileNames(updatedNames)
    setValue(name, updatedValues)
    callback?.(updatedValues)
  }

  // Clear all files
  const clear = (callback?: () => void) => {
    setFiles([])
    setPreviews([])
    setFileNames([])
    setValue(name, multiple ? [] : null)
    callback?.()
  }

  return {
    previews,
    files,
    fileNames,
    handleInputChange,
    downloadFile,
    deleteFile,
    clear
  }
}
