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
  handleChangeChartSingleSelect,
  selectedChartValueForSingle
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
            <DatepickerComponent
              value={selectedDate}
              showDatePicker
              onChange={handleDayChange}
            />
          </div>
        )}
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
      <div className="article-page-chart-select-audience">
        {segementValue === "daily" || segementValue === "monthly" ? (
          <Select
            onChange={handleChangeChart}
            mode="multiple"
            className="multi-select"
            value={selectedChartValue}
            getPopupContainer={(triggerNode) =>
              triggerNode?.parentNode || document.body
            }
          >
            <Select.Option value="users">Readers</Select.Option>
            <Select.Option value="new_users">New Readers</Select.Option>
            <Select.Option
              value="churned_users"
              disabled={segementValue === "daily" ? true : false}
            >
              Churned Readers
            </Select.Option>
          </Select>
        ) : (
          <Select
            onChange={handleChangeChartSingleSelect}
            style={{ width: "150px" }}
            value={selectedChartValueForSingle}
            getPopupContainer={(triggerNode) =>
              triggerNode?.parentNode || document.body
            }
          >
            <Select.Option value="users">Readers</Select.Option>
            <Select.Option value="new_users">New Readers</Select.Option>
            <Select.Option value="churned_users">Churned Readers</Select.Option>
          </Select>
        )}
      </div>
    </div>
  );
};

export default SegmentedChartSelector;
