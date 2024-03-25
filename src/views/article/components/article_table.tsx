import React, { useState } from "react";
import { Tooltip, Empty, Row, Col } from "antd";
import Link from "next/link";

import LineChartTiny from "@/components/chart/linechart_tiny";

const ArticleTableCard = (props: any) => {
  const {
    dataSource,
    loader,
    title,
    siteLink,
    segementValue,
    offsetValue,
    handleChangeSort,
    sortDirection,
    pageViewssortDirection,
    minichartLoader,
  } = props;

  return (
    <div className="article-table-card-wrapper">
      <div className="article-table-header">
        <Row gutter={[16, 16]} className="table-card-row">
          <Col
            className="table-heading"
            span={8}
            style={{ paddingLeft: "40px" }}
          >
            <Tooltip title="The name of the article">Article</Tooltip>
          </Col>
          <Col className="text-right table-heading" span={2}>
            <Tooltip title="Individuals who read this article.">
              Readers
            </Tooltip>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                float: "right",
              }}
            >
              <Icon
                type="caret-up"
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
              <Icon
                type="caret-down"
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
          <Col className="text-center table-heading title-hed" span={3}>
            <Tooltip title={title}>{title}</Tooltip>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                float: "right",
              }}
            >
              <Icon
                type="caret-up"
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  cursor: "pointer",
                  color:
                    pageViewssortDirection === "asc_nulls_last"
                      ? "blue"
                      : "gray",
                }}
                onClick={() => {
                  if (pageViewssortDirection !== "asc_nulls_last") {
                    handleChangeSort("page_views", "asc_nulls_last");
                  }
                }}
              />
              <Icon
                type="caret-down"
                style={{
                  fontSize: 12,
                  marginLeft: 4,
                  cursor: "pointer",
                  color:
                    pageViewssortDirection === "desc_nulls_last"
                      ? "blue"
                      : "gray",
                }}
                onClick={() => {
                  if (pageViewssortDirection !== "desc_nulls_last") {
                    handleChangeSort("page_views", "desc_nulls_last");
                  }
                }}
              />
            </div>
          </Col>
          <Col className="text-right table-heading" span={3}></Col>
          <Col className="text-center table-heading" span={2}>
            <Tooltip title="Percentage of users who visit another page on the site, after reading this article.">
              Recirculation (%)
            </Tooltip>
          </Col>
          <Col className="text-center table-heading" span={2}>
            <Tooltip title="How far down readers scroll on this article page.">
              Scroll Depth (%)
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={2}>
            <Tooltip title="Total number of times videos have been viewed.">
              Video Views
            </Tooltip>
          </Col>
          <Col className="text-right table-heading" span={2}>
            <Tooltip title="Revenue generated from advertisements on this article page.">
              Ad Revenue
            </Tooltip>
          </Col>
        </Row>
      </div>
      {loader ? (
        <div className="loader-wrapper">
          <Skeleton />
        </div>
      ) : dataSource?.length > 0 ? (
        dataSource?.map((record: any, index: any) => (
          <div className="article-table-body">
            <Row gutter={[16, 16]} className="table-card-row">
              <Col span={8}>
                <div style={{ display: "flex" }}>
                  <span className="list-article-key">
                    {offsetValue + index + 1}
                  </span>
                  <div className="list-article-content">
                    <div style={{ display: "flex" }}>
                      <Link
                        href={
                          segementValue === "real-time"
                            ? `/article/${record?.id}?max_age=-1`
                            : `/article/${record?.id}`
                        }
                        className="list-article-title"
                      >
                        <Tooltip title={record.title}>{record?.title}</Tooltip>
                      </Link>
                    </div>
                    <div className="list-article-category-details">
                      <span className="list-article-published">
                        {formationTimezone(record.published_date, "MMM DD")}
                      </span>
                      <span className="list-article-author-name">
                        <Link
                          href={`/author/${record?.author}`}
                          className="overview-author-div"
                          style={{ cursor: "pointer" }}
                        >
                          {record?.author}
                        </Link>
                      </span>
                      <span className="list-article-category-name">
                        {record.category}
                      </span>
                      <span className="link-text-article-page">
                        <a
                          href={`${siteLink}/story/${record?.title}/${record?.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={"/images/open-link.webp"}
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
              <Col className="text-right" span={2}>
                {record?.users}
              </Col>
              <Col span={3}>
                <div className="list-view-chart-wrapper">
                  <div
                    className="list-view-chart"
                    style={{ width: "100%", height: "100px" }}
                  >
                    <LineChartTiny
                      data={generateData(record?.series, record?.labels)}
                      dataKey={"pageViews"}
                      chartLoader={minichartLoader}
                      updatedLabels={record?.labels}
                    />
                  </div>
                </div>
              </Col>
              <Col className="text-right" span={3}>
                <div className="list-view-count">
                  <div className="list-view-minutes">
                    <div className="list-value">
                      {record?.total_time_spent
                        ? formatDurationCategory(record?.total_time_spent)
                        : 0}
                    </div>
                    <div className="list-label">Total Spent</div>
                  </div>
                  <div className="list-minutes-vistor">
                    <div className="list-value">
                      {record?.average_time_spent
                        ? formatDurationCategory(record?.average_time_spent)
                        : 0}
                    </div>
                    <div className="list-label">Per Visitor</div>
                  </div>
                </div>
              </Col>
              <Col className="text-right" span={2}>
                {record?.recirculation}
              </Col>
              <Col className="text-right" span={2}>
                {record?.scrolldepth}
              </Col>
              <Col className="text-right" span={2}>
                {format(record?.valid_play_views?.toLocaleString()) || 0}
              </Col>
              <Col className="text-right" span={2}>
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
  );
};

export default ArticleTableCard;
