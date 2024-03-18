// Create Contact
"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  Table,
  Modal,
  DatePicker,
  Form,
  Space,
  message,
  Typography,
  Popconfirm,
} from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";

const InputContainer = (props: any) => {
  const { title, placeholder, handleChange, keyLabel, data, disabled } = props;

  const handleChangeInput = (e: any, keyColumn: any) => {
    handleChange(e.target.value, keyColumn);
  };

  return (
    <>
      <div style={{ fontWeight: "500", marginBottom: "5px" }}>{title}</div>
      <Input
        placeholder={placeholder}
        size="large"
        onChange={(e) => handleChangeInput(e, keyLabel)}
        value={data ? data[keyLabel] : null}
        disabled={disabled}
      />
    </>
  );
};

const DatepickerContainer = (props: any) => {
  const { title, handleChange, keyLabel, data } = props;

  const handleChangeDate = (dateString: any, keyColumn: any) => {
    handleChange(dateString, keyColumn);
  };

  return (
    <>
      <div style={{ fontWeight: "500", marginBottom: "5px" }}>{title}</div>
      <DatePicker
        onChange={(dateString) => handleChangeDate(dateString, keyLabel)}
        // defaultValue={data ? dayjs(data[keyLabel]) : ""}
        style={{ width: "100%" }}
        size="large"
      />
    </>
  );
};

const associateOptions: { value: string; label: React.ReactNode }[] = [
  { value: "Director", label: "Director" },
  { value: "Whole Time Director", label: "Whole Time Director" },
  { value: "Independent Director", label: "Independent Director" },
  { value: "Additional Director", label: "Additional Director" },
  { value: "Managing Director", label: "Managing Director" },
  { value: "Designated Partner", label: "Designated Partner" },
  { value: "Statutory Auditor", label: "Statutory Auditor" },
  {
    value: "Full time - Company Secretary",
    label: "Full time - Company Secretary",
  },
  {
    value: "Full time - Company Accountant",
    label: "Full time - Company Accountant",
  },
  {
    value: "Full time - Cost Accountant",
    label: "Full time - Cost Accountant",
  },
  {
    value: "Practicing Company Secretary",
    label: "Practicing Company Secretary",
  },
  {
    value: "Practicing Chartered Accountant",
    label: "Practicing Chartered Accountant",
  },
  { value: "Practicing Cost Accountant", label: "Practicing Cost Accountant" },
  { value: "Proprietor", label: "Proprietor" },
  { value: "Partner - Partnership firm", label: "Partner - Partnership firm" },
  { value: "IT Practitioner", label: "IT Practitioner" },
  { value: "Other Professional", label: "Other Professional" },
  { value: "Company Finance Manager", label: "Company Finance Manager" },
  { value: "Company Accounts Team", label: "Company Accounts Team" },
  { value: "CA Firm", label: "CA Firm" },
  { value: "CS Firm", label: "CS Firm" },
  { value: "CWA Firm", label: "CWA Firm" },
  { value: "CEO", label: "CEO" },
  { value: "CFO", label: "CFO" },
  { value: "COO", label: "COO" },
];

const salutationTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Mr", label: "Mr" },
  {
    value: "Mrs",
    label: "Mrs",
  },
  { value: "Ms", label: "Ms" },
  { value: "Dr", label: "Dr" },
  { value: "CS", label: "CS" },
  { value: "CA", label: "CA" },
  { value: "CWA", label: "CWA" },
];

const CreateContact = () => {
  const [loader, setLoader] = useState(false);
  const [addContact, setAddContact] = useState({});
  const [editedContact, setEditedContact] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalConfrimLoading, setModalConfirmLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addAssociate, setAddAssociate]: any = useState({});
  const [associateData, setAssociateData]: any = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [referenceList, setReferenceList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [contacID, setContactID]: any = useState("");
  const router = useRouter();
  const { id }:any = useParams();
  const [form] = Form.useForm();
  const [isModalEdited, setISModalEdited] = useState(null);
  const { Option } = Select;

  useEffect(() => {
    if (id) {
      getContactDataById();
      setContactID(id);
    }
    getContactList();
  }, []);

  const getContactList = () => {
    let variables: any = {
      org_id: 1,
    };
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");

    axios({
      method: "GET",
      url: `/api/contact?${queryString}`,
    })
      .then((res) => {
        setReferenceList(res?.data?.data?.contact);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  interface Option {
    value: string;
    label: string;
  }

  const getContactDataById = () => {
    let variables: any = {
      org_id: 1,
      id: parseInt(id),
    };
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");
    setLoader(true);
    console.log("contact", id);

    if (id) {
      axios({
        method: "GET", // You can replace 'get' with other HTTP methods if needed
        url: `/api/contact/${id}?${queryString}`,
      })
        .then((res) => {
          let initialValues = res?.data?.data?.contact?.[0];
          setAddContact(initialValues);
          const formattedInitialValues = {
            ...initialValues,
            dsc_registered_date: initialValues.dsc_registered_date
              ? dayjs(initialValues.dsc_registered_date, "DD-MM-YYYY")
              : null,
            dsc_renewal_date: initialValues.dsc_renewal_date
              ? dayjs(initialValues.dsc_renewal_date, "DD-MM-YYYY")
              : null,
          };
          form.setFieldsValue(formattedInitialValues);
          setAssociateData(res?.data?.data?.associate);
          setCompanyList(res?.data?.data?.company);
          setLoader(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoader(false);
        });
    }
  };

  const handleChange = (e: any, keyColumn: any) => {
    const updatedState: any = { ...addContact };
    const editedState: any = { ...editedContact };
    updatedState[keyColumn] = e;

    setAddContact(updatedState);
    if (id) {
      editedState[keyColumn] = e;
      setEditedContact(editedState);
    }
  };

  const handleOk = () => {
    setModalConfirmLoading(true);
    if (isModalEdited !== null) {
      let variables: any = {
        id: isModalEdited,
        set: { ...addAssociate },
      };
      axios({
        method: "PUT",
        url: `/api/associate`,
        data: { variables },
      })
        .then((res) => {
          setModalConfirmLoading(false);
          setIsOpen(false);
          setAddAssociate({});
          getContactDataById();
        })
        .catch((err) => {
          console.error("Error:", err);
          setModalConfirmLoading(false);
          setConfirmLoading(false);
        });
    } else {
      let variables = { ...addAssociate, org_id: 1, contact_id: id };
      axios({
        method: "POST",
        url: "/api/associate",
        data: { variables },
      })
        .then((res) => {
          setModalConfirmLoading(false);
          setIsOpen(false);
          setAddAssociate({});
          getContactDataById();
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    }
  };

  const handleClickAdd = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setAddAssociate({});
    setISModalEdited(null);
  };

  const onChange = (date: any, dateString: any, keyLabel: any) => {
    const updatedState: any = { ...addAssociate };

    updatedState[keyLabel] = date.format("DD-MM-YYYY");

    // Update the state
    setAddAssociate(updatedState);
  };

  const handleChangeSelectName = (value: any) => {
    let nameObj = { ...addAssociate, company_id: parseInt(value) };
    setAddAssociate(nameObj);
  };

  const handleChangeSelectAssociate = (value: any, option: any) => {
    let associateObj = { ...addAssociate, association: option?.value };
    setAddAssociate(associateObj);
  };

  const handleDelete = (record: any) => {
    let variables: any = {
      org_id: 1,
      id: record?.key,
    };
    setLoader(true);

    axios({
      method: "DELETE",
      url: `/api/associate`,
      data: { variables },
    })
      .then((res) => {
        console.log("Associate deleted", res?.data?.data);
        setLoader(false);
        getContactDataById();
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const columns: any = [
    {
      title: "Company Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Association",
      dataIndex: "association",
      key: "association",
    },
    {
      title: "Appointemnt Data",
      dataIndex: "appointment_date",
      key: "appointment_date",
    },
    {
      title: "Renewal Duration",
      dataIndex: "renewal_date",
      key: "renewal_date",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <>
          <Space size="middle">
            <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record)}
            >
              <a style={{ color: "#1677ff" }}>Delete</a>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];

  const transformedData =
    associateData &&
    Object.keys(associateData).map((key) => ({
      key: associateData[key]?.id || "",
      name: associateData[key]?.company?.[0]?.name || "",
      association: associateData[key]?.association || "",
      appointment_date: associateData[key]?.appointment_date || "",
      renewal_date: associateData[key]?.renewal_date || "",
    }));

  const onFinish = (values: any) => {
    Object.keys(values).forEach((key) => {
      if (key === "dsc_registered_data" || key === "dsc_renewal_date") {
        values[key] = values[key] && values[key].format("DD-MM-YYYY");
      } else if (typeof values[key] === "undefined") {
        // Handle optional fields with default values
        values[key] = null;
      }
    });
    setConfirmLoading(true);
    setAddContact(values);
    // if (contacID) {
    // console.log("if", id);
    let variables: any = {
      id: id,
      set: { ...values },
    };
    axios({
      method: "PUT",
      url: `/api/contact/${id}`,
      data: { variables },
    })
      .then((res) => {
        let contact_id: any = res?.data?.data?.contact?.returning?.[0]?.id;
        setConfirmLoading(false);
        router.push(`/contact`);
      })
      .catch((err) => {
        console.error("Error:", err);
        setConfirmLoading(false);
      });
    // }
    // else {
    // console.log("else", id);
    // let variables: any = { ...values, org_id: 1 };
    // axios({
    //   method: "POST",
    //   url: "/api/contact",
    //   data: { variables },
    // })
    //   .then((res) => {
    //     let contact_id: any =
    //       res?.data?.data?.insert_contact?.returning?.[0]?.id;
    //     setConfirmLoading(false);
    //     router.push(`/contact/${contact_id}`);
    //   })
    //   .catch((err) => {
    //     console.error("Error:", err);
    //     setConfirmLoading(false);
    //   });
    // }
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  function findIdByName(nameToFind: any, array: any) {
    const foundObject = array.find(({ name }: any) => name === nameToFind);

    if (foundObject) {
      return foundObject.id;
    }

    // Return a default value (you can customize this based on your needs)
    return null;
  }

  const edit = (record: any) => {
    const companyId = findIdByName(record.name, companyList);
    let editAssociate = {
      company_id: companyId,
      association: record?.association,
      appointment_date: record?.appointment_date,
      renewal_date: record?.renewal_date,
    };
    setAddAssociate(editAssociate);
    setISModalEdited(record.key);
    setIsOpen(true);
  };

  const handleClickCancel = () => {
    router.push(`/contact`);
  };

  const contactListOptions =
    referenceList &&
    referenceList.map(({ id, name }) => ({
      value: String(id),
      label: name || "Unknown",
    }));

  const companyListOptions =
    companyList &&
    companyList.map(({ id, name }) => ({
      value: String(id),
      label: name || "Unknown",
    }));

  const onSumbit = (values: any) => {
    Object.keys(values).forEach((key) => {
      if (key === "dsc_registered_date" || key === "dsc_renewal_date") {
        values[key] = values[key] && values[key].format("DD-MM-YYYY");
      } else if (typeof values[key] === "undefined") {
        // Handle optional fields with default values
        values[key] = null;
      }
    });
    setConfirmLoading(true);
    setAddContact(values);
    let variables: any = { ...values, org_id: 1 };
    axios({
      method: "POST",
      url: "/api/contact",
      data: { variables },
    })
      .then((res) => {
        let contact_id: any =
          res?.data?.data?.insert_contact?.returning?.[0]?.id;
        setConfirmLoading(false);
        router.push(`/contact/${contact_id}`);
      })
      .catch((err) => {
        console.error("Error:", err);
        setConfirmLoading(false);
      });
  };

  // console.log("****", dayjs(addAssociate?.renewal_duration, "DD-MM-YYYY"));

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
          Add Contact
        </div>
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="content-create-container">
            {/* <div>
              <Button type="default" onClick={() => setIsEdit(true)}>
                Edit
              </Button>
            </div> */}
            <Form
              form={form}
              layout="vertical"
              variant="filled"
              onFinishFailed={onFinishFailed}
              onFinish={id ? onFinish : onSumbit}
              size="large"
            >
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Salutation"
                    name="salutation"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a Salutation "
                      options={salutationTypeOptions}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>

              <div style={{ display: "flex", gap: "50px" }}>
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
                    <Input />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Alternate Email ID"
                    name="alternate_email"
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
                    label="Phone"
                    name="phone"
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
                  <Form.Item
                    label="Whatsapp"
                    name="whatsapp"
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
                    label="Aadhar"
                    name="aadhar"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Pan"
                    name="pan"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Passport"
                    name="passport"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="DIN"
                    name="din"
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
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="DSC Registered Date"
                    name="dsc_registered_date"
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
                    label="DSC Renewal Date"
                    name="dsc_renewal_date"
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
                    label="Tag"
                    name="tag"
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Reference"
                    name="reference"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a reference"
                      options={contactListOptions}
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
            {id && (
              <>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontWeight: "500" }}>Associate</div>
                  <div
                    className="associate-add-button"
                    onClick={() => handleClickAdd()}
                  >
                    {" "}
                    Add
                  </div>
                </div>
                <Table
                  columns={columns}
                  dataSource={transformedData}
                  bordered={false}
                  pagination={{ pageSize: 5 }}
                  className="custom-table"
                />
              </>
            )}
          </div>
        )}
      </div>
      <Modal
        title="Add Associate"
        open={isOpen}
        onOk={handleOk}
        confirmLoading={modalConfrimLoading}
        onCancel={handleCancel}
        centered
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ marginBottom: "10px" }}>
            <div>Company</div>
            <Select
              style={{ width: 220 }}
              showSearch
              optionFilterProp="children"
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
              options={companyListOptions}
              onChange={handleChangeSelectName}
              value={addAssociate && JSON.stringify(addAssociate?.company_id)}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div>Association</div>
            <Select
              style={{ width: 220 }}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                ((option?.label as string) ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                ((optionA?.label as string) ?? "")
                  .toLowerCase()
                  .localeCompare(
                    ((optionB?.label as string) ?? "").toLowerCase()
                  )
              }
              options={associateOptions}
              onChange={handleChangeSelectAssociate}
              value={addAssociate && addAssociate?.association}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div>
            <div>Appointment Date</div>
            <DatePicker
              onChange={(date, dateString) =>
                onChange(date, dateString, "appointment_date")
              }
              style={{ width: 220 }}
              value={
                addAssociate &&
                addAssociate?.appointment_date &&
                Object.keys(addAssociate).length
                  ? dayjs(addAssociate?.appointment_date, "DD-MM-YYYY")
                  : ""
              }
            />
          </div>
          <div>
            <div>Renewal Duration</div>
            <DatePicker
              onChange={(date, dateString) =>
                onChange(date, dateString, "renewal_date")
              }
              style={{ width: 220 }}
              value={
                addAssociate &&
                addAssociate?.renewal_date &&
                Object.keys(addAssociate).length
                  ? dayjs(addAssociate?.renewal_date, "DD-MM-YYYY")
                  : ""
              }
            />
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default withRoles(CreateContact, ["org:admin", "org:member"]);
