import CustomAvatar from '@/@core/components/mui/Avatar'
import * as Shared from '@/shared'
import classNames from 'classnames'

type ConfirmModalProps = {
  title: string
  description?: string
  icon?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  value?: any
  onClose?: () => void
  dictionary: any
}

const ConfirmModal = ({
  title,
  description,
  icon = '⚠️',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  dictionary,
  value,
  onConfirm = () => {},
  onClose = () => {}
}: ConfirmModalProps) => {
  return (
    <div style={{ borderRadius: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div className='flex items-center gap-2 flex-1'>
            <div
              style={{
                width: 33,
                height: 33,
                borderRadius: '50%',
                background: 'rgba(25,118,210,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                position: 'relative',
                bottom: 5
              }}
            >
              <CustomAvatar skin='light' color={'primary'} size={30}>
                <i className={classNames('ri-align-justify', 'text-lg')} />
              </CustomAvatar>
            </div>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
              {dictionary?.placeholders?.[title]}
            </h2>
          </div>
          {/*
          {description && (
            <span style={{ fontSize: 13, color: '#777', marginTop: '10px' }}>
              {dictionary?.placeholders?.[description]}
            </span>
          )} */}
        </div>
      </div>

      {/* Message */}
      {description && (
        <div
          style={{
            margin: 0,
            color: '#555',
            lineHeight: 1.7,
            fontSize: 14,
            marginTop: '1rem'
          }}
          dangerouslySetInnerHTML={{ __html: description ?? dictionary?.placeholders?.[description] }}
        ></div>
      )}

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          gap: 12
        }}
      >
        {/* <Shared.Button
          variant='contained'
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {dictionary?.actions?.[confirmText ?? 'cancel']}
        </Shared.Button> */}

        {/* <Shared.Button variant='outlined' onClick={onClose}>
          {dictionary?.actions?.[cancelText ?? 'cancel']}
        </Shared.Button> */}
      </div>
    </div>
  )
}

export default ConfirmModal
