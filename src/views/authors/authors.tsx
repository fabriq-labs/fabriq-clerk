"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Table, Tooltip, Select, Radio, Skeleton } from "antd";
import { useParams, useRouter } from "next/navigation";
import Layout from "@components/layout";
import StackedBarChart from "@/components/chart/stackedBarChart";
import { formatNumber, formationTimezone, getQuarterFromDate } from "@/utils/helper";
import moment from "moment";
import {
  SocialCard,
  ReferralCard,
  SearchCard,
  InternalCard,
  DirectCard,
  DetailsCard,
  BreakDownData
} from "./author_cards"
import { DatepickerComponent } from "@/components/authors/date_picker";
import ErrorResult from "@/components/ErrorResult/error_result";
import Category from "@/components/Category/category";
import LineChart from "@/components/chart/linechart";
import BarChart from "@/components/barchart";


export default function Authors() {
  const [data, setData] = useState<any>([]);
  const [countryListLabel, setCountryListLabel] = useState<any>([]);
  const [countryListValue, setCountryListValue] = useState<any>([]);
  const [dataArray, setDataArray] = useState([]);
  const [distriputionData, setDistributionData] = useState<any>({
    labels: [],
    series: [],
    name: "",
    referrer: null
  });
  const [headerData, setHeaderData] = useState<any>([]);
  const [selectedDistribution, setSelectedDistribution] =
    useState("city_distribution");
  const [selectedChartValue, setSelectedChartValue] = useState<any>("");
  const [imageIndex, setImageIndex] = useState<any>(0);
  const [loader, setLoader] = useState<any>(true);
  const [tableLoader, setTableLoader] = useState<any>(false);
  const [segementValue, setSegementValue] = useState<any>("real-time");
  const [selectedMonth, setSelectedMonth] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<any>(null);
  const [siteAvg, setSiteAvg] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<any>(new Date());
  const [authorCurrentChartResponse, setAuthorCurrentChartResponse] = useState<any>(
    []
  );
  const [authorAverageChartResponse, setAuthorAverageChartResponse] = useState<any>(
    []
  );
  const [historicalChartResponse, setHistoricalChartResponse] = useState<any>([]);
  const [barchartResponse, setBarChartResponse] = useState<any>({
    labels: [],
    series: [],
    name: ""
  });
  const [topAuthorsMedium, setAuthorsMedium] = useState<any>({});
  const { Option } = Select;

  const [authorChartData, setAuthorChartData] = useState<any>([]);
  const [isError, setIsError] = useState(false);
  const [selectedBreakdownValue, setSelectedBreakdownValue] = useState<any>("");
  const [breakdownDataObject, setBreakDownDataObject] = useState<any>({});
  const [tableVistitorData, setTableVisitorData] = useState<any>([]);
  const { authorId } = useParams();
  // const location = useLocation();
  // let siteDetails =
  //     localStorage.getItem("view_id") !== "undefined" &&
  // JSON.parse(localStorage.getItem("view_id"));
  const time_interval = localStorage.getItem("time_interval");
  const timeInterval = time_interval ? parseInt(time_interval) : 30 * 60 * 1000;

  useEffect(() => {
    const intervalId = setInterval(() => {
      getRealtimeData();
    }, timeInterval);

    setSelectedChartValue("page_views");
    setSelectedBreakdownValue("social");

    getRealtimeData();

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [authorId]);

  const getRealtimeData = (date?: any) => {
    setTableLoader(true);
    setIsError(false);
    let period_date = date || formationTimezone(moment(), "YYYY-MM-DD");
  };
  // useEffect(() => {
  //     const state = location.state;
  //     if (state?.image) {
  //       setImageIndex(state.image);
  //     }
  //   }, []);

  useEffect(() => {
    if (authorCurrentChartResponse && authorAverageChartResponse) {
      realtimeChartDataFormat(selectedChartValue);
    }
  }, [authorCurrentChartResponse, authorAverageChartResponse]);

  const realtimeChartDataFormat = (value: any) => {
    if (authorCurrentChartResponse && authorAverageChartResponse) {
      const lableValue = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23
      ];

      const currentUserValues = lableValue.map((hour) => {
        const matchingData: any = authorCurrentChartResponse.find(
          (obj: any) =>
            (obj?.period_hour + 1 === 24 ? 0 : obj?.period_hour + 1) === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      const currentPageViewsValues = lableValue.map((hour) => {
        const matchingData: any = authorCurrentChartResponse.find(
          (obj: any) =>
            (obj?.period_hour + 1 === 24 ? 0 : obj?.period_hour + 1) === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averagePageViewsValue = lableValue.map((hour) => {
        const matchingData: any = authorAverageChartResponse.find(
          (obj: any) =>
            (obj?.period_hour + 1 === 24 ? 0 : obj?.period_hour + 1) === hour
        );
        return matchingData ? matchingData.page_views : 0;
      });

      const averageUserValues = lableValue.map((hour) => {
        const matchingData: any = authorAverageChartResponse.find(
          (obj: any) =>
            (obj?.period_hour + 1 === 24 ? 0 : obj?.period_hour + 1) === hour
        );
        return matchingData ? matchingData.users : 0;
      });

      if (
        currentPageViewsValues.length > 0 &&
        averagePageViewsValue.length > 0
      ) {
        let chartSeriesFormat: any = {
          series: [
            {
              name: "Today",
              data:
                value === "page_views"
                  ? currentPageViewsValues
                  : currentUserValues
            },
            {
              name: "Average",
              data:
                value === "page_views"
                  ? averagePageViewsValue
                  : averageUserValues
            }
          ],
          label: lableValue
        };

        setAuthorChartData(chartSeriesFormat);
      }
    }
  };


  const getMonthlyData = (value: any, year: any) => {
    setTableLoader(true);
    setIsError(false);
    const partial_period_date = `${year}-${value
      ?.toString()
      .padStart(2, "0")}%`;

  };

  const getQuarterlyData = (value: any, year: any) => {
    setTableLoader(true);
    setIsError(false);

  };

  const getYearlyData = (value: any) => {
    setTableLoader(true);
    setIsError(false);
  };

  const generateLineChartData = (chartData: any) => {
    const labels = chartData.map((data: any) =>
      moment(data?.period_date).format("MMM DD")
    );

    return labels;
  };

  const generateDataMonthly = (data: any, val: any) => {
    const chartData = data?.AuthorsDaily;
    const labels = generateLineChartData(chartData);
    const chartOption = val || selectedChartValue;

    const getSeriesConfig = (name: any, key: any) => {
      const series = chartData?.map((data: any) => data?.[key]);
      return {
        name,
        type: "line",
        data: series.filter((value: any) => value !== undefined && value !== null),
        yaxis: "line-y-axis"
      };
    };

    let chartSeriesFormat = {
      series: [],
      label: labels
    };

    // switch (chartOption) {
    //     case "users":
    //         chartSeriesFormat.series = [getSeriesConfig("Readers", "users")];
    //         break;
    //     default:
    //         chartSeriesFormat.series = [
    //             getSeriesConfig("Page Views", "page_views")
    //         ];
    // }

    // setAuthorChartData(chartSeriesFormat);
  };

  const generateDataForQuarterChart = (data: any, quarter: number, value: string) => {
    const list = data?.AuthorsMonthly;
    if (list?.length > 0) {
      const labels = Array.from({ length: 3 }, (_, i) => {
        const startMonth = (quarter - 1) * 3 + 1;
        const month = startMonth + i;
        return month;
      });

      let selectedItem = "";
      if (value) {
        selectedItem = value;
      } else {
        selectedItem = selectedChartValue;
      }

      const outputArray = labels.map((label: any) => {
        const day = parseInt(label);
        const dataItem = list?.find((item: { period_month: number; }) => item?.period_month === day);

        return [
          day,
          dataItem
            ? selectedItem === "page_views"
              ? dataItem.page_views
              : dataItem.users
            : 0
        ];
      });

      let series = [
        {
          name: selectedItem === "page_views" ? "Page Views" : "Users",
          data: outputArray
        }
      ];

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      const yValues = series?.[0]?.data.map((entry) => entry?.[1]);
      const monthLabels = labels.map((number) => monthNames[number - 1]);
      setBarChartResponse((prevState: any) => ({
        ...prevState,
        labels: monthLabels,
        series: yValues,
        name: selectedItem === "page_views" ? "Page Views" : "Users"
      }));
    }

    if (data?.AuthorsQuaterly?.length > 0) {
      const list = data?.AuthorsQuaterly;
      const areaJsonData: any[] = [];
      list.forEach((areadata: { medium_distribution: any; }) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const newData = areaJsonData.map((obj) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total = Object.values(newData[0])?.reduce(
        (acc, value) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc: any, [name, value]) => {
          acc[name] = {
            value,
            percentage: ((value / total) * 100)?.toFixed(2)
          };
          return acc;
        },
        {}
      );

      setDistributionData((prevState: any) => ({
        ...prevState,
        series: result,
        referrer
      }));
    }
  };

  const formatTopMedium = (apiData: any[]) => {
    const formattedData: any = {};

    apiData.forEach((entry: { refr_medium: any; referer_site: any; refr_source: any; }) => {
      const refrMedium = entry?.refr_medium;
      let refrValue;
      if (refrMedium === "unknown") {
        refrValue = entry?.referer_site;
      } else if (refrMedium === "internal") {
        refrValue = entry?.referer_site;
      } else {
        refrValue = entry?.refr_source;
      }

      formattedData[refrMedium] = refrValue;
    });

    return formattedData;
  };

  const generateDataForYearChart = (data: { AuthorsMonthly: any; AuthorsYearly: string | any[]; }, year: any, value: string) => {
    const list = data?.AuthorsMonthly;
    const labels = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return month;
    });

    let selectedItem = "";
    if (value) {
      selectedItem = value;
    } else {
      selectedItem = selectedChartValue;
    }

    const outputArray = labels.map((label: any) => {
      const day = parseInt(label);
      const dataItem = list.find(
        (item: any) => item.period_year === year && item?.period_month === day
      );

      return [
        day,
        dataItem
          ? selectedItem === "page_views"
            ? dataItem.page_views
            : dataItem.users
          : 0
      ];
    });

    let series = [
      {
        name: selectedItem === "page_views" ? "Page Views" : "Users",
        data: outputArray
      }
    ];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const yValues = series?.[0]?.data.map((entry) => entry?.[1]);
    const monthLabels = labels.map((number) => monthNames[number - 1]);
    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: monthLabels,
      series: yValues,
      name: selectedItem === "page_views" ? "Page Views" : "Users"
    }));

    if (data?.AuthorsYearly?.length > 0) {
      const list: any = data?.AuthorsYearly;

      const areaJsonData: any = [];
      list.forEach((areadata: any) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const newData = areaJsonData.map((obj: any) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total: any = Object.values(newData[0])?.reduce(
        (acc: any, value: any) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]: any) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc: any, [name, value]: any) => {
          acc[name] = {
            value,
            percentage: ((value / total) * 100)?.toFixed(2)
          };
          return acc;
        },
        {}
      );

      setDistributionData((prevState: any) => ({
        ...prevState,
        series: result,
        referrer
      }));
    }
  };

  const areaChartData = (data: any) => {
    const areaJsonData: any = [];
    if (data?.length > 0) {
      data.forEach((areadata: any) => {
        let result = areadata?.medium_distribution;

        if (typeof result === "string") {
          result = JSON.parse(result);
        }

        areaJsonData.push(result);
      });

      const newData = areaJsonData.map((obj: { [x: string]: any; }) => {
        const newObj = {
          Social: obj["Social"] ? obj["Social"] : obj["social"] || 0,
          Referral: obj["Referral"] ? obj["Referral"] : obj["unknown"] || 0,
          Search: obj["search"] || 0,
          Internal: obj["Internal"] ? obj["Internal"] : obj["internal"] || 0,
          Direct: obj["Direct"] ? obj["Direct"] : obj["Other"] || 0
        };
        return newObj;
      });

      // Calculate the total sum of all values
      const total: any = Object.values(newData[0])?.reduce(
        (acc: any, value: any) => acc + value,
        0
      );

      // Convert each value to percentage and create the new format
      const result = Object.entries(newData[0])?.map(([name, value]: any) => ({
        name,
        data: [(value / total) * 100]
      }));

      const referrer = Object.entries(newData[0]).reduce(
        (acc: any, [name, value]: any) => {
          acc[name] = {
            value,
            percentage: ((value / total) * 100)?.toFixed(2)
          };
          return acc;
        },
        {}
      );

      setDistributionData((prevState: any) => ({
        ...prevState,
        series: result,
        referrer
      }));
    }
  };

  const chartData = (data: { country_distribution: any; }[]) => {
    // Country Distribution
    if (data?.[0]?.country_distribution) {
      let dataValue = data?.[0]?.country_distribution;

      if (typeof dataValue === "string") {
        dataValue = JSON.parse(dataValue);
      }

      const arr = Object.entries(dataValue);

      // Sort the array in descending order based on the values
      arr.sort((a: any, b: any) => b[1] - a[1]);

      // Convert the sorted array back into an object
      const sortedObj = Object.fromEntries(arr);
      const countryKeysArray: any = [];
      Object.keys(sortedObj).forEach((key) => {
        countryKeysArray.push(key);
      });
      let objValue: any = Object.values(sortedObj);

      // Select top 15 items
      countryKeysArray.splice(15);
      objValue.splice(15);

      setCountryListLabel(countryKeysArray);
      setCountryListValue(objValue);
    }
  };

  const convertDistribution = (data: string | any[], selectedItem: string) => {
    if (data?.length > 0 && selectedItem === "city_distribution") {
      let dataObj = data[0]?.country_wise_city;

      if (typeof dataObj === "string") {
        dataObj = JSON.parse(dataObj);
      }

      let districtData = dataObj?.["US"];

      const districtKeysArray: any = Object.keys(districtData);
      const districtValuesArray: any = Object.values(districtData);

      // Sort the districts in descending order based on the values
      const sortedIndices = districtValuesArray
        .map((_: any, index: any) => index)
        .sort((a: string | number, b: string | number) => districtValuesArray[b] - districtValuesArray[a]);

      const sortedDistrictKeys = sortedIndices.map(
        (index: string | number) => districtKeysArray[index]
      );
      const sortedDistrictValues = sortedIndices.map(
        (index: string | number) => districtValuesArray[index]
      );

      setCountryListLabel(sortedDistrictKeys);
      setCountryListValue(sortedDistrictValues);
    }
  };

  function parseIfString(value: string) {
    return typeof value === "string" ? JSON.parse(value) : value;
  }

  const trafficSourceFormat = (data: any, key: string | number) => {
    let trafficSourceInfo = [];
    let data_social = {};
    let data_device = {};
    let totalUsers = 0;
    let newUsersPercentage = 0;
    let usersPercentage = 0;

    const segmentData: any = {
      "real-time": data,
      monthly: data,
      yearly: data,
      quarterly: data
    };
    const segment = segmentData[key];

    if (segment) {
      trafficSourceInfo = segment;
      data_social = parseIfString(segment?.source_distribution);
      data_device = parseIfString(segment?.device_distribution);
      totalUsers = segment?.users + segment?.new_users;
      newUsersPercentage = (segment?.new_users / totalUsers) * 100;
      usersPercentage = ((totalUsers - segment?.new_users) / totalUsers) * 100;
    }

    if (trafficSourceInfo && Object.keys(trafficSourceInfo)?.length > 0) {
      const totalSumSocial: any =
        data_social &&
        Object.keys(data_social).length > 0 &&
        Object.values(data_social).reduce((acc: any, val: any) => acc + val, 0);

      const totalSumDevice: any =
        data_device &&
        Object.keys(data_device).length > 0 &&
        Object.values(data_device).reduce((acc: any, val: any) => acc + val, 0);

      const percentageSocial: any = {};
      const arrSocial: any = [];
      const percentageDevice: any = {};
      const arrDevice: any = [];

      if (data_social && Object.keys(data_social)?.length > 0) {
        for (const [category, value] of Object.entries<number>(data_social)) {
          percentageSocial[category] = (value / totalSumSocial) * 100;
        }
      }

      if (data_device && Object.keys(data_device)?.length > 0) {
        for (const [category, value] of Object.entries<number>(data_device)) {
          percentageDevice[category] = (value / totalSumDevice) * 100;
        }
      }
      if (percentageSocial && Object.keys(percentageSocial).length > 0) {
        for (const key in percentageSocial) {
          arrSocial.push({ name: key, data: [percentageSocial[key]] });
          arrSocial.sort((a: any, b: any) => b?.data[0] - a?.data[0]);
        }
      }

      if (percentageDevice && Object.keys(percentageDevice).length > 0) {
        for (const key in percentageDevice) {
          arrDevice.push({ name: key, data: [percentageDevice[key]] });
          arrDevice.sort((a: any, b: any) => b?.data[0] - a?.data[0]);
        }
      }

      let breakdownTempValue = {
        social: arrSocial,
        device: arrDevice,
        visitor: [
          { name: "New visitor", data: [newUsersPercentage] },
          { name: "Returning Visitor", data: [usersPercentage] }
        ]
      };

      const tableData = breakdownTempValue.social.map((item: any) => {
        return {
          key: item.name,
          name: item.name,
          data: item.data[0]
        };
      });
      setTableVisitorData(tableData);
      setBreakDownDataObject(breakdownTempValue);
    } else {
      let breakdownTempValue = {
        social: [],
        device: [],
        visitor: []
      };

      const tableData: any = breakdownTempValue?.social?.map((item: any) => {
        return {
          key: item?.name,
          name: item?.name,
          data: item?.data?.[0]
        };
      });

      setTableVisitorData(tableData);
      setBreakDownDataObject(breakdownTempValue);
    }
  };


  const handleChangeChart = (value: any) => {
    setSelectedChartValue(value);
    if (segementValue === "monthly") {
      generateDataMonthly(historicalChartResponse, value);
    } else if (segementValue === "yearly") {
      generateDataForYearChart(historicalChartResponse, selectedYear, value);
    } else if (segementValue === "quarterly") {
      generateDataForQuarterChart(
        historicalChartResponse,
        selectedQuarter,
        value
      );
    } else {
      realtimeChartDataFormat(value);
    }
  };

  const handleChangeSegement = (e: any) => {
    let real_time_date = localStorage.getItem("real_time_date");
    setSegementValue(e.target.value);
    const currentDate = real_time_date ? new Date(real_time_date) : new Date();

    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: [],
      series: []
    }));
    setAuthorChartData([]);

    setSelectedDistribution("city_distribution");
    setSelectedBreakdownValue("social");

    if (e.target.value === "monthly") {
      handleMonthChange(currentDate);
    } else if (e.target.value === "yearly") {
      handleYearChange(currentDate);
    } else if (e.target.value === "quarterly") {
      handleQuarterlyChange(currentDate);
    } else {
      handleDayChange(currentDate);
    }
  };

  const handleDayChange = (date: any | moment.Moment | (string | number)[] | moment.MomentInputObject | null | undefined) => {
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: [],
      series: []
    }));
    setAuthorChartData([]);

    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(date);
    getRealtimeData(formattedDate);
  };

  const handleMonthChange = (date: any) => {
    setSelectedMonth(date);
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: [],
      series: []
    }));
    setAuthorChartData([]);

    const year = date?.getFullYear();
    const month = date.getMonth() + 1;
    getMonthlyData(month, year);
  };

  const handleYearChange = (date: any) => {
    const year = date?.getFullYear();
    getYearlyData(year);
    setSelectedYear(date);
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
  };

  const handleQuarterlyChange = (date: any) => {
    setSelectedQuarter(date);
    setDistributionData({
      labels: [],
      series: [],
      name: "",
      referrer: null
    });
    setCountryListLabel([]);
    setCountryListValue([]);
    setBarChartResponse((prevState: any) => ({
      ...prevState,
      labels: [],
      series: []
    }));
    setAuthorChartData([]);

    const year = date?.getFullYear();
    const quarter = getQuarterFromDate(date);
    getQuarterlyData(quarter, year);
  };

  const handleClickBack = () => {
    // navigate("/content/author");
  };

  const handleChangeDistribution = (value: React.SetStateAction<string>) => {
    setSelectedDistribution(value);
    if (value === "city_distribution") {
      convertDistribution(dataArray, value);
    } else {
      chartData(dataArray);
    }
  };

  const handleChangeBreakdownSegment = (e: any) => {
    setSelectedBreakdownValue(e.target.value);
    const tableData = breakdownDataObject[e.target.value].map((item: { name: any; data: any[]; }) => {
      return {
        key: item.name,
        name: item.name,
        data: item.data[0]
      };
    });
    setTableVisitorData(tableData);
  };

  const formattedLabels = (labels: any[]) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Function to get the number of days in the current month
    const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Generate the labels array for the current month
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const formattedLabels = labels.map((day: number) => {
      if (day <= daysInMonth) {
        return `${monthNames[currentMonth]} ${day}`;
      } else {
        return ""; // Empty string for days beyond the current month
      }
    });

    return formattedLabels;
  };

  let totalNumberArticles = data?.articles_aggregate?.aggregate?.count;
  let firstArticlePublished = data?.articles?.[0]?.published_date;
  let helmetTitle = data?.name || "Name";

  let chartTitle = "";
  if (segementValue === "real-time") {
    chartTitle = "Time of Day";
  } else if (segementValue === "monthly") {
    chartTitle = "Day of Month";
  } else if (segementValue === "quarterly") {
    chartTitle = "Month of Quarter";
  } else {
    chartTitle = "Month of Year";
  }

  const columnsVisitor = [
    {
      title: "Visitor",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Percentage",
      dataIndex: "data",
      key: "data",
      render: (text:any) => <div>{`${text?.toFixed(2)} %`}</div>
    }
  ];

  const timeLabels = authorChartData?.label?.map((item:any) => {
    const formattedTime = moment(selectedDate)
      .hour(item)
      .minute(0)
      .format("MMM D, h:mm a");
    return formattedTime;
  });
  return (
    <Layout>
      <div className="article-wrapper">
        <div className="author-content">
          <div style={{ display: "flex", marginTop: 25 }}>
            <div className="back-image" onClick={handleClickBack}>
              <img src="/images/back.png" alt="back" width={30} height={30} />
            </div>
            <div className="article-segement-wrapper">
              <Radio.Group
                onChange={handleChangeSegement}
                value={segementValue}
                disabled={loader}
              >
                <Radio.Button value="real-time">Real-Time</Radio.Button>
                <Radio.Button value="monthly">Month</Radio.Button>
                <Radio.Button value="quarterly">Quarter</Radio.Button>
                <Radio.Button value="yearly">Year</Radio.Button>
              </Radio.Group>
            </div>
            {segementValue === "real-time" && (
              <div className="article-DatepickerComponent">
                <DatepickerComponent
                  value={selectedDate}
                  showDatePicker
                  onChange={handleDayChange}
                />
              </div>
            )}
            {segementValue === "monthly" && (
              <div className="article-DatepickerComponent">
                <DatepickerComponent
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  showMonthYearPicker
                  dateFormat="yyyy-MM"
                />
              </div>
            )}
            {segementValue === "quarterly" && (
              <div className="article-DatepickerComponent">
                <DatepickerComponent
                  value={selectedQuarter}
                  onChange={handleQuarterlyChange}
                  showQuarterYearPicker
                  dateFormat="yyyy-QQQ"
                />
              </div>
            )}
            {segementValue === "yearly" && (
              <div className="article-DatepickerComponent">
                <DatepickerComponent
                  value={selectedYear}
                  onChange={handleYearChange}
                  showYearPicker
                  dateFormat="yyyy"
                />
              </div>
            )}
          </div>
          {loader ? (
            <div>
              <Skeleton />
            </div>
          ) : isError ? (
            <div className="author-error-result">
              {" "}
              <ErrorResult />
            </div>
          ) : (
            <div className="article-content">
              <div className="heading-row-category">
                <Category
                  id={authorId}
                  view="author"
                  totalNumber={totalNumberArticles}
                  data={headerData}
                  imageIndex={imageIndex}
                  authorName={helmetTitle}
                  firstArticlePublished={firstArticlePublished}
                  loader={tableLoader}
                />
              </div>
              {tableLoader ? (
                <>
                  <Skeleton />
                </>
              ) : (
                <>
                  <div className="article-heading">
                    <div className="article-heading-row">
                      <div
                        className="flex"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <div className="author-id-chart-header">
                          <div className="author-id-chart-select">
                            <Select
                              onChange={handleChangeChart}
                              value={selectedChartValue}
                              getPopupContainer={(triggerNode) =>
                                triggerNode?.parentNode || document.body
                              }
                            >
                              <Option value="page_views">Page Views</Option>
                              <Option value="users">Readers</Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="article-country-author-content">
                        <div className="article-country-heading">
                          {chartTitle}
                        </div>
                        <div className="article-country-chart">
                          {segementValue === "real-time" ||
                            segementValue === "monthly" ? (
                            <LineChart
                              labels={
                                segementValue === "monthly"
                                  ? authorChartData?.label
                                  : timeLabels
                              }
                              series={authorChartData?.series}
                              colors={["#7F56D9", "#A3E0FF"]}
                              multipleYaxis={false}
                            />
                          ) : (
                            <BarChart
                              labels={barchartResponse?.labels}
                              series={barchartResponse?.series}
                              logarithmic
                              tooltipLabels={
                                segementValue === "monthly"
                                  ? formattedLabels(barchartResponse?.labels)
                                  : null
                              }
                              name={barchartResponse?.name}
                              colors={["#7F56D9"]}
                              width={"30px"}
                              tickAmount={true}
                            />
                          )}
                        </div>
                      </div>
                      <div className="article-country-content">
                        <div className="article-country-heading">
                          Where are the readers from?
                        </div>
                        <div
                          className="flex"
                          style={{
                            justifyContent: "flex-end",
                            display: "flex",
                            width: "100%"
                          }}
                        >
                          <div className="author-id-chart-header">
                            <div
                              className="author-id-chart-select"
                              style={{ marginRight: 10 }}
                            >
                              <Select
                                onChange={handleChangeDistribution}
                                value={selectedDistribution}
                                getPopupContainer={(triggerNode) =>
                                  triggerNode?.parentNode || document.body
                                }
                              >
                                <Option value="country_distribution">
                                  Country Distribution
                                </Option>
                                <Option value="city_distribution">
                                  City Distribution
                                </Option>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="article-country-chart">
                          <BarChart
                            labels={countryListLabel}
                            series={countryListValue}
                            logarithmic
                            colors={["#7F56D9"]}
                            tickAmount={false}
                            name="Readers"
                          />
                        </div>
                      </div>
                      <div className="article-id-details-card-warpper">
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <DetailsCard
                              title="Readability"
                              current_percentage={
                                headerData?.readability?.toFixed(2) || 0
                              }
                              average_percentage={
                                siteAvg?.readability?.toFixed(2) || 0
                              }
                              description="Site average"
                              tooltipTitle="The level of complexity of the text, its familiarity, legibility and typography all feed into how readable your content is."
                            />
                          </Col>
                          <Col span={12}>
                            <DetailsCard
                              title="Recirculation"
                              current_percentage={
                                headerData?.recirculation?.toFixed(2) || 0
                              }
                              average_percentage={
                                siteAvg?.recirculation?.toFixed(2) || 0
                              }
                              description="Site average"
                              tooltipTitle="Percentage of users who visit another page on the site after the initial page."
                            />
                          </Col>
                        </Row>
                      </div>
                      <div className="view-row">
                        <div className="heading-row-author-details">
                          <div className="source-chart">
                            <div className="article-country-heading">
                              Referrer Source
                            </div>
                            <StackedBarChart
                              series={distriputionData?.series}
                              colors={[
                                "#172a95",
                                "#f8b633",
                                "#e63111",
                                "#0add54",
                                "#7f9386"
                              ]}
                              max={100}
                              legend={false}
                              height={80}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="article-other-data-content">
                        <Row justify="space-between">
                          <Col span={4}>
                            <SocialCard
                              distributionData={distriputionData}
                              topAuthorsMedium={topAuthorsMedium}
                            />
                          </Col>
                          <Col span={4}>
                            <ReferralCard
                              distributionData={distriputionData}
                              topAuthorsMedium={topAuthorsMedium}
                            />
                          </Col>
                          <Col span={4}>
                            <SearchCard
                              distributionData={distriputionData}
                              topAuthorsMedium={topAuthorsMedium}
                            />
                          </Col>
                          <Col span={4}>
                            <InternalCard
                              distributionData={distriputionData}
                              topAuthorsMedium={topAuthorsMedium}
                            />
                          </Col>
                          <Col span={4}>
                            <DirectCard distributionData={distriputionData} />
                          </Col>
                        </Row>
                      </div>
                      <div className="author-breakdown-wrapper">
                        <div className="author-breakdown-content">
                          <div className="author-breakdown-button">
                            <Radio.Group
                              buttonStyle="solid"
                              size="large"
                              onChange={handleChangeBreakdownSegment}
                              value={selectedBreakdownValue}
                            >
                              <Radio.Button value="social">
                                Social Breakdown
                              </Radio.Button>
                              <Radio.Button value="device">
                                Device Breakdown
                              </Radio.Button>
                              <Radio.Button value="visitor">
                                Visitor Breakdown
                              </Radio.Button>
                            </Radio.Group>
                          </div>
                          <div className="author-breakdown-data-content">
                            <div className="author-breakdown-title">
                              {`${selectedBreakdownValue} Breakdown`}
                            </div>
                            {Object.keys(breakdownDataObject)?.length > 0 && (
                              <div className="author-breakdown-data-value">
                                <BreakDownData
                                  data={
                                    breakdownDataObject?.[selectedBreakdownValue]
                                  }
                                  columns={columnsVisitor}
                                  tableValue={tableVistitorData}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}