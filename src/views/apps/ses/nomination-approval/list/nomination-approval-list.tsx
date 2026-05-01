'use client'
import {
  isCompanyNominatedList,
  ListComponent,
  type DynamicColumnDef,
  Box,
  Tooltip,
  useParams,
  useState,
  useEffect,
  useMemo,
  Locale,
  useTheme,
  genderOptions,
  formatNumber,
  useSessionHandler,
  yesNoList
} from '@/shared'
import { ComponentGeneralProps } from '@/types/pageModeType'
import { getDictionary } from '@/utils/getDictionary'
import { useAppSettings } from '../../seasonal-job-request/details/hooks'

const NominationApprovalList = ({ scope }: ComponentGeneralProps) => {
  const theme = useTheme()

  const { lang: locale } = useParams()
  const { accessToken } = useSessionHandler()
  const [dictionary, setDictionary] = useState<any>(null)
  const [appSetting, setAppSetting] = useState<any>(null)

  // Stable dummy formMethods to prevent re-fetching in useAppSettings
  const dummyFormMethods = useMemo(() => ({ setValue: () => {} }), [])

  // Fetch app settings for filtering
  const fetchedSettings = useAppSettings(
    accessToken,
    'search',
    undefined,
    (locale as string) || 'ar',
    dummyFormMethods,
    false
  )

  useEffect(() => {
    if (fetchedSettings) {
      setAppSetting(fetchedSettings)
    }
  }, [fetchedSettings])

  useEffect(() => {
    getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])

  const columns = useMemo<DynamicColumnDef[]>(
    () => [
      { accessorKey: 'id', header: 'id' },
      // {
      //   accessorKey: 'request_no',
      //   header: 'request_no',
      //   align: 'text-center',
      //   width: '7%',
      //   enableFilter: true,
      //   isIdentifier: true
      // },
      // {
      //   accessorKey: 'nomination_number',
      //   header: 'nomination_id',
      //   align: 'text-center',
      //   width: '7%',
      //   isIdentifier: true,
      //   enableFilter: true,
      //   filterType: 'text'
      // },
      {
        accessorKey: 'personal_name',
        header: 'employee_name',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/personal',
        filterLabelProp: 'full_name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'personal_id',
        filterDisplayProps: ['id', 'full_name_ar'],
        filterSearchProps: ['id', 'full_name_ar']
      },

      {
        accessorKey: 'gender',
        header: 'gender',
        align: 'text-center',
        enableFilter: true,
        type: 'selectIcon',
        list: genderOptions,
        filterType: 'select',
        width: '5%',
        filterOptions: genderOptions,
        filterAccessorKey: 'gender'
      },

      {
        accessorKey: 'elected_department_name',
        header: 'department',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/seasonal-departments',
        filterLabelProp: 'department_name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'elected_department_id',
        filterQueryParams: { seasonal_departments_types: { id: appSetting?.internal_department_type_id } }
      },
      {
        accessorKey: 'elected_job_name',
        header: 'job',
        align: 'text-center',
        type: 'text',
        // enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/jobs',
        filterLabelProp: 'name',
        filterKeyProp: 'id',
        filterAccessorKey: 'job_id'
      },
      { accessorKey: 'elected_days', header: 'work_days', align: 'text-center', type: 'number' },

      {
        accessorKey: 'approvals',
        header: 'approvals',
        width: '23%',
        align: 'text-center',
        cell: ({ row }: any) => {
          const data = row.original
          const theme = useTheme()
          const isDark = theme.palette.mode === 'dark'

          const statusConfig = [
            {
              // Nomination submitted by employee
              key: 'nomination_status',
              icon: 'ri-user-add-line',
              tooltip:
                data?.nomination_status === '1'
                  ? dictionary?.messages?.status?.nominated
                  : data?.nomination_status === '2'
                    ? dictionary?.messages?.status?.nominated_rejected
                    : dictionary?.messages?.status?.not_nominated,
              color:
                data?.nomination_status === '1' ? 'success' : data?.nomination_status === '2' ? 'error' : 'disabled'
            },
            {
              // Department nomination approval
              key: 'nomination_approval_status',
              icon: 'ri-award-line',
              tooltip:
                data?.nomination_approval_status === '1'
                  ? dictionary?.messages?.status?.nomination_approved
                  : data?.nomination_approval_status === '2'
                    ? dictionary?.messages?.status?.nomination_rejected
                    : data?.nomination_approval_status === '3'
                      ? dictionary?.messages?.status?.unapproved
                      : dictionary?.messages?.status?.nomination_pending,
              color:
                data?.nomination_approval_status === '1'
                  ? 'success'
                  : data?.nomination_approval_status === '2'
                    ? 'error'
                    : 'disabled'
            },
            {
              // Employee self-approval
              key: 'emp_nomination_approval_status',
              icon: 'ri-shield-user-line',
              tooltip:
                data?.emp_nomination_approval_status === '1'
                  ? dictionary?.messages?.status?.emp_approved
                  : data?.emp_nomination_approval_status === '2'
                    ? dictionary?.messages?.status?.emp_rejected
                    : data?.emp_nomination_approval_status === '3'
                      ? dictionary?.messages?.status?.emp_unapproved
                      : dictionary?.messages?.status?.emp_pending,
              color:
                data?.emp_nomination_approval_status === '1'
                  ? 'success'
                  : data?.emp_nomination_approval_status === '2'
                    ? 'error'
                    : 'disabled'
            },
            {
              // Document verification
              key: 'doc_verification_approval_status',
              icon: 'ri-file-search-line',
              tooltip:
                data?.doc_verification_approval_status === '1'
                  ? dictionary?.messages?.status?.doc_verification_approved
                  : data?.doc_verification_approval_status === '2'
                    ? dictionary?.messages?.status?.doc_verification_rejected
                    : data?.doc_verification_approval_status === '3'
                      ? dictionary?.messages?.status?.doc_verification_unapproved
                      : dictionary?.messages?.status?.doc_verification_pending,
              color:
                data?.doc_verification_approval_status === '1'
                  ? 'success'
                  : data?.doc_verification_approval_status === '2'
                    ? 'error'
                    : 'disabled'
            },
            {
              // HR approval
              key: 'hr_approval_status',
              icon: 'ri-group-line',
              tooltip:
                data?.hr_approval_status === '1'
                  ? dictionary?.messages?.status?.hr_approved
                  : data?.hr_approval_status === '2'
                    ? dictionary?.messages?.status?.hr_rejected
                    : data?.hr_approval_status === '3'
                      ? dictionary?.messages?.status?.hr_not_reviewed
                      : dictionary?.messages?.status?.hr_pending,
              color:
                data?.hr_approval_status === '1' ? 'success' : data?.hr_approval_status === '2' ? 'error' : 'disabled'
            },
            {
              // Contract signing
              key: 'contract_sign_approval_status',
              icon: 'ri-contract-line',
              tooltip:
                data?.contract_sign_approval_status === '1'
                  ? dictionary?.messages?.status?.contract_signed
                  : data?.contract_sign_approval_status === '2'
                    ? dictionary?.messages?.status?.contract_rejected
                    : data?.contract_sign_approval_status === '3'
                      ? dictionary?.messages?.status?.contract_unapproved
                      : dictionary?.messages?.status?.contract_pending,
              color:
                data?.contract_sign_approval_status === '1'
                  ? 'success'
                  : data?.contract_sign_approval_status === '2'
                    ? 'error'
                    : 'disabled'
            },
            {
              // Card printing
              key: 'card_printing_approval_status',
              icon: 'ri-printer-line',
              tooltip:
                data?.card_printing_approval_status === '1'
                  ? dictionary?.messages?.status?.card_printed
                  : data?.card_printing_approval_status === '2'
                    ? dictionary?.messages?.status?.card_printing_rejected
                    : data?.card_printing_approval_status === '3'
                      ? dictionary?.messages?.status?.card_unapproved
                      : dictionary?.messages?.status?.card_pending,
              color:
                data?.card_printing_approval_status === '1'
                  ? 'success'
                  : data?.card_printing_approval_status === '2'
                    ? 'error'
                    : 'disabled'
            },
            {
              // Uniform
              key: 'uniform_approval_status',
              icon: 'ri-shirt-line',
              tooltip:
                data?.uniform_approval_status === '1'
                  ? dictionary?.messages?.status?.uniform_appointed
                  : data?.uniform_approval_status === '2'
                    ? dictionary?.messages?.status?.uniform_rejected
                    : data?.uniform_approval_status === '3'
                      ? dictionary?.messages?.status?.uniform_unapproved
                      : dictionary?.messages?.status?.uniform_pending,
              color:
                data?.uniform_approval_status === '1'
                  ? 'success'
                  : data?.uniform_approval_status === '2'
                    ? 'error'
                    : 'disabled'
            }
          ]

          return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
              {statusConfig.map(status => (
                <Tooltip key={status.key} title={status.tooltip || ''} arrow placement='top'>
                  <span style={{ display: 'flex' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        color: status.color === 'disabled' ? 'text.disabled' : `${status.color}.main`,
                        transition: 'all 0.2s ease-in-out',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'scale(1.2)',
                          bgcolor: theme.palette.action.hover
                        }
                      }}
                    >
                      <i className={status.icon} style={{ fontSize: '1.2rem', lineHeight: 1 }} />
                    </Box>
                  </span>
                </Tooltip>
              ))}
            </Box>
          )
        }
      },
      {
        accessorKey: 'bonus',
        header: 'bonus',
        type: 'amount',
        align: 'text-center',
        cell: ({ row }: any) => {
          return row?.original?.elected_days && row?.original?.elected_daily_price ? (
            <Tooltip title={row.original.elected_days} placement='top'>
              <span>
                {formatNumber(row.original.elected_days * row.original.elected_daily_price, 0, {
                  locale: 'en-SA',
                  useCurrency: false
                })}
              </span>
            </Tooltip>
          ) : (
            <span style={{ color: theme.palette.mode === 'dark' ? '#475569' : '#94a3b8', fontSize: 12 }}>—</span>
          )
        }
      }, //NO BONUs in request status but we will keep it for future use
      {
        accessorKey: 'elected_start_date',
        combine: ['elected_start_date', 'elected_end_date'],
        header: 'start_end_date',
        align: 'text-center',
        type: 'date',
        // enableFilter: true,
        // filterType: 'date',
        width: '12%'
      },

      { accessorKey: 'elected_daily_price', header: 'daily_rate', align: 'text-center', width: '4%' },

      {
        accessorKey: 'bank_id',
        header: 'bank',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        badgeOptions: [
          { value: 'not null', label: 'bank_complete', icon: 'ri-bank-line', color: 'success' },
          { value: 'null', label: 'bank_incomplete', icon: 'ri-bank-line', color: 'error' }
        ],
        tooltip: { 'not null': 'bank_complete', null: 'bank_incomplete' }
      },

      {
        accessorKey: 'is_elected',
        header: 'is_elected',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: { '1': 'nominated', '2': 'not_nominated', null: 'rejected' }
      },
      {
        accessorKey: 'nomination_approval_status',
        header: 'hr_approval_status',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: {
          '1': 'hr_approval_status_approved',
          '2': 'hr_approval_status_not_reviewed',
          null: 'hr_approval_status_not_reviewed'
        }
      },
      {
        accessorKey: 'contract_sign_approval_number',
        align: 'text-center',
        header: 'contract_papers',
        cell: ({ row }: any) => {
          const contract_sign_approval_number = row?.original?.contract_sign_approval_number || ''
          const theme = useTheme()
          const isDark = theme.palette.mode === 'dark'

          const palette = {
            bg: isDark ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.10)',
            border: isDark ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.35)',
            icon: isDark ? '#60a5fa' : '#2563eb'
          }

          return (
            <div className='flex justify-center'>
              {contract_sign_approval_number ? (
                <Tooltip title={contract_sign_approval_number} placement='top'>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isDark ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.10)',
                      border: `1.5px solid ${isDark ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.35)'}`,
                      color: isDark ? '#60a5fa' : '#2563eb',
                      fontSize: '0.85rem',
                      lineHeight: 1,
                      boxShadow: `0 1px 4px ${isDark ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.35)'}`,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      '&:hover': {
                        transform: 'scale(1.15)',
                        boxShadow: `0 2px 8px ${isDark ? 'rgba(59,130,246,0.55)' : 'rgba(59,130,246,0.35)'}`
                      }
                    }}
                  >
                    <i className='ri-information-line' style={{ fontSize: '0.8rem' }} />
                  </Box>
                </Tooltip>
              ) : (
                <span style={{ color: isDark ? '#475569' : '#94a3b8', fontSize: 12 }}>—</span>
              )}
            </div>
          )
        },
        width: '4%'
      },
      {
        accessorKey: 'contract_sign_approval_status',
        header: 'contract_sign_approval_status',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: { '1': 'contract_signed', null: 'contract_not_signed', '2': 'rejected' }
      },

      {
        accessorKey: 'is_appointed',
        header: 'appointing',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: { '1': 'appointed', '2': 'not_appointed', null: 'rejected' }
      },
      {
        accessorKey: 'card_printing_approval_status',
        header: 'card_printing_approval_status',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: { '1': 'card_printed', null: 'card_not_printed', '2': 'rejected' }
      }
    ],
    [dictionary]
  )
  return (
    <ListComponent
      title='job_categories'
      columns={columns}
      apiEndpoint='/ses/requests-status-department'
      routerUrl={`/apps/ses/nomination-approval/${scope}`}
      fetchKey='nomination_approval_number'
      enableColumnVisibility={true}
      collapsible={true}
      enableFilters={true}
      maxVisibleColumns={7}
      showOnlyOptions={['add', 'delete', 'search', 'print', 'export']}
      extraQueryParams={{
        request: { id_type: scope === 'citizen' ? '1' : '2' },
        nomination_approval_number: 'not_null'
      }}
    />
  )
}
export default NominationApprovalList

// رقم الطلب
// رقم الترشيح
// الاسم
//  الوظيفة
// تاريخ البدء وتاريخ الانتهاء  ترجمتهم تاريخ المباشرة وتاريخ النهاية
// اجر اليومية
// الراتب المتوقع ترجمتها الراتب
