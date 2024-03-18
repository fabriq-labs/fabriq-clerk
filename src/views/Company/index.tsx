"use client"
import React, { useEffect, useState } from "react";
import { Table, Popconfirm, Typography, Space, Input } from "antd";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";
import { authorize, getPath } from "@/helper";

// Interfaces
interface Company {
  name: string;
  type: string;
  country: string;
  id: number;
}

const Company = () => {
  const [loader, setLoader] = useState(true);
  const [companyData, setCompanyData]: any = useState([]);
  const [haveCreatePermission, setHavePermission] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { orgRole }: any = useAuth();

  useEffect(() => {
    getCompanyData();
    let pathValue: any = getPath(pathname);
    let addPermission = authorize(orgRole, pathValue, "POST");
    setHavePermission(addPermission);
  }, []);

  const getCompanyData = () => {
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
      url: `/api/company?${queryString}`,
    })
      .then((res) => {
        setCompanyData(res?.data?.data?.company);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const edit = (record: any) => {
    router.push(`/company/${record.id}`);
  };

  const handleDelete = (record: any) => {
    let variables: any = {
      org_id: 1,
      id: record?.id,
    };
    setLoader(true);
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");

    axios({
      method: "DELETE",
      url: `/api/company/${record?.id}?${queryString}`,
    })
      .then((res) => {
        console.log("company deleted", res?.data?.data);
        setLoader(false);
        getCompanyData();
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

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <a style={{ color: "#1677ff" }}>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  let filteredData = companyData.filter((item: Company) =>
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
                  <div className="contact-header-title">Company</div>
                  <div className="search-container">
                    <Input
                      placeholder="search company name"
                      style={{ width: "200px" }}
                      onChange={(e) => handleChangeSearch(e)}
                    />
                  </div>
                  {haveCreatePermission && (
                    <Link href="/company/create">
                      <span className="contact-add-button">Add Company</span>
                    </Link>
                  )}
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

export default withRoles(Company, ["org:admin", "org:member"]);
