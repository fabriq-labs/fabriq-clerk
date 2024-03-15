import React from "react";

const MessageCard = ({ messge }: any) => {
  return (
    <div className="msg-wrapper">
      <div className="widget-card-container">
        <div className="message-result">{messge}</div>
      </div>
    </div>
  );
};

export default MessageCard;
