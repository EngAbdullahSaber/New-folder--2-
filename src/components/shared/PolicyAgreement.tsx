import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material'

interface PolicyAgreementProps {
  open: boolean
  onClose: () => void
  onAgree: () => void
  locale?: string
}

export const PolicyAgreement: React.FC<PolicyAgreementProps> = ({ open, onClose, onAgree, locale = '' }) => {
  const [agreed, setAgreed] = useState(false)

  const dummyPolicyContent = `
    سياسة الخصوصية والشروط والأحكام

    1. المقدمة
    ترحب [اسم الشركة] بكم في منصتنا/موقعنا. يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام الخدمة.

    2. القبول بالشروط
    باستخدامك لهذه الخدمة، فإنك توافق على الالتزام بهذه الشروط والأحكام كاملةً.

    3. الالتزامات
    تتعهد بعدم استخدام المنصة لأي أغراض غير قانونية أو مخالفة للآداب العامة.

    4. الملكية الفكرية
    جميع المحتويات والتصاميم محمية بحقوق النشر ولا يسمح بنسخها أو توزيعها دون إذن كتابي.

    5. تعديلات على الخدمة
    نحتفظ بالحق في تعديل الخدمة أو تعليقها دون إشعار مسبق.

    6. الحد من المسؤولية
    لا نتحمل مسؤولية أي أضرار ناتجة عن الاستخدام غير السليم للخدمة.

    7. الإنهاء
    نحتفظ بالحق في إنهاء أو تعليق الوصول إلى الخدمة في أي وقت دون إشعار.

    آخر تحديث: ١ يناير ٢٠٢٤
  `

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      sx={{
        '& .MuiDialog-paper': {
          marginTop: '0px',
          top: '5%',
          position: 'absolute'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>سياسة الاستخدام</DialogTitle>
      <DialogContent>
        {/* Policy Content */}
        <Box
          sx={{
            border: '1px solid #ebebeb',
            borderRadius: '8px',
            padding: 3,
            marginTop: 2,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <Typography variant='body1' whiteSpace='pre-line'>
            {dummyPolicyContent}
          </Typography>
        </Box>

        {/* Agreement Footer */}
        <Grid container spacing={2} sx={{ mt: 3, mb: 2 }} justifyContent='space-between'>
          <Grid>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                onAgree()
                onClose()
              }}
              disabled={!agreed}
            >
              أوافق على الشروط
            </Button>
          </Grid>

          <Grid>
            <FormControlLabel
              control={<Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} color='primary' />}
              label='لقد قرأت وأوافق على جميع البنود'
              sx={{ justifyContent: 'flex-end' }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default PolicyAgreement
