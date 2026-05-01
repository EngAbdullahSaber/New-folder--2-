'use client'
import {
  flightStateList,
  flightTypeList,
  ListComponent,
  statusList,
  useRouter,
  useParams,
  getLocalizedUrl,
  DynamicColumnDef,
  useMemo,
  useCityAccess,
  toOptions
} from '@/shared'
import { useDialog } from '@/contexts/dialogContext'
import FlightArrivalDetailsDialog from '../components/FlightArrivalDetailsDialog'
import { ComponentGeneralHajProps } from '@/types/pageModeType'

const FlightDetailList = ({ scope }: ComponentGeneralHajProps) => {
  const router = useRouter()
  const params = useParams()
  const lang = params?.lang as string
  const { openDialog } = useDialog()
  const { shouldBlockAccess, AccessBlockedScreen, locale, user } = useCityAccess()

  const columns: DynamicColumnDef[] = useMemo(
    () => [
      { accessorKey: 'id', header: 'id', width: '8%' },
      // { accessorKey: 'direction', header: 'direction_flight', width: '5%', align: 'text-center' },
      {
        accessorKey: 'airport_code',
        header: 'airport_code_flight',
        width: '5%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'select',
        filterApiUrl: '/def/ports',
        filterLabelProp: 'port_code',
        filterKeyProp: 'port_code'
      },
      {
        accessorKey: 'flight_date',
        header: 'flight_date',
        width: '7%',
        align: 'text-center',
        type: 'date',
        showTime: true,
        enableFilter: true,
        filterType: 'date'
      },
      {
        accessorKey: 'flight_no',
        header: 'flight_no',
        width: '6%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'text'
      },
      {
        accessorKey: 'air_trans_company_name_ar',
        header: 'air_trans_company',
        align: 'text-right',
        enableFilter: true,
        filterAccessorKey: 'air_trans_company_id',
        filterApiUrl: '/def/iata-carriers',
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterType: 'select'
      },
      {
        accessorKey: 'fromCity.name_ar',
        header: 'from_city_flight',
        width: '11%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterOptions: toOptions(user?.user_cities, locale as string),
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'from_city_id'
      },
      {
        accessorKey: 'toCity.name_ar',
        header: 'to_city_flight',
        width: '11%',
        align: 'text-start',
        enableFilter: true,
        filterType: 'select',
        filterOptions: toOptions(user?.user_cities, locale as string),
        filterLabelProp: 'name_ar',
        filterKeyProp: 'id',
        filterAccessorKey: 'to_city_id'
      },
      {
        accessorKey: 'max_capacity',
        header: 'max_capacity_flight',
        width: '6%',
        align: 'text-center',
        enableFilter: true,
        filterType: 'number'
      },
      {
        accessorKey: 'state',
        header: 'flight_state',
        width: '7%',
        align: 'text-center',
        type: 'badge',
        list: flightStateList,
        filterType: 'select',
        enableFilter: true,
        filterOptions: flightStateList
      },
      {
        accessorKey: 'timestamp',
        header: 'last_timestamp',
        width: '7%',
        align: 'text-center',
        type: 'dateTime',
        // showHijri: false,
        showTime: true,
        enableFilter: true,
        filterType: 'date'
      }
      // {
      //   accessorKey: 'flight_type',
      //   header: 'flight_type_list',
      //   width: '5%',
      //   align: 'text-center',
      //   list: flightTypeList,
      //   type: 'badge'
      // }
    ],
    []
  )

  const handleRowOptionClick = (action: string, id: any, row: any) => {
    if (action === 'arrival_link') {
      openDialog(FlightArrivalDetailsDialog, { id, data: row })
      return true
    }
    return false
  }

  const rowOptions =
    scope === 'arrival'
      ? [
        { text: 'edit', action: 'edit', visible: true },
        { text: 'delete', action: 'delete', visible: true },
        {
          text: 'arrival_link',
          action: 'arrival_link',
          icon: 'ri-chat-2-line',
          color: 'info',
          isExternal: true
        }
      ]
      : undefined

  return (
    <ListComponent
      title='flight_details'
      columns={columns}
      apiEndpoint='/haj/flight-details'
      routerUrl={`/apps/haj/flight-detail/${scope}`}
      listView={true}
      extraQueryParams={{ direction: scope === 'arrival' ? 'A' : 'D' }}
      onRowOptionClick={handleRowOptionClick}
      rowOptions={rowOptions}
      enableFilters={true}
    />
  )
}

export default FlightDetailList
