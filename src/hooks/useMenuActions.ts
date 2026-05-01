'use client'

import { useRouter } from 'next/navigation'
import type { Locale } from '@configs/i18n'
import { Mode, useNavigation } from '@/shared'

interface UseMenuActionsProps {
  locale: Locale
  routerUrl: {
    default: string
    showUrl?: string
  }
  setMode: (mode: Mode) => void
  formMethods?: any
  defaultValues?: Record<string, any>
  resetForm?: (formMethods: any, mode: Mode, fields: string[]) => void
  setDetailsData?: () => void
  handleDelete?: () => void
  openDocuments?: () => void
  openRecordInfo?: () => void
  openRecordTrack?: () => void
  triggerPrint?: () => void
}

export const useMenuActions = ({
  locale,
  routerUrl,
  setMode,
  formMethods,
  defaultValues = {},
  resetForm,
  setDetailsData,
  handleDelete,
  openDocuments,
  openRecordInfo,
  openRecordTrack,
  triggerPrint
}: UseMenuActionsProps) => {
  const router = useRouter()
  const { navigateWithQuery } = useNavigation()

  const handleMenuOptionClick = (action: string) => {
    if (action === 'add' || action === 'search') {
      setMode(action as Mode)

      if (resetForm && formMethods) {
        resetForm(formMethods, action as Mode, Object.keys(defaultValues))
      }

      setDetailsData?.()

      if (action === 'add') {
        navigateWithQuery(`${routerUrl.default}/details?mode=add`, router, locale)
      } else if (action === 'search') {
        navigateWithQuery(`${routerUrl.default}/details?mode=search`, router, locale)
      }
    } else if (action === 'edit') {
      setMode('edit')
      navigateWithQuery(`${routerUrl.default}/details?id=${defaultValues?.id}&mode=edit`, router, locale)
    } else if (action === 'show') {
      setMode('show')
      if (routerUrl.showUrl) {
        navigateWithQuery(`${routerUrl.default}/details?id=${defaultValues?.id}&mode=show`, router, locale)
      }
    } else if (action === 'list') {
      navigateWithQuery(`${routerUrl.default}/list`, router, locale)
    } else if (action === 'delete') {
      handleDelete?.()
    } else if (action === 'documents') {
      openDocuments?.()
    } else if (action === 'record_info') {
      openRecordInfo?.()
    } else if (action === 'record_track') {
      openRecordTrack?.()
    } else if (action === 'print') {
      triggerPrint?.()
    }
  }

  return { handleMenuOptionClick }
}
