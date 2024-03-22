import DatePicker from "react-datepicker";
import React from "react";

export const DatepickerComponent = ({
  onChange,
  value,
  dateFormat,
  showMonthYearPicker,
  showQuarterYearPicker,
  showYearPicker,
  showDatePicker,
}: any) => {
  const handleDateChange = (date: any) => {
    if (onChange) {
      onChange(date);
    }
  };

  const handleInputKeyDown = (e: any) => {
    e.preventDefault();
  };

  const isDateSelectable = (date: any) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Allow selecting dates within the last 7 days
    return date >= sevenDaysAgo && date <= today;
  };

  if (showDatePicker) {
    return (
      <div className="datepicker-wrapper">
        <DatePicker
          className="datepicker-comp"
          selected={value}
          onChange={handleDateChange}
          filterDate={isDateSelectable}
          dateFormat="yyyy-MM-dd"
          onKeyDown={handleInputKeyDown}
        />
      </div>
    );
  }

  return (
    <div className="datepicker-wrapper">
      <DatePicker
        className="datepicker-comp"
        selected={value}
        maxDate={new Date()}
        showMonthYearPicker={showMonthYearPicker}
        showQuarterYearPicker={showQuarterYearPicker}
        showYearPicker={showYearPicker}
        onChange={handleDateChange}
        dateFormat={dateFormat}
        onKeyDown={handleInputKeyDown}
      />
    </div>
  );
};
