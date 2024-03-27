"use client";

import React from "react";
import Image from "next/image";
import { Row, Col, Form, Checkbox, Input } from "antd";

export default function AgentSolution() {
  return (
    <div className="right-section">
      <Row>
        <Row>
          <Col span={12}>
            <Row>
              <Image
                src={"/images/avatars/image-1-removebg.png"}
                width={200}
                height={200}
                alt="logo"
              />
            </Row>
          </Col>
          <Form>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item label="Name">
                  <span>{"Test"}</span>
                </Form.Item>
                <Form.Item label="Email">
                  <span>{"Test"}</span>
                </Form.Item>
                <Form.Item label="Phone">
                  <span>{"Test"}</span>
                </Form.Item>
                <Form.Item label="Address">
                  <span>{"Test"}</span>
                </Form.Item>
              </Col>
              {/* Second Column with Preferred Contact Label and Checkbox */}
              <Col span={12}>
                <Form.Item label="Preferred Contact">
                  <Checkbox>Phone</Checkbox>
                  <Checkbox>Email</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Row>
      </Row>
      <Row>2</Row>
      <Row>3</Row>
    </div>
  );
}
