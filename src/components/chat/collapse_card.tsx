"use client";

import { CaretRightOutlined } from "@ant-design/icons";
import type { CSSProperties } from "react";
import React from "react";
import type { CollapseProps } from "antd";
import { Collapse, theme } from "antd";

import QueryCard from "./query_card";

const getItems: (
  panelStyle: CSSProperties,
  children: any
) => CollapseProps["items"] = (panelStyle, children) => [
  {
    key: "1",
    label: "Show Query",
    children: <p>{children}</p>,
    style: panelStyle,
  },
];

const CollapseCard = ({ result }: any) => {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    background: "transparent",
    borderRadius: token.borderRadiusLG,
    border: "none",
    fontWeight: 600
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={[""]}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle, <QueryCard result={result} isAction />)}
    />
  );
};

export default CollapseCard;
