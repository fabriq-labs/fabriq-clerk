"use client";

// Overview Page
import React, { useState, useEffect } from "react";
import axios from "axios";
import isEqual from "react-fast-compare";
import Image from "next/image";
import {
  Table,
  Select,
  Tabs,
  Tooltip,
  Row,
  Col,
  Empty,
  Tag,
  notification,
} from "antd";
import moment from "moment";
import GaugeChart from "react-gauge-chart";

import { Label } from "@/components/ui/label";
import Layout from "@components/layout";
import Barchart from "@/components/chart/barchart";
import LineChart from "@/components/chart/linechart";
import LineChartTiny from "@/components/chart/linechart_tiny";

// images
import WebLogo from "../../assets/web.png";
import ReadingLogo from "../../assets/reading.png";
import NewspaperLogo from "../../assets/newspaper.png";
import ReuseLogo from "../../assets/reuse.png";
import LeftClick from "../../assets/left-click.png";
import DownArrowLogo from "../../assets/down-arrow_new.png";
import UpArrowLogo from "../../assets/up-arrow_new.png";
import WorldwideLogo from "../../assets/worldwide.png";
import DownArrow from "../../assets/down-arrow_nw.png";
import UpArrow from "../../assets/up-arrow.png";
import Referral from "../../assets/referral_new.png";
import OpenLink from "../../assets/open-link.webp";

// utils
import {
  formatNumber as format,
  columnForGeography,
  formationTimezone,
  mapArticleData,
  seriesData,
  dummylabels,
  mapAuthorData,
  mapCategoryData,
} from "@utils/helper";

// Format Number
function formatNumber(value: any) {
  if (value >= 1000000) {
    return (
      <div className="count-view-overview">
        <span>{(value / 1000000).toFixed(2)}</span>
        <span className="count-prefix-overview">m</span>
      </div>
    );
  } else if (value >= 1000) {
    return (
      <div className="count-view-overview">
        <span>{(value / 1000).toFixed(2)}</span>
        <span className="count-prefix-overview">k</span>
      </div>
    );
  } else {
    return (
      <div className="count-view-overview">
        <span>{value?.toString()}</span>
      </div>
    );
  }
}

const CenteredChart = ({ children }: any) => {
  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return <div style={wrapperStyle}>{children}</div>;
};

const Chart = ({ id, value, maxValue }: any) => {
  const percent = value === 0 ? 0 : value > maxValue ? 1 : value / maxValue;
  const formattedText = format(value) || "";
  const chartStyle = {
    height: 150,
  };

  return (
    <CenteredChart>
      <GaugeChart
        id={id}
        nrOfLevels={1}
        style={chartStyle}
        colors={["#1f57a4"]}
        arcWidth={0.2}
        percent={percent}
        textColor={"#7f56d9"}
        formatTextValue={() => formattedText}
        needleColor="#d6dede"
        needleBaseColor="#d6dede"
      />
    </CenteredChart>
  );
};

const ArticleChartContainer = React.memo(
  ({ id, seriobj, chartLoader }: any) => {
    const currentMonth = moment().format("MMM D");

    const updatedLabels = seriobj?.[id]?.labels.map(
      (label: any) => `${currentMonth}, ${label}`
    );

    const finalData = updatedLabels?.map((label: any, index: any) => ({
      name: label,
      pageViews: seriobj?.[id]?.series?.[0]?.data?.[index] || 0,
    }));

    return (
      <div style={{ width: "100%", height: "100px" }}>
        <LineChartTiny
          data={finalData}
          dataKey={"pageViews"}
          chartLoader={chartLoader}
          updatedLabels={updatedLabels}
        />
      </div>
    );
  },
  isEqual
);

const AuthorChartContainer = React.memo(({ id, seriobj }: any) => {
  const finalData = seriobj?.[id]?.labels?.map((label: any, index: any) => ({
    name: label,
    pageViews: seriobj?.[id]?.series?.[0]?.data?.[index] || 0,
  }));

  return (
    <div style={{ width: "100%", height: "100px" }}>
      <LineChartTiny
        data={finalData || seriesData}
        dataKey={"pageViews"}
        updatedLabels={seriobj?.[id]?.labels || dummylabels}
      />
    </div>
  );
}, isEqual);

// Table content
const ArticleTableCard = (props: any) => {
  const { dataSource, articleSeries, handleClickTitle, siteLink, chartLoader } =
    props;
  return (
    <div className="article-table-card-wrapper">
      <div className="article-table-header">
        <Row gutter={[16, 16]} className="table-card-row">
          <Col
            className="table-heading"
            span={6}
            style={{ paddingLeft: "40px" }}
          >
            <Tooltip title="Name of the article.">Article</Tooltip>
          </Col>
          <Col className="text-center table-heading" span={3}>
            <Tooltip title="Number of views on the article in the last 24 hours.">
              Page Views: 24 Hours
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Individuals who read this article today.">
              Readers
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Number of views on the article today.">
              Page Views
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Percentage of users who visit another page on the site, after reading this article.">
              Recirculation (%)
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Measure of how far down readers scroll on this article page.">
              Scroll Depth (%)
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Revenue generated from advertisements on this article page.">
              Ad Revenue
            </Tooltip>
          </Col>
        </Row>
      </div>
      <div className="body-content">
        {dataSource?.length > 0 ? (
          dataSource.map((record: any, index: any) => (
            <div className="article-table-body">
              <Row gutter={[16, 16]} className="table-card-row">
                <Col span={6}>
                  <div style={{ display: "flex" }}>
                    <span
                      style={{
                        marginRight: "15px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#737a73",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </span>
                    <div className="column-container">
                      <div
                        className="column-title"
                        style={{ cursor: "pointer" }}
                      >
                        {/* <Link
                          href={`/content/article/${record?.id}?max_age=-1`}
                          className="overview-title"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClickTitle("article")}
                        >
                          <Tooltip title={record.title}>
                            {record?.title}
                          </Tooltip>
                        </Link> */}
                        <Tooltip title={record.title}>{record?.title}</Tooltip>
                      </div>
                      <div className="column-row">
                        {" "}
                        <span>{formationTimezone(record?.published_date)}</span>
                        <span>
                          {" "}
                          {/* <Link
                            to={`/content/author/${record?.author_id}`}
                            className="overview-author-div-author"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClickTitle("author")}
                          >
                            {record?.author}
                          </Link> */}
                          {record?.author}
                        </span>
                        <span>{record?.category}</span>
                        <span className="link-text">
                          <a
                            href={`${siteLink}/story/${record?.title}/${record?.id}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Image
                              src={OpenLink}
                              alt="link"
                              style={{
                                width: "12px",
                                height: "12px",
                              }}
                            />
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={3}>
                  <ArticleChartContainer
                    id={record?.id}
                    seriobj={articleSeries}
                    chartLoader={chartLoader}
                  />
                </Col>
                <Col className="text-right" span={3}>
                  {record?.user?.toLocaleString()}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.page_views?.toLocaleString()}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.recirculation}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.scrolldepth}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.ad_revenue}
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div className="page-no-data">
            <Empty description="No Articles Available" />
          </div>
        )}
      </div>
    </div>
  );
};

const AuthorTableCard = (props: any) => {
  const { dataSource, authorSeries, handleClickTitle } = props;
  return (
    <div className="author-table-card-wrapper">
      <div className="author-table-header">
        <Row gutter={[16, 16]} className="table-card-row">
          <Col
            className="table-heading"
            span={6}
            style={{ paddingLeft: "40px" }}
          >
            <Tooltip title="The creator or writer of the content">
              Author
            </Tooltip>
          </Col>
          <Col className="text-center table-heading" span={4}>
            <Tooltip title="Number of views on the article in the last 24 hours.">
              Page Views: 24 Hours
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Individuals who read this article today.">
              Readers
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Number of views on the article today.">
              Page Views
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Percentage of users who visit another page on the site after the initial page.">
              Recirculation (%)
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={2}>
            <Tooltip title="The level of complexity of the text, its familiarity, legibility and typography all feed into how readable your content is.">
              Readability
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Revenue generated from advertisements.">
              Ad Revenue
            </Tooltip>
          </Col>
        </Row>
      </div>
      <div className="body-content">
        {dataSource?.length > 0 ? (
          dataSource.map((record: any, index: any) => (
            <div className="author-table-body">
              <Row gutter={[16, 16]} className="table-card-row">
                <Col span={6}>
                  <div style={{ display: "flex" }}>
                    <span
                      style={{
                        marginRight: "15px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#737a73",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </span>
                    <div className="column-container">
                      {/* <Link
                        className="column-title"
                        to={`/content/author/${record?.id}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClickTitle("author")}
                      >
                        {record.title}
                      </Link> */}
                      <div
                        className="column-title"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClickTitle("author")}
                      >
                        {" "}
                        {record.title}
                      </div>
                      <div className="column-row">
                        <span>Articles Published : {record.article_count}</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={4}>
                  <AuthorChartContainer
                    id={record?.id}
                    seriobj={authorSeries}
                  />
                </Col>
                <Col className="text-right" span={3}>
                  {record?.user?.toLocaleString()}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.page_views?.toLocaleString()}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.recirculation}
                </Col>
                <Col className="text-right" span={2}>
                  {record?.readability || 0}
                </Col>
                <Col className="text-right" span={3}>
                  {record?.ad_revenue}
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div className="page-no-data">
            <Empty description="No Authors Available" />
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryTableCard = (props: any) => {
  const { dataSource, categorySeries } = props;
  return (
    <div className="category-table-card-wrapper">
      <div className="category-table-header">
        <Row gutter={[16, 16]} className="table-card-row">
          <Col
            className="table-heading"
            span={6}
            style={{ paddingLeft: "40px" }}
          >
            <Tooltip title="The category or type of content.">Category</Tooltip>
          </Col>
          <Col className="text-center table-heading" span={6}>
            <Tooltip title="Number of views on the article in the last 24 hours.">
              Page Views: 24 Hours
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={4}>
            <Tooltip title="Individuals who read this article today.">
              Readers
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={4}>
            <Tooltip title="Number of views on the article today.">
              Page Views
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={4}>
            <Tooltip title="Revenue generated from advertisements.">
              Ad Revenue
            </Tooltip>
          </Col>
        </Row>
      </div>
      <div className="body-content">
        {dataSource?.length > 0 ? (
          dataSource.map((record: any, index: any) => (
            <div className="category-table-body">
              <Row gutter={[16, 16]} className="table-card-row">
                <Col span={6}>
                  <div className="column-container">
                    <div className="column-title" style={{ cursor: "pointer" }}>
                      <span
                        style={{
                          marginRight: "15px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#737a73",
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </span>
                      {record.title}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <AuthorChartContainer
                    id={record?.title}
                    seriobj={categorySeries}
                  />
                </Col>
                <Col className="text-right" span={4}>
                  {record?.user?.toLocaleString()}
                </Col>
                <Col className="text-right" span={4}>
                  {record?.page_views?.toLocaleString()}
                </Col>
                <Col className="text-right" span={4}>
                  {record?.ad_revenue}
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div className="page-no-data">
            <Empty description="No Category Available" />
          </div>
        )}
      </div>
    </div>
  );
};

// const VideoTableCard = ({ dataSource, siteLink, handleClickTitle }) => {
//   return (
//     <div className="video-table-card-wrapper">
//       <div className="video-table-header">
//         <Row gutter={[16, 16]} className="table-card-row">
//           <Col className="text-center table-heading" span={12} />
//           <Col
//             className="text-right table-heading"
//             span={4}
//             style={{ textAlign: "right" }}
//           >
//             <Tooltip title="Number of views on the website for the current day.">
//               Views Today
//             </Tooltip>
//           </Col>
//           <Col
//             className="text-right table-heading"
//             span={4}
//             style={{ textAlign: "right" }}
//           >
//             <Tooltip title="Percentage of users who play a video out of those who have viewed the video thumbnail.">
//               Play Rate
//             </Tooltip>
//           </Col>
//           <Col
//             className="text-right table-heading"
//             span={4}
//             style={{ textAlign: "right" }}
//           >
//             <Tooltip title="Rate at which users interact with content on the website.">
//               Engagement rate
//             </Tooltip>
//           </Col>
//         </Row>
//       </div>
//       <div className="body-content">
//         {dataSource?.length > 0 ? (
//           dataSource?.map((record, index) => (
//             <div className="video-table-body" key={index}>
//               <Row gutter={[16, 16]} className="table-card-row">
//                 <Col span={12}>
//                   <Row>
//                     <div style={{ display: "flex" }}>
//                       <span
//                         style={{
//                           marginRight: "15px",
//                           fontSize: "14px",
//                           fontWeight: 600,
//                           color: "#737a73",
//                           textAlign: "center"
//                         }}
//                       >
//                         {index + 1}
//                       </span>
//                       <div className="column-container">
//                         <Link
//                           to={`/content/article/${record?.article?.article_id}?max_age=-1`}
//                           className="overview-title"
//                           style={{ cursor: "pointer" }}
//                           onClick={() => handleClickTitle("article")}
//                         >
//                           <Tooltip title={record?.article?.title}>
//                             {record?.article?.title}
//                           </Tooltip>
//                         </Link>
//                         <div className="column-row">
//                           <span>
//                             Published on{" "}
//                             {formationTimezone(record?.article?.published_date)}
//                           </span>
//                           <span className="link-text">
//                             <a
//                               href={`${siteLink}/story/${record?.article?.title}/${record?.article?.article_id}`}
//                               target="_blank"
//                               rel="noreferrer"
//                             >
//                               <img
//                                 src={"/images/open-link.webp"}
//                                 alt="link"
//                                 style={{
//                                   width: "12px",
//                                   height: "12px"
//                                 }}
//                               />
//                             </a>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Row>
//                 </Col>
//                 <Col className="text-right" span={4}>
//                   {record?.valid_play_views?.toLocaleString() || 0}
//                 </Col>
//                 <Col className="text-right" span={4}>
//                   {`${record?.avg_playback_rate?.toFixed(2) || 0} %`}
//                 </Col>
//                 <Col className="text-right" span={4}>
//                   {`${record?.avg_percent_played?.toFixed(2) || 0} %`}
//                 </Col>
//               </Row>
//             </div>
//           ))
//         ) : (
//           <div className="page-no-data">
//             <Empty description="No Video Available" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const OverviewPage = () => {
  const [loader, setLoader] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedChartValue, setSelectedChartValue] = useState("");
  const [highAndLowValues, setHighAndLowValues]: any = useState([]);
  const [overallListData, setOverallListData]: any = useState({});
  const [percentageData, setPercentageData]: any = useState(null);
  const [newPost, setNewPost] = useState(0);
  const [readPost, setReadPost] = useState(0);
  const [dowAvg, setDowAvg]: any = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [collapsedSecond, setCollapsedSecond] = useState(false);
  const [cityRows, setCityRows] = useState([]);
  const [referrerSeries, setReferrerSeries] = useState({
    labels: [],
    series: [],
  });
  const [overViewCurrentChartResponse, setOverViewCurrentChartResponse] =
    useState([]);
  const [overViewAverageChartResponse, setOverViewAverageChartResponse] =
    useState([]);

  const [overViewChartData, setOverViewChartData]: any = useState({});
  const [chartLoader, setChartLoader] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [articleSeries, setArticleSeries] = useState({});
  const [siteLink, setSiteLink] = useState(null);
  const [topPostToday, setTopPostToday] = useState([]);
  const [overviewAuthor, setOverviewAuthor] = useState([]);
  const [authorSeries, setAuthorSeries] = useState({});
  const [overviewTagsHour, setoverviewTagsHour] = useState([]);
  const [categorySeries, setCategorySeries] = useState({});

  const timeInterval = 30 * 60 * 1000;

  useEffect(() => {
    getOverallData();
    const intervalId = setInterval(() => {
      getOverallData();
    }, timeInterval);
    setSelectedChartValue("page_views");

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (overViewCurrentChartResponse && overViewAverageChartResponse) {
      chartData(selectedChartValue);
    }
  }, [overViewCurrentChartResponse, overViewAverageChartResponse]);

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

  const getOverallData = () => {
    setIsError(false);
    const siteInfo: any = {
      id: 36,
      site_id: "wral.com",
      site_name: "Fabriq",
      host_name: "https://fabriq.com",
      collector_url: "wral.com/dt",
    };

    setSiteLink(siteInfo?.host_name);

    if (siteInfo) {
      const topPostvariables = {
        parameters: {
          site_id: `"${siteInfo?.site_id}"`,
        },
        max_age: -1,
        id: 426,
      };

      setLoader(true);

      axios
        .post("/api/query_results", { data: topPostvariables })
        .then((values) => {
          const { data } = values;
          if ("job" in data) {
            return getResultFromJob(data, topPostvariables);
          }

          return data.query_result ? data.query_result : Promise.reject();
        })
        .then((res) => {
          const data = res?.data?.data;
          // const targetTimezone =
          //   localStorage.getItem("org_timezone") || "America/New_York";
          // let currentData = data?.ArticleCurrentHours;
          // let largestHour = 0;

          // if (currentData?.length > 0) {
          //   currentData.forEach((item) => {
          //     if (item.hour > largestHour) {
          //       largestHour = item.hour;
          //     }
          //   });
          // }

          // if (largestHour + 1 === 24) {
          //   largestHour = 0;
          // } else {
          //   largestHour += 1;
          // }
          // const currentTime = moment()
          //   .tz(targetTimezone)
          //   .hour(largestHour)
          //   .minute(0);

          // const formattedDateNow = currentTime.format("MMM D, YYYY h:mm A");
          // dispatch(updateLastUpdatedAt(formattedDateNow));

          if (data) {
            let topPost = data?.TopPosts;
            let topAuthor = data?.TopAuthors;
            setOverallListData(data?.daily_list_aggregate?.aggregate?.sum);
            setNewPost(data?.NewPostArticles?.aggregate?.count);
            setReadPost(data?.daily_aggregate?.aggregate?.count);
            setHighAndLowValues(data?.highestandLowestPageViews);
            setoverviewTagsHour(data?.TopCategorys);
            setOverViewCurrentChartResponse(data?.ArticleCurrentHours);
            setOverViewAverageChartResponse(data?.ArticleAvgHours);
            setDowAvg(data?.DowAvg?.[0]);

            const unknownIndex = topAuthor?.findIndex(
              (item: any) => item?.author?.author_id === "unknown"
            );

            if (unknownIndex !== -1) {
              const unknownItem = topAuthor?.splice(unknownIndex, 1)[0];
              topAuthor.push(unknownItem);
            }

            setOverviewAuthor(topAuthor);

            // setVideoList(data?.TopVideos);

            const scrollDepthData = data?.ScrollDepth?.aggregate?.sum;

            let percentageInfo: any = {
              recirculation: data?.daily_list?.[0]?.recirculation || 0,
            };

            if (scrollDepthData !== null) {
              let total_calc = 0;
              let total_scroll_depth_percentage = 0;

              for (let i = 10; i <= 100; i += 10) {
                const crossed_users =
                  scrollDepthData[`crossed_${i}_users`] || 0;
                total_calc += crossed_users * i;
                total_scroll_depth_percentage += crossed_users;
              }

              const avg_combined_percentage =
                total_scroll_depth_percentage === 0
                  ? 0
                  : total_calc / total_scroll_depth_percentage;

              percentageInfo.scroll_depth = avg_combined_percentage.toFixed(2);
            }

            const updatedTopPosts = topPost?.map((post: any) => {
              const scrollDepthData = post?.scroll_depth;

              if (!scrollDepthData) return post;

              let total_calc = 0;
              let total_scroll_depth_percentage = 0;

              for (let i = 10; i <= 100; i += 10) {
                const crossedUsers = scrollDepthData[`crossed_${i}_users`] || 0;
                total_calc += crossedUsers * i;
                total_scroll_depth_percentage += crossedUsers;
              }

              const scroll_depth_percentage =
                total_scroll_depth_percentage === 0
                  ? 0
                  : parseFloat(
                      (total_calc / total_scroll_depth_percentage).toFixed(2)
                    );

              return {
                ...post,
                scroll_depth_percentage,
              };
            });

            setPercentageData(percentageInfo);
            setTopPostToday(updatedTopPosts);
            getLast24HoursArticles(siteInfo, topPost);
            getLast24HoursForAuthor(siteInfo, topAuthor);
            //   getLast24HoursCategory(siteDetails, data?.TopCategorys);
            if (data?.TopCity?.length > 0) {
              getTopCity(data?.TopCity?.[0]?.top_cities);
              generateChartSeriesAndLabels(data?.TopCity?.[0]?.top_referer);
            }
            setLoader(false);
          }
          setLoader(false);
        })
        .catch(() => {
          setLoader(false);
          setIsError(true);
        });
    }
  };

  const getLast24HoursArticles = async (
    siteDetails: any,
    overviewData: any
  ) => {
    const overviewIds = overviewData?.map(
      (item: any) => item?.article?.article_id
    );

    if (overviewIds?.length > 0) {
      setChartLoader(true);
      const real_time =
        localStorage.getItem("real_time_date") ||
        formationTimezone(moment(), "YYYY-MM-DD");
      const req = {
        period_date: real_time,
        site_id: siteDetails?.site_id,
        article_id: overviewIds,
      };

      const lableValue = Array.from({ length: 24 }, (_, i) => i);

      try {
        const {
          data: { data, errors },
        } = await axios.post("/api/overview", {
          operation: "getArticleTableList",
          variables: req,
        });

        const result: any = {};

        if (errors) {
          throw errors;
        }

        if (data?.last30DaysData?.length > 0) {
          data.last30DaysData.forEach((articleItem: any) => {
            const articleId = articleItem.article.article_id;

            if (!result[articleId]) {
              result[articleId] = {
                series: [
                  {
                    name: "Page Views",
                    data: lableValue.map(() => 0),
                  },
                ],
                labels: lableValue.map((item) =>
                  moment(item, "H").format("h:mm a")
                ),
              };
            }

            const hourIndex = articleItem?.hour;

            if (hourIndex !== -1) {
              result[articleId].series[0].data[hourIndex] =
                articleItem?.page_views;
            }
          });
        }

        setArticleSeries(result);
        setChartLoader(false);
      } catch (err) {
        setChartLoader(false);
        api.error({
          message: "Overview ",
          description: "Failed to fetch articles data",
        });
      }
    }
  };

  const getLast24HoursForAuthor = async (
    siteDetails: any,
    overviewAuthor: any
  ) => {
    const authorIds = overviewAuthor?.map(
      (item: any) => item?.author?.author_id
    );

    if (authorIds?.length > 0) {
      const real_time =
        localStorage.getItem("real_time_date") ||
        formationTimezone(moment(), "YYYY-MM-DD");
      const req = {
        period_date: real_time,
        site_id: siteDetails?.site_id,
        author_id: authorIds,
      };

      const lableValue = Array.from({ length: 24 }, (_, i) => i);

      try {
        const res = await axios.post("/api/overview", {
          operation: "getAuthorTableList",
          variables: req,
        });

        const result: any = {};

        if (res?.data?.data?.last24HoursData?.length > 0) {
          res.data.data.last24HoursData.forEach((authorItem: any) => {
            const author_id = authorItem?.author_id;

            if (!result[author_id]) {
              result[author_id] = {
                series: [
                  {
                    name: "Page Views",
                    data: lableValue.map(() => 0),
                  },
                ],
                labels: lableValue.map((item) =>
                  moment(item, "H").format("h:mm a")
                ),
              };
            }

            const hourIndex = authorItem?.period_hour;

            if (hourIndex !== -1) {
              result[author_id].series[0].data[hourIndex] =
                authorItem?.page_views;
            }
          });
        }

        setAuthorSeries(result);
      } catch (err) {
        api.error({
          message: "Overview ",
          description: "Failed to fetch authors data",
        });
      }
    }
  };

  const getLast24HoursCategory = async (siteDetails: any, categorys: any) => {
    // const categoryIds = categorys?.map((item: any) => item?.category);

    // if (categoryIds?.length > 0) {
    //   const real_time =
    //     localStorage.getItem("real_time_date") ||
    //     formationTimezone(moment(), "YYYY-MM-DD");
    //   const req = {
    //     period_date: real_time,
    //     site_id: siteDetails?.site_id,
    //     category: categoryIds,
    //   };

    //   const lableValue = Array.from({ length: 24 }, (_, i) => i);

    //   try {
    //     const {
    //       data: { data, errors },
    //     } = await Overview.getLast24HoursForCategory(req);

    //     const result: any = {};

    //     if (errors) {
    //       throw errors;
    //     }

    //     if (data?.last24HoursData?.length > 0) {
    //       data.last24HoursData.forEach((categoryItem: any) => {
    //         const category = categoryItem?.category;

    //         if (!result[category]) {
    //           result[category] = {
    //             series: [
    //               {
    //                 name: "Page Views",
    //                 data: lableValue.map(() => 0),
    //               },
    //             ],
    //             labels: lableValue.map((item) =>
    //               moment(item, "H").format("h:mm a")
    //             ),
    //           };
    //         }

    //         const hourIndex = categoryItem?.hour;

    //         if (hourIndex !== -1) {
    //           result[category].series[0].data[hourIndex] =
    //             categoryItem?.page_views;
    //         }
    //       });
    //     }

    //     setCategorySeries(result);
    //   } catch (err) {
    //     // notification.error("Failed to fetch category data");
    //   }
    // }
  };

  /* City Data */
  const getTopCity = (top_cities: any) => {
    if (top_cities) {
      const generatedRows: any = [];

      let idCounter = 1;

      let top_city_list = top_cities;

      if (typeof top_city_list === "string") {
        top_city_list = JSON.parse(top_city_list);
      }

      for (const city of Object.keys(top_city_list)) {
        const users = top_city_list[city];

        generatedRows.push({
          key: String(idCounter),
          id: idCounter,
          city: city,
          users: users,
        });

        idCounter++;
      }

      setCityRows(generatedRows);
    }
  };

  const generateChartSeriesAndLabels = (topReferer: any) => {
    if (topReferer) {
      let topRefererData = topReferer;

      if (typeof topRefererData === "string") {
        topRefererData = JSON.parse(topRefererData);
      }

      const labels = Object.keys(topRefererData);

      // Extract series data from the object values
      const seriesData = Object.values(topRefererData);

      let series = [
        {
          data: seriesData,
        },
      ];

      setReferrerSeries((prevState: any) => ({
        ...prevState,
        labels,
        series,
      }));
    }
  };

  const handleChangeChart = (value: any) => {
    setSelectedChartValue(value);
    chartData(value);
  };

  const chartData = (value: any) => {
    if (overViewCurrentChartResponse && overViewAverageChartResponse) {
      const lableValue = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ];

      const currentUserValues = lableValue
        .map((hour) => {
          const matchingData: any = overViewCurrentChartResponse.find(
            (obj: any) => (obj?.hour + 1 === 24 ? 0 : obj?.hour + 1) === hour
          );
          return matchingData ? matchingData.users : 0;
        })
        .filter((value) => value !== 0);

      const currentPageViewsValues = lableValue
        .map((hour) => {
          const matchingData: any = overViewCurrentChartResponse.find(
            (obj: any) => (obj?.hour + 1 === 24 ? 0 : obj?.hour + 1) === hour
          );
          return matchingData ? matchingData.page_views : 0;
        })
        .filter((value) => value !== 0);

      const averageUserValues = lableValue.map((hour) => {
        const matchingData: any = overViewAverageChartResponse.find(
          (obj: any) => (obj?.hour + 1 === 24 ? 0 : obj?.hour + 1) === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData: any = overViewAverageChartResponse.find(
          (obj: any) => (obj.hour + 1 === 24 ? 0 : obj.hour + 1) === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      let chartSeriesFormat = {
        series: [
          {
            name: "Today",
            data:
              value === "page_views"
                ? currentPageViewsValues
                : currentUserValues,
          },
          {
            name: "Average",
            data:
              value === "page_views"
                ? averagePageViewsValue
                : averageUserValues,
          },
        ],
        label: lableValue,
      };

      setOverViewChartData(chartSeriesFormat);
    }
  };

  /* Engagement section */
  const calculatePercentileRange = (low: any, high: any, value: any) => {
    const range = high - low;

    const percentile25 = low + 0.25 * range;
    const percentile75 = low + 0.75 * range;

    if (value <= percentile25) {
      return "low";
    } else if (value <= percentile75) {
      return "average";
    } else {
      return "high";
    }
  };

  const calculateRecirculationCategory = (
    minRecirculation: any,
    maxRecirculation: any,
    recirculationValue: any
  ) => {
    const minRecirculationPercentage =
      (minRecirculation / maxRecirculation) * 100;

    if (recirculationValue <= minRecirculationPercentage) {
      return "low";
    } else if (recirculationValue <= 100) {
      return "average";
    } else {
      return "high";
    }
  };

  const toggleCollapsed = (panel: any) => {
    if (panel === "first") {
      setCollapsed(!collapsed);
      if (collapsedSecond) setCollapsedSecond(false);
    } else if (panel === "second") {
      setCollapsedSecond(!collapsedSecond);
      if (collapsed) setCollapsed(false);
    }
  };

  function analyzeTrafficEngagement() {
    const usersHigh = highAndLowValues?.aggregate?.max?.users;
    const usersLow = highAndLowValues?.aggregate?.min?.users;
    const pageViews = overallListData?.page_views || 0;
    const recirculationData = percentageData?.recirculation || 0;

    // Analyze Users
    const usersCategory = calculatePercentileRange(
      usersLow,
      usersHigh,
      pageViews
    );

    // Analyze Recirculation
    const recirculationCategory = calculateRecirculationCategory(
      usersLow,
      usersHigh,
      recirculationData
    );

    return {
      usersCategory,
      recirculationCategory,
    };
  }

  const result = analyzeTrafficEngagement();

  const checkValueStatus = (val: any) => {
    if (val?.includes("-")) {
      return "decreased";
    }

    return "increased";
  };

  // Details
  const buttonsData = [
    {
      label: "Articles read today",
      value: readPost || 0,
      icon: ReadingLogo,
      tooltipText: "Number of articles read by users today.",
    },
    {
      label: "Articles posted today",
      value: newPost || 0,
      icon: NewspaperLogo,
      tooltipText: "Number of articles published on the website today.",
    },
    {
      label: "Readers",
      value: overallListData?.users ? formatNumber(overallListData?.users) : 0,
      icon: ReadingLogo,
      tooltipText: "Individuals who read articles on the website.",
      avgValue: dowAvg?.user_avg_percent,
      avgStatus: checkValueStatus(dowAvg?.user_avg_percent),
    },
    {
      label: "Page Views",
      value: overallListData?.page_views
        ? formatNumber(overallListData?.page_views)
        : 0,
      isChart: true,
      icon: WebLogo,
      tooltipText: "Total number of pages viewed on the website.",
      avgValue: dowAvg?.page_views_avg_percent,
      avgStatus: checkValueStatus(dowAvg?.page_views_avg_percent),
    },
    {
      label: "Recirculation",
      value: `${percentageData?.recirculation?.toFixed(2) || 0} %`,
      icon: ReuseLogo,
      tooltipText:
        "Percentage of users who visit another page on the site after the initial page.",
      avgValue: dowAvg?.recirculation_avg_percent,
      avgStatus: checkValueStatus(dowAvg?.recirculation_avg_percent),
    },
    {
      label: "Scroll Depth",
      value: `${percentageData?.scroll_depth || 0} %`,
      icon: LeftClick,
      tooltipText: "Measure of how far down the page users scroll.",
      avgValue: dowAvg?.scroll_depth_avg_percent,
      avgStatus: checkValueStatus(dowAvg?.page_views_avg_percent),
    },
  ];

  const currentMonth = moment().format("MMM D");
  const timeLabels = overViewChartData?.label?.map((item: any) => {
    const formattedTime = moment().hour(item).minute(0).format("h:mm a");
    return `${currentMonth}, ${formattedTime}`;
  });

  // main table data
  const data = mapArticleData(topPostToday);
  const authorData = mapAuthorData(overviewAuthor);
  const categoryData = mapCategoryData(overviewTagsHour);

  // main render
  return (
    <Layout>
      <div className="overview-wrapper">
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            <Col span={5}>
              <div className="overview-left-container">
                <div className="custom-message">
                  Traffic is{" "}
                  <span className={`traffic ${result?.usersCategory}-div`}>
                    {result?.usersCategory}
                  </span>
                  <br />
                  Engagement is{" "}
                  <span
                    className={`engagement ${result?.recirculationCategory}-div`}
                  >
                    {" "}
                    {result?.recirculationCategory}
                  </span>
                </div>
                {buttonsData?.map((button, index) => (
                  <div
                    key={index}
                    className="custom-collapse button-container"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "stretch",
                    }}
                  >
                    <>
                      <div className="collapse-header-overview">
                        <div className="header-content-overview">
                          {button.icon && (
                            <div className="icon-container">
                              <Image
                                src={button.icon}
                                alt="Icon"
                                className="icon"
                              />
                            </div>
                          )}
                          <Tooltip title={button.tooltipText}>
                            <span>
                              <Label className="header-text-overview">
                                {button.label}
                              </Label>
                            </span>
                          </Tooltip>
                        </div>
                        <div className="label-container-overview">
                          {button.value}
                          {button?.avgValue && button?.avgValue !== "0.00" && (
                            <Tag
                              color={
                                button?.avgStatus === "decreased"
                                  ? "red"
                                  : "green"
                              }
                              className="additional-info"
                            >
                              {button?.avgValue.includes("-")
                                ? button?.avgValue.substring(1)
                                : button?.avgValue}
                              %
                              <Image
                                src={
                                  button?.avgStatus === "decreased"
                                    ? DownArrowLogo
                                    : UpArrowLogo
                                }
                                alt=""
                                className="img-arrow"
                                width={12}
                                height={12}
                              />
                            </Tag>
                          )}
                        </div>
                      </div>
                    </>
                    {button?.isChart && (
                      <div className="chart-container">
                        <div className="chart-wrapper relative">
                          <Chart
                            id="page_views"
                            value={overallListData?.page_views || 0}
                            maxValue={
                              highAndLowValues?.aggregate?.max?.page_views
                            }
                          />
                        </div>
                        <div className="absolute-values">
                          <div className="low">
                            <span className="val-div">
                              {format(
                                highAndLowValues?.aggregate?.min?.page_views
                              )}
                            </span>
                            <br />
                            30 Day Low{" "}
                          </div>
                          <div className="max">
                            <span className="val-div">
                              {format(
                                highAndLowValues?.aggregate?.max?.page_views
                              )}
                            </span>
                            <br /> 30 Day High{" "}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="custom-collapse">
                  <div
                    className={`collapse-header-overview bottom-section ${
                      collapsed ? "collapsed" : ""
                    }`}
                    onClick={() => toggleCollapsed("first")}
                  >
                    <div className="header-content-overview">
                      <Image
                        src={WorldwideLogo}
                        alt="Icon"
                        height={16}
                        width={16}
                        className="header-image"
                      />
                      <Tooltip
                        title={
                          "Geographical location of the website's audience."
                        }
                      >
                        <span className="header-text-overview">Geography</span>
                      </Tooltip>
                    </div>
                    <div>
                      <Image
                        src={collapsed ? UpArrow : DownArrow}
                        alt="Icon"
                        height={16}
                        width={16}
                      />
                    </div>
                  </div>
                  {collapsed && (
                    <div className="scrollable-table">
                      <Table
                        dataSource={cityRows}
                        className="geography-table"
                        columns={columnForGeography}
                        pagination={false}
                      />
                    </div>
                  )}
                </div>
                <div className="custom-collapse-overview">
                  <div
                    className={`collapse-header-overview bottom-section ${
                      collapsedSecond ? "collapsed" : ""
                    }`}
                    onClick={() => toggleCollapsed("second")}
                  >
                    <div className="header-content">
                      <Image
                        src={Referral}
                        alt="Icon"
                        height={16}
                        width={16}
                        className="header-image"
                      />
                      <span className="header-text-overview">
                        Top 5 Referral Sources
                      </span>
                    </div>
                    <div>
                      <Image
                        src={collapsedSecond ? UpArrow : DownArrow}
                        alt="Icon"
                        height={16}
                        width={16}
                      />
                    </div>
                  </div>
                  {collapsedSecond && (
                    <Barchart
                      labels={referrerSeries?.labels}
                      series={referrerSeries?.series || []}
                    />
                  )}
                </div>
              </div>
            </Col>
            <Col span={19}>
              <Row>
                <Col span={24}>
                  <div className="overview-chart-content">
                    <div className="overview-chart-header">
                      <div className="overview-chart-select">
                        <Select
                          onChange={handleChangeChart}
                          value={selectedChartValue}
                          style={{ width: "100%" }}
                          getPopupContainer={(triggerNode) =>
                            triggerNode?.parentNode || document.body
                          }
                        >
                          <Select.Option value="page_views">
                            Page Views
                          </Select.Option>
                          <Select.Option value="users">Readers</Select.Option>
                        </Select>
                      </div>
                    </div>
                    <LineChart
                      labels={timeLabels}
                      series={overViewChartData?.series}
                      colors={["#7F56D9", "#A3E0FF"]}
                      height={300}
                      multipleYaxis={false}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Tabs
                    type="card"
                    className="overview-tabs"
                    items={[
                      {
                        label: `Top Articles`,
                        key: "1",
                        children: (
                          <ArticleTableCard
                            chartLoader={chartLoader}
                            // handleClickTitle={handleClickTitle}
                            dataSource={data}
                            articleSeries={articleSeries}
                            siteLink={siteLink}
                          />
                        ),
                      },
                      {
                        label: `Top Authors`,
                        key: "2",
                        children: (
                          <AuthorTableCard
                            dataSource={authorData}
                            authorSeries={authorSeries}
                            // handleClickTitle={handleClickTitle}
                          />
                        ),
                      },
                      {
                        label: `Top Category`,
                        key: "3",
                        children: (
                          <CategoryTableCard
                            dataSource={categoryData}
                            categorySeries={categorySeries}
                          />
                        ),
                      },
                    ]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </div>
      {contextHolder}
    </Layout>
  );
};

export default React.memo(OverviewPage, isEqual);
