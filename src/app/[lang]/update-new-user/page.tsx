import { getServerMode } from '@/@core/utils/serverHelpers'
import UpdateNewUser from '@/views/pages/update-new-user'

const UpdateNewUserPage = async () => {
  const mode = await getServerMode()
  return <UpdateNewUser mode={mode} />
}

export default UpdateNewUserPage
