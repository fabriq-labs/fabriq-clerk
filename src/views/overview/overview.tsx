"use client"

import React, { useEffect, useState } from "react";
import { Row, Col, Table, Tag, Timeline, Card, Statistic } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

import CardComponent from "../../components/card";
import BarChartComponent from "../../components/bar_chart";
import PieChartComponent from "../../components/pie_chart";
import AppointmentStatusChart from "../../components/stacked_bar_chart";
import TinyLineChart from "../../components/tiny_line_chart";
import Layout from "../../components/layout";

import {
  cardData,
  healthData,
  colors,
  data,
  tableData,
  barchartData,
  weeklyIncome,
  appointments,
  formatNumber,
  emergencyRoomData,
} from "./helper";

export const columns = [
  {
    title: "Patient Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Appointment Date",
    dataIndex: "appointmentDate",
    key: "appointmentDate",
  },
  {
    title: "Appointment Time",
    dataIndex: "appointmentTime",
    key: "appointmentTime",
  },
  {
    title: "Diseases",
    dataIndex: "diseases",
    key: "diseases",
    render: (diseases: any) => (
      <>
        {diseases?.map((disease: any) => (
          <Tag key={disease} color="blue">
            {disease}
          </Tag>
        ))}
      </>
    ),
  },
];

const renderTimelineItems = () => {
  return appointments?.map((appointment, index) => (
    <Timeline.Item
      key={index}
      label={appointment.time}
      dot={<ClockCircleOutlined className="timeline-clock-icon" />}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "10px",
        }}
      >
        <p style={{ fontWeight: "bold", fontSize: "13px" }}>
          {appointment?.patient}
        </p>
      </div>
    </Timeline.Item>
  ));
};

export const Overview = () => {
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, []);

  return (
    <Layout>
      <div className="health-dashboard-container">
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <Row gutter={[48, 48]}>
              {cardData.map((card: any, index: any) => (
                <Col key={index} xs={24} sm={12} md={8} lg={8} xxl={4}>
                  <CardComponent
                    title={card.title}
                    content={card.content}
                    color={colors[index]}
                    image={card?.image}
                  />
                </Col>
              ))}
            </Row>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col xs={24} lg={12}>
                <div className="health-chart-div">
                  <h4 className="health-title">Admissions and Discharges</h4>
                  <BarChartComponent data={data} />
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className="health-chart-div">
                  <h4 className="health-title">Case Details</h4>
                  <PieChartComponent data={healthData} />
                </div>
              </Col>
              <Col xs={24} lg={6}>
                <div className="health-chart-div">
                  <h4 className="health-title">Weekly Income</h4>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#7f56d9",
                    }}
                  >
                    ${" "}
                    {formatNumber(
                      weeklyIncome.reduce(
                        (total, item) => total + item.earnings,
                        0
                      )
                    )}
                  </div>
                  <TinyLineChart data={weeklyIncome} />
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={6}>
                <div className="health-chart-div">
                  <h4 className="health-title">Upcoming Appointments</h4>
                  <Timeline
                    mode="right"
                    style={{
                      height: "300px",
                      overflowY: "scroll",
                      padding: "10px",
                    }}
                  >
                    {renderTimelineItems()}
                  </Timeline>
                </div>
              </Col>
              <Col span={18}>
                <div className="health-chart-div">
                  <h4 className="health-title">Appointment Status</h4>
                  <AppointmentStatusChart data={barchartData} />
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col xs={24} lg={24}>
                <div className="health-chart-div">
                  <h4 className="health-title">Emergency Room Status</h4>
                  <Row gutter={16} className="emergency-room-cards">
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="custom-card">
                        <Statistic
                          title="Occupancy Rate"
                          value={emergencyRoomData.occupancyRate}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="custom-card">
                        <Statistic
                          title="Patients in Queue"
                          value={emergencyRoomData.patientsInQueue}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="custom-card">
                        <Statistic
                          title="Available Beds"
                          value={emergencyRoomData.availableBeds}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Card className="custom-card">
                        <Statistic
                          title="Average Wait Time"
                          value={emergencyRoomData.averageWaitTime}
                          suffix="minutes"
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 20 }}>
              <Col span={24}>
                <div className="health-chart-div">
                  <h4 className="health-title">Patients</h4>
                  <Table
                    columns={columns}
                    bordered={false}
                    dataSource={tableData}
                    pagination={{ pageSize: 5 }}
                    className="custom-table"
                    scroll={{ x: 280 }}
                  />
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </Layout>
  );
};
