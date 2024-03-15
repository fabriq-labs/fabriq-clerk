// CheckBox Component
import React from "react";
import { Table, Button } from "antd";
import QueryCard from "./query_card";

import { Label } from "@/components/ui/label";

// Main Component
export const Template = ({
  template,
  buttonLoading,
  saveChat,
  disabled,
}: any) => {
  return (
    <div className="chat-template-wrapper">
      <div className="template-content">
        <div className="template-container">
          <div className="chat-left-container">
            <Label className="query-label">Table</Label>
            <Table
              columns={template?.data?.columns}
              dataSource={template?.data?.rows}
              rowKey={(row) => row.key}
              bordered
              pagination={{
                total: template?.data?.rows?.length,
                pageSize: 10,
              }}
            />
          </div>
          <div className="chat-right-container">
            <div className="chat-query-container">
              {" "}
              <QueryCard result={template?.query} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="chat-save-conatiner"
        onClick={() => saveChat()}
        title="Save Result"
      >
        <Button
          type="primary"
          className={`okay-btn ${disabled ? "disabled" : ""}`}
          loading={buttonLoading}
          disabled={disabled}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
