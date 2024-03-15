import React, { PureComponent, ReactNode } from "react";
import {
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  Area,
} from "recharts";

interface EarningsData {
  date: string;
  earnings: number;
}

interface ChartProps {
  data: any;
}

interface CustomTooltipProps {
  payload?: any;
  label?: string;
}

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return ` ${(value / 1000000).toFixed(2)}m`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`;
  } else {
    return value?.toString() || "";
  }
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ payload, label }) => {
  if (payload && payload.length) {
    const data = payload[0].payload as EarningsData;
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #cccccc",
          borderRadius: "4px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          fontSize: 12
        }}
      >
        <p
          style={{
            padding: "6px 10px",
            background: "#f2f3f4",
            fontWeight: "bold",
            margin: 0,
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px"
          }}
        >
          {data?.date}
        </p>
        <p style={{ padding: "8px 10px", margin: 0 }}>
          <span
            style={{ color: "#333", fontWeight: "bold", marginLeft: "5px" }}
          >
            Revenue: {formatNumber(data?.earnings)}
          </span>
        </p>
      </div>
    );
  }

  return null;
};


export default class EarningsLineChart extends PureComponent<ChartProps> {
  render(): ReactNode {
    return (
      <ResponsiveContainer width="100%" height={270}>
        <AreaChart width={200} height={200} data={this.props.data}>
          <Tooltip content={(props: CustomTooltipProps) => <CustomTooltip {...props} />} />
          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#31BEFFD9"
            strokeWidth={2}
            fill="#d0f1f9"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}
