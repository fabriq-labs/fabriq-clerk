import React from "react";
import { Radio } from "antd";

const RadioButtonGroup = ({
  value,
  onChange,
  disabled,
  isDisableRealTime,
}: any) => {
  return (
    <div className="radio-button-wrapper">
      <Radio.Group onChange={onChange} value={value} disabled={disabled}>
        <Radio.Button value="real-time" disabled={isDisableRealTime}>
          Real-Time
        </Radio.Button>
        <Radio.Button value="monthly">Month</Radio.Button>
        <Radio.Button value="quarterly">Quarter</Radio.Button>
        <Radio.Button value="yearly">Year</Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default RadioButtonGroup;
