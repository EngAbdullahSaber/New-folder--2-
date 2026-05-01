import { toast, ToastContent } from 'react-toastify'
import React from 'react'

/**
 * Displays a toast notification summarizing the success and failure IDs.
 *
 * @param successIds - Array of IDs successfully deleted.
 * @param failedIds - Array of IDs that failed to delete.
 */
export const showDeleteSummaryToast = (successIds: string[], failedIds: string[], locale = ''): void => {
  if (!successIds && !failedIds) return
  // Generate success list
  const successList = successIds.map(id => (
    <div key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', whiteSpace: 'nowrap' }}>
      <i className='ri-checkbox-circle-line' style={{ color: 'green', marginRight: '8px' }}></i>
      <span>تم حذف هذا السجل بنجاح - رقم: {id}</span>
    </div>
  ))

  // Generate failed list
  const failedList = failedIds.map(id => (
    <div key={id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', whiteSpace: 'nowrap' }}>
      <i className='ri-close-circle-line' style={{ color: 'red', marginRight: '8px' }}></i>
      <span>لم يتم حذف السجل - رقم: {id}</span>
    </div>
  ))

  // Combine lists into a single toast message
  const toastMessage: ToastContent = (
    <div>
      {successList.length > 0 && (
        <div>
          <strong>نجاح:</strong>
          {successList}
        </div>
      )}
      {failedList.length > 0 && (
        <div>
          <strong>فشل:</strong>
          {failedList}
        </div>
      )}
    </div>
  )

  // Show toast
  toast(toastMessage, {
    autoClose: 10000, // Set auto-close time
    type: successList.length === 0 ? 'error' : failedList.length === 0 ? 'success' : 'default',
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: false,
    position: 'top-center'
  })
}
