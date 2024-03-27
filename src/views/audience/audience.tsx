"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { Empty, Row, Col, Tooltip, Select } from "antd";

import moment from "moment";

import Layout from "@components/layout";
import ErrorResult from "@/components/error_result";
import SegmentedChartSelector from "@/components/list_segment";
import ArticleCountView from "./components/article_count_view";

import LineChart from "@/components/chart/linechart";
import BarChart from "@/components/barchart";
import Barchart from "@/components/chart/barscatterchart";
import CohortGraph from "@/components/chart/cohort_chart";
import StackedBarChart from "@/components/chart/stackedBarChart";

import {
  formationTimezone,
  getQuarterFromDate,
  getQuarterMonths,
  getAllMonthNumbersForYear,
} from "@utils/helper";

const BoxComponent = ({ title, children }: any) => {
  return (
    <div className="custom-collapse-audience">
      <div className={`collapse-header`}>
        <div className="header-content">
          <Tooltip title={title}>
            <span className="header-text">{title}</span>
          </Tooltip>
        </div>
      </div>
      {children}
    </div>
  );
};

export default function Audience() {
  const [currentInfo, setCurrentInfo]: any = useState(null);
  const [segementValue, setSegementValue] = useState("real-time");
  const [selectedChartValue, setSelectedChartValue] = useState([
    "users",
    "new_users",
  ]);
  const [selectedChartValueForSingle, setselectedChartValueForSingle] =
    useState("users");
  const [isError, setIsError] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedQuarter, setSelectedQuarter] = useState(new Date());
  const [categoryLimit, setCategoryLimit] = useState("top_five_categories");
  const [userActivity, setUserActivity] = useState([]);
  const [referrerSeries, setReferrerSeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });
  const [clientWiseSeries, setClientWiseSeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });
  const [osWiseSeries, setosWiseSeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });
  const [chartSeries, setChartSeries]: any = useState({
    labels: [],
    series: [],
  });
  const [scatterSeries, setScatterSeries] = useState({
    labels: [],
    series: [],
  });
  const [scatterSeriesAnonymous, setScatterSeriesAnonymous] = useState({
    labels: [],
    series: [],
  });
  const [categorySeries, setcategorySeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });
  const [audienceList, setAudienceList]: any = useState({
    labels: [],
    series: [],
    name: "",
  });
  const [cohortData, setCohortData]: any = useState(null);
  const timeInterval = 30 * 60 * 1000;
  let siteDetails: any = {
    id: 36,
    site_id: "wral.com",
    site_name: "Fabriq",
    host_name: "https://fabriq.com",
    collector_url: "wral.com/dt",
  };

  useEffect(() => {
    getRealtimeData();

    const intervalId = setInterval(() => {
      getRealtimeData();
    }, timeInterval);

    return () => clearInterval(intervalId);
  }, []);

  const getRealtimeData = async (date?: any) => {
    setLoader(true);
    const currentDate = "2024-01-22";
    const real_time = currentDate
      ? currentDate
      : date || formationTimezone(moment(), "YYYY-MM-DD");
    try {
      const req = {
        site_id: siteDetails?.site_id,
        period_date: real_time,
      };

      const {
        data: { data, errors },
      } = await axios.post("/api/audience", {
        operation: "getUserDaily",
        variables: req,
      });

      if (errors) {
        throw errors;
      }
      if (data?.DailyData?.length > 0) {
        const result = data?.DailyData?.[0];
        generateDataDaily(data?.HourlyData, ["users", "new_users"]);
        generateResultWithHour(data?.HourlyData);
        setChartData(data?.HourlyData);
        const activityResult: any = await getStackedData(result);
        setUserActivity(activityResult);
        setCurrentInfo(result);
      }

      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  const getAuidenceMonthly = async (value: any, period_year: any) => {
    setLoader(true);
    setIsError(false);
    const lastThreeMonths = Array.from(
      { length: 3 },
      (_, index) => (value - index + 12) % 12 || 12
    );

    const currentYear = period_year || selectedYear;
    const currentDate = moment();
    const currentMonth = currentDate.month() + 1;
    const formattedDate = currentDate.subtract(2, "days").format("YYYY-MM-DD");
    const seventhDay = moment(formattedDate)
      .subtract(7, "days")
      .format("YYYY-MM-DD");

    let startDate, endDate;

    if (currentMonth === parseInt(value)) {
      startDate = formattedDate;
      endDate = seventhDay;
    } else {
      startDate = moment(`${currentYear}-${value}-01`)
        .endOf("month")
        .format("YYYY-MM-DD");
      endDate = moment(startDate).subtract(7, "days").format("YYYY-MM-DD");
    }

    try {
      const req = {
        site_id: siteDetails?.site_id,
        period_month: parseInt(value),
        period_year: currentYear,
        partial_period_date: `${currentYear}-${value
          ?.toString()
          .padStart(2, "0")}%`,
        lastThreeMonths,
        current_day: startDate,
        lastday: endDate,
      };

      const {
        data: { data, errors },
      } = await axios.post("/api/audience", {
        operation: "getUserMonthly",
        variables: req,
      });

      if (errors) {
        throw errors;
      }

      if (data) {
        const result = data?.MonthlyData?.[0];
        const activityResult: any = await getStackedData(result);
        generateData(data?.DailyData, ["users", "new_users", "churned_users"]);
        setChartData(data?.DailyData);
        generateResult(data?.DailyData);
        generateCohortData(data?.Last7DaysData);
        generateScatterChart(data?.Bucket);
        setUserActivity(activityResult);
        setCurrentInfo(result);
      }

      setLoader(false);
    } catch (err) {
      setIsError(true);
      setLoader(false);
    }
  };

  const getAuidenceQuarterly = async (value: any, year: any) => {
    setLoader(true);
    setIsError(false);

    const currentQuarterMonths = getQuarterMonths(value);
    try {
      const req = {
        site_id: siteDetails?.site_id,
        period_quarter: value,
        period_year: year,
        period_month: currentQuarterMonths,
      };

      const {
        data: { data, errors },
      } = await axios.post("/api/audience", {
        operation: "getUserQuaterly",
        variables: req,
      });

      if (errors) {
        throw errors;
      }

      const result = data?.QuaterlyData?.[0];
      const activityResult: any = await getStackedData(result);
      setChartData(data?.MonthlyData);
      generateBarChartData(data?.MonthlyData);
      generateResultWithMonth(data?.MonthlyData);
      generateScatterChart(data?.Bucket);
      setUserActivity(activityResult);
      setCurrentInfo(result);

      setLoader(false);
    } catch (err) {
      setLoader(false);
      setIsError(true);
    }
  };

  const getAuidenceYearly = async (value: any) => {
    setLoader(true);
    try {
      const allAbbreviatedMonths = getAllMonthNumbersForYear(value);
      const req = {
        site_id: siteDetails?.site_id,
        period_year: value.toString(),
        period_month: allAbbreviatedMonths,
      };

      const {
        data: { data, errors },
      } = await axios.post("/api/audience", {
        operation: "getUserYearly",
        variables: req,
      });

      if (errors) {
        throw errors;
      }

      const result = data?.YearlyData?.[0];
      const activityResult: any = await getStackedData(result);
      setChartData(data?.MonthlyData);
      generateBarChartData(data?.MonthlyData);
      generateResultWithMonth(data?.MonthlyData);
      generateScatterChart(data?.Bucket);
      setUserActivity(activityResult);
      setCurrentInfo(result);

      setLoader(false);
    } catch (err) {
      setLoader(false);
      setIsError(true);
    }
  };

  const getStackedData = (result: any) => {
    let stackedData = result?.["user_activity"];

    if (stackedData) {
      if (typeof stackedData === "string") {
        stackedData = JSON.parse(stackedData);
      }

      const total: any = Object.values(stackedData).reduce(
        (acc: any, curr: any) => {
          if (curr?.growth_percentage) {
            return acc + curr.users;
          } else {
            return acc + curr;
          }
        },
        0
      );

      const data = Object.keys(stackedData).map((name) => ({
        name,
        data: stackedData[name]?.growth_percentage
          ? [parseFloat(((stackedData[name].users / total) * 100).toFixed(2))]
          : [parseFloat(((stackedData[name] / total) * 100).toFixed(2))],
        users: stackedData[name]?.growth_percentage
          ? stackedData[name].users
          : stackedData[name],
        growth: stackedData[name]?.growth_percentage
          ? stackedData[name].growth_percentage
          : "",
      }));

      data.sort((a, b) => {
        const order = ["New User", "Casual User", "Loyal User", "Brand Lover"];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

      return data;
    }

    return [];
  };

  const generateResultWithMonth = (chartData: any) => {
    const labels = generateLineChartDataMonthlyWise(chartData);
    const refererSeries = generateSeriesMonthlyWise(chartData, "top_referer");
    const clientWiseSeries = generateSeriesMonthlyWise(
      chartData,
      "client_wise_split"
    );
    const osWiseSeries = generateSeriesMonthlyWise(chartData, "os_wise_split");
    const category_list = generateCategorySeries(chartData, "category_list");

    const chartSeriesFormat = {
      labels,
      series: refererSeries,
      colors: generateColors(refererSeries?.length),
    };

    const clientWiseFormat = {
      labels,
      series: clientWiseSeries,
      colors: generateColors(clientWiseSeries?.length),
    };

    const osWiseFormat = {
      labels,
      series: osWiseSeries,
      colors: generateColors(clientWiseSeries?.length),
    };

    const categorySeries = {
      labels,
      series: category_list,
      colors: generateColors(category_list?.length),
    };

    setReferrerSeries((prevState: any) => ({
      ...prevState,
      labels: chartSeriesFormat?.labels,
      series: chartSeriesFormat?.series,
      colors: chartSeriesFormat?.colors,
    }));

    setClientWiseSeries((prevState: any) => ({
      ...prevState,
      labels: clientWiseFormat?.labels,
      series: clientWiseFormat?.series,
      colors: clientWiseFormat?.colors,
    }));

    setosWiseSeries((prevState: any) => ({
      ...prevState,
      labels: osWiseFormat?.labels,
      series: osWiseFormat?.series,
      colors: osWiseFormat?.colors,
    }));

    setcategorySeries((prevState: any) => ({
      ...prevState,
      labels: categorySeries?.labels,
      series: categorySeries?.series,
      colors: categorySeries?.colors,
    }));
  };

  const generateResultWithHour = (chartData: any) => {
    const labels = generateLineChartDataHourlyWise(chartData);
    const refererSeries = generateSeriesHoulryWise(chartData, "top_referer");
    const clientWiseSeries = generateSeriesHoulryWise(
      chartData,
      "client_wise_split"
    );
    const osWiseSeries = generateSeriesHoulryWise(chartData, "os_wise_split");
    const category_list = generateSeriesHoulryWise(chartData, "category_list");

    const chartSeriesFormat = {
      labels,
      series: refererSeries,
      colors: generateColors(refererSeries?.length),
    };

    const clientWiseFormat = {
      labels,
      series: clientWiseSeries,
      colors: generateColors(clientWiseSeries?.length),
    };

    const osWiseFormat = {
      labels,
      series: osWiseSeries,
      colors: generateColors(clientWiseSeries?.length),
    };

    const categorySeries = {
      labels,
      series: category_list,
      colors: generateColors(category_list?.length),
    };

    setReferrerSeries((prevState: any) => ({
      ...prevState,
      labels: chartSeriesFormat?.labels,
      series: chartSeriesFormat?.series,
      colors: chartSeriesFormat?.colors,
    }));

    setClientWiseSeries((prevState: any) => ({
      ...prevState,
      labels: clientWiseFormat?.labels,
      series: clientWiseFormat?.series,
      colors: clientWiseFormat?.colors,
    }));

    setosWiseSeries((prevState: any) => ({
      ...prevState,
      labels: osWiseFormat?.labels,
      series: osWiseFormat?.series,
      colors: osWiseFormat?.colors,
    }));

    setcategorySeries((prevState: any) => ({
      ...prevState,
      labels: categorySeries?.labels,
      series: categorySeries?.series,
      colors: categorySeries?.colors,
    }));
  };

  const generateResult = (chartData: any) => {
    const labels = generateLineChartData(chartData);
    const refererSeries = generateSeries(chartData, "top_referer");
    const clientWiseSeries = generateSeries(chartData, "client_wise_split");
    const osWiseSeries = generateSeries(chartData, "os_wise_split");
    const category_list = generateCategorySeries(chartData, "category_list");

    const chartSeriesFormat = {
      labels,
      series: refererSeries,
      colors: generateColors(refererSeries?.length),
    };

    const clientWiseFormat = {
      labels,
      series: clientWiseSeries,
      colors: generateColors(clientWiseSeries?.length),
    };

    const osWiseFormat = {
      labels,
      series: osWiseSeries,
      colors: generateColors(clientWiseSeries?.length),
    };

    const categorySeries = {
      labels,
      series: category_list,
      colors: generateColors(category_list?.length),
    };

    setReferrerSeries((prevState: any) => ({
      ...prevState,
      labels: chartSeriesFormat?.labels,
      series: chartSeriesFormat?.series,
      colors: chartSeriesFormat?.colors,
    }));

    setClientWiseSeries((prevState: any) => ({
      ...prevState,
      labels: clientWiseFormat?.labels,
      series: clientWiseFormat?.series,
      colors: clientWiseFormat?.colors,
    }));

    setosWiseSeries((prevState: any) => ({
      ...prevState,
      labels: osWiseFormat?.labels,
      series: osWiseFormat?.series,
      colors: osWiseFormat?.colors,
    }));

    setcategorySeries((prevState: any) => ({
      ...prevState,
      labels: categorySeries?.labels,
      series: categorySeries?.series,
      colors: categorySeries?.colors,
    }));
  };

  const generateScatterChart = (chartData: any) => {
    const scatterlabels = generateLabels(chartData);
    const scatterseries = generateScatterSeries(
      chartData,
      ["0_to_7_days", "8_to_14_days", "15_to_20_days", "above_20_days"],
      "logged_in_frequency_buckets"
    );

    const scatterlabelsForAnonymous = generateLabels(chartData);
    const scatterseriesForAnonymous = generateScatterSeries(
      chartData,
      ["0_to_7_days", "8_to_14_days", "15_to_20_days", "above_20_days"],
      "anonymous_frequency_buckets"
    );

    setScatterSeries((prevState) => ({
      ...prevState,
      labels: scatterlabels,
      series: scatterseries,
    }));

    setScatterSeriesAnonymous((prevState) => ({
      ...prevState,
      labels: scatterlabelsForAnonymous,
      series: scatterseriesForAnonymous,
    }));
  };

  const generateLabels = (data: any) => {
    const months = data?.map((entry: any) => entry?.period_month);
    const sortedMonths = months?.sort((a: any, b: any) => a - b);
    return sortedMonths.map((month: any) => {
      const date = new Date(2000, month - 1, 1);
      return date.toLocaleString("en-US", { month: "short" });
    });
  };

  const generateScatterSeries = (data: any, buckets: any, key: any) => {
    // Sort data based on period_month
    const sortedData = data.sort(
      (a: any, b: any) => a?.period_month - b?.period_month
    );

    return buckets.map((bucket: any) => {
      const formattedBucketName = bucket.replace(/_/g, " ");
      return {
        name: formattedBucketName,
        data: sortedData.map((entry: any) => {
          const parsedEntry = JSON.parse(entry[key]);
          return parsedEntry[bucket] !== undefined ? parsedEntry[bucket] : 0;
        }),
      };
    });
  };

  const generateSeriesHoulryWise = (chartData: any, key: any) => {
    const referers = chartData.reduce((acc: any, data: any) => {
      const topReferer = JSON.parse(data?.[key]);

      if (topReferer) {
        Object.entries(topReferer).forEach(([referer, value]) => {
          if (!acc[referer]) {
            acc[referer] = Array(chartData.length).fill(0);
          }

          const index = chartData.findIndex(
            (d: any) => d.period_hour === data.period_hour
          );
          acc[referer][index] = value;
        });
      }

      return acc;
    }, {});

    const series = Object.entries(referers).map(([referer, data]) => ({
      name: referer,
      data,
    }));

    return series;
  };

  const generateColors = (length: any) => {
    const colors = [];
    const avoidHue = 0;
    const avoidRange = 30;
    const usedHues = new Set();

    for (let i = 0; i < length; i++) {
      let hue = (i * 360) / length;

      // Avoid hues in the specified range around red
      if (hue >= avoidHue - avoidRange && hue <= avoidHue + avoidRange) {
        hue = (avoidHue + avoidRange + 30) % 360;
      }

      // Ensure the hue is distinct
      while (usedHues.has(hue)) {
        hue = (hue + 30) % 360;
      }

      usedHues.add(hue);

      const color = `hsl(${hue}, 70%, 50%)`;
      colors.push(color);
    }

    return colors;
  };

  const generateLineChartDataHourlyWise = (chartData: any) => {
    const sortedData = chartData.sort((a: any, b: any) =>
      moment(a?.period_hour).diff(moment(b?.period_hour))
    );
    const labels = sortedData?.map((data: any) => {
      const formattedTime = moment(data?.period_date)
        .hour(data?.period_hour)
        .minute(0)
        .format("MMM D, h:mm a");
      return formattedTime;
    });

    return labels;
  };

  const generateDataDaily = (chartData: any, val?: any) => {
    const labels = generateLineChartDataHourlyWise(chartData);
    const chartOptions = val || selectedChartValue;

    const chartOptionMapping: any = {
      users: { label: "Readers", key: "users" },
      new_users: { label: "New Readers", key: "new_users" },
      churned_users: { label: "Churned Readers", key: "churned_users" },
    };

    const colorMap: any = {
      users: "#7F56D9",
      new_users: "#A3E0FF",
      churned_users: "#e89de1",
    };

    const chartSeriesFormat = {
      series: chartOptions.map((chartOption: any) => {
        const { label, key } = chartOptionMapping[chartOption] || {};
        let series;

        if (key === "churned_users") {
          series = chartData?.map((data: any) => (data?.[key] || 0) / 30);
        } else {
          series = chartData?.map((data: any) => data?.[key] || 0);
        }

        return {
          name: label,
          type: "line",
          data:
            series.filter(
              (value: any) => value !== undefined && value !== null
            ) || 0,
          color: colorMap[key],
          yaxis: "line-y-axis",
        };
      }),
      label: labels,
    };

    setChartSeries((prevState: any) => ({
      ...prevState,
      labels,
      series: chartSeriesFormat.series,
    }));
  };

  const generateBarChartData = (list: any, val?: any) => {
    if (list?.length > 0) {
      let dataValue = list;
      const chartOption = val || selectedChartValueForSingle;

      const getSeriesConfig = (name: string, key: string) => {
        const series = dataValue?.map((data: any) => data?.[key]);
        return {
          name,
          data: series?.filter(
            (value: any) => value !== undefined && value !== null
          ),
        };
      };

      const labels = dataValue?.map((item: any) => item?.period_month);
      labels.sort((a: any, b: any) => a - b);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      let chartSeriesFormat: any = {
        series: [],
        labels: labels?.map((number: any) => monthNames[number - 1]),
        name: "",
      };

      switch (chartOption) {
        case "users":
          chartSeriesFormat.series = [getSeriesConfig("Readers", "users")];
          chartSeriesFormat.name = "Readers";
          break;
        case "new_users":
          chartSeriesFormat.series = [
            getSeriesConfig("New Readers", "new_users"),
          ];
          chartSeriesFormat.name = "New Readers";
          break;
        default:
          chartSeriesFormat.series = [
            getSeriesConfig("Churned Readers", "churned_users"),
          ];
          chartSeriesFormat.name = "Churned Readers";
      }

      setAudienceList((prevState: any) => ({
        ...prevState,
        labels: chartSeriesFormat.labels,
        series: chartSeriesFormat.series,
        name: chartSeriesFormat?.name,
      }));
    }
  };

  const generateData = (chartData: any, val: any) => {
    const labels = generateLineChartData(chartData);
    const chartOptions = val || selectedChartValue;

    const chartOptionMapping: any = {
      users: { label: "Readers", key: "users" },
      new_users: { label: "New Readers", key: "new_users" },
      churned_users: { label: "Churned Readers", key: "churned_users" },
    };

    const colorMap: any = {
      users: "#7F56D9",
      new_users: "#A3E0FF",
      churned_users: "#e89de1",
    };

    const chartSeriesFormat = {
      series: chartOptions.map((chartOption: any) => {
        const { label, key } = chartOptionMapping[chartOption] || {};
        let series;

        if (key === "churned_users") {
          series = chartData?.map((data: any) => (data?.[key] || 0) / 30);
        } else {
          series = chartData?.map((data: any) => data?.[key] || 0);
        }

        return {
          name: label,
          type: "line",
          data:
            series.filter(
              (value: any) => value !== undefined && value !== null
            ) || 0,
          color: colorMap[key],
          yaxis: "line-y-axis",
        };
      }),
      label: labels,
    };

    setChartSeries((prevState: any) => ({
      ...prevState,
      labels,
      series: chartSeriesFormat.series,
    }));
  };

  const handleChangeChartForCategory = (value: any) => {
    setCategoryLimit(value);
    let limit =
      value === "top_five_categories"
        ? 5
        : value === "top_seven_categories"
        ? 7
        : 10;

    const labels =
      segementValue === "daily"
        ? generateLineChartDataHourlyWise(chartData)
        : segementValue === "monthly"
        ? generateLineChartData(chartData)
        : segementValue === "yearly" || segementValue === "quarterly"
        ? generateLineChartDataMonthlyWise(chartData)
        : null;
    const series = generateCategorySeries(chartData, "category_list", limit);

    const categorySeries = {
      labels,
      series: series,
      colors: generateColors(series?.length),
    };

    setcategorySeries((prevState: any) => ({
      ...prevState,
      labels: categorySeries?.labels,
      series: categorySeries?.series,
      colors: categorySeries?.colors,
    }));
  };

  const generateLineChartData = (chartData: any) => {
    const sortedData = chartData.sort((a: any, b: any) =>
      moment(a?.period_date).diff(moment(b?.period_date))
    );

    const labels = sortedData.map((data: any) =>
      moment(data?.period_date).format("MMM DD")
    );

    return labels;
  };

  const generateLineChartDataMonthlyWise = (chartData: any) => {
    const sortedData = chartData.sort(
      (a: any, b: any) => a?.period_month - b?.period_month
    );

    const labels = sortedData.map((data: any) =>
      moment()
        .month(data?.period_month - 1)
        .format("MMM YYYY")
    );

    return labels;
  };

  const generateSeries = (chartData: any, key: any) => {
    const referers = chartData.reduce((acc: any, data: any) => {
      const topReferer = JSON.parse(data?.[key]);

      if (topReferer) {
        Object.entries(topReferer).forEach(([referer, value]) => {
          if (!acc[referer]) {
            acc[referer] = Array(chartData.length).fill(0);
          }

          const index = chartData.findIndex(
            (d: any) => d.period_date === data.period_date
          );
          acc[referer][index] = value;
        });
      }

      return acc;
    }, {});

    const series = Object.entries(referers).map(([referer, data]) => ({
      name: referer,
      data,
    }));

    return series;
  };

  const generateSeriesMonthlyWise = (chartData: any, key: any) => {
    const referers = chartData.reduce((acc: any, data: any) => {
      const topReferer = JSON.parse(data?.[key]);

      if (topReferer) {
        Object.entries(topReferer).forEach(([referer, value]) => {
          if (!acc[referer]) {
            acc[referer] = Array(chartData.length).fill(0);
          }

          const index = chartData.findIndex(
            (d: any) => d.period_month === data.period_month
          );
          acc[referer][index] = value;
        });
      }

      return acc;
    }, {});

    const series = Object.entries(referers).map(([referer, data]) => ({
      name: referer,
      data,
    }));

    return series;
  };

  const generateCategorySeries = (chartData: any, key: any, limit?: any) => {
    const val = limit || 5;

    const aggregatedCategories = chartData.reduce((result: any, day: any) => {
      const categories = JSON.parse(day?.[key]);

      if (categories) {
        Object.keys(categories).forEach((category) => {
          result[category] = (result[category] || 0) + categories[category];
        });
      }

      return result;
    }, {});

    // Sort aggregated categories and get the top N (limit) categories
    const sortedCategories = Object.keys(aggregatedCategories).sort(
      (a, b) => aggregatedCategories[b] - aggregatedCategories[a]
    );

    const topCategories = sortedCategories.slice(0, val);

    // Generate series data for the top N (limit) categories
    const seriesData = topCategories.map((category) => ({
      name: category,
      data: chartData.map((day: any) => {
        const categories = JSON.parse(day[key]);
        return categories?.[category] || 0;
      }),
    }));

    return seriesData;
  };

  const generateCohortData = (data: any) => {
    if (data?.length > 0) {
      const sortedData = data?.sort(
        (a: any, b: any) =>
          moment(a?.period_date).valueOf() - moment(b?.period_date).valueOf()
      );

      const cohortData: any = {
        days: {},
      };

      sortedData.forEach((entry: any) => {
        const dayLabel = moment(entry?.period_date).format("MMM DD");

        cohortData.days[dayLabel] = [
          entry?.d0_users || 0,
          entry?.d1_users || 0,
          entry?.d2_users || 0,
          entry?.d3_users || 0,
          entry?.d4_users || 0,
          entry?.d5_users || 0,
          entry?.d6_users || 0,
          entry?.d7_users || 0,
        ];

        cohortData.days[dayLabel] = cohortData.days[dayLabel].filter(
          (item: any) => item !== 0
        );
      });

      setCohortData(cohortData);
    }
  };

  const handleChangeSegement = (e: any) => {
    setSegementValue(e.target.value);

    const currentDate = new Date();

    clearItems();

    if (e.target.value === "monthly") {
      setSelectedChartValue(["users", "new_users", "churned_users"]);
      handleMonthChange(currentDate);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentDate);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentDate);
    } else {
      setSelectedChartValue(["users", "new_users"]);
      handleDayChange(currentDate);
    }
  };

  const clearItems = () => {
    setReferrerSeries({
      labels: [],
      series: [],
      colors: [],
    });

    setScatterSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));

    setScatterSeriesAnonymous((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));

    setChartSeries((prevState: any) => ({
      ...prevState,
      labels: [],
      series: [],
    }));

    setReferrerSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setClientWiseSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setosWiseSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setcategorySeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setAudienceList((prevState: any) => ({
      ...prevState,
      labels: [],
      series: [],
      name: "",
    }));

    setCohortData(null);
    setUserActivity([]);
    setCurrentInfo(null);
  };

  const handleDayChange = (date: any) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(date);
    clearItems();
    getRealtimeData(formattedDate);
  };

  const handleMonthChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    const selectedMonth = date.getMonth() + 1;
    setSelectedMonth(date);
    clearItems();
    getAuidenceMonthly(selectedMonth, selectedYear);
  };

  const handleQuarterlyChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    const selectedQuarter = getQuarterFromDate(date);
    setSelectedQuarter(date);
    clearItems();
    getAuidenceQuarterly(selectedQuarter, selectedYear);
  };

  const handleYearChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    setSelectedYear(date);
    clearItems();
    getAuidenceYearly(selectedYear);
  };

  const handleChangeChart = (value: any) => {
    setSelectedChartValue(value);
    generateData(chartData, value);
  };

  const handleChangeChartSingleSelect = (value: any) => {
    setselectedChartValueForSingle(value);
    generateBarChartData(chartData, value);
  };

  return (
    <Layout>
      <div className="audience-content">
        <SegmentedChartSelector
          segementValue={segementValue}
          handleChangeSegement={handleChangeSegement}
          chartLoader={loader}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          selectedQuarter={selectedQuarter}
          selectedYear={selectedYear}
          handleDayChange={handleDayChange}
          handleMonthChange={handleMonthChange}
          handleQuarterlyChange={handleQuarterlyChange}
          handleYearChange={handleYearChange}
          selectedChartValue={selectedChartValue}
          handleChangeChart={handleChangeChart}
          handleChangeChartSingleSelect={handleChangeChartSingleSelect}
          selectedChartValueForSingle={selectedChartValueForSingle}
        />
        {loader ? (
          <div>
            <div className="loader-cotainer">
              <div className="loader"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="article-page-error-result">
            {" "}
            <ErrorResult />
          </div>
        ) : (
          <>
            <div className="article-page-chart">
              <div className="article-chart-content">
                {segementValue === "monthly" || segementValue === "daily" ? (
                  chartSeries?.series?.some(
                    (series: any) => series?.data?.length > 0
                  ) ? (
                    <LineChart
                      labels={chartSeries?.labels}
                      series={chartSeries?.series}
                      height={300}
                      multipleYaxis={false}
                    />
                  ) : (
                    <div style={{ padding: 20 }}>
                      <Empty description="We don’t have enough data generated to show meaningful insights here" />
                    </div>
                  )
                ) : audienceList?.series?.some(
                    (item: any) => item?.data?.length > 0
                  ) ? (
                  <BarChart
                    labels={audienceList?.labels}
                    series={audienceList?.series?.[0]?.data}
                    name={audienceList?.name}
                    logarithmic
                    colors={["#7F56D9"]}
                    width={"20%"}
                  />
                ) : (
                  <div style={{ padding: 20 }}>
                    <Empty description="We don’t have enough data generated to show meaningful insights here" />
                  </div>
                )}
              </div>
            </div>
            <div className="audience-page-list-count-wrapper">
              <div className="audience-page-list-content">
                <div className="audience-list-count-wrapper">
                  <Row gutter={[16, 16]} justify="space-between">
                    <Col span={6}>
                      <ArticleCountView
                        title="Readers"
                        value={currentInfo?.users || 0}
                        tooltipTitle="Individuals who read the articles."
                      />
                    </Col>
                    <Col span={6}>
                      <ArticleCountView
                        title="New Readers"
                        value={currentInfo?.new_users || 0}
                        tooltipTitle="Individuals who are new and have started reading articles recently."
                      />
                    </Col>
                    <Col span={6}>
                      <ArticleCountView
                        title="Churn"
                        value={currentInfo?.churned_percent || "N/A"}
                        secondvalue={currentInfo?.churned_users || null}
                        tooltipTitle="The percentage of readers who have stopped reading articles (churned) out of the total readers."
                      />
                    </Col>
                    <Col span={6}>
                      <ArticleCountView
                        title="Average Time Spent"
                        value={currentInfo?.average_time_spent || 0}
                        tooltipTitle="The average amount of time users spend reading articles on the platform."
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <Row>
              <Col span={24}>
                <div className="box-div">
                  <BoxComponent title="User Activity">
                    {userActivity?.length > 0 ? (
                      <StackedBarChart
                        series={userActivity}
                        colors={generateColors(userActivity?.length)}
                        max={100}
                        legend={true}
                        height={100}
                        isAudience
                        secondTooltipLabels={userActivity?.map(
                          (item: any) => item?.growth
                        )}
                        tooltipLabels={userActivity?.map(
                          (item: any) => item?.users
                        )}
                        legendLabels={userActivity?.map(
                          (item: any) => item?.name
                        )}
                      />
                    ) : (
                      <Empty description="We don’t have enough data generated to show meaningful insights here" />
                    )}
                  </BoxComponent>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ height: "100%", marginTop: 15 }}>
              <div className="flex-container-audience">
                <Col span={12}>
                  <div className="box-div">
                    <BoxComponent title="Top Referral Sources">
                      {referrerSeries?.series?.length > 0 ? (
                        <LineChart
                          labels={referrerSeries?.labels}
                          series={referrerSeries?.series}
                          colors={referrerSeries?.colors}
                          height={300}
                          multipleYaxis={false}
                        />
                      ) : (
                        <Empty description="We don’t have enough data generated to show meaningful insights here" />
                      )}
                    </BoxComponent>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="box-div">
                    <BoxComponent title="Top Clients">
                      {clientWiseSeries?.series?.length > 0 ? (
                        <LineChart
                          labels={clientWiseSeries?.labels}
                          series={clientWiseSeries?.series}
                          colors={clientWiseSeries?.colors}
                          height={300}
                          multipleYaxis={false}
                        />
                      ) : (
                        <Empty description="We don’t have enough data generated to show meaningful insights here" />
                      )}
                    </BoxComponent>
                  </div>
                </Col>
              </div>
            </Row>
            <Row gutter={[16, 16]} style={{ height: "100%", marginTop: 15 }}>
              <Col span={24}>
                <div className="box-div">
                  <BoxComponent title="Top Operating Systems">
                    {osWiseSeries?.series?.length > 0 ? (
                      <LineChart
                        labels={osWiseSeries?.labels}
                        series={osWiseSeries?.series}
                        colors={osWiseSeries?.colors}
                        height={300}
                        multipleYaxis={false}
                      />
                    ) : (
                      <Empty description="We don’t have enough data generated to show meaningful insights here" />
                    )}
                  </BoxComponent>
                </div>
              </Col>
            </Row>
            {segementValue !== "daily" && (
              <Row gutter={[16, 16]} style={{ height: "100%", marginTop: 15 }}>
                <div className="flex-container-audience">
                  <Col span={12}>
                    <div className="box-div">
                      <BoxComponent title="Monthly Visit Frequency (Logged In Users)">
                        {scatterSeries?.series?.some(
                          (series: any) => series?.data?.length > 0
                        ) ? (
                          <Barchart
                            series={scatterSeries?.series}
                            labels={scatterSeries?.labels}
                          />
                        ) : (
                          <Empty description="We don’t have enough data generated to show meaningful insights here" />
                        )}
                      </BoxComponent>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="box-div">
                      <BoxComponent title="Monthly Visit Frequency (Anonymous Users)">
                        {scatterSeriesAnonymous?.series?.some(
                          (series: any) => series?.data?.length > 0
                        ) ? (
                          <Barchart
                            series={scatterSeriesAnonymous?.series}
                            labels={scatterSeriesAnonymous?.labels}
                          />
                        ) : (
                          <Empty description="We don’t have enough data generated to show meaningful insights here" />
                        )}
                      </BoxComponent>
                    </div>
                  </Col>
                </div>
              </Row>
            )}
            {segementValue === "monthly" && (
              <Row gutter={[16, 16]} style={{ height: "100%", marginTop: 15 }}>
                <Col span={24}>
                  <div className="box-div">
                    <BoxComponent title="Cohort Analysis - Readers Churn">
                      {cohortData &&
                      Object?.values(cohortData.days).every(
                        (day: any) => day?.length > 0
                      ) ? (
                        <CohortGraph data={cohortData} />
                      ) : (
                        <Empty description="We don’t have enough data generated to show meaningful insights here" />
                      )}
                    </BoxComponent>
                  </div>
                </Col>
              </Row>
            )}
            <Row gutter={[16, 16]} style={{ height: "100%", marginTop: 15 }}>
              <Col span={24}>
                <div className="box-div">
                  <BoxComponent title="Content Category Distribution">
                    {categorySeries?.series?.length > 0 ? (
                      <>
                        <div
                          className="flex"
                          style={{
                            justifyContent: "flex-end",
                            display: "flex",
                            width: "100%",
                          }}
                        >
                          <div className="article-id-chart-header">
                            <div className="article-page-chart-select">
                              <Select
                                style={{ width: "200px" }}
                                onChange={handleChangeChartForCategory}
                                value={categoryLimit}
                                getPopupContainer={(triggerNode: any) =>
                                  triggerNode?.parentNode || document.body
                                }
                              >
                                <Select.Option value="top_five_categories">
                                  Top 5 Categories
                                </Select.Option>
                                <Select.Option value="top_seven_categories">
                                  Top 7 Categories
                                </Select.Option>
                                <Select.Option value="top_ten_categories">
                                  Top 10 Categories
                                </Select.Option>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <LineChart
                          labels={categorySeries?.labels}
                          series={categorySeries?.series}
                          colors={categorySeries?.colors}
                          height={300}
                          multipleYaxis={false}
                        />
                      </>
                    ) : (
                      <Empty description="We don’t have enough data generated to show meaningful insights here" />
                    )}
                  </BoxComponent>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </Layout>
  );
}
