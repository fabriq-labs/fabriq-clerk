"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@components/layout";
import moment from "moment";

import { getQuarterFromDate, formationTimezone } from "@/utils/helper";
import ErrorResult from "@/components/error_result";
import SegmentedChartSelector from "./components/article_list_segment";

import LineChart from "@/components/chart/linechart";

export default function ArticleList() {
  const [segementValue, setSegementValue] = useState("real-time");
  const [chartLoader, setChartLoader] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [currentpage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [isError, setIsError] = useState(false);

  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [overViewChartData, setOverViewChartData]: any = useState({});
  const [overViewCurrentChartResponse, setOverViewCurrentChartResponse] =
    useState([]);
  const [overViewAverageChartResponse, setOverViewAverageChartResponse] =
    useState([]);
  const [newPost, setNewPost] = useState([]);
  const [visitorsData, setVisitorsData] = useState([]);

  const timeInterval = 30 * 60 * 1000;

  useEffect(() => {
    getRealtimeData();
    setSegementValue("real-time");
    setSelectedChartValue("page_views");
    // setSelectedSort("page_views");

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
    const siteDetails: any = {
      id: 36,
      site_id: "wral.com",
      site_name: "Fabriq",
      host_name: "https://fabriq.com",
      collector_url: "wral.com/dt",
    };
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
          //   getfilterData(data?.TopPosts);
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
    const siteInfo: any = {
      id: 36,
      site_id: "wral.com",
      site_name: "Fabriq",
      host_name: "https://fabriq.com",
      collector_url: "wral.com/dt",
    };
    setChartLoader(true);
    setIsError(false);

    const query_id = 429;

    const topPostvariables = {
      parameters: {
        site_id: `"${siteInfo?.site_id}"`,
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
          //   getfilterData(data?.TopPosts);
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
    // setSelectedFilter("");
    // setSelectedFilterValue(null);
    // setBarChartResponse((prevState) => ({
    //   ...prevState,
    //   labels: [],
    //   series: [],
    // }));
    setVisitorsData([]);
    // setTableListData([]);

    // setSortDirection("desc_nulls_last");
    // setPageViewsSortDirection("desc_nulls_last");

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

    // setBarChartResponse((prevState: any) => ({
    //   ...prevState,
    //   labels: [],
    //   series: [],
    // }));
    setVisitorsData([]);
    // setTableListData([]);
    // getMonthlyData(month, year);
    setSelectedMonth(date);
  };

  const handleYearChange = (date: any) => {
    const year = date?.getFullYear();
    // setBarChartResponse((prevState: any) => ({
    //   ...prevState,
    //   labels: [],
    //   series: [],
    // }));
    setVisitorsData([]);
    // setTableListData([]);
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

  const timeLabels = overViewChartData?.label?.map((item: any) => {
    const formattedTime = moment(selectedDate)
      .hour(item)
      .minute(0)
      .format("MMM D, h:mm a");
    return formattedTime;
  });

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
                    // <BarChart
                    //   labels={barchartResponse?.labels}
                    //   series={barchartResponse?.series}
                    //   name={barchartResponse?.name}
                    //   tooltipLabels={
                    //     segementValue === "monthly"
                    //       ? formattedLabels(barchartResponse?.labels)
                    //       : null
                    //   }
                    //   logarithmic
                    //   colors={["#7F56D9"]}
                    //   width={"30px"}
                    //   tickAmount={true}
                    // />
                    "Chart"
                  )}
                </div>
              </div>
              
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
