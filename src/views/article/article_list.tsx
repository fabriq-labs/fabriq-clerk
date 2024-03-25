"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@components/layout";
import moment from "moment";
import { Row, Col, Pagination, Button, DatePicker, Select, Radio } from "antd";

import { getQuarterFromDate, formationTimezone } from "@/utils/helper";
import ErrorResult from "@/components/error_result";
import SegmentedChartSelector from "./components/article_list_segment";

import LineChart from "@/components/chart/linechart";
import BarChart from "@/components/barchart";
import ArticleCountView from "./components/article_count";

export default function ArticleList() {
  const [minichartLoader, setMiniChartLoader] = useState(false);
  const [segementValue, setSegementValue] = useState("real-time");
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [overViewChartData, setOverViewChartData]: any = useState({});
  const [chartLoader, setChartLoader] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [filterData, setFilterData]: any = useState({});
  const [selectedFilter, setSelectedFilter] = useState("");
  const [historicalChartResponse, setHistoricalChartResponse] = useState([]);
  const [overViewCurrentChartResponse, setOverViewCurrentChartResponse] =
    useState([]);
  const [overViewAverageChartResponse, setOverViewAverageChartResponse] =
    useState([]);
  const [selectedFilterValue, setSelectedFilterValue]: any = useState(null);
  const [visitorsData, setVisitorsData]: any = useState([]);
  const [tableListData, setTableListData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [barchartResponse, setBarChartResponse] = useState({
    labels: [],
    series: [],
    name: "",
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [sortDirection, setSortDirection] = useState("desc_nulls_last");
  const [pageViewssortDirection, setPageViewsSortDirection] =
    useState("desc_nulls_last");
  const [newPost, setNewPost] = useState([]);
  const [isError, setIsError] = useState(false);
  const [currentpage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [closeFilter, setCloseFilter] = useState(false);
  const [sortEnabled, setSortEnabled] = useState(false);
  const [countNo, setCountNo] = useState(0);
  let count = 0;

  const timeInterval = 30 * 60 * 1000;

  const siteDetails: any = {
    id: 36,
    site_id: "wral.com",
    site_name: "Fabriq",
    host_name: "https://fabriq.com",
    collector_url: "wral.com/dt",
  };

  useEffect(() => {
    const siteInfo = siteDetails.site_id;
    const query_id = 427;
    const topPostvariables: any = {
      parameters: {
        site_id: `"${siteInfo}"`,
      },
      max_age: -1,
      id: query_id,
    };

    axios
      .post("/api/query_results", { data: topPostvariables })
      .then((values: any) => {
        const { data } = values;
        if ("job" in data) {
          return getResultFromJob(data, topPostvariables);
        }

        return data.query_result ? data.query_result : Promise.reject();
      })
      .then((res: any) => {
        if (res) {
          const data = res?.data?.data?.real_time_sort;
          setTotalCount(res?.data?.data?.total_articles?.aggregate?.count);
          setOffsetValue(0);
          setTableListData(data);
          getTableChartSeries(data, true, false);
        }
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  useEffect(() => {
    getRealtimeData();
    setSegementValue("real-time");
    setSelectedChartValue("page_views");
    setSelectedSort("page_views");

    const intervalId = setInterval(() => {
      getRealtimeData();
    }, timeInterval);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      overViewCurrentChartResponse &&
      overViewAverageChartResponse &&
      newPost
    ) {
      chartData(selectedChartValue);
    }
  }, [overViewCurrentChartResponse, overViewAverageChartResponse, newPost]);

  useEffect(() => {
    if (closeFilter) {
      filterFunction(true);
    }
  }, [closeFilter, selectedFilter, selectedFilterValue]);

  function timeRange(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchDataFromJob = async (jobData: any): Promise<any> => {
    try {
      const response = await axios.get(`/api/get_jobs/${jobData?.job.id}`);
      const { data } = response;

      if (data.job.status < 3) {
        await timeRange(3000);
        return fetchDataFromJob(data);
      } else if (data.job.status === 3) {
        return data.job.result;
      } else if (data.job.status === 4 && data.job.error.code === 1) {
        return [];
      } else {
        throw new Error(data.job.error);
      }
    } catch (error: any) {
      // error
    }
  };

  const getResultFromJob = (data: any, topPostvariables: any) => {
    return fetchDataFromJob(data).then((res) => {
      if (res) {
        return axios
          .post("/api/query_results", { data: topPostvariables })
          .then((result) => {
            let resultData = result?.data?.query_result;
            return resultData;
          })
          .catch((err) => {
            throw err;
          });
      }
    });
  };

  /* Realtime data */
  const getRealtimeDataFromQuery = (date: any) => {
    const siteInfo = siteDetails.site_id;
    setChartLoader(true);
    setIsError(false);

    let period_date = date ? date : formationTimezone(moment(), "YYYY-MM-DD");

    const partial_period_date = `${period_date}%`;
    const variables = {
      site_id: siteInfo,
      period_date: period_date,
      partial_period_date: partial_period_date,
    };

    const operation = "getRealtimeArticleList";

    axios
      .post("/api/article", {
        operation,
        variables,
      })
      .then((res: any) => {
        if (res) {
          const data = res?.data?.data;
          if (res?.data?.errors) {
            const errors = res?.data?.errors;
            throw errors;
          }

          const chartRes = data?.ArticleCurrentHours;
          setVisitorsData(data?.daily_data?.[0]);
          getfilterData(data?.TopPosts);
          setNewPost(data?.NewPostArticles);
          chartData();
          setOverViewCurrentChartResponse(chartRes);
          setOverViewAverageChartResponse(data?.ArticleAvgHours);
          setChartLoader(false);
        }
      })
      .catch(() => {
        setChartLoader(false);
        setIsError(true);
      });
  };

  const getRealtimeData = () => {
    setChartLoader(true);
    setIsError(false);

    const query_id = 429;

    const topPostvariables = {
      parameters: {
        site_id: `"${siteDetails?.site_id}"`,
      },
      max_age: -1,
      id: query_id,
    };

    axios
      .post("/api/query_results", { data: topPostvariables })
      .then((values: any) => {
        const { data } = values;
        if ("job" in data) {
          return getResultFromJob(data, topPostvariables);
        }

        return data.query_result ? data.query_result : Promise.reject();
      })
      .then((res: any) => {
        if (res) {
          const data = res?.data?.data;
          if (res?.data?.errors) {
            const errors = res?.data?.errors;
            throw errors;
          }

          const chartRes = data?.ArticleCurrentHours;
          setVisitorsData(data?.daily_data?.[0]);
          getfilterData(data?.TopPosts);
          setNewPost(data?.NewPostArticles);
          chartData();
          setOverViewCurrentChartResponse(chartRes);
          setOverViewAverageChartResponse(data?.ArticleAvgHours);
          setChartLoader(false);
        }
      })
      .catch(() => {
        setChartLoader(false);
        setIsError(true);
      });
  };

  const getTableChartSeries = async (
    result: any,
    realTime: any,
    isLoader = true
  ) => {
    // let real_time_date = moment(selectedDate).format("YYYY-MM-DD");
    // const overviewIds = result?.map((item) => {
    //   return item?.article?.article_id;
    // });

    // if (!tableLoader && isLoader) {
    //   setTableLoader(true);
    // }

    // if (realTime) {
    //   setMiniChartLoader(true);
    // }

    // const req = {
    //   period_date: real_time_date || formationTimezone(moment(), "YYYY-MM-DD"),
    //   site_id: siteDetails?.site_id,
    //   article_id: overviewIds
    // };

    // const res = realTime
    //   ? await Overview.getLast30Days(req)
    //   : await Overview.getLast30DaysArticle(req);

    // let obj = {};

    // const lableValue = Array.from({ length: 24 }, (_, i) => i);
    // if (res?.data?.data?.last30DaysData?.length > 0) {
    //   res.data.data.last30DaysData.forEach((articleItem) => {
    //     const article_id = articleItem?.article?.article_id;

    //     if (!obj[article_id]) {
    //       obj[article_id] = {
    //         series: [
    //           {
    //             name: "Page Views",
    //             data: realTime ? lableValue?.map(() => 0) : []
    //           }
    //         ],
    //         labels: []
    //       };
    //     }

    //     if (realTime) {
    //       obj[article_id].labels = lableValue?.map((item) =>
    //         moment(item, "H").format("MMM D, h:mm a")
    //       );

    //       const hourIndex = lableValue.indexOf(articleItem?.hour);
    //       if (hourIndex !== -1) {
    //         obj[article_id].series[0].data[hourIndex] = articleItem?.page_views;
    //       }
    //     } else {
    //       let dateFormat = moment(articleItem.period_date).format("MMM DD");
    //       obj[article_id].labels.push(dateFormat);
    //       obj[article_id].series[0].data.push(articleItem?.page_views);
    //     }
    //   });
    // }

    // // Loop through result to add series property based on author_id
    // let updatedResult = result?.map((authorItem) => {
    //   const article_id = authorItem?.article?.article_id;
    //   const item = { ...authorItem };

    //   if (obj[article_id]) {
    //     item.series = obj[article_id].series;
    //     item.labels = obj[article_id].labels;
    //   }

    //   return item;
    // });

    // updatedResult = updatedResult?.map((post) => {
    //   if (post?.scroll_depth) {
    //     const scrollDepthData = post.scroll_depth;

    //     const total_calc =
    //       (scrollDepthData?.["crossed_10_users"] || 0) * 10 +
    //       (scrollDepthData?.["crossed_20_users"] || 0) * 20 +
    //       (scrollDepthData?.["crossed_30_users"] || 0) * 30 +
    //       (scrollDepthData?.["crossed_40_users"] || 0) * 40 +
    //       (scrollDepthData?.["crossed_50_users"] || 0) * 50 +
    //       (scrollDepthData?.["crossed_60_users"] || 0) * 60 +
    //       (scrollDepthData?.["crossed_70_users"] || 0) * 70 +
    //       (scrollDepthData?.["crossed_80_users"] || 0) * 80 +
    //       (scrollDepthData?.["crossed_90_users"] || 0) * 90 +
    //       (scrollDepthData?.["crossed_100_users"] || 0) * 100;

    //     // Calculate the total scroll depth percentage for the current post
    //     const total_scroll_depth_percentage =
    //       (scrollDepthData?.["crossed_10_users"] || 0) +
    //       (scrollDepthData?.["crossed_20_users"] || 0) +
    //       (scrollDepthData?.["crossed_30_users"] || 0) +
    //       (scrollDepthData?.["crossed_40_users"] || 0) +
    //       (scrollDepthData?.["crossed_50_users"] || 0) +
    //       (scrollDepthData?.["crossed_60_users"] || 0) +
    //       (scrollDepthData?.["crossed_70_users"] || 0) +
    //       (scrollDepthData?.["crossed_80_users"] || 0) +
    //       (scrollDepthData?.["crossed_90_users"] || 0) +
    //       (scrollDepthData?.["crossed_100_users"] || 0);

    //     // Calculate the average combined scroll depth percentage for the current post
    //     const avg_combined_percentage =
    //       total_calc / total_scroll_depth_percentage;

    //     // Convert avg_combined_percentage to a number
    //     const scroll_depth_percentage = parseFloat(
    //       avg_combined_percentage.toFixed(2)
    //     );

    //     // Add scroll_depth_percentage to the current post object
    //     return {
    //       ...post,
    //       scroll_depth_percentage
    //     };
    //   } else {
    //     // If scrollDepthData is null, return the original post object
    //     return post;
    //   }
    // });

    // if (realTime) {
    //   setMiniChartLoader(false);
    // }
    setTableLoader(false);
    // setTableListData(updatedResult);
  };

  const formattedLabels = (labels: any) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Function to get the number of days in the current month
    const getDaysInMonth = (year: any, month: any) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Generate the labels array for the current month
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedLabels = labels?.map((day: any) => {
      if (day <= daysInMonth) {
        return `${monthNames[currentMonth]} ${day}`;
      } else {
        return ""; // Empty string for days beyond the current month
      }
    });

    return formattedLabels;
  };

  const chartData = (value?: any) => {
    if (
      overViewCurrentChartResponse &&
      overViewAverageChartResponse &&
      newPost
    ) {
      const lableValue = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData: any = overViewCurrentChartResponse.find(
          (obj: any) => (obj.hour + 1 === 24 ? 0 : obj.hour + 1) === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData: any = overViewCurrentChartResponse.find(
          (obj: any) => (obj.hour + 1 === 24 ? 0 : obj.hour + 1) === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averageUserValues = lableValue.map((hour) => {
        const matchingData: any = overViewAverageChartResponse.find(
          (obj: any) => (obj.hour + 1 === 24 ? 0 : obj.hour + 1) === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData: any = overViewAverageChartResponse.find(
          (obj: any) => (obj.hour + 1 === 24 ? 0 : obj.hour + 1) === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const articleCounts = new Array(24).fill(null);
      let timezone = localStorage.getItem("org_timezone") || "";

      newPost.forEach((article: any) => {
        const publishedHour =
          timezone !== ""
            ? moment(article.published_date).tz(timezone).hour()
            : new Date(article.published_date).getUTCHours();
        articleCounts[publishedHour]++;
      });

      let chartSeriesFormat = {
        series: [
          {
            name: "Today",
            type: "line",
            data:
              value === "page_views"
                ? currentPageViewsValues
                : currentUserValues,
            yaxis: "line-y-axis",
          },
          {
            name: "Average",
            type: "line",
            data:
              value === "page_views"
                ? averagePageViewsValue
                : averageUserValues,
            yaxis: "line-y-axis",
          },
        ],
        label: lableValue,
      };

      setOverViewChartData(chartSeriesFormat);
    }
  };

  const handleChangeSegement = async (e: any) => {
    let real_time_date = localStorage.getItem("real_time_date");
    setSegementValue(e.target.value);

    const currentDate = real_time_date
      ? new Date(real_time_date)
      : new Date("2024-01-22");

    setCurrentPage(1);
    setSelectedFilter("");
    setSelectedFilterValue(null);
    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setVisitorsData([]);
    setTableListData([]);

    setSortDirection("desc_nulls_last");
    setPageViewsSortDirection("desc_nulls_last");

    if (e.target.value === "monthly") {
      handleMonthChange(currentDate);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentDate);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentDate);
    } else if (e.target.value === "real-time") {
      handleDayChange(currentDate, e.target.value, true);
    }
  };

  const handleDayChange = (
    date: any,
    segement = null,
    isSegmentTrue = false
  ) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("YYYY-MM-DD");

    const val = segement || segementValue;
    getRealtimeDataFromQuery(formattedDate);
    // get_TableData_Sort(selectedSort, val, isSegmentTrue, formattedDate);
  };

  const handleMonthChange = (date: any) => {
    const year = date?.getFullYear();
    const month = date.getMonth() + 1;

    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setVisitorsData([]);
    setTableListData([]);
    // getMonthlyData(month, year);
    setSelectedMonth(date);
  };

  const handleYearChange = (date: any) => {
    const year = date?.getFullYear();
    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setVisitorsData([]);
    setTableListData([]);
    // getYearlyData(year);
    setSelectedYear(date);
  };

  const handleQuarterlyChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    const quarter = getQuarterFromDate(date);
    // setBarChartResponse((prevState: any) => ({
    //   ...prevState,
    //   labels: [],
    //   series: [],
    // }));
    setVisitorsData([]);
    // setTableListData([]);
    // getQuarterlyData(quarter, selectedYear);
    setSelectedQuarter(date);
  };

  const handleChangeChart = (value: any) => {
    setSelectedChartValue(value);
    // if (segementValue === "monthly") {
    //   generateDataMonthly(historicalChartResponse, value);
    // } else if (segementValue === "yearly") {
    //   const year = selectedYear?.getFullYear();
    //   generateDataForYearChart(historicalChartResponse, year, value);
    // } else if (segementValue === "quarterly") {
    //   const quarter = getQuarterFromDate(selectedQuarter);
    //   generateDataForQuarterChart(historicalChartResponse, quarter, value);
    // }

    chartData(value);
  };

  const handleChangePagination = (value: any) => {
    setCurrentPage(value);

    setTableLoader(true);
    if (segementValue === "monthly") {
      // handleMonthlySortAndFilter(null, null, value);
    } else if (segementValue === "quarterly") {
      // handleQuarterlySortAndFilter(null, null, value);
    } else if (segementValue === "yearly") {
      // handleYearlySortAndFilter(null, null, value);
    } else {
      // handleRealTimeSortAndFilter(null, null, value);
    }
  };

  function handleChange(value: any) {
    count += 1;
    setCountNo(count);
    setSelectedFilterValue(value);
  }

  const handleChangeFilterSegment = (e: any) => {
    setSelectedFilter(e.target.value);
    setSelectedFilterValue(null);
  };

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

  const filterFunction = (isFilter?: any) => {
    setTableLoader(true);
    setCloseFilter(false);

    let filterVal = selectedFilterValue;

    if (isFilter) {
      filterVal = "";
    }

    if (filterVal) {
      if (segementValue === "monthly") {
        // handleMonthlySortAndFilter(null, filterVal);
      } else if (segementValue === "quarterly") {
        // handleQuarterlySortAndFilter(null, filterVal);
      } else if (segementValue === "yearly") {
        // handleYearlySortAndFilter(null, filterVal);
      } else {
        // handleRealTimeSortAndFilter(null, filterVal);
      }
    } else {
      setSelectedFilterValue(null);
      // get_TableData_Sort(selectedSort);
      setTableLoader(false);
    }
  };

  function handleDateChange(date: any, dateString: any) {
    count += 1;
    setCountNo(count);

    let dateFormat: any = dateString.replace(/\//g, "-");
    setSelectedFilterValue(`${dateFormat}%`);
  }

  const getfilterData = (data: any) => {
    let filterData = data;

    let categoryArray: any = filterData?.map(
      (item: any) => item?.article?.category
    );
    let authorArray: any = filterData?.map(
      (item: any) => item?.article?.authors?.name
    );

    let removedDuplicatesCategory: any = [...new Set(categoryArray)];
    let remodedDuplicatedAuthor: any = [...new Set(authorArray)];

    let categoryOption = removedDuplicatesCategory?.map((item: any) => (
      <Select.Option key={item} style={{ textTransform: "capitalize" }}>
        {item}
      </Select.Option>
    ));
    let authorOption = remodedDuplicatedAuthor?.map((item: any) => (
      <Select.Option key={item}>{item}</Select.Option>
    ));

    let finalFilterData = {
      tag: categoryOption,
      author: authorOption,
    };
    setFilterData(finalFilterData);
  };

  const timeLabels = overViewChartData?.label?.map((item: any) => {
    const formattedTime = moment(selectedDate)
      .hour(item)
      .minute(0)
      .format("MMM D, h:mm a");
    return formattedTime;
  });

  function secondsToMinutes(seconds: any) {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    return minutes;
  }

  const total_time_spent_minutes = secondsToMinutes(
    visitorsData?.total_time_spent ? visitorsData.total_time_spent : 0
  );

  let children =
    selectedFilter === "author" ? filterData?.author : filterData?.tag;
  const dateFormat = "YYYY/MM/DD";

  return (
    <Layout>
      <div className="article-page-wrapper">
        <div className="article-page-content">
          <SegmentedChartSelector
            segementValue={segementValue}
            handleChangeSegement={handleChangeSegement}
            chartLoader={chartLoader}
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
          />
          {chartLoader ? (
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
                  {segementValue === "real-time" ||
                  segementValue === "monthly" ? (
                    <LineChart
                      labels={
                        segementValue === "monthly"
                          ? overViewChartData?.label
                          : timeLabels
                      }
                      selectedDate={selectedDate}
                      isArticle
                      series={overViewChartData?.series}
                      colors={["#7F56D9", "#A3E0FF", "#e89de1"]}
                      height={300}
                      multipleYaxis={false}
                    />
                  ) : (
                    <BarChart
                      labels={barchartResponse?.labels}
                      series={barchartResponse?.series}
                      name={barchartResponse?.name}
                      tooltipLabels={
                        segementValue === "monthly"
                          ? formattedLabels(barchartResponse?.labels)
                          : null
                      }
                      logarithmic
                      colors={["#7F56D9"]}
                      width={"30px"}
                      tickAmount={true}
                    />
                  )}
                </div>
              </div>
              <div className="article-page-list-count-wrapper">
                <div className="article-page-list-content">
                  <div className="article-list-count-wrapper">
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <ArticleCountView
                          title={"Readers"}
                          value={visitorsData?.users || 0}
                          tooltipTitle="Unique individuals who have visited the website."
                        />
                      </Col>
                      <Col span={8}>
                        <ArticleCountView
                          title={"Total Time Spent"}
                          value={
                            visitorsData?.total_time_spent
                              ? total_time_spent_minutes
                              : 0
                          }
                          tooltipTitle="Total amount of time all users have spent on the website."
                        />
                      </Col>
                      <Col span={8}>
                        <ArticleCountView
                          title={"Average Time Spent"}
                          value={
                            visitorsData?.average_time_spent
                              ? visitorsData?.average_time_spent
                              : 0
                          }
                          tooltipTitle="Average amount of time a user spends on the website."
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
              <div className="article-page-filter-wrapper">
                <div className="article-page-filter-content">
                  <div className="article-page-filter">
                    <div className="article-page-filter-title">Filter By:</div>
                    <div className="article-filter-button">
                      <Radio.Group
                        buttonStyle="solid"
                        size="large"
                        onChange={handleChangeFilterSegment}
                        value={selectedFilter}
                      >
                        <Radio.Button value="author">Author</Radio.Button>
                        <Radio.Button value="category">Category</Radio.Button>
                        <Radio.Button value="published_date">
                          Published Date
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                  <div className="article-page-pagination">
                    <Pagination
                      defaultCurrent={1}
                      disabled={tableLoader}
                      current={currentpage}
                      total={totalCount}
                      onChange={handleChangePagination}
                    />
                  </div>
                </div>
                {selectedFilter !== "" && (
                  <div className="filter-content-wrapper">
                    {selectedFilter !== "published_date" ? (
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
                    ) : (
                      <div className="filter-select-date">
                        <DatePicker
                          format={dateFormat}
                          size="large"
                          onChange={handleDateChange}
                        />
                      </div>
                    )}
                    <div className="filter-apply-button">
                      <Button
                        size="large"
                        onClick={handleClickFilter}
                        disabled={
                          selectedFilter !== "published_date" &&
                          (selectedFilterValue === null ||
                            selectedFilterValue === "")
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
