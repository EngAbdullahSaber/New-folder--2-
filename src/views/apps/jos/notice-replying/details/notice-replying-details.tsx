'use client'

import * as Shared from '@/shared'
import { useState, useMemo } from 'react'
import type { Locale } from '@/configs/i18n'
import { getDictionary } from '@/utils/getDictionary'
import { useRouter } from 'next/navigation'

// Import new components
import NoticeReplyingMasterForm from './NoticeReplyingMasterForm'
import NoticeReplyingDetailsTable from './NoticeReplyingDetailsTable'
import NoticeReplyingChat from './NoticeReplyingChat'
import { ComponentNoticeGeneralProps } from '@/types/pageModeType'

type NoticeOrderData = Shared.InferFieldType<any>
const NoticesOrderDetailsTableFields: Shared.DynamicFormTableFieldProps[] = [
  {
    name: 'noticed_department_id',
    label: 'noticed_department',
    type: 'select',
    apiUrl: '/def/departments',
    labelProp: 'department_name_ar',
    keyProp: 'id',
    viewProp: 'noticeDepartment.department_name_ar',
    requiredModes: ['add', 'edit'],
    gridSize: 4,
    align: 'start'
  },
  {
    name: 'noticed_personal_id',
    label: 'noticed_personal_id',
    type: 'select',
    apiUrl: '/def/personal',
    labelProp: 'id',
    keyProp: 'id',
    displayProps: ['id_no', 'full_name_ar'],
    gridSize: 4,
    cache: false,
    viewProp: 'personal.full_name_ar',
    searchProps: ['id_no', 'full_name_ar', 'id']
  },
  // {
  //   name: 'notice_status_type_id',
  //   label: 'notice_status_type_details',
  //   type: 'select',
  //   apiUrl: '/jos/notice-status-types',
  //   labelProp: 'name_ar',
  //   viewProp: 'noticeStatusType.name_ar',
  //   modeCondition: (mode: Shared.Mode) => mode,
  //   requiredModes: ['add', 'edit'],
  //   width: '20%',
  //   gridSize: 6
  // }
]

const NoticeOrderDetailsFields: Shared.DynamicFormFieldProps[] = [
  {
    name: 'id',
    label: 'id',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 4
  },

  {
    name: 'notice_date',
    label: 'notice_date',
    type: 'date',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 4,
    showTime: true,
    showHijri: false
  },
  {
    name: 'notice_importance_id',
    label: 'notice_importance_id',
    type: 'select',
    apiUrl: '/jos/notice-importances',
    labelProp: 'name_ar',
    keyProp: 'id',
    viewProp: 'noticeImportance.name_ar',
    modeCondition: (mode: Shared.Mode) => 'show',
    gridSize: 4
  },

  {
    name: 'parnet_category_id',
    label: 'notice_parent_category',
    apiUrl: '/jos/notice-categories',
    labelProp: 'name',
    keyProp: 'id', type: "select",
    viewProp: "noticeParentCategory.name",
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 6
  },
  {
    name: 'category_id',
    label: 'notice_sub_category',
    type: 'select',
    apiUrl: '/jos/notice-categories',
    labelProp: 'name',
    keyProp: 'id', viewProp: 'noticeCategory.name',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 6
  },

  {
    name: 'notice_title',
    label: 'notice_title',
    type: 'text',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 12
  },

  {
    name: 'notice_type',
    label: 'notice_type',
    type: 'select',
    options: Shared.noticeTypeList,
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 6
  },


  {
    name: 'notice_way_id',
    label: 'notice_order_way',
    type: 'select',
    apiUrl: '/jos/notice-ways',
    labelProp: 'name_ar',
    keyProp: 'id',
    viewProp: 'noticeWay.name_ar',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 6
  },


  {
    name: 'notice_status_type_id',
    label: 'status',
    type: 'select',
    apiUrl: '/jos/notice-status-types',
    labelProp: 'name_ar',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 6,
    viewProp: "noticeStatusType.name_ar"
  },

  {
    name: 'notice_department_id',
    label: 'notice_department',
    type: 'select',
    apiUrl: '/def/departments',
    labelProp: 'department_name_ar',
    keyProp: "id",
    viewProp: 'noticeDepartment.department_name_ar',
    modeCondition: (mode: Shared.Mode) => "show",
    cache: false
  },

  {
    name: 'issued_department_id',
    label: 'issued_dept_id',
    type: 'select',
    apiUrl: '/def/departments',
    labelProp: 'department_name_ar',
    keyProp: "id",
    viewProp: 'issuedDepartment.department_name_ar',
    modeCondition: (mode: Shared.Mode) => {
      if (mode !== 'search') return 'show'
      else return mode
    },
    visibleModes: ['show', 'search'],
    cache: false,
  },

  {
    name: 'reference_id',
    label: 'reference_id',
    type: 'number',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 6
  },
  {
    name: 'notice_content',
    label: 'notice_content',
    type: 'rich_text',
    modeCondition: (mode: Shared.Mode) => "show",
    gridSize: 12
  }
]


const NoticeReplyingDetails = ({ scope }: ComponentNoticeGeneralProps) => {
  const [dictionary, setDictionary] = useState<any>(null)
  const { user, userDepartments } = Shared.useSessionHandler()
  const currentUserId = user?.personal?.id
  const userDeptIds = useMemo(() => userDepartments?.map((d: any) => d.id) || [], [userDepartments])

  const { lang: locale } = Shared.useParams()
  Shared.useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const { isPrintMode } = Shared.usePrintMode()
  const [tabValue, setTabValue] = useState('1')
  const [depts, setDepts] = useState<any[]>([])
  const [selectedDeptId, setSelectedDeptId] = useState<any>(null)
  const selectedDept = useMemo(() => depts.find(d => d.id === selectedDeptId) || depts[0] || {}, [depts, selectedDeptId])
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [messagesByDept, setMessagesByDept] = useState<Record<number, any[]>>({})
  const [statusTypes, setStatusTypes] = useState<any[]>([])
  const { accessToken } = Shared.useSessionHandler()
  const chatContainerRef = Shared.useRef<HTMLDivElement>(null)
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null)
  const isFirstRender = Shared.useRef(true)
  const tabValueRef = Shared.useRef(tabValue)
  Shared.useEffect(() => {
    tabValueRef.current = tabValue
  }, [tabValue])

  const memoizedFields = useMemo(() => {
    return NoticeOrderDetailsFields.map(field => ({
      ...field,
      modeCondition: (mode: Shared.Mode) => (scope === 'operation-center' ? mode : 'show')
    }))
  }, [scope])

  // Form handling for notice order master form
  const {
    formMethods,
    mode,
    onSubmit,
    handleCancel,
    handleMenuOptionClick,
    dataModel,
    getDetailsErrors,
    setDetailsData,
    detailsData,
    detailsHandlers,
    refetchRecord,
    setError,
    setSuccess
  } = Shared.useRecordForm<NoticeOrderData>({
    apiEndpoint: '/jos/notice-orders',
    routerUrl: { default: `/apps/jos/notice-replying/${scope}` },
    fields: memoizedFields,
    initialDetailsData: {
      noticeOrderDetails: []
    },
    onSaveSuccess: () => { },
    detailsTablesConfig: {
      noticeOrderDetails: { fields: NoticesOrderDetailsTableFields, trackIndex: true }
    }
  })

  Shared.useEffect(() => {
    if (accessToken && statusTypes.length === 0) {
      Shared.apiClient.get('/jos/notice-status-types', {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then((res: any) => {
        setStatusTypes(res.data?.data || res.data || [])
      }).catch((err: any) => console.error('Failed to fetch status types', err))
    }
  }, [accessToken, statusTypes.length])

  const fetchMessages = Shared.useCallback(() => {
    if (selectedDeptId && tabValueRef.current === '2' && accessToken) {
      Shared.apiClient.post('/jos/notice-order-replies/data', {
        notices_order_d_id: selectedDeptId
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then((res: any) => {
        const replies = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        setMessagesByDept(prev => ({
          ...prev,
          [selectedDeptId]: replies
        }))
      }).catch((error: any) => {
        console.error('Failed to fetch messages', error)
        if (setError) {
          setError(
            error?.response?.data?.message || (locale === 'ar' ? 'حدث خطأ أثناء جلب الرسائل' : 'Error fetching messages')
          )
        }
        Shared.scrollToTop()
      })
    }
  }, [selectedDeptId, accessToken, locale, setError])

  // Consolidate fetching logic in the effect below to avoid double calls

  const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setStatusAnchorEl(event.currentTarget)
  }

  const handleStatusClose = () => {
    setStatusAnchorEl(null)
  }

  const handleStatusSelect = (newStatus: string) => {
    setDepts(prev => prev.map(d => d.id === selectedDeptId ? { ...d, notice_type: newStatus } : d))
    handleStatusClose()
  }

  const handleStatusChange = (event: any) => {
    const newStatus = event.target.value as string
    setDepts(prev => prev.map(d => d.id === selectedDeptId ? { ...d, notice_type: newStatus } : d))
  }


  Shared.useEffect(() => {
    // Only fetch if we are on the communication hub tab and have a selected department
    if (tabValue === '2' && selectedDeptId && accessToken) {
      // Use the latest value from the state to decide whether to fetch
      // This avoids putting the whole 'messagesByDept' in the dependencies
      const hasMessages = !!messagesByDept[selectedDeptId];
      if (!hasMessages) {
        fetchMessages()
      }
    }
  }, [tabValue, selectedDeptId, accessToken, fetchMessages]) // Removed messagesByDept from dependencies

  Shared.useEffect(() => {
    if (detailsData?.noticeOrderDetails) {
      setDepts(prev => {
        const newDepts = detailsData.noticeOrderDetails
          .filter((detail: any) => {
            const hasAccess = detail.noticed_department_id || detail.noticed_personal_id
            if (scope === 'department') {
              return hasAccess && userDeptIds.includes(detail.noticed_department_id)
            }
            return hasAccess
          })
          .map((detail: any, index: number) => {
            const id = detail.id || detail.noticed_department_id || detail.noticed_personal_id || index;
            const existing = prev.find(p => p.id === id);

            let nameAr = '';
            if (detail.noticeDepartment?.department_name_ar) nameAr = detail.noticeDepartment.department_name_ar;
            else if (detail.personal?.full_name_ar) nameAr = detail.personal.full_name_ar;
            else if (detail.noticed_department_id) nameAr = 'إدارة غير معروفة';
            else if (detail.noticed_personal_id) nameAr = 'شخص غير معروف';

            const departmentData = {
              id: detail.noticed_department_id,
              department_name_ar: nameAr
            };

            if (existing) {
              return {
                ...existing,
                department: departmentData,
                notice_type: detail.notice_status_type_id?.toString() || existing.notice_type
              };
            }
            return {
              id,
              department: departmentData,
              role: nameAr,
              lastMsg: '',
              time: '',
              unread: 0,
              status: 'online',
              notice_type: detail.notice_status_type_id?.toString() || '1'
            };
          });
        if (JSON.stringify(newDepts) === JSON.stringify(prev)) return prev;
        return newDepts;
      });
    }
  }, [detailsData?.noticeOrderDetails, scope, userDeptIds]);

  Shared.useEffect(() => {
    if (depts.length > 0 && !depts.find(d => d.id === selectedDeptId)) {
      setSelectedDeptId(depts[0].id);
    }
  }, [depts, selectedDeptId]);


  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, 100)
  }

  Shared.useEffect(() => {
    scrollToBottom()
  }, [selectedDept, tabValue, messagesByDept])

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedDeptId) return

    const sentMessage = message.trim()
    setMessage('')

    Shared.apiClient.post('/jos/notice-order-replies', {
      reply_content: sentMessage,
      notices_order_d_id: selectedDeptId,
      notice_status_type_id: Number(selectedDept.notice_type)
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then((res: any) => {
      const newReply = res.data?.data || res.data || {}
      setMessagesByDept(prev => ({
        ...prev,
        [selectedDeptId]: [...(prev[selectedDeptId] || []), newReply]
      }))
    }).catch((error: any) => {
      console.error('Failed to send message', error)
      setMessage(sentMessage) // Restore message if request fails
      if (setError) {
        setError(
          error?.response?.data?.message || (locale === 'ar' ? 'حدث خطأ أثناء الإرسال' : 'Error during sending')
        )
      }
      Shared.scrollToTop()
    })
  }

  const filteredNoticeOrderDetails = useMemo(() => {
    const rawDetails = detailsData['noticeOrderDetails'] || []
    if (scope === 'department') {
      return rawDetails.filter((d: any) => userDeptIds.includes(d.noticed_department_id))
    }
    return rawDetails
  }, [detailsData, scope, userDeptIds])

  const { loading } = Shared.useContext(Shared.LoadingContext)

  const AccessBlockedScreen = () => (
    <Shared.Card sx={{ my: 4 }}>
      <Shared.CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 20,
          textAlign: 'center',
          minHeight: '400px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Shared.Box
          sx={{
            mb: 6,
            width: 100,
            height: 100,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'error.lighter',
            color: 'error.main',
            fontSize: '3.5rem',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: 'error.main',
              animation: 'ripple 1.5s infinite ease-out',
              opacity: 0
            },
            '@keyframes ripple': {
              '0%': { transform: 'scale(1)', opacity: 0.5 },
              '100%': { transform: 'scale(1.5)', opacity: 0 }
            }
          }}
        >
          <i className='ri-shield-keyhole-line' />
        </Shared.Box>



        <Shared.Typography
          variant='subtitle1'
          sx={{
            color: 'text.secondary',
            mx: 'auto',
            mb: 8,
          }}
        >
          {dictionary?.messages?.notice_access_denied_dept || 'لا يوجد بلاغ موجه لأي من إداراتك.'}
        </Shared.Typography>
        <Shared.Button variant='contained' onClick={goBack}>
          {dictionary?.titles?.back || 'العودة'}
        </Shared.Button>
      </Shared.CardContent>
    </Shared.Card>
  )



  return (
    <Shared.FormProvider {...formMethods}>

      <Shared.Grid size={{ xs: 12 }}>
        <Shared.Header
          locale={locale}
          title={`notice_orders`}
          mode={mode}
          onMenuOptionClick={handleMenuOptionClick}
          onCancel={goBack}
          showOnlyOptions={["print", "search"]}
        />
      </Shared.Grid>

      <Shared.Grid size={{ xs: 12 }} className='print-view previewCard'>
        <Shared.FormComponent
            locale={locale}
            fields={memoizedFields}
            mode={mode}
            screenMode={mode}
            detailsConfig={[
              {
                key: 'noticeOrderDetails',
                fields: NoticesOrderDetailsTableFields,
                title: 'notices_order_details'
              }
            ]}
          />
        </Shared.Grid>
      <Shared.TabContext value={tabValue}>

          <Shared.TabList
            style={{ display: !isPrintMode ? 'block' : 'none' }}
            onChange={handleTabChange}
            aria-label="Notice Replying Tabs"
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': { height: 2 },
              '& .MuiTab-root': {
                minHeight: 'auto',
                transition: 'color 0.2s',
                '&:hover': { color: 'primary.main' }
              }
            }}
          >
            <Shared.Tab
              disableRipple
              label={
                <Shared.Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Shared.Box component="span" className="ri-dashboard-line" sx={{ fontSize: "0.8rem" }} />
                  {dictionary?.titles?.main_information}
                </Shared.Box>
              }
              value="1"
              sx={{ textTransform: 'none', minWidth: '150px', fontSize: '0.9rem' }}
            />
            <Shared.Tab
              disableRipple
              label={
                <Shared.Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Shared.Box component="span" className="ri-chat-3-line" sx={{ fontSize: "0.8rem" }} />
                  {dictionary?.titles.communication_hub}
                </Shared.Box>
              }
              value="2"
              sx={{ textTransform: 'none', minWidth: '200px', fontSize: '0.9rem' }}
            />
          </Shared.TabList>
          <Shared.Box sx={{
            mt: 6,
            bgcolor: 'background.paper',
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Shared.TabPanel value="1" sx={{ p: 0 }}>
              {!isPrintMode && (
                <Shared.Grid size={{ xs: 12 }} className='previewCard'>
                  <Shared.Grid container spacing={2} sx={{ p: 3 }}>
                    {/* Master Form - Notice Order Details */}
                    <Shared.Grid size={{ xs: 12 }}>
                      <NoticeReplyingMasterForm
                        locale={locale as string}
                        data={dataModel}
                        fields={memoizedFields}
                        mode={mode !== "show" ? scope === 'operation-center' ? 'edit' : 'show' : mode}
                      />
                    </Shared.Grid>
                  </Shared.Grid>

                  {/* Details Table - Editable */}
                  <Shared.Grid size={{ xs: 12 }}>
                    <NoticeReplyingDetailsTable
                      locale={locale as string}
                      initialData={filteredNoticeOrderDetails}
                      onDataChange={detailsHandlers?.noticeOrderDetails}
                      errors={getDetailsErrors('noticeOrderDetails')}
                      mode={mode}
                      fields={NoticesOrderDetailsTableFields}
                      apiEndPoint={`/jos/notice-orders/${dataModel?.id}/noticeOrderDetails`}
                      detailsKey='noticeOrderDetails'
                      dataObject={dataModel}
                    />
                  </Shared.Grid>

                  <Shared.Grid size={{ xs: 12 }}>
                    <Shared.FormActions locale={locale} onCancel={goBack} onSaveSuccess={onSubmit} mode={mode} />
                  </Shared.Grid>
                </Shared.Grid>
              )}
            </Shared.TabPanel>

            <Shared.TabPanel value="2" sx={{ p: 0, height: '750px' }}>
              {depts.length === 0 ? (
                <AccessBlockedScreen />
              ) : (
                <NoticeReplyingChat
                  depts={depts}
                  selectedDeptId={selectedDeptId}
                  setSelectedDeptId={setSelectedDeptId}
                  messagesByDept={messagesByDept}
                  statusTypes={statusTypes}
                  selectedDept={selectedDept}
                  statusAnchorEl={statusAnchorEl}
                  setStatusAnchorEl={setStatusAnchorEl}
                  message={message}
                  setMessage={setMessage}
                  handleSendMessage={handleSendMessage}
                  dictionary={dictionary}
                  currentUserId={currentUserId}
                  chatContainerRef={chatContainerRef}
                  handleStatusSelect={handleStatusSelect}
                  refreshMessages={fetchMessages}
                  mode={'edit'}
                />
              )}
            </Shared.TabPanel>
          </Shared.Box>
        </Shared.TabContext>
    </Shared.FormProvider>
  )
}

export default NoticeReplyingDetails
