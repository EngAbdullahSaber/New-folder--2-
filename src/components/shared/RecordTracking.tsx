import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import { ListComponent, Locale } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'

interface RecordTrackingTypeData {
  action: number
  user_name: string
  date: string
  time: string
  deviceIpAddress: string
}

interface RecordTrackingProps {
  // recordInformations: RecordInformationTypeData[]
  open: boolean
  onClose: () => void
  columns: any[]
  apiEndPoint: string
  locale?: any
}

export const RecordTracking: React.FC<RecordTrackingProps> = ({ open, onClose, columns, apiEndPoint, locale = '' }) => {
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      sx={{
        '& .MuiDialog-paper': {
          marginTop: '0px',
          top: '5%',
          position: 'absolute'
        }
      }}
    >
      <DialogTitle>{dictionary?.actions?.record?.['tracking']}</DialogTitle>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 10, top: 10 }}>
        <i className='ri-close-line'></i>
      </IconButton>
      <DialogContent>
        <ListComponent selectable={false} columns={columns} apiEndpoint={apiEndPoint} routerUrl='' listView={false} />
      </DialogContent>
    </Dialog>
  )
}

export default RecordTracking
