'use client'
import { interviewerStatusList, ListComponent, statusList } from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'

const SeasonalJobRequestList = ({ scope }: ComponentGeneralProps) => {
  const columns = [
    { accessorKey: 'id', header: 'id', width: '5%' },
    { accessorKey: 'request_no', header: 'request', width: '5%' },
    { accessorKey: 'personal.id', header: 'personal_no', width: '6%' },

    { accessorKey: 'personal.full_name_ar', header: 'name', align: 'text-right' },
    { accessorKey: 'personal.nationality.name_ar', header: 'nationality', width: '17%' },

    // {
    //   accessorKey: 'personal.birth_date',
    //   width: '7%',
    //   header: 'birth_date',
    //   type: 'date'
    // },
    { accessorKey: 'id_no', header: 'his_id_no', width: '8%' },

    { accessorKey: 'mobile', header: 'his_mobile', width: '8%' },

    // { accessorKey: 'qualification.qualification_name', header: 'qualification', width: '6%' },
    {
      accessorKey: scope !== 'interviewer' ? 'status' : 'reviewed_approval_status',
      header: 'status',
      width: '6%',
      type: 'badge',
      list: scope !== 'interviewer' ? statusList : interviewerStatusList,
      align: 'text-center'
    }
  ]

  return (
    <ListComponent
      title='seasonal_request'
      columns={columns}
      apiEndpoint='/ses/requests'
      routerUrl={`/apps/ses/nafath/seasonal-job-request/${scope}`}
      showOnlyOptions={
        scope === 'interviewer'
          ? ['search', 'print', 'export', 'edit']
          : ['edit', 'search', 'print', 'export', 'delete']
      }
    />
  )
}

export default SeasonalJobRequestList
