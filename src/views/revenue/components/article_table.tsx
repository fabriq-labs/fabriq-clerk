import React, { useState } from "react";
import { Tooltip, Empty, Row, Col } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import axios from "axios";
import moment from "moment";

import UpArrow from "../../../assets/upload.png";
import DownArrow from "../../../assets/down-arrow_nw.png";
import LineChartTiny from "@/components/chart/linechart_tiny";
import ExpandedRow from "./expend_row";

import { getQuarterMonths, getMonthName } from "@utils/helper";

const generateData = (series: any, labels: any) => {
  const finalData = labels?.map((label: any, index: any) => ({
    name: label,
    pageViews: series?.[0]?.data?.[index] || 0,
  }));

  return finalData;
};

const ArticleTableCard = (props: any) => {
  const {
    dataSource,
    childrenOpen,
    handleClickChildrenOpen,
    loader,
    offsetValue,
    sortDirection,
    handleChangeSort,
    segementValue,
    miniChartLoader,
  } = props;
  const [loading, setLoading] = useState(false);
  const [tableLoader, setTableLoader] = useState(false);
  const [subList, setSubList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [chartLoader, setChartLoader] = useState(false);

  const getSubListDetails = async (
    ad_unit_id_2: any,
    limit: any,
    offset: any,
    period_year: any,
    period_month: any,
    sortOption: any
  ) => {
    try {
      setTableLoader(true);
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation: "getMonthlySubList",
        variables: {
          ad_unit_id_2,
          limit,
          offset,
          period_year,
          period_month,
          sortOption,
        },
      });

      if (errors) {
        throw errors;
      }
      getTableChartSeries(data?.TableList, period_month, period_year);
      setTotalCount(data?.totalCount?.aggregate?.count);
    } catch (error) {
      setTableLoader(false);
      if (loading) setLoading(false);
    }
  };

  const getSubListDetailsQuarterly = async (
    ad_unit_id_2: any,
    limit: any,
    offset: any,
    period_year: any,
    period_quarter: any,
    sortOption: any
  ) => {
    try {
      setTableLoader(true);
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation: "getQuaterlySubList",
        variables: {
          ad_unit_id_2,
          limit,
          offset,
          period_year,
          period_quarter,
          sortOption,
        },
      });
      if (errors) {
        throw errors;
      }
      getTableChartSeriesQuarterly(
        data?.TableList,
        period_quarter,
        period_year
      );
      setTotalCount(data?.totalCount?.aggregate?.count);
      setSubList(data?.TableList);
      setTableLoader(false);
      if (loading) setLoading(false);
    } catch (error) {
      setTableLoader(false);
      if (loading) setLoading(false);
    }
  };

  const getSubListDetailsYearly = async (
    ad_unit_id_2: any,
    limit: any,
    offset: any,
    period_year: any,
    sortOption: any
  ) => {
    try {
      setTableLoader(true);
      const {
        data: { data, errors },
      } = await axios.post("/api/revenue", {
        operation: "getYearlySubList",
        variables: {
          ad_unit_id_2,
          limit,
          offset,
          period_year,
          sortOption,
        },
      });

      if (errors) {
        throw errors;
      }
      getTableChartSeriesYearly(data?.TableList, period_year);
      setTotalCount(data?.totalCount?.aggregate?.count);
      setSubList(data?.TableList);
      setTableLoader(false);
      if (loading) setLoading(false);
    } catch (error) {
      setTableLoader(false);
      if (loading) setLoading(false);
    }
  };

  const getTableChartSeries = async (
    result: any,
    period_month: any,
    period_year: any
  ) => {
    let ids = result?.map((item: any) => item?.ad_unit_id_3);
    if (ids?.length > 0) {
      ids = ids.filter((item: any) => item !== "-");
    }
    if (!tableLoader) {
      setTableLoader(true);
    }
    try {
      setChartLoader(true);
      const { data, errors }: any = await axios.post("/api/revenue", {
        operation: "getMonthlySubListChart",
        variables: {
          ad_unit_id_3: ids,
          period_month,
          period_year,
        },
      });

      if (errors) {
        throw errors;
      }
      let obj: any = {};
      if (data?.data?.ChartInfo?.length > 0) {
        data.data.ChartInfo.forEach((item: any) => {
          const ad_unit_id_3 = item?.ad_unit_id_3;
          if (!obj[ad_unit_id_3]) {
            obj[ad_unit_id_3] = {
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
          obj[ad_unit_id_3].labels.push(dateFormat);
          obj[ad_unit_id_3].series[0].data.push(item?.total_revenue);
        });
      }
      let updatedResult = result?.map((itemObj: any) => {
        const ad_unit_id_3 = itemObj?.ad_unit_id_3;
        const item = { ...itemObj };
        if (obj[ad_unit_id_3]) {
          item.series = obj[ad_unit_id_3].series;
          item.labels = obj[ad_unit_id_3].labels;
        }
        return item;
      });
      setSubList(updatedResult);
      setTableLoader(false);
      setChartLoader(false);
      if (loading) setLoading(false);
    } catch (err) {
      setTableLoader(false);
      setChartLoader(false);
    }
  };

  const getTableChartSeriesQuarterly = async (
    result: any,
    period_quarter: any,
    period_year: any
  ) => {
    let ids = result?.map((item: any) => item?.ad_unit_id_3);
    if (ids?.length > 0) {
      ids = ids.filter((item: any) => item !== "-");
    }
    if (!tableLoader) {
      setTableLoader(true);
    }
    const currentQuarterMonths = getQuarterMonths(period_quarter);
    try {
      setChartLoader(true);
      const { data, errors }: any = await axios.post("/api/revenue", {
        operation: "getQuaterlySubListChart",
        variables: {
          ad_unit_id_3: ids,
          period_month: currentQuarterMonths,
          period_year,
        },
      });

      if (errors) {
        throw errors;
      }

      let obj: any = {};
      if (data?.data?.ChartInfo?.length > 0) {
        data.data.ChartInfo.forEach((item: any) => {
          const ad_unit_id_3 = item?.ad_unit_id_3;
          if (!obj[ad_unit_id_3]) {
            obj[ad_unit_id_3] = {
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
          obj[ad_unit_id_3].labels.push(`${monthName} ${period_year}`);
          obj[ad_unit_id_3].series[0].data.push(item?.total_revenue);
        });
      }
      let updatedResult = result?.map((itemObj: any) => {
        const ad_unit_id_3 = itemObj?.ad_unit_id_3;
        const item = { ...itemObj };
        if (obj[ad_unit_id_3]) {
          item.series = obj[ad_unit_id_3].series;
          item.labels = obj[ad_unit_id_3].labels;
        }
        return item;
      });
      setSubList(updatedResult);
      setTableLoader(false);
      setChartLoader(false);
      if (loading) setLoading(false);
    } catch (err) {
      setTableLoader(false);
      setChartLoader(false);
    }
  };

  const getTableChartSeriesYearly = async (result: any, year: any) => {
    let ids = result?.map((item: any) => item?.ad_unit_id_3);
    if (ids?.length > 0) {
      ids = ids.filter((item: any) => item !== "-");
    }
    if (!tableLoader) {
      setTableLoader(true);
    }
    try {
      setChartLoader(true);
      const { data, errors }: any = await await axios.post("/api/revenue", {
        operation: "getYearlySubListChart",
        variables: {
          ad_unit_id_3: ids,
          period_year: year,
        },
      });

      if (errors) {
        throw errors;
      }
      let obj: any = {};
      if (data?.data?.ChartInfo?.length > 0) {
        data.data.ChartInfo.forEach((item: any) => {
          const ad_unit_id_3 = item?.ad_unit_id_3;
          if (!obj[ad_unit_id_3]) {
            obj[ad_unit_id_3] = {
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
          obj[ad_unit_id_3].labels.push(`${monthName} ${year}`);
          obj[ad_unit_id_3].series[0].data.push(item?.total_revenue);
        });
      }
      let updatedResult = result?.map((itemObj: any) => {
        const ad_unit_id_3 = itemObj?.ad_unit_id_3;
        const item = { ...itemObj };
        if (obj[ad_unit_id_3]) {
          item.series = obj[ad_unit_id_3].series;
          item.labels = obj[ad_unit_id_3].labels;
        }
        return item;
      });
      setSubList(updatedResult);
      setTableLoader(false);
      setChartLoader(false);
      if (loading) setLoading(false);
    } catch (err) {
      setTableLoader(false);
      setChartLoader(false);
    }
  };

  const openItem = (index: any) => {
    setLoading(true);

    handleClickChildrenOpen(index, setLoading);
  };

  return (
    <div className="revenue-table-card-wrapper">
      <div className="revenue-table-header">
        <Row gutter={[16, 16]} className="table-card-row">
          <Col
            className="table-heading"
            span={3}
            style={{ paddingLeft: "40px" }}
          >
            <Tooltip title="The name of the category">Name</Tooltip>
          </Col>
          <Col className="text-center table-heading" span={8} />
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Number of times an ad is displayed to users.">
              Impressions
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Percentage of ad inventory filled by advertisements.">
              Fill Rate
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Effective Cost Per Thousand impressions, a measure of ad revenue.">
              eCPM
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={3}>
            <Tooltip title="Revenue generated from advertisements on the website.">
              Ad Revenue
            </Tooltip>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                float: "right",
              }}
            >
              <CaretUpOutlined
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  cursor: "pointer",
                  color: sortDirection === "asc_nulls_last" ? "blue" : "gray",
                }}
                onClick={() => {
                  if (sortDirection !== "asc_nulls_last") {
                    handleChangeSort("users", "asc_nulls_last");
                  }
                }}
              />
              <CaretDownOutlined
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  cursor: "pointer",
                  color: sortDirection === "desc_nulls_last" ? "blue" : "gray",
                }}
                onClick={() => {
                  if (sortDirection !== "desc_nulls_last") {
                    handleChangeSort("users", "desc_nulls_last");
                  }
                }}
              />
            </div>
          </Col>
          <Col span={1} />
        </Row>
      </div>
      {loader ? (
        <div className="loader-wrapper">
          <div className="loader-cotainer mini-list">
            <div className="loader"></div>
          </div>
        </div>
      ) : dataSource?.length > 0 ? (
        dataSource?.map((record: any, index: any) => (
          <div className="revenue-table-body">
            <Row gutter={[16, 16]} className="table-card-row">
              <Col span={3}>
                <div style={{ display: "flex" }}>
                  <span
                    style={{
                      marginRight: "15px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#737a73",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {offsetValue + index + 1}
                  </span>
                  <div className="list-article-title">{record?.name}</div>
                </div>
              </Col>
              <Col className="text-right" span={8}>
                <div className="list-view-chart-wrapper">
                  <div className="list-view-chart">
                    {segementValue === "monthly" && (
                      <LineChartTiny
                        data={generateData(record?.series, record?.labels)}
                        dataKey={"pageViews"}
                        isRevenue
                        chartLoader={miniChartLoader}
                        updatedLabels={record?.labels}
                      />
                    )}
                  </div>
                </div>
              </Col>
              <Col span={3} className="text-right">
                {record?.impression}
              </Col>
              <Col className="text-right" span={3}>
                {record?.fillRate} %
              </Col>
              <Col className="text-right" span={3}>
                ${record?.eCPM}
              </Col>
              <Col className="text-right" span={3}>
                ${record?.adRevenue}
              </Col>
              <Col className="text-center" span={1}>
                <div
                  className={`see-btn ${loading ? "disabled" : ""}`}
                  onClick={() => {
                    openItem(index);
                  }}
                >
                  <Image
                    src={childrenOpen === index ? UpArrow : DownArrow}
                    alt="Icon"
                    height={16}
                    width={16}
                  />
                </div>
              </Col>
            </Row>
            {childrenOpen === index && (
              <div className="expand-revenue">
                <ExpandedRow
                  record={record}
                  chartLoader={chartLoader}
                  getSubListDetails={getSubListDetails}
                  getSubListDetailsQuarterly={getSubListDetailsQuarterly}
                  getSubListDetailsYearly={getSubListDetailsYearly}
                  subList={subList}
                  segementValue={segementValue}
                  loading={loading}
                  totalCount={totalCount}
                  tableLoader={tableLoader}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="page-no-data">
          <Empty description="No revenue details available" />
        </div>
      )}
    </div>
  );
};

export default ArticleTableCard;
