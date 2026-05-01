import { getServerMode } from '@/@core/utils/serverHelpers'
import ResetPasswordVerification from '@/views/pages/reset-password-verification'

const LoginVerificationCodePage = async () => {
  const mode = await getServerMode()
  return <ResetPasswordVerification mode={mode} />
}

export default LoginVerificationCodePage
