import React from "react";
import { Select } from "antd";

import RadioButtonGroup from "@/components/radiobutton";
import { DatepickerComponent } from "@/components/authors/date_picker";

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
          isDisableRealTime
        />
        {segementValue === "monthly" && (
          <div className="article-datepicker">
            <DatepickerComponent
              value={selectedMonth}
              onChange={handleMonthChange}
              showMonthYearPicker
              dateFormat="yyyy-MM"
            />
          </div>
        )}
        {segementValue === "quarterly" && (
          <div className="article-datepicker">
            <DatepickerComponent
              value={selectedQuarter}
              onChange={handleQuarterlyChange}
              showQuarterYearPicker
              dateFormat="yyyy-QQQ"
            />
          </div>
        )}
        {segementValue === "yearly" && (
          <div className="article-datepicker">
            <DatepickerComponent
              value={selectedYear}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
            />
          </div>
        )}
      </div>
      <div className="article-id-chart-header">
        <div className="article-page-chart-select">
          <Select
            onChange={handleChangeChart}
            value={selectedChartValue}
            getPopupContainer={(triggerNode) =>
              triggerNode?.parentNode || document.body
            }
          >
            <Select.Option value="total_revenue">Total Revenue</Select.Option>
            <Select.Option value="total_impressions">
              Total Impressions
            </Select.Option>
            <Select.Option value="ad_fill_rate">Ad Fill Rate</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SegmentedChartSelector;
