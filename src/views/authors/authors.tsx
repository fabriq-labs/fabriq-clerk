"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Table, Tooltip, Select } from "antd";
import { useParams, useRouter } from "next/navigation";
import Layout from "@components/layout";
import StackedBarChart from "@/components/chart/stackedBarChart";
import { formatNumber, formationTimezone } from "@/utils/helper";
import moment from "moment";



export default function Authors() {
    const [data, setData] = useState([]);
    const [countryListLabel, setCountryListLabel] = useState([]);
    const [countryListValue, setCountryListValue] = useState([]);
    const [dataArray, setDataArray] = useState([]);
    const [distriputionData, setDistributionData] = useState({
        labels: [],
        series: [],
        name: "",
        referrer: null
    });
    const [headerData, setHeaderData] = useState([]);
    const [selectedDistribution, setSelectedDistribution] =
        useState("city_distribution");
    const [selectedChartValue, setSelectedChartValue] = useState("");
    const [imageIndex, setImageIndex] = useState(0);
    const [loader, setLoader] = useState(true);
    const [tableLoader, setTableLoader] = useState(false);
    const [segementValue, setSegementValue] = useState("real-time");
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedQuarter, setSelectedQuarter] = useState(null);
    const [siteAvg, setSiteAvg] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [authorCurrentChartResponse, setAuthorCurrentChartResponse] = useState(
        []
    );
    const [authorAverageChartResponse, setAuthorAverageChartResponse] = useState(
        []
    );
    const [historicalChartResponse, setHistoricalChartResponse] = useState([]);
    const [barchartResponse, setBarChartResponse] = useState({
        labels: [],
        series: [],
        name: ""
    });
    const [topAuthorsMedium, setAuthorsMedium] = useState({});
    const { Option } = Select;

    const [authorChartData, setAuthorChartData] = useState([]);
    const [isError, setIsError] = useState(false);
    const [selectedBreakdownValue, setSelectedBreakdownValue] = useState("");
    const [breakdownDataObject, setBreakDownDataObject] = useState({});
    const [tableVistitorData, setTableVisitorData] = useState([]);
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

        const getSeriesConfig =(name: any, key: any) => {
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

    const generateDataForQuarterChart = (data, quarter, value) => {
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
    
          const outputArray = labels.map((label) => {
            const day = parseInt(label);
            const dataItem = list?.find((item) => item?.period_month === day);
    
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
          setBarChartResponse((prevState) => ({
            ...prevState,
            labels: monthLabels,
            series: yValues,
            name: selectedItem === "page_views" ? "Page Views" : "Users"
          }));
        }
    
        if (data?.AuthorsQuaterly?.length > 0) {
          const list = data?.AuthorsQuaterly;
          const areaJsonData = [];
          list.forEach((areadata) => {
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
            (acc, [name, value]) => {
              acc[name] = {
                value,
                percentage: ((value / total) * 100)?.toFixed(2)
              };
              return acc;
            },
            {}
          );
    
          setDistributionData((prevState) => ({
            ...prevState,
            series: result,
            referrer
          }));
        }
      };
    
      const formatTopMedium = (apiData) => {
        const formattedData = {};
    
        apiData.forEach((entry) => {
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
    
      const generateDataForYearChart = (data, year, value) => {
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
          const list = data?.AuthorsYearly;
    
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
            (acc: any, value:any) => acc + value,
            0
          );
    
          // Convert each value to percentage and create the new format
          const result = Object.entries(newData[0])?.map(([name, value]:any) => ({
            name,
            data: [(value / total) * 100]
          }));
    
          const referrer = Object.entries(newData[0]).reduce(
            (acc, [name, value]:any) => {
              acc[name] = {
                value,
                percentage: ((value / total) * 100)?.toFixed(2)
              };
              return acc;
            },
            {}
          );
    
          setDistributionData((prevState:any) => ({
            ...prevState,
            series: result,
            referrer
          }));
        }
      };
      
    return (
        <Layout>
            <div className="authors-container"> authors</div>
        </Layout>
    )
}