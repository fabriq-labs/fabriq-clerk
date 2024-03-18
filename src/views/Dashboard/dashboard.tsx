"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

// Component
import Layout from "../../components/layout";
import { withRoles } from "@/app/role";
interface Counts {
  thisWeek: number;
  thisMonth: number;
}

interface DashboardData {
  [key: string]: Counts;
}

const Dahsboard = () => {
  const [loader, setLoader] = useState(true);
  const [dashboardData, setDashboradData]: [
    DashboardData,
    React.Dispatch<React.SetStateAction<DashboardData>>
  ] = useState({});

  const istDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const currentDate = new Date(istDate);

  // Function to check if a date is in the current week
  const isInCurrentWeek = (date: any) => {
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  // Function to check if a date is in the current month
  const isInCurrentMonth = (date: any) => {
    const currentMonth = currentDate.getMonth();
    const renewalDate = new Date(date);
    return renewalDate.getMonth() === currentMonth;
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = () => {
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
      url: `/api/dashboard?${queryString}`,
    })
      .then((res) => {
        let formatedData = calculateRenewalCounts(res?.data?.data);
        setDashboradData(formatedData);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const calculateRenewalCounts = (data: any) => {
    const counts: any = {};

    // Count renewal dates for trademarks
    data.trademark.forEach((trademark: any) => {
      if (trademark.renewal_date) {
        const [day, month, year] = trademark.renewal_date
          .split("-")
          .map(Number);
        const renewalDate = new Date(year, month - 1, day);
        const association = "Trademark Renewal(s)";
        if (!counts[association]) {
          counts[association] = { thisWeek: 0, thisMonth: 0 };
        }
        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek++;
        }
        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth++;
        }
      }
    });

    data?.contact?.forEach((contact: any) => {
      if (contact.renewal_date) {
        const [day, month, year] = contact.renewal_date.split("-").map(Number);
        // JavaScript's Date constructor expects months to be 0-indexed, so we subtract 1
        const renewalDate = new Date(year, month - 1, day);

        if (!counts[contact.association]) {
          counts[contact.association] = {
            thisWeek: 0,
            thisMonth: 0,
          };
        }

        if (isInCurrentWeek(renewalDate)) {
          counts[contact.association].thisWeek++;
        }

        if (isInCurrentMonth(renewalDate)) {
          counts[contact.association].thisMonth++;
        }
      }
    });

    return counts;
  };

  const filteredKeys = ["Managing Director", "Statutory Auditor", "Whole Time Director", "Trademark Renewal(s)"];

  const dataSource = dashboardData && Object.entries(dashboardData)
  .filter(([association]) => filteredKeys.includes(association))
  .map(([association, counts]) => ({
    key: association,
    association,
    thisWeek: counts.thisWeek,
    thisMonth: counts.thisMonth,
  }));

  const columns: any = [
    {
      title: "Association",
      dataIndex: "association",
      key: "association",
    },
    {
      title: "This Week",
      dataIndex: "thisWeek",
      key: "thisWeek",
      align: "center",
    },
    {
      title: "This Month",
      dataIndex: "thisMonth",
      key: "thisMonth",
      align: "center",
    },
  ];

  return (
    <Layout>
      <div className="dashboard-container">
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="contact-wrapper">
            <div className="contact-content">
              <div className="contact-header">
                <div className="contact-header-title">Dahsboard</div>
              </div>
              <div className="contact-body">
                <Table dataSource={dataSource} columns={columns} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// export default Dahsboard;

export default withRoles(Dahsboard, ["org:admin", "org:member"]);
