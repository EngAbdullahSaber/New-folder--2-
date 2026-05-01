// 'use client'

// import { Grid, Header, FormProvider, FormComponent } from '@/shared'
// import { useRecordForm } from '@/hooks/useRecordForm'
// import { DynamicFormFieldProps, Mode } from '@/shared'

// interface DynamicFormProps {
//   schemaBuilder: (mode: Mode) => any // Schema builder function (to be passed based on the mode)
//   defaultValues: Record<string, any> // Default values for the form
//   formTitle: string // Title for the form
//   formRouter: string // Router path for the form
//   apiEndpoint: string // API endpoint for data submission
//   fields: (mode: Mode) => DynamicFormFieldProps[] // Fields generator function that takes `mode`
//   mode: Mode // Pass the mode here to generate the fields dynamically
// }

// export const EntityDetails = ({
//   schemaBuilder,
//   defaultValues,
//   formTitle,
//   formRouter,
//   apiEndpoint,
//   fields,
//   mode
// }: DynamicFormProps) => {
//   const { formMethods, onSubmit, handleCancel, handleMenuOptionClick } = useRecordForm<any>(
//     apiEndpoint,
//     formRouter,
//     schemaBuilder,
//     [],
//     defaultValues
//   )

//   // Generate fields dynamically based on the mode
//   const dynamicFields = fields(mode)

//   return (
//     <FormProvider {...formMethods}>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <Header
//             title={formTitle}
//             onCancel={handleCancel}
//             onSaveSuccess={onSubmit}
//             mode={mode}
//             onMenuOptionClick={handleMenuOptionClick}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <FormComponent screenMode={mode} fields={dynamicFields} mode={mode} />
//         </Grid>
//       </Grid>
//     </FormProvider>
//   )
// }

// export default EntityDetails
