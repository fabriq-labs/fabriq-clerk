import "server-only";
import { cookies } from "next/headers";

import axios from "axios";
import axios_graphql from "../app/api/axios_graphql";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import QueryCard from "../components/chat/query_card";
import TableCard from "../components/chat/table_card";
import CollapseCard from "../components/chat/collapse_card";
import { StockSkeleton } from "@/components/llm-stocks/stock-skeleton";

import { GET_ALL_DESTINATIONS } from "../app/api/pipeline/graphql";
import { CHAT_TYPES } from "../app/api/explore/graphql";

import { Alert } from "antd";

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn();
};

function decodeJwt(token: any) {
  const parts = token?.split(".");
  const payload = parts && JSON.parse(atob(parts?.[1]));

  return payload;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function sendMessage(userInput: string) {
  "use server";
  const token = cookies().get("__session")?.value;

  const decoded = decodeJwt(token);

  const headers = {
    "META-KEY": token,
  };

  let message = "Thinking";
  const aiState = getMutableAIState<typeof AI>();

  const destinationResult = await axios_graphql.post("console/v1/graphql", {
    query: GET_ALL_DESTINATIONS,
    variables: {
      org_id: decoded?.organization?.metadata?.fabriq_org_id,
    },
  });

  const chatResult = await axios_graphql.post("console/v1/graphql", {
    query: CHAT_TYPES,
  });

  const destination_id = destinationResult?.data?.data?.data_sources?.[0]?.id;
  const chat_models = chatResult?.data?.data?.org_chat_models_mapping;
  const chat_modal_id = chat_models?.[chat_models.length - 1]?.id;

  const params = {
    query: userInput,
    data_source_id: destination_id,
    id: chat_modal_id,
    is_sql: true,
  };

  const chat_message = createStreamableUI(
    <div>
      <Alert message={<>{message}&hellip;</>} type="info" />
    </div>
  );

  function timeRange(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const getQueryResultData = async (queryId: any) => {
    if (queryId) {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/query_results/${queryId}`,
          { headers }
        );
        const { data } = response.data.query_result;
        return data;
      } catch (error: any) {
        console.log("Error - getQueryResultData", error.message);
      }
    }
  };

  const fetchDataFromJob = async (jobData: any): Promise<any> => {
    let url = `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/jobs/${jobData?.job.id}`;
    try {
      const response = await axios.get(url, { headers });
      const { data } = response;

      if (jobData.job.status === 2) {
        message = "Executing query";
      } else if (jobData.job.status === 4 || jobData.job.error.code === 1) {
        message = "Error running query";
      } else if (jobData.job.status === 1) {
        message = "Query in queue";
      } else if (jobData.job.status === 3) {
        message = "Loading results";
      }

      if (data.job.status < 3) {
        await timeRange(3000);
        return await fetchDataFromJob(data);
      } else if (data.job.status === 3) {
        return data.job.result;
      } else if (data.job.status === 4 && data.job.error.code === 1) {
        return [];
      } else {
        throw new Error(data.job.error);
      }
    } catch (error: any) {
      chat_message.done(
        <div>
          <Alert message="Error fetching job data" type="error" />
        </div>
      );
    }
  };

  runAsyncFnWithoutBlocking(async () => {
    try {
      let response;
      try {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/gpt`,
          params,
          { headers, timeout: 30000 }
        );
      } catch (err) {
        chat_message.done(
          <div>
            <Alert
              message="Unable to get the query. Please try again later."
              type="error"
            />
          </div>
        );
      }

      await sleep(2000);
      chat_message.update(
        <div>
          <div className="table-div">
            <QueryCard result={response?.data?.result} />
          </div>
          <Alert message="Executing query…" type="info" />
        </div>
      );

      const result = {
        data_source_id: destination_id,
        parameters: {},
        query: response?.data?.result,
        max_age: 0,
      };

      const queryResultResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_X_HASURA_ADMIN_URL}${decoded?.org_slug}/api/query_results`,
        result,
        { headers }
      );

      const jobResult = await fetchDataFromJob(queryResultResponse?.data);
      await sleep(1000);
      chat_message.update(
        <div>
          <div className="table-div">
            <QueryCard result={response?.data?.result} />
          </div>
          <Alert message={<>{message}&hellip;</>} type="info" />
        </div>
      );

      const finalResult = await getQueryResultData(jobResult);
      let columns = finalResult?.columns.map((key: any) => ({
        title: key.name,
        dataIndex: key.name,
        key: key.name,
      }));

      const tableData = {
        columns,
        rows: finalResult?.rows,
      };

      await sleep(1000);
      chat_message.update(
        <div>
          <div className="table-div">
            <CollapseCard result={response?.data?.result} />
          </div>
          <StockSkeleton />
        </div>
      );

      await sleep(1000);
      chat_message.done(
        <div>
          <div className="table-div">
            <CollapseCard result={response?.data?.result} />
          </div>
          <TableCard tableData={tableData} />
        </div>
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "system",
          content: `${(
            <div>
              <div className="table-div">
                <CollapseCard result={response?.data?.result} />
              </div>
              <TableCard tableData={tableData} />
            </div>
          )}`,
        },
      ]);
    } catch (error: any) {
      chat_message.done(
        <div>
          <Alert
            message="Error processing message. Please try again later."
            type="error"
          />
        </div>
      );
    }
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
