import { getServerMode } from '@/@core/utils/serverHelpers'
import PolicyAgreementComponent from '@/views/pages/policy-agreement'

const PolicyAgreement = async () => {
  const mode = await getServerMode()
  return <PolicyAgreementComponent mode={mode} />
}

export default PolicyAgreement
