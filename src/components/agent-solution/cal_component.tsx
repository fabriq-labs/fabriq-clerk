import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState, useCallback } from "react";

export default function CalComponent({ callLink }: any) {
  return (
    <Cal
      calLink={callLink}
      style={{ width: "100%", height: "53%", overflow: "auto", marginTop: 5 }}
      config={{ layout: "week_view" }}
    />
  );
}
