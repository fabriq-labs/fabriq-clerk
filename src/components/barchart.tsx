// BarChart
import { formatNumber } from "@/utils/helper";
import React from "react";
import isEqual from "react-fast-compare";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const BarChart = ({
  labels,
  series,
  colors,
  width,
  name,
  tickAmount,
  logarithmic = false,
  tooltipLabels = [],
}: any) => {
  const adjustedSeries = logarithmic
    ? series?.map((value: any) => (value < 1 ? 1e-5 : value))
    : series;

  const tooltipFormatter = function (
    value: any,
    { _seriesIndex, dataPointIndex }: any
  ) {
    if (tooltipLabels?.length > 0) {
      return tooltipLabels?.[dataPointIndex];
    } else {
      return value;
    }
  };

  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels,
          tickAmount: tickAmount === true ? labels?.length / 2 : labels?.length,
        },
        yaxis: {
          logarithmic: logarithmic || false,
          // type: logarithmic ? "logarithmic" : "numeric",
          labels: {
            formatter: function (value: any) {
              const intValue = parseInt(value, 10);
              return intValue ? formatNumber(intValue) : 0;
            },
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
            formatter: tooltipFormatter,
          },
        },
        dataLabels: {
          enabled: false,
        },
        chart: {
          type: "bar",
          height: 200,
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: true,
          showForSingleSeries: true,
        },
        plotOptions: {
          bar: {
            barHeight: "50%",
            borderRadius: 6,
            columnWidth: width || "20px",
            dataLabels: {
              position: "bottom",
            },
          },
        },
      }}
      series={[
        {
          name: name || "Page Views",
          data: adjustedSeries,
        },
      ]}
      type="bar"
      width={"100%"}
      height={250}
    />
  );
};

export default React.memo(BarChart, isEqual);
