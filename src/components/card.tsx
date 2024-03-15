import React from "react";
import { Card } from "antd";

import style from "@/styles/card.module.css";

interface CardComponentProps {
  title: string;
  content: {
    total: number;
  };
  color: string;
  image: string;
}

const formatNumber = (value: number) => {
  if (value >= 1000000) {
    return ` ${(value / 1000000).toFixed(2)}m`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`;
  } else {
    return value?.toString();
  }
};

const CardComponent: React.FC<CardComponentProps> = ({
  title,
  content,
  color,
  image,
}) => (
  <Card className={`${style.cardColor}`}>
    <div><h3 className={style.title}>{title}</h3></div>
    <div className={style.contentWrapper}>
      <div className={style.cardHead}>
        <div className={style.totalValue}>{formatNumber(content.total)}</div>
      </div>
    </div>
  </Card>
);

export default CardComponent;
