// Table Card
"use client";

import React from "react";
import { Table } from "antd";

import { Label } from "@/components/ui/label";

const TableCard = ({ tableData }: any) => {
  return (
    <div className="table-div">
      <div className="action-table-content">
        <Label className="query-label-action">Data</Label>
        <div className="action-table">
          <Table
            columns={tableData?.columns}
            dataSource={tableData?.rows}
            bordered
            pagination={{
              total: tableData?.rows?.length,
              pageSize: 10,
            }}
            scroll={{ x: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TableCard;
