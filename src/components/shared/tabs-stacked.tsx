// import React, { useEffect, useState } from 'react'
// import { TabContext, TabList, TabPanel, Grid, Tab, FormComponent, Mode, Locale } from '@/shared' // Adjust imports to your project structure
// import { getDictionary } from '@/utils/getDictionary'

// interface TabConfig {
//   label: string
//   fields?: any[] // Primary fields (optional)
//   fieldsArray?: { fields: any[]; gridSize?: number; label?: string }[] // Array of fields with gridSize (optional)
//   gridSize?: number // Grid size for the primary fields (if fieldsArray is not used)
// }

// interface TabStackedProps {
//   tabConfig: TabConfig[]
//   mode: Mode // For form modes
//   locale?: any
//   tabVal: any
// }

// export const SharedForm: React.FC<TabStackedProps> = ({ tabConfig, mode, locale = '', tabVal = 0 }) => {
//   const [tabValue, setTabValue] = useState<string>(tabVal)
//   const [dictionary, setDictionary] = useState<any>(null)

//   useEffect(() => {
//     getDictionary(locale as Locale).then((res: any) => {
//       setDictionary(res)
//     })
//   }, [locale])

//   const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
//     setTabValue(newValue)
//   }
//   //console.log('tabConfig', tabConfig)
//   return (
//     <>
//       {/* Tabs View */}
//       <div className='system-view'>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TabContext value={tabValue}>
//               <TabList onChange={handleTabChange}>
//                 {tabConfig.map((tab, index) => (
//                   <Tab key={index} value={index.toString()} label={dictionary?.titles?.[tab.label]} />
//                 ))}
//               </TabList>
//               {tabConfig.map((tab, index) => (
//                 <TabPanel key={index} value={index.toString()} className='previewCard'>
//                   <Grid container spacing={2}>
//                     {tab.fieldsArray ? (
//                       // Render multiple fields arrays with gridSize
//                       tab.fieldsArray.map((fieldGroup, groupIndex) => (
//                         <Grid
//                           key={groupIndex}
//                           item
//                           lg={fieldGroup.gridSize || 12}
//                           xl={fieldGroup.gridSize || 12}
//                           xs={12}
//                         >
//                           <FormComponent
//                             headerConfig={{ title: fieldGroup.label }}
//                             fields={fieldGroup.fields}
//                             mode={mode}
//                             screenMode={mode}
//                             locale={locale}
//                           />
//                         </Grid>
//                       ))
//                     ) : (
//                       // Render a single fields array
//                       <Grid item xs={tab.gridSize || 12}>
//                         <FormComponent
//                           headerConfig={{ title: tab.label }}
//                           fields={tab.fields || []}
//                           mode={mode}
//                           screenMode={mode}
//                           locale={locale}
//                         />
//                       </Grid>
//                     )}
//                   </Grid>
//                 </TabPanel>
//               ))}
//             </TabContext>
//           </Grid>
//         </Grid>
//       </div>

//       {/* Stacked View */}
//       <div className='print-view previewCard'>
//         {tabConfig.map((tab, index) => (
//           <Grid key={index} item xs={12}>
//             <FormComponent
//               headerConfig={{ title: tab.label }}
//               fields={tab.fields || []}
//               mode={mode}
//               screenMode={mode}
//               locale={locale}
//             />
//           </Grid>
//         ))}
//       </div>
//     </>
//   )
// }

// export default SharedForm

import React, { useEffect, useState } from 'react'
import {
  TabContext,
  TabList,
  TabPanel,
  Grid,
  Tab,
  FormComponent,
  Mode,
  Locale,
  HeaderPrint,
  FooterPrint,
  Button,
  DynamicFormTable,
  CheckboxRadioGrid,
  mapListToLabelValue,
  FormActions
} from '@/shared'
import { getDictionary } from '@/utils/getDictionary'
import { useTabFormContext } from '@/contexts/useTabForm' // ✅ Use renamed context
import { useRouter } from 'next/navigation'

interface DynamicTableConfig {
  title: string
  fields: any[]
  dataKey: string
  apiEndPoint: string
  gridSize?: number
  type?: 'table' | 'checkbox' | 'radio'
  apiUrl?: string
  labelProp?: string
  rowModal?: boolean
  enableDelete?: boolean
  enableEmptyRows?: boolean
  options?: any[]
  keyProp?: string
  editProp?: string
  submitKey?: string
  mode?: Mode
  order?: number
}

interface TabConfig {
  label: string
  fields?: any[]
  fieldsArray?: { fields: any[]; gridSize?: number; label?: string; order?: number }[]
  gridSize?: number
  order?: number
  tables?: DynamicTableConfig[]
  extraSections?: {
    fields: any[]
    gridSize?: number
    label?: string
    order?: number
  }[]
}

interface TabStackedProps {
  tabConfig: TabConfig[]
  mode: Mode
  locale?: any
  allFormFields?: any[]
  handleTabChange?: (event: React.SyntheticEvent, newValue: string) => void // ✅ Add
  handleNextTab?: () => void // ✅ Add
  tabValue?: string // ✅ Add
  validatedTabs?: Set<number> // ✅ Add (optional)
  attemptedTabs?: Set<number> // ✅ Add (optional)
  detailsData?: Record<string, any[]>
  setDetailsData?: React.Dispatch<React.SetStateAction<any>>
  getDetailsErrors?: (key: string) => any
  detailsHandlers: Record<string, (data: any[]) => void>
  dataObject: any
  printForm?: boolean
  showBarcode?: boolean
  recordId?: string
  onCancel?: () => void
  onSaveSuccess?: (data: any) => void
  saveLabelKey?: string
  editLabelKey?: string
  searchLabelKey?: string
  cancelLabelKey?: string
  hideNavigationBtns?: Boolean
}

export const SharedForm: React.FC<TabStackedProps> = ({
  tabConfig,
  mode,
  locale = '',
  allFormFields = [],
  handleTabChange: externalHandleTabChange, // ✅ Add
  handleNextTab, // ✅ Add
  tabValue: externalTabValue, // ✅ Add
  validatedTabs, // ✅ Add
  attemptedTabs,
  setDetailsData,
  detailsData,
  getDetailsErrors,
  detailsHandlers,
  dataObject,
  printForm = true,
  showBarcode = false,
  recordId,
  onCancel,
  onSaveSuccess,
  saveLabelKey,
  editLabelKey,
  searchLabelKey,
  cancelLabelKey,
  hideNavigationBtns = false
}) => {
  const { tabContextValue, setTabContextValue } = useTabFormContext()
  const [dictionary, setDictionary] = useState<any>(null)
  const router = useRouter()

  // ✅ Use external tab control if provided, otherwise use internal
  const activeTabValue = externalTabValue !== undefined ? externalTabValue : tabContextValue
  const activeHandleTabChange =
    externalHandleTabChange ||
    ((_: React.SyntheticEvent, newValue: string) => {
      setTabContextValue(newValue)
    })

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  const currentTabIndex = Number(activeTabValue)
  const isLastTab = currentTabIndex === tabConfig.length - 1

  const buildOrderedItems = (tab: TabConfig) => {
    const items: any[] = []

    if (tab.fields?.length) {
      items.push({
        type: 'fields',
        order: tab?.order ?? 0,
        data: tab.fields,
        gridSize: tab.gridSize,
        label: tab.label
      })
    }

    tab.fieldsArray?.forEach(group => {
      items.push({
        type: 'fieldsArray',
        order: group.order ?? 0,
        data: group
      })
    })

    tab.tables?.forEach(table => {
      items.push({
        type: table.type === 'checkbox' || table.type === 'radio' ? table.type : 'table',
        order: table.order ?? 0,
        data: table
      })
    })

    tab.extraSections?.forEach(section => {
      items.push({
        type: 'extra',
        order: section.order ?? 0,
        data: section
      })
    })

    return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  return (
    <>
      {/* Tabs View */}
      <div className='system-view'>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TabContext value={activeTabValue}>
              <TabList onChange={activeHandleTabChange}>
                {tabConfig.map((tab, index) => (
                  <Tab
                    key={index}
                    value={index.toString()}
                    label={dictionary?.titles?.[tab.label]}
                    // ✅ Optional: Add visual indicator for attempted/validated tabs
                    icon={
                      attemptedTabs?.has(index) && !validatedTabs?.has(index) ? (
                        <i className='ri-error-warning-line' style={{ color: 'red' }} />
                      ) : validatedTabs?.has(index) ? (
                        <i className='ri-check-line' style={{ color: 'green' }} />
                      ) : undefined
                    }
                    iconPosition='end'
                  />
                ))}
              </TabList>

              {tabConfig.map((tab, index) => {
                const orderedItems = buildOrderedItems(tab)

                return (
                  <TabPanel key={index} value={index.toString()} className='previewCard'>
                    <Grid container spacing={2}>
                      {orderedItems.map((item, idx) => {
                        switch (item.type) {
                          case 'fields':
                            return (
                              <Grid key={idx} size={{ xs: item.gridSize || 12 }}>
                                <FormComponent
                                  headerConfig={{ title: item.label }}
                                  fields={item.data}
                                  mode={mode}
                                  screenMode={mode}
                                  locale={locale}
                                  printForm={printForm}
                                  dataObject={dataObject}
                                />
                              </Grid>
                            )

                          case 'fieldsArray':
                            return (
                              <Grid key={idx} size={{ xs: item.data.gridSize || 12 }}>
                                <FormComponent
                                  headerConfig={{ title: item.data.label }}
                                  fields={item.data.fields}
                                  mode={mode}
                                  screenMode={mode}
                                  // showHeaderPrint={false}
                                  locale={locale}
                                />
                              </Grid>
                            )

                          case 'table':
                            return (
                              <Grid key={idx} size={{ xs: item.data.gridSize || 12 }}>
                                <DynamicFormTable
                                  {...item.data}
                                  initialData={detailsData?.[item.data.dataKey] ?? []}
                                  onDataChange={detailsHandlers?.[item.data.dataKey]}
                                  errors={getDetailsErrors?.(item.data.dataKey) ?? []}
                                  locale={locale}
                                  mode={mode}
                                  rowModal={item?.data?.rowModal ?? true}
                                  dataObject={dataObject}
                                  enableDelete={item.data?.enableDelete ?? true}
                                  detailsKey={item.data.dataKey}
                                  enableEmptyRows={item?.data?.enableEmptyRows ?? true}
                                />
                              </Grid>
                            )

                          case 'checkbox':
                          case 'radio':
                            return (
                              <Grid key={idx} size={{ xs: 12 }}>
                                <CheckboxRadioGrid
                                  {...item.data}
                                  type={item.type}
                                  mode={mode}
                                  initialData={detailsData?.[item.data.dataKey] ?? []}
                                  onDataChange={detailsHandlers?.[item.data.dataKey]}
                                  options={mapListToLabelValue(
                                    item.data.options,
                                    item.data.labelProp,
                                    item.data.keyProp
                                  )}
                                />
                              </Grid>
                            )

                          case 'extra':
                            return (
                              <Grid key={idx} size={{ xs: item.data.gridSize || 12 }}>
                                <FormComponent
                                  headerConfig={{ title: item.data.label }}
                                  fields={item.data.fields}
                                  mode={mode}
                                  screenMode={mode}
                                  locale={locale}
                                  showHeaderPrint={false}
                                  printForm={printForm}
                                  dataObject={dataObject}
                                />
                              </Grid>
                            )

                          default:
                            return null
                        }
                      })}

                      {/* Navigation & Form Actions */}
                      <Grid size={{ xs: 12 }} className='mt-3'>
                        {mode === 'add' ? (
                          <>
                            {/* Add Mode: Next Button on non-last tabs if not hidden, otherwise Save Button */}
                            {!isLastTab ? (
                              handleNextTab && !hideNavigationBtns ? (
                                <div className='flex w-full justify-between items-center mt-3'>
                                  <div className='flex justify-start w-1/2'>
                                    <Button variant='outlined' color='error' onClick={onCancel || (() => router.back())}>
                                      {'إلغاء'}
                                    </Button>
                                  </div>
                                  <div className='flex justify-end w-1/2'>
                                    <Button variant='contained' onClick={handleNextTab}>
                                      {'التالى'}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                onSaveSuccess && (
                                  <FormActions
                                    locale={locale}
                                    onCancel={onCancel}
                                    onSaveSuccess={onSaveSuccess}
                                    mode={mode}
                                    saveLabelKey={saveLabelKey}
                                    editLabelKey={editLabelKey}
                                    searchLabelKey={searchLabelKey}
                                    cancelLabelKey={cancelLabelKey}
                                  />
                                )
                              )
                            ) : (
                              onSaveSuccess && (
                                <FormActions
                                  locale={locale}
                                  onCancel={onCancel}
                                  onSaveSuccess={onSaveSuccess}
                                  mode={mode}
                                  saveLabelKey={saveLabelKey}
                                  editLabelKey={editLabelKey}
                                  searchLabelKey={searchLabelKey}
                                  cancelLabelKey={cancelLabelKey}
                                />
                              )
                            )}
                          </>
                        ) : (
                          /* Edit/Search Mode: Save Button (FormActions) on all tabs, No Next Button */
                          onSaveSuccess && (
                            <FormActions
                              locale={locale}
                              onCancel={onCancel}
                              onSaveSuccess={onSaveSuccess}
                              mode={mode}
                              saveLabelKey={saveLabelKey}
                              editLabelKey={editLabelKey}
                              searchLabelKey={searchLabelKey}
                              cancelLabelKey={cancelLabelKey}
                            />
                          )
                        )}
                      </Grid>
                    </Grid>
                  </TabPanel>
                )
              })}
            </TabContext>
          </Grid>
        </Grid>
      </div>

      {/* Print View */}
      <div className='print-view previewCard'>
        <HeaderPrint dictionary={dictionary} />
        <FooterPrint showBarcode={showBarcode} recordId={recordId} />

        <Grid container spacing={2}>
          {tabConfig.map((tab, index) => {
            const orderedItems = buildOrderedItems(tab)

            return (
              <Grid key={index} size={{ xs: 12 }}>
                {orderedItems.map((item, idx) => {
                  switch (item.type) {
                    case 'fields':
                      return (
                        <Grid key={idx} size={{ xs: item.gridSize || 12 }}>
                          <FormComponent
                            headerConfig={{ title: item?.label }}
                            fields={item?.fields || []}
                            mode={mode}
                            screenMode={mode}
                            locale={locale}
                            showHeaderPrint={false}
                            printForm={printForm}
                            allFormFields={allFormFields}
                            printInline={true}
                            dataObject={dataObject}
                          />
                        </Grid>
                      )

                    case 'table':
                      return (
                        <Grid key={idx} size={{ xs: item.data.gridSize || 12 }}>
                          <DynamicFormTable
                            {...item.data}
                            initialData={detailsData?.[item.data.dataKey] ?? []}
                            mode='show'
                            enableDelete={false}
                            enableEmptyRows={false}
                          />
                        </Grid>
                      )

                    case 'extra':
                      return (
                        <Grid key={idx} size={{ xs: item.data.gridSize || 12 }}>
                          <FormComponent
                            headerConfig={{ title: item?.label }}
                            fields={item?.fields || []}
                            mode={mode}
                            screenMode={mode}
                            locale={locale}
                            showHeaderPrint={false}
                            printForm={printForm}
                            allFormFields={allFormFields}
                            printInline={true}
                            dataObject={dataObject}
                          />
                        </Grid>
                      )

                    default:
                      return null
                  }
                })}
              </Grid>
            )
          })}
        </Grid>
      </div>
    </>
  )
}

export default SharedForm
