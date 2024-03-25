import React from "react";
import { FunnelChart, Funnel, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          border: "1px solid #cccccc",
          borderRadius: "4px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        <p style={{ margin: 0 }}>
          <span style={{ color: "#0747a6" }}>
            {(data?.avg * 100).toFixed(2)}%
          </span>
          {" of users scrolled to "}
          <span style={{ color: "#0747a6" }}>{data?.percentage}</span>
          {" of the story"}
        </p>
      </div>
    );
  }

  return null;
};

const FunnelRechart = ({ data = [] }) => {
  return (
    <FunnelChart width={400} height={200}>
      <Funnel
        dataKey="value"
        data={data}
        isAnimationActive={false}
        label={{
          position: "center",
          fontSize: 14,
          fill: "#000",
          fontWeight: 600
        }}
        neckWidth={50}
        neckHeight={25}
        fill="#cce4f5"
      />
      <Tooltip content={<CustomTooltip />} />
    </FunnelChart>
  );
};

export default FunnelRechart;
