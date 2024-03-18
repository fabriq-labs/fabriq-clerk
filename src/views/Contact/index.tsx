"use client"
import React, { useEffect, useState } from "react";
import { Table, Popconfirm, Typography, Space, Input } from "antd";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

// Component
import { withRoles } from "@/app/role";
import Layout from "../../components/layout";
import { authorize, getPath } from "@/helper";

// Interfaces
interface Company {
  name: string;
  type: string;
  country: string;
  id: number;
}

export const Contact = () => {
  const [loader, setLoader] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [haveCreatePermission, setHavePermission] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { orgRole }: any = useAuth();

  useEffect(() => {
    getContactData();
    let pathValue: any = getPath(pathname);
    let addPermission = authorize(orgRole, pathValue, "POST");
    setHavePermission(addPermission);
  }, []);

  const getContactData = () => {
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
        setContactData(res?.data?.data?.contact);
        setLoader(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const edit = (record: any) => {
    router.push(`/contact/${record.id}`);
  };

  const handleDelete = (record: any) => {
    let variables: any = {
      org_id: 1,
      id: record?.id,
    };
    setLoader(true);
    const queryString = Object.keys(variables)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(variables[key])}`
      )
      .join("&");

    axios({
      method: "DELETE",
      url: `/api/contact/${record?.id}?${queryString}`,
    })
      .then((res) => {
        console.log("contact deleted", res?.data?.data);
        setLoader(false);
        getContactData();
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoader(false);
      });
  };

  const handleChangeSearch = (e: any) => {
    const searchValueTemp = e.target.value.toLowerCase();
    setSearchValue(searchValueTemp);
  };

  const columns: any = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "E-Mail",
      dataIndex: "email",
      key: "email",
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

  let filteredData = contactData.filter((item: Company) =>
    item.name.toLowerCase().includes(searchValue)
  );

  return (
    <Layout>
      <div className="dashboard-container">
        {loader ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="contact-wrapper">
              <div className="contact-content">
                <div className="contact-header">
                  <div className="contact-header-title">Contact</div>
                  <div className="search-container">
                    <Input
                      placeholder="search contact name"
                      style={{ width: "200px" }}
                      onChange={(e) => handleChangeSearch(e)}
                    />
                  </div>
                  {haveCreatePermission && (
                    <Link href="/contact/create">
                      <span className="contact-add-button">Add Contact</span>
                    </Link>
                  )}
                </div>
                <div className="contact-body">
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    bordered={false}
                    pagination={{ pageSize: 10 }}
                    className="custom-table"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default withRoles(Contact, ["org:admin", "org:member"]);

{
  /* <>
<div>
  <Button type="default" onClick={() => setIsEdit(true)}>
    Edit
  </Button>
</div>
<div style={{ display: "flex", gap: "50px", margin: "15px 0" }}>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Name"
      placeholder="name"
      handleChange={handleChange}
      keyLabel="name"
      data={addContact}
      disabled={isEdit ? false:  true}
    />
  </div>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Passport number"
      placeholder="passport number"
      handleChange={handleChange}
      keyLabel="passport"
      data={addContact}
    />
  </div>
</div>
<div style={{ display: "flex", gap: "50px", margin: "15px 0" }}>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Email ID"
      placeholder="email"
      handleChange={handleChange}
      keyLabel="email"
      data={addContact}
    />
  </div>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Alternate Email ID"
      placeholder="alternate email"
      handleChange={handleChange}
      keyLabel="alternate_email"
      data={addContact}
    />
  </div>
</div>
<div style={{ display: "flex", gap: "50px", margin: "15px 0" }}>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Phone"
      placeholder="phone"
      handleChange={handleChange}
      keyLabel="phone"
      data={addContact}
    />
  </div>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Whatsapp"
      placeholder="whatsapp"
      handleChange={handleChange}
      keyLabel="whatsapp"
      data={addContact}
    />
  </div>
</div>
<div style={{ display: "flex", gap: "50px", margin: "15px 0" }}>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Aadhar"
      placeholder="aadhar"
      handleChange={handleChange}
      keyLabel="aadhar"
      data={addContact}
    />
  </div>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Pan"
      placeholder="pan"
      handleChange={handleChange}
      keyLabel="pan"
      data={addContact}
    />
  </div>
</div>
<div style={{ display: "flex", gap: "50px", margin: "15px 0" }}>
  <div style={{ width: "50%" }}>
    <DatepickerContainer
      title="DSC Registered Date"
      handleChange={handleChange}
      keyLabel="dsc_registered_data"
      data={addContact}
    />
  </div>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="DSC Renewal Date"
      placeholder="DSC Renewal Date"
      handleChange={handleChange}
      keyLabel="dsc_renewal_date"
      data={addContact}
    />
  </div>
</div>
<div style={{ display: "flex", gap: "50px", margin: "15px 0" }}>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="DIN"
      placeholder="din number"
      handleChange={handleChange}
      keyLabel="din"
      data={addContact}
    />
  </div>
  <div style={{ width: "50%" }}>
    <InputContainer
      title="Reference"
      placeholder="reference"
      handleChange={handleChange}
      keyLabel="reference"
      data={addContact}
    />
  </div>
</div>
<div style={{ display: "flex", justifyContent: "end" }}>
  <Button
    type="default"
    loading={confirmLoading}
    size="large"
    onClick={handleSumbit}
  >
    Submit
  </Button>
</div>
{id && (
  <div>
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
  </div>
)}
</> */
}
