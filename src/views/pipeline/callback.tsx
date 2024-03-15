// Pipeline Connect Component
import React, { useEffect, useState } from "react";
import { Result, notification } from "antd";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useOrganization } from "@clerk/nextjs";

const PipelineConnect = () => {
  const router = useRouter();
  const params = useParams()
  const [state, setState] = useState<string>("");
  const [api, contextHolder] = notification.useNotification();
  const { organization }: any = useOrganization();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const operation = "insertConnection";
        const variables = {
          display_name: `OAuth`,
          credentials: router.query,
          source_id: router?.query?.sourceId,
          org_id: organization?.publicMetadata?.fabriq_org_id,
        };
        const result = await axios.post("/api/pipeline", {
          operation,
          variables,
        });
        const { data } = result;
        if (data?.data?.insert_connection?.returning?.[0]) {
          const connectionItem = data.data.insert_connection.returning[0];

          await axios.post("/api/pipeline", {
            operation: "connectionPipelineUpdate",
            variables: {
              id: router?.query.pipelineId,
              connection_id: connectionItem.id,
              org_id: organization?.publicMetadata?.fabriq_org_id,
            },
          });
        }
        setState("success");
        setLoading(false);
        setTimeout(() => {
          window.close();
        }, 3000);
      } catch (error) {
        setLoading(false);
        api.error({
          message: "Pipeline OAuth",
          description: `Unable to initiate OAuth for pipeline with item ID ${router?.query.pipelineId}.`,
        });
      }
    }
    if (organization) {
      fetchData();
    }
  }, [router?.query?.sourceId, router?.query.pipelineId, organization]);

  if (loading) {
    return (
      <div className="loader-cotainer">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="oauth-content">
      <Result
        icon={
          state === "success" ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )
        }
        title={
          state === "success"
            ? "Connected successfully"
            : "Something went wrong!!"
        }
      />
      {contextHolder}
    </div>
  );
};

export default PipelineConnect;
