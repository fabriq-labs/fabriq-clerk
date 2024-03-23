"use client";

import React, { useState, useEffect } from "react";
import Layout from "@components/layout";
import moment from "moment";
import axios from "axios";
import {
  Empty,
  Row,
  Col,
  Select,
  Skeleton as AntdSkeleton,
  Radio,
  Pagination,
  Button,
} from "antd";

import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import LineChart from "@/components/chart/linechart";
import BarChart from "@/components/barchart";

import CountView from "./components/count_view";
import SegmentedChartSelector from "./components/header_section";
import ErrorResult from "@/components/error_result";
import StackedBarChart from "@/components/chart/stackedBarChart";
import ArticleTableCard from "./components/article_table";

import {
  mapRevenueData,
  getQuarterFromDate,
  getQuarterMonths,
  getMonthName,
} from "@utils/helper";

export default function RevenuePage() {
  const [isExpand, setIsExpand] = useState(false);
  const [expendInfo, setexpendInfo]: any = useState(null);
  const [loader, setLoader] = useState(false);
  const [segementValue, setSegementValue] = useState("monthly");
  const [selectedChartValue, setSelectedChartValue] = useState("total_revenue");
  const [selectAdvertiser, setSelectAdvertiser] =
    useState("buyer_network_name");
  const [chartData, setChartData] = useState({});
  const [chartLoader, setChartLoader] = useState(false);
  const [selectedMonth, setSelectedMonth]: any = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(new Date());
  const [isError, setIsError] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [tableListData, setTableListData] = useState([]);
  const [childrenOpen, setChildrenOpen] = useState(null);
  const [chartSeries, setChartSeries] = useState({
    labels: [],
    series: [],
  });
  const [revenueSeries, setRevenueList]: any = useState({
    labels: [],
    series: [],
    name: "",
  });
  const [overallData, setOverallData]: any = useState(null);
  const [currentpage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [sortEnabled, setSortEnabled] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("desc_nulls_last");
  const [advertiser, setAdvertiser] = useState([]);
  const [advertiserDemandChannel, setDemandChannel] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedFilterValue, setSelectedFilterValue] = useState(null);
  const [closeFilter, setCloseFilter] = useState(false);
  const [filterData, setFilterData]: any = useState({});
  const [miniChartLoader, setMiniChartLoader] = useState(false);
  const [countNo, setCountNo] = useState(0);
  let count = 0;

  useEffect(() => {
    const currentDate = new Date();

    handleMonthChange(currentDate);
  }, []);

  useEffect(() => {
    if (sortEnabled) {
      let filterParams = null;
      if (selectedFilter === "campaign_type") {
        filterParams = {
          filterKey: selectedFilter,
          filterValue: selectedFilterValue === "direct" ? "-" : "",
        };
      } else if (selectedFilter === "ad_partner") {
        filterParams = {
          filterKey: selectedFilter,
          filterValue: selectedFilterValue,
        };
      }

      if (segementValue === "monthly") {
        const year = selectedMonth?.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        getMainList(currentpage, month, year, filterParams);
      } else if (segementValue === "quarterly") {
        const year = selectedQuarter?.getFullYear();
        const quarter = getQuarterFromDate(selectedQuarter);
        getMainListForQuarterly(currentpage, quarter, year, filterParams);
      } else if (segementValue === "yearly") {
        // const year = selectedYear?.getFullYear();
        // getMainListForYearly(currentpage, year, filterParams);
      }
    }
  }, [sortEnabled, selectedSort, sortDirection]);

  useEffect(() => {
    if (closeFilter) {
      filterFunction(true);
    }
  }, [closeFilter, selectedFilter, selectedFilterValue]);

  const getRevenueMonthly = async (value: any, yearValue = null) => {
    setChartLoader(true);
    setIsError(false);
    const year = yearValue;
    try {
      const [
        { data: chartDataResponse, errors: chartErrors },
        { data: overviewData, errors: overviewErrors },
      ]: any = await Promise.all([
        axios.post("/api/revenue", {
          operation: "getRevenue",
          variables: {
            period_month: value,
            period_year: year,
          },
        }),
        axios.post("/api/revenue", {
          operation: "getOverall",
          variables: {
            period_month: value,
            period_year: year,
          },
        }),
      ]);

      if (chartErrors) {
        throw chartErrors;
      }

      if (chartDataResponse) {
        setChartData(chartDataResponse?.data?.ChartData);
        generateRandomData(chartDataResponse?.data?.ChartData);
      }

      if (overviewErrors) {
        throw overviewErrors;
      }

      if (overviewData) {
        setOverallData(overviewData?.data?.OverViewInfo?.[0]);
      }

      getfilterData();
      getMainList(null, value, year);
      getAdvertiserMonthly(value, year);
      setChartLoader(false);
    } catch (err) {
      setChartLoader(false);
      setIsError(true);
    }
  };

  const getRevenueQuarterly = async (value: any, year: any) => {
    setChartLoader(true);
    setIsError(false);
    const currentQuarterMonths = getQuarterMonths(value);
    try {
      const [
        { data: chartDataResponse, errors: chartErrors },
        { data: overviewData, errors: overviewErrors },
      ]: any = await Promise.all([
        axios.post("/api/revenue", {
          operation: "getRevenueMonthly",
          variables: {
            period_month: currentQuarterMonths,
            period_year: year,
          },
        }),
        axios.post("/api/revenue", {
          operation: "getRevenueOverallQuaterly",
          variables: {
            period_quarter: value,
            period_year: year,
          },
        }),
      ]);

      if (chartErrors) {
        throw chartErrors;
      }

      if (chartDataResponse) {
        setChartData(chartDataResponse?.data?.ChartData);
        generateBarChartData(chartDataResponse?.data?.ChartData);
      }

      if (overviewErrors) {
        throw overviewErrors;
      }

      if (overviewData) {
        setOverallData(overviewData?.data?.OverViewInfo?.[0]);
      }

      getfilterData();
      getMainListForQuarterly(null, value, year);
      getAdvertiserQuarterly(value, year);
      setChartLoader(false);
    } catch (err) {
      setChartLoader(false);
      setIsError(true);
    }
  };

  const getMainList = async (
    page: any,
    period_month: any,
    period_year: any,
    filterParams?: any
  ) => {
    setTableLoader(true);

    const limitPerPage = 10;
    const offset = limitPerPage * ((page || currentpage) - 1);
    const operation = "getMontlyMainList";
    const variables = {
      offset,
      period_month,
      period_year,
      sortOrder: sortDirection,
      filterParams,
    };

    try {
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation,
        variables,
      });

      if (errors) {
        throw errors;
      }

      if (data?.TableList) {
        const result = data?.TableList;
        getTableChartSeries(result, period_month, period_year);
        setTotalCount(data?.totalCount?.aggregate?.count);
        setOffsetValue(offset);
      }
    } catch (err) {
      setTableLoader(false);
    }
  };

  const getMainListForQuarterly = async (
    page: any,
    period_quarter: any,
    period_year: any,
    filterParams?: any
  ) => {
    setTableLoader(true);

    const limitPerPage = 10;
    const offset = limitPerPage * ((page || currentpage) - 1);

    try {
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation: "getQuaterlyMainList",
        variables: {
          offset,
          period_quarter,
          period_year,
          sortOrder: sortDirection,
          filterParams,
        },
      });

      if (errors) {
        throw errors;
      }

      if (data?.TableList) {
        const result = data?.TableList;

        setTableListData(result);
        getTableChartSeriesQuarterly(result, period_quarter, period_year);
        setTotalCount(data?.totalCount?.aggregate?.count);
        setOffsetValue(offset);
        setTableLoader(false);
      }
    } catch (err) {
      setTableLoader(false);
    }
  };

  const getTableChartSeries = async (result: any, period: any, year: any) => {
    const ids = result?.map((item: any) => item?.ad_unit_id_2);
    const finalFilterData = ids?.filter(
      (item: any) => item !== "-" && item !== null
    );
    if (!tableLoader) {
      setTableLoader(true);
    }
    try {
      setMiniChartLoader(true);
      const { data, errors }: any = await axios.post("/api/revenue", {
        operation: "getMainChart",
        variables: {
          ad_unit_id_2: finalFilterData,
          period_month: period,
          period_year: year,
        },
      });

      if (errors) {
        throw errors;
      }
      let obj: any = {};
      if (data?.data?.ChartInfo?.length > 0) {
        data.data.ChartInfo.forEach((item: any) => {
          const ad_unit_id_2 = item?.ad_unit_id_2;
          if (!obj[ad_unit_id_2]) {
            obj[ad_unit_id_2] = {
              series: [
                {
                  name: "Revenue",
                  data: [],
                },
              ],
              labels: [],
            };
          }
          let dateFormat = moment(item?.period_date).format("MMM DD");
          obj[ad_unit_id_2].labels.push(dateFormat);
          obj[ad_unit_id_2].series[0].data.push(item?.total_revenue);
        });
      }
      let updatedResult = result?.map((itemObj: any) => {
        const ad_unit_id_2 = itemObj?.ad_unit_id_2;
        const item = { ...itemObj };
        if (obj[ad_unit_id_2]) {
          item.series = obj[ad_unit_id_2].series;
          item.labels = obj[ad_unit_id_2].labels;
        }
        return item;
      });

      setTableLoader(false);
      setMiniChartLoader(false);
      setTableListData(updatedResult);
    } catch (err) {
      setTableLoader(false);
      setMiniChartLoader(false);
    }
  };

  const getTableChartSeriesQuarterly = async (
    result: any,
    periodQuarter: any,
    year: any
  ) => {
    const ids = result?.map((item: any) => item?.ad_unit_id_2);

    if (!tableLoader) {
      setTableLoader(true);
    }

    const currentQuarterMonths = getQuarterMonths(periodQuarter);

    try {
      setMiniChartLoader(true);
      const { data, errors }: any = await axios.post("/api/revenue", {
        operation: "getMainChartQuarterly",
        variables: {
          ad_unit_id_2: ids,
          period_month: currentQuarterMonths,
          period_year: year,
        },
      });

      if (errors) {
        throw errors;
      }

      let obj: any = {};
      if (data?.data?.ChartInfo?.length > 0) {
        data.data.ChartInfo.forEach((item: any) => {
          const ad_unit_id_2 = item?.ad_unit_id_2;

          if (!obj[ad_unit_id_2]) {
            obj[ad_unit_id_2] = {
              series: [
                {
                  name: "Revenue",
                  data: [],
                },
              ],
              labels: [],
            };
          }

          const monthName = getMonthName(item?.period_month);

          obj[ad_unit_id_2].labels.push(`${monthName} ${year}`);
          obj[ad_unit_id_2].series[0].data.push(item?.total_revenue);
        });
      }

      let updatedResult = result?.map((itemObj: any) => {
        const ad_unit_id_2 = itemObj?.ad_unit_id_2;
        const item = { ...itemObj };

        if (obj[ad_unit_id_2]) {
          item.series = obj[ad_unit_id_2].series;
          item.labels = obj[ad_unit_id_2].labels;
        }

        return item;
      });

      setTableLoader(false);
      setMiniChartLoader(false);
      setTableListData(updatedResult);
    } catch (err) {
      setTableLoader(false);
      setMiniChartLoader(false);
    }
  };

  const getAdvertiserMonthly = async (period_month: any, year: any) => {
    try {
      setLoader(true);
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation: "getAdvertiserMonthly",
        variables: {
          period_month,
          period_year: year,
        },
      });

      if (errors) {
        throw errors;
      }

      if (data) {
        getStackedData(data);
      }
    } catch (err) {
      setLoader(false);
      setTableLoader(false);
    }
  };

  const getAdvertiserQuarterly = async (period_quarter: any, year: any) => {
    try {
      setLoader(true);
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation: "getAdvertiserQuaterly",
        variables: {
          period_quarter,
          period_year: year,
        },
      });

      if (errors) {
        throw errors;
      }

      if (data) {
        getStackedData(data);
      }
    } catch (err) {
      setLoader(false);
      setTableLoader(false);
    }
  };

  const getfilterInfo = async (value: any, year: any, filterVal: any) => {
    try {
      let filterParams = null;
      if (selectedFilter === "campaign_type") {
        filterParams = {
          filterKey: selectedFilter,
          filterValue: selectedFilterValue === "direct" ? "-" : "",
        };
      } else if (selectedFilter === "ad_partner") {
        filterParams = {
          filterKey: selectedFilter,
          filterValue: filterVal || selectedFilterValue,
        };
      }

      const [{ data: overviewData, errors: overviewErrors }]: any =
        await Promise.all([
          filterVal
            ? axios.post("/api/revenue", {
                operation: "getOverallFilter",
                variables: {
                  period_month: value,
                  period_year: year,
                  filterConditons: filterParams,
                },
              })
            : axios.post("/api/revenue", {
                operation: "getOverall",
                variables: {
                  period_month: value,
                  period_year: year,
                },
              }),
        ]);

      if (overviewErrors) {
        throw overviewErrors;
      }

      if (overviewData) {
        setOverallData(overviewData?.data?.OverViewInfo?.[0]);
      }

      getMainList(null, value, year, filterParams);
    } catch (err) {
      return;
    }
  };

  const getfilterInfoQuarter = async (
    value: any,
    year: any,
    filterVal: any
  ) => {
    try {
      let filterParams = null;
      if (selectedFilter === "campaign_type") {
        filterParams = {
          filterKey: selectedFilter,
          filterValue: selectedFilterValue === "direct" ? "-" : "",
        };
      } else if (selectedFilter === "ad_partner") {
        filterParams = {
          filterKey: selectedFilter,
          filterValue: filterVal || selectedFilterValue,
        };
      }

      const [{ data: overviewData, errors: overviewErrors }]: any =
        await Promise.all([
          filterVal
            ? axios.post("/api/revenue", {
                operation: "getOverallFilterQuaterly",
                variables: {
                  period_quarter: value,
                  period_year: year,
                  filterConditons: filterParams,
                },
              })
            : axios.post("/api/revenue", {
                operation: "getRevenueOverallQuaterly",
                variables: {
                  period_quarter: value,
                  period_year: year,
                },
              }),
        ]);

      if (overviewErrors) {
        throw overviewErrors;
      }

      if (overviewData) {
        setOverallData(overviewData?.data?.OverViewInfo?.[0]);
      }

      getMainListForQuarterly(null, value, year, filterParams);
    } catch (err) {
      return;
    }
  };

  const generateDataForStacked = (stackedData: any, name: any) => {
    const totalSum = stackedData.reduce(
      (sum: any, item: any) => sum + item.total_revenue,
      0
    );
    const data = stackedData?.map((item: any) => ({
      name: item?.[name],
      value: item?.total_revenue,
      ecpm: item?.total_average_ecpm,
      data: [totalSum !== 0 ? (item?.total_revenue / totalSum) * 100 : 0],
    }));

    return data;
  };

  const getStackedData = (res: any) => {
    const data = generateDataForStacked(
      res?.AdvertiserData,
      "buyer_network_name"
    );
    const demandData = generateDataForStacked(
      res?.DemandChannel,
      "demand_channel_name"
    );

    setLoader(false);
    setAdvertiser(data);
    setDemandChannel(demandData);
  };

  const filterFunction = (isFilter?: any) => {
    setTableLoader(true);
    setCloseFilter(false);
    let filterVal: any = selectedFilterValue;
    if (isFilter) {
      filterVal = "";
    }
    if (segementValue === "monthly") {
      const year = selectedMonth?.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      getfilterInfo(month, year, filterVal);
    } else if (segementValue === "quarterly") {
      const year = selectedQuarter?.getFullYear();
      const quarter = getQuarterFromDate(selectedQuarter);
      getfilterInfoQuarter(quarter, year, filterVal);
    } else if (segementValue === "yearly") {
      // const year = selectedYear?.getFullYear();
      // getfilterInfoYearly(year, filterVal);
    }
  };

  const generateLineChartData = (chartData: any) => {
    const labels = chartData.map((data: any) =>
      moment(data?.period_date).format("MMM DD")
    );

    return labels;
  };

  const generateRandomData = (chartData: any, val?: any) => {
    const labels = generateLineChartData(chartData);
    const chartOption = val || selectedChartValue;

    const getSeriesConfig = (name: any, key: any) => {
      const series = chartData?.map((data: any) => data?.[key]);
      return {
        name,
        type: "line",
        data: series.filter(
          (value: any) => value !== undefined && value !== null
        ),
        yaxis: "line-y-axis",
      };
    };

    let chartSeriesFormat: any = {
      series: [],
      label: labels,
    };

    switch (chartOption) {
      case "total_revenue":
        chartSeriesFormat.series = [
          getSeriesConfig("Revenue", "total_revenue"),
        ];
        break;
      case "total_impressions":
        chartSeriesFormat.series = [
          getSeriesConfig("Total Impression", "total_impressions"),
        ];
        break;
      default:
        chartSeriesFormat.series = [
          getSeriesConfig("Ad fill rate", "total_fill_rate"),
        ];
    }

    setChartSeries((prevState) => ({
      ...prevState,
      labels,
      series: chartSeriesFormat.series,
    }));
  };

  const generateBarChartData = (list: any, val?: any) => {
    if (list?.length > 0) {
      let dataValue = list;
      const chartOption = val || selectedChartValue;

      const getSeriesConfig = (name: any, key: any) => {
        const series = dataValue?.map((data: any) => data?.[key]);
        return {
          name,
          data: series?.filter(
            (value: any) => value !== undefined && value !== null
          ),
        };
      };

      const labels = dataValue?.map((item: any) => item?.period_month);

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
        case "total_revenue":
          chartSeriesFormat.series = [
            getSeriesConfig("Revenue", "total_revenue"),
          ];
          chartSeriesFormat.name = "Revenue";
          break;
        case "total_impressions":
          chartSeriesFormat.series = [
            getSeriesConfig("Total Impression", "total_impressions"),
          ];
          chartSeriesFormat.name = "Total Impression";
          break;
        default:
          chartSeriesFormat.series = [
            getSeriesConfig("Ad fill rate", "total_fill_rate"),
          ];
          chartSeriesFormat.name = "Ad fill rate";
      }

      setRevenueList((prevState: any) => ({
        ...prevState,
        labels: chartSeriesFormat.labels,
        series: chartSeriesFormat.series,
        name: chartSeriesFormat?.name,
      }));
    }
  };

  const handleClickExpand = (value: any) => {
    setChartLoader(true);
    const expendInfo = {
      buyerList: advertiser,
      demandData: advertiserDemandChannel,
    };

    setexpendInfo(expendInfo);
    setIsExpand(value);
    setChartLoader(false);
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

  const handleChangeChartForAdvertiser = (value: any) => {
    setSelectAdvertiser(value);
  };

  const handleClickChildrenOpen = (value: any, setLoading: any) => {
    if (value === childrenOpen) {
      setChildrenOpen(null);
      setLoading(false);
    } else {
      setChildrenOpen(value);
    }
  };

  const handleChangeSort = (value: any, direction: any) => {
    setSelectedSort(value);
    setSortEnabled(true);
    setSortDirection(direction);
  };

  const getfilterData = () => {
    const list = [
      {
        label: "Google Ad Manager",
        value: "wral-v4",
      },
      {
        label: "RevContent",
        value: "REVCONTENT",
      },
      {
        label: "EX.CO",
        value: "EX.CO",
      },
    ];

    const campaignList = [
      {
        label: "Direct",
        value: "direct",
      },
      {
        label: "Programmatic",
        value: "programmatic",
      },
    ];

    let adPartnerOptions = list?.map((item) => (
      <Select.Option key={item.value}>{item.label}</Select.Option>
    ));

    let campaignOptions = campaignList?.map((item) => (
      <Select.Option key={item.value}>{item.label}</Select.Option>
    ));

    let finalFilterData = {
      adPartnerOptions,
      campaignOptions,
    };
    setFilterData(finalFilterData);
  };

  const handleChangePagination = (value: any) => {
    setCurrentPage(value);

    if (segementValue === "monthly") {
      const year = selectedMonth?.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      getMainList(value, month, year);
    } else if (segementValue === "quarterly") {
      const year = selectedQuarter?.getFullYear();
      const quarter = getQuarterFromDate(selectedQuarter);
      getMainListForQuarterly(value, quarter, year);
    } else if (segementValue === "yearly") {
      // const year = selectedYear?.getFullYear();
      // getMainListForYearly(value, year);
    }
  };

  const handleChangeFilterSegment = (e: any) => {
    setSelectedFilter(e.target.value);
    setSelectedFilterValue(null);
  };

  function handleChange(value: any) {
    count += 1;
    setCountNo(count);
    setSelectedFilterValue(value);
  }

  const handleClickFilter = () => {
    filterFunction();
  };

  const handleCloseFilter = () => {
    setSelectedFilter("");
    setSelectedFilterValue(null);
    setCurrentPage(1);
    if (countNo > 0) {
      setCountNo(0);
      setCloseFilter(true);
    }
  };

  const handleChangeSegement = (e: any) => {
    let real_time_date = localStorage.getItem("real_time_date");
    setSegementValue(e.target.value);
    const currentDate = real_time_date ? new Date(real_time_date) : new Date();
    handleClear();

    if (e.target.value === "monthly") {
      handleMonthChange(currentDate);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentDate);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentDate);
    }
  };

  const handleClear = () => {
    setAdvertiser([]);
    setDemandChannel([]);
    setChartSeries({
      labels: [],
      series: [],
    });
    setTableListData([]);
    setSelectedFilter("");
    setSelectedFilterValue(null);
    setTotalCount(0);
    setRevenueList([]);
    setChildrenOpen(null);
    setOverallData(null);
  };

  const handleMonthChange = (date: any) => {
    handleClear();
    const selectedYear = date?.getFullYear();
    const selectedMonth = date.getMonth() + 1;

    setSelectedMonth(date);
    getRevenueMonthly(selectedMonth, selectedYear);
  };

  const handleQuarterlyChange = (date: any) => {
    handleClear();
    const selectedYear = date?.getFullYear();
    const selectedQuarter = getQuarterFromDate(date);
    setSelectedQuarter(date);
    getRevenueQuarterly(selectedQuarter, selectedYear);
  };

  const handleYearChange = (date: any) => {
    handleClear();
    const selectedYear = date?.getFullYear();
    setSelectedYear(date);
    // getRevenueYearly(selectedYear);
  };

  const handleChangeChart = (value: any) => {
    setSelectedChartValue(value);
    if (segementValue === "monthly") {
      generateRandomData(chartData, value);
    } else if (segementValue === "quarterly") {
      generateBarChartData(chartData, value);
    } else if (segementValue === "yearly") {
      generateBarChartData(chartData, value);
    }
  };

  const stackedChartData =
    selectAdvertiser === "buyer_network_name"
      ? advertiser
      : advertiserDemandChannel;
  const revenueTitle =
    selectAdvertiser === "buyer_network_name" ? "Buyers" : "Demand Channel";

  const children =
    selectedFilter === "ad_partner"
      ? filterData?.adPartnerOptions
      : selectedFilter === "campaign_type"
      ? filterData?.campaignOptions
      : [];

  const data = mapRevenueData(tableListData);
  return (
    <Layout>
      <div className="revenue-wrapper">
        <SegmentedChartSelector
          segementValue={segementValue}
          handleChangeSegement={handleChangeSegement}
          chartLoader={loader}
          selectedMonth={selectedMonth}
          selectedQuarter={selectedQuarter}
          selectedYear={selectedYear}
          handleMonthChange={handleMonthChange}
          handleQuarterlyChange={handleQuarterlyChange}
          handleYearChange={handleYearChange}
          selectedChartValue={selectedChartValue}
          handleChangeChart={handleChangeChart}
        />
        {chartLoader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : isError ? (
          <div className="article-page-error-result">
            {" "}
            <ErrorResult />
          </div>
        ) : isExpand ? (
          <div className="revenue-chart-full">
            <div className="revenue-chart-header">
              <div
                className="expend-icon"
                onClick={() => handleClickExpand(false)}
              >
                <FullscreenExitOutlined style={{ fontSize: "20px" }} />
              </div>
            </div>
            <div className="chart-screen-full">
              {Object?.values(expendInfo).map((data: any, index) => (
                <StackedBarChart
                  key={index}
                  series={data}
                  colors={generateColors(data?.length)}
                  max={100}
                  legend={true}
                  height={100}
                  isRevenue
                  secondTooltipLabels={data?.map((item: any) => item.ecpm)}
                  tooltipLabels={data?.map((item: any) => item.value)}
                  legendLabels={data?.map((item: any) => item.name)}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="revenue-page-chart">
              <div className="revenue-chart-content ">
                {segementValue === "monthly" ? (
                  chartSeries?.series?.some(
                    (series: any) => series?.data?.length > 0
                  ) ? (
                    <LineChart
                      labels={chartSeries?.labels}
                      series={chartSeries?.series}
                      colors={["#7F56D9"]}
                      height={300}
                      isRevenue
                      multipleYaxis={false}
                    />
                  ) : (
                    <div style={{ padding: 20 }}>
                      <Empty description="We don’t have enough data generated to show meaningful insights here" />
                    </div>
                  )
                ) : revenueSeries?.series?.some(
                    (item: any) => item?.data?.length > 0
                  ) ? (
                  <BarChart
                    labels={revenueSeries?.labels}
                    series={revenueSeries?.series?.[0]?.data}
                    name={revenueSeries?.name}
                    logarithmic
                    colors={["#7F56D9"]}
                    width={"30px"}
                  />
                ) : (
                  <div style={{ padding: 20 }}>
                    <Empty description="We don’t have enough data generated to show meaningful insights here" />
                  </div>
                )}
              </div>
            </div>
            <Row gutter={[16, 16]} className="revenue-buyer">
              <div className="row-flex">
                <div className="revenue-referrers-heading">
                  {`Revenue by ${revenueTitle}`}
                </div>
                <div
                  className="flex-end"
                  style={{ width: "180px", display: "flex" }}
                >
                  <Select
                    onChange={handleChangeChartForAdvertiser}
                    className="multi-select"
                    value={selectAdvertiser}
                    getPopupContainer={(triggerNode) =>
                      triggerNode?.parentNode || document.body
                    }
                  >
                    <Select.Option value="buyer_network_name">
                      Buyer Network
                    </Select.Option>
                    <Select.Option value="demand_channel">
                      Demand Channel
                    </Select.Option>
                  </Select>
                  <div
                    className="expend-icon"
                    onClick={() => handleClickExpand(true)}
                  >
                    <FullscreenOutlined style={{ fontSize: "20px" }} />
                  </div>
                </div>
              </div>
              <Col span={24}>
                {loader ? (
                  <AntdSkeleton
                    active
                    paragraph={{ rows: 0 }}
                    title={{ width: "100%" }}
                  />
                ) : advertiser?.length > 0 ? (
                  <StackedBarChart
                    series={stackedChartData}
                    colors={generateColors(stackedChartData?.length)}
                    max={100}
                    legend={true}
                    height={100}
                    isRevenue
                    secondTooltipLabels={stackedChartData?.map(
                      (item: any) => item?.ecpm
                    )}
                    tooltipLabels={stackedChartData?.map(
                      (item: any) => item?.value
                    )}
                    legendLabels={stackedChartData?.map(
                      (item: any) => item?.name
                    )}
                  />
                ) : (
                  <Empty description="We don’t have enough data generated to show meaningful insights here" />
                )}
              </Col>
            </Row>
            <div className="revenue-page-filter-wrapper">
              <div className="revenue-page-filter-content">
                <div className="revenue-page-filter">
                  <div className="revenue-page-filter-title">Filter By:</div>
                  <div className="revenue-filter-button">
                    <Radio.Group
                      buttonStyle="solid"
                      size="large"
                      onChange={handleChangeFilterSegment}
                      value={selectedFilter}
                    >
                      <Radio.Button value="campaign_type" disabled>
                        Campaign Type
                      </Radio.Button>
                      <Radio.Button value="ad_partner">Ad Partner</Radio.Button>
                      <Radio.Button value="ad_placement" disabled>
                        Ad Placement
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <div className="revenue-page-pagination">
                  <Pagination
                    defaultCurrent={1}
                    current={currentpage}
                    total={totalCount}
                    onChange={handleChangePagination}
                  />
                </div>
              </div>
              {selectedFilter !== "" && (
                <div className="filter-content-wrapper">
                  <div className="filter-select">
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      onChange={handleChange}
                      value={selectedFilterValue}
                      getPopupContainer={(triggerNode) =>
                        triggerNode?.parentNode || document.body
                      }
                      allowClear
                    >
                      {children}
                    </Select>
                  </div>

                  <div className="filter-apply-button">
                    <Button
                      size="large"
                      onClick={handleClickFilter}
                      disabled={
                        selectedFilterValue === null ||
                        selectedFilterValue === ""
                      }
                    >
                      Apply Filter
                    </Button>
                    <Button
                      size="large"
                      onClick={handleCloseFilter}
                      style={{ marginLeft: 10 }}
                    >
                      Close Filter
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="revenue-page-list-count-wrapper">
              <div className="revenue-page-list-content">
                <div className="revenue-list-count-wrapper">
                  <Row gutter={[16, 16]}>
                    <Col span={6}>
                      <CountView
                        title={"Total Revenue"}
                        value={overallData?.total_revenue?.toFixed(2) || 0}
                        tooltipTitle="Revenue generated from advertisements on the website."
                      />
                    </Col>
                    <Col span={6}>
                      <CountView
                        title={"Average Revenue Per User"}
                        value={
                          overallData?.avg_revenue_per_user?.toFixed(2) || 0
                        }
                        tooltipTitle="The average revenue generated per user on the platform."
                      />
                    </Col>
                    <Col span={6}>
                      <CountView
                        title={"eCPM"}
                        value={overallData?.average_ecpm?.toFixed(2) || 0}
                        tooltipTitle="Effective Cost Per Thousand impressions, a measure of ad revenue."
                      />
                    </Col>
                    <Col span={6}>
                      <CountView
                        title={"Ad Fill Rate"}
                        value={`${
                          overallData?.total_avg_fill_rate?.toFixed(2) || 0
                        } %`}
                        tooltipTitle="Percentage of ad inventory filled by advertisements."
                      />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className="revenue-list-table-wrapper">
              <ArticleTableCard
                dataSource={data}
                loading={chartLoader}
                miniChartLoader={miniChartLoader}
                loader={tableLoader}
                segementValue={segementValue}
                offsetValue={offsetValue}
                childrenOpen={childrenOpen}
                handleClickChildrenOpen={handleClickChildrenOpen}
                sortDirection={sortDirection}
                handleChangeSort={handleChangeSort}
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
