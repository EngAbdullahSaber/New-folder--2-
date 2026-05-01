import type { StatisticsConfig } from '@/types/components/statistics'
import { AggregateFunction } from '@/types/components/statistics'
/**
 * ✅ Helper to create a statistics configuration
 * @param groupBy - Fields to group by
 * @param key - Field to aggregate on
 * @param fn - Aggregate function (count, sum, avg, min, max)
 * @param filter - Optional filter configuration
 */
export const createStatistics = (
  group_by: string[],
  key: string,
  fn: AggregateFunction,
  filter?: StatisticsConfig['filter']
): StatisticsConfig => ({
  group_by,
  aggregates: {
    key,
    function: fn
  },
  ...(filter && { filter })
})

/**
 * ✅ Helper to create multiple statistics at once
 */
export const createMultipleStatistics = (
  configs: Array<{
    groupBy: string[]
    key: string
    fn: AggregateFunction
    filter?: StatisticsConfig['filter']
  }>
): StatisticsConfig[] => {
  return configs.map(config => createStatistics(config.groupBy, config.key, config.fn, config.filter))
}

/**
 * ✅ Default statistics helpers
 */
export const statisticsPresets = {
  countByStatus: (): StatisticsConfig => createStatistics(['status'], 'id', AggregateFunction.COUNT),

  countAll: (): StatisticsConfig => createStatistics([], 'id', AggregateFunction.COUNT),

  sumByStatus: (field: string = 'amount'): StatisticsConfig =>
    createStatistics(['status'], field, AggregateFunction.SUM),

  avgByStatus: (field: string = 'amount'): StatisticsConfig =>
    createStatistics(['status'], field, AggregateFunction.AVG),

  minByStatus: (field: string = 'amount'): StatisticsConfig =>
    createStatistics(['status'], field, AggregateFunction.MIN),

  maxByStatus: (field: string = 'amount'): StatisticsConfig =>
    createStatistics(['status'], field, AggregateFunction.MAX)
}

/**
 * ✅ Default initial statistics sent to all pages
 * Sends count grouped by status as the base statistic
 */
// export const DEFAULT_INITIAL_STATISTICS: Array<{
//   group_by: string[]
//   aggregates: { key: string; function: string }
// }> = [
//   {
//     group_by: ['status'],
//     aggregates: {
//       key: 'id',
//       function: 'count'
//     }
//   }
// ]

/**
 * ✅ Merge statistics: adds provided stats to the default stats
 * Avoids duplicates by comparing groupBy and key
 */
export const mergeStatisticsWithDefaults = (additionalStats?: StatisticsConfig[]): StatisticsConfig[] => {
  // Start with defaults
  // const merged = [...DEFAULT_INITIAL_STATISTICS]

  // if (!additionalStats || additionalStats.length === 0) {
  //   return merged
  // }

  const merged: typeof additionalStats = []

  if (!additionalStats || additionalStats.length === 0) {
    return merged
  }

  additionalStats.forEach(newStat => {
    const isDuplicate = merged.some(
      stat =>
        JSON.stringify(stat.group_by) === JSON.stringify(newStat.group_by) &&
        stat.aggregates.key === newStat.aggregates.key &&
        stat.aggregates.function === newStat.aggregates.function
    )

    if (!isDuplicate) {
      merged.push(newStat)
    }
  })

  return merged
}
