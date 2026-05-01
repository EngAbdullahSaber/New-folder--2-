import SeasonalJobRequestList from '@/views/apps/ses/seasonal-job-request/list/seasonal-job-request-list'

const SeasonalJobRequestListPage = async () => {
  return (
    <>
      <SeasonalJobRequestList scope='department' />
    </>
  )
}

export default SeasonalJobRequestListPage
