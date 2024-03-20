import { Skeleton } from "antd";

export const StockSkeleton = () => {
  return (
    <div
      className="p-4 rounded-xl text-green-400"
      style={{ border: "1px solid #d9d9d9", background: "#fff" }}
    >
      <Skeleton active />
    </div>
  );
};
