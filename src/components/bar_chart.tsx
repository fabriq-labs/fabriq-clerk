import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

interface ChartProps {
  data: any;
}

export default class LineChartComponent extends PureComponent<ChartProps> {
  render() {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={this.props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="admitted"
            fill="#5D87FFD9"
            activeBar={<Rectangle />}
            barSize={26}
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="discharged"
            fill="#31BEFFD9"
            activeBar={<Rectangle />}
            barSize={26}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
