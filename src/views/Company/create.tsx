// Create Company
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
  Popconfirm,
  Typography,
  InputNumber,
} from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";

import { associateOptions } from "../../helper";

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
        size="middle"
        onChange={(e) => handleChangeInput(e, keyLabel)}
        value={data ? data[keyLabel] : null}
        disabled={disabled}
      />
    </>
  );
};

const companyTypeOptions: { value: string; label: React.ReactNode }[] = [
  { value: "Private Limited", label: "Private Limited" },
  {
    value: "LLP (Limited Liability Partnership)",
    label: "LLP (Limited Liability Partnership)",
  },
  { value: "OPC (One Person Company)", label: "OPC (One Person Company)" },
  { value: "Public Company", label: "Public Company" },
  { value: "Nidhi Company", label: "Nidhi Company" },
  { value: "Chit Company", label: "Chit Company" },
  {
    value: "Section 8",
    label: "Section 8",
  },
  {
    value: "CA Firm",
    label: "CA Firm",
  },
  {
    value: "CS Firm",
    label: "CS Firm",
  },
  {
    value: "CWA Firm",
    label: "CWA Firm",
  },
  {
    value: "IT Practitioner firm",
    label: "IT Practitioner firm",
  },
  { value: "Proprietorship firm", label: "Proprietorship firm" },
  { value: "Partnership firm", label: "Partnership firm" },
];

const ROCTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Chennai", label: "Chennai" },
  {
    value: "Coimbatore",
    label: "Coimbatore",
  },
  { value: "Bengaluru", label: "Bengaluru" },
];

const RDTypeOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Coimbatore Southern Region", label: "Coimbatore Southern Region" },
  {
    value: "Chennai Southern Region",
    label: "Chennai Southern Region",
  },
  { value: "Bengaluru Southern Region", label: "Bengaluru Southern Region" },
];

const StatusOptions: { value: any; label: React.ReactNode }[] = [
  { value: "Active", label: "Active" },
  {
    value: "Strick Off",
    label: "Strick Off",
  },
  { value: "Amalgamated", label: "Amalgamated" },
  { value: "Dormant", label: "Dormant" },
  { value: "Dormant Under Section 455", label: "Dormant Under Section 455" },
  { value: "Active In Progress", label: "Active In Progress" },
  { value: "Not Available for eFiling", label: "Not Available for eFiling" },
  { value: "Converted to LLP", label: "Converted to LLP" },
  {
    value: "Converted to LLP and Dissolved",
    label: "Converted to LLP and Dissolved",
  },
  { value: "Dissolved", label: "Dissolved" },
  { value: "Under Liquidation", label: "Under Liquidation" },
  { value: "Liquidated", label: "Liquidated" },
  {
    value: "Strike-off Under Processing",
    label: "Strike-off Under Processing",
  },
  { value: "Captured", label: "Captured" },
  {
    value: "Converted to PRIVATE LIMITED",
    label: "Converted to PRIVATE LIMITED",
  },
  {
    value: "Converted to PRIVATE LIMITED and Dissolved",
    label: "Converted to PRIVATE LIMITED and Dissolveds",
  },
];

const CreateCompany = () => {
  const [loader, setLoader] = useState(false);
  const [addCompany, setAddCompany]: any = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [associateData, setAssociateData]: any = useState([]);
  const [modalConfrimLoading, setModalConfirmLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addAssociate, setAddAssociate]: any = useState({});
  const [contactList, setContactList] = useState([]);
  const [isModalEdited, setISModalEdited] = useState(null);
  const [isCompanyModalEdited, setCompanyModalEdited] = useState(null);
  const [userList, setUserList]: any = useState(null);
  const [companyList, setCompanyList]: any = useState(null);
  const [companyShareData, setCompanyShareData]: any = useState(null);
  const [addCompanyShare, setAddCompanyShare]: any = useState({});
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
  const [isCompanyModalConfrimLoading, setCompnayModalConfrimLoading] =
    useState(false);
  const router = useRouter();
  const { id }: any = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      getCompanyDataById();
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

  const getCompanyDataById = () => {
    setLoader(true);
    if (id) {
      axios({
        method: "GET", // You can replace 'get' with other HTTP methods if needed
        url: `/api/company/${id}`,
      })
        .then((res) => {
          let initialValues = res?.data?.data?.company?.[0];
          setAddCompany(initialValues);
          const formattedInitialValues = {
            ...initialValues,
            incorporation_date: initialValues.incorporation_date
              ? dayjs(initialValues.incorporation_date, "DD-MM-YYYY")
              : null,
            agm_date: initialValues.agm_date
              ? dayjs(initialValues.agm_date, "YYYY-MM-DD")
              : null,
            balancesheet_date: initialValues.balancesheet_date
              ? dayjs(initialValues.balancesheet_date, "YYYY-MM-DD")
              : null,
          };
          form.setFieldsValue(formattedInitialValues);
          setAssociateData(res?.data?.data?.associate);
          setContactList(res?.data?.data?.contact);
          setCompanyShareData(res?.data?.data?.company_share);
          setCompanyList(res?.data?.data?.companyList);
          setLoader(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoader(false);
        });
    }
  };

  const onFinish = (values: any) => {
    Object.keys(values).forEach((key) => {
      if (key === "incorporation_date") {
        values[key] = values[key] && values[key].format("DD-MM-YYYY");
      }
      if (key === "agm_date" || key === "balancesheet_date") {
        values[key] = values[key] && values[key].format("YYYY-MM-DD");
      } else if (typeof values[key] === "undefined") {
        // Handle optional fields with default values
        values[key] = null;
      }
    });
    setConfirmLoading(true);
    setAddCompany(values);
    if (id) {
      let variables: any = {
        id: parseInt(id),
        set: { ...values },
      };
      axios({
        method: "PUT",
        url: `/api/company/${id}`,
        data: { variables },
      })
        .then((res) => {
          let company_id: any = res?.data?.data?.company?.returning?.[0]?.id;
          setConfirmLoading(false);
          router.push(`/company`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    } else {
      let variables: any = { ...values, org_id: 1 };
      axios({
        method: "POST",
        url: "/api/company",
        data: { variables },
      })
        .then((res) => {
          let company_id: any =
            res?.data?.data?.insert_company?.returning?.[0]?.id;
          setConfirmLoading(false);
          router.push(`/company/${company_id}`);
        })
        .catch((err) => {
          console.error("Error:", err);
          setConfirmLoading(false);
        });
    }
  };

  const handleClickCancel = () => {
    router.push(`/company`);
  };

  function findIdByName(nameToFind: any, array: any) {
    const foundObject = array.find(({ name }: any) => name === nameToFind);
    console.log("foundObject",nameToFind,array)

    if (foundObject) {
      return foundObject.id;
    }

    // Return a default value (you can customize this based on your needs)
    return null;
  }

  function findIdByID(nameToFind: any, array: any) {
    const foundObject = array.find(({ id }: any) => id === nameToFind);

    if (foundObject) {
      return foundObject.name;
    }

    // Return a default value (you can customize this based on your needs)
    return null;
  }

  const edit = (record: any) => {
    const contactId = findIdByName(record.name, contactList);
    let editAssociate = {
      contact_id: contactId,
      association: record?.association,
      appointment_date: record?.appointment_date,
      renewal_date: record?.renewal_date,
      share: record?.share,
      face_value: record?.face_value,
      amount: record?.amount
    };
    setAddAssociate(editAssociate);
    setISModalEdited(record.key);
    setIsOpen(true);
  };

  const companyedit = (record: any) => {
    let editCompany = {
      company_id: parseInt(id),
      association: record?.association,
      appointment_date: record?.appointment_date,
      renewal_date: record?.renewal_date,
      share: record?.share,
      face_value: record?.face_value,
      amount: record?.amount,
    };
    setAddCompanyShare(editCompany);
    setCompanyModalEdited(record.key);
    setCompanyModalOpen(true);
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
        setLoader(false);
        getCompanyDataById();
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const handleDeletecompany = (record: any) => {
    let variables: any = {
      org_id: 1,
      id: record?.key,
    };
    setLoader(true);

    axios({
      method: "DELETE",
      url: `/api/company_share`,
      data: { variables },
    })
      .then((res) => {
        setLoader(false);
        getCompanyDataById();
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const totalShares = addCompany?.total_share;

  const columns: any = [
    {
      title: "Names",
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
      title: "Share Details",
      dataIndex: "share",
      key: "share",
    },
    {
      title: "Share Percentage",
      dataIndex: "share_percentage",
      key: "share_percentage",
      render: (_: any, record: any) => {
        if (record.share !== null && totalShares !== null) {
          const sharePercentage = (record.share / totalShares) * 100;
          return `${sharePercentage.toFixed(0)}%`;
        }
        return ""; // You can customize this based on your needs
      },
    },
    {
      title: "Face Value",
      dataIndex: "face_value",
      key: "face_value",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <a style={{ color: "#1677ff" }}>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsCompany: any = [
    {
      title: "Names",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: any) => {
        const nameValue = findIdByID(record.name, companyList);
        return nameValue;
      },
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
      title: "Share Details",
      dataIndex: "share",
      key: "share",
    },
    {
      title: "Share Percentage",
      dataIndex: "share_percentage",
      key: "share_percentage",
      render: (_: any, record: any) => {
        if (record.share !== null && totalShares !== null) {
          const sharePercentage = (record.share / totalShares) * 100;
          return `${sharePercentage.toFixed(0)}%`;
        }
        return ""; // You can customize this based on your needs
      },
    },
    {
      title: "Face Value",
      dataIndex: "face_value",
      key: "face_value",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Typography.Link onClick={() => companyedit(record)}>
            Edit
          </Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeletecompany(record)}
          >
            <a style={{ color: "#1677ff" }}>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    setModalConfirmLoading(true);
    Object.keys(addAssociate).forEach((key) => {
      if (key === "appointment_date" || key === "renewal_date") {
        if (addAssociate[key]) {
          addAssociate[key] = dayjs(addAssociate[key], "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          );
        }
      } else if (addAssociate[key] === "") {
        // Handle optional fields with default values
        addAssociate[key] = null;
      }
    });
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
          getCompanyDataById();
        })
        .catch((err) => {
          console.error("Error:", err);
          setModalConfirmLoading(false);
          setConfirmLoading(false);
        });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setAddAssociate({});
    setISModalEdited(null);
  };

  const handleChange = (e: any, keyColumn: any) => {
    const updatedState: any = { ...addAssociate };
    updatedState[keyColumn] = e;

    setAddAssociate(updatedState);
  };

  const handleChangecompanyShare = (e: any, keyColumn: any) => {
    const updatedState: any = { ...addCompanyShare };
    updatedState[keyColumn] = e;

    setAddCompanyShare(updatedState);
  };

  const transformedData =
    associateData &&
    Object.keys(associateData).map((key) => ({
      key: associateData[key]?.id || "",
      name: associateData[key]?.contact?.[0]?.name || "",
      association: associateData[key]?.association || "",
      appointment_date:
        dayjs(associateData[key]?.appointment_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || null,
      renewal_date:
        dayjs(associateData[key]?.renewal_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || null,
      share: associateData[key]?.share || "",
      face_value: associateData[key]?.face_value || "",
      amount: associateData[key]?.amount || "",
    }));

  const transformedCompanyData =
    companyShareData &&
    Object.keys(companyShareData).map((key) => ({
      key: companyShareData[key]?.id || "",
      name: companyShareData[key]?.share_company_id || "",
      association: companyShareData[key]?.association || "",
      appointment_date:
        dayjs(companyShareData[key]?.appointment_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || null,
      renewal_date:
        dayjs(companyShareData[key]?.renewal_date, "YYYY-MM-DD").format(
          "DD-MM-YYYY"
        ) || null,
      share: companyShareData[key]?.share || "",
      face_value: companyShareData[key]?.face_value || "",
      amount: companyShareData[key]?.amount || "",
    }));

  const contactListOptions =
    contactList &&
    contactList.map(({ id, name }) => ({
      value: String(id),
      label: name || "Unknown",
    }));

  const companyListOptions =
    companyList &&
    companyList.map(({ id, name }: any) => ({
      value: String(id),
      label: name || "Unknown",
    }));
  const handleClickAdd = () => {
    setCompanyModalOpen(true);
  };

  const handleModalCancel = () => {
    setCompanyModalOpen(false);
    setAddCompanyShare({});
    setCompanyModalEdited(null);
  };

  const handleChangeSelectName = (value: any) => {
    let nameObj = { ...addCompanyShare, share_company_id: parseInt(value) };
    setAddCompanyShare(nameObj);
  };

  const handleChangeSelectAssociate = (value: any, option: any) => {
    let associateObj = { ...addCompanyShare, association: option?.value };
    setAddCompanyShare(associateObj);
  };

  const onChange = (date: any, dateString: any, keyLabel: any) => {
    const updatedState: any = { ...addCompanyShare };

    updatedState[keyLabel] = date.format("DD-MM-YYYY");

    // Update the state
    setAddCompanyShare(updatedState);
  };

  const handleCompanyShareOk = () => {
    let formatCompanyShare = { ...addCompanyShare };
    setCompnayModalConfrimLoading(true)
    Object.keys(addCompanyShare).forEach((key) => {
      if (key === "appointment_date" || key === "renewal_date") {
        if (formatCompanyShare[key]) {
          formatCompanyShare[key] = dayjs(
            formatCompanyShare[key],
            "DD-MM-YYYY"
          ).format("YYYY-MM-DD");
        }
      }
    });
    if (isCompanyModalEdited !== null) {
      let variables: any = {
        id: isCompanyModalEdited,
        set: { ...formatCompanyShare },
      };
      axios({
        method: "PUT",
        url: `/api/company_share`,
        data: { variables },
      })
        .then((res) => {
          setCompnayModalConfrimLoading(false);
          setCompanyModalOpen(false);
          setAddCompanyShare(null);
          getCompanyDataById();
        })
        .catch((err) => {
          console.error("Error:", err);
          setCompnayModalConfrimLoading(false);
        });
    } else {
      let variables = {
        ...formatCompanyShare,
        org_id: 1,
        company_id: parseInt(id),
      };
      axios({
        method: "POST",
        url: "/api/company_share",
        data: { variables },
      })
        .then((res) => {
          setCompnayModalConfrimLoading(false);
          setCompanyModalOpen(false);
          setAddCompanyShare({});
          getCompanyDataById();
        })
        .catch((err) => {
          console.error("Error:", err);
          setCompnayModalConfrimLoading(false);
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
          Add Company
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
                    rules={[{ required: false, message: "Please input!" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Account owner"
                    name="account_owner"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Please select a reference"
                      options={userList}
                    />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Company Type"
                    name="type"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select options={companyTypeOptions} />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Date of Incorporation"
                    name="incorporation_date"
                    rules={[{ required: false, message: "Please input!" }]}
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
                    label="CIN/Firm No"
                    name="cin"
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
                    label="Company Status"
                    name="status"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select options={StatusOptions} />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Paid Up Capital"
                    name="paid_up_capital"
                    rules={[{ required: false, message: "Please input!" }]}
                    initialValue={0}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Authorized Capital                    "
                    name="authorized_capital"
                    rules={[{ required: false, message: "Please input!" }]}
                    initialValue={0}
                  >
                    <InputNumber style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Total Shares"
                    name="total_share"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                    initialValue={0}
                  >
                    <InputNumber style={{ width: "100%" }} />
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
                    <Input style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="ROC"
                    name="roc"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select options={ROCTypeOptions} />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="RD Office"
                    name="rd_office"
                    rules={[
                      {
                        required: false,
                        message: "Please input!",
                      },
                    ]}
                  >
                    <Select options={RDTypeOptions} />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Last AGM Date"
                    name="agm_date"
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
                    label="Date of Balance sheet"
                    name="balancesheet_date"
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
                <div style={{ width: "50%" }}></div>
              </div>

              <div className="company-address-heading">Registered Office</div>
              <div style={{ display: "flex", gap: "50px" }}>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    label="Address Line 1"
                    name="address_line_1"
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
                    label="Address Line 2"
                    name="address_line_2"
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
                    label="City"
                    name="city"
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
                    label="State"
                    name="state"
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
                    label="Country"
                    name="country"
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
                    label="Pincode"
                    name="pincode"
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
                <>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ fontWeight: "500", fontSize: "20px" }}>
                      Member(s)
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
                <>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ fontWeight: "500", fontSize: "20px" }}>
                      Company Member(s)
                    </div>
                    <div
                      className="associate-add-button"
                      onClick={() => handleClickAdd()}
                    >
                      {" "}
                      Add
                    </div>
                  </div>
                  <Table
                    columns={columnsCompany}
                    dataSource={transformedCompanyData}
                    bordered={false}
                    pagination={{ pageSize: 5 }}
                    className="custom-table"
                  />
                </>
              </>
            )}
          </div>
        )}
      </div>
      <Modal
        title="Associate"
        open={isOpen}
        onOk={handleOk}
        confirmLoading={modalConfrimLoading}
        onCancel={handleCancel}
        centered
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ marginBottom: "10px" }}>
            <div>Contact</div>
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
              disabled={true}
              options={contactListOptions}
              value={addAssociate && JSON.stringify(addAssociate?.contact_id)}
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
              disabled={true}
              value={addAssociate && addAssociate?.association}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div>
            <div>Appointment Date</div>
            <DatePicker
              style={{ width: 220 }}
              value={
                addAssociate &&
                addAssociate?.appointment_date &&
                Object.keys(addAssociate).length
                  ? dayjs(addAssociate?.appointment_date, "DD-MM-YYYY")
                  : null
              }
              disabled={true}
            />
          </div>
          <div>
            <div>Renewal Duration</div>
            <DatePicker
              style={{ width: 220 }}
              value={
                addAssociate &&
                addAssociate?.renewal_date &&
                Object.keys(addAssociate).length
                  ? dayjs(addAssociate?.renewal_date, "DD-MM-YYYY")
                  : null
              }
              disabled={true}
            />
          </div>
        </div>
        <div style={{ marginTop: "15px", display: "flex", gap: "15px" }}>
          <div style={{ width: "50%" }}>
            <InputContainer
              title="Share Details"
              placeholder="Share"
              handleChange={handleChange}
              keyLabel="share"
              data={addAssociate}
            />
          </div>
          <div style={{ width: "50%" }}>
            <InputContainer
              title="Face Value"
              placeholder="Face Value"
              handleChange={handleChange}
              keyLabel="face_value"
              data={addAssociate}
            />
          </div>
        </div>
        <div style={{ marginTop: "15px", display: "flex", gap: "15px" }}>
          <div style={{ width: "50%" }}>
            <InputContainer
              title="Amount"
              placeholder="Amount"
              handleChange={handleChange}
              keyLabel="amount"
              data={addAssociate}
            />
          </div>
          <div style={{ width: "50%" }}></div>
        </div>
      </Modal>
      <Modal
        title="Company Shares"
        open={isCompanyModalOpen}
        onOk={handleCompanyShareOk}
        confirmLoading={isCompanyModalConfrimLoading}
        onCancel={handleModalCancel}
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
              value={
                addCompanyShare && JSON.stringify(addCompanyShare?.company_id)
              }
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
              value={addCompanyShare && addCompanyShare?.association}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div>
            <div>Appointment Date</div>
            <DatePicker
              style={{ width: 220 }}
              onChange={(date, dateString) =>
                onChange(date, dateString, "appointment_date")
              }
              value={
                addCompanyShare &&
                addCompanyShare?.appointment_date &&
                Object.keys(addCompanyShare).length
                  ? dayjs(addCompanyShare?.appointment_date, "DD-MM-YYYY")
                  : null
              }
            />
          </div>
          <div>
            <div>Renewal Duration</div>
            <DatePicker
              style={{ width: 220 }}
              onChange={(date, dateString) =>
                onChange(date, dateString, "renewal_date")
              }
              value={
                addCompanyShare &&
                addCompanyShare?.renewal_date &&
                Object.keys(addCompanyShare).length
                  ? dayjs(addCompanyShare?.renewal_date, "DD-MM-YYYY")
                  : null
              }
            />
          </div>
        </div>
        <div style={{ marginTop: "15px", display: "flex", gap: "15px" }}>
          <div style={{ width: "50%" }}>
            <InputContainer
              title="Share Details"
              placeholder="Share"
              handleChange={handleChangecompanyShare}
              keyLabel="share"
              data={addCompanyShare}
            />
          </div>
          <div style={{ width: "50%" }}>
            <InputContainer
              title="Face Value"
              placeholder="Face Value"
              handleChange={handleChangecompanyShare}
              keyLabel="face_value"
              data={addCompanyShare}
            />
          </div>
        </div>
        <div style={{ marginTop: "15px", display: "flex", gap: "15px" }}>
          <div style={{ width: "50%" }}>
            <InputContainer
              title="Amount"
              placeholder="Amount"
              handleChange={handleChangecompanyShare}
              keyLabel="amount"
              data={addCompanyShare}
            />
          </div>
          <div style={{ width: "50%" }}></div>
        </div>
      </Modal>
    </Layout>
  );
};

export default withRoles(CreateCompany, ["org:admin", "org:member"]);
