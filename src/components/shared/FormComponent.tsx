'use client'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import {
  DynamicFormField,
  Card,
  CardContent,
  Grid,
  useFormContext,
  getGridSize,
  Typography,
  useRef,
  useEffect,
  useState,
  HeaderPrint,
  FooterPrint,
  isFieldVisible,
  LoadingContext
} from '@/shared'
import type { FormComponentProps, Locale, Mode } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import classNames from 'classnames'
import React, { useContext } from 'react'
import { useWatch } from 'react-hook-form'
import { useScreenPermissions } from '@/hooks/useScreenPermission'

export const FormComponent = ({
  fields,
  mode,
  headerConfig = {},
  locale = '',
  showHeaderPrint = true,
  allFormFields = [],
  onDataChange,
  detailsConfig = [],
  dataObject = {},
  printForm = true,
  printInline = false,
  showBarcode = false,
  showTitlePrint = true,
  recordId,
  renderAfterFields
}: FormComponentProps & {
  onDataChange?: (data: Record<string, any>, errors: Record<string, any>) => void
}) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()
  const [dictionary, setDictionary] = useState<any>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const { isPrintMode } = usePrintMode()
  const { screenData } = useScreenPermissions(mode)

  const toggleArrowIcon = (
    <svg width='21' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g id='remix-icons/line/system/2arrow-left-s-line'>
        <path
          id='Vector'
          d='M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z'
          fill='var(--mui-palette-text-primary)'
        />
        <path
          id='Vector_2'
          d='M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z'
          fill='var(--mui-palette-text-disabled)'
        />
      </g>
    </svg>
  )

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => setDictionary(res))
  }, [locale])

  // ✅ FIX: Create stable field names array using useMemo
  const fieldNames = React.useMemo(() => fields.map(f => f.name), [fields.length])

  const watchedValuesArray = useWatch({
    control,
    name: fieldNames
  })

  const watchedValues = React.useMemo(() => {
    return fieldNames.reduce(
      (acc, name, index) => {
        acc[name] = watchedValuesArray?.[index]
        return acc
      },
      {} as Record<string, any>
    )
  }, [fieldNames, watchedValuesArray])

  // ✅ FIX: Use refs to track previous values and prevent unnecessary callbacks
  const prevWatchedValuesRef = useRef<string>('')
  const prevErrorsRef = useRef<string>('')

  useEffect(() => {
    if (!onDataChange) return

    // ✅ Build data object
    const data: Record<string, any> = {}
    const fieldErrors: Record<string, any> = {}

    fields.forEach((f: any, index: number) => {
      data[f.name] = watchedValues?.[f.name]
      if (errors?.[f.name]) fieldErrors[f.name] = errors[f.name]
    })

    // ✅ Create stable signatures for comparison
    const currentWatchedSignature = JSON.stringify(data)
    const currentErrorsSignature = JSON.stringify(fieldErrors)

    // ✅ Only call onDataChange if something actually changed
    if (prevWatchedValuesRef.current !== currentWatchedSignature || prevErrorsRef.current !== currentErrorsSignature) {
      prevWatchedValuesRef.current = currentWatchedSignature
      prevErrorsRef.current = currentErrorsSignature
      onDataChange(data, fieldErrors)
    }
  }, [watchedValues, errors, onDataChange, fields])

  // ✅ Watch all detail fields
  const allDetailKeys = React.useMemo(() => detailsConfig.map(config => config.key), [detailsConfig.length])
  const detailsData = useWatch({
    control,
    name: allDetailKeys
  })

  // ✅ Helper function to check if a value is empty
  const isValueEmpty = (value: any): boolean => {
    return (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
    )
  }

  // ✅ Render print view for master fields
  const renderMasterPrintView = () => {
    // ✅ First, filter out all empty fields
    const fieldsWithValues = fields.filter((field: any) => {
      if (field.type === 'file' || field.type === 'storage' || field.visible === false) {
        return false
      }

      const fieldValue = watchedValues[field.name]

      if (!isValueEmpty(fieldValue)) return true

      if (field.viewProp) return true

      return false
    })

    // ✅ Don't render if no fields have values
    if (fieldsWithValues.length === 0) return null

    // ✅ Group fields into rows (2 per row, or 1 if full width)
    const renderedFields: any[] = []
    let currentRow: any[] = []

    fieldsWithValues.forEach((field: any) => {
      const isFullWidth =
        field.gridSize === 12 ||
        (typeof field.gridSize === 'object' && field.gridSize.xs === 12) ||
        field.type === 'textarea' ||
        field.type === 'rich_text'

      if (isFullWidth) {
        // Push current row if it has items
        if (currentRow.length > 0) {
          renderedFields.push(currentRow)
          currentRow = []
        }
        // Add full width field as its own row
        renderedFields.push([field])
      } else {
        currentRow.push(field)
        // Push row when we have 2 items
        if (currentRow.length === 2) {
          renderedFields.push(currentRow)
          currentRow = []
        }
      }
    })

    // Push remaining items in current row
    if (currentRow.length > 0) {
      renderedFields.push(currentRow)
    }

    return (
      <div className='print-view mb-4'>
        <table className='preview-table'>
          <thead>
            <tr>
              <th colSpan={4}>
                {isPrintMode && (
                  <Typography className='mx-2 bold-title'>
                    {dictionary?.titles?.[headerConfig.title || 'main_information']}
                  </Typography>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {renderedFields.map((row, rowIndex) => {
              const isFullWidthRow =
                row.length === 1 &&
                (row[0].gridSize === 12 ||
                  (typeof row[0].gridSize === 'object' && row[0].gridSize.xs === 12) ||
                  row[0].type === 'textarea' ||
                  row[0].type === 'rich_text')

              if (isFullWidthRow) {
                const field = row[0]
                return (
                  <tr key={rowIndex}>
                    <td className='preview-label'>
                      {field.type === 'checkbox' || field.type === 'radio'
                        ? dictionary?.placeholders?.[field?.options?.[0]?.['label'] || ''] || field.label
                        : dictionary?.placeholders?.[field.label] || field.label}
                    </td>
                    <td className='preview-value' colSpan={3}>
                      <DynamicFormField
                        {...field}
                        key={field.name}
                        control={control}
                        mode='show'
                        errors={errors[field.name]}
                        visible={field.visible}
                        screenMode={mode}
                        dataObject={{ ...(dataObject || {}), ...watchedValues }}
                        gridRef={gridRef}
                        locale={locale}
                      />
                    </td>
                  </tr>
                )
              }

              // Regular row with 1 or 2 fields
              return (
                <tr key={rowIndex}>
                  {row.map((field: any, fIdx: number) => (
                    <React.Fragment key={fIdx}>
                      <td className='preview-label'>
                        {field.type === 'checkbox' || field.type === 'radio'
                          ? dictionary?.placeholders?.[field?.options?.[0]?.['label'] || ''] || field.label
                          : dictionary?.placeholders?.[field.label] || field.label}
                      </td>
                      <td className='preview-value' colSpan={row.length === 1 ? 3 : 1}>
                        <DynamicFormField
                          {...field}
                          key={`${field.name}-${fIdx}`}
                          control={control}
                          mode='show'
                          errors={errors[field.name]}
                          visible={field.visible}
                          screenMode={mode}
                          dataObject={{ ...(dataObject || {}), ...watchedValues }}
                          gridRef={gridRef}
                          locale={locale}
                        />
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // ✅ Render print view for each detail table
  const renderDetailPrintView = (config: { key: string; fields: any[]; title: string }, index: number) => {
    const detailRows = Array.isArray(detailsData?.[index]) ? detailsData[index] : []

    if (detailRows.length === 0) return null

    return (
      <div className='print-view mb-4' key={config.key}>
        <table className='preview-table'>
          <thead>
            <tr>
              <th colSpan={config.fields.length + 1}>
                <Typography className='mx-2 bold-title'>
                  {dictionary?.titles?.[config.title] || config.title}
                </Typography>
              </th>
            </tr>
            <tr>
              <th>#</th>
              {config.fields.map((field, idx) => (
                <th key={idx}>
                  {field.type === 'checkbox' || field.type === 'radio'
                    ? dictionary?.placeholders?.[field?.options?.[0]?.['label'] || '']
                    : dictionary?.placeholders?.[field.label]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detailRows.map((row: any, rowIndex: number) => {
              const rowErrors = Array.isArray(errors?.[config.key] as any) ? (errors[config.key] as any)[rowIndex] : {}
              return (
                <tr key={rowIndex}>
                  <td>{rowIndex + 1}</td>
                  {config.fields.map((field, fieldIndex) => (
                    <td key={fieldIndex} className='preview-table-cell'>
                      <DynamicFormField
                        {...field}
                        control={control}
                        mode='show'
                        name={`${config.key}.${rowIndex}.${field.name}`}
                        errors={rowErrors?.[field.name]}
                        visible={field.visible}
                        screenMode={mode}
                        dataObject={row}
                        gridRef={gridRef}
                        locale={locale}
                        key={`${field.name}-${field.type}-${field.visibleModes?.join('-') || index}`}
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const { loading } = useContext(LoadingContext)
  if (loading.includes('details')) return null

  return (
    <div className={classNames({ 'print-view': isPrintMode && mode === 'show' && printForm })}>
      {showHeaderPrint && <HeaderPrint dictionary={dictionary} />}
      {!printInline && <FooterPrint showBarcode={showBarcode} recordId={recordId} />}

      {/* ✅ Print View */}
      {isPrintMode && mode === 'show' && printForm && (
        <>
          <div className={printInline ? '' : 'print-container'}>
            {showTitlePrint && (
              <div className='flex justify-between items-center mb-4 px-2'>
                <Typography variant='h5' color='primary'>
                  {screenData?.object_name_ar
                    ? screenData?.object_name_ar
                    : dictionary?.titles?.[headerConfig.title || 'main_information']}
                  <span> {toggleArrowIcon}</span>
                  {dictionary?.actions?.['show']}
                </Typography>
              </div>
            )}

            {/* Master fields */}
            {renderMasterPrintView()}

            {/* Detail tables */}
            {detailsConfig.map((config, index) => renderDetailPrintView(config, index))}
          </div>
        </>
      )}

      {/* ✅ Normal UI View */}
      <Card style={{ display: !isPrintMode ? 'block' : 'none' }}>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center' }} className='mb-3'>
            <CustomAvatar skin='light' color={headerConfig.icon?.color || 'primary'} size={30}>
              <i className={classNames(headerConfig.icon?.name || 'ri-align-justify', 'text-lg')} />
            </CustomAvatar>
            <Typography className='mx-2' variant='h6'>
              {dictionary?.titles?.[headerConfig.title || 'main_information']}
            </Typography>
          </div>

          <Grid container spacing={3} ref={gridRef}>
            {fields.map((field: any, index: number) => {
              const { gridSize, defaultGridSize, visible = true, name, visibleModes = [] } = field
              const fieldValue = watchedValues[name]

              let showWhenVisible = true

              if (field.showWhen) {
                const { field: dependentField, value, operator = 'equals', hasValue } = field.showWhen
                const dependentValue = watchedValues[dependentField]

                if (hasValue) {
                  showWhenVisible = dependentValue !== undefined && dependentValue !== null && dependentValue !== ''
                } else if (Array.isArray(value)) {
                  showWhenVisible =
                    operator === 'notEquals' ? !value.includes(dependentValue) : value.includes(dependentValue)
                } else {
                  showWhenVisible = operator === 'notEquals' ? dependentValue !== value : dependentValue === value
                }
              }
              let finalGridSize: any = {}

              if (typeof gridSize === 'function') {
                finalGridSize = gridSize(mode) // ✅ full control
              } else if (typeof gridSize === 'number') {
                finalGridSize = gridSize
              } else {
                finalGridSize = { ...defaultGridSize, ...gridSize }
              }

              const { xs, md, lg, sm, xl } = getGridSize(mode, finalGridSize)

              const resolvedMode: Mode | undefined =
                typeof field.modeCondition === 'function'
                  ? (field.modeCondition(mode, watchedValues) as Mode)
                  : (field.modeCondition as Mode | undefined)

              let fieldVisible = isFieldVisible(field, mode, watchedValues)
              const resolvedDisabled =
                field.disabled === true
                  ? true
                  : typeof field.disableCondition === 'function'
                    ? field.disableCondition(mode, watchedValues)
                    : !!field.disableCondition

              if (mode == 'search') {
                field.now = false
              }

              if (field.visible === false || fieldVisible === false || !showWhenVisible) return null
              if (field.type != 'storage') {
                return (
                  <Grid
                    size={{ xs: xs, sm: isPrintMode ? lg : sm, md: md, lg: lg, xl: xl }}
                    key={`${field.name}-${field.type}-${field?.visibleModes?.join('-') || index}`}
                    style={{ display: fieldVisible ? 'block' : 'none' }}
                  >
                    <DynamicFormField
                      {...field}
                      control={control}
                      mode={field.mode || resolvedMode}
                      errors={errors[name]}
                      visible={visible}
                      screenMode={mode}
                      dataObject={{ ...(dataObject || {}), ...watchedValues }}
                      gridRef={gridRef}
                      locale={locale}
                      disabled={resolvedDisabled}
                      key={`${field.name}-${field.type}-${field.visibleModes?.join('-') || index}`}
                    />
                  </Grid>
                )
              }
            })}

            {renderAfterFields?.({
              values: watchedValues,
              errors,
              mode
            })}
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormComponent
