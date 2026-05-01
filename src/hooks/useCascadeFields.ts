'use client'

/**
 * useCascadeFields
 * ----------------
 * Generic hook for managing cascading (parent → child) select field dependencies.
 *
 * Problem it solves:
 *   When a "parent" select field changes (e.g. `ltc_id`), child fields that depend on
 *   it (e.g. `bus_id`, `driver_id`) must be cleared — BUT only when the user explicitly
 *   changes the parent, NOT when the form is loading existing data (edit/show modes).
 *
 * How it works:
 *   1. On initial data load (`dataModel`), it reads `syncFromDataModel` paths from
 *      field definitions and calls the matching setter — this populates parent states
 *      (like `selectedLandTranId`) so child `apiUrl`s become active.
 *   2. It sets `isAutoSetting = true` BEFORE any state changes, preventing downstream
 *      `watch` effects from clearing child values during restore.
 *   3. After all effects settle (500ms timeout), it releases the guard.
 *   4. For user-triggered changes, it reads `clearOnParentChange` from each field and
 *      calls `setValue(childField, null)` for each listed child.
 *
 * Usage in useReceptionLogic.ts:
 * --------------------------------
 *   const { isAutoSettingRef } = useCascadeFields({
 *     dataModel,
 *     fields: allFields,
 *     formMethods,
 *     stateSetters: {
 *       ltc_id: (res) => setSelectedLandTranId(res?.object?.business_id),
 *       port_id: (res) => { setSelectedPortCode(res?.object?.port_code); ... },
 *     },
 *     dataModelSyncSetters: {
 *       'ltc.business_id': setSelectedLandTranId,
 *       'port.port_code': setSelectedPortCode,
 *       'port.city_id': setSelectedPortCityId,
 *       'reception_city_id': setSelectedCityId,
 *     },
 *   })
 *
 * Usage in field definitions (useReceptionFields.ts):
 * ----------------------------------------------------
 *   {
 *     name: 'ltc_id',
 *     type: 'select',
 *     clearOnParentChange: ['bus_id', 'driver_id'],   // ← cleared on user change
 *     syncFromDataModel: 'ltc.business_id',           // ← synced on load
 *     onChange: (res) => setSelectedLandTranId(res?.object?.business_id),
 *   }
 */

import { useRef, useEffect } from 'react'
import type { DynamicFormFieldProps } from '@/types/components/dynamicFormField'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CascadeFieldsOptions {
  /** The loaded API record (null in add mode) */
  dataModel: Record<string, any> | null | undefined
  /** All field definitions (flat list) */
  fields: DynamicFormFieldProps[]
  /** react-hook-form methods */
  formMethods: {
    setValue?: (name: string, value: any) => void
    watch?: (name: string) => any
  }
  /**
   * Map of field-name → state setter.
   * Called when the parent field changes to update local React state
   * (the value that drives `apiUrl` / `queryParams` of child fields).
   *
   * The setter receives the same `res` object passed to field's `onChange`.
   *
   * Example:
   *   { ltc_id: (res) => setSelectedLandTranId(res?.object?.business_id) }
   */
  stateSetters?: Record<string, (res: any) => void>
  /**
   * Map of dot-notation dataModel paths → state setter.
   * Called once when `dataModel` first loads (edit / show modes).
   *
   * Example:
   *   { 'ltc.business_id': setSelectedLandTranId }
   */
  dataModelSyncSetters?: Record<string, (value: any) => void>
  /** How long (ms) to keep the auto-setting guard active after dataModel sync. Default: 500 */
  guardDurationMs?: number
}

// ─── Utility ─────────────────────────────────────────────────────────────────

/** Read a dot-notation path from an object. Example: getNestedValue(obj, 'ltc.business_id') */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc: any, key) => acc?.[key], obj)
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCascadeFields({
  dataModel,
  fields,
  formMethods,
  dataModelSyncSetters = {},
  guardDurationMs = 500
}: CascadeFieldsOptions) {
  const { setValue } = formMethods || {}

  /**
   * Guard flag: when true, watch-based effects should skip their destructive clears.
   * Exposed so the calling hook can check it in its own useEffect chains.
   */
  const isAutoSettingRef = useRef(false)

  /**
   * Build a lookup: fieldName → list of child field names to clear.
   * Derived from `clearOnParentChange` on each field definition.
   *
   * Recalculated only when field definitions change (stable in most cases).
   */
  const clearMapRef = useRef<Record<string, string[]>>({})
  useEffect(() => {
    const map: Record<string, string[]> = {}
    fields.forEach(f => {
      if (f.clearOnParentChange?.length) {
        map[f.name] = f.clearOnParentChange
      }
    })
    clearMapRef.current = map
  }, [fields])

  /**
   * On dataModel load: sync state setters and set guard.
   * Runs whenever `dataModel` changes (e.g. navigating between records).
   */
  useEffect(() => {
    if (!dataModel) return

    // Activate guard BEFORE any setState so downstream watch-effects skip their clears
    isAutoSettingRef.current = true

    // Sync each registered setter from the dataModel
    Object.entries(dataModelSyncSetters).forEach(([path, setter]) => {
      const value = getNestedValue(dataModel, path)
      if (value != null) {
        setter(value)
      }
    })

    // Release the guard after React has processed all re-renders triggered above
    const timer = setTimeout(() => {
      isAutoSettingRef.current = false
    }, guardDurationMs)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataModel])

  /**
   * Returns an `onChange` wrapper for a parent field.
   * When the user selects a new value, it:
   *   1. Checks the guard — if auto-setting, skip clears.
   *   2. Clears all child fields declared in `clearOnParentChange`.
   *   3. Calls the original `onChange` (if any).
   */
  const wrapOnChange = (
    fieldName: string,
    originalOnChange?: (res: any) => void
  ) => {
    return (res: any) => {
      if (!isAutoSettingRef.current) {
        // User-initiated change: clear dependent children
        const childFields = clearMapRef.current[fieldName] ?? []
        childFields.forEach(childName => {
          setValue?.(childName, null)
        })
      }

      // Always call the original onChange (e.g. to update local state)
      originalOnChange?.(res)
    }
  }

  /**
   * Applies cascade wrappers to all fields that have `clearOnParentChange`.
   * Returns a new array with `onChange` replaced by the wrapped version.
   *
   * Call this on your field arrays before passing to FormComponent:
   *   const wrappedTab3Fields = applyCascade(tab3Fields)
   */
  const applyCascade = (fieldList: DynamicFormFieldProps[]): DynamicFormFieldProps[] => {
    return fieldList.map(f => {
      if (!f.clearOnParentChange?.length) return f
      return {
        ...f,
        onChange: wrapOnChange(f.name, f.onChange as any)
      }
    })
  }

  return {
    /** Ref to the auto-setting guard. Check `isAutoSettingRef.current` in your own effects. */
    isAutoSettingRef,
    /** Wrap field arrays to inject cascade clearing logic. */
    applyCascade,
    /** Manually wrap a single field's onChange. */
    wrapOnChange
  }
}
