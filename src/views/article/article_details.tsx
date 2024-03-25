"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@components/layout";
import moment from "moment";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Table, Radio, Select, Row, Col, Empty, Tooltip } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

// Components
import DatePicker from "../../components/date_picker";
import ErrorResult from "@/components/error_result";
import Category from "@/components/Category/category";
import LineChart from "@/components/chart/linechart";
import BarChart from "@/components/barchart";
import FunnelRechart from "@/components/chart/funnelchart";
import StackedBarChart from "@/components/chart/stackedBarChart";
import {
  formationTimezone,
  getQuarterFromDate,
  formatNumber,
  getQuarterMonths,
} from "@/utils/helper";

interface BarChartResponse {
  labels: string[];
  series: any[];
  name: string;
}

export const formatDuration = (
  duration: any,
  textFontSize: any,
  numberFontSize: any
) => {
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  if (hours > 0) {
    return (
      <span>
        <span style={{ fontSize: numberFontSize }}>
          {hours.toLocaleString()}
        </span>
        <span style={{ fontSize: textFontSize, fontWeight: "500" }}>h</span>{" "}
        <span style={{ fontSize: numberFontSize, marginLeft: "5px" }}>
          {minutes}
          <span style={{ fontSize: textFontSize, fontWeight: "500" }}>m</span>
        </span>
      </span>
    );
  } else if (minutes > 0) {
    return (
      <span>
        <span style={{ fontSize: numberFontSize }}>
          {minutes}
          <span style={{ fontSize: textFontSize, fontWeight: "500" }}>m</span>
        </span>
      </span>
    );
  } else {
    return (
      <span>
        <span style={{ fontSize: numberFontSize }}>
          {duration.seconds()}
          <span style={{ fontSize: textFontSize, fontWeight: "500" }}>s</span>
        </span>
      </span>
    );
  }
};

function SocialCard({ mediumDistribution, socialTop }: any) {
  const socialValue =
    mediumDistribution?.value?.Social || mediumDistribution?.value?.social || 0;
  const socialPercentage = (
    mediumDistribution?.percentage?.Social ||
    mediumDistribution?.percentage?.social ||
    0
  ).toFixed(2);
  const socialSource =
    socialValue && socialValue !== 0 && socialTop?.[0]?.refr_source;

  return (
    <div className="card">
      <div className="row1">
        <img src="/images/network.png" alt="social" width={24} height={24} />
        <div className="row-title">Social</div>
      </div>
      <div className="row2" style={{ color: "#172a95" }}>
        {formatNumber(socialValue)}&nbsp;
        <span className="percentage">{socialPercentage}%</span>
      </div>
      <div className="row3">
        {socialSource ? (
          <div>
            <div
              style={{ color: "#172a95", fontSize: "12px" }}
              title={socialSource}
            >
              {socialSource}
            </div>{" "}
            <div className="top-title-heading">Top Social</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

function ReferralCard({ mediumDistribution, referalTop }: any) {
  const referralValue =
    mediumDistribution?.value?.Referral ||
    mediumDistribution?.value?.unknown ||
    0;
  const referralPercentage = (
    mediumDistribution?.percentage?.Referral ||
    mediumDistribution?.percentage?.unknown ||
    0
  ).toFixed(2);
  const referralUrlHost = referralValue !== 0 && referalTop?.[0]?.referer_site;

  return (
    <div className="card">
      <div className="row1">
        <img src="/images/referral.png" alt="referral" width={24} height={24} />
        <div className="row-title">Referral</div>
      </div>
      <div className="row2" style={{ color: "#f8b633" }}>
        {formatNumber(referralValue)}&nbsp;
        <span className="percentage">{referralPercentage}%</span>
      </div>
      <div className="row3">
        {referralUrlHost ? (
          <div>
            <div
              style={{ color: "#f8b633", cursor: "pointer", fontSize: "12px" }}
              title={referralUrlHost}
              className="top-url"
            >
              {referralUrlHost}
            </div>{" "}
            <div className="top-title-heading">Top Referral</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

function SearchCard({ mediumDistribution, searchTop }: any) {
  const searchValue = mediumDistribution?.value?.search || 0;
  const searchPercentage = (
    mediumDistribution?.percentage?.search || 0
  ).toFixed(2);
  const searchSource = searchValue !== 0 && searchTop?.[0]?.refr_source;

  return (
    <div className="card">
      <div className="row1">
        <img src="/images/search.png" alt="search" width={24} height={24} />
        <div className="row-title">Search</div>
      </div>
      <div className="row2" style={{ color: "#e63111" }}>
        {formatNumber(searchValue)}&nbsp;
        <span className="percentage">{searchPercentage}%</span>
      </div>
      <div className="row3">
        {searchSource ? (
          <div>
            <div
              style={{ color: "#e63111", fontSize: "12px" }}
              title={searchSource}
            >
              {searchSource}
            </div>{" "}
            <div className="top-title-heading">Top Search</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

function InternalCard({ mediumDistribution, internalTop }: any) {
  const internalValue =
    mediumDistribution?.value?.Internal ||
    mediumDistribution?.value?.internal ||
    0;
  const internalPercentage = (
    mediumDistribution?.percentage?.Internal ||
    mediumDistribution?.percentage?.internal ||
    0
  ).toFixed(2);
  const internalUrlPath = internalValue !== 0 && internalTop?.[0]?.referer_site;

  function extractTitleFromURL(url: any) {
    if (url) {
      const parts = url.split("/").filter((part: any) => part.trim() !== "");

      // Find the last non-empty part and remove any query parameters
      for (let i = parts.length - 1; i >= 0; i--) {
        const lastPart = parts[i].split("?")[0].replace(/-/g, " ");
        if (!/\d/.test(lastPart)) {
          return lastPart;
        }
      }

      // If no valid title is found, return 'No title found'
      return "-";
    }
  }

  const title = extractTitleFromURL(internalUrlPath) || "";

  return (
    <div className="card">
      <div className="row1">
        <img src="/images/minimize.png" alt="internal" width={24} height={24} />
        <div className="row-title">Internal</div>
      </div>
      <div className="row2" style={{ color: "#0add54" }}>
        {formatNumber(internalValue)}&nbsp;
        <span className="percentage">{internalPercentage}%</span>
      </div>
      <div className="row3">
        {internalUrlPath ? (
          <div>
            <a
              style={{ color: "#0add54", cursor: "pointer", fontSize: "12px" }}
              title={title}
              className="top-url-internal"
              href={internalUrlPath}
              target="_blank"
              rel="noreferrer"
            >
              {title}
            </a>{" "}
            <div className="top-title-heading">Top Internal</div>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
}

function DirectCard({ mediumDistribution }: any) {
  const directValue =
    mediumDistribution?.value?.Direct || mediumDistribution?.value?.Other || 0;
  const directPercentage = (
    mediumDistribution?.percentage?.Direct ||
    mediumDistribution?.percentage?.Other ||
    0
  ).toFixed(2);

  return (
    <div className="card">
      <div className="row1">
        <img src="/images/direct.png" alt="direct" width={24} height={24} />
        <div className="row-title">Direct</div>
      </div>
      <div className="row2" style={{ color: "#7f9386" }}>
        {formatNumber(directValue)}&nbsp;
        <span className="percentage">{directPercentage}%</span>
      </div>
      <div className="row3" style={{ color: "#7f9386" }}></div>
    </div>
  );
}

const DetailsCard = (props: any) => {
  const {
    title,
    current_percentage,
    average_percentage,
    description,
    subDescription,
    tooltipTitle,
  } = props;
  let betterFormattedDuration;
  let betterAverageFormattedDuration;
  if (title === "Time on Page") {
    const duration = moment.duration(current_percentage, "seconds");
    const averageDuration = moment.duration(average_percentage, "seconds");

    betterFormattedDuration = formatDuration(duration, "35px", "45px");
    betterAverageFormattedDuration = formatDuration(
      averageDuration,
      "10px",
      "14px"
    );
  }

  let currentvalue =
    title === "Time on Page"
      ? betterFormattedDuration
      : `${current_percentage}%`;
  let averageValue =
    title === "Time on Page"
      ? betterAverageFormattedDuration
      : `${average_percentage}%`;
  return (
    <div className="details-id-card-wrapper">
      <div className="details-id-card-content">
        <div className="id-card-title">
          <Tooltip title={tooltipTitle}>{title}</Tooltip>
        </div>
        <div className="id-card-current-percentage">{currentvalue}</div>
        <div className="id-card-divider"></div>
        <div className="id-card-average-value">{averageValue}</div>
        <div
          className="id-card-description"
          style={{ margin: title === "Time on Page" ? "6px 0" : "0 0 34px 0" }}
        >
          {description}
        </div>
        {title === "Time on Page" && (
          <div className="id-card-subDescription">{subDescription}</div>
        )}
      </div>
    </div>
  );
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

const BreakDownData = (props: any) => {
  const { columns, data, tableValue } = props;

  return (
    <div className="breakdown-data-wrapper">
      <div className="breakdown-value-content">
        <div>
          <StackedBarChart
            series={data}
            tooltipLabels={data?.map((item: any) => item?.value)}
            colors={generateColors(data?.length)}
            legend={false}
            height={80}
          />
        </div>
        <div style={{ padding: "0 30px" }}>
          <Table
            columns={columns}
            dataSource={tableValue}
            pagination={false}
            className="custom-table"
            scroll={{ y: 300 }}
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, tooltipText }: any) => (
  <div className="card">
    <div className="row1" style={{ justifyContent: "center" }}>
      <div className="row-title" style={{ marginLeft: "unset" }}>
        <Tooltip title={tooltipText}>{title}</Tooltip>
      </div>
    </div>
    <div
      className="row2"
      style={{
        color: "#7f56d9",
        display: "flex",
        marginTop: "10px",
        justifyContent: "center",
      }}
    >
      {title !== "View count" ? `${value} %` : value}
    </div>
  </div>
);

export default function ArticleDetails() {
  const [articleDetails, setArticleDetails]: any = useState([]);
  const [countryListLabel, setCountryListLabel] = useState([]);
  const [countryListValue, setCountryListValue] = useState([]);
  const [loader, setLoader] = useState(true);
  const [tableLoader, setTableLoader] = useState(false);
  const [segementValue, setSegementValue] = useState("");
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear]: any = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [articleChartData, setArticleChartData]: any = useState({});
  const [outerPageData, setOuterPageData] = useState([]);
  const [exitPageContent, setExitPageContent] = useState([]);
  const [selectedBreakdownValue, setSelectedBreakdownValue] = useState("");
  const [tableVistitorData, setTableVisitorData] = useState([]);
  const [scrollDepthData, setScrollDepthData] = useState([]);
  const [historicalChartResponse, setHistoricalChartResponse] = useState([]);
  const [barchartResponse, setBarChartResponse] = useState<BarChartResponse>({
    labels: [],
    series: [],
    name: "",
  });
  const [articleCurrentChartResponse, setArticleCurrentChartResponse] =
    useState([]);
  const [articleAverageChartResponse, setArticleAverageChartResponse] =
    useState([]);
  const [trafficSourceData, setTrafficSourceData]: any = useState([]);
  const [mediumDistribution, setMediumDistribution]: any = useState({});
  const [breakdownDataObject, setBreakDownDataObject]: any = useState({});
  const [headerData, setHeaderData]: any = useState([]);
  const [averageTrafficSource, setAverageTrafficSource]: any = useState({});
  const [siteAvg, setSiteAvg]: any = useState({});
  const [imageIndex, setImageIndex] = useState(0);
  const [searchTop, setSearchTop] = useState([]);
  const [internalTop, setInternalTop] = useState([]);
  const [socialTop, setSocialTop] = useState([]);
  const [referalTop, setReferalTop] = useState([]);
  const [selectedDistribution, setSelectedDistribution] =
    useState("city_distribution");
  const [dataArray, setDataArray]: any = useState([]);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { articleId, max_age }: any = useParams();
  const searchParams = useSearchParams();
  const queryParams = Object.fromEntries(searchParams);
  const article_id = decodeURIComponent(articleId);
  const { Option } = Select;

  const siteInfo: any = {
    id: 36,
    site_id: "wral.com",
    site_name: "Fabriq",
    host_name: "https://fabriq.com",
    collector_url: "wral.com/dt",
  };

  const timeInterval = 30 * 60 * 1000;
  //   const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(updateActiveTab("article"));
    const intervalId = setInterval(() => {
      getArticleDetails();
    }, timeInterval);

    getArticleDetails();
    setSegementValue("real-time");
    setSelectedChartValue("page_views");
    setSelectedBreakdownValue("social");

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [article_id]);

  useEffect(() => {
    if (articleCurrentChartResponse && articleAverageChartResponse) {
      realtimeChartDataFormat(selectedChartValue);
    }
  }, [articleCurrentChartResponse, articleAverageChartResponse]);

  useEffect(() => {
    if (trafficSourceData) {
      trafficSourceFormat();
    }
  }, [trafficSourceData]);

  const getArticleDetails = () => {
    getRealtimeData();
  };

  const getRealtimeData = () => {
    setTableLoader(true);

    // const currentSite =
    //   localStorage.getItem("view_id") !== "undefined" &&
    //   JSON.parse(localStorage.getItem("view_id")) || "";
    // let siteDetails = currentSite;

    // Format the date to "YYYY-MM-DD" format
    // const query_id = article_details_query_id;
    // const siteInfo = siteDetails?.site_id;

    const queryParamValue = queryParams?.max_age;
    const topPostvariables = {
      parameters: {
        site_id: `"${siteInfo?.site_id}"`,
        article_id: `"${21247272}"`,
      },
      max_age: queryParamValue || 0,
      id: 431,
    };

    axios
      .post("/api/query_results", { data: topPostvariables })
      .then((values) => {
        const { data } = values;
        if ("job" in data) {
          let jobData = getResultFromJob(data, topPostvariables);
          return jobData;
        }
        return data.query_result ? data.query_result : Promise.reject();
      })
      .then((result) => {
        const data = result?.data?.data;

        if (result?.data?.errors) {
          const errors = result?.data?.errors;
          throw errors;
        }

        if (data) {
          let chartRes = data?.ArticleHourlyAverage;
          setArticleAverageChartResponse(chartRes);
          setArticleDetails(data?.Article?.[0]);
          setHeaderData(data?.ArticleDaily?.[0]);
          setTrafficSourceData(data);
          setDataArray(data?.ArticleDaily);
          setAverageTrafficSource(data?.ArticleDailyAgg?.aggregate?.avg);
          setSiteAvg(data?.ArticleDailyListAgg?.[0]);
          setSearchTop(data?.Search);
          setInternalTop(data?.Internal);
          setSocialTop(data?.Social);
          setReferalTop(data?.Refferal);
          //   convertDistribution(data?.ArticleDaily, "city_distribution");
          let hours_view = data?.ArticleHourly;

          setExitPageContent(data?.ArticleExitDistributionDaily);
          setArticleCurrentChartResponse(hours_view);
          const scrollRes = data?.ArticleScrollDepthDaily?.[0];

          let scrollData: any = genreateScrollDepth(scrollRes) || [];

          setScrollDepthData(scrollData);
          setTableLoader(false);
          setLoader(false);
        }
      })
      .catch(() => {
        setTableLoader(false);
        setLoader(false);
        setIsError(true);
      });
  };


  let timeOnPage = 0;
  if (segementValue === "real-time") {
    timeOnPage = trafficSourceData?.ArticleDaily?.[0]?.total_time_spent || 0;
  } else if (segementValue === "monthly") {
    timeOnPage = trafficSourceData?.ArticleMonthly?.[0]?.total_time_spent || 0;
  } else if (segementValue === "yearly") {
    timeOnPage = trafficSourceData?.ArticleYearly?.[0]?.total_time_spent || 0;
  } else if (segementValue === "quarterly") {
    timeOnPage = trafficSourceData?.ArticleQuaterly?.[0]?.total_time_spent || 0;
  }

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
    const formattedLabels = labels.map((day: any) => {
      if (day <= daysInMonth) {
        return `${monthNames[currentMonth]} ${day}`;
      } else {
        return ""; // Empty string for days beyond the current month
      }
    });

    return formattedLabels;
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

  let articleTitle = articleDetails?.title;
  let articleCategory = articleDetails?.category;
  let articlePublished = articleDetails?.published_date;
  let articleAuthorName = articleDetails?.author;

  const handleClickBack = () => {
    router.push("/content/article");
  };

  const genreateScrollDepth = (scrollRes: any) => {
    if (scrollRes) {
      const crossedValues = Object.keys(scrollRes)
        .filter((key) => key.startsWith("crossed_"))
        .map((key) => scrollRes[key]);

      const totalCrossedSum = crossedValues.reduce(
        (sum, value) => sum + value,
        0
      );

      const percentages = [
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
      ];

      return percentages.map((percentage) => ({
        name: `Scroll Depth ${percentage}`,
        value: scrollRes?.[`crossed_${percentage}_users`],
        avg: scrollRes?.[`crossed_${percentage}_users`] / totalCrossedSum,
        percentage: `${percentage}%`,
      }));
    }
  };

  const handleChangeSegement = (e: any) => {
    let real_time_date = localStorage.getItem("real_time_date");
    setSegementValue(e.target.value);
    const currentDate = real_time_date ? new Date(real_time_date) : new Date();

    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setSelectedDistribution("city_distribution");
    setScrollDepthData([]);
    setSelectedBreakdownValue("social");
    setArticleChartData(null);
    setCountryListLabel([]);
    setCountryListValue([]);

    if (e.target.value === "monthly") {
      handleMonthChange(currentDate);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentDate);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentDate);
    } else {
      getRealtimeData();
    }
  };

  const handleMonthChange = (date: any) => {
    const year = date?.getFullYear();
    const month = date?.getMonth() + 1;

    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setCountryListLabel([]);
    setCountryListValue([]);
    setArticleChartData(null);

    setScrollDepthData([]);
    getMonthlyData(month, year);
    setSelectedMonth(date);
  };

  const handleDayChange = (date: any) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(date);

    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setCountryListLabel([]);
    setCountryListValue([]);
    setArticleChartData(null);

    setScrollDepthData([]);
    getRealtimeDataWithQuery(formattedDate);
  };

  

  const getRealtimeDataWithQuery = (date: any) => {
    setTableLoader(true);

    // const currentSite =
    //   localStorage.getItem("view_id") !== "undefined" &&
    //   JSON.parse(localStorage.getItem("view_id"));
    // let siteDetails = siteInfo;

    let period_date = date ? date : formationTimezone(moment(), "YYYY-MM-DD");
    const siteDetails = siteInfo?.site_id;
    axios
      .post("/api/article", {
        operation: "getArticleDetails",
        variables: {
          period_date,
          article_id: articleId,
          site_id: siteDetails,
        },
      })
      .then((result) => {
        const data = result?.data?.data;

        if (result?.data?.errors) {
          const errors = result?.data?.errors;
          throw errors;
        }

        if (data) {
          let chartRes = data?.ArticleHourlyAverage;
          setArticleAverageChartResponse(chartRes);
          setArticleDetails(data?.Article?.[0]);
          setHeaderData(data?.ArticleDaily?.[0]);
          setTrafficSourceData(data);
          setDataArray(data?.ArticleDaily);
          setAverageTrafficSource(data?.ArticleDailyAgg?.aggregate?.avg);
          setSiteAvg(data?.ArticleDailyListAgg?.[0]);
          setSearchTop(data?.Search);
          setInternalTop(data?.Internal);
          setSocialTop(data?.Social);
          setReferalTop(data?.Refferal);
          convertDistribution(data?.ArticleDaily, "city_distribution");
          let hours_view = data?.ArticleHourly;

          setExitPageContent(data?.ArticleExitDistributionDaily);
          setArticleCurrentChartResponse(hours_view);
          const scrollRes = data?.ArticleScrollDepthDaily?.[0];

          let scrollData: any = genreateScrollDepth(scrollRes) || [];

          setScrollDepthData(scrollData);
          setTableLoader(false);
          setLoader(false);
        }
      })
      .catch(() => {
        setTableLoader(false);
        setLoader(false);
        setIsError(true);
      });
  };

  const getMonthlyData = (value: any, year: any) => {
    setTableLoader(true);
    setIsError(false);
    const partial_period_date = `${year}-${value
      ?.toString()
      .padStart(2, "0")}%`;
    axios
      .post("/api/article", {
        operation: "getArticleMonthlyDetails",
        variables: {
          site_id: siteInfo?.site_id,
          article_id,
          period_month: parseInt(value),
          period_year: year,
          partial_period_date,
        },
      })
      .then((res) => {
        const data = res?.data?.data?.ArticleMonthly;
        if (data) {
          setDataArray(data);
          setHistoricalChartResponse(res?.data?.data);
          setTrafficSourceData(res?.data?.data);
          setAverageTrafficSource(
            res?.data?.data?.ArticleMonthlyAgg?.aggregate?.avg
          );
          setSiteAvg(res?.data?.data?.ArticleMonthlyListAgg?.[0]);
          setHeaderData(data?.[0]);
          generateDataMonthly(res?.data?.data);
          convertDistribution(data, "city_distribution");
          setExitPageContent(res?.data?.data?.ArticleExitDistributionMonthly);
          setSearchTop(res?.data?.data?.Search);
          setInternalTop(res?.data?.data?.Internal);
          setSocialTop(res?.data?.data?.Social);
          setReferalTop(res?.data?.data?.Refferal);

          // scroll depth data
          const scrollRes = res?.data?.data?.ArticleScrollDepthMonthly?.[0];

          let scrollData: any = genreateScrollDepth(scrollRes) || [];

          setScrollDepthData(scrollData);
          setTableLoader(false);
        } else {
          setTableLoader(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setTableLoader(false);
        setIsError(true);
      });
  };

  const getYearlyData = (value: any) => {
    setIsError(false);
    setTableLoader(true);
    axios
      .post("/api/article", {
        operation: "getArticleYearlyDetails",
        variables: {
          site_id: siteInfo?.site_id,
          article_id,
          period_year: value,
          site_avg_period_year: value,
        },
      })
      // ArticleQuery.getYearlyData(siteDetails?.site_id, articleId, parseInt(value))
      .then((res) => {
        const data = res?.data?.data?.ArticleYearly;
        if (data) {
          setDataArray(data);
          setHistoricalChartResponse(res?.data?.data);
          setTrafficSourceData(res?.data?.data);
          setAverageTrafficSource(
            res?.data?.data?.ArticleYearlyAgg?.aggregate?.avg
          );
          setSiteAvg(res?.data?.data?.ArticleYearlyListAgg?.[0]);
          setHeaderData(data?.[0]);
          setSearchTop(res?.data?.data?.Search);
          setInternalTop(res?.data?.data?.Internal);
          setSocialTop(res?.data?.data?.Social);
          setReferalTop(res?.data?.data?.Refferal);
          generateDataForYearChart(res?.data?.data, parseInt(value));
          convertDistribution(data, "city_distribution");
          setExitPageContent(res?.data?.data?.ArticleExitDistributionYearly);

          // scroll depth data
          const scrollRes = res?.data?.data?.ArticleScrollDepthYearly?.[0];
          let scrollData: any = genreateScrollDepth(scrollRes) || [];

          setScrollDepthData(scrollData);

          setTableLoader(false);
        } else {
          setTableLoader(false);
          setIsError(true);
        }
      })
      .catch(() => {
        setTableLoader(false);
        setIsError(true);
      });
  };

  const handleYearChange = (date: any) => {
    const year = date?.getFullYear();
    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setCountryListLabel([]);
    setCountryListValue([]);
    setArticleChartData(null);

    setScrollDepthData([]);
    getYearlyData(year);
    setSelectedYear(date);
  };

  const handleQuarterlyChange = (date: any) => {
    setBarChartResponse((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));
    setCountryListLabel([]);
    setCountryListValue([]);
    setArticleChartData(null);
    setScrollDepthData([]);

    const year = date?.getFullYear();
    const quarter = getQuarterFromDate(date);

    getQuarterlyData(quarter, year);
    setSelectedQuarter(date);
  };

  const getQuarterlyData = (value: any, year: any) => {
    setIsError(false);
    setTableLoader(true);
    const currentQuarterMonths = getQuarterMonths(value);
    axios
      .post("/api/article", {
        operation: "getArticleQuarterlyDetails",
        variables: {
          site_id: siteInfo?.site_id,
          article_id,
          period_quarter: parseInt(value),
          period_year: year,
          period_month: currentQuarterMonths,
        },
      })
      .then((res: any) => {
        const data = res?.data?.data?.ArticleQuaterly;
        if (data) {
          setDataArray(data);
          setHistoricalChartResponse(res?.data?.data);
          setTrafficSourceData(res?.data?.data);
          setAverageTrafficSource(
            res?.data?.data?.ArticleQuaterlyAgg?.aggregate?.avg
          );
          setSiteAvg(res?.data?.data?.ArticleQuarterlyListAgg?.[0]);
          setHeaderData(data?.[0]);
          setSearchTop(res?.data?.data?.Search);
          setInternalTop(res?.data?.data?.Internal);
          setSocialTop(res?.data?.data?.Social);
          setReferalTop(res?.data?.data?.Refferal);
          generateDataForQuarterChart(res?.data?.data, value);
          convertDistribution(data, "city_distribution");
          setExitPageContent(res?.data?.data?.ArticleExitDistributionQuaterly);

          const scrollRes = res?.data?.data?.ArticleScrollDepthQuaterly?.[0];
          let scrollData: any = genreateScrollDepth(scrollRes) || [];

          setScrollDepthData(scrollData);
          setTableLoader(false);
        } else {
          setIsError(true);
          setTableLoader(false);
        }
      })
      .catch(() => {
        setTableLoader(false);
        setIsError(true);
      });
  };

  const trafficSourceFormat = () => {
    let trafficSourceInfo = [];
    let data = {};
    let data_Social = {};
    let data_Device = {};
    let totalUsers = 0;
    let newUsersPercentage = 0;
    let usersPercentage = 0;

    const segmentData: any = {
      "real-time": trafficSourceData?.ArticleDaily?.[0],
      monthly: trafficSourceData?.ArticleMonthly?.[0],
      yearly: trafficSourceData?.ArticleYearly?.[0],
      quarterly: trafficSourceData?.ArticleQuaterly?.[0],
    };

    const segment: any = segmentData[segementValue];

    if (segment) {
      trafficSourceInfo = segment;
      data = segment?.referrer_distribution
        ? JSON.parse(segment.referrer_distribution)
        : null;
      data_Social = segment?.social_distribution
        ? JSON.parse(segment.social_distribution)
        : null;
      data_Device = segment?.device_distribution
        ? JSON.parse(segment.device_distribution)
        : null;

      totalUsers = segment?.users + segment?.new_users;
      newUsersPercentage = (segment?.new_users / totalUsers) * 100;
      usersPercentage = ((totalUsers - segment?.new_users) / totalUsers) * 100;
    }

    const arr: any = [];
    if (trafficSourceInfo && Object.keys(trafficSourceInfo)?.length > 0) {
      const totalSum: any =
        data &&
        Object.keys(data).length > 0 &&
        Object.values(data).reduce((acc: any, val: any) => acc + val, 0);

      const totalSumSocial: any =
        data_Social &&
        Object.keys(data_Social).length > 0 &&
        Object.values(data_Social).reduce((acc: any, val: any) => acc + val, 0);

      const totalSumDevice: any =
        data_Device &&
        Object.keys(data_Device).length > 0 &&
        Object.values(data_Device).reduce((acc: any, val: any) => acc + val, 0);

      // Calculate percentage for each category
      const percentageData: any = {};

      const percentageSocial: any = {};
      const arrSocial: any = [];
      const percentageDevice: any = {};
      const arrDevice: any = [];
      if (data && Object.keys(data)?.length > 0) {
        for (const [category, value] of Object.entries(data)) {
          percentageData[category] = (value / totalSum) * 100;
        }
      }

      if (data_Social && Object.keys(data_Social).length > 0) {
        for (const [category, value] of Object.entries(data_Social)) {
          if (!percentageSocial[category]) {
            percentageSocial[category] = {};
          }
          percentageSocial[category].data = (value / totalSumSocial) * 100;
          percentageSocial[category].value = value;
        }
      }

      if (data_Device && Object.keys(data_Device).length > 0) {
        for (const [category, value] of Object.entries(data_Device)) {
          if (!percentageDevice[category]) {
            percentageDevice[category] = {};
          }
          percentageDevice[category].data = (value / totalSumDevice) * 100;
          percentageDevice[category].value = value;
        }
      }

      if (percentageData && Object.keys(percentageData)?.length > 0) {
        let newChartFormatData: any = {
          Social: percentageData["Social"]
            ? percentageData["Social"]
            : percentageData["social"],
          Referral: percentageData["Referral"]
            ? percentageData["Referral"]
            : percentageData["unknown"],
          Search: percentageData["search"],
          Internal: percentageData["Internal"]
            ? percentageData["Internal"]
            : percentageData["internal"],
          Direct: percentageData["Direct"]
            ? percentageData["Direct"]
            : percentageData["Other"],
        };

        for (const key in newChartFormatData) {
          arr.push({ name: key, data: [newChartFormatData[key] || 0] });
        }
      }

      if (percentageSocial && Object.keys(percentageSocial).length > 0) {
        for (const key in percentageSocial) {
          arrSocial.push({
            name: key,
            data: [percentageSocial[key]?.data],
            value: [percentageSocial[key]?.value],
          });
          arrSocial.sort((a: any, b: any) => b?.data[0] - a?.data[0]);
        }
      }

      if (percentageDevice && Object.keys(percentageDevice).length > 0) {
        for (const key in percentageDevice) {
          arrDevice.push({
            name: key,
            data: [percentageDevice[key]?.data],
            value: [percentageDevice[key]?.value],
          });
          arrDevice.sort((a: any, b: any) => b?.data[0] - a?.data[0]);
        }
      }

      let mediumDataFormat = {
        value: data,
        percentage: percentageData,
      };

      const total = segment?.users + segment?.new_users;

      let breakdownTempValue = {
        social: arrSocial,
        device: arrDevice,
        visitor: [
          {
            name: "New visitor",
            data: [newUsersPercentage],
            value: [segment?.new_users],
          },
          {
            name: "Returning Visitor",
            data: [usersPercentage],
            value: [total - segment?.new_users],
          },
        ],
      };

      const tableData = breakdownTempValue.social.map((item: any) => {
        return {
          key: item.name,
          name: item.name,
          data: item.data[0],
        };
      });

      setTableVisitorData(tableData);
      setOuterPageData(arr);
      setMediumDistribution(mediumDataFormat);
      setBreakDownDataObject(breakdownTempValue);
    } else {
      let mediumDataFormat = {
        value: data,
        percentage: [],
      };

      let breakdownTempValue = {
        social: [],
        device: [],
        visitor: [],
      };

      const tableData: any = breakdownTempValue?.social?.map((item: any) => {
        return {
          key: item?.name,
          name: item?.name,
          data: item?.data?.[0],
        };
      });

      setTableVisitorData(tableData);
      setOuterPageData(arr);
      setMediumDistribution(mediumDataFormat);
      setBreakDownDataObject(breakdownTempValue);
    }
  };

  const realtimeChartDataFormat = (value: any) => {
    if (articleCurrentChartResponse && articleAverageChartResponse) {
      const lableValue = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData: any = articleCurrentChartResponse.find(
          (obj: any) => (obj?.hour + 1 === 24 ? 0 : obj?.hour + 1) === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData: any = articleCurrentChartResponse.find(
          (obj: any) => (obj?.hour + 1 === 24 ? 0 : obj?.hour + 1) === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      if (currentPageViewsValues.length > 0) {
        let chartSeriesFormat = {
          series: [
            {
              name: "Today",
              data:
                value === "page_views"
                  ? currentPageViewsValues
                  : currentUserValues,
            },
          ],
          label: lableValue,
        };

        setArticleChartData(chartSeriesFormat);
      }
    }
  };

  const generateLineChartData = (chartData: any) => {
    const labels = chartData.map((data: any) =>
      moment(data?.period_date).format("MMM DD")
    );

    return labels;
  };

  const generateDataMonthly = (data: any, val?: any) => {
    const chartData = data?.ArticleDaily;
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

    let chartSeriesFormat = {
      series: [],
      label: labels,
    };

    switch (chartOption) {
      case "users":
        chartSeriesFormat.series = [getSeriesConfig("Readers", "users")];
        break;
      default:
        chartSeriesFormat.series = [
          getSeriesConfig("Page Views", "page_views"),
        ];
    }

    setArticleChartData(chartSeriesFormat);
  };

  const generateDataForYearChart = (data: any, year?: any, value?: any) => {
    const list = data?.ArticleMonthly;
    if (list?.length > 0) {
      const labels = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return month;
      });

      let selectedItem = "";
      if (value) {
        selectedItem = value;
      } else {
        selectedItem = selectedChartValue;
      }

      const outputArray = labels?.map((label: any) => {
        const day = parseInt(label);
        const dataItem = list.find(
          (item: any) =>
            item?.period_year === year && item?.period_month === day
        );

        return [
          day,
          dataItem
            ? selectedItem === "page_views"
              ? dataItem?.page_views
              : dataItem?.users
            : 0,
        ];
      });

      let series = [
        {
          name: selectedItem === "page_views" ? "Page Views" : "Users",
          data: outputArray,
        },
      ];

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
      const yValues = series?.[0]?.data?.map((entry) => entry?.[1]);
      const monthLabels = labels?.map((number) => monthNames[number - 1]);
      setBarChartResponse((prevState) => ({
        ...prevState,
        labels: monthLabels,
        series: yValues,
        name: selectedItem === "page_views" ? "Page Views" : "Users",
      }));
    }
  };

  const convertDistribution = (data: any, selectedItem: any) => {
    if (data?.length > 0 && selectedItem === "city_distribution") {
      let dataObj = data?.[0]?.city_distribution;

      if (typeof dataObj === "string") {
        dataObj = JSON.parse(dataObj);
      }

      if (dataObj) {
        let districtData = dataObj?.["US"];

        if (districtData) {
          const districtKeysArray = Object.keys(districtData);
          const districtValuesArray: any = Object.values(districtData);

          // Sort the districts in descending order based on the values
          const sortedIndices = districtValuesArray
            .map((_, index: any) => index)
            .sort(
              (a: any, b: any) =>
                districtValuesArray[b] - districtValuesArray[a]
            );

          const sortedDistrictKeys = sortedIndices.map(
            (index: any) => districtKeysArray[index]
          );
          const sortedDistrictValues = sortedIndices.map(
            (index: any) => districtValuesArray[index]
          );
          setCountryListLabel(sortedDistrictKeys);
          setCountryListValue(sortedDistrictValues);
        } else {
          setCountryListLabel([]);
          setCountryListValue([]);
        }
      } else {
        setCountryListLabel([]);
        setCountryListValue([]);
      }
    }
  };

  const chartData = (data: any, country_distribution_data: any) => {
    let dataValue = country_distribution_data;

    if (typeof dataValue === "string") {
      dataValue = JSON.parse(dataValue);
    }

    if (dataValue) {
      const arr = Object.entries(dataValue);

      // Sort the array in descending order based on the values
      arr.sort((a: any, b: any) => b[1] - a[1]);

      // Convert the sorted array back into an object
      const sortedObj = Object.fromEntries(arr);
      const countryKeysArray: any = [];
      Object.keys(sortedObj).forEach((key) => {
        countryKeysArray.push(key);
      });

      let objValue: any = Object.values(sortedObj);

      // Select top 15 items
      countryKeysArray.splice(15);
      objValue.splice(15);

      setCountryListLabel(countryKeysArray);
      setCountryListValue(objValue);
    } else {
      setCountryListLabel([]);
      setCountryListValue([]);
    }
  };

  const columnsVisitor = [
    {
      title: "Visitor",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Percentage",
      dataIndex: "data",
      key: "data",
      render: (text: any) => <div>{`${text.toFixed(2)} %`}</div>,
    },
  ];

  const handleChangeDistribution = (value: any) => {
    setSelectedDistribution(value);

    if (value === "city_distribution") {
      convertDistribution(dataArray, value);
    } else {
      chartData(dataArray, dataArray?.[0]?.country_distribution);
    }
  };

  const generateDataForQuarterChart = (
    data: any,
    quarter?: any,
    value?: any
  ) => {
    const list = data?.ArticleMonthly;
    if (list?.length > 0) {
      const labels = Array.from({ length: 3 }, (_, i) => {
        const startMonth = (quarter - 1) * 3 + 1;
        const month = startMonth + i;
        return month;
      });

      let selectedItem = "";
      if (value) {
        selectedItem = value;
      } else {
        selectedItem = selectedChartValue;
      }

      const outputArray = labels?.map((label: any) => {
        const day = parseInt(label);
        const dataItem = list?.find((item: any) => item?.period_month === day);

        return [
          day,
          dataItem
            ? selectedItem === "page_views"
              ? dataItem.page_views
              : dataItem.users
            : 0,
        ];
      });

      let series = [
        {
          name: selectedItem === "page_views" ? "Page Views" : "Users",
          data: outputArray,
        },
      ];

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
      const yValues = series?.[0]?.data?.map((entry) => entry?.[1]);
      const monthLabels = labels?.map((number) => monthNames[number - 1]);
      setBarChartResponse((prevState: any) => ({
        ...prevState,
        labels: monthLabels,
        series: yValues,
        name: selectedItem === "page_views" ? "Page Views" : "Users",
      }));
    }
  };

  const handleChangeChart = (value: any) => {
    setSelectedChartValue(value);

    if (segementValue === "monthly") {
      generateDataMonthly(historicalChartResponse, value);
    } else if (segementValue === "yearly") {
      const year = selectedYear?.getFullYear();
      generateDataForYearChart(historicalChartResponse, year, value);
    } else if (segementValue === "quarterly") {
      const quarter = getQuarterFromDate(selectedQuarter);
      generateDataForQuarterChart(historicalChartResponse, quarter, value);
    } else {
      realtimeChartDataFormat(value);
    }
  };

  const timeLabels = articleChartData?.label?.map((item: any) => {
    const formattedTime = moment(selectedDate)
      .hour(item)
      .minute(0)
      .format("MMM D, h:mm a");
    return formattedTime;
  });

  let siteLink = siteInfo?.host_name;

  const allValuesNull = scrollDepthData?.every(
    (entry: any) => entry?.value === null
  );

  const handleChangeBreakdownSegment = (e: any) => {
    setSelectedBreakdownValue(e.target.value);
    const tableData = breakdownDataObject[e.target.value].map((item: any) => {
      return {
        key: item.name,
        name: item.name,
        data: item.data[0],
      };
    });
    setTableVisitorData(tableData);
  };

  const data = [
    {
      title: "View count",
      value: formatNumber(headerData?.valid_play_views) || 0,
      tooltip: "Total number of times videos have been viewed.",
    },
    {
      title: "Play rate",
      value: headerData?.avg_playback_rate?.toFixed(2) || 0,
      tooltip:
        "Percentage of users who play a video out of those who have viewed the video thumbnail.",
    },
    {
      title: "Engagement rate",
      value: headerData?.avg_percent_played?.toFixed(2) || 0,
      tooltip: "Rate at which users interact with content on the website.",
    },
    {
      title: "Audience retention",
      value: headerData?.avg_retention_rate?.toFixed(2) || 0,
      tooltip:
        "Percentage of the audience that continues to engage with the website over time.",
    },
  ];

  const currentDate =
    localStorage.getItem("real_time_date") ||
    formationTimezone(moment(), "YYYY-MM-DD");

  return (
    <Layout>
      <div className="article-wrapper">
        <div className="article-content">
          <div style={{ display: "flex", marginTop: 25 }}>
            <div className="back-image" onClick={handleClickBack}>
              <ArrowLeftOutlined
                style={{ cursor: "pointer" }}
                onClick={handleClickBack}
              />
            </div>
            <div className="article-segement-wrapper">
              <Radio.Group
                onChange={handleChangeSegement}
                value={segementValue}
                disabled={loader || tableLoader}
              >
                <Radio.Button value="real-time">Real-Time</Radio.Button>
                <Radio.Button
                  value="monthly"
                  disabled={articlePublished?.includes(currentDate)}
                >
                  Month
                </Radio.Button>
                <Radio.Button
                  value="quarterly"
                  disabled={articlePublished?.includes(currentDate)}
                >
                  Quarter
                </Radio.Button>
                <Radio.Button
                  value="yearly"
                  disabled={articlePublished?.includes(currentDate)}
                >
                  Year
                </Radio.Button>
              </Radio.Group>
            </div>
            {segementValue === "real-time" && (
              <div className="article-datepicker">
                <DatePicker
                  value={selectedDate}
                  showDatePicker
                  onChange={handleDayChange}
                />
              </div>
            )}
            {segementValue === "monthly" && (
              <div className="article-datepicker">
                <DatePicker
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  showMonthYearPicker
                  dateFormat="yyyy-MM"
                />
              </div>
            )}
            {segementValue === "quarterly" && (
              <div className="article-datepicker">
                <DatePicker
                  value={selectedQuarter}
                  onChange={handleQuarterlyChange}
                  showQuarterYearPicker
                  dateFormat="yyyy-QQQ"
                />
              </div>
            )}
            {segementValue === "yearly" && (
              <div className="article-datepicker">
                <DatePicker
                  value={selectedYear}
                  onChange={handleYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                />
              </div>
            )}
          </div>
          {loader ? (
            <div className="loader-cotainer">
              <div className="loader"></div>
            </div>
          ) : isError ? (
            <div className="article-error-result">
              {" "}
              <ErrorResult />
            </div>
          ) : (
            <>
              <div className="article-heading">
                <div className="article-heading-row">
                  <div className="heading-row-category">
                    <Category
                      id={articleId}
                      view="article"
                      data={headerData}
                      imageIndex={imageIndex}
                      title={articleTitle}
                      published={articlePublished}
                      category={articleCategory}
                      articleAuthorName={articleAuthorName}
                      loader={tableLoader}
                      siteLink={siteInfo?.host_name}
                    />
                  </div>
                  <div className="flex" style={{ justifyContent: "flex-end" }}>
                    <div className="article-id-chart-header">
                      <div className="article-id-chart-select">
                        <Select
                          onChange={handleChangeChart}
                          value={selectedChartValue}
                          getPopupContainer={(triggerNode) =>
                            triggerNode?.parentNode || document.body
                          }
                        >
                          <Option value="page_views">Page Views</Option>
                          <Option value="users">Readers</Option>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {tableLoader ? (
                <>
                  <div className="loader-cotainer">
                    <div className="loader"></div>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  <div className="article-id-chart">
                    <div
                      style={{ marginTop: "50px" }}
                      className="article-id-content"
                    >
                      {segementValue === "real-time" ||
                      segementValue === "monthly" ? (
                        <LineChart
                          labels={
                            segementValue === "monthly"
                              ? articleChartData?.label
                              : timeLabels
                          }
                          selectedDate={selectedDate}
                          isArticle
                          series={articleChartData?.series}
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
                  <div className="article-country-content">
                    <div className="article-country-heading">
                      Where is this being read?
                    </div>
                    <div
                      className="flex"
                      style={{
                        justifyContent: "flex-end",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      <div className="author-id-chart-header">
                        <div
                          className="author-id-chart-select"
                          style={{ marginRight: 10 }}
                        >
                          <Select
                            onChange={handleChangeDistribution}
                            value={selectedDistribution}
                            getPopupContainer={(triggerNode) =>
                              triggerNode?.parentNode || document.body
                            }
                          >
                            <Option value="country_distribution">
                              Country Distribution
                            </Option>
                            <Option value="city_distribution">
                              City Distribution
                            </Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="article-country-chart">
                      <BarChart
                        labels={countryListLabel || []}
                        series={countryListValue || []}
                        name="Readers"
                        colors={["#7F56D9"]}
                        tickAmount={false}
                      />
                    </div>
                  </div>
                  <div className="article-id-details-card-warpper">
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <DetailsCard
                          title="Readability"
                          current_percentage={
                            headerData?.readability?.toFixed(2) || 0
                          }
                          average_percentage={
                            siteAvg?.readability?.toFixed(2) || 0
                          }
                          description="Site average"
                          tooltipTitle="The level of complexity of the text, its familiarity, legibility and typography all feed into how readable your content is."
                        />
                      </Col>
                      <Col span={8}>
                        <DetailsCard
                          title="Recirculation"
                          current_percentage={
                            headerData?.recirculation?.toFixed(2) || 0
                          }
                          average_percentage={
                            siteAvg?.recirculation?.toFixed(2) || 0
                          }
                          description="Site average"
                          tooltipTitle="Percentage of users who visit another page on the site after the initial page."
                        />
                      </Col>
                      <Col span={8}>
                        <DetailsCard
                          title="Time on Page"
                          current_percentage={timeOnPage}
                          average_percentage={
                            averageTrafficSource?.total_time_spent
                          }
                          description="Time to read the article through"
                          subDescription="Average time displayed for all types of devices"
                          tooltipTitle="Amount of time a user spends on a specific page."
                        />
                      </Col>
                    </Row>
                  </div>
                  {headerData?.valid_play_views ? (
                    <div className="article-video-data-wrapper">
                      <div className="article-referrers-heading">
                        Video Analytics
                      </div>
                      <div className="article-other-data-content">
                        <Row justify="space-between">
                          {data?.map((item: any, index: any) => (
                            <Col span={4} key={index}>
                              <Card
                                title={item.title}
                                value={item.value}
                                tooltipText={item?.tooltip}
                              />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </div>
                  ) : null}
                  <div className="article-other-data-wrapper">
                    <div className="article-referrers-heading">Referrers</div>
                    <div className="article-other-stacked-content">
                      <StackedBarChart
                        series={outerPageData}
                        colors={[
                          "#172a95",
                          "#f8b633",
                          "#e63111",
                          "#0add54",
                          "#7f9386",
                        ]}
                        max={100}
                        legend={false}
                        height={80}
                      />
                    </div>
                    <div className="article-other-data-content">
                      <Row justify="space-between">
                        <Col span={4}>
                          <SocialCard
                            mediumDistribution={mediumDistribution}
                            socialTop={socialTop}
                          />
                        </Col>
                        <Col span={4}>
                          <ReferralCard
                            mediumDistribution={mediumDistribution}
                            referalTop={referalTop}
                          />
                        </Col>
                        <Col span={4}>
                          <SearchCard
                            mediumDistribution={mediumDistribution}
                            searchTop={searchTop}
                          />
                        </Col>
                        <Col span={4}>
                          <InternalCard
                            mediumDistribution={mediumDistribution}
                            internalTop={internalTop}
                            siteLink={siteLink}
                          />
                        </Col>
                        <Col span={4}>
                          <DirectCard mediumDistribution={mediumDistribution} />
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="article-reading-depth-content">
                    <div className="article-funnel-chart">
                      <div className="article-scroll-heading">Scroll Depth</div>
                      {allValuesNull ||
                      !scrollDepthData ||
                      scrollDepthData?.length === 0 ? (
                        <Empty description="We don’t have enough data generated to show meaningful insight here" />
                      ) : (
                        //   <div>Fuunel</div>
                        <FunnelRechart data={scrollDepthData} />
                      )}
                    </div>
                    <div className="article-reading-chart">
                      <div className="article-exit-heading">
                        Where readers go next?
                      </div>
                      <div className="exit-page-wrapper">
                        {exitPageContent?.length > 0 ? (
                          exitPageContent?.map((item: any) => {
                            const totalRecirculation = exitPageContent.reduce(
                              (total, item: any) =>
                                total + item.recirculation_count,
                              0
                            );

                            const percentage =
                              (item?.recirculation_count / totalRecirculation) *
                              100;
                            return (
                              <div className="exit-page-content">
                                <div className="exit-click-count">
                                  <Tooltip
                                    title={`${percentage?.toFixed(
                                      2
                                    )}% of the these readers went to this article`}
                                  >
                                    {percentage?.toFixed(2)}%
                                  </Tooltip>
                                  {/* <Icon
                                  type="paper-clip"
                                  style={{ color: "#69bdfa", marginLeft: 10 }}
                                /> */}
                                </div>
                                <a
                                  className="exit-page-title"
                                  href={`/content/article/${item?.next_page_article_id}`}
                                >
                                  {item?.article?.title}
                                </a>
                              </div>
                            );
                          })
                        ) : (
                          <Empty />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="article-breakdown-wrapper">
                    <div className="article-breakdown-content">
                      <div className="article-breakdown-button">
                        <Radio.Group
                          buttonStyle="solid"
                          size="large"
                          onChange={handleChangeBreakdownSegment}
                          value={selectedBreakdownValue}
                        >
                          <Radio.Button value="social">
                            Social Breakdown
                          </Radio.Button>
                          <Radio.Button value="device">
                            Device Breakdown
                          </Radio.Button>
                          <Radio.Button value="visitor">
                            Visitor Breakdown
                          </Radio.Button>
                        </Radio.Group>
                      </div>
                      <div className="article-breakdown-data-content">
                        <div className="article-breakdown-title">
                          {`${selectedBreakdownValue} Breakdown`}
                        </div>
                        {Object.keys(breakdownDataObject).length > 0 && (
                          <div className="article-breakdown-data-value">
                            <BreakDownData
                              data={breakdownDataObject[selectedBreakdownValue]}
                              columns={columnsVisitor}
                              tableValue={tableVistitorData}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
