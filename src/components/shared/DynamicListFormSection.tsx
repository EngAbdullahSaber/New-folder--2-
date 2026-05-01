'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Button, Grid, Box, useFormContext, FormProvider } from '@/shared'
import { DynamicFormField } from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import type { Locale, Mode } from '@/shared'
import { useWatch, Controller, useForm } from 'react-hook-form'

interface DynamicListFormSectionProps {
  fields: any[]
  mode: Mode
  defaultValues: Record<string, any>
  locale?: string
  submitData: (data: Record<string, any>, errors: Record<string, any>) => void
}

export const DynamicListFormSection = ({
  fields,
  mode,
  defaultValues,
  locale,
  submitData
}: DynamicListFormSectionProps) => {
  const methods = useForm() // uses parent FormProvider
  const {
    control,
    formState: { errors },
    handleSubmit
  } = methods
  const [dictionary, setDictionary] = useState<any>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (locale) getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])

  const fieldNames = React.useMemo(() => fields.map(f => f.name), [fields.length])
  const watchedValuesArray = useWatch({ control, name: fieldNames })
  const watchedValues = React.useMemo(() => {
    return fieldNames.reduce(
      (acc, name, index) => {
        acc[name] = watchedValuesArray?.[index]
        return acc
      },
      {} as Record<string, any>
    )
  }, [fieldNames, watchedValuesArray])

  // Disable save button if any toggle field has no value selected
  const isSubmitDisabled = React.useMemo(() => {
    return fields
      .filter(f => f.type === 'toggle')
      .some(f => {
        const val = watchedValues?.[f.name]
        return val === null || val === undefined || val === ''
      })
  }, [fields, watchedValues])

  const onSubmit = () => {
    const data: Record<string, any> = {}
    const fieldErrors: Record<string, any> = {}

    fields.forEach(f => {
      data[f.name] = watchedValues?.[f.name]
      if (errors?.[f.name]) fieldErrors[f.name] = errors[f.name]
    })
    submitData(data, fieldErrors)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ margin: 0, padding: 0 }}>
        <Box
        // sx={theme => ({
        //   bgcolor: 'background.paper',
        //   p: 3,
        //   borderRadius: '10px',
        //   boxShadow: 3,
        //   border: `1px solid ${theme.palette.divider}`
        // })}
        >
          <Grid container spacing={3} ref={gridRef}>
            {fields.map((field, index) => {
              const { visible = true, visibleModes = [], name, required, requiredModes } = field
              const isFieldVisible = visible && (visibleModes.length === 0 || visibleModes.includes(mode))
              if (!isFieldVisible) return null

              // Determine if required applies for current mode
              const isRequired = required || (requiredModes && requiredModes.includes(mode))

              return (
                <Grid key={`${field.name}-${index}`} size={{ xs: 12 }}>
                  <Controller
                    name={name}
                    control={control}
                    rules={{
                      required: isRequired ? dictionary?.errors?.['required'] || 'الحقل مطلوب' : false
                    }}
                    render={({ field: controllerField, fieldState }) => (
                      <DynamicFormField
                        {...field}
                        {...controllerField}
                        control={control}
                        mode={mode}
                        errors={fieldState.error} // show error message
                        dataObject={{ ...defaultValues, ...watchedValues }}
                        gridRef={gridRef}
                        locale={locale}
                      />
                    )}
                  />
                </Grid>
              )
            })}
          </Grid>

          <Box display='flex' justifyContent='flex-end' mt={4}>
            <Button type='submit' variant='contained' disabled={isSubmitDisabled}>
              {dictionary?.actions?.['save'] || 'حفظ'}
            </Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default DynamicListFormSection
