// Next Imports

// Component Imports
import { getServerMode } from '../../../../../@core/utils/serverHelpers'
import Login from '../../../../../views/apps/aut/login/login'

// Server Action Imports

const LoginPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage
