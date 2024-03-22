// Category Component
import React, { useEffect, useState } from "react";
import { Row, Col, Skeleton, Tooltip } from "antd";
import moment from "moment";

import { formationTimezone } from "@/utils/helper";

const HeaderContainer = (props: any) => {
  const { title, value, loader, tooltip }: any = props;
  function formatNumber(value: any) {
    if (value >= 1000000) {
      return (
        <div className="header-count-view">
          <span>{(value / 1000000).toFixed(2)}</span>
          <span className="header-count-prefix">m</span>
        </div>
      );
    } else if (value >= 1000) {
      return (
        <div className="header-count-view">
          <span>{(value / 1000).toFixed(2)}</span>
          <span className="header-count-prefix">k</span>
        </div>
      );
    } else {
      return (
        <div className="header-count-view">
          <span>{value?.toString()}</span>
        </div>
      );
    }
  }

  function formatSecondsToTime(seconds: any) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Add leading zero for seconds less than 10
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return (
      <div className="header-count-view">
        <span>
          {minutes}:{formattedSeconds}
        </span>
      </div>
    );
  }

  return (
    <div className="header-container-wrapper">
      <div className="header-container-title">
        <Tooltip title={tooltip}>{title}</Tooltip>
      </div>
      <div className="header-container-value">
        {loader ? (
          <div>
            <Skeleton active paragraph={{ rows: 0 }} />
          </div>
        ) : title !== "Average Time Spent" ? (
          formatNumber(value)
        ) : (
          formatSecondsToTime(value)
        )}
      </div>
      {(title === "Total Time Spent" || title === "Average Time Spent") && (
        <div className="min-description">Minutes</div>
      )}
    </div>
  );
};

/* const formatDurationForCategory = (value) => {
  let formattedDuration;
  const duration = moment.duration(value, "seconds");
  formattedDuration = formatDuration(duration, "18px", "24px");
  return formattedDuration;
}; */

const Category = (props: any) => {
  const {
    id,
    view,
    totalNumber,
    data,
    imageIndex,
    authorName,
    firstArticlePublished,
    title,
    published,
    category,
    articleAuthorName,
    loader,
    siteLink,
  } = props;
  const [headerData, setHeaderData] = useState<any>([]);

  useEffect(() => {
    setHeaderData(data);
  }, [data]);

  let publishedDate = published;

  const formattedDate = formationTimezone(publishedDate, "MMMM Do YYYY");

  function secondsToMinutes(seconds: any) {
    const duration = moment.duration(seconds, "seconds");
    const minutes = Math.floor(duration.asMinutes());
    return minutes;
  }

  const total_time_spent_minutes: any = secondsToMinutes(
    headerData?.total_time_spent ? headerData?.total_time_spent : 0
  );

  /* const average_time_spent_minutes = secondsToMinutes(
    headerData?.average_time_spent ? headerData?.average_time_spent : 0
  ); */

  let ImageValue =
    imageIndex <= 4
      ? `/images/blog-${imageIndex + 1}.jpg`
      : `/images/blog-${imageIndex - 4}.jpg`;

  return (
    <div className="category-wrapper">
      <div className="category-content">
        {view === "author" ? (
          <>
            <div
              className={
                view === "author"
                  ? "heading-category-author"
                  : "heading-category"
              }
            >
              {authorName}
            </div>
          </>
        ) : (
          <>
            <div className="heading-category">{category}</div>
          </>
        )}

        <div
          className={
            view === "author" ? "heading-image" : "heading-image-article"
          }
        >
          <img
            src={
              view === "author"
                ? headerData?.image_url ||
                  `/images/avatars/image-${imageIndex + 1}.png`
                : ImageValue
            }
            style={{ width: "100px" }}
            alt="logo"
            className={
              view === "author" ? "author-logo-img" : "article-logo-img"
            }
          />
        </div>
        {view === "author" && (
          <>
            {/* <div
              className={
                view === "author"
                  ? "heading-category-author"
                  : "heading-category"
              }
            >
              {authorName}
            </div> */}
            <div className="">
              <div style={{ fontWeight: "600", textAlign: "center" }}>
                {moment(firstArticlePublished).format("MMM D, YYYY")}
              </div>
              <div
                style={{
                  textAlign: "center",
                  color: "#879eb0",
                  fontSize: "12px",
                }}
              >
                First article published{" "}
              </div>
            </div>
          </>
        )}
      </div>
      {view === "article" ? (
        <>
          <div className="title-content">
            <div className="heading-article-title">{title}</div>
            <div className="heading-first-published">
              <div className="first-published-value">&nbsp;{formattedDate}</div>
              <div className="author-name">&nbsp;{articleAuthorName}</div>
              <div className="article-link-text">
                {" "}
                <a
                  href={`${siteLink}/story/${title}/${id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={"/images/open-link.webp"}
                    alt="link"
                    style={{
                      width: "12px",
                      height: "12px",
                      marginBottom: "2px",
                    }}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="header-card-wrapper">
            <Row gutter={[16, 24]}>
              <Col span={12}>
                <HeaderContainer
                  title="Page Views"
                  value={headerData?.page_views ? headerData.page_views : 0}
                  loader={loader}
                  tooltip="Number of views on the article."
                />
              </Col>
              <Col span={12}>
                {" "}
                <HeaderContainer
                  title="Readers"
                  value={headerData?.users ? headerData.users : 0}
                  loader={loader}
                  tooltip="Individuals who read this article."
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {" "}
                <HeaderContainer
                  title="Total Time Spent"
                  value={
                    headerData?.total_time_spent ? total_time_spent_minutes : 0
                  }
                  loader={loader}
                  tooltip="Total amount of time all users have spent on this article page."
                />
              </Col>
              <Col span={12}>
                {" "}
                <HeaderContainer
                  title="Average Time Spent"
                  value={
                    headerData?.average_time_spent
                      ? headerData?.average_time_spent
                      : 0
                  }
                  loader={loader}
                  tooltip="Average amount of time a user spends on this article page."
                />
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <>
          <div className="author-title-content">
            <div className="heading-total">
              <div className="total-article-value">
                &nbsp;{totalNumber?.toLocaleString()}
              </div>
              <div className="total-article-title">
                Total Articles published
              </div>
            </div>
            <div className="header-card-wrapper">
              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <HeaderContainer
                    title="Total Time Spent"
                    value={
                      headerData?.total_time_spent
                        ? total_time_spent_minutes
                        : 0
                    }
                    loader={loader}
                    tooltip="Total amount of time all users have spent."
                  />
                </Col>
                <Col span={12}>
                  {" "}
                  <HeaderContainer
                    title="Page Views"
                    value={headerData?.page_views ? headerData.page_views : 0}
                    loader={loader}
                    tooltip="Total number of pages viewed on the website."
                  />
                </Col>
              </Row>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Category;
