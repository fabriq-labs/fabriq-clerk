import React from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "antd";

import { formatNumber } from "@/utils/helper";

const CustomTooltip = ({ payload, label, updatedLabels, isRevenue }: any) => {
  if (payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #cccccc",
          borderRadius: "4px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          fontSize: 12,
        }}
      >
        <p
          style={{
            padding: "6px 10px",
            background: "#f2f3f4",
            fontWeight: "bold",
            margin: 0,
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          {updatedLabels[label]}
        </p>
        <p style={{ padding: "8px 10px", margin: 0 }}>
          <span style={{ fontWeight: "400" }}>
            {isRevenue ? "Revenue:" : "Page Views:"}
          </span>
          <span
            style={{ color: "#333", fontWeight: "bold", marginLeft: "5px" }}
          >
            {formatNumber(data?.pageViews)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

const LineChartComponent = ({
  dataKey,
  data,
  updatedLabels,
  chartLoader = false,
  isRevenue,
}: any) => {
  if (chartLoader) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          fontWeight: 700,
          textAlign: "center",
          color: "#666",
        }}
      >
        <Skeleton active paragraph={{ rows: 0 }} title={{ width: "100%" }} />
      </div>
    );
  }

  if (!chartLoader && (!data || data.length === 0)) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
          textAlign: "center",
          color: "#666",
        }}
      >
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart height={100} data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#A3E0FF"
          dot={false}
          strokeWidth={3}
        />
        <Tooltip
          content={(props) => (
            <CustomTooltip
              {...props}
              updatedLabels={updatedLabels}
              isRevenue={isRevenue}
            />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
