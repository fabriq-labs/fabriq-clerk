// Create Ticket
"use client";
import React, { useEffect, useState } from "react";
import { Input, Select, Button, Form, Space, DatePicker, Popconfirm } from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import { CopyOutlined } from "@ant-design/icons";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";

import { priorityTypeOptions,serviceTypeOptions, statusTypeOptions } from "../../helper";
const ticketTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Ticket", label: "Ticket" },
  {
    value: "Task",
    label: "Task",
  },
];

const CreateTicket = () => {
  const [loader, setLoader] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [duplicateValue, setDuplicateValue]: any = useState({});
  const [disableIcon, setDisableIcon] = useState(false);
  const [userList, setUserList]:any = useState(null);
  const router = useRouter();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  useEffect(() => {
    if (id) {
      getTicketDataById();
    } else {
      getCompanyList();
    }
    getUserList();
  }, []);

  const getUserList = () => {
    axios({
      method: "GET",
      url: `/api/user`,
    })
      .then((res) => {
        let userData = res?.data?.data?.user;
        const formattedData = userData.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        setUserList(formattedData);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const getTicketDataById = () => {
    let variables: any = {
      org_id: 1,
      id: id,
    };
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");
    setLoader(true);
    if (id) {
      axios({
        method: "GET", // You can replace 'get' with other HTTP methods if needed
        url: `/api/ticket/${id}`,
      })
        .then((res) => {
          let initialValues: any = res?.data?.data?.ticket?.[0];
          let compantValues = res?.data?.data?.company;
          setCompanyData(res?.data?.data?.company);
          const companyNames = compantValues.map((company: any) => ({
            label: company.name,
            value: company.id,
          }));
          setCompanyList(companyNames);
          handleCompanyChange(
            initialValues?.company_id,
            res?.data?.data?.company
          );
          setDuplicateValue(initialValues);
          const formattedInitialValues = {
            ...initialValues,
            due_date: initialValues.due_date
              ? dayjs(initialValues.due_date, "YYYY-MM-DD")
              : null,
            pay_due_date: initialValues.pay_due_date
              ? dayjs(initialValues.pay_due_date, "YYYY-MM-DD")
              : null,
          };
          form.setFieldsValue(formattedInitialValues);
          setLoader(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoader(false);
        });
    }
  };

  const getCompanyList = () => {
    let variables: any = {
      org_id: 1,
    };
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");
    setLoader(true);
    axios({
      method: "GET", // You can replace 'get' with other HTTP methods if needed
      url: `/api/ticket/company`,
    })
      .then((res) => {
        let initialValues = res?.data?.data?.company;
        setCompanyData(initialValues);
        const companyNames = initialValues.map((company: any) => ({
          label: company.name,
          value: company.id,
        }));
        setCompanyList(companyNames);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const handleClickCancel = () => {
    router.push(`/ticket`);
  };

  const handleCompanyChange = (value: any, data: any) => {
    const selectedCompany: any = data.find(
      (company: any) => company?.id === value
    );

    // Extract contact names from the selected company
    const contactNames = selectedCompany
      ? selectedCompany?.company
          .map((c: any) =>
            c.contact.map((ct: any) => ({
              label: ct.name,
              value: ct.id,
            }))
          )
          .flat()
      : [];
    setContacts(contactNames);
  };

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    Object.keys(values).forEach((key) => {
      if (key === "due_date" || key === "pay_due_date") {
        values[key] = values[key] && values[key].format("YYYY-MM-DD");
      } else if (typeof values[key] === "undefined") {
        // Handle optional fields with default values
        values[key] = null;
      }
    });
    if (id) {
      let variables: any = {
        id: id,
        set: { ...values },
      };
      axios({
        method: "PUT",
        url: `/api/ticket/${id}`,
        data: { variables },
      })
        .then((res) => {
          setConfirmLoading(false);
          router.push(`/ticket`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    } else {
      let variables: any = { ...values, org_id: 1 };
      axios({
        method: "POST",
        url: "/api/ticket",
        data: { variables },
      })
        .then((res) => {
          let ticket_id: any =
            res?.data?.data?.insert_ticket?.returning?.[0]?.id;
          setConfirmLoading(false);
          router.push(`/ticket`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    }
  };

  const handleClickDuplicate = () => {
    if (!disableIcon) {
      let variables = {
        ...duplicateValue,
        subject: `${duplicateValue?.subject} - copy`,
        org_id: 1,
      };
      const { id, ...newVariables } = variables;
      setDisableIcon(true);
      axios({
        method: "POST",
        url: "/api/ticket",
        data: { variables: newVariables },
      })
        .then((res) => {
          let ticket_id: any =
            res?.data?.data?.insert_ticket?.returning?.[0]?.id;
          setDisableIcon(false);
          router.push(`/ticket`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setDisableIcon(false);
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
        <div
          style={{
            fontSize: "24px",
            fontWeight: "600",
            width: "75%",
            display: "flex",
          }}
        >
          Add Ticket
          <Popconfirm
              title="Do you want to duplicate this ticket?"
              onConfirm={() => handleClickDuplicate()}
            >
          <div
            style={{
              marginLeft: "10px",
              marginTop: "2px",
              color: !disableIcon ? "#000" : "#dad9d9",
              cursor: "pointer",
            }}
          >
            <CopyOutlined style={{ width: "20px", height: "20px" }} />
          </div>
          </Popconfirm>
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
              //   onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              size="large"
            >
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Ticket Type"
                    name="type"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a type"
                      options={ticketTypeOptions}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                <Form.Item
                    label="Service Type"
                    name="service_type"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a service type"
                      options={serviceTypeOptions}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                <Form.Item
                    label="Assign To"
                    name="assignee_id"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Select
                      placeholder="Please select a assignee"
                      options={userList}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a type"
                      options={statusTypeOptions}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                <Form.Item
                    label="Due Date"
                    name="due_date"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <DatePicker
                      format={"DD-MM-YYYY"}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Pay Later (Due Date)"
                    name="pay_due_date"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <DatePicker
                      format={"DD-MM-YYYY"}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                <Form.Item
                    label="Company"
                    name="company_id"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a company"
                      options={companyList}
                      onChange={(value) =>
                        handleCompanyChange(value, companyData)
                      }
                    />
                  </Form.Item>
                  
                </div>
                <div style={{ width: "50%" }}>
                <Form.Item
                    label="Priority"
                    name="priority"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a priority"
                      options={priorityTypeOptions}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Subject"
                    name="subject"
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
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <TextArea
                      style={{ width: "100%" }}
                      autoSize={{ minRows: 5, maxRows: 6 }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Ticket Notification"
                    name="contact_id"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Tags Mode"
                      options={contacts}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Tag"
                    name="tag"
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
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "100%" }}>
                  <Form.Item
                    label="Comments"
                    name="comment"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <TextArea
                      style={{ width: "100%" }}
                      autoSize={{ minRows: 5, maxRows: 6 }}
                    />
                  </Form.Item>
                </div>
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

export default withRoles(CreateTicket, ["org:admin", "org:member"]);
