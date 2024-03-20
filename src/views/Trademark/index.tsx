// TradeMark
"use client";
import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";
import { authorize, getPath } from "@/helper";

export const Trademark = () => {
  const [loader, setLoader] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [trademarkData, setTrademarkData]: any = useState([]);
  const [haveCreatePermission, setHavePermission] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { orgRole }: any = useAuth();

  useEffect(() => {
    getTrademarkData();
    let pathValue: any = getPath(pathname);
    let addPermission = authorize(orgRole, pathValue, "POST");
    setHavePermission(addPermission);
  }, []);

  const getTrademarkData = () => {
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
      url: `/api/trademark?${queryString}`,
    })
      .then((res) => {
        setTrademarkData(res?.data?.data?.trademark);
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
    router.push(`/trademark/${record?.key}`);
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
  ];

  const transformedData =
    trademarkData &&
    Object.keys(trademarkData).map((key) => ({
      key: trademarkData[key]?.id || "",
      brand: trademarkData[key]?.brand_name || "",
      company: trademarkData[key]?.company?.name || "",
      registered_date:
        (trademarkData[key]?.registered_date &&
          dayjs(trademarkData[key]?.registered_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          )) ||
        null,
      renewal_date:
        (trademarkData[key]?.renewal_date &&
          dayjs(trademarkData[key]?.renewal_date, "YYYY-MM-DD").format(
            "DD-MM-YYYY"
          )) ||
        null,
    }));

  let filteredData =
    transformedData &&
    transformedData.filter((item: any) =>
      item.brand.toLowerCase().includes(searchValue)
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
                      placeholder="search by brand"
                      style={{ width: "200px" }}
                      onChange={(e) => handleChangeSearch(e)}
                    />
                  </div>
                  {haveCreatePermission && (
                    <Link href="/trademark/create">
                      <span className="contact-add-button">Add Trademark</span>
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

export default withRoles(Trademark, ["org:admin", "org:member"]);
