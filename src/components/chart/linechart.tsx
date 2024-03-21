// Linechart
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";

import { formatNumber, getCurrentHour, formationTimezone } from "@utils/helper";

const LineChart = ({
  labels,
  series,
  colors,
  height,
  multipleYaxis,
  noTick = false,
  isRevenue,
  selectedDate,
  isArticle,
}: any) => {
  const [seriesData, setSeriesData] = useState([]);

  console.log("series", series);

  let period_date = formationTimezone(moment(), "YYYY-MM-DD");
  const formattedDate = selectedDate
    ? moment(selectedDate).format("YYYY-MM-DD")
    : null;

  useEffect(() => {
    if (isArticle) {
      if (period_date === formattedDate) {
        const currentHour = getCurrentHour();

        // Extract data up to the current hour for the "Current" series
        const currentSeries = series?.find(
          (item: any) => item.name === "Today"
        );
        const currentData = currentSeries?.data?.slice(0, currentHour);

        // Create a new series with the updated data for the "Current" series
        const updatedSeriesData = series?.map((data: any) => {
          if (data.name === "Today") {
            return {
              ...data,
              data: currentData,
            };
          }
          return data;
        });

        setSeriesData(updatedSeriesData);
      } else {
        setSeriesData(series);
      }
    } else {
      const currentHour = getCurrentHour();

      // Extract data up to the current hour for the "Current" series
      const currentSeries = series?.find((item: any) => item.name === "Today");
      const currentData = currentSeries?.data?.slice(0, currentHour);

      // Create a new series with the updated data for the "Current" series
      const updatedSeriesData = series?.map((data: any) => {
        if (data.name === "Today") {
          return {
            ...data,
            data: currentData,
          };
        }
        return data;
      });

      setSeriesData(updatedSeriesData);
    }
  }, [series]);

  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels,
          tickAmount: noTick ? labels?.length : labels?.length / 2,
          labels: {
            rotate: -0,
            formatter: function (value) {
              if (typeof value === "string") {
                const dateTimeParts = value?.split(" ");
                if (dateTimeParts?.length === 4) {
                  const timePart = `${dateTimeParts[2]} ${dateTimeParts[3]}`;
                  return timePart;
                }
              }
              return value;
            },
          },
          tooltip: {
            enabled: false,
          },
        },
        colors: colors,
        grid: {
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        tooltip: {
          x: {
            show: true,
            formatter: function (
              value,
              { series, seriesIndex, dataPointIndex }
            ) {
              const label = labels?.[dataPointIndex];
              return label;
            },
          },
          y: [
            {
              formatter: function (val) {
                const value = formatNumber(val);
                return isRevenue ? `$${value}` : value;
              },
            },
            {
              formatter: function (val) {
                const value = formatNumber(val);
                return isRevenue ? `$${value}` : value;
              },
            },
          ],
        },
        yaxis: multipleYaxis
          ? [
              {
                labels: {
                  formatter: function (value) {
                    if (value === 5e-324) {
                      return "0";
                    }
                    return formatNumber(value);
                  },
                },
              },
              {
                labels: {
                  formatter: function (value) {
                    if (value === 5e-324) {
                      return "0";
                    }
                    return formatNumber(value);
                  },
                },
                opposite: true,
                show: false,
              },
            ]
          : {
              labels: {
                formatter: function (value) {
                  return formatNumber(value);
                },
              },
            },
        dataLabels: {
          enabled: false,
        },
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: true,
          showForSingleSeries: true,
        },
        stroke: {
          curve: "straight",
        },
      }}
      series={seriesData || []}
      type="line"
      width="100%"
      height={height || 200}
    />
  );
};

export default LineChart;