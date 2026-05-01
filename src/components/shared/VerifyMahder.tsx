'use client'

import { useMemo, useCallback, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  alpha,
  Alert,
  InputAdornment,
  IconButton,
  useTheme
} from '@mui/material'
import { Business, CheckCircleOutline, Visibility, VisibilityOff } from '@mui/icons-material'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@configs/i18n'

// --- Types ---
type AppStep = 'details' | 'rejection' | 'verification' | 'success'

const ToggleArrowIcon = () => (
  <Box component='span' sx={{ display: 'inline-flex', verticalAlign: 'middle', mx: 2 }}>
    <svg width='18' height='14' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z'
        fill='currentColor'
      />
      <path
        d='M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z'
        fill='currentColor'
        style={{ opacity: 0.5 }}
      />
    </svg>
  </Box>
)

interface VerifyMahderProps {
  dictionary: any
  lang: Locale
  mahdarId: string
  uuid: string
}

// --- Sub-Components ---

/**
 * Header info displaying Mahder Title, ID, Date, and Time
 */
const MahderHeaderInfo = ({ maderData, loading }: { maderData: any; loading: boolean }) => {
  const theme = useTheme()

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          mb: 6,
          height: 130,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: alpha(theme.palette.action.hover, 0.05),
          borderRadius: 'var(--mui-shape-customBorderRadius-md)'
        }}
      >
        <i className='ri-loader-4-line ri-spin' style={{ fontSize: '2rem', color: theme.palette.primary.main }} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      {/* Top banner */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: 3,
          py: 1.5,
          borderRadius: 'var(--mui-shape-customBorderRadius-md) var(--mui-shape-customBorderRadius-md) 0 0',
          textAlign: 'start'
        }}
      >
        <Typography variant='h6' sx={{ py: 3 }}>
          {maderData.title}
        </Typography>
      </Box>

      {/* Meta row */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          borderRadius: '0 0 var(--mui-shape-customBorderRadius-md) var(--mui-shape-customBorderRadius-md)',
          display: 'flex'
        }}
      >
        {[
          { icon: 'ri-file-list-3-line', color: theme.palette.primary.main, label: 'رقم المحضر', value: maderData.id },
          { icon: 'ri-calendar-line', color: theme.palette.primary.main, label: 'التاريخ', value: maderData.date },
          { icon: 'ri-time-line', color: theme.palette.primary.main, label: 'الوقت', value: maderData.time }
        ].map((item, idx, arr) => (
          <Box
            key={idx}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              py: 1.5,
              px: 1,
              borderRight: idx < arr.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider'
            }}
          >
            <i className={item.icon} style={{ fontSize: '1.1rem', color: item.color }} />
            <Typography variant='caption' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
              {item.label}
            </Typography>
            <Typography variant='body2'>{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

/**
 * Step 1: Verification Form (Phone & OTP)
 */
const VerificationStep = ({ mobileNumber, setMobileNumber, otp, setOtp, onVerify, loading, t, lang }: any) => {
  const [showOtp, setShowOtp] = useState(false)
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Card
        sx={{
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 2
          }}
        >
          <Typography variant='h6' sx={{ color: 'primary.main' }}>
            {t.verifications}
          </Typography>
          <i className='ri-shield-keyhole-line' style={{ color: theme.palette.primary.main, fontSize: '1.4rem' }} />
        </Box>
        <CardContent sx={{ p: 4, pt: 8 }}>
          <Box sx={{ mb: 6 }}>
            <TextField
              fullWidth
              label={t.phone}
              placeholder={t.phone_placeholder}
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
              variant='outlined'
              autoComplete='tel'
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: alpha(theme.palette.primary.main, 0.02) }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <i className='ri-phone-line' />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ mb: 8 }}>
            <TextField
              fullWidth
              label={t.verification_code}
              placeholder={t.verification_code_placeholder}
              type={showOtp ? 'text' : 'password'}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              variant='outlined'
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: alpha(theme.palette.primary.main, 0.02) }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={() => setShowOtp(!showOtp)}>
                      {showOtp ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Button fullWidth variant='contained' onClick={onVerify} disabled={loading} sx={{ py: 2 }}>
            {loading ? (lang === 'ar' ? 'جاري التحقق...' : 'Verifying...') : t.confirm}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

/**
 * Step 2: Mahder Details & Actions
 */
const DetailsStep = ({ maderData, onApprove, onDisapprove, t, lang }: any) => {
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Card
        sx={{
          mb: 4,
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <i className='ri-article-line' style={{ color: theme.palette.primary.main, fontSize: '1.4rem' }} />
          <Typography variant='h6' sx={{ color: 'primary.main' }}>
            {t.mahder_parag}
          </Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <Typography variant='body1' sx={{ mb: 4 }} dangerouslySetInnerHTML={{ __html: maderData.summary }} />
          {/* {maderData.actionTaken && (
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                {lang === 'ar' ? 'الإجراء المتخذ' : 'Action Taken'}
              </Typography>
              <Typography variant='body1' dangerouslySetInnerHTML={{ __html: maderData.actionTaken }} />
            </Box>
          )} */}
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 4,
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <i className='ri-article-line' style={{ color: theme.palette.primary.main, fontSize: '1.4rem' }} />
          <Typography variant='h6' sx={{ color: 'primary.main' }}>
            {lang === 'ar' ? 'الإجراء المتخذ' : 'Action Taken'}
          </Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>
          {/* <Typography variant='body1' sx={{ mb: 4 }} dangerouslySetInnerHTML={{ __html: maderData.summary }} /> */}
          {maderData.actionTaken && (
            <Box sx={{}}>
              {/* <Typography variant='subtitle1' sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                {lang === 'ar' ? 'الإجراء المتخذ' : 'Action Taken'}
              </Typography> */}
              <Typography variant='body1' dangerouslySetInnerHTML={{ __html: maderData.actionTaken }} />
            </Box>
          )}
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 4,
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <i className='ri-links-line' style={{ color: theme.palette.info.main, fontSize: '1.2rem' }} />
          <Typography variant='subtitle1' sx={{ color: 'info.main' }}>
            {t.related_entities}
          </Typography>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {maderData.relatedEntities.map((entity: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: 'info.main', display: 'flex' }}>{entity.icon}</Box>
                <Typography variant='body2'>
                  {entity.name1}
                  {entity.name1 && entity.name2 && <ToggleArrowIcon />}
                  {entity.name2}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 4,
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            bgcolor: alpha(theme.palette.warning.main, 0.05),
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <i className='ri-team-line' style={{ color: theme.palette.warning.main, fontSize: '1.2rem' }} />
          <Typography variant='subtitle1' sx={{ color: 'warning.main' }}>
            {t.participating_entities}
          </Typography>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {maderData.participatingEntities.map((entity: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant='body2'>
                  {entity.name1}
                  {entity.name1 && entity.name2 && <ToggleArrowIcon />}
                  {entity.name2}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
        <Button
          fullWidth
          variant='contained'
          color='success'
          onClick={onApprove}
          startIcon={<i className='ri-check-line' />}
          sx={{ py: 2 }}
        >
          {t.approve}
        </Button>
        <Button
          fullWidth
          variant='outlined'
          color='error'
          onClick={onDisapprove}
          startIcon={<i className='ri-close-line' />}
          sx={{ py: 2 }}
        >
          {t.disapprove}
        </Button>
      </Box>
    </Box>
  )
}

/**
 * Step 2b: Rejection Reason Form
 */
const RejectionStep = ({
  rejectionReason,
  setRejectionReason,
  onSend,
  onCancel,
  loading,
  t,
  lang,
  dictionary
}: any) => {
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Card
        sx={{
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.08),
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <i className='ri-error-warning-line' style={{ color: theme.palette.error.main, fontSize: '1.4rem' }} />

          <Typography variant='h6' sx={{ color: 'error.main' }}>
            {t.rejection_reason_title}
          </Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={t.rejection_reason_placeholder}
            value={rejectionReason}
            onChange={e => setRejectionReason(e.target.value)}
            variant='outlined'
            sx={{ mb: 4 }}
          />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button fullWidth variant='contained' color='error' onClick={onSend} disabled={loading} sx={{ py: 1.5 }}>
              {t.send_rejection}
            </Button>
            <Button fullWidth variant='outlined' onClick={onCancel} disabled={loading} sx={{ py: 1.5 }}>
              {dictionary.actions.cancel}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

/**
 * Step 3: Success Message
 */
const SuccessStep = ({ maderData, onContinue, t, lang }: any) => {
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
      <Card
        sx={{
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          p: 6,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ mb: 4, position: 'relative', display: 'inline-flex' }}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              bgcolor: alpha(theme.palette.success.main, 0.1),
              borderRadius: '50%'
            }}
          />
          <CheckCircleOutline sx={{ fontSize: 100, color: 'success.main', position: 'relative' }} />
        </Box>
        <Typography variant='h4' sx={{ color: 'success.main', mb: 1.5 }}>
          {t.save_success}
        </Typography>
        <Typography variant='body1' sx={{ color: 'text.secondary', mb: 5 }}>
          {t.process_complete_msg}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            textAlign: 'start',
            bgcolor: alpha(theme.palette.action.hover, 0.03),
            p: 4,
            borderRadius: 'var(--mui-shape-customBorderRadius-md)',
            border: '1px dashed',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <i className='ri-hashtag' />
            <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
              {t.mahder_no}:
            </Typography>
            <Typography variant='h6'>{maderData.successInfo.reportNo}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <i className='ri-calendar-event-line' />
            <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
              {t.timing}:
            </Typography>
            <Typography variant='subtitle2'>
              {maderData.successInfo.date} - {maderData.successInfo.time}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <i className='ri-bookmark-3-line' />
            <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
              {t.type}:
            </Typography>
            <Typography variant='subtitle2'>{maderData.successInfo.type}</Typography>
          </Box>
        </Box>
      </Card>

      <Button fullWidth variant='contained' onClick={onContinue} sx={{ mt: 5, py: 1.5 }}>
        {t.complete_continue}
      </Button>
    </Box>
  )
}

// --- Main Component ---
import { toast } from 'react-toastify'
import { apiClient } from '@/shared'

const VerifyMahder = ({ dictionary, lang, mahdarId, uuid }: VerifyMahderProps) => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [appStep, setAppStep] = useState<AppStep>('verification')
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mahdarDetails, setMahdarDetails] = useState<any>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const t = dictionary.verify_mahder
  const steps = [t.verification, t.data, t.success]

  // Data Mapping hook
  const maderData = useMemo(() => {
    const details = mahdarDetails || {}
    const datetime = details.datetime || ''
    const [apiDate, apiTime] = datetime.includes(' ') ? datetime.split(' ') : ['', '']

    return {
      id: mahdarId,
      time: apiTime || details.time || '07:00am',
      date: apiDate || details.date || '02/02/2024',
      title:
        lang === 'ar'
          ? details.title_ar || details.title || 'عنوان المحضر'
          : details.title_en || details.title || 'Mahder Title',
      summary: details.description || details.summary || (lang === 'ar' ? 'لا يوجد ملخص متاح' : 'No summary available'),
      actionTaken: details.action_taken || details.action || null,
      relatedEntities: (details.mahader_associates || details.related_entities || [])?.map((entity: any) => ({
        name1:
          entity.mahader_service_type_name ||
          entity.service_type?.name ||
          entity.service_type_name ||
          entity.name ||
          '',
        name2: entity.entity_name || '',
        icon: <Business />
      })),
      participatingEntities: (details.mahader_participants || details.participating_entities || [])?.map(
        (entity: any) => ({
          name1: entity.department?.department_name_ar || entity.department_name || '',
          name2: entity.name || ''
        })
      ),
      successInfo: {
        reportNo: details.id || details.report_no || '55',
        date: apiDate || details.report_date || '05-07-1445',
        time: apiTime || details.report_time || '07:00am',
        type:
          lang === 'ar' ? details.category?.name || 'إختلاف تفويج' : details.category?.name || 'Transport Difference'
      }
    }
  }, [mahdarDetails, mahdarId, lang])

  // --- API Handlers ---

  const fetchMahdarDetails = useCallback(async () => {
    setDetailsLoading(true)
    setError('')
    try {
      const response = await apiClient.post(`/haj/mahaders/csid/${mahdarId}/${uuid}`, {}, {})

      if (response.data?.data) {
        setMahdarDetails(response.data.data)
      } else {
        setError(lang === 'ar' ? 'فشل في جلب تفاصيل المحضر' : 'Failed to fetch details')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (lang === 'ar' ? 'خطأ في الاتصال بالسيرفر' : 'Server connection error'))
    } finally {
      setDetailsLoading(false)
    }
  }, [mahdarId, uuid, lang])

  const handleSendVerification = async () => {
    if (!mobileNumber || !otp) {
      setError(t.error_verification)
      return
    }
    setLoading(true)
    setError('')
    try {
      const cleanPhone = mobileNumber.replace(/[\s\-\(\)]/g, '')
      let normalizedPhone = cleanPhone
      if (cleanPhone.startsWith('05')) normalizedPhone = cleanPhone.substring(1)
      else if (cleanPhone.startsWith('+9665')) normalizedPhone = cleanPhone.substring(4)
      else if (cleanPhone.startsWith('009665')) normalizedPhone = cleanPhone.substring(5)

      const response = await apiClient.post(`/haj/mahaders/csid/${mahdarId}/${uuid}`, {
        verification_code: otp,
        phone: normalizedPhone
      })

      if (response.data?.data) {
        setMahdarDetails(response.data.data)
        setActiveStep(1)
        setAppStep('details')
      } else {
        setError(t.error_verification)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t.error_verification)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessMahder = async (status: number, reasons: string = '') => {
    setLoading(true)
    setError('')
    try {
      const cleanPhone = mobileNumber.replace(/[\s\-\(\)]/g, '')
      let normalizedPhone = cleanPhone
      if (cleanPhone.startsWith('05')) normalizedPhone = cleanPhone.substring(1)
      const phoneForApi = '0' + normalizedPhone

      const response = await apiClient.post(
        `/haj/mahaders/process/${mahdarId}`,
        {
          verification_code: otp,
          phone: phoneForApi,
          status,
          refuse_reasons: reasons
        },
        {
          headers: {
            Authorization: 'Bearer 1376|KMcuULhli1b5GatzrFX8NXQjWQzBAs00ZawrQQzP2b0f7db3'
          }
        }
      )

      if (response.data) {
        toast.success(
          response.data.message ||
            (status === 4
              ? lang === 'ar'
                ? 'تم الاعتماد بنجاح'
                : 'Approved'
              : lang === 'ar'
                ? 'تم الرفض'
                : 'Rejected')
        )
        setActiveStep(2)
        setAppStep('success')
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || (lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error')
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // --- Effects & Guards ---

  useEffect(() => {
    if (!mahdarDetails && appStep === 'verification') fetchMahdarDetails()
  }, [fetchMahdarDetails, mahdarDetails, appStep])

  useEffect(() => {
    if (!mahdarDetails && appStep !== 'verification') {
      setAppStep('verification')
      setActiveStep(0)
    }
  }, [mahdarDetails, appStep])

  // --- Render ---

  return (
    <div
      className='flex flex-col justify-center items-center min-bs-[100dvh] is-full relative p-6 bg-backgroundDefault'
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: appStep === 'details' ? '700px' : '460px',
          borderRadius: 'var(--mui-shape-customBorderRadius-md)',
          boxShadow: 'var(--mui-customShadows-xl)'
        }}
      >
        <CardContent className='p-6 sm:!p-12'>
          <Box className='flex justify-center items-center mbe-10'>
            <Logo />
          </Box>
          <Stepper activeStep={activeStep} alternativeLabel className='mbe-12'>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <div className='flex flex-col gap-8'>
            {appStep !== 'success' && <MahderHeaderInfo maderData={maderData} loading={detailsLoading} />}

            {appStep === 'verification' && (
              <VerificationStep
                mobileNumber={mobileNumber}
                setMobileNumber={setMobileNumber}
                otp={otp}
                setOtp={setOtp}
                onVerify={handleSendVerification}
                loading={loading}
                t={t}
                lang={lang}
              />
            )}

            {appStep === 'details' && (
              <DetailsStep
                maderData={maderData}
                t={t}
                lang={lang}
                onApprove={() => handleProcessMahder(4)}
                onDisapprove={() => setAppStep('rejection')}
              />
            )}

            {appStep === 'rejection' && (
              <RejectionStep
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                onSend={() => handleProcessMahder(3, rejectionReason)}
                onCancel={() => setAppStep('details')}
                loading={loading}
                t={t}
                lang={lang}
                dictionary={dictionary}
              />
            )}

            {appStep === 'success' && (
              <SuccessStep
                maderData={maderData}
                onContinue={() => {
                  setActiveStep(0)
                  setAppStep('verification')
                }}
                t={t}
                lang={lang}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyMahder
