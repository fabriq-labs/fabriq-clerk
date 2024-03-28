"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import React, { useState, useEffect } from "react";
import { Row, Col, Tabs, Select } from "antd";
import Image from "next/image";

import RightSection from "@/components/agent-solution/right_section";
import CalComponent from "@/components/agent-solution/cal_component";
import { callerDetails } from "./helper";
import { Label } from "@/components/ui/label";

export default function AgentSolution() {
  const [callLink, setCallLink] = useState("");
  const [isTrue, setTrue] = useState(false);
  const [embededurl, setEmbededurl] = useState("");

  const handleChange = (value: string, option: any) => {
    setCallLink(option?.callLink);
    setEmbededurl(option?.embededurl);
    setTrue(true);
  };

  useEffect(() => {
    if (callLink) {
      (async function () {
        const cal = await getCalApi();
        cal("ui", {
          theme: "dark",
          styles: { branding: { brandColor: "#000000" } },
          hideEventTypeDetails: false,
          layout: "week_view",
        });
      })();
    }
  }, [callLink]);

  return (
    <div className="agent-solution">
      <Row>
        <Col span={6} className="section-1"></Col>
        <Col span={13} className="section-2">
          <Select
            style={{ width: "90%", margin: 20 }}
            onChange={handleChange}
            options={callerDetails}
          />
        </Col>
        <Col span={5} className="section-3">
          <div>
            <div className="row-div">
              <div className="box-div">
                <Image
                  alt=""
                  src={"/images/calendar.png"}
                  width={64}
                  height={64}
                />
              </div>
              <div className="box-div">
                <Image
                  alt=""
                  src={"/images/electric-car.png"}
                  width={64}
                  height={64}
                />
              </div>
              <div className="box-div">
                <Image
                  alt=""
                  src={"/images/traffic-jam.png"}
                  width={64}
                  height={64}
                />
              </div>
            </div>
            <div className="row-div">
              <div className="box-div"></div>
              <div className="box-div"></div>
              <div className="box-div"></div>
            </div>
          </div>
          <Row>
            <Col span={5}>
              <Image
                src={"/images/avatars/image-1-removebg.png"}
                width={100}
                height={100}
                alt="logo"
              />
            </Col>
            <Col span={19}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={24}>
                  <Row>
                    <Col span={6}>
                      <div className="label-txt">Contact:</div>
                    </Col>
                    <Col span={18}>
                      <div className="value-txt">Manty Hunter</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col span={6}>
                      <div className="label-txt">Email:</div>
                    </Col>
                    <Col span={18}>
                      <div className="value-txt">
                        mhunter@toyota-mantagamery.com
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col span={6}>
                      <div className="label-txt">Phone:</div>
                    </Col>
                    <Col span={18}>
                      <div className="value-txt">(327) 272-7147</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Row gutter={[16, 16]} align="middle">
              <Col span={24}>
                <Row>
                  <Col span={6}>
                    <div className="label-txt">Dealership:</div>
                  </Col>
                  <Col span={18}>
                    <div className="value-txt">Toyota of montgamery</div>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>
                    <div className="label-txt">Email:</div>
                  </Col>
                  <Col span={18}>
                    <div className="value-txt">
                      Dealership Toyota of montgamery 911 eastern Blvd,
                      Montgamery, AL 36117
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={6}>
                    <div className="label-txt">Phone:</div>
                  </Col>
                  <Col span={18}>
                    <div className="value-txt">(327) 272-7147</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>

          {callLink && <CalComponent callLink={callLink} />}
        </Col>
      </Row>
    </div>
  );
}
