// Create User
"use client";
import React, { useEffect, useState } from "react";
import { Input, Select, Button, Form, Space, DatePicker } from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";

const CreateUser = () => {
  const [loader, setLoader] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const router = useRouter();
  const { id }: any = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      getUserDataById();
    }
  }, []);

  const getUserDataById = () => {
    setLoader(true);
    if (id) {
      axios({
        method: "GET",
        url: `/api/user/${id}`,
      })
        .then((res) => {
          let initialValues: any = res?.data?.data?.user?.[0];
          form.setFieldsValue(initialValues);
          setLoader(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoader(false);
        });
    }
  };

  const handleClickCancel = () => {
    router.push(`/user`);
  };

  const onFinish = (values: any) => {
    Object.keys(values).forEach((key) => {
      if (typeof values[key] === "undefined") {
        values[key] = null;
      }
    });
    setConfirmLoading(true);
    if (id) {
      let variables: any = {
        id: id,
        set: { ...values },
      };
      axios({
        method: "PUT",
        url: `/api/user/${id}`,
        data: { variables },
      })
        .then((res) => {
          setConfirmLoading(false);
          router.push(`/user`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    }
  };

  return (
    <Layout>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "50px",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "600", width: "75%" }}>
          User
        </div>
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="content-create-container">
            <Form
              form={form}
              layout="vertical"
              variant="filled"
              onFinish={onFinish}
              size="large"
            >
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Email ID"
                    name="email"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} disabled/>
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Alternate Phone"
                    name="alternate_phone"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    {" "}
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Input style={{ width: "100%" }} disabled/>
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}></div>
              </div>
              <Form.Item
                wrapperCol={{ span: 12 }}
                style={{ display: "flex", justifyContent: "end" }}
              >
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={confirmLoading}
                  >
                    Submit
                  </Button>
                  <Button onClick={handleClickCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default withRoles(CreateUser, ["org:admin", "org:member"]);
