import { getServerMode } from '@/@core/utils/serverHelpers'
import ChangePassword from '@/views/pages/change-password'
import { IntroComponent } from '@/views/pages/intro'

const ChangePasswordPage = async () => {
  const mode = await getServerMode()
  return <ChangePassword mode={mode} />
}

export default ChangePasswordPage
