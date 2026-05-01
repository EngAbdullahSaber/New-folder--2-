import type { DynamicFormFieldProps, Locale } from '@/shared'
import type { MenuOption } from './rowOptions'
import { AggregateFunction, Condition, Rule, StatisticsConfig } from './statistics'
import { ApexOptions } from 'apexcharts'

export interface DynamicTableProps {
  columns: {
    id?: string
    width?: string
    accessorKey: string
    header: string | React.ReactNode
    icon?: any
    align?: string
    cell?: (props: { row: any }) => React.ReactNode // Add support for custom cell renderers,
    combine?: string[]
    fontSize?: string | number
    isIdentifier?: boolean
    isRef?: boolean
    component?: any
    model?: string
    list?: any
    badgeColor?: string | 'primary' | 'default' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    // ✅ Filter props added to column definition
    enableFilter?: boolean
    filterType?: FilterType
    filterOptions?: Array<{ label: string; value: any }>
    filterApiUrl?: string
    filterLabelProp?: string
    filterKeyProp?: string
    filterQueryParams?: Record<string, any>
    reportExclude?: boolean
    filterAccessorKey?: string
    routerUrl?: string
    showCurrency?: boolean
    isVisible?: boolean
  }[]
  data: any[]
  totalItems: number
  currentPage: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  title?: string
  headerOptions?: MenuOption[] // Optional to allow default header options
  onHeaderOptionClick: (action: string) => void // Callback to parent
  rowOptions?: MenuOption[]
  onRowOptionClick: (action: string, id: any, customUrl?: string, row?: any) => void
  selectable?: boolean
  onSelectedIdsChange?: (selectedIds: string[]) => void
  handleSort: (column: any, direction: any) => void
  apiEndPoint?: string
  listView?: boolean
  locale?: Locale
  paginationStoreKey?: string
  showBarcode?: boolean
  enableFilters?: boolean
  filterableColumns?: ColumnFilter[]
  onFilterChange?: (filters: Record<string, any>) => void
  enableColumnVisibility?: boolean
  initialVisibleColumns?: string[] // Array of accessorKeys to show initially
  appliedFilters?: Record<string, any>
  fetchKey?: string
  formActionLabel?: string
  formActionIcon?: string
  extraActionConfig?: ExtraActionConfig
  extraActions?: ExtraActionConfig[]
  mapLocation?: string[]
}

export interface ExtraActionConfig {
  action: string
  title: string
  icon: React.ReactNode
  color?: string
  loading?: boolean
  disabled?: boolean
  isSelectionIndependent?: boolean
}
export type FilterType = 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'checkbox'

export interface ColumnFilter {
  accessorKey: string
  label: string | React.ReactNode
  type: FilterType
  options?: Array<{ label: string; value: any }>
  apiUrl?: string // For dynamic select options
  labelProp?: string
  keyProp?: string
  filterAccessorKey?: string
  filterDisplayProps?: string[]
  filterSearchProps?: string[]
  filterPlaceholder?: string
  filterQueryParams?: Record<string, any>
  queryParams?: any
  [key: string]: any
}
export interface DynamicColumnDef {
  id?: string
  accessorKey: string
  header: string | React.ReactNode
  width?: string
  align?: string
  type?: string
  list?: any[]
  cell?: any
  combine?: string[]
  displayWithBadge?: boolean
  isIdentifier?: boolean
  isRef?: boolean
  component?: any
  fontSize?: string | number
  rounded?: string
  badgeColor?: string
  icon?: any
  decimals?: number
  locale?: string
  showHijri?: boolean
  showTime?: boolean
  showPrimary?: boolean
  showPrimaryKey?: string
  model?: string

  // ✅ Filter props added to DynamicColumnDef
  enableFilter?: boolean
  filterType?: FilterType
  filterOptions?: Array<{ label: string; value: any }>
  filterApiUrl?: string
  filterLabelProp?: string
  filterKeyProp?: string
  filterQueryParams?: Record<string, any>
  reportExclude?: boolean
  filterAccessorKey?: string
  filterDisplayProps?: string[]
  filterSearchProps?: string[]
  filterPlaceholder?: string
  isVisible?: boolean
  [key: string]: any
}

export interface ListComponentProps {
  title?: string
  columns: DynamicColumnDef[]
  apiEndpoint: string
  routerUrl: string
  selectable?: boolean
  listView?: boolean
  enableFilters?: boolean
  // filterableColumns now derived from columns
  onFilterChange?: (filters: Record<string, any>) => void
  enableColumnVisibility?: boolean
  initialVisibleColumns?: string[] // Array of accessorKeys to show initially
  collapsible?: boolean
  expandableColumns?: string[] // accessorKeys that go inside expandable
  maxVisibleColumns?: number
  showOnlyOptions?: Array<'add' | 'edit' | 'delete' | 'search' | 'print' | 'export' | (string & {})>
  extraQueryParams?: Record<string, any>
  rowOptions?: MenuOption[]
  headerOptions?: MenuOption[]
  deleteApiEndpoint?: string
  fetchKey?: string

  extraActionConfig?: ExtraActionConfig
  extraActions?: ExtraActionConfig[]
  mapLocation?: string[]

  // ✅ New Props for dynamic Stats and Tabs
  showStats?: boolean
  statsConfig?: StatCardConfig[]
  filterTabsConfig?: FilterTabConfig[]

  // ✅ Initial Statistics to send to backend
  // initialStatistics?: Array<{
  //   group_by: string[]
  //   aggregates: {
  //     key: string
  //     function: string
  //   }
  //   filter?: any
  // }>
  initialStatistics?: StatisticsConfig[]
  onRowOptionClick?: (action: string, id: any, customUrl?: string, row?: any) => void
}

export interface StatOption {
  value: string
  label: string
  icon?: string
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | (string & {})
  showChart?: boolean
}

export interface StatCardConfig {
  title?: string

  field?: string

  value?: string

  icon?: string

  aggregates?: {
    key: string
    function: AggregateFunction
  }

  relations?: {
    name: string
    column: string
  }

  totalConfig?: {
    title?: string
    icon?: string
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  }

  filter?: {
    condition: Condition
    rules: Rule[]
  }

  type?: 'card' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar'

  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'

  options?: StatOption[]

  keyTitle?: string
  unknownLabel?: string

  history?: number[]
  showChart?: boolean

  resultKey?: string // default = "count"
  sectionTitle?: string

  chartOptions?: ApexOptions & {
    // 🟢 UI / layout (NEW responsibility)
    gridSize?:
      | number
      | {
          defaultGridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
          [key: string]: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number } | undefined
        }
      | ((mode?: string) => { xs?: number; sm?: number; md?: number; lg?: number; xl?: number })

    icon?: string
    totalIcon?: string
    unknownIcon?: string

    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | (string & {})

    totalLabel?: string
    unknownLabel?: string
  }

  cardConfig?: {
    type: string
  }

  chartConfig?: string

  // ✅ Grid size configuration for stat card (supports multiple formats)
  gridSize?:
    | number
    | {
        defaultGridSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
        [key: string]: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number } | undefined
      }
    | ((mode?: string) => { xs?: number; sm?: number; md?: number; lg?: number; xl?: number })

  // filterTabsConfig?: FilterTabConfig[]
}
export interface FilterTabOption {
  label: string
  value: string
  icon?: string
  iconColor?: string
}
export interface FilterTabConfig {
  name: string
  options: FilterTabOption[]
}
