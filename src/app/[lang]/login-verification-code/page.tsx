import { getServerMode } from '@/@core/utils/serverHelpers'
import LoginVerificationCode from '@/views/pages/login-verification-code'

const LoginVerificationCodePage = async () => {
  const mode = await getServerMode()
  return <LoginVerificationCode mode={mode} />
}

export default LoginVerificationCodePage
