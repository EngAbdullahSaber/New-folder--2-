import { getServerMode } from '@core/utils/serverHelpers'
import VerifyMahder from '@/components/shared/VerifyMahder'
import type { Metadata } from 'next'
import { getDictionary } from '@/utils/getDictionary'
import type { Locale } from '@configs/i18n'

export const metadata: Metadata = {
  title: 'التحقق من المحضر | Verify Mader',
  description: 'صفحة التحقق من بيانات المحضر وتأكيد الهوية'
}

type Props = {
  params: Promise<{
    lang: Locale
    id: string
    uuid: string
  }>
}

const MahderApprovalPage = async (props: Props) => {
  const params = await props.params
  const dictionary = await getDictionary(params.lang)

  // Here you can fetch mahdar data using params.id
  // const mahdarData = await getMahdarData(params.id, params.uuid)

  return <VerifyMahder 
    dictionary={dictionary} 
    lang={params.lang} 
    mahdarId={params.id} 
    uuid={params.uuid} 
  />
}

export default MahderApprovalPage
