import {
  CustomIconBtn,
  downloadBase64File,
  FileType,
  getFileType,
  isBase64File,
  isImageFile,
  parseBase64File
} from '@/shared'
import { FILE_TYPE_META } from '@/types/file'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'

type FilePreviewProps = {
  filePath?: string
  fileName?: string
  label?: string
  mode?: 'auto' | 'image' | 'file'
  dictionary: any
  minimChars?: boolean
}

const FilePreview = ({ filePath, fileName, label, mode = 'auto', dictionary, minimChars }: FilePreviewProps) => {
  const showImage = mode === 'image'

  const isBase64 = isBase64File(filePath)
  const fileInfo = isBase64 ? parseBase64File(filePath!) : null
  // const fileType: FileType = fileInfo?.extension ? getFileType(fileInfo.extension) : 'unknown'

  const fileType = getFileType(filePath)
  const meta = FILE_TYPE_META[fileType]



  if (!filePath) {
    return (
      <Box sx={{ py: 1 }}>
        {label && (
          <Typography variant='subtitle2' sx={{ color: '#999', fontSize: '0.875rem', mb: 1 }}>
            {label}
          </Typography>
        )}
        <Typography variant='body2' color='text.secondary'>
          -
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        mt: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        p: '5px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease'
      }}
    >
      {label && filePath && (
        <Typography
          variant='caption'
          sx={{
            position: 'absolute',
            top: '-10px',
            left: '12px',
            bgcolor: 'background.paper',
            px: '6px',
             fontSize: '0.85rem',
            zIndex: 1
          }}
        >
          {label}
        </Typography>
      )}

      {showImage ? (
        /* Image Preview (EXPLICIT ONLY) */
        <Box className='flex justify-center w-full'>
          <img
            src={filePath}
            alt={fileName || 'Image'}
            width={100}
             className='rounded-md'
            style={{ objectFit: 'cover' }}
          />
        </Box>
      ) : (
        /* File Card (DEFAULT) */
        <>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: `${meta.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className={`bi ${meta.icon}`} style={{ color: meta.color, fontSize: 22 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant='body2'
              fontWeight={500}
              noWrap
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {fileName ? (minimChars ? fileName.slice(-10) : fileName) : dictionary?.placeholders?.['no_file']}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {meta.label}
            </Typography>
          </Box>

          {fileType === 'unknown' && (
            <Tooltip title={dictionary?.placeholders?.[fileName ? 'no_file_extension' : 'no_file']} placement='top'>
              <IconButton sx={{ width: '35px', height: '35px' }}>
                <i className='ri-information-line' />
              </IconButton>
            </Tooltip>
          )}

          {filePath && fileType !== 'unknown' && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={dictionary?.actions?.download || 'Download'} placement='top'>
                <IconButton
                  onClick={() => downloadBase64File(filePath!, isBase64 ? fileName : `${fileName}.${fileType}`)}
                  sx={{ width: '32px', height: '32px' }}
                >
                  <i className='bi bi-download' style={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>

              <Tooltip title={dictionary?.actions?.show || 'Show'} placement='top'>
                <IconButton onClick={() => window.open(filePath, '_blank')} sx={{ width: '32px', height: '32px' }}>
                  <i className='bi-file-earmark' style={{ fontSize: '1.1rem' }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default FilePreview
