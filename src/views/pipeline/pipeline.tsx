"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { Row, Col, Button } from "antd";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@components/layout";

import StartIcon from "../../assets/start_icon.png";
import StopIcon from "../../assets/stop_icon.png";

export interface PipelineInfoProps {
  pipeline?: any;
}

export const PipelineInfo: React.FC<PipelineInfoProps> = ({ pipeline }) => {
  const { source, entities_count } = pipeline;
  const router = useRouter();
  const testDateUtc = moment.utc(pipeline?.last_ran_at);
  const localDate = moment(testDateUtc).local();
  const syncInfo = `${moment(localDate).fromNow()}`;

  /* Handler Function */
  const onClickPipeline = () => {
    router.push(`/pipeline/${pipeline?.id}`);
  };

  return (
    <Card onClick={onClickPipeline} className="card-div-pipeline">
      <CardContent className="card-item-content">
        <div className="header-wrapper">
          <Row className="title-div" gutter={[24, 32]}>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Type</Label>
            </Col>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Name</Label>
            </Col>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Entities</Label>
            </Col>
            <Col span={5} className="pipeline-header-title">
              <Label className="pipeline-header-title">Status</Label>
            </Col>
            <Col span={4} className="pipeline-header-title">
              <Label className="pipeline-header-title">Last Run</Label>
            </Col>
          </Row>
        </div>

        <Row className="title-div value-section" gutter={[24, 32]}>
          <Col span={5} className="info">
            <div className="type-div">
              <Image
                src={source.image_url}
                alt="img"
                width={35}
                height={35}
                className="source-image"
              />
              <div className="type-title">{source.name}</div>
            </div>
          </Col>
          <Col span={5} className="info">
            <Label className="value-title">{pipeline.name}</Label>
          </Col>
          <Col span={5} className="info">
            <Label className="value-title">
              {entities_count ? entities_count : 0}
            </Label>
          </Col>
          <Col span={5} className="info">
            <div className="image-content">
              <div className="title-div">
                <Image
                  src={pipeline.status ? StartIcon : StopIcon}
                  alt="stop"
                  width={22}
                  height={22}
                />
                &nbsp;&nbsp;
                <Label className="value-title">
                  {pipeline.status ? "Active" : "Pause"}
                </Label>
              </div>
            </div>
          </Col>
          <Col span={4} className="info">
            <div className="message">{syncInfo}</div>
          </Col>
        </Row>
      </CardContent>
    </Card>
  );
};

export default function Pipeline() {
  const [loading, setLoading] = useState(true);
  const [pipelines, setPipelines]: any = useState([]);
  const { organization }: any = useOrganization();

  const router = useRouter();

  useEffect(() => {
    if (organization) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const operation = "getList";
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

      setPipelines(data?.pipeline);
      setLoading(false);
    } catch (error) {
      console.error("API request failed:", error);
      setLoading(false);
    }
  };

  const onClick = () => {
    router.push("/pipeline/create");
  };

  return (
    <Layout>
      <div className="pipeline-container">
        <div className="flex">
          <Label className="lable-title">Connection</Label>
          <div className="button-row">
            <Button type="dashed" onClick={onClick}>
              Create
            </Button>
          </div>
        </div>

        <div className="pipeline-list-section">
          {loading ? (
            <div className="loader-cotainer">
              <div className="loader"></div>
            </div>
          ) : (
            pipelines?.map((pipeline: any) => (
              <PipelineInfo pipeline={pipeline} key={`${pipeline?.id}`} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
