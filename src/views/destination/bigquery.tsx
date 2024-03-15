import React, { useEffect } from "react";
import { Col, Form, Input, Row } from "antd";

import { Label } from "@/components/ui/label";

const CustomLabel = ({ label }: { label: string }) => (
  <Label className="form-label-name">{label}</Label>
);

export default function BigQueryDestination({ destination }: any) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      project_id: destination?.configuration?.project_id,
      dataset_location: destination?.configuration?.dataset_location,
      dataset_id: destination?.configuration?.dataset_id,
      credentials_json: destination?.configuration?.credentials_json,
    });
  }, [destination]);

  return (
    <div className="destination-content">
      <>
        <Row align="top" justify="center">
          <Col span={8}>
            <Form layout="vertical" form={form}>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Project ID" />}
                name="project_id"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Dataset Location" />}
                name="dataset_location"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Default Dataset ID" />}
                name="dataset_id"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="customFormItem"
                label={<CustomLabel label="Credentials JSON" />}
                name="credentials_json"
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
