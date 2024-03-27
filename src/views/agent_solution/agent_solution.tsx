"use client";

import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";

import RightSection from "@/components/agent-solution/right_section";

export default function AgentSolution() {
  return (
    <div className="agent-solution">
      <Row>
        <Col span={6} className="section-1">
          <Row gutter={16}>
            <Col span={24}>
              <Tabs
                items={[
                  {
                    label: "Caller Details",
                    key: "1",
                    children: <RightSection />,
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
          </Row>
        </Col>
        <Col span={15} className="section-2">
          2
        </Col>
        <Col span={3} className="section-3">
          3
        </Col>
      </Row>
    </div>
  );
}
