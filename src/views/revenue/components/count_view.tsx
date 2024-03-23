import React from "react";
import { Tooltip } from "antd";

const CountView = (props: any) => {
  const { title, value, tooltipTitle } = props;
  function formatNumber(value: any) {
    if (value >= 1000000) {
      return (
        <div className="count-view">
          <span>
            {title !== "Ad Fill Rate" ? "$" : ""}
            {(value / 1000000).toFixed(2)}
          </span>
          <span className="count-prefix">m</span>
        </div>
      );
    } else if (value >= 1000) {
      return (
        <div className="count-view">
          <span>
            {title !== "Ad Fill Rate" ? "$" : ""}
            {(value / 1000).toFixed(2)}
          </span>
          <span className="count-prefix">k</span>
        </div>
      );
    } else {
      return (
        <div className="count-view">
          <span>
            {title !== "Ad Fill Rate" ? "$" : ""}
            {value?.toString()}
          </span>
        </div>
      );
    }
  }

  return (
    <div className="revenue-count-view-wrapper">
      <div className="revenue-count-view-content">
        <div className="revenue-count-title">
          <Tooltip title={tooltipTitle}>{title}</Tooltip>
        </div>
        <div className="revenue-count-value">{formatNumber(value)}</div>
      </div>
    </div>
  );
};

export default CountView;
