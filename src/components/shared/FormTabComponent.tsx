'use client'

import CustomAvatar from '@/@core/components/mui/Avatar'
import { usePrintMode } from '@/contexts/usePrintModeContext'
import { useScreenPermissions } from '@/hooks/useScreenPermission'
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
  FooterPrint
} from '@/shared'
import type { FormComponentProps, Locale, Mode } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useWatch } from 'react-hook-form'

export const FormTabComponent = ({
  fields,
  mode,
  headerConfig = {},
  tabConfig = [],
  locale = '',
  showHeaderPrint = true,
  allFormFields = [],
  onDataChange,
  detailsConfig = [],
  dataObject = {},
  showBarcode = false,
  recordId,
  barcodes = []
}: FormComponentProps & {
  onDataChange?: (data: Record<string, any>, errors: Record<string, any>) => void
  barcodes?: { value: string; label?: string }[]
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

  // ✅ Watch all fields (root fields + tab fields)
  const allFieldNames = React.useMemo(() => {
    const names = fields.map(f => f.name)
    tabConfig.forEach(tab => {
      tab.fields?.forEach((f: any) => names.push(f.name))
    })
    return names
  }, [fields, tabConfig])

  const watchedValuesArray = useWatch({
    control,
    name: allFieldNames
  })

  const watchedValues = React.useMemo(() => {
    return (allFieldNames || []).reduce(
      (acc, name, index) => {
        acc[name] = watchedValuesArray?.[index]
        return acc
      },
      {} as Record<string, any>
    )
  }, [allFieldNames, watchedValuesArray])

  const watchedSignature = JSON.stringify(watchedValuesArray)

  useEffect(() => {
    if (!onDataChange) return

    const data: Record<string, any> = {}
    const fieldErrors: Record<string, any> = {}

    fields.forEach((f: any) => {
      data[f.name] = watchedValues?.[f.name]
      if (errors?.[f.name]) fieldErrors[f.name] = errors[f.name]
    })

    onDataChange(data, fieldErrors)
  }, [watchedSignature, onDataChange, fields, errors, watchedValues])

  // ✅ Watch all detail fields
  const allDetailKeys = React.useMemo(() => detailsConfig.map(config => config.key), [detailsConfig])
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

  const memoTabConfig = useMemo(() => {
    if (Array.isArray(tabConfig) && tabConfig.length > 0) {
      return tabConfig
    }

    return []
  }, [tabConfig])

  // ✅ Helper to group fields for 2-column layout
  const groupFieldsForPrint = (fieldsToGroup: any[]) => {
    const fieldsWithValues = fieldsToGroup.filter((field: any) => {
      if (
        field.type === 'file' ||
        field.type === 'personal_picture' ||
        field.type === 'storage' ||
        field.type === 'multi_file' ||
        field.visible === false
      )
        return false

      const fieldValue = watchedValues[field.name]
      return !isValueEmpty(fieldValue)
    })

    const renderedRows: any[] = []
    let currentRow: any[] = []

    fieldsWithValues.forEach((field: any) => {
      const isFullWidth =
        field.gridSize === 12 ||
        (typeof field.gridSize === 'object' && field.gridSize.xs === 12) ||
        field.type === 'textarea' ||
        field.type === 'rich_text'

      if (isFullWidth) {
        if (currentRow.length > 0) {
          renderedRows.push(currentRow)
          currentRow = []
        }
        renderedRows.push([field])
      } else {
        currentRow.push(field)
        if (currentRow.length === 2) {
          renderedRows.push(currentRow)
          currentRow = []
        }
      }
    })

    if (currentRow.length > 0) {
      renderedRows.push(currentRow)
    }

    return renderedRows
  }

  const renderPrintRows = (rows: any[]) => {
    return rows.map((row, rowIndex) => {
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
                dataObject={watchedValues}
                gridRef={gridRef}
                locale={locale}
              />
            </td>
          </tr>
        )
      }

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
                  dataObject={watchedValues}
                  gridRef={gridRef}
                  locale={locale}
                />
              </td>
            </React.Fragment>
          ))}
        </tr>
      )
    })
  }

  const renderTabbedMasterPrintView = () => {
    if (!memoTabConfig?.length) return null

    return memoTabConfig.map((tab, tabIndex) => {
      const rows = groupFieldsForPrint(tab.fields || [])
      if (rows.length === 0) return null

      return (
        <div className='print-view mb-4' key={tabIndex}>
          <table className='preview-table'>
            <thead>
              <tr>
                <th colSpan={4}>
                  <Typography className='mx-2 bold-title'>{dictionary?.titles?.[tab.label] || tab.label}</Typography>
                </th>
              </tr>
            </thead>
            <tbody>{renderPrintRows(rows)}</tbody>
          </table>
        </div>
      )
    })
  }

  // ✅ Render print view for master fields
  const renderMasterPrintView = () => {
    const rows = groupFieldsForPrint(fields || [])
    if (rows.length === 0) return null

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
          <tbody>{renderPrintRows(rows)}</tbody>
        </table>
      </div>
    )
  }

  // ✅ Render print view for each detail table
  const renderDetailPrintView = (config: { key: string; fields: any[]; title: string }, index: number) => {
    const detailRows = Array.isArray(detailsData?.[index]) ? detailsData[index] : []

    if (detailRows.length === 0) {
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
            </thead>
            <tbody>
              <tr>
                <td colSpan={config.fields.length + 1} className='text-center py-2'>
                  {dictionary?.titles?.['no_elements_selected'] || 'لا يوجد عناصر محددة'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

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
                    <td key={fieldIndex} className='preview-value'>
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

  return (
    <>
      {showHeaderPrint && <HeaderPrint dictionary={dictionary} />}

      {/* ✅ Print View */}
      {mode === 'show' && (
        <div className='print-container'>
          <div className='flex justify-between items-center mb-4 px-2'>
            <Typography variant='h5' color='primary'>
              {screenData?.object_name_ar
                ? screenData?.object_name_ar
                : dictionary?.titles?.[headerConfig.title || 'main_information']}
              <span> {toggleArrowIcon}</span>
              {dictionary?.actions?.['show']}
            </Typography>
          </div>
          {/* Master fields */}
          {/* {tabConfig?.length ? renderTabbedMasterPrintView() : renderMasterPrintView()} */}
          {/* {memoTabConfig?.length > 0 ? renderTabbedMasterPrintView() : renderMasterPrintView()} */}
          {/* Detail tables */}

          {renderTabbedMasterPrintView()}
          {detailsConfig.map((config, index) => renderDetailPrintView(config, index))}

          <FooterPrint showBarcode={showBarcode} recordId={recordId} barcodes={barcodes} />
        </div>
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
            {fields.map((field: any) => {
              const { gridSize, defaultGridSize, visible = true, name, visibleModes = [] } = field
              const fieldValue = watchedValues[name]

              let normalizedGridSize: any = {}
              if (typeof gridSize === 'function') normalizedGridSize = gridSize(mode)
              else if (typeof gridSize === 'object') normalizedGridSize = { ...gridSize }

              const finalGridSize =
                typeof gridSize === 'number' ? gridSize : { ...defaultGridSize, ...normalizedGridSize }

              const { xs, md, lg, sm, xl } = getGridSize(mode, finalGridSize)

              const resolvedMode: Mode | undefined =
                typeof field.modeCondition === 'function'
                  ? (field.modeCondition(mode) as Mode)
                  : (field.modeCondition as Mode | undefined)

              let isFieldVisible = visible && (visibleModes.length === 0 || visibleModes.includes(mode))
              if (!visible && fieldValue) isFieldVisible = true

              const resolvedDisabled =
                field.disabled === true
                  ? true
                  : typeof field.disableCondition === 'function'
                    ? field.disableCondition(mode, watchedValues)
                    : !!field.disableCondition

              if (field.type != 'empty') {
                return (
                  <Grid
                    size={{ xs: xs, sm: isPrintMode ? lg : sm, md: md, lg: lg, xl: xl }}
                    key={name}
                    style={{ display: isFieldVisible ? 'block' : 'none' }}
                  >
                    <DynamicFormField
                      {...field}
                      control={control}
                      mode={field.mode || resolvedMode}
                      errors={errors[name]}
                      visible={visible}
                      screenMode={mode}
                      dataObject={watchedValues}
                      gridRef={gridRef}
                      locale={locale}
                      disabled={resolvedDisabled}
                    />
                  </Grid>
                )
              }
            })}
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

export default FormTabComponent
