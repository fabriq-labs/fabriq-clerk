"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Skeleton } from "antd";
import { useRouter } from "next/navigation";

// Component
import Layout from "../../components/layout";
import { withRoles } from "@/app/role";

import { userTypeOptions } from "@/helper";
// interface Counts {
//   thisWeek: number;
//   thisMonth: number;
//   thisOverdue: number;
// }

interface DashboardData {
  [key: string]: Counts;
}

interface Counts {
  thisWeek: { count: number; ids: number[] };
  thisMonth: { count: number; ids: number[] };
  thisOverdue: { count: number; ids: number[] };
}

const Dahsboard = () => {
  const [loader, setLoader] = useState(true);
  const [dashboardData, setDashboradData]: [
    DashboardData,
    React.Dispatch<React.SetStateAction<DashboardData>>
  ] = useState({});
  const [ticketsData, setTicketsData] = useState({});
  const [selectedList, setSelectedList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState(null);
  const [associateData, setAssociateData]: any = useState(null);
  const [modalLoader, setModalLoader] = useState(true);
  const [showList, setShowList] = useState(false);
  const router = useRouter();

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
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const renewalDate = new Date(date);
    const renewalMonth = renewalDate.getMonth();
    const renewalYear = renewalDate.getFullYear();
    
    return renewalMonth === currentMonth && renewalYear === currentYear;
};

  // Function to check if a date is overdue with today
  const isOverdue = (date: any) => {
    const currentDate = new Date();
    const compareDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < currentDate;
  };

  useEffect(() => {
    getDashboardData();
    // getCountsByAssigneeIdAndStatus()
  }, []);

  const getDashboardData = () => {
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
        const [year, month, day] = trademark.renewal_date
          .split("-")
          .map(Number);
        const renewalDate = new Date(year, month - 1, day);
        const association = "Trademark Renewal(s)";

        if (!counts[association]) {
          counts[association] = {
            thisWeek: { count: 0, ids: [] },
            thisMonth: { count: 0, ids: [] },
            thisOverdue: { count: 0, ids: [] },
          };
        }

        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek.count++;
          counts[association].thisWeek.ids.push(trademark.id);
        }

        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth.count++;
          counts[association].thisMonth.ids.push(trademark.id);
        }

        if (isOverdue(renewalDate)) {
          counts[association].thisOverdue.count++;
          counts[association].thisOverdue.ids.push(trademark.id);
        }
      }
    });

    data?.company_contact?.forEach((contact: any) => {
      if (contact.renewal_date) {
        const [year, month, day] = contact.renewal_date.split("-").map(Number);
        // JavaScript's Date constructor expects months to be 0-indexed, so we subtract 1
        const renewalDate = new Date(year, month - 1, day);
        if (!counts[contact.association]) {
          counts[contact.association] = {
            thisWeek: { count: 0, ids: [] },
            thisMonth: { count: 0, ids: [] },
            thisOverdue: { count: 0, ids: [] },
          };
        }

        if (isInCurrentWeek(renewalDate)) {
          counts[contact.association].thisWeek.count++;
          counts[contact.association].thisWeek.ids.push(contact.id);
        }

        if (isInCurrentMonth(renewalDate)) {
          counts[contact.association].thisMonth.count++;
          counts[contact.association].thisMonth.ids.push(contact.id);
        }

        if (isOverdue(renewalDate)) {
          counts[contact.association].thisOverdue.count++;
          counts[contact.association].thisOverdue.ids.push(contact.id);
        }
      }
    });

    data.contact.forEach((contact: any) => {
      if (contact.dsc_renewal_date) {
        const [year, month, day] = contact.dsc_renewal_date
          .split("-")
          .map(Number);
        const renewalDate = new Date(year, month - 1, day);
        const association = "DSC";
        if (!counts[association]) {
          counts[association] = {
            thisWeek: { count: 0, ids: [] },
            thisMonth: { count: 0, ids: [] },
            thisOverdue: { count: 0, ids: [] },
          };
        }
        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek.count++;
          counts[association].thisWeek.ids.push(contact.id);
        }
        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth.count++;
          counts[association].thisMonth.ids.push(contact.id);
        }
        if (isOverdue(renewalDate)) {
          counts[association].thisOverdue.count++;
          counts[association].thisOverdue.ids.push(contact.id);
        }
      }
    });

    data.ticket.forEach((ticket: any) => {
      if (ticket.pay_due_date) {
        const [year, month, day] = ticket.pay_due_date.split("-").map(Number);
        const renewalDate = new Date(year, month - 1, day);
        const association = "Pay Later";
        if (!counts[association]) {
          counts[association] = {
            thisWeek: { count: 0, ids: [] },
            thisMonth: { count: 0, ids: [] },
            thisOverdue: { count: 0, ids: [] },
          };
        }
        if (isInCurrentWeek(renewalDate)) {
          counts[association].thisWeek.count++;
          counts[association].thisWeek.ids.push(ticket.id);
        }
        if (isInCurrentMonth(renewalDate)) {
          counts[association].thisMonth.count++;
          counts[association].thisMonth.ids.push(ticket.id);
        }
        if (isOverdue(renewalDate)) {
          counts[association].thisOverdue.count++;
          counts[association].thisOverdue.ids.push(ticket.id);
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
          counts[assigneeId] = {
            Open: 0,
            Completed: 0,
            "In-Progress": 0,
            Hold: 0,
            Cancelled: 0,
            "Waiting for Customer Doc/Confirmation": 0,
          };
        }

        // Increment the count based on the status
        counts[assigneeId][status]++;
      }
    });
    return counts;
  };

  const getAssociationDetails = (record: any, associate: any) => {
    setModalLoader(true);
    axios
      .post("/api/dashboard/details", {
        event: {
          type: associate,
          id: record,
        },
      })
      .then((res) => {
        let dataValue = res?.data?.data?.associate;
        setModalLoader(false);
        setAssociateData(dataValue);
      })
      .catch((err) => {
        setModalLoader(false);
        console.log("err", err);
      });
  };

  const filteredPayLaterKeys = ["Pay Later"];

  const dataSource =
    dashboardData &&
    Object.entries(dashboardData)
      .filter(([association]) => filteredKeys.includes(association))
      .map(([association, counts]) => ({
        key: association,
        association,
        thisWeek: counts.thisWeek.count,
        thisWeekIds: counts.thisWeek.ids,
        thisMonth: counts.thisMonth.count,
        thisMonthIds: counts.thisMonth.ids,
        thisOverdue: counts.thisOverdue.count,
        thisOverdueIds: counts.thisOverdue.ids,
      }));

  const dataSourcePayLater =
    dashboardData &&
    Object.entries(dashboardData)
      .filter(([association]) => filteredPayLaterKeys.includes(association))
      .map(([association, counts]) => ({
        key: association,
        association,
        thisWeek: counts.thisWeek.count,
        thisWeekIds: counts.thisWeek.ids,
        thisMonth: counts.thisMonth.count,
        thisMonthIds: counts.thisMonth.ids,
        thisOverdue: counts.thisOverdue.count,
        thisOverdueIds: counts.thisOverdue.ids,
      }));

  const formatDataForTable = (counts: any) => {
    const formattedData = [];
    for (const assigneeId in counts) {
      const rowData = {
        assigneeId: assigneeId,
        open: counts[assigneeId].Open || 0,
        progress: counts[assigneeId]["In-Progress"] || 0,
        hold: counts[assigneeId].Hold || 0,
        waiting:
          counts[assigneeId]["Waiting for Customer Doc/Confirmation"] || 0,
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
      render: (text: any, record: any) => (
        <span
          onClick={() => handleListClick("thisWeek", record?.association)}
          style={{ color: "#3c58f8", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "This Month",
      dataIndex: "thisMonth",
      key: "thisMonth",
      align: "center",
      render: (text: any, record: any) => (
        <span
          onClick={() => handleListClick("thisMonth", record?.association)}
          style={{ color: "#3c58f8", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Over Due",
      dataIndex: "thisOverdue",
      key: "thisOverdue",
      align: "center",
      render: (text: any, record: any) => (
        <span
          onClick={() => handleListClick("overdue", record?.association)}
          style={{ color: "#3c58f8", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
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
      render: (text: any, record: any) => (
        <span
          onClick={() => handleListClick("thisWeek", record?.association)}
          style={{ color: "#3c58f8", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "This Month",
      dataIndex: "thisMonth",
      key: "thisMonth",
      align: "center",
      render: (text: any, record: any) => (
        <span
          onClick={() => handleListClick("thisMonth", record?.association)}
          style={{ color: "#3c58f8", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Over Due",
      dataIndex: "thisOverdue",
      key: "thisOverdue",
      align: "center",
      render: (text: any, record: any) => (
        <span
          onClick={() => handleListClick("overdue", record?.association)}
          style={{ color: "#3c58f8", cursor: "pointer" }}
        >
          {text}
        </span>
      ),
    },
  ];

  const mapAssigneeIdToName = (assigneeId: any) => {
    const user = userTypeOptions.find(
      (user) => user.value == parseInt(assigneeId)
    );
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

  // Function to handle list click and fetch corresponding data
  const handleListClick = (record: any, association: any) => {
    // setIsOpen(true);
    // setSelectedItem(association);
    // setSelectedIds(record);
    // getAssociationDetails(record, association);
    console.log("click", record, association);
    router.push(`/reports?associate=${association}&filter=${record}`);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setAssociateData(null);
  };

  const handleOk = () => {};

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
  ];

  let formatedAssociateData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      brand: associateData[key]?.brand_name || "",
      company: associateData[key]?.company?.name || "",
      registered_date: associateData[key]?.registered_date || "",
      renewal_date: associateData[key]?.renewal_date || "",
    }));

  let formatedContactCompanyData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      name: associateData[key]?.contact?.[0]?.name || "",
      company: associateData[key]?.company?.[0]?.name || "",
      renewal_date: associateData[key]?.renewal_date || "",
    }));

  let formatedContactData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      name: associateData[key]?.name || "",
      email: associateData[key]?.email || "",
      phone: associateData[key]?.phone || "",
      renewal_date: associateData[key]?.dsc_renewal_date || "",
    }));

  let formatedTicketData =
    associateData &&
    Object.keys(associateData).map((key: any) => ({
      key: associateData[key]?.id || "",
      title: associateData[key]?.subject || "",
      company: associateData[key]?.company?.name || "",
      assignee_id: associateData[key]?.assignee_id || "",
      pay_due_date: associateData[key]?.pay_due_date || "",
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
      <Modal
        title={selectedItem}
        open={isOpen}
        onCancel={handleCancel}
        width={"70%"}
        centered
        footer={null}
      >
        {modalLoader ? (
          <Skeleton active />
        ) : (
          <Table
            columns={associateColumn}
            dataSource={associateTable}
            pagination={{ pageSize: 5 }}
          />
        )}
      </Modal>
    </Layout>
  );
};

// export default Dahsboard;

export default withRoles(Dahsboard, ["org:admin", "org:member"]);
