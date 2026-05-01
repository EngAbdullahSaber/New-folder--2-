'use client'

import { Card, CardContent, Typography, Box, Avatar, useTheme, alpha, formatNumber, useMemo } from '@/shared'
import { useSettings } from '@/@core/hooks/useSettings'

import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface StatCardProps {
  title: string
  value?: string | number
  icon: string
  type?: 'card' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  trend?: { value: string; isUp: boolean }
  chartSeries?: any
  chartCategories?: string[]
  chartOptions?: ApexOptions
  dictionary: any
  isTotal?: boolean
}

const StatCard = ({
  title,
  value,
  icon,
  type = 'card',
  color = 'primary',
  trend,
  chartSeries = [],
  chartCategories = [],
  chartOptions,
  dictionary,
  isTotal = false
}: StatCardProps) => {
  const theme = useTheme()
  const extractApexOptions = (options?: any): ApexOptions => {
    if (!options) return {}

    const { gridSize, icon, totalIcon, unknownIcon, color, totalLabel, unknownLabel, ...apexOptions } = options

    return apexOptions
  }

  const { settings } = useSettings()

  const paletteColor = color && theme.palette[color] ? theme.palette[color].main : theme.palette.primary.main

  const mainColor =
    (chartOptions as any)?.color && (chartOptions as any).color.startsWith('#')
      ? (chartOptions as any).color
      : paletteColor
  const lightColor = alpha(theme.palette.primary.main, 0.12)

  // Explicit high-contrast theme colors
  const labelColor = settings.mode === 'dark' ? '#94a3b8' : settings.mode === 'light' ? '#64748b' : '#94a3b8'
  const textColor = settings.mode === 'dark' ? '#f8fafc' : settings.mode === 'light' ? '#1e293b' : '#f8fafc'
  const gridColor =
    settings.mode === 'dark' ? 'rgba(255,255,255,0.08)' : settings.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'
  const tooltipBg = settings.mode === 'dark' ? '#1e293b' : settings.mode === 'light' ? '#ffffff' : '#1e293b'
  const tooltipBorder = settings.mode === 'dark' ? '#334155' : settings.mode === 'light' ? '#e2e8f0' : '#334155'

  // Pie/Donut colors palette - more varied for many categories
  const pieColors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.secondary.main,
    '#7367F0',
    '#28C76F',
    '#EA5455',
    '#FF9F43',
    '#00CFE8'
  ]

  // =========================
  // DEFAULT OPTIONS
  // =========================
  const defaultChartOptions: ApexOptions = {
    chart: {
      type: type === 'card' ? 'area' : type,
      sparkline: { enabled: type === 'card' },
      animations: { enabled: true, speed: 800 },
      background: 'transparent',
      toolbar: { show: true },
      fontFamily: theme.typography.fontFamily
    },

    theme: {
      mode: (settings.mode === 'dark' ? 'dark' : settings.mode === 'light' ? 'light' : 'dark') as 'dark' | 'light'
    },

    colors: type === 'pie' || type === 'donut' || type === 'bar' ? pieColors : [mainColor],
    fill:
      type === 'radialBar'
        ? {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              type: 'horizontal',
              shadeIntensity: 0.5,
              gradientToColors: [alpha(mainColor, 0.7)],
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          }
        : {
            type: 'solid',
            opacity: 1
          },

    grid: {
      show: false
    },

    xaxis: {
      categories: chartCategories,
      labels: {
        show: true,
        rotate: -45,
        style: {
          fontSize: '11px',
          fontFamily: theme.typography.fontFamily,
          colors: labelColor
        }
      },
      axisBorder: { show: true, color: gridColor },
      axisTicks: { show: true, color: gridColor }
    },

    yaxis: {
      show: type !== 'card',
      labels: {
        style: {
          fontSize: '11px',
          fontFamily: theme.typography.fontFamily,
          colors: labelColor
        },
        formatter: (val: number) => formatNumber(val, 0, { useCurrency: false })
      }
    },

    labels: type === 'radialBar' ? ['Percent'] : chartCategories,

    tooltip: {
      theme: (settings.mode === 'dark' ? 'dark' : settings.mode === 'light' ? 'light' : 'dark') as 'dark' | 'light',
      x: { show: true },
      style: {
        fontSize: '12px',
        fontFamily: theme.typography.fontFamily
      }
    },

    stroke:
      type === 'radialBar'
        ? {
            lineCap: 'round'
          }
        : {
            show: true,
            curve: 'smooth',
            width: type === 'pie' || type === 'donut' ? 2 : 0,
            colors: [theme.palette.background.paper]
          },

    legend: {
      show: type === 'pie' || type === 'donut',
      position: 'right',
      fontFamily: theme.typography.fontFamily,
      labels: {
        colors: labelColor
      },
      itemMargin: {
        vertical: 4
      }
    },

    dataLabels: {
      enabled: true,
      style: {
        fontSize: '11px',
        fontFamily: theme.typography.fontFamily,
        fontWeight: 600,
        colors: [textColor]
      },
      dropShadow: {
        enabled: false
      },
      background: {
        enabled: type === 'pie' || type === 'donut',
        foreColor: settings.mode === 'dark' ? '#fff' : settings.mode === 'light' ? '#1e293b' : '#fff',
        padding: 6,
        backgroundColor: settings.mode === 'dark' ? '#0303035d' : settings.mode === 'light' ? '#fafafa86' : '#0303035d',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: settings.mode === 'dark' ? 'rgba(255,255,255,0.1)' : settings.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
        opacity: 0.9
      },
      formatter: function (val: number, opts: any) {
        if (type === 'pie' || type === 'donut') {
          return val > 5 ? val.toFixed(1) + '%' : ''
        }
        return val
      }
    },
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 4,
        columnWidth: '60%'
      },
      pie: {
        donut: {
          size: '70%'
        }
      },
      ...(type === 'radialBar' && {
        radialBar: {
          startAngle: -135,
          endAngle: 225,
          hollow: {
            margin: 0,
            size: '70%',
            background: 'transparent',
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24
            }
          },
          track: {
            background:
              settings.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.4)
                : settings.mode === 'light'
                  ? '#f1f5f9'
                  : alpha(theme.palette.background.paper, 0.4),
            strokeWidth: '67%',
            margin: 0,
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35
            }
          },
          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: labelColor,
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              formatter: function (val: any) {
                return parseInt(val).toString() + (!isTotal ? `% ${dictionary?.placeholders['from']}` : '')
              },
              fontSize: '16px',
              fontWeight: 600,
              color: textColor,
              // fontSize: '36px',
              show: true,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      })
    }
  }

  const finalChartOptions = useMemo(() => {
    const cleanChartOptions = extractApexOptions(chartOptions)

    return {
      ...defaultChartOptions,
      ...cleanChartOptions,

      chart: {
        ...defaultChartOptions.chart,
        ...(cleanChartOptions?.chart || {}),
        fontFamily: theme.typography.fontFamily,
        toolbar: {
          show: type !== 'card',
          ...(cleanChartOptions?.chart?.toolbar || {}),
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          }
        }
      },

      colors:
        type === 'pie' || type === 'donut'
          ? cleanChartOptions?.colors || pieColors
          : cleanChartOptions?.colors || defaultChartOptions.colors,

      legend: {
        ...defaultChartOptions.legend,
        ...(cleanChartOptions?.legend || {}),
        fontFamily: theme.typography.fontFamily,
        labels: {
          colors: labelColor
        }
      },

      dataLabels: {
        ...defaultChartOptions.dataLabels,
        ...(cleanChartOptions?.dataLabels || {}),
        ...(type === 'radialBar' &&
          isTotal && {
            value: {
              formatter: function (val: any) {
                return parseInt(val).toString()
              }
            }
          })
      },

      theme: {
        mode: (settings.mode === 'dark' ? 'dark' : settings.mode === 'light' ? 'light' : 'dark') as 'dark' | 'light'
      },

      xaxis: {
        ...defaultChartOptions.xaxis,
        ...(cleanChartOptions?.xaxis || {}),
        categories: chartCategories
      },

      labels: chartCategories
    }
  }, [chartOptions, chartCategories, type, settings.mode, labelColor, textColor, gridColor, mainColor, theme.typography.fontFamily])

  // =========================
  // SERIES FIX
  // =========================
  const getSeries = () => {
    if (type === 'pie' || type === 'donut') {
      return chartSeries.length ? chartSeries : [10, 20, 30]
    }

    if (type === 'radialBar') {
      return chartSeries.length ? chartSeries : [75]
    }

    const data = chartSeries?.[0]?.data || []

    return [
      {
        name: title,
        data: data.length ? data : [10, 20, 30]
      }
    ]
  }

  // =========================
  // RENDER
  // =========================
  const renderChart = () => {
    if (type === 'card') return null
    console.log(finalChartOptions)
    return (
      <Box
        sx={{
          mt: 2,
          '& .apexcharts-legend-text': {
            color: `${labelColor} !important`,
            fontFamily: `${theme.typography.fontFamily} !important`
          },
          '& .apexcharts-datalabel-label, & .apexcharts-datalabel-value': {
            fill: textColor,
            fontFamily: `${theme.typography.fontFamily} !important`
          },
          '& .apexcharts-canvas, & .apexcharts-canvas *': {
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important'
          }
        }}
      >
        <ReactApexChart
          key={settings.mode === 'dark' ? 'dark' : settings.mode === 'light' ? 'light' : 'dark'}
          options={finalChartOptions}
          series={getSeries()}
          type={type}
          height={type === 'radialBar' ? 350 : type === 'pie' || type === 'donut' ? 240 : 200}
          width='100%'
        />
      </Box>
    )
  }

  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardContent>
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant='caption'>{title}</Typography>

            {type === 'card' && (
              <Typography variant='h3'>
                {/* {formatNumber(value || 0, 0,{ useCurrency: false })} */}
                {value}
              </Typography>
            )}
          </Box>

          <Avatar sx={{ bgcolor: lightColor, color: mainColor }}>
            <i className={icon} />
          </Avatar>
        </Box>

        {/* CHART */}
        {renderChart()}

        {/* TREND */}
        {trend && (
          <Box sx={{ mt: 1 }}>
            <Typography
              sx={{
                color: trend.isUp ? 'success.main' : 'error.main'
              }}
            >
              {trend.value}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
