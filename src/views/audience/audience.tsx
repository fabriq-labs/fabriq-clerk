"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@components/layout";
import moment from "moment";

import ErrorResult from "@/components/error_result";
import SegmentedChartSelector from "@/components/list_segment";

export default function Audience() {
  const [currentInfo, setCurrentInfo] = useState(null);
  const [segementValue, setSegementValue] = useState("daily");
  const [selectedChartValue, setSelectedChartValue] = useState([
    "users",
    "new_users",
  ]);
  const [selectedChartValueForSingle, setselectedChartValueForSingle] =
    useState("users");
  const [isError, setIsError] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedQuarter, setSelectedQuarter] = useState(new Date());
  const [categoryLimit, setCategoryLimit] = useState("top_five_categories");
  const [userActivity, setUserActivity] = useState([]);
  const [referrerSeries, setReferrerSeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });
  const [clientWiseSeries, setClientWiseSeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });
  const [osWiseSeries, setosWiseSeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });

  const [chartSeries, setChartSeries] = useState({
    labels: [],
    series: [],
  });

  const [scatterSeries, setScatterSeries] = useState({
    labels: [],
    series: [],
  });

  const [scatterSeriesAnonymous, setScatterSeriesAnonymous] = useState({
    labels: [],
    series: [],
  });

  const [categorySeries, setcategorySeries] = useState({
    labels: [],
    series: [],
    colors: [],
  });

  const [audienceList, setAudienceList] = useState({
    labels: [],
    series: [],
    name: "",
  });

  const [cohortData, setCohortData] = useState(null);

  const handleChangeSegement = (e: any) => {
    setSegementValue(e.target.value);

    const currentDate = new Date();

    clearItems();

    if (e.target.value === "monthly") {
      setSelectedChartValue(["users", "new_users", "churned_users"]);
      handleMonthChange(currentDate);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentDate);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentDate);
    } else {
      setSelectedChartValue(["users", "new_users"]);
      handleDayChange(currentDate);
    }
  };

  const clearItems = () => {
    setReferrerSeries({
      labels: [],
      series: [],
      colors: [],
    });

    setScatterSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));

    setScatterSeriesAnonymous((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));

    setChartSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
    }));

    setReferrerSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setClientWiseSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setosWiseSeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setcategorySeries((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      colors: [],
    }));

    setAudienceList((prevState) => ({
      ...prevState,
      labels: [],
      series: [],
      name: "",
    }));

    setCohortData(null);
    setUserActivity([]);
    setCurrentInfo(null);
  };

  const handleDayChange = (date: any) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(date);
    clearItems();
    // getRealtimeData(formattedDate);
  };

  const handleMonthChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    const selectedMonth = date.getMonth() + 1;
    setSelectedMonth(date);
    clearItems();
    // getAuidenceMonthly(selectedMonth, selectedYear);
  };

  const handleYearChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    setSelectedYear(date);
    clearItems();
    // getAuidenceYearly(selectedYear);
  };

  const handleQuarterlyChange = (date: any) => {
    const selectedYear = date?.getFullYear();
    // const selectedQuarter = getQuarterFromDate(date);
    setSelectedQuarter(date);
    clearItems();
    // getAuidenceQuarterly(selectedQuarter, selectedYear);
  };

  return (
    <Layout>
      <div className="audience-content">
        <SegmentedChartSelector
          segementValue={segementValue}
          handleChangeSegement={handleChangeSegement}
          chartLoader={loader}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          selectedQuarter={selectedQuarter}
          selectedYear={selectedYear}
          handleDayChange={handleDayChange}
          handleMonthChange={handleMonthChange}
          handleQuarterlyChange={handleQuarterlyChange}
          handleYearChange={handleYearChange}
          selectedChartValue={selectedChartValue}
          // handleChangeChart={handleChangeChart}
        />
        {loader ? (
          <div>
            <div className="loader-cotainer">
              <div className="loader"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="article-page-error-result">
            {" "}
            <ErrorResult />
          </div>
        ) : (
          <>""</>
        )}
      </div>
    </Layout>
  );
}
