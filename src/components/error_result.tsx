// Result
import React from "react";
import { Result } from "antd";

const ErrorResult = () => {
  return (
    <div>
      <Result
        status="500"
        title="Oops! Something Went Wrong."
        subTitle="We apologize for the inconvenience, Please try again later."
      />
    </div>
  );
};

export default ErrorResult;
