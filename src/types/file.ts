import { FileType } from '@/shared'

export const FILE_TYPE_META: Record<FileType, { icon: string; color: string; label: string }> = {
  image: {
    icon: 'bi-file-earmark-image-fill',
    color: '#8E24AA',
    label: 'Image'
  },
  pdf: {
    icon: 'bi-file-earmark-pdf-fill',
    color: '#E53935',
    label: 'PDF Document'
  },
  excel: {
    icon: 'bi-file-earmark-excel-fill',
    color: '#2E7D32',
    label: 'Excel File'
  },
  word: {
    icon: 'bi-file-earmark-word-fill',
    color: '#1565C0',
    label: 'Word Document'
  },
  ppt: {
    icon: 'bi-file-earmark-ppt-fill',
    color: '#EF6C00',
    label: 'PowerPoint'
  },
  zip: {
    icon: 'bi-file-earmark-zip-fill',
    color: '#6D4C41',
    label: 'Compressed File'
  },
  text: {
    icon: 'bi-file-earmark-text-fill',
    color: '#546E7A',
    label: 'Text File'
  },
  unknown: {
    icon: 'bi-file-earmark-fill',
    color: '#757575',
    label: 'File'
  }
}

export interface ExportToExcelOptions {
  data: any[]
  columns: any[]
  fileName?: string
  sheetName?: string
  dictionary?: any
}
