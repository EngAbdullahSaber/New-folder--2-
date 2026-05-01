'use client'
import {
  Box,
  DynamicColumnDef,
  formatNumber,
  genderOptions,
  ListComponent,
  Tooltip,
  useSessionHandler,
  useTheme,
  cardPrintingStatusList,
  handleSave,
  onEvent,
  emitEvent,
  apiClient,
  toast
} from '@/shared'
import { useMemo, useState, useEffect } from 'react'
import { getDictionary } from '@/utils/getDictionary'
import { useParams } from 'next/navigation'
import { Locale } from '@/configs/i18n'
import { useDialog } from '@/contexts/dialogContext'
import DynamicListFormSection from '@/components/shared/DynamicListFormSection'

const CardPrinttingList = () => {
  const { user, accessToken } = useSessionHandler()

  const { lang: locale } = useParams()
  const [dictionary, setDictionary] = useState<any>(null)
  const theme = useTheme()
  const { openDialog, closeDialog } = useDialog()
  useEffect(() => {
    getDictionary(locale as Locale).then(res => setDictionary(res))
  }, [locale])
  const columns = useMemo<DynamicColumnDef[]>(
    () => [
      { accessorKey: 'id', header: 'id', width: '5%' },
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
      // }, displayprops ,searchprops , 
      {
        accessorKey: 'personal_name',
        header: 'employee_name',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/personal',
        filterLabelProp: 'full_name_ar',
        filterKeyProp: 'id',
        // filterQueryParams: { status: 3 },

        filterPlaceholder: 'full_name_ar',
        filterAccessorKey: 'personal_id',
        filterDisplayProps: ['id', 'full_name_ar'],
        filterSearchProps: ['id', 'full_name_ar'],
        width: '10%'
      },

      {
        accessorKey: 'gender',
        header: 'gender',
        align: 'text-center',
        enableFilter: true,
        filterType: 'select',
        width: '5%',
        filterOptions: genderOptions,
        type: 'selectIcon',
        list: genderOptions
      },

      { accessorKey: 'elected_department_name', header: 'department', align: 'text-start', width: '10%' },
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
        filterAccessorKey: 'job_id',
        width: '10%'
      },
      { accessorKey: 'elected_days', header: 'work_days', align: 'text-center', type: 'number', width: '5%' },

      {
        accessorKey: 'approvals',
        header: 'approvals',
        align: 'text-center',
        width: '15%',
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
                    : data?.card_printing_approval_status === '3'
                      ? 'info'
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
        accessorKey: 'bonus',
        header: 'bonus',
        type: 'amount',
        align: 'text-center',
        width: '7%',
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
      },

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
        tooltip: { '1': 'nominated', '2': 'nominated_rejected', null: 'not_nominated' }
      },
      {
        accessorKey: 'nomination_approval_status',
        header: 'hr_approval_status',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: {
          '1': 'hr_approval_status_approved',
          '2': 'hr_approval_status_rejected',
          null: 'hr_approval_status_not_reviewed'
        }
      },

      {
        accessorKey: 'doc_verification_approval_status',
        header: 'contract_papers',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: {
          '1': 'doc_verification_approved',
          '2': 'doc_verification_rejected',
          null: 'doc_verification_pending'
        }
      },

      {
        accessorKey: 'contract_sign_approval_status',
        header: 'contract_sign_approval_status',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: {
          '1': 'contract_signed',
          '2': 'contract_rejected',
          '3': 'contract_unapproved',
          null: 'contract_pending'
        }
      },

      {
        accessorKey: 'is_appointed',
        header: 'appointing',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        tooltip: { '1': 'appointed', '2': 'appointed_rejected', null: 'not_appointed' }
      },
      {
        accessorKey: 'card_printing_approval_status',
        header: 'card_printing_approval_status',
        align: 'text-center',
        width: '4%',
        type: 'iconBadge',
        enableFilter: true,
        isVisible: false,
        filterType: 'select',
        filterOptions: cardPrintingStatusList,
        tooltip: { '1': 'card_printing_approved', '2': 'card_printing_rejected', 3: 'card_printing_pending' }
      }
    ],
    [dictionary]
  )

  useEffect(() => {
    const unsubscribe = onEvent('list:form', (event: CustomEvent) => {
      const { rows } = event.detail || {}

      openDialog(DynamicListFormSection, {
        fields: [
          {
            name: 'status',
            label: 'status',
            type: 'toggle',
            options: cardPrintingStatusList,
            requiredModes: ['add', 'edit'],
            required: true,
            gridSize: 4
          }
        ],
        mode: 'edit',
        defaultValues: {},
        locale,
        selectedRows: rows,
        submitData: async (data: any) => {
          try {
            await handleSave(
              `/ses/nomination-approvals/card-printing-process`,
              locale as Locale,
              {
                ...data,
                nominations: rows.map((item: any) => ({
                  id: item.nomination_number
                }))
              },
              '',
              accessToken,
              false
            )
            emitEvent('list:reset')
            closeDialog()
          } catch (err) {}
        }
      })
    })

    const unsubscribeDownload = onEvent('list:download-cards', async (event: CustomEvent) => {
      const { rows } = event.detail || {}

      try {
        emitEvent('loading', { type: 'download' })
        const response: any = await apiClient.post(
          `/ses/requests/card-print/download`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Accept-Language': locale
            },
            responseType: 'blob'
          }
        )
        // Handle physical download
        const blob = new Blob([response.data], { type: 'application/pdf' })

        const url = window.URL.createObjectURL(blob)

        // open
        window.open(url)

        // أو download
        const link = document.createElement('a')
        link.href = url
        link.download = 'card.pdf' // 👈 مهم تحدد الامتداد
        link.click()

        toast.success(
          dictionary?.messages?.download_success ||
            (locale === 'ar' ? 'تم تحميل ملف PDF بنجاح' : 'PDF downloaded successfully')
        )
      } catch (err: any) {
        console.error('Download failed', err)
        toast.error(
          dictionary?.messages?.download_failed || (locale === 'ar' ? 'فشل تحميل ملف PDF' : 'Failed to download PDF')
        )
      } finally {
        emitEvent('loading', { type: 'download' })
      }
    })

    return () => {
      unsubscribe()
      unsubscribeDownload()
    }
  }, [locale, accessToken, dictionary])

  return (
    <ListComponent
      title='ses_request_status'
      columns={columns}
      apiEndpoint={'/ses/requests-status'}
      // routerUrl={`/apps/ses/request-status/${scope}`}
      routerUrl={`/apps/ses/card-printing`}
      collapsible={true}
      enableFilters={true}
      enableColumnVisibility={true}
      maxVisibleColumns={7}
      showOnlyOptions={['search', 'print', 'export']}
      extraActionConfig={{
        action: 'list:form',
        title: 'print_card',
        icon: <i className='ri-edit-box-line' />,
        color: 'rgb(76 175 80)'
      }}
      extraQueryParams={{
        contract_sign_approval_number: 'not_null'
      }}
      extraActions={[
        {
          action: 'list:download-cards',
          title: 'download_cards',
          icon: <i className='ri-download-2-line' />,
          color: 'rgb(33 150 243)',
          isSelectionIndependent: true
        }
      ]}
    />
  )
}

export default CardPrinttingList
