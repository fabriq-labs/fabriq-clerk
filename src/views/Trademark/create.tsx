// Create Trademark
"use client";
import React, { useEffect, useState } from "react";
import { Input, Select, Button, Form, Space, DatePicker } from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";

const markTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Word mark", label: "Word mark" },
  {
    value: "Logo",
    label: "Logo",
  }
];

const CreateTrademark = () => {
  const [loader, setLoader] = useState(false);
  const [addTrademark, setAddTrademark] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const router = useRouter();
  const { id }: any = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      getTicketDataById();
    } else {
      getCompanyList();
    }
  }, []);

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
        method: "GET",
        url: `/api/trademark/${id}`,
      })
        .then((res) => {
          let initialValues: any = res?.data?.data?.trademark?.[0];
          let compantValues = res?.data?.data?.company;
          const formattedInitialValues = {
            ...initialValues,
            registered_date: initialValues.registered_date
              ? dayjs(initialValues.registered_date, "YYYY-MM-DD")
              : null,
            renewal_date: initialValues.renewal_date
              ? dayjs(initialValues.renewal_date, "YYYY-MM-DD")
              : null,
          };
          setCompanyData(res?.data?.data?.company);
          const companyNames = compantValues.map((company: any) => ({
            label: company.name,
            value: company.id,
          }));
          setCompanyList(companyNames);
          handleCompanyChange(
            formattedInitialValues?.company_id,
            res?.data?.data?.company
          );
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

  const handleCompanyChange = (value: any, data: any) => {
    // Find the selected company in the API response
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

  const handleClickCancel = () => {
    router.push(`/trademark`);
  };

  const onFinish = (values: any) => {
    Object.keys(values).forEach((key) => {
      if (key === "registered_date" || key === "renewal_date") {
        values[key] = values[key] && values[key].format("YYYY-MM-DD");
      } else if (typeof values[key] === "undefined") {
        // Handle optional fields with default values
        values[key] = null;
      }
    });
    setConfirmLoading(true);
    setAddTrademark(values);
    if (id) {
      let variables: any = {
        id: id,
        set: { ...values },
      };
      axios({
        method: "PUT",
        url: `/api/trademark/${id}`,
        data: { variables },
      })
        .then((res) => {
          setConfirmLoading(false);
          router.push(`/trademark`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    } else {
      let variables: any = { ...values, org_id: 1 };
      axios({
        method: "POST",
        url: "/api/trademark",
        data: { variables },
      })
        .then((res) => {
          let trademark_id: any =
            res?.data?.data?.insert_trademark?.returning?.[0]?.id;
          setConfirmLoading(false);
          router.push(`/trademark/${trademark_id}`);
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
          Add Trademark
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
                      placeholder="Please select a type"
                      options={companyList}
                      showSearch
                      filterOption={(input, option: any) =>
                        ((option?.label as string) ?? "").includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        ((optionA?.label as string) ?? "")
                          .toLowerCase()
                          .localeCompare(
                            ((optionB?.label as string) ?? "").toLowerCase()
                          )
                      }
                      onChange={(value) =>
                        handleCompanyChange(value, companyData)
                      }
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Brand Name"
                    name="brand_name"
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
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Registered Date"
                    name="registered_date"
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
                    label="Renewal Date"
                    name="renewal_date"
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
                    label="Contact"
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
                <div style={{ width: "50%" }}>
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
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Mark"
                    name="mark"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a mark "
                      options={markTypeOptions}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Trademark Number"
                    name="number"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Class"
                    name="class"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
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

export default withRoles(CreateTrademark, ["org:admin", "org:member"]);
