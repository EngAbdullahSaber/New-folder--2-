'use client'
import { ListComponent, statusList, taskProgressList } from '@/shared'
import type { ComponentGeneralProps } from '@/types/pageModeType'
import type { StatCardConfig, FilterTabConfig } from '@/types/components/dynamicDataTable'

const columns = [
  { accessorKey: 'id', header: 'id', width: '10%' },

  {
    accessorKey: 'task_description',
    header: 'task_description',
    width: '40%',
    align: 'text-start'
  },
  {
    accessorKey: 'start_date',
    header: 'start_end_date',
    type: 'date',
    combine: ['start_date', 'end_date'],
    width: '20%'
  },
  {
    accessorKey: 'progress_percent',
    header: 'progress',
    type: 'progress',
    align: 'text-center',
    width: '10%'
  },

  { accessorKey: 'status', header: 'status', width: '15%', type: 'badge', list: taskProgressList, align: 'text-center' }
]

// const statsConfig: StatCardConfig[] = [
//   { title: 'الإجمالى', field: 'ALL', icon: 'ri-task-line', color: 'primary' },
//   { title: 'لم يتم الإنجاز', icon: 'ri-timer-2-line', color: 'warning' },
//   { title: 'جارى العمل', icon: 'ri-checkbox-circle-fill', color: 'info' },
//   { title: 'تم العمل',  icon: 'ri-checkbox-circle-fill', color: 'success' }
// ]

// const filterTabsConfig: FilterTabConfig[] = [
//   { label: 'غير مكتمل', value: '1', icon: 'ri-timer-2-line', iconColor: '#ff9800' },
//   { label: 'قيد التنفيذ', value: '2', icon: 'ri-loader-4-line', iconColor: '#2196f3' },
//   { label: 'مكتمل', value: '3', icon: 'ri-checkbox-circle-fill', iconColor: '#4caf50' }
// ]

const TaskList = ({ scope }: ComponentGeneralProps) => (
  <ListComponent
    title='tasks'
    columns={columns}
    apiEndpoint={`/cur/${scope === 'user' ? 'my-tasks' : 'tasks'}`}
    routerUrl={`/apps/cur/task/${scope}`}
    listView={true}
    showOnlyOptions={scope === 'user' ? ['edit', 'search', 'print'] : []}
    // showStats={true}
    // statsConfig={statsConfig}
    // filterTabsConfig={filterTabsConfig}
  />
)

export default TaskList
