"use client";

import React from "react";
import Image from "next/image";
import { Row, Col, Form, Checkbox } from "antd";

import { Label } from "@/components/ui/label";

export default function AgentSolution() {
  return (
    <div className="right-section">
      <Row>
        <Col span={12}>
          <Row>
            <Image
              src={"/images/avatars/image-1-removebg.png"}
              width={100}
              height={100}
              alt="logo"
            />
          </Row>
        </Col>
        <Form>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<Label className="form-label-agent">{"Name"}</Label>}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Label className="form-label-value">Text</Label>
              </Form.Item>
              <Form.Item
                label={<Label className="form-label-agent">{"Email"}</Label>}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Label className="form-label-value">Text</Label>
              </Form.Item>
              <Form.Item
                label={<Label className="form-label-agent">{"Phone"}</Label>}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Label className="form-label-value">Text</Label>
              </Form.Item>
              <Form.Item
                label={<Label className="form-label-agent">{"Address"}</Label>}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Label className="form-label-value">Text</Label>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Label className="form-label-agent">
                    {"Preferred Contact"}
                  </Label>
                }
              >
                <Checkbox>Text</Checkbox>
                <Checkbox>Email</Checkbox>
                <Checkbox>Phone</Checkbox>
                <Checkbox>Direct Message</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Row>
      <Row></Row>
      <Row></Row>
    </div>
  );
}
