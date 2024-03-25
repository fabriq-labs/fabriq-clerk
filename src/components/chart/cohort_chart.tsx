import CohortGraph from "react-cohort-graph";
import React from "react";

const CohortChart = ({ data }: any) => {
  return (
    <div className="cohert-chart">
      <CohortGraph data={data} defaultValueType="percent" />
    </div>
  );
};

export default CohortChart;
