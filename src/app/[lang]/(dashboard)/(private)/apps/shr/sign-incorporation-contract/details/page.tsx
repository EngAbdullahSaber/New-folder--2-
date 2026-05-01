import SignIncorporationContractDetails from '@/views/apps/shr/sign-incorporation-contract/details/sign-incorporation-contract-details'
import { getServerMode } from '@/@core/utils/serverHelpers'

const SignIncorporationContractDetailsPage = async () => {
  const mode = await getServerMode()
  return (
    <>
      <SignIncorporationContractDetails mode={mode} />
    </>
  )
}

export default SignIncorporationContractDetailsPage
