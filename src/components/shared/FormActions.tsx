'use client'

import { LoadingContext } from '@/contexts/loadingContext'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
import {
  Button,
  Typography,
  Menu,
  MenuItem,
  useFormContext,
  useState,
  useEffect,
  useContext,
  CircularProgress
} from '@/shared'

import type { Locale, MenuOption, Mode } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'

interface ActionsProps {
  onCancel?: () => void
  onSaveSuccess: (data: any) => void
  onPrint?: () => void
  mode: Mode // Add the :
  locale?: any
  saveLabelKey?: string
  editLabelKey?: string
  searchLabelKey?: string
  cancelLabelKey?: string
  disabled?: boolean
  canAdd?: boolean
  canEdit?: boolean
  canSearch?: boolean
  canPrint?: boolean
  children?: React.ReactNode
  tabsCount?: number
  tabValue?: string
}

export const FormActions: React.FC<ActionsProps> = ({
  onCancel,
  onSaveSuccess,
  onPrint,
  mode,
  locale = '',
  saveLabelKey = 'save',
  editLabelKey = 'edit',
  searchLabelKey = 'search',
  cancelLabelKey = 'cancel',
  disabled = false,
  canAdd: propAdd,
  canEdit: propEdit,
  canSearch: propSearch,
  canPrint: propPrint,
  children,
  tabsCount,
  tabValue
}) => {
  // Checking if the tabCount and value are passed to apply this logic
  if (tabsCount !== undefined && tabValue !== undefined && mode === 'add') {
    if (Number(tabValue) !== Number(tabsCount)) {
      return null
    }
  }

  // if (mode == 'show') {
  //   return <></>
  // }
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { handleSubmit, formState } = useFormContext()
  const [dictionary, setDictionary] = useState<any>(null)
  const permissions = useScreenPermissions(mode)
  const canAdd = propAdd !== undefined ? propAdd : permissions.canAdd
  const canEdit = propEdit !== undefined ? propEdit : permissions.canEdit
  const canSearch = propSearch !== undefined ? propSearch : permissions.canSearch
  const canPrint = propPrint !== undefined ? propPrint : permissions.canPrint
  const { triggerPrintMode } = usePrintMode()
  const { loading } = useContext(LoadingContext)

  useEffect(() => {
    const fetchDictionary = async () => {
      const res = await getDictionary(locale as Locale)
      setDictionary(res)
    }
    fetchDictionary()
  }, [locale])

  const handleSave = handleSubmit(data => {
    onSaveSuccess(data)
  })

  const getSaveButtonLabel = () => {
    if (!dictionary?.actions) return saveLabelKey

    if (mode === 'add') {
      return dictionary.actions[saveLabelKey] || dictionary.actions.save || saveLabelKey
    }

    if (mode === 'edit') {
      return (
        dictionary.actions[editLabelKey] || dictionary.actions[saveLabelKey] || dictionary.actions.edit || editLabelKey
      )
    }

    if (mode === 'search') {
      return dictionary.actions[searchLabelKey] || dictionary.actions.search || searchLabelKey
    }

    return dictionary.actions[saveLabelKey] || dictionary.actions.save || saveLabelKey
  }
  const getCancelButtonLabel = () => {
    return dictionary?.actions?.[cancelLabelKey] || dictionary?.actions?.['cancel'] || cancelLabelKey
  }
  return (
    <div className='flex justify-between items-center flex-wrap gap-6 mt-3'>
      <div className='flex items-center gap-4'>
        {(mode === 'add' || mode === 'edit' || mode === 'search') && (
          <Button variant='outlined' color='error' onClick={onCancel}>
            {getCancelButtonLabel()}
          </Button>
        )}
      </div>

      <div className='flex items-center gap-4'>
        {children}
        {/* {canPrint && (mode === 'show') && (
          <Button
            variant='outlined'
            color='info'
            onClick={onPrint || triggerPrintMode}
            startIcon={<i className='ri-printer-line' />}
          >
            {dictionary?.actions?.['print'] || 'print'}
          </Button>
        )} */}

        {(mode === 'add' && canAdd) || (mode === 'edit' && canEdit) || (mode === 'search' && canSearch) ? (
          <Button
            loading={loading.includes('create')}
            loadingIndicator={<CircularProgress color='info' size={'1rem'} />}
            loadingPosition='start'
            variant='contained'
            onClick={handleSave}
            disabled={disabled}
          >
            {getSaveButtonLabel()}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default FormActions
