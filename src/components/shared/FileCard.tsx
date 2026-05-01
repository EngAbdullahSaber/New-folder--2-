import { FILE_TYPE_META } from '@/types/file'

import { Box, Typography, CircularProgress, IconButton } from '@mui/material'
import CustomIconBtn from './CustomIconButton'

type FileCardProps = {
  fileName?: string
  fileType: keyof typeof FILE_TYPE_META
  subtitle?: string
  loading?: boolean
  onUpload?: () => void
  onDownload?: () => void
  onDelete?: () => void
  error?: boolean
  dictionary: any
  deleteLoading?: boolean
}

const FileCard = ({
  fileName,
  fileType,
  dictionary,
  subtitle = 'No file selected',
  loading,
  error,
  onUpload,
  onDownload,
  onDelete,
  deleteLoading
}: FileCardProps) => {
  const meta = FILE_TYPE_META[fileType] || FILE_TYPE_META.unknown

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: '1px solid',
        borderColor: error ? 'error.main' : 'var(--mui-palette-divider)',
        borderRadius: 'var(--mui-shape-customBorderRadius-md)',
        px: 2, // horizontal padding like TextField
        bgcolor: 'background.paper',
        width: '100%', // optional, full width like TextField
        minWidth: 0, // allow text truncation,
        height: '38px'
      }}
    >
      {/* File Type Icon */}
      <Box
        sx={{
          // width: 40,
          // height: 40,
          borderRadius: 1,
          // bgcolor: `${meta.color}15`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <i className={`bi ${meta.icon}`} style={{ color: meta.color, fontSize: 22 }} />
      </Box>

      {/* File Info */}
      <Box display={'flex'} flexDirection={'column'} flex={1} minWidth={0}>
        <Typography variant='body2' fontSize={'0.6rem'} fontWeight={500} noWrap>
          {fileName ?? dictionary?.placeholders?.['no_file']}

          {/* {t('dictionary')} */}
        </Typography>
        <Typography variant='caption' color='text.secondary' fontSize={'0.5rem'}>
          {meta.label || subtitle}
        </Typography>
      </Box>

      {/* Upload / Download buttons */}
      {loading || deleteLoading ? (
        <CircularProgress size={20} />
      ) : (
        <>
          {onUpload && !fileName && (
            <IconButton onClick={onUpload} sx={{ width: '30px', height: '30px' }}>
              <i className='bi bi-upload' />
            </IconButton>
          )}
          {onDownload && (
            <IconButton onClick={onDownload} sx={{ width: '30px', height: '30px' }}>
              <i className='bi bi-download' />
            </IconButton>
          )}
        </>
      )}

      {/* Delete overlay */}
      {onDelete && !deleteLoading && (
        <CustomIconBtn
          color='error'
          variant='text'
          size='small'
          sx={{
            // position: 'absolute',
            // top: -10,
            // right: -10,
            // bgcolor: 'error.main',
            borderRadius: '50%',
            width: 30,
            height: 30,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: 0
          }}
          onClick={onDelete}
        >
          <i className='ri-delete-bin-7-line' />
        </CustomIconBtn>
        // <Box
        //   sx={{
        //     position: 'absolute',
        //     top: -10,
        //     right: -10,
        //     bgcolor: 'error.main',
        //     borderRadius: '50%',
        //     // width: 28,
        //     // height: 28,
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     cursor: 'pointer',
        //     boxShadow: 1
        //   }}
        //   onClick={onDelete}
        //   title='حذف الملف'
        // >

        // </Box>
      )}
    </Box>
  )
}

export default FileCard
