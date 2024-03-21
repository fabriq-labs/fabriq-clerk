// BarChart
import { formatNumber } from "@/utils/helper";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";


const StackedBarChart = ({
  series,
  colors,
  max,
  legend,
  height,
  legendLabels,
  tooltipLabels = null,
  secondTooltipLabels = null,
  isRevenue = false,
  isAudience = false
}: any) => {
  const [seriesData, setSeriesData] = useState([]);
  const customLegendLabels = legendLabels || [];

  useEffect(() => {
    setSeriesData(series);
  }, [series]);

  const tooltipFormatter = function (value: any, { seriesIndex }: any) {
    if (tooltipLabels?.length > 0) {
      const val = formatNumber(tooltipLabels?.[seriesIndex]);
      return isRevenue ? `$${val}` : val;
    } else {
      return `${value.toFixed(2)} %`;
    }
  };

  const chartTooltip = isRevenue
    ? {
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          return (
            '<div class="arrow_box">' +
            "<div>" +
            '<div class="tooltip-label">' +
            w?.globals?.seriesNames[seriesIndex] +
            "</div>" +
            "<span>" +
            "Revenue: " +
            "</span>" +
            "$" +
            formatNumber(tooltipLabels?.[seriesIndex]) +
            "&nbsp;" +
            "(" +
            series?.[seriesIndex]?.[0]?.toFixed(2) +
            "%" +
            ")" +
            "</div>" +
            "<div>" +
            "<span>" +
            "eCPM: " +
            "</span>" +
            "$" +
            formatNumber(secondTooltipLabels?.[seriesIndex]) +
            "</div>" +
            "</div>"
          );
        }
      }
    : isAudience
    ? {
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          return `
          <div class="arrow_box audience-tooltip-card">
              <div class="tooltip-label">
                ${w?.globals?.seriesNames[seriesIndex]}
              </div>
              <div class ="label-container-overview">
              ${formatNumber(tooltipLabels?.[seriesIndex])} 
              ${
                secondTooltipLabels?.[seriesIndex] ?  !secondTooltipLabels?.[seriesIndex].includes("-")
                  ?`<span class="ant-tag ant-tag-green additional-info">
                      ${secondTooltipLabels?.[seriesIndex]}%<img src="/images/up-arrow_new.png" alt="" class="img-arrow" width="14" height="14">
                    </span>`
                  : `<span class="ant-tag ant-tag-red additional-info">
                      ${secondTooltipLabels?.[seriesIndex].substring(1)}%<img src="/images/down-arrow_new.png" alt="" class="img-arrow" width="14" height="14">
                    </span>`
                    : `<span></span>`
              }
              </div>               
          </div>
          `;
        }
      }
    : {
        x: {
          show: true
        },
        y: {
          formatter: tooltipFormatter
        }
      };

  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: [""],
          // show: false,
          max: max && 100,
          labels: {
            show: false
          }
        },
        colors: colors,
        stroke: {
          width: 1,
          colors: ["transparant"]
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        tooltip: chartTooltip,
        dataLabels: {
          enabled: false
        },
        chart: {
          type: "bar",
          height: 100,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        legend: {
          show: legend,
          labels: {
            useSeriesColors: false
          },
          itemMargin: {
            vertical: 5
          },
          formatter: function (seriesName, opts) {
            return customLegendLabels[opts.seriesIndex];
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: false,
                offsetX: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900
                }
              }
            }
          }
        }
      }}
      series={seriesData}
      type="bar"
      height={height}
      width="100%"
    />
  );
};

export default StackedBarChart;
