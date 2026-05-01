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

interface SignIncorporationContractProps {
  open: boolean
  onClose: () => void
  onAgree: () => void
  locale?: string
}

export const SignIncorporationContractModal: React.FC<SignIncorporationContractProps> = ({
  open,
  onClose,
  onAgree,
  locale = ''
}) => {
  const [agreed, setAgreed] = useState(false)

  const dummyContractContent = `
  عقد تأسيس شركة ذات مسؤولية محدودة

  1. التأسيس:
  تم الاتفاق بين كل من:
  - الطرف الأول: أحمد محمد علي، سعودي الجنسية، يحمل الهوية رقم (1010101010).
  - الطرف الثاني: يوسف خالد عبد الله، سعودي الجنسية، يحمل الهوية رقم (2020202020).
  على تأسيس شركة ذات مسؤولية محدودة وفقًا للأحكام التالية.

  2. اسم الشركة:
  شركة التميز التجاري المحدودة.

  3. أغراض الشركة:
  تشمل أغراض الشركة: التجارة العامة، الاستيراد والتصدير، وخدمات تقنية المعلومات.

  4. المركز الرئيسي:
  يقع المركز الرئيسي للشركة في مدينة الرياض، المملكة العربية السعودية، ويجوز لها فتح فروع أخرى.

  5. رأس المال:
  رأس مال الشركة هو (500,000 ريال سعودي) موزع على 500 حصة، قيمة كل حصة (1,000 ريال سعودي).

  6. مدة الشركة:
  مدة الشركة 25 سنة تبدأ من تاريخ قيدها في السجل التجاري، وتجدد تلقائيًا ما لم يعترض أحد الشركاء.

  7. الإدارة:
  يتولى إدارة الشركة الطرف الأول: أحمد محمد علي، وله كامل الصلاحيات في تمثيل الشركة.

  8. الأرباح والخسائر:
  توزع الأرباح والخسائر بنسبة حصص الشركاء في رأس المال.

  9. أحكام عامة:
  تسري أحكام نظام الشركات السعودي على كل ما لم يرد به نص في هذا العقد.

  تم تحرير هذا العقد من نسختين وتم التوقيع عليه من جميع الأطراف.

  والله الموفق.
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
      <DialogTitle sx={{ textAlign: 'center' }}>عقد التأسيس</DialogTitle>
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
            {dummyContractContent}
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
              التوقيع علي العقد إلكترونياً
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

export default SignIncorporationContractModal
