import type { ColumnCalculationConfig } from '@/types/components/dynamicFormDetailsTable'

/**
 * Calculates a single column's value based on the configuration
 * @param rows - Array of row data
 * @param fieldName - The field name to calculate
 * @param config - Calculation configuration for this column
 * @returns The calculated value
 */
export function calculateColumnValue(rows: any[], fieldName: string, config: ColumnCalculationConfig): any {
  if (!rows || rows.length === 0) {
    return '-'
  }

  // Extract values from all rows for this field
  let values = rows.map(row => row[fieldName]).filter(value => value !== null && value !== undefined && value !== '')

  // Apply transform to each value if provided
  if (config.transform) {
    values = values.map(value => {
      try {
        return config.transform!(value)
      } catch (error) {
        console.warn(`Transform failed for value ${value}:`, error)
        return 0
      }
    })
  }

  // Ensure all values are numbers
  const numericValues = values
    .map(v => {
      const num = typeof v === 'string' ? parseFloat(v) : v
      return isNaN(num) ? 0 : num
    })
    .filter(v => v !== null && v !== undefined)

  if (numericValues.length === 0) {
    return '-'
  }

  let result: any

  switch (config.operation) {
    case 'sum':
      result = numericValues.reduce((a, b) => a + b, 0)
      break

    case 'avg':
      result = numericValues.length > 0 ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length : 0
      break

    case 'min':
      result = Math.min(...numericValues)
      break

    case 'max':
      result = Math.max(...numericValues)
      break

    case 'count':
      result = numericValues.length
      break

    case 'custom':
      if (config.customFunction) {
        try {
          result = config.customFunction(values, rows)
        } catch (error) {
          console.error('Custom function failed:', error)
          return '-'
        }
      } else {
        console.warn('Custom operation requires customFunction property')
        return '-'
      }
      break

    default:
      return '-'
  }

  // Apply final transformation if provided
  if (config.finalTransform && typeof result === 'number') {
    try {
      result = config.finalTransform(result)
    } catch (error) {
      console.warn('Final transform failed:', error)
    }
  }

  return result
}

/**
 * Calculates all column values for the calculation row
 * @param rows - Array of row data
 * @param columnConfigs - Object mapping field names to their calculation configs
 * @returns Object with calculated values for each field
 */
export function calculateAllColumns(
  rows: any[],
  columnConfigs: Record<string, ColumnCalculationConfig>
): Record<string, any> {
  const calculations: Record<string, any> = {}

  Object.entries(columnConfigs).forEach(([fieldName, config]) => {
    calculations[fieldName] = calculateColumnValue(rows, fieldName, config)
  })

  return calculations
}

/**
 * Checks if value is a valid number for display
 */
export function isValidCalculationValue(value: any): boolean {
  if (value === '-' || value === null || value === undefined) {
    return false
  }
  if (typeof value === 'number') {
    return !isNaN(value)
  }
  if (typeof value === 'string') {
    const num = parseFloat(value)
    return !isNaN(num)
  }
  return true
}
