"use client";
// Connect Right View Component
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { notification } from "antd";
import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";

import Layout from "@components/layout";
import { Label } from "@/components/ui/label";
import { LinkedInPage, OauthService } from "@components/pipeline/index";

// Main Component
export const PipelineEdit: React.FC<any> = React.memo(() => {
  const [loading, setLoading] = useState(true);
  const [pipelineItem, setpipeline]: any = useState({});
  const [api, contextHolder] = notification.useNotification();
  const [sourceLoader, setSourceLoader] = useState(false);
  const { organization }: any = useOrganization();
  const router = useRouter();
  const { pipelineId } = useParams();

  const getPipeline = async () => {
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
          setpipeline(pipeline);
          setLoading(false);
        }
      })
      .catch(() => {
        api.error({
          message: "Pipeline Edit ",
          description: "Unable to fetch the pipeline details.",
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (organization && pipelineId) {
      getPipeline();
    }
  }, [pipelineId]);

  const onClickMenuItem = (obj: any, isConfig = false) => {
    if (isConfig || pipelineItem?.source?.id === 45) {
      router.push(`/pipeline/${pipelineId}`);
    } else {
      // todo: Oauth flow
      onClickReconnect();
    }
  };

  const onClickReconnect = () => {
    const redirect_url = `https://${window.location.host}/`;
    console.log(redirect_url);

    axios
      .post(`/api/pipeline/update`, {
        event: {
          session_variables: {
            "x-hasura-role": "admin",
          },
          op: "OAUTH",
          data: {
            new: {
              id: pipelineId,
            },
            redirect_url: `${redirect_url}pipeline/${pipelineId}/${pipelineItem?.source?.id}/connect/callback`,
            type: pipelineItem?.source?.type,
            name: pipelineItem?.source?.type,
          },
        },
      })
      .then((res: any) => {
        const { consentUrl } = res?.data;

        const popup = window.open(
          consentUrl,
          "windowname1",
          "width=800, height=600"
        );

        const timer = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(timer);
            getPipeline();
          }
        }, 1000);
      })
      .catch((err: any) => {
        console.log("err", err.message);
        api.error({
          message: "Pipeline Edit ",
          description: `Unable to initiate OAuth for pipeline with item ID ${pipelineItem.id}.`,
        });
      });
  };

  const validItemIds = [36, 37, 40, 42, 44];

  return (
    <Layout>
      <div className="pipeline-edit-container">
        {loading ? (
          <div className="loader-cotainer">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="edit-components">
            <div className="flex gap-box">
              <Image
                src={pipelineItem?.source?.image_url}
                alt="img"
                width={50}
                height={50}
                className="source-image"
              />
              <Label className="type-title">{pipelineItem?.name}</Label>
            </div>
            {pipelineItem &&
              validItemIds.includes(pipelineItem?.source?.id) && (
                <OauthService>
                  <OauthService.Connect
                    item={pipelineItem?.source}
                    pipeline={pipelineItem}
                    onClickReconnect={onClickReconnect}
                    onMenuItem={onClickMenuItem}
                    loader={sourceLoader}
                  />
                </OauthService>
              )}
            {pipelineItem?.source?.id === 45 && (
              <LinkedInPage>
                <LinkedInPage.Connect
                  item={pipelineItem?.source}
                  pipeline={pipelineItem}
                  organization={organization}
                  onMenuItem={onClickMenuItem}
                  loader={sourceLoader}
                  setSourceLoader={setSourceLoader}
                />
              </LinkedInPage>
            )}
          </div>
        )}
      </div>
      {contextHolder}
    </Layout>
  );
});
