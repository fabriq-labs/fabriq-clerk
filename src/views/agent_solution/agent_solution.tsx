"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";

import RightSection from "@/components/agent-solution/right_section";
import CalComponent from "@/components/agent-solution/cal_component";

export default function AgentSolution() {
  return (
    <div className="agent-solution">
      <Row>
        <Col span={6} className="section-1">
          {/* <Row gutter={16}>
            <Col span={24}>
              <Tabs
                items={[
                  {
                    label: "Caller Details",
                    key: "1",
                    // children: <RightSection />,
                    children: "Caller",
                  },
                  {
                    label: "Dealer Details",
                    key: "2",
                    children: "hi",
                  },
                  {
                    label: "Agent Details",
                    key: "3",
                    children: "hi",
                  },
                ]}
              />
            </Col>
          </Row> */}
        </Col>
        <Col span={14} className="section-2">
          2
        </Col>
        <Col span={4} className="section-3">
          <CalComponent />
        </Col>
      </Row>
    </div>
  );
}
