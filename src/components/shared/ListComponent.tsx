import {
  FormProvider,
  Locale,
  useEffect,
  useForm,
  useRecordList,
  useState,
  useMemo,
  type ListComponentProps,
  Box,
  Grid,
  StatCard,
  FilterTabs,
  StatCardConfig
} from '@/shared'
import { getGridSize } from '@/libs/SharedFunctions'
import { DynamicTable } from './DynamicDataTable'
import { getDictionary } from '@/utils/getDictionary'
import { AggregateFunction, StatisticsConfig } from '@/types/components/statistics'

// ListComponent.tsx
export const ListComponent = ({
  title = '',
  columns,
  apiEndpoint,
  routerUrl,
  selectable = true,
  listView = true,
  showOnlyOptions = [],
  extraQueryParams = {},
  enableFilters = false,
  enableColumnVisibility = false,
  initialVisibleColumns,
  rowOptions,
  headerOptions,
  collapsible,
  expandableColumns,
  maxVisibleColumns,
  deleteApiEndpoint,
  fetchKey = 'id',
  extraActionConfig,
  extraActions,
  mapLocation,
  showStats = false,
  statsConfig = [],
  filterTabsConfig = [],
  initialStatistics, // ✅ Add initialStatistics
  onRowOptionClick // ✅ Add onRowOptionClick to props
}: ListComponentProps & { onRowOptionClick?: (action: string, id: any, row: any) => void }) => {
  const [activeTab, setActiveTab] = useState('ALL')

  const buildInitialStatisticsFromStatsConfig = (statsConfig: StatCardConfig[]): StatisticsConfig[] => {
    return statsConfig
      .filter(config => config.field && config.field !== 'ALL') // skip ALL
      .map((config, index) => ({
        id: config.field || `stat_${index}`,

        group_by: [config.field!],

        aggregates: config.aggregates || {
          key: 'id',
          function: AggregateFunction.COUNT
        },

        ...(config.relations && (!config.options || config.options.length === 0) && { relations: config.relations }),
        // passing an optionalFilter
        ...(config.filter && { filter: config.filter })
      }))
  }

  const computedInitialStatistics = useMemo(() => {
    if (initialStatistics && initialStatistics.length > 0) {
      return initialStatistics
    }

    if (statsConfig && statsConfig.length > 0) {
      return buildInitialStatisticsFromStatsConfig(statsConfig)
    }

    return []
  }, [initialStatistics, statsConfig])

  const {
    records,
    meta,
    statistics,
    loadRecords,
    handleHeaderOptionAction,
    handleRowOptionClick,
    handleMultiDelete,
    handleFilterChange,
    locale,
    handleSort,
    filters
  } = useRecordList(
    apiEndpoint,
    routerUrl,
    listView,
    routerUrl,
    extraQueryParams,
    deleteApiEndpoint,
    computedInitialStatistics
  )

  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    getDictionary(locale as Locale).then((res: any) => {
      setDictionary(res)
    })
  }, [locale])

  const [selectedRows, setSelectedRows] = useState<any[]>([]) // track selected rows

  // Ensure to update the currentPage and totalItems when pagination changes
  const handlePaginationChange = (pageIndex: number, pageSize: number) => {
    loadRecords(pageIndex, pageSize) // Ensure to pass the correct arguments
  }

  const handleMultiDeleteClick = (selectedIds: any[]) => {
    if (selectedIds.length > 0) {
      handleMultiDelete(selectedIds)
    } else {
      console.warn('No rows selected for deletion.')
    }
  }

  const handleFiltersApply = (newFilters: Record<string, any>) => {
    handleFilterChange(newFilters)
  }

  // ✅ Derive filterable columns from the columns array
  const filterableColumns = columns
    .filter(col => col.enableFilter)
    .map(col => ({
      accessorKey: col.model ? `${col.model}.${col.filterAccessorKey || col.accessorKey}` : (col.filterAccessorKey || col.accessorKey),
      originalAccessorKey: col.accessorKey, // used for inline filter header matching
      label: col.header,
      type: col.filterType || 'text',
      options: col.filterOptions,
      apiUrl: col.filterApiUrl,
      labelProp: col.filterLabelProp,
      keyProp: col.filterKeyProp,
      queryParams: col.filterQueryParams,
      filterDisplayProps: col.filterDisplayProps,
      filterSearchProps: col.filterSearchProps,
      filterPlaceholder: col.filterPlaceholder,
      model: col.model
    }))

  const getTotalForGroup = (data: any[], resultKey: string) => {
    return data.reduce((sum, item) => sum + Number(item[resultKey] || 0), 0)
  }

  const normalizedFilterTabs = useMemo(() => {
    if (!filterTabsConfig?.length) return []

    return filterTabsConfig.map(group => ({
      field: group.name,
      tabs: group.options
    }))
  }, [filterTabsConfig])

  const tabs = useMemo(() => {
    const group = normalizedFilterTabs[0]
    if (!group) return []

    const field = group.field
    const resultKey = 'count'

    const statGroup = statistics?.find((g: any) => g.data?.some((item: any) => item?.[field] !== undefined))

    const data = statGroup?.data || []

    const getCount = (val: string) => {
      const found = data.find((s: any) => String(s[field]) === String(val))
      return found ? Number(found[resultKey]) : 0
    }

    return [
      {
        label: 'الكل',
        value: 'ALL',
        count: data.reduce((sum: number, i: any) => sum + Number(i[resultKey] || 0), 0)
      },
      ...group.tabs.map(tab => ({
        label: tab.label,
        value: tab.value,
        icon: tab.icon,
        iconColor: tab.iconColor,
        count: getCount(tab.value)
      }))
    ]
  }, [statistics, normalizedFilterTabs])

  const handleTabChange = (newVal: string) => {
    setActiveTab(newVal)

    const group = normalizedFilterTabs?.[0]
    const field = group?.field || 'status'

    const updatedFilters = { ...filters }

    if (newVal === 'ALL') {
      delete updatedFilters[field]
    } else {
      updatedFilters[field] = newVal
    }

    handleFilterChange(updatedFilters)
  }
  const flatStatistics = useMemo(() => {
    if (!statistics) return []

    return statistics.flatMap((group: any) => group.data || [])
  }, [statistics])

  const groupedStats = statistics || []

  const getChartConfigByType = ({ type, config, data, resultKey, dictionary }: any) => {
    const getValue = (item: any) => Number(item[resultKey] || 0)
    const resolveLabel = (item: any) => {
      const rawValue = item?.[config.field]

      if (config.options && config.field) {
        const opt = config.options.find((o: any) => String(o.value) === String(rawValue))

        // ✅ correct fallback logic
        return opt?.label ?? 'غير محدد'
      }

      const hasNoOptions = !config.options || config.options.length === 0

      const keyTitle = config.relations && hasNoOptions ? 'name' : config.keyTitle

      if (keyTitle) {
        return item?.[keyTitle] ?? 'غير محدد'
      }
      return rawValue ?? 'غير محدد'
    }

    const labels = data.map(resolveLabel)

    if (type === 'pie' || type === 'donut') {
      return {
        labels,
        series: data.map(getValue)
      }
    }

    if (type === 'radialBar') {
      const total = data.reduce((sum: number, item: any) => sum + getValue(item), 0)
      return {
        labels: labels,
        series: [total]
      }
    }

    return {
      labels,
      series: [
        {
          name: config.sectionTitle || config.field || 'data',
          data: data.map(getValue)
        }
      ]
    }
  }

  // ✅ Stats Logic
  const stats = useMemo(() => {
    if (!showStats || !statsConfig.length) return []

    const groupedStats = statistics || []

    return statsConfig
      .map(config => {
        const resultKey = config.resultKey || 'count'
        const type = config.type || 'card'
        const chartOptions = config.chartOptions || {}

        const group = groupedStats.find((g: any) => g.data?.some((item: any) => item?.[config.field!] !== undefined))

        const data = group?.data || []

        const total = data.reduce((sum: number, item: any) => sum + Number(item[resultKey] || 0), 0)

        const totalConfig = config.totalConfig || {}
        const items: any[] = []

        // ============================
        // 🟢 CHART
        // ============================
        if (type !== 'card' && type !== 'radialBar') {
          const { series, labels } = getChartConfigByType({
            type,
            config,
            data,
            resultKey,
            dictionary
          })

          items.push({
            ...config,
            type,
            title: config.title || dictionary?.placeholders?.[config.sectionTitle ?? ''] || '',

            // ✅ FIX: inject icon
            icon: config.icon || chartOptions.icon || 'ri-bar-chart-line',

            color: chartOptions.color || config.color,

            value: null,
            chartSeries: series,
            chartCategories: labels,
            chartOptions: config.chartOptions || {}
          })
        }

        // ============================
        // � RADIAL BAR
        // ============================
        else if (type === 'radialBar') {
          // Total as radialBar
          items.push({
            ...config,
            type: 'radialBar',
            title: chartOptions.totalLabel || totalConfig.title || dictionary?.placeholders['total'] || 'الاجمالي',

            icon:
              chartOptions.totalIcon || chartOptions.icon || totalConfig.icon || config.icon || 'ri-information-line',

            color: chartOptions.color || totalConfig.color || config.color,

            value: null,
            chartSeries: [total],
            chartCategories: [
              chartOptions.totalLabel || totalConfig.title || dictionary?.placeholders['total'] || 'Total'
            ],
            chartOptions: config.chartOptions || {},
            isTotal: true
          })

          // Options as cards with percentages
          if (config.options && config.field) {
            const knownValues = new Set(config.options.map(o => String(o.value)))

            config.options.forEach(option => {
              const stat = data.find((s: any) => String(s[config.field!]) === String(option.value))
              const value = stat ? Number(stat[resultKey]) : 0
              const percentageNumber = total > 0 ? (value / total) * 100 : 0

              items.push({
                ...config,
                type: 'radialBar',
                title: option.label,
                value: null,

                icon: option.icon || chartOptions.icon || config.icon || 'ri-information-line',

                color: option.color || chartOptions.color || config.color,

                chartSeries: [percentageNumber],
                chartCategories: [`${option.label} - ${value}`],
                chartOptions: config.chartOptions || {}
              })
            })

            // Unknown as radialBar
            data.forEach((s: any) => {
              if (!knownValues.has(String(s[config.field!]))) {
                const value = Number(s[resultKey])
                const percentageNumber = total > 0 ? (value / total) * 100 : 0

                items.push({
                  ...config,
                  type: 'radialBar',
                  title:
                    chartOptions.unknownLabel ||
                    config.unknownLabel ||
                    dictionary?.placeholders['indefinite'] ||
                    'غير محدد',

                  icon: chartOptions.unknownIcon || chartOptions.icon,

                  value: null,
                  chartSeries: [percentageNumber],
                  chartCategories: [
                    chartOptions.unknownLabel ||
                      config.unknownLabel ||
                      dictionary?.placeholders['indefinite'] ||
                      'غير محدد'
                  ],
                  chartOptions: config.chartOptions || {}
                })
              }
            })
          }

          const hasNoOptions = !config.options || config.options.length === 0
          const keyTitle = config.relations && hasNoOptions ? 'name' : config.keyTitle

          // Key Title as radialBar
          if (keyTitle && hasNoOptions) {
            data.forEach((s: any) => {
              const value = Number(s[resultKey])
              const percentageNumber = total > 0 ? (value / total) * 100 : 0

              items.push({
                ...config,
                type: 'radialBar',
                icon: chartOptions.icon || config.icon || 'ri-information-line',
                title: s[keyTitle!] || chartOptions.unknownLabel || config.unknownLabel || 'غير محدد',

                value: null,
                chartSeries: [percentageNumber],
                // chartCategories: [
                //   `${s[keyTitle!] || chartOptions.unknownLabel || config.unknownLabel || 'غير محدد'} - ${value}`
                // ],
                chartCategories: [`${value}`],
                chartOptions: config.chartOptions || {}
              })
            })
          }
        }

        // ============================
        // �🟡 CARDS
        // ============================
        else {
          // 🔵 TOTAL
          items.push({
            ...config,
            type,
            title: chartOptions.totalLabel || totalConfig.title || dictionary?.placeholders['total'] || 'الاجمالي',

            icon:
              chartOptions.totalIcon || chartOptions.icon || totalConfig.icon || config.icon || 'ri-information-line',

            color: chartOptions.color || totalConfig.color || config.color,

            value: String(total),
            isTotal: true
          })

          // 🔵 OPTIONS
          if (config.options && config.field) {
            const knownValues = new Set(config.options.map(o => String(o.value)))

            config.options.forEach(option => {
              const stat = data.find((s: any) => String(s[config.field!]) === String(option.value))

              items.push({
                ...config,
                type,
                title: option.label,
                value: stat ? String(stat[resultKey]) : '0',

                icon: option.icon || chartOptions.icon || config.icon || 'ri-information-line',

                color: option.color || chartOptions.color || config.color
              })
            })

            // 🔵 UNKNOWN
            data.forEach((s: any) => {
              if (!knownValues.has(String(s[config.field!]))) {
                items.push({
                  ...config,
                  type,
                  title:
                    chartOptions.unknownLabel ||
                    config.unknownLabel ||
                    dictionary?.placeholders['indefinite'] ||
                    'غير محدد',

                  icon: chartOptions.unknownIcon || chartOptions.icon,

                  value: String(s[resultKey])
                })
              }
            })
          }
          const hasNoOptions = !config.options || config.options.length === 0

          const keyTitle = config.relations && hasNoOptions ? 'name' : config.keyTitle
          // 🔵 KEY TITLE
          if (config.keyTitle) {
            data.forEach((s: any) => {
              items.push({
                ...config,
                type,
                icon: chartOptions.icon || config.icon || 'ri-information-line',
                title: s[keyTitle!] || chartOptions.unknownLabel || config.unknownLabel || 'غير محدد',

                value: String(s[resultKey])
              })
            })
          }
        }

        return {
          sectionTitle: config.sectionTitle,
          items,
          field: config.field,
          resultKey,
          total
        }
      })
      .filter(section => section.total > 0)
  }, [showStats, statsConfig, statistics, dictionary])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: showStats ? 6 : 0 }}>
      {showStats && stats.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Grid container spacing={6}>
            {stats.map((section, sectionIndex) => {
              // ✅ SAFE MATCH (not index-based)
              const sectionConfig = statsConfig.find(c => c.field === section.field)

              const chartOptions = sectionConfig?.chartOptions || {}

              const sectionGridSize = sectionConfig?.gridSize ? getGridSize('*', sectionConfig.gridSize) : { xs: 12 }

              return (
                <Grid key={sectionIndex} size={sectionGridSize}>
                  <Box>
                    {section.sectionTitle && (
                      <Box
                        sx={{
                          mb: 3,
                          fontWeight: 'bold',
                          fontSize: 18,
                          borderLeft: '4px solid',
                          borderColor: 'primary.main',
                          pl: 2
                        }}
                      >
                        {dictionary?.placeholders[section.sectionTitle] ?? section.sectionTitle}
                      </Box>
                    )}

                    {/* 🔵 INNER GRID */}
                    <Grid container spacing={6}>
                      {section.items.map((stat, index) => {
                        const gridSize = chartOptions.gridSize
                          ? getGridSize('*', chartOptions.gridSize)
                          : {
                              xs: 12,
                              sm: 6,
                              md: stat.type !== 'card' ? 12 : 4
                            }

                        return (
                          <Grid key={index} size={gridSize}>
                            <StatCard {...stat} dictionary={dictionary} />
                          </Grid>
                        )
                      })}
                    </Grid>

                    {sectionIndex !== stats.length - 1 && (
                      <Box
                        sx={{
                          mt: 6,
                          borderBottom: '1px dashed',
                          borderColor: 'divider'
                        }}
                      />
                    )}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }} className='previewCard'>
        {tabs.length > 0 && <FilterTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />}

        <DynamicTable
          columns={columns}
          data={records}
          totalItems={meta.total}
          currentPage={meta.current_page - 1} // Adjust page index since react-table uses 0-based index
          onPaginationChange={handlePaginationChange} // Pass the handler here
          title={dictionary?.titles?.[title] || 'قائمة'}
          onHeaderOptionClick={handleHeaderOptionAction}
          handleSort={handleSort}
          onRowOptionClick={async (action, id, customUrl, row) => {
            let handled = false
            if (onRowOptionClick) {
              handled = (await onRowOptionClick(action, id, row)) as any
            }
            if (!handled) {
              handleRowOptionClick(action, id, customUrl)
            }
          }}
          selectable={selectable}
          onSelectedIdsChange={selectedIds => handleMultiDeleteClick(selectedIds)}
          apiEndPoint={apiEndpoint}
          listView={listView}
          locale={locale as Locale}
          paginationStoreKey={routerUrl}
          showOnlyOptions={showOnlyOptions}
          // ✅ Filter props
          enableFilters={enableFilters}
          filterableColumns={filterableColumns}
          onFilterChange={handleFiltersApply}
          appliedFilters={filters}
          // ✅ Column visibility props
          enableColumnVisibility={enableColumnVisibility}
          onSelectedRowsChange={rows => {
            setSelectedRows(rows)
          }}
          initialVisibleColumns={initialVisibleColumns}
          rowOptions={rowOptions}
          headerOptions={headerOptions}
          collapsible={collapsible}
          expandableColumns={expandableColumns}
          maxVisibleColumns={maxVisibleColumns}
          fetchKey={fetchKey}
          extraActionConfig={extraActionConfig}
          extraActions={extraActions}
          mapLocation={mapLocation}
        />
      </Box>
    </Box>
  )
}
