"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

import { ChatWindow } from "@components/chat_window";

import Layout from "@components/layout";

export default function CombinedChat() {
  const renderChatWindow = () => {
    const InfoCard = (
      <Card className="p-4 md:p-8 rounded w-full max-h-[85%] overflow-hidden info-card">
        <CardContent>
          <ul>
            <li className="text-l">
              👇
              <span className="ml-2">
                Try asking e.g. <code>tell me a small story?</code> below!
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    );

    return (
      <ChatWindow
        endpoint="/api/chat"
        emoji="💻"
        titleText="Patchy the Chatty Pirate"
        placeholder="Say Something!"
        emptyStateComponent={InfoCard}
      />
    );
  };

  const renderAgentWindow = () => {
    const InfoCard = (
      <Card className="p-4 md:p-8 rounded w-full max-h-[85%] overflow-hidden info-card">
        <CardContent>
          <ul>
            <li className="text-l">
              👇
              <span className="ml-2">
                Try asking e.g. <code>What is the weather in Honolulu?</code>{" "}
                below!
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    );

    return (
      <ChatWindow
        endpoint="/api/chat/agent"
        emptyStateComponent={InfoCard}
        placeholder="I'm a conversational agent! Ask me about the current weather in Honolulu!"
        titleText="Agent"
        emoji="📊"
        showIntermediateStepsToggle={true}
      />
    );
  };

  const renderChatRetrieval = () => {
    const InfoCard = (
      <Card className="p-4 md:p-8 rounded w-full max-h-[85%] overflow-hidden info-card">
        <CardContent>
          <ul>
            <li className="text-l">
              👇
              <span className="ml-2">
                Upload some text, then try asking e.g. What is a document
                loader? below!
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    );

    return (
      <ChatWindow
        endpoint="/api/chat/retrieval"
        emptyStateComponent={InfoCard}
        showIngestForm={true}
        placeholder={
          'I\'ve got a nose for finding the right documents! Ask, "What is a document loader?"'
        }
        emoji="🐶"
        titleText="Dana the Document-Retrieving Dog"
      ></ChatWindow>
    );
  };

  const renderChatRetrievalAgent = () => {
    const InfoCard = (
      <Card className="p-4 md:p-8 rounded w-full max-h-[85%] overflow-hidden info-card">
        <CardContent>
          <ul>
            <li className="text-l">
              👇
              <span className="ml-2">
                Upload some text, then try asking e.g.{" "}
                <code>What are some ways of doing retrieval in LangChain?</code>{" "}
                below!
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    );

    return (
      <ChatWindow
        endpoint="/api/chat/retrieval_agents"
        emptyStateComponent={InfoCard}
        // showIngestForm={true}
        // showIntermediateStepsToggle={true}
        placeholder={
          'Beep boop! I\'m a robot retrieval-focused agent! Ask, "What are some ways of doing retrieval in LangChain.js?"'
        }
        emoji="🤖"
        titleText="Robbie the Retrieval Robot"
      ></ChatWindow>
    );
  };

  return (
    <Layout>
      <Tabs defaultValue="chat" className="tabs-div">
        <TabsList className="grid-cols-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="retrieval">Retrieval</TabsTrigger>
          <TabsTrigger value="retrieval-agent">Retrieval Agent</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">{renderChatWindow()}</TabsContent>
        <TabsContent value="agent">{renderAgentWindow()}</TabsContent>
        <TabsContent value="retrieval">{renderChatRetrieval()}</TabsContent>
        <TabsContent value="retrieval-agent">{renderChatRetrievalAgent()}</TabsContent>
      </Tabs>
    </Layout>
  );
}
