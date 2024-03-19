"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";

// Component
import Layout from "../../components/layout";
import { withRoles } from "@/app/role";

import { userTypeOptions } from "@/helper";
interface Counts {
  thisWeek: number;
  thisMonth: number;
  thisOverdue: number;
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
  const [ticketsData, setTicketsData] = useState({});

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

  // Function to check if a date is overdue with today
  const isOverdue = (date: any) => {
    const today = new Date();
    const compareDate = new Date(date);
    return compareDate < today;
  };
  

  useEffect(() => {
    getDashboardData();
    // getCountsByAssigneeIdAndStatus()
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
      url: `/api/dashboard`,
    })
      .then((res) => {
        let formatedData = calculateRenewalCounts(res?.data?.data);
        let ticketData = getCountsByAssigneeIdAndStatus(res?.data?.data);
        setTicketsData(ticketData);
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
          counts[association] = { thisWeek: 0, thisMonth: 0, thisOverdue: 0 };
        }
        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek++;
        }
        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth++;
        }
        if (isOverdue(renewalDate)) {
          counts[association].thisOverdue++;
        }
      }
    });

    data?.company_contact?.forEach((contact: any) => {
      if (contact.renewal_date) {
        const [day, month, year] = contact.renewal_date.split("-").map(Number);
        // JavaScript's Date constructor expects months to be 0-indexed, so we subtract 1
        const renewalDate = new Date(year, month - 1, day);

        if (!counts[contact.association]) {
          counts[contact.association] = {
            thisWeek: 0,
            thisMonth: 0,
            thisOverdue: 0
          };
        }

        if (isInCurrentWeek(renewalDate)) {
          counts[contact.association].thisWeek++;
        }

        if (isInCurrentMonth(renewalDate)) {
          counts[contact.association].thisMonth++;
        }

        if (isOverdue(renewalDate)) {
          counts[contact.association].thisOverdue++;
        }
      }
    });

    data.contact.forEach((contact: any) => {
      if (contact.dsc_renewal_date) {
        const [day, month, year] = contact.dsc_renewal_date
          .split("-")
          .map(Number);
        const renewalDate = new Date(year, month - 1, day);
        const association = "DSC";
        if (!counts[association]) {
          counts[association] = { thisWeek: 0, thisMonth: 0, thisOverdue: 0 };
        }
        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek++;
        }
        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth++;
        }
        if (isOverdue(renewalDate)) {
          counts[association].thisOverdue++;
        }
      }
    });

    data.ticket.forEach((ticket: any) => {
      if (ticket.pay_due_date) {
        const [day, month, year] = ticket.pay_due_date.split("-").map(Number);
        const renewalDate = new Date(year, month - 1, day);
        const association = "Pay Later";
        if (!counts[association]) {
          counts[association] = { thisWeek: 0, thisMonth: 0, thisOverdue: 0 };
        }
        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek++;
        }
        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth++;
        }
        if (isOverdue(renewalDate)) {
          counts[association].thisOverdue++;
        }
      }
    });

    return counts;
  };

  const filteredKeys = [
    "Managing Director",
    "Statutory Auditor",
    "Whole Time Director",
    "Trademark Renewal(s)",
    "DSC",
  ];
  const getCountsByAssigneeIdAndStatus = (data: any) => {
    const counts: any = {};
    data.ticket.forEach((ticket: any) => {
      if (ticket.assignee_id !== null && ticket.status !== null) {
        const assigneeId = ticket.assignee_id;
        const status = ticket.status;
  
        if (!counts[assigneeId]) {
          counts[assigneeId] = { Open: 0, Completed: 0, "In-Progress": 0, Hold: 0, Cancelled: 0, "Waiting for Customer Doc/Confirmation": 0 };
        }
        
        // Increment the count based on the status
        counts[assigneeId][status]++;
      }
    });
    return counts;
  };  

  const filteredPayLaterKeys = ["Pay Later"];

  const dataSource =
    dashboardData &&
    Object.entries(dashboardData)
      .filter(([association]) => filteredKeys.includes(association))
      .map(([association, counts]) => ({
        key: association,
        association,
        thisWeek: counts.thisWeek,
        thisMonth: counts.thisMonth,
        thisOverdue: counts.thisOverdue
      }));

  const dataSourcePayLater =
    dashboardData &&
    Object.entries(dashboardData)
      .filter(([association]) => filteredPayLaterKeys.includes(association))
      .map(([association, counts]) => ({
        key: association,
        association,
        thisWeek: counts.thisWeek,
        thisMonth: counts.thisMonth,
        thisOverdue: counts.thisOverdue
      }));

  const formatDataForTable = (counts: any) => {
    const formattedData = [];
    for (const assigneeId in counts) {
      const rowData = {
        assigneeId: assigneeId,
        open: counts[assigneeId].Open || 0,
        progress: counts[assigneeId]["In-Progress"] || 0,
        hold: counts[assigneeId].Hold || 0,
        waiting: counts[assigneeId]["Waiting for Customer Doc/Confirmation"] || 0,
      };
      formattedData.push(rowData);
    }
    return formattedData;
  };

  const formattedDataTicketStatus =
    ticketsData && formatDataForTable(ticketsData);

  const columnsAppointments: any = [
    {
      title: "Follow-Up - Renewals & Appointments",
      dataIndex: "association",
      key: "association",
      width: "40%",
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
    {
      title: "Over Due",
      dataIndex: "thisOverdue",
      key: "thisOverdue",
      align: "center",
    },
  ];

  const columnsTickets: any = [
    {
      title: "Follow-Up - Tickets",
      dataIndex: "association",
      key: "association",
      width: "40%",
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
    {
      title: "Over Due",
      dataIndex: "thisOverdue",
      key: "thisOverdue",
      align: "center",
    },
  ];

  const mapAssigneeIdToName = (assigneeId: any) => {
    const user = userTypeOptions.find((user) => user.value === parseInt(assigneeId));
    return user ? user.label : "Unknown";
  };

  const columnsTicketStatus: any = [
    {
      title: "Team Vs Tickets",
      dataIndex: "assigneeId",
      key: "assigneeId",
      width: "40%",
      render: (assigneeId: any) => mapAssigneeIdToName(assigneeId),
    },
    {
      title: "Open",
      dataIndex: "open",
      key: "open",
      align: "center",
    },
    {
      title: "In-Progress",
      dataIndex: "progress",
      key: "progress",
      align: "center",
    },
    {
      title: "Hold",
      dataIndex: "hold",
      key: "hold",
      align: "center",
    },
    {
      title: "Waiting for Customer",
      dataIndex: "waiting",
      key: "waiting",
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
                <div className="contact-header-title">Dashboard</div>
              </div>
              <div className="contact-body">
                <div>
                  <Table
                    dataSource={dataSource}
                    columns={columnsAppointments}
                  />
                </div>
                <div>
                  <Table
                    dataSource={dataSourcePayLater}
                    columns={columnsTickets}
                  />
                </div>
                <div>
                  <Table
                    dataSource={formattedDataTicketStatus}
                    columns={columnsTicketStatus}
                  />
                </div>
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
