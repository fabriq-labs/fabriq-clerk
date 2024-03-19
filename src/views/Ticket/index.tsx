"use client"
import React, { useEffect, useState } from "react";
import { Table, Popconfirm, Typography, Space, Input, Select, Tag } from "antd";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import type { SelectProps } from "antd";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";
import {
  authorize,
  getPath,
  userTypeOptions,
  statusTypeOptions,
} from "@/helper";

export const Ticket = () => {
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [haveCreatePermission, setHavePermission] = useState(false);
  const [ticketData, setTicketData]: any = useState([]);
  const [userFilter, setUserFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { orgRole }: any = useAuth();
  const users = [
    { id: 1, name: "KIRUTHIKA D" },
    {
      id: 2,
      name: "VAISHNAVI M",
    },
    { id: 3, name: "NANDHINI V" },
    { id: 4, name: "KIRUTHIKA V" },
    { id: 5, name: "RAJMOHAN NITHYA" },
    { id: 6, name: "GOKUL R" },
    { id: 7, name: "ARUN PRASANNA" },
    { id: 8, name: "MADHAN R" },
  ];

  useEffect(() => {
    getTicketData();
    let pathValue: any = getPath(pathname);
    let addPermission = authorize(orgRole, pathValue, "POST");
    setHavePermission(addPermission);
  }, []);

  const getTicketData = () => {
    let variables: any = {
      org_id: 1,
    };
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");

    axios({
      method: "GET",
      url: `/api/ticket`,
    })
      .then((res) => {
        setTicketData(res?.data?.data?.ticket);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const handleChangeSearch = (e: any) => {
    const searchValueTemp = e.target.value.toLowerCase();
    setSearchValue(searchValueTemp);
  };

  const mapAssigneeIdToName = (assigneeId: any) => {
    const user = users.find((user) => user.id === assigneeId);
    return user ? user.name : "Unknown";
  };

  const columns: any = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Assign To",
      dataIndex: "assignee",
      key: "assignee",
      render: (assigneeId: any) => mapAssigneeIdToName(assigneeId),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        let color =
          status === "Open"
            ? "default"
            : status === "In-Progress"
            ? "processing"
            : status === "Hold"
            ? "magenta"
            : status === "Waiting for Customer Doc/Confirmation"
            ? "purple"
            : status === "Completed"
            ? "green"
            : status === "Cancelled"
            ? "red"
            : "volcano";

        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const handleClickNavigate = (record: any) => {
    router.push(`/ticket/${record?.key}`);
  };

  const handleChangeSelectUser = (value: any) => {
    setUserFilter(value ? value : null);
  };

  const handleChangeSelectStatus = (value: any) => {
    setStatusFilter(value ? value : null);
  };

  const transformedData =
    ticketData &&
    Object.keys(ticketData).map((key) => ({
      key: ticketData[key]?.id || "",
      title: ticketData[key]?.subject || "",
      company: ticketData[key]?.company?.name || "",
      assignee: ticketData[key]?.assignee_id || "",
      status: ticketData[key]?.status || "",
    }));

  let filteredData =
    searchValue != ""
      ? transformedData.filter((item: any) =>
          item.company.toLowerCase().includes(searchValue)
        )
      : transformedData;

  let filterUserData =
    userFilter != null
      ? filteredData.filter((item: any) => item.assignee === userFilter)
      : filteredData;

  let filterStatusData =
    statusFilter != null
      ? filterUserData.filter((item: any) => item.status === statusFilter)
      : filterUserData;

  return (
    <Layout>
      <div className="dashboard-container">
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="contact-wrapper">
              <div className="contact-content">
                <div className="contact-header">
                  <div className="contact-header-title">Ticket</div>
                  <div className="search-container">
                    <Input
                      placeholder="search by company"
                      style={{ width: "200px" }}
                      onChange={(e) => handleChangeSearch(e)}
                    />
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
                        options={userTypeOptions}
                        onChange={handleChangeSelectUser}
                        allowClear={true}
                        placeholder="filter by assignee"
                        // value={addAssociate && JSON.stringify(addAssociate?.company_id)}
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
                        options={statusTypeOptions}
                        onChange={handleChangeSelectStatus}
                        allowClear={true}
                        placeholder="filter by status"
                        // value={addAssociate && JSON.stringify(addAssociate?.company_id)}
                      />
                    </div>
                  </div>
                  {haveCreatePermission && (
                    <Link href="/ticket/create">
                      <span className="contact-add-button">Add Ticket</span>
                    </Link>
                  )}
                </div>
                <div className="contact-body">
                  <Table
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: () => {
                          handleClickNavigate(record);
                        }, // click row
                      };
                    }}
                    columns={columns}
                    dataSource={filterStatusData}
                    bordered={false}
                    pagination={{ pageSize: 10 }}
                    className="custom-table"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default withRoles(Ticket, ["org:admin", "org:member"]);

{
  /* <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
              onChange={handleChange}
              options={options}
              defaultValue={[1, 2]}
            /> */
}
