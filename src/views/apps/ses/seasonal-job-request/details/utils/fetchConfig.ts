// utils/fetchConfig.ts
import * as Shared from '@/shared'

export interface FetchConfig {
  enabled: boolean
  url?: string
  method: 'GET'
  shouldSetDataModel?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Creates fetch configuration for the record form
 */
export const createFetchConfig = (
  currentMode: Shared.Mode, 
  shouldBlockAccess: boolean,
  scope?: string
): FetchConfig => {
  // Don't fetch if access is blocked
  if (shouldBlockAccess) {
    return {
      enabled: false,
      method: 'GET'
      // shouldSetDataModel: true
    }
  }

  // For add mode - check for existing request
  if (currentMode === 'add') {
    return {
      enabled: true,
      url: '/ses/requests/user',
      method: 'GET',
      shouldSetDataModel: true, // ✅ Important: This ensures the form is populated with existing data
      onSuccess: (data: any) => {
       },
      onError: (error: any) => {
       }
    }
  }

  // Configuration for show/edit modes
  return {
    enabled: currentMode === 'show' || currentMode === 'edit',
    method: 'GET',
    shouldSetDataModel: true
  }
}
