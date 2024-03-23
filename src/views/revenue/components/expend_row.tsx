import React, { useEffect, useState } from "react";
import { Empty, Table, Tooltip } from "antd";

import { mapRevenueDataForSubList } from "@utils/helper";
import LineChartTiny from "@/components/chart/linechart_tiny";

const generateData = (series: any, labels: any) => {
  const finalData = labels?.map((label: any, index: any) => ({
    name: label,
    pageViews: series?.[0]?.data?.[index] || 0,
  }));

  return finalData;
};

const ExpandedRow = ({
  record,
  getSubListDetails,
  getSubListDetailsQuarterly,
  getSubListDetailsYearly,
  subList,
  loading,
  totalCount,
  tableLoader,
  segementValue,
  chartLoader,
}: any) => {
  const [limit, setLimit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [sortOption, setCurrentSorting] = useState("desc_nulls_last");

  useEffect(() => {
    if (segementValue === "monthly") {
      getSubListDetails(
        record?.id,
        limit,
        offset,
        record?.period_year,
        record?.period_month,
        sortOption
      );
    } else if (segementValue === "quarterly") {
      getSubListDetailsQuarterly(
        record?.id,
        limit,
        offset,
        record?.period_year,
        record?.period_quarter,
        sortOption
      );
    } else if (segementValue === "yearly") {
      getSubListDetailsYearly(
        record?.id,
        limit,
        offset,
        record?.period_year,
        sortOption
      );
    }
  }, [record?.id, limit, offset, sortOption, segementValue]);

  const handlePaginationChange = (newOffset: any, newLimit: any) => {
    setOffset(newOffset);
    setLimit(newLimit);
  };

  const data = mapRevenueDataForSubList(subList);

  const columns: any = [
    {
      title: <Tooltip title="The name of the unit">Name</Tooltip>,
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text: any) => <div className="list-article-title">{text}</div>,
    },
    {
      title: " ",
      dataIndex: "chart",
      key: "chart",
      width: "20%",
      render: (_text: any, record: { series: any; labels: any }) =>
        segementValue === "monthly" && (
          <div className="list-view-chart-wrapper">
            <div
              className="list-view-chart"
              style={{ width: "100%", height: "100px" }}
            >
              <LineChartTiny
                data={generateData(record?.series, record?.labels)}
                dataKey={"pageViews"}
                isRevenue
                chartLoader={chartLoader}
                updatedLabels={record?.labels}
              />
            </div>
          </div>
        ),
    },
    {
      title: (
        <Tooltip title="Number of times an ad is displayed to users.">
          Impressions
        </Tooltip>
      ),
      dataIndex: "impression",
      key: "impression",
      align: "right",
    },
    {
      title: (
        <Tooltip title="Percentage of ad inventory filled by advertisements.">
          Fill Rate
        </Tooltip>
      ),
      dataIndex: "fillRate",
      key: "fillRate",
      align: "right",
    },
    {
      title: (
        <Tooltip title="Effective Cost Per Thousand impressions, a measure of ad revenue.">
          eCPM
        </Tooltip>
      ),
      dataIndex: "eCPM",
      key: "eCPM",
      align: "right",
    },
    {
      title: (
        <Tooltip title="Revenue generated from advertisements on the website.">
          Ad Revenue
        </Tooltip>
      ),
      dataIndex: "adRevenue",
      key: "adRevenue",
      align: "right",
      sorter: true,
    },
  ];

  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter?.columnKey) {
      const sorting =
        sorter.order === "ascend" ? "asc_nulls_first" : "desc_nulls_last";

      setCurrentSorting(sorting);
    }
  };

  return (
    <div className="revenue-article-wrapper">
      {loading ? (
        <div className="loader-cotainer mini-list">
          <div className="loader"></div>
        </div>
      ) : (
        data?.length > 0 && (
          <Table
            columns={columns}
            dataSource={data}
            loading={{
              indicator: (
                <div className="loader-cotainer">
                  <div className="loader"></div>
                </div>
              ),
              spinning: tableLoader,
            }}
            pagination={{
              total: totalCount,
              position: ["topRight"],
              pageSize: 5,
              onChange: (page, pageSize) => {
                const newOffset = (page - 1) * pageSize;
                handlePaginationChange(newOffset, pageSize);
              },
            }}
            onChange={handleTableChange}
          />
        )
      )}
      {!loading && (data === undefined || data?.length === 0) && (
        <Empty description="No revenue details available" />
      )}
    </div>
  );
};

export default ExpandedRow;
