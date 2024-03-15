"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Spin,
  Modal,
  Row,
  Col,
  Tooltip,
  notification,
  Switch,
  Button,
  Space,
} from "antd";
import {
  SettingOutlined,
  DeleteOutlined,
  LoadingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@components/layout";
import EditInput from "@components/edit_input";

function isObject(value: any) {
  return typeof value === "object" && value !== null;
}

const HeaderDetails = ({
  pipeline,
  setChecked,
  checked,
  statusLoader,
  onClickSync,
  handleChange,
  onClickConfigure,
  handleDelete,
  notificationAPI,
  organization,
  updatePipeline,
}: any) => {
  const source = pipeline?.source;
  const [loader, setLoader] = useState(false);
  const [syncFrequency, setSyncFrequency] = useState("");

  useEffect(() => {
    if (pipeline?.external_mapping?.elt_connection_id) {
      axios
        .post("/api/pipeline/update", {
          event: {
            session_variables: {
              "x-hasura-role": "admin",
            },
            op: "GET_CONNECTION",
            data: {
              new: {
                id: pipeline?.id,
              },
            },
          },
        })
        .then((res) => {
          const obj = res?.data;

          const cronMoment = moment(
            obj?.schedule?.cronExpression,
            "s m H D M d [UTC]"
          );

          const readableTime = cronMoment.format("h:mm A");

          const frequency = `${readableTime}`;
          setSyncFrequency(frequency);
          const checkedResult = obj?.status === "active" ? true : false;
          if (checkedResult) handleChange(checkedResult);
          setChecked(checkedResult);
        })
        .catch((err) => {
          console.log("err", err?.message);
        });
    }
  }, [pipeline?.id, pipeline?.external_mapping?.elt_connection_id]);

  const CreateAirbyteSource = () => {
    setLoader(true);
    axios
      .post(`/api/pipeline/update`, {
        event: {
          data: {
            new: {
              id: pipeline?.id,
            },
          },
          op: "INSERT",
        },
      })
      .then((res) => {
        if (res) {
          deployPipeline();
        }
      })
      .catch(() => {
        setLoader(false);

        notificationAPI.warning({
          message: "Pipeline View",
          description: "Connection deployment was not successfully",
        });
      });
  };

  async function deployPipeline(isConnectionUpdate = false) {
    try {
      const operation = "deployConnection";
      const variables = {
        org_id: organization?.publicMetadata?.fabriq_org_id,
      };

      const destinationResponse = await axios.post("/api/pipeline", {
        operation,
        variables,
      });
      const destination_id =
        destinationResponse?.data?.data?.organizations?.[0]?.external_mapping
          ?.elt_destination_ids?.[0]?.elt_destination_id;

      if (destination_id) {
        const deployResponse = await axios.post(
          `/api/elt-wrapper/connection/update`,
          {
            event: {
              data: {
                new: {
                  id: pipeline?.id,
                },
                elt_destination_id: destination_id,
              },
              op: "INSERT",
            },
          }
        );

        if (deployResponse?.data?.url && !isConnectionUpdate) {
          setLoader(false);
          updatePipeline();
          Modal.success({
            title: "Deployed Successfully",
            content: (
              <>
                Click{" "}
                <a
                  href={`${deployResponse?.data?.url}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#0000FF" }}
                >
                  here
                </a>{" "}
                go to pipeline
              </>
            ),
            okButtonProps: {
              className: "okay-btn",
            },
            okText: "Close",
          });
        } else if (deployResponse?.data?.status === "error") {
          setLoader(false);
        }
      }
    } catch (err) {
      setLoader(false);
    }
  }

  const handleSwitchChange = (val: any) => {
    handleChange(val);

    setTimeout(() => {
      deployPipeline(true);
    }, 3000);
  };

  const onDelete = () => {
    handleDelete(() => {
      if (
        pipeline?.external_mapping?.elt_connection_id &&
        pipeline?.external_mapping?.elt_source_id
      ) {
        handleSwitchChange(false);
      }
    });
  };

  return (
    <Card className="card-div-pipeline">
      <CardContent className="card-item-content">
        <div className="header-wrapper">
          <Row className="title-div" gutter={16}>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">DataSource</Label>
            </Col>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Sync Frequency</Label>
            </Col>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Started From</Label>
            </Col>
            <Col span={5} className="pipeline-header-title" />
          </Row>
        </div>

        <Row className="title-div value-section" gutter={16}>
          <Col span={5} className="info">
            <div className="type-div">
              <Image
                src={source?.image_url}
                alt="img"
                width={50}
                height={50}
                className="source-image"
              />
              <Label className="type-title">{source?.name}</Label>
            </div>
          </Col>
          <Col span={5} className="info">
            <div className="action-div">
              {" "}
              <div className="connection">
                Every day at {syncFrequency} &nbsp; - &nbsp;
              </div>
              <Tooltip title="Run now" placement="bottom">
                <div
                  className={`col-sync ${
                    pipeline?.external_mapping?.elt_connection_id && checked
                      ? ""
                      : "disabled"
                  }`}
                  onClick={onClickSync}
                >
                  {statusLoader ? (
                    <Row className="spin-div" justify="center">
                      <Col>
                        <Spin size="default" />
                      </Col>
                    </Row>
                  ) : (
                    <div>
                      <SyncOutlined />
                    </div>
                  )}
                </div>
              </Tooltip>
            </div>
          </Col>
          <Col span={5} className="info">
            <Label className="value-title">
              {moment(pipeline?.created_at).format("DD-MM-YYYY")}
            </Label>
          </Col>
          <Col span={5} className="info">
            <div className="switch-div">
              <Switch
                className={`switch ${checked ? "active" : ""}`}
                checked={checked}
                disabled={
                  pipeline?.external_mapping?.elt_connection_id === undefined
                }
                onChange={handleSwitchChange}
              />
              <div className="status-title">{checked ? "Active" : "Pause"}</div>
            </div>
          </Col>
          <Col span={4} className="info">
            <Space>
              <Tooltip title="Configure" placement="bottom">
                <Button icon={<SettingOutlined />} onClick={onClickConfigure} />
              </Tooltip>
              <Tooltip title="Delete" placement="bottom">
                <Button icon={<DeleteOutlined />} onClick={onDelete} />
              </Tooltip>
              <Tooltip title="Authenticate" placement="bottom">
                <Button
                  type="dashed"
                  loading={loader}
                  disabled={pipeline?.connection ? false : true}
                  onClick={CreateAirbyteSource}
                >
                  Deploy
                </Button>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
};

const SyncDetails = ({ pipeline }: any) => {
  const stream = pipeline?.source?.entities?.streams?.[0];
  return (
    <Card className="card-div-pipeline">
      <CardContent className="card-item-content">
        <div className="header-wrapper">
          <Row className="title-div" gutter={16}>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Data Stream name</Label>
            </Col>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Sync mode</Label>
            </Col>
          </Row>
        </div>
        <Row className="title-div value-section" gutter={16}>
          <Col span={5} className="info">
            <Label className="value-title">{stream?.config?.aliasName}</Label>
          </Col>
          <Col span={5} className="info">
            <Label className="value-title">{stream?.config?.syncMode}</Label>
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
};

export const PipelineView: React.FC<any> = React.memo(() => {
  const [pipeline, setPipelines] = useState({});
  const [pipelineLog, setPipelineLog] = useState([]);
  const [isShowSpinner, setShowSpinner] = useState(false);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pipelineName, setPipelineName] = useState("");
  const [checked, setChecked] = useState(false);
  const [statusLoader, setStatusLoader] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const { organization }: any = useOrganization();
  const router = useRouter();
  const params = useParams();

  const pipelineId: any = params?.pipelineId;

  useEffect(() => {
    if (organization) {
      fetchData();
    }
  }, [pipelineId]);

  const updatePipeline = async () => {
    const operation = "getPipelineId";
    const variables = {
      org_id: organization?.publicMetadata?.fabriq_org_id,
      id: pipelineId,
    };

    await axios
      .post("/api/pipeline", {
        operation,
        variables,
      })
      .then((result) => {
        const { data } = result;

        if (data?.data?.pipeline?.length > 0) {
          const pipeline = data.data.pipeline[0];
          setPipelines(pipeline);
          setChecked(pipeline.status);
          setPipelineName(pipeline.name);
        }
      })
      .catch(() => {
        api.error({
          message: "Pipeline View",
          description: "Unable to fetch the pipeline details.",
        });
      });
  };

  const fetchData = async () => {
    try {
      const operation = "getPipelineId";
      const variables = {
        org_id: organization?.publicMetadata?.fabriq_org_id,
        id: pipelineId,
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

      const pipeline = data?.pipeline[0];
      setPipelines(pipeline);
      setChecked(pipeline?.status);
      setPipelineName(pipeline?.name);
      if (pipeline?.external_mapping?.elt_connection_id) {
        const result = await axios.post("/api/pipeline/update", {
          event: {
            session_variables: {
              "x-hasura-role": "admin",
            },
            op: "GET_JOBS",
            data: {
              new: {
                id: pipeline?.id,
              },
            },
          },
        });

        setPipelineLog(result?.data?.data);
      } else {
        setPipelineLog([]);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const viewLog = async (key: any) => {
    setVisible(true);
    setShowSpinner(true);

    axios
      .post("/api/pipeline/update", {
        event: {
          session_variables: {
            "x-hasura-role": "admin",
          },
          op: "GET_JOB_INFO",
          data: {
            new: {
              id: pipelineId,
            },
            job_id: key,
          },
        },
      })
      .then((res) => {
        const result = res?.data?.attempt;
        if (result) {
          setShowSpinner(false);
          setItem(res?.data?.logs?.logLines);
        }
      })
      .catch((err) => {
        setShowSpinner(false);
      });
  };

  const getLogInfo = () => {
    return axios
      .post(`/api/pipeline/update`, {
        event: {
          session_variables: {
            "x-hasura-role": "admin",
          },
          op: "GET_JOBS",
          data: {
            new: {
              id: pipelineId,
            },
          },
        },
      })
      .then((res) => {
        if (res?.data?.data?.length > 0) {
          setPipelineLog(res?.data?.data);
        }
      })
      .catch((err: any) => console.log("err", err.message));
  };

  const handleChange = async (isEnable: any) => {
    setChecked(isEnable);

    const operation = "updatePipelineStatus";
    const variables = {
      org_id: organization?.publicMetadata?.fabriq_org_id,
      id: pipelineId,
      status: isEnable,
    };
    await axios.post("/api/pipeline", {
      operation,
      variables,
    });
  };

  function timeRange(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fetchDataFromJob = (dataJobId: any): Promise<any | undefined> => {
    return axios
      .post(`/api/pipeline/update`, {
        event: {
          session_variables: {
            "x-hasura-role": "admin",
          },
          op: "GET_JOB_INFO",
          data: {
            new: {
              id: pipelineId,
            },
            job_id: dataJobId?.jobId,
          },
        },
      })
      .then((res: any) => {
        const { data } = res;
        if (
          data?.attempt?.status !== "succeeded" &&
          data?.attempt?.status !== "failed"
        ) {
          return timeRange(3000).then(() => fetchDataFromJob(dataJobId));
        } else if (data?.attempt?.status === "succeeded") {
          return timeRange(3000).then(() => {
            setStatusLoader(false);
            getLogInfo();
            return data;
          });
        } else {
          setStatusLoader(false);
          getLogInfo();
          return undefined;
        }
      });
  };

  const onClickSync = () => {
    axios
      .post(`/api/pipeline/update`, {
        event: {
          session_variables: {
            "x-hasura-role": "admin",
          },
          op: "SYNC",
          data: {
            new: {
              id: pipelineId,
            },
          },
        },
      })
      .then((res) => {
        const { data } = res;
        if (data) {
          setStatusLoader(true);
          api.success({
            message: "Pipeline View",
            description: "Sync started successfully.",
          });
          return fetchDataFromJob(data);
        }
      })
      .catch(() => {
        setStatusLoader(false);

        api.error({
          message: "Pipeline View",
          description: "Unable to trigger sync.",
        });
      });
  };

  const updateName = async (name: any) => {
    setPipelineName(name);
    const operation = "updatePipelineName";
    const variables = {
      org_id: organization?.publicMetadata?.fabriq_org_id,
      id: pipelineId,
      name: name,
    };

    await axios.post("/api/pipeline", {
      operation,
      variables,
    });
  };

  const goBackConnect = () => {
    router.push("/pipeline");
  };

  const onClickConfigure = () => {
    router.push(`/pipeline/${pipelineId}/edit`);
  };

  const handleDelete = (callback: any) => {
    const doDelete = async () => {
      const operation = "deletePipeline";
      const variables = {
        org_id: organization?.publicMetadata?.fabriq_org_id,
        id: pipelineId,
      };

      await axios
        .post("/api/pipeline", {
          operation,
          variables,
        })
        .then(() => {
          if (callback) callback();
          router.push("/pipeline");
        });
    };

    Modal.confirm({
      title: "Delete Pipeline",
      content: "Are you sure you want to delete this pipeline?",
      okText: "Delete",
      okType: "danger",
      onOk: doDelete,
      maskClosable: true,
      autoFocusButton: null,
    });
  };

  const handleStatusTag = (record: any) => {
    let color = "";
    if (record === "succeeded") {
      color = "green";
    } else if (record === "error") {
      color = "volcano";
    } else if (record === "started") {
      color = "geekblue";
    }

    return <Tag color={color}>{record}</Tag>;
  };

  const columns = [
    {
      title: "Activity",
      dataIndex: "activity_name",
      key: "activity_name",
    },
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "No of rows processed",
      dataIndex: "target_count",
      key: "target_count",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_text: any, record: any) => handleStatusTag(record.status),
    },
    {
      title: "Logs",
      dataIndex: "action",
      render: (_text: any, record: any) => (
        <div className="link-row">
          <div className="link-div" onClick={() => viewLog(record.key)}>
            View
          </div>
        </div>
      ),
    },
  ];

  const rows = pipelineLog?.map((row: any) => ({
    key: row?.jobId,
    activity_name: "sync",
    created_at: moment(row?.startTime).format("DD MMM YYYY hh:mm a"),
    status: row?.status,
    target_count: row?.rowsSynced,
  }));

  return (
    <Layout>
      <div className="pipeline-view-container">
        {loading ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="view-main-container">
            <div className="main-view-div">
              <EditInput
                onDone={updateName}
                ignoreBlanks
                isEditable
                value={pipelineName}
                onRedirectBack={goBackConnect}
              />
              <HeaderDetails
                pipeline={pipeline}
                setChecked={setChecked}
                checked={checked}
                onClickSync={onClickSync}
                handleChange={handleChange}
                statusLoader={statusLoader}
                handleDelete={handleDelete}
                notificationAPI={api}
                onClickConfigure={onClickConfigure}
                organization={organization}
                updatePipeline={updatePipeline}
              />
            </div>
            <div className="middle-view-div">
              <SyncDetails pipeline={pipeline} />
            </div>
            <div className="footer-div">
              <Label>Activity Log</Label>
              <div className="table-section">
                <Table
                  columns={columns}
                  bordered
                  dataSource={rows}
                  rowKey={(row: any) => row.key}
                />
              </div>
            </div>
          </div>
        )}
        {contextHolder}
        <Modal
          title={`LogInfo Details`}
          visible={visible}
          onCancel={onCancel}
          footer={null}
          width={"100%"}
          style={{ padding: "40px" }}
        >
          {isShowSpinner ? (
            <>
              <div className="center-log-div">
                <Label className="center-title">
                  Preparing log information
                </Label>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 38 }} spin />}
                />
              </div>
            </>
          ) : item && item.length > 0 ? (
            item.map(
              (log, index) =>
                !isObject(log) && <div key={`${index + 1}`}>{log}</div>
            )
          ) : (
            "No Data"
          )}
        </Modal>
      </div>
    </Layout>
  );
});
