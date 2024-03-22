import React from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

import { formatNumber } from "@/views/overview/helper";

export default class Barchart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      series: props.series,
      options: {
        chart: {
          type: "bar",
          height: props?.height || 350,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            barHeight: 15,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: props?.labels,
          tickAmount: props?.labels?.length / 2,
          labels: {
            formatter: function (val: any) {
              return formatNumber(parseFloat(val));
            },
          },
        },
        tooltip: {
          enabled: true,
          y: {
            title: {
              formatter: function (seriesName: any) {
                return "";
              },
            },
            formatter: function (value: any) {
              return formatNumber(value);
            },
          },
        },
      },
    };
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.series !== this.props.series) {
      const { series } = this.props;
      this.setState({
        series: series?.length > 0 ? series : this.state.series,
      });
    }
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={this.props?.height || 350}
        />
      </div>
    );
  }
}
