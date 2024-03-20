"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Space, Typography, Select } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import dayjs from "dayjs";

// Component
import Layout from "../../components/layout";
import { withRoles } from "@/app/role";

import { userTypeOptions, getStartAndEndDate } from "@/helper";

const moduleTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Trademark Renewal(s)", label: "Trademark Renewal(s)" },
  {
    value: "Whole Time Director",
    label: "Whole Time Director",
  },
  { value: "Statutory Auditor", label: "Statutory Auditor" },
  { value: "Managing Director", label: "Managing Director" },
  { value: "DSC", label: "DSC" },
  { value: "Pay Later", label: "Pay Later" },
];

const FilterTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "thisWeek", label: "This Week" },
  {
    value: "thisMonth",
    label: "This Month",
  },
  { value: "overdue", label: "Over Due" },
];

const Reports = () => {
  const [loader, setLoader] = useState(false);
  const [associateData, setAssociateData]: any = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selecteddRange, setSelectedRange] = useState(null);
  const [startDate, setStartDate]: any = useState(null);
  const [endDate, setEndDate]: any = useState(null);
  const searchParams: any = useSearchParams();
  const router = useRouter();
  const queryParams = Object.fromEntries(searchParams);

  useEffect(() => {
    console.log("queryParams", queryParams, Object.keys(queryParams).length);
    if (Object.keys(queryParams).length > 0) {
      setSelectedItem(queryParams?.associate);
      setSelectedRange(queryParams?.filter);
      const { startDate, endDate } = getStartAndEndDate(queryParams?.filter);
      setStartDate(startDate);
      setEndDate(endDate);
      getDashboardData(queryParams?.associate, startDate, endDate);
    }
  }, []);

  const getDashboardData = (
    selectedValue: any,
    startDateItem: any,
    endDateItem: any
  ) => {
    console.log("selectedValue", selectedValue, selectedItem);
    if (selectedValue != null || selectedItem != null) {
      setLoader(true);
      let formatVariables =
        selectedValue === "Statutory Auditor" ||
        selectedItem === "Statutory Auditor" ||
        selectedValue === "Managing Director" ||
        selectedItem === "Managing Director" ||
        selectedValue === "Whole Time Director" ||
        selectedItem === "Whole Time Director"
          ? {
              start_date: startDateItem ? startDateItem : startDate,
              end_date: endDateItem ? endDateItem : endDate,
              association: selectedValue || selectedItem,
            }
          : {
              start_date: startDateItem ? startDateItem : startDate,
              end_date: endDateItem ? endDateItem : endDate,
            };
      axios
        .post("/api/reports", {
          event: {
            type: selectedValue ? selectedValue : selectedItem,
            variables: formatVariables,
          },
        })
        .then((res) => {
          let dataValue = res?.data?.data?.report;
          setAssociateData(dataValue);
          setLoader(false);
        })
        .catch((err) => {
          console.log("err", err);
          setLoader(false);
        });
    }
  };

  const mapAssigneeIdToName = (assigneeId: any) => {
    const user = userTypeOptions.find(
      (user) => user.value == parseInt(assigneeId)
    );
    return user ? user.label : "Unknown";
  };

  const edit = (record: any) => {
    if (selectedItem === "Trademark Renewal(s)") {
      router.push(`/trademark/${record.key}`);
    } else if (selectedItem === "Pay Later") {
      router.push(`/ticket/${record.key}`);
    } else {
      router.push(`/contact/${record.key}`);
    }
  };

  const columns: any = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Brand Name",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Registered Date",
      dataIndex: "registered_date",
      key: "registered_date",
    },
    {
      title: "Renewal Date",
      dataIndex: "renewal_date",
      key: "renewal_date",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
        </Space>
      ),
    },
  ];

  const columnsContactCompany: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Renewal Date",
      dataIndex: "renewal_date",
      key: "renewal_date",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
        </Space>
      ),
    },
  ];

  const columnsContact: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Renewal Date",
      dataIndex: "renewal_date",
      key: "renewal_date",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
        </Space>
      ),
    },
  ];

  const columnsTicket: any = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "40%",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: "35%",
    },
    {
      title: "Assigne",
      dataIndex: "assignee_id",
      key: "assignee_id",
      width: "10%",
      render: (assigneeId: any) => mapAssigneeIdToName(assigneeId),
    },
    {
      title: "Pay Later (Date)",
      dataIndex: "pay_due_date",
      key: "pay_due_date",
      width: "15%",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
        </Space>
      ),
    },
  ];

  console.log("associated", associateData, selectedItem);

  let formatedAssociateData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      brand: associateData[key]?.brand_name || "",
      company: associateData[key]?.company?.name || "",
      registered_date:
        dayjs(associateData[key]?.registered_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || "",
      renewal_date:
        dayjs(associateData[key]?.renewal_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || "",
    }));

  let formatedContactCompanyData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key:
        selectedItem === "DSC"
          ? associateData[key]?.id
          : associateData[key]?.company_id || "",
      name: associateData[key]?.contact?.[0]?.name || "",
      company: associateData[key]?.company?.[0]?.name || "",
      renewal_date:
        dayjs(associateData[key]?.renewal_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || "",
    }));

  let formatedContactData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      name: associateData[key]?.name || "",
      email: associateData[key]?.email || "",
      phone: associateData[key]?.phone || "",
      renewal_date:
        dayjs(associateData[key]?.dsc_renewal_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || "",
    }));

  let formatedTicketData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      title: associateData[key]?.subject || "",
      company: associateData[key]?.company?.name || "",
      assignee_id: associateData[key]?.assignee_id || "",
      pay_due_date:
        dayjs(associateData[key]?.pay_due_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || "",
    }));

  let associateColumn =
    selectedItem === "Trademark Renewal(s)"
      ? columns
      : selectedItem === "DSC"
      ? columnsContact
      : selectedItem === "Pay Later"
      ? columnsTicket
      : columnsContactCompany;
  let associateTable =
    selectedItem === "Trademark Renewal(s)"
      ? formatedAssociateData
      : selectedItem === "DSC"
      ? formatedContactData
      : selectedItem === "Pay Later"
      ? formatedTicketData
      : formatedContactCompanyData;

  const handleChangeSelectModule = (value: any) => {
    setSelectedItem(value ? value : null);
    getDashboardData(value, startDate, endDate);
  };

  const handleChangeSelectPriority = (value: any) => {
    setSelectedRange(value ? value : null);
    const selectedFilter = value;
    const { startDate, endDate } = getStartAndEndDate(selectedFilter);
    setStartDate(startDate);
    setEndDate(endDate);
    getDashboardData(selectedItem, startDate, endDate);
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="contact-wrapper">
          <div className="contact-content">
            <div className="contact-header">
              <div className="contact-header-title" style={{ flexGrow: 1 }}>
                Reports
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginRight: "10px",
                }}
              >
                <div>
                  <Select
                    style={{ width: 150 }}
                    size="middle"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      ((option?.label as string) ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      ((optionA?.label as string) ?? "")
                        .toLowerCase()
                        .localeCompare(
                          ((optionB?.label as string) ?? "").toLowerCase()
                        )
                    }
                    options={moduleTypeOptions}
                    onChange={handleChangeSelectModule}
                    allowClear={true}
                    placeholder="filter by associate"
                    value={selectedItem ? selectedItem : null}
                  />
                </div>
                <div>
                  {" "}
                  <Select
                    style={{ width: 150 }}
                    showSearch
                    size="middle"
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      ((option?.label as string) ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      ((optionA?.label as string) ?? "")
                        .toLowerCase()
                        .localeCompare(
                          ((optionB?.label as string) ?? "").toLowerCase()
                        )
                    }
                    options={FilterTypeOptions}
                    onChange={handleChangeSelectPriority}
                    allowClear={true}
                    placeholder="filter by range"
                    value={selecteddRange ? selecteddRange : null}
                  />
                </div>
              </div>
            </div>
            <div className="contact-body">
              {/* {loader ? (
                <div className="loader-cotainer">
                  <div className="loader"></div>
                </div>
              ) : ( */}
              <Table
                columns={associateColumn}
                dataSource={associateTable}
                pagination={{ pageSize: 10 }}
                loading={loader}
              />
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRoles(Reports, ["org:admin", "org:member"]);
