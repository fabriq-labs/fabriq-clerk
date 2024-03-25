import { Tooltip } from "antd";
import { formatNumber as format } from "@/utils/helper";

const ArticleCountView = ({ title, value, secondvalue, tooltipTitle }: any) => {
  const formatNumber = (number: any) => {
    if (number >= 1000000) {
      return (
        <div className="count-view">
          <span>{(number / 1000000).toFixed(2)}</span>
          <span className="count-prefix">m</span>
        </div>
      );
    } else if (number >= 1000) {
      return (
        <div className="count-view">
          <span>{(number / 1000).toFixed(2)}</span>
          <span className="count-prefix">k</span>
        </div>
      );
    } else {
      return (
        <div className="count-view">
          <span>{number?.toString()}</span>
        </div>
      );
    }
  };

  const formatSecondsToTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return (
      <div className="count-view">
        <span>
          {minutes}:{formattedSeconds}
        </span>
      </div>
    );
  };

  return (
    <div className="count-view-wrapper">
      <div className="count-view-content">
        <div className="count-title">
          <Tooltip title={tooltipTitle}>{title}</Tooltip>
        </div>
        <div className="count-value">
          {title !== "Average Time Spent" ? (
            title === "Churn" ? (
              <div className="count-view">
                {value !== "N/A" ? `${value} %` : value}
              </div>
            ) : (
              formatNumber(value)
            )
          ) : (
            formatSecondsToTime(value)
          )}
        </div>
        <div className="count-description">
          {secondvalue
            ? format(secondvalue)
            : ![
                "Readers",
                "New Readers",
                "Logged In / Anonymous Ratio",
                "Churn",
              ].includes(title)
            ? "Minutes"
            : "-"}
        </div>
      </div>
    </div>
  );
};

export default ArticleCountView;
