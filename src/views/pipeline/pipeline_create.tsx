"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { trim } from "lodash";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { Input } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import Layout from "@components/layout";
import CreatePipeline from "@/components/create_pipeline";

const SourceList = ({
  refSource,
  searchTerm,
  onClickMenuItem,
  destinations,
  getDestinations,
}: any) => {
  const [searchResults, setSearchResults] = React.useState(refSource);

  useEffect(() => {
    if (refSource?.length > 0) {
      const results = refSource.filter((source: any) =>
        source.name.toLowerCase().includes(searchTerm)
      );

      setSearchResults(results);

      if (getDestinations) getDestinations();
    }
  }, [searchTerm]);

  const salesConnectList: any = [];
  const customerServiceList: any = [];
  const fileList: any = [];
  const ecommerceList: any = [];
  const databaseList: any = [];
  const subscriptionList: any = [];
  const chatList: any = [];
  const projectManagement: any = [];
  const spreadSheet: any = [];
  const cloudBusinessManagement: any = [];

  const groupLists: any = {
    "Sales & Marketing": salesConnectList,
    "Customer service": customerServiceList,
    "File Storage": fileList,
    Ecommerce: ecommerceList,
    Database: databaseList,
    Payment: subscriptionList,
    Chat: chatList,
    "Project Management": projectManagement,
    Spreadsheet: spreadSheet,
    "Cloud Business Management": cloudBusinessManagement,
  };

  if (searchResults?.length > 0) {
    searchResults.forEach((source: any) => {
      const group = source.group;
      if (groupLists[group]) {
        groupLists[group].push(source);
      }
    });
  }

  const onClickMenuItemFn = (menu: any) => {
    if (onClickMenuItem) onClickMenuItem(menu);
  };

  const disabled = destinations.length === 0 ? true : false;

  const renderPipelineLists = () => {
    return Object.entries(groupLists).map(([group, list]) => (
      <PipelineList
        key={group}
        title={group}
        list={list}
        disabled={disabled}
        onClickMenuItem={onClickMenuItemFn}
      />
    ));
  };

  return <div className="content-wrapper">{renderPipelineLists()}</div>;
};

const PipelineList = ({ list, onClickMenuItem, title, disabled }: any): any => {
  const handleCardClick = (menu: any) => {
    if (!disabled) {
      onClickMenuItem(menu);
    }
  };

  return (
    list.length !== 0 && (
      <>
        <div className="title"> {title} </div>
        <div className="card-list">
          {list.map((menu: any) => (
            <div
              key={menu.id}
              className={`card ${disabled ? "disabled" : ""}`}
              onClick={() => handleCardClick(menu)}
            >
              <Image src={menu.image_url} alt="img" width={50} height={50} />
              <div className="source-content">
                <h1 className="details-title">{menu.name}</h1>
                <p className="details-info">{menu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  );
};

export const PipelineCreate: React.FC<any> = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sources, setSources]: any = useState([]);
  const [isShowModal, setModalShow] = useState(false);
  const [name, setName] = useState("");
  const [menu, setMenu]: any = useState({});
  const [isValid, setIsValid] = useState(false);
  const { organization }: any = useOrganization();

  const router = useRouter();
  const [destinations, setDestinations] = React.useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const operation = "getSources";

      const {
        data: { data, errors },
      } = await axios.post("/api/pipeline", {
        operation,
      });

      if (errors) {
        throw errors;
      }
      setSources(data?.ref_source);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDestinations = async () => {
    try {
      const operation = "getDatasource";
      const variables = {
        org_id: organization?.publicMetadata?.fabriq_org_id,
      };

      const {
        data: { data, errors },
      } = await axios.post("/api/pipeline", {
        operation,
        variables,
      });

      if (errors) {
        throw errors;
      }
      setDestinations(data?.data_sources);
    } catch (error) {
      setDestinations([]);
    }
  };

  const savePipeline = async () => {
    const destination: any = destinations?.[0];
    const entitiesCount = menu.id === 31 ? 1 : 1;
    try {
      const operation = "insertPipeline";
      const variables = {
        name,
        description: menu.description,
        source_id: menu.id,
        entities: menu.entities,
        org_id: organization?.publicMetadata?.fabriq_org_id,
        destination_id: destination?.id,
        entities_count: entitiesCount,
      };

      const {
        data: { data, errors },
      } = await axios.post("/api/pipeline", {
        operation,
        variables,
      });

      if (errors) {
        throw errors;
      }

      const insertedPipeline = data?.insert_pipeline?.returning?.[0];

      if (insertedPipeline) {
        setModalShow(false);

        router.push(`/pipeline/${insertedPipeline.id}/edit`);
      }
    } catch (e: any) {
      console.log("e", e?.message);
    }
  };

  const handleClickBack = () => {
    router.push("/pipeline");
  };

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleNameChange = (event: any) => {
    const value = trim(event.target.value);
    setName(value);
    setIsValid(value !== "");
  };

  const onClickMenuItem = (menu: any) => {
    setModalShow(true);
    setMenu(menu);
  };

  const close = () => {
    setModalShow(false);
  };

  return (
    <Layout>
      <div className="pipeline-create-container">
        <ArrowLeftOutlined
          style={{ cursor: "pointer" }}
          onClick={handleClickBack}
        />
        {loading ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="input-row">
              <Input.Search
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className="main-content">
              <SourceList
                refSource={sources}
                searchTerm={searchTerm}
                onClickMenuItem={onClickMenuItem}
                destinations={destinations}
                getDestinations={getDestinations}
              />
            </div>
          </>
        )}

        <CreatePipeline
          visible={isShowModal}
          handleNameChange={handleNameChange}
          name={name}
          isValid={isValid}
          close={close}
          savePipeline={savePipeline}
        />
      </div>
    </Layout>
  );
});
