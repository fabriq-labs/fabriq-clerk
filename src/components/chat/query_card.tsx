// Query Card
"use client";

import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-github";

import { Label } from "@/components/ui/label";

const QueryCard = ({ result }: any) => {
  return (
    <div className="chat-query-card-wrapper">
      <div className="query-title">
        <Label className="query-label">Query</Label>
      </div>
      <div className="query-result">
        <AceEditor
          mode="sql"
          theme="github"
          value={result}
          readOnly
          wrapEnabled
          style={{ width: "100%", height: "200px" }}
        />
      </div>
    </div>
  );
};

export default QueryCard;
