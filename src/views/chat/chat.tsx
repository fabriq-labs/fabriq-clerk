"use client"

import React, { useEffect, useState } from "react";
import { Button, Col, Result, Row, notification, Tooltip } from "antd";
import axios from "axios";
import { useOrganization } from "@clerk/nextjs";
import { MessageTwoTone } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { Alert } from "antd";

import { generateTableData } from "../../utils/helper";
import { Template } from "@components/chat/template";
import { Label } from "@/components/ui/label";
import ChatAI from "@components/chatai";
import Layout from "@components/layout";

export default function Chat() {
  const [destinations, setDestinations]: any = useState([]);
  const [chat_models, setChatModels]: any = useState([]);
  const [userInput, setUserInput] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [chatResultList, setChatResultList] = useState([]);
  const [status, setStatus] = useState("");

  const [api, contextHolder] = notification.useNotification();
  const { organization }: any = useOrganization();
  const params = useParams()
  const router = useRouter();
  const chatId: any = params?.chatId;

  useEffect(() => {
    if (organization) {
      getChartTypes();
      getDestination();
      getChatSidebarList();
      getChatResults();
    }
  }, [chatId]);

  const getChatSidebarList = async () => {
    try {
      const operation = "getChatResult";
      const variables = {
        org_id: organization?.publicMetadata?.fabriq_org_id,
      };
      const {
        data: { data, errors },
      } = await axios.post("/api/explore", {
        operation,
        variables,
      });
      if (errors) {
        throw errors;
      }

      setChatResultList(data?.chat_results);
    } catch (error) {
      console.error("API request failed:", error);
      setLoading(false);
    }
  };

  const getChartTypes = async () => {
    try {
      const operation = "getChatType";
      const {
        data: { data, errors },
      } = await axios.post("/api/explore", {
        operation,
      });
      if (errors) {
        throw errors;
      }

      setChatModels(data?.org_chat_models_mapping);
    } catch (error) {
      console.error("API request failed:", error);
      setLoading(false);
    }
  };

  const getDestination = async () => {
    const variables = {
      org_id: organization?.publicMetadata?.fabriq_org_id,
    };
    try {
      const operation = "getDatasource";
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
      console.error("API request failed:", error);
      setLoading(false);
    }
  };

  const getChatResults = () => {
    if (chatId) {
      setStatus("Loading");
      let variables = {
        org_id: organization?.publicMetadata?.fabriq_org_id,
        id: chatId,
      };
      const operation = "getChatResultById";
      setLoading(true);
      axios
        .post("/api/explore", {
          operation,
          variables,
        })
        .then((res: any) => {
          if (res) {
            let dataItem = res?.data?.data?.chat_results?.[0];

            if (dataItem) {
              setTemplate((prevState: any) => ({
                ...prevState,
                widget_type: "table",
                data: dataItem.data,
                query: dataItem.query,
                question: dataItem.question,
                name: dataItem.name,
              }));
              setUserInput(dataItem?.question);
              setLoading(false);
              setStatus("");
              setDisabled(false);
            }
            setLoading(false);
            setStatus("");
          }
        })
        .catch((err: any) => {
          api.error({
            message: err?.message,
            placement: "bottomRight",
          });
        });
    }
  };

  const handleClickNewChat = () => {
    router.push(`/chat`);

    getChartTypes();
    getDestination();
    setTemplate(null);
    setUserInput("");
  };

  const handleClickChat = (id: any) => {
    setDisabled(true);
    setTemplate((prevState: any) => ({
      ...prevState,
      error: false,
    }));
    router.push(`/chat/${id}`);
  };

  const onChange = (val: any) => {
    setUserInput(val);
  };

  const onClickClear = () => {
    setUserInput("");
  };

  const handleSubmit = async () => {
    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);

    const params = {
      query: userInput,
      data_source_id: destinations?.[0]?.id,
      id: chat_models?.[chat_models.length - 1]?.id,
      is_sql: true,
    };

    setStatus("Thinking");
    axios
      .post("/api/chat_message", {
        params,
      })
      .then(async (res: any) => {
        setTemplate((prevState: any) => ({
          ...prevState,
          widget_type: "table",
          query: res?.data?.result,
          name: userInput,
          question: userInput,
          error: res?.data?.error ? true : false,
        }));

        await getQueryResult(res?.data?.result);
      })
      .catch(() => {
        setLoading(false);
        setTemplate((prevState: any) => ({
          ...prevState,
          error: true,
        }));
      });
  };

  function timeRange(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchDataFromJob = async (jobData: any): Promise<any> => {
    let message = "";

    if (jobData.job.status === 2) {
      message = "Executing query";
    } else if (jobData.job.status === 4 || jobData.job.error.code === 1) {
      message = "Error running query";
    } else if (jobData.job.status === 1) {
      message = "Query in queue";
    } else if (jobData.job.status === 3) {
      message = "Loading results";
    }

    setStatus(message);
    try {
      const response = await axios.get(`/api/get_jobs/${jobData?.job.id}`);
      const { data } = response;

      if (data.job.status < 3) {
        await timeRange(3000);
        return fetchDataFromJob(data);
      } else if (data.job.status === 3) {
        return data.job.result;
      } else if (data.job.status === 4 && data.job.error.code === 1) {
        return [];
      } else {
        throw new Error(data.job.error);
      }
    } catch (error: any) {
      setTemplate((prevState: any) => ({
        ...prevState,
        error: true,
      }));
      setLoading(false);
    }
  };

  const getQueryResult = async (query: any): Promise<any> => {
    try {
      const params = {
        data_source_id: destinations?.[0]?.id,
        parameters: {},
        query: query,
        max_age: 0,
      };

      const response = await axios.post("/api/query_result", { params });
      const { data } = response;

      if ("job" in data) {
        const result = await fetchDataFromJob(data);
        await getQueryResultData(result);
      } else {
        return data.result || Promise.reject(new Error("No result found"));
      }
    } catch (error: any) {
      setLoading(false);
      setTemplate((prevState: any) => ({
        ...prevState,
        error: true,
      }));
    }
  };

  const getQueryResultData = (queryId: any) => {
    if (queryId) {
      axios
        .get(`/api/query_result/${queryId}`)
        .then((res: any) => {
          const { data } = res.data.query_result;
          if (data) {
            setTemplate((prevState: any) => ({
              ...prevState,
              data: generateTableData(data),
            }));
            setStatus("");
            setDisabled(false);
            setLoading(false);
          }
        })
        .catch((err: any) => {
          setLoading(false);
          api.error({
            message: err?.message,
            placement: "topRight",
          });
        });
    }
  };

  const saveChat = async () => {
    let variables = {
      chat_model_id: chat_models?.[chat_models.length - 1]?.id,
      data_source_id: destinations?.[0]?.id,
      org_id: organization?.publicMetadata?.fabriq_org_id,
      question: template?.question,
      query: template?.query,
      data: template?.data,
      name: template?.name,
    };

    let updateVariables = {
      org_id: organization?.publicMetadata?.fabriq_org_id,
      question: template?.question,
      query: template?.query,
      data: template?.data,
      name: template?.name,
      id: parseInt(chatId),
    };

    if (chatId) {
      setButtonLoading(true);
      try {
        setButtonLoading(true);
        const operation = "updateResult";
        const {
          data: { data, errors },
        } = await axios.post("/api/explore", {
          operation,
          variables: updateVariables,
        });

        if (errors) {
          throw errors;
        }

        if (data) {
          setButtonLoading(false);
          getChatSidebarList();
          api.success({
            message: "Chat Updated Successfully",
            placement: "bottomRight",
          });
        }
      } catch (err: any) {
        setButtonLoading(false);
        api.error({
          message:
            err?.message ||
            "An error occurred while updating the chat. Please try again.",
          placement: "bottomRight",
        });
      }
    } else {
      try {
        setButtonLoading(true);
        const operation = "insertChatResult";
        const {
          data: { data, errors },
        } = await axios.post("/api/explore", {
          operation,
          variables,
        });

        if (errors) {
          throw errors;
        }

        if (data) {
          setButtonLoading(false);
          const chatId = data?.insert_chat_results?.returning?.[0]?.id;

          api.success({
            message: "Chat Saved Successfully",
            placement: "bottomRight",
          });

          if (chatId) {
            getChatSidebarList();
            router.push(`/chat/${chatId}`);
          }
        }
      } catch (err: any) {
        setButtonLoading(false);
        api.error({
          message: "An error occurred while saving the chat. Please try again.",
          placement: "bottomRight",
        });
      }
    }
  };

  const handleClickPrompt = (val: any) => {
    setShowPrompt(true);
    setUserInput(val);
  };

  let exapmlePromptMessge = [
    "Today top post articles with page views & users",
    "Top Authors List Today with page views & users",
    "Top Authors List Today with page views & users",
  ];

  return (
    <Layout>
      <div className="chat-container">
        <Row gutter={24}>
          <Col span={4}>
            <div className="chat-sidebar">
              <div className="search-info">
                <Button
                  onClick={handleClickNewChat}
                  style={{ marginRight: "10px" }}
                  block
                >
                  + &nbsp;<span className="new-chat-title">New Chat</span>
                </Button>
              </div>
              <div className="body-content">
                <div>
                  {chatResultList?.map((item: any) => {
                    return (
                      <div
                        className={`list-container ${
                          item?.id === parseInt(chatId) ? "active" : ""
                        }`}
                        key={item.id}
                        onClick={() => handleClickChat(item?.id)}
                      >
                        <div className="list-icon">
                          <MessageTwoTone style={{ fontSize: 14 }} />
                        </div>
                        <Tooltip placement="top" title={item?.question}>
                          <Label className="list-title">
                            {" "}
                            {item?.question}
                          </Label>
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>
          <Col span={20}>
            <div className="result-view">
              <div className="chat-row">
                <ChatAI
                  handleSubmit={handleSubmit}
                  loading={loading}
                  onChange={onChange}
                  userInput={userInput}
                  onClickClear={onClickClear}
                />
                {loading ? (
                  <div className="status-container">
                    <Alert message={<>{status}&hellip;</>} type="info" />
                  </div>
                ) : template === null ? (
                  <div className="example-promt">
                    {!showPrompt && (
                      <>
                        <div className="prompt-title">Examples</div>
                        {exapmlePromptMessge?.map((message) => (
                          <Row gutter={24}>
                            <div onClick={() => handleClickPrompt(message)}>
                              <div className="promt-container">{message}</div>
                            </div>
                          </Row>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    {template?.error ? (
                      <div className="no-result">
                        <div className="chat-empty-result">
                          <Result
                            title="Unable to Generate Data"
                            subTitle="We're sorry, but there seems to be an issue preventing us from generating the requested data at the moment."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="widget-row">
                        <div className="chat-template-container">
                          <Template
                            template={template}
                            saveChat={saveChat}
                            disabled={disabled}
                            buttonLoading={buttonLoading}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {contextHolder}
    </Layout>
  );
}
