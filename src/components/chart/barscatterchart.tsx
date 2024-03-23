import React from "react";

const ReactApexChart = React.lazy(() => import("react-apexcharts"));

import { formatNumber } from "@/utils/helper";

class ScatterChart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      series: props?.series || [],
      options: {
        chart: {
          type: "column",
          height: 350,
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            columnWidth: "28%",
            dataLabels: {
              total: {
                enabled: true,
                formatter: function (value: any) {
                  return formatNumber(parseFloat(value));
                },
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        xaxis: {
          categories: props?.labels || [],
        },
        yaxis: {
          labels: {
            formatter: function (value: any) {
              return formatNumber(parseFloat(value));
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: any, opts: any) {
            const dataPointIndex = opts.dataPointIndex;

            const seriesData = props?.series.map(
              (item: any) => item.data[dataPointIndex]
            );

            const sum = seriesData.reduce((a: any, b: any) => a + b, 0);
            const percentage = ((val / sum) * 100).toFixed(2);

            return `${percentage}%`;
          },
        },
        legend: {
          position: "bottom",
        },
        fill: {
          opacity: 1,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart" style={{ width: "100%" }}>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={350}
        />
      </div>
    );
  }
}

export default ScatterChart;
