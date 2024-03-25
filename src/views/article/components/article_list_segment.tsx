import React from "react";
import { Select } from "antd";

import RadioButtonGroup from "@/components/radio_button";
import DatePickerComponent from "@/components/date_picker";

const SegmentedChartSelector = ({
  segementValue,
  handleChangeSegement,
  chartLoader,
  selectedDate,
  selectedMonth,
  selectedQuarter,
  selectedYear,
  handleDayChange,
  handleMonthChange,
  handleQuarterlyChange,
  handleYearChange,
  selectedChartValue,
  handleChangeChart,
}: any) => {
  return (
    <div className="flex">
      <div className="flex flex-1">
        <RadioButtonGroup
          onChange={handleChangeSegement}
          value={segementValue}
          disabled={chartLoader}
        />
        {segementValue === "real-time" && (
          <div className="article-datepicker">
            <DatePickerComponent
              value={selectedDate}
              showDatePicker
              onChange={handleDayChange}
            />
          </div>
        )}
        {segementValue === "monthly" && (
          <div className="article-datepicker">
            <DatePickerComponent
              value={selectedMonth}
              onChange={handleMonthChange}
              showMonthYearPicker
              dateFormat="yyyy-MM"
            />
          </div>
        )}
        {segementValue === "quarterly" && (
          <div className="article-datepicker">
            <DatePickerComponent
              value={selectedQuarter}
              onChange={handleQuarterlyChange}
              showQuarterYearPicker
              dateFormat="yyyy-QQQ"
            />
          </div>
        )}
        {segementValue === "yearly" && (
          <div className="article-datepicker">
            <DatePickerComponent
              value={selectedYear}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
            />
          </div>
        )}
      </div>
      <div className="article-page-chart-select">
        <Select
          onChange={handleChangeChart}
          value={selectedChartValue}
          style={{ width: "100%" }}
          getPopupContainer={(triggerNode) =>
            triggerNode?.parentNode || document.body
          }
        >
          <Select.Option value="page_views">Page Views</Select.Option>
          <Select.Option value="users">Readers</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default SegmentedChartSelector;
