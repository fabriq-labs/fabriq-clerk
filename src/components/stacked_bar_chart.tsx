import React, { PureComponent, ReactNode } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


interface AppointmentStatusChartProps {
  data: any;
}

export default class AppointmentStatusChart extends PureComponent<AppointmentStatusChartProps> {
  render(): ReactNode {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={100}
          height={300}
          data={this.props.data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="scheduled"
            stackId="a"
            fill="#5D87FFD9"
            name="Scheduled"
            barSize={30}
          />
          <Bar
            dataKey="cancelled"
            stackId="a"
            fill="#31BEFFD9"
            name="Cancelled"
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
