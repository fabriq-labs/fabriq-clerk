// Chat Component
import React from "react";
import { Form } from "antd";
import { CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const ChatAI = ({
  handleSubmit,
  onChange,
  userInput,
  loading,
  onClickClear,
}: any) => {
  return (
    <div className="chatai-wrapper">
      <Form onFinish={handleSubmit}>
        <div className="chat-row">
          <div className="text-wrapper">
            <input
              placeholder="Ask your question"
              value={userInput}
              onChange={(e) => onChange(e.target.value)}
              type="text"
              className="chat-input-comp"
              disabled={loading}
            />
            <div className="input-icon" onClick={onClickClear}>
              {loading ? (
                <LoadingOutlined style={{ fontSize: 20, marginRight: 10 }} />
              ) : (
                <CloseCircleOutlined />
              )}
            </div>
          </div>
        </div>
        {/* <div className="flex-right ">
          <Button
            type="primary"
            className="okay-btn"
            loading={loading}
            onClick={handleSubmit}
          >
            Search
          </Button>
        </div> */}
      </Form>
    </div>
  );
};

export default ChatAI;
