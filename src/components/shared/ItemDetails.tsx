import React from 'react'
import { Card, CardContent, Typography, Grid } from '@mui/material'
import classNames from 'classnames'
import { DynamicFormField, DynamicFormFieldProps, DynamicFormTable } from '@/shared'
import CustomAvatar from '@/@core/components/mui/Avatar'

export interface ItemDetailsFieldConfig extends Omit<DynamicFormFieldProps, 'type'> {
  type?: DynamicFormFieldProps['type'] | 'table'
  fields?: DynamicFormFieldProps[]
  apiEndPoint?: string
  // Custom rendering
  render?: (value: any, data: Record<string, any>) => React.ReactNode
  element?: React.ReactNode

  // grid sizes (optional)
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export type ItemDetailsSection = {
  titleKey: string
  fields: ItemDetailsFieldConfig[]
  icon?: { name?: string; color?: string }
}

type ItemDetailsProps = {
  sections: ItemDetailsSection[]
  dictionary: any
  data: Record<string, any>
  locale?: string
  mode?: 'show' | 'edit'
  isPrintMode?: boolean
}

const ItemDetails: React.FC<ItemDetailsProps> = ({
  sections,
  dictionary,
  data,
  locale,
  mode = 'show',
  isPrintMode = false
}) => {
  if (!sections?.length) return null

  const getValueByPath = (obj: any, path?: string) => {
    if (!path) return undefined

    return path.split('.').reduce((acc, key) => {
      if (Array.isArray(acc)) {
        if (key === 'first') return acc[0]
        if (key === 'last') return acc[acc.length - 1]
        if (!isNaN(Number(key))) return acc[Number(key)]
      }
      return acc?.[key]
    }, obj)
  }

  return (
    <div className='space-y-6 mt-2'>
      {sections.map((section, secIndex) => {
        const visibleFields = section.fields.filter(field => {
          const value = getValueByPath(data, field.name)
          return (
            value !== null &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0) &&
            !(typeof value === 'string' && value.trim() === '')
          )
        })

        if (visibleFields.length === 0) return null

        return (
          <Card key={secIndex} style={{ display: !isPrintMode ? 'block' : 'none' }}>
            <CardContent>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center' }} className='mb-4'>
                <CustomAvatar skin='light' color={'primary'} size={30}>
                  <i className={classNames(section.icon?.name || 'ri-align-justify', 'text-lg')} />
                </CustomAvatar>

                <Typography className='mx-2' variant='h6'>
                  {dictionary?.titles?.[section.titleKey] || section.titleKey}
                </Typography>
              </div>

              {/* Fields */}
              <Grid container spacing={4}>
                {visibleFields.map(field => {
                  const value = data[field.name]
                  const isTable = field.type === 'table'
                  let { xs = 12, sm = 6, md = 6, lg = 6, xl = 6, name } = field
                  if (isTable) {
                    xs = sm = md = lg = xl = 12
                  }
                  return (
                    <Grid
                      key={name}
                      size={{
                        xs,
                        sm: isPrintMode ? lg : sm,
                        md,
                        lg,
                        xl
                      }}
                    >
                      {/* Custom render function */}
                      {field.render ? (
                        field.render(value, data)
                      ) : /* Static React element */
                      field.element ? (
                        field.element
                      ) : /*  Table */
                      isTable && Array.isArray(value) ? (
                        <DynamicFormTable
                          title={field.label}
                          fields={(field.fields || []) as any}
                          initialData={value}
                          mode={mode}
                          errors={[]}
                          locale={locale}
                          dataObject={data}
                          apiEndPoint={field?.apiEndPoint}
                          // name={name}
                          onDataChange={() => {}}
                        />
                      ) : (
                        /* Default field */
                        <DynamicFormField
                          {...field}
                          type={field.type as Exclude<typeof field.type, 'table'>}
                          dataObject={data}
                          locale={locale}
                          mode={mode}
                          readOnly
                        />
                      )}
                      {/* {field.type === 'table' && Array.isArray(value) ? (
                        <DynamicFormTable
                          title={field.label}
                          fields={field.fields || []}
                          initialData={value}
                          mode={mode}
                          errors={[]}
                          locale={locale}
                          dataObject={data}
                          name={name}
                          onDataChange={() => {}}
                        />
                      ) : (
                        <DynamicFormField
                          {...field}
                          type={field.type as Exclude<typeof field.type, 'table'>}
                          dataObject={data}
                          locale={locale}
                          mode={mode}
                          readOnly
                        />
                      )} */}
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default ItemDetails
