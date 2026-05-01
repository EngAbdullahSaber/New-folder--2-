'use client'

import React from 'react'
import * as Shared from '@/shared'
import CustomAvatar from '@/@core/components/mui/Avatar'

export interface InfoDialogSection {
  title: string
  icon?: string
  type: 'fields' | 'items'
  fields?: any[]
  items?: any[]
  renderItem?: (item: any, index: number) => React.ReactNode
}

interface GenericInfoDialogProps {
  sections: InfoDialogSection[]
  locale: any
  dictionary: any
  formMethods: any
  onClose?: () => void
}

const GenericInfoDialog: React.FC<GenericInfoDialogProps> = ({ sections, locale, dictionary, formMethods, onClose }) => {
  const { control } = formMethods

  return (
    <Shared.FormProvider {...formMethods}>
      <Shared.Box sx={{ p: 2 }}>
        <Shared.Grid container spacing={4}>
          {sections.map((section, sectionIdx) => (
            <React.Fragment key={sectionIdx}>
              {sectionIdx > 0 && (
                <Shared.Grid size={{ xs: 12 }}>
                  <Shared.Divider sx={{ my: 2 }} />
                </Shared.Grid>
              )}

              <Shared.Grid size={{ xs: 12 }}>
                {/* Section Header */}
                <Shared.Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CustomAvatar skin='light' color='primary' size={28}>
                    <i className={section.icon || 'ri-information-line'} style={{ fontSize: '1.25rem' }} />
                  </CustomAvatar>
                  <Shared.Typography className='mx-2' variant='h6' sx={{ fontWeight: 600 }}>
                    {section.title}
                  </Shared.Typography>
                </Shared.Box>

                {/* Section Content */}
                {section.type === 'fields' && section.fields && (
                  <Shared.Grid container spacing={3}>
                    {section.fields.map((field: any, index: number) => (
                      <Shared.Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Shared.DynamicFormField
                          {...field}
                          control={control}
                          mode='show'
                          screenMode='show'
                          locale={locale}
                        />
                      </Shared.Grid>
                    ))}
                  </Shared.Grid>
                )}

                {section.type === 'items' && section.items && (
                  <Shared.Grid container spacing={2}>
                    {section.items.map((item, itemIdx) => (
                      <Shared.Grid
                        key={itemIdx}
                        size={{ xs: 12, md: 4 }}
                        sx={{
                          p: 3,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: theme => 
                            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                        
                          boxShadow: theme => 
                            theme.palette.mode === 'dark' 
                              ? 'none' 
                              : '0 4px 12px -2px rgba(0,0,0,0.08)',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: 'primary.main',
                            boxShadow: theme => 
                              theme.palette.mode === 'dark' 
                                ? '0 8px 24px -6px rgba(0,0,0,0.5)' 
                                : '0 12px 28px -4px rgba(0,0,0,0.12)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          },
                          '&:hover::before': { opacity: 1 }
                        }}
                      >
                        {section.renderItem ? (
                          section.renderItem(item, itemIdx)
                        ) : (
                          <Shared.Typography>{JSON.stringify(item)}</Shared.Typography>
                        )}
                      </Shared.Grid>
                    ))}
                  </Shared.Grid>
                )}
              </Shared.Grid>
            </React.Fragment>
          ))}
        </Shared.Grid>
      </Shared.Box>
    </Shared.FormProvider>
  )
}

export default GenericInfoDialog
