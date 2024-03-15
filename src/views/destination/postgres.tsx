import React, { useEffect } from "react";
import { Form, Input, Row, Col, Divider } from "antd";

import { Label } from "@/components/ui/label";

// Custom label component
const CustomLabel = ({ label }: { label: string }) => (
  <Label className="form-label-name">{label}</Label>
);

export default function PostgresDestination({ destination }: any) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: destination?.name,
      host: destination?.configuration?.host,
      port: destination?.configuration?.port,
      database: destination?.configuration?.database,
      password: destination?.configuration?.password,
      user: destination?.configuration?.username,
    });
  }, [destination]);

  return (
    <Row align="top" justify="center">
      <Col span={8}>
        <Form form={form} layout="vertical">
          <Form.Item
            label={<CustomLabel label="Name" />}
            name="name"
            className="customFormItem"
          >
            <Input disabled className="customInput" />
          </Form.Item>
          <Divider />
          <Form.Item
            label={<CustomLabel label="Host" />}
            name="host"
            className="customFormItem"
          >
            <Input disabled className="customInput" />
          </Form.Item>
          <Form.Item
            label={<CustomLabel label="Port" />}
            name="port"
            className="customFormItem"
          >
            <Input disabled className="customInput" />
          </Form.Item>
          <Form.Item
            label={<CustomLabel label="User" />}
            name="user"
            className="customFormItem"
          >
            <Input disabled className="customInput" />
          </Form.Item>
          <Form.Item
            label={<CustomLabel label="Password" />}
            name="password"
            className="customFormItem"
          >
            <Input.Password disabled className="customInput" />
          </Form.Item>
          <Form.Item
            label={<CustomLabel label="Database Name" />}
            name="database"
            className="customFormItem"
          >
            <Input disabled className="customInput" />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
