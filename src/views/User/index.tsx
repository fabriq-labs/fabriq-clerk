// User
"use client";
import React, { useEffect, useState } from "react";
import { Table, Input, Space, Typography } from "antd";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";
import { authorize, getPath } from "@/helper";

export const User = () => {
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [userData, setUserData]: any = useState([]);
  const [haveCreatePermission, setHavePermission] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { orgRole }: any = useAuth();

  useEffect(() => {
    getUserData();
    let pathValue: any = getPath(pathname);
    let addPermission = authorize(orgRole, pathValue, "POST");
    setHavePermission(addPermission);
  }, []);

  const getUserData = () => {
    axios({
      method: "GET",
      url: `/api/user`,
    })
      .then((res) => {
        setUserData(res?.data?.data?.user);
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

  const handleClickNavigate = (record: any) => {
    router.push(`/user/${record?.key}`);
  };

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email ID",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => handleClickNavigate(record)}>
            Edit
          </Typography.Link>
        </Space>
      ),
    },
  ];

  const transformedData =
    userData &&
    Object.keys(userData).map((key) => ({
      key: userData[key]?.id || "",
      name: userData[key]?.name || "",
      role: userData[key]?.role || "",
      phone: userData[key]?.phone || "",
      email: userData[key]?.email || "",
    }));

  let filteredData =
    transformedData &&
    transformedData.filter((item: any) =>
      item.name.toLowerCase().includes(searchValue)
    );

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
                  <div className="contact-header-title">Trademark</div>
                  <div className="search-container">
                    <Input
                      placeholder="search by user"
                      style={{ width: "200px" }}
                      onChange={(e) => handleChangeSearch(e)}
                    />
                  </div>
                </div>
                <div className="contact-body">
                  <Table
                    columns={columns}
                    dataSource={filteredData}
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

export default withRoles(User, ["org:admin", "org:member"]);
