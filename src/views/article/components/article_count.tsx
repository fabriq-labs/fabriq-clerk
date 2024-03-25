import React from "react";
import { Tooltip } from "antd";

const ArticleCountView = ({ title, value, tooltipTitle }: any) => {
  function formatNumber(value: any) {
    if (value >= 1000000) {
      return (
        <div className="count-view">
          <span>{(value / 1000000).toFixed(2)}</span>
          <span className="count-prefix">m</span>
        </div>
      );
    } else if (value >= 1000) {
      return (
        <div className="count-view">
          <span>{(value / 1000).toFixed(2)}</span>
          <span className="count-prefix">k</span>
        </div>
      );
    } else {
      return (
        <div className="count-view">
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
      <div className="count-view">
        <span>
          {minutes}:{formattedSeconds}
        </span>
      </div>
    );
  }

  return (
    <div className="article-count-view-wrapper">
      <div className="article-count-title">
        <Tooltip title={tooltipTitle}>{title}</Tooltip>
      </div>
      <div className="article-count-value">
        {title !== "Average Time Spent"
          ? formatNumber(value)
          : formatSecondsToTime(value)}
      </div>
      <div className="article-count-description">
        {title !== "Readers" ? "Minutes" : "-"}
      </div>
    </div>
  );
};

export default ArticleCountView;
