import "server-only";

import axios from "axios";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import QueryCard from "../components/chat/query_card";
import { Table, Alert } from "antd";
import { Label } from "@/components/ui/label";

import { spinner } from "@/components/llm-stocks";

const headers = {
  "META-KEY": `eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yY3VXSjlzRDFxY2VGOU5RYkZWSVdPMnZtZEQiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJlbWFpbCI6InByYXNhbm5hQGZhYnJpcWRhdGEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV4cCI6MTcxMDg0MzY1OCwiaWF0IjoxNzEwODQzNTk4LCJpc3MiOiJodHRwczovL2ZpdC12dWx0dXJlLTg1LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6IjBkYWRiYzBmOTEwNTc2N2U4NjYzIiwibmJmIjoxNzEwODQzNTg4LCJvcmdfaWQiOiJvcmdfMmN3aThKd3FXUHQ4Vnhja0J4a3NCbmtmZEtYIiwib3JnX3Blcm1pc3Npb25zIjpbIm9yZzpmZWF0dXJlOnByb3RlY3RlZCJdLCJvcmdfcm9sZSI6Im9yZzphZG1pbiIsIm9yZ19zbHVnIjoiZGVtbyIsIm9yZ2FuaXphdGlvbiI6eyJtZXRhZGF0YSI6eyJmYWJyaXFfb3JnX2lkIjoiNTIiLCJpc19jb25uZWN0aW9uIjp0cnVlLCJpc19leHBsb3JlIjp0cnVlfSwib3JnX3NsdWciOiJkZW1vIiwidXNlcl9tZXRkYXRhIjp7ImZhYnJpcV91c2VyX2lkIjoiMjE2In19LCJzaWQiOiJzZXNzXzJkaWZNVVM1c0RxTmJ0ODcxQU5NMjY2b25LZiIsInN1YiI6InVzZXJfMmN4RDNEQkhESjhKWWlsMkRySWdtY2llMVBYIiwidXNlcl9pZCI6InVzZXJfMmN4RDNEQkhESjhKWWlsMkRySWdtY2llMVBYIn0.rHynkR6Zb1-GnLzJ-BTf9KyMVxb-z6IYzCKADEbTKx0Q5RPXfSyzvgwWxQTZqlBzFMg5xjQQNrPV8sqTfridBokClFAjF_HvJD7KMXhuK_0CgzpgUfJHbPL2wIy926TAz3L4-p1BjVjMvjyO1PerQtYxQDaoi5L7cz6PsxQ6gyZOvwDQvXRoBLYb9DmvJkVMTKHZK4joB-jfdPyNk4OT90tx0FtX68iaUD9RpCNWpC8c7A1P0SqTwTf1kdC7IYDLxzXGNyvTooreKUcYzdxSPe9hXjQbnysea_N4cLfWXRYTbBok4vATzxiyiC9zCNZoLt6iccgJwLc46YKmSYHilQ`,
};

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function sendMessage(userInput: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const params = {
    query: userInput,
    data_source_id: 122,
    id: 12,
    is_sql: true,
  };

  const chat_message = createStreamableUI(
    <div className="items-center">{spinner}</div>
  );

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000);

    chat_message.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        <div className="items-center">{spinner}</div>
      </div>
    );

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}demo/api/gpt`,
      params,
      {
        headers,
      }
    );

    await sleep(2000);
    chat_message.update(
      <div>
        <QueryCard result={response?.data?.result} />
      </div>
    );

    // get table data
    const result = {
      data_source_id: 122,
      parameters: {},
      query: response?.data?.result,
      max_age: 0,
    };

    const queryResultResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}demo/api/query_results`,
      result,
      {
        headers,
      }
    );

    await sleep(2000);
    chat_message.update(
      <div>
        <QueryCard result={response?.data?.result} />
        <Alert message={<>Thinking&hellip;</>} type="info" />
      </div>
    );

    await sleep(4000);
    chat_message.done(
      <div>
        <QueryCard result={response?.data?.result} />
        <>
          <Label className="query-label">Table</Label>
          <Table />
        </>
      </div>
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "system",
        content: `${(<QueryCard result={response?.data?.result} />)}`,
      },
    ]);
  });

  return {
    id: Date.now(),
    display: chat_message.value,
  };
}

const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];

const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
  actions: {
    sendMessage,
  },
  initialUIState,
  initialAIState,
});
