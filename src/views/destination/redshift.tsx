import React, { useEffect } from "react";
import { Col, Form, Input, Row } from "antd";
import { Label } from "@/components/ui/label";

const CustomLabel = ({ label }: { label: string }) => (
  <Label className="form-label-name">{label}</Label>
);

export default function RedshiftDestination(props: any) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: props.destination?.name,
      host: props.destination?.configuration?.host,
      port: props.destination?.configuration?.port,
      schema: props.destination?.configuration?.schema,
      database: props.destination?.configuration?.database,
      username: props.destination?.configuration?.username,
      password: props.destination?.configuration?.password,
    });
  }, [props.destination]);

  return (
    <div className="destination-content">
      <>
        <Row align="top" justify="center">
          <Col span={8}>
            <Form layout="vertical" form={form}>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Name" />}
                name="name"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Host" />}
                name="host"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Port" />}
                name="port"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Schema" />}
                name="schema"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Database" />}
                name="database"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Username" />}
                name="username"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Password" />}
                name="password"
              >
                <Input.Password disabled />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </>
    </div>
  );
}
