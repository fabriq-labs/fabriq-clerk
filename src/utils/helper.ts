import moment from "moment";
import "moment-timezone";

export const generateTableData = (data: any) => {
  let columns: any = [];
  columns = data?.columns.map((key: any) => {
    return {
      title: key.name,
      dataIndex: key.name,
      key: key.name,
    };
  });
  const tableData = {
    columns,
    rows: data.rows,
  };

  return tableData;
};

export const formatNumber = (val: any) => {
  const value = typeof val === "string" ? parseInt(val) : val;
  if (value >= 1000000) {
    return ` ${(value / 1000000)?.toFixed(2)}m`;
  } else if (value >= 1000) {
    return `${(value / 1000)?.toFixed(2)}k`;
  } else {
    return value % 1 !== 0 ? value?.toFixed(2)?.toString() : value?.toString();
  }
};

export const columnForGeography: any = [
  {
    title: "City",
    dataIndex: "city",
    key: "city",
    align: "left",
  },
  {
    title: "Readers",
    dataIndex: "users",
    key: "users",
    align: "right",
  },
];

export const getCurrentHour = () => {
  let timezone = localStorage.getItem("org_timezone") || "";
  let currentHour;

  if (timezone !== "") {
    currentHour = moment().tz(timezone).hour();
  } else {
    const currentDateTime = new Date();
    currentHour = currentDateTime.getUTCHours();
  }

  return currentHour;
};

export const formationTimezone = (value: any, format?: any) => {
  // Time zones for different users
  let timezone = localStorage.getItem("org_timezone") || "";
  let FormattedTime;
  const formatString = format ? format : "MMM DD";
  if (timezone !== "") {
    FormattedTime = moment(value).format(formatString);
  } else {
    FormattedTime = moment.utc(value).format(formatString);
  }
  return FormattedTime;
};

export const periodDateFormation = (date: any, type: any, format: any) => {
  let timezone = "";
  let FormattedDate;

  if (timezone !== "") {
    const periodMoment = moment.tz(date, timezone);
    if (type === "hours") {
      FormattedDate = periodMoment.subtract(24, "hours").format(format);
    } else {
      FormattedDate = periodMoment.subtract(30, "days").format(format);
    }
  } else {
    if (type === "hours") {
      FormattedDate = moment.utc(date).subtract(24, "hours").format(format);
    } else {
      FormattedDate = moment.utc(date).subtract(30, "days").format(format);
    }
  }

  return FormattedDate;
};

export const Reactenv = {
  content_analytics_entity_prefix:
    process.env.NEXT_PUBLIC_CONTENT_ENTITY_PREFIX || "",
};

export const mapArticleData = (topPostToday: any) => {
  return topPostToday?.map((data: any) => ({
    id: data?.article?.article_id,
    type: "article",
    title: data?.article?.title,
    author: data?.article?.authors?.name,
    author_id: data?.article?.authors?.author_id,
    published_date: data?.article?.published_date,
    category: data?.article?.category,
    user: data?.users?.toLocaleString(),
    page_views: data?.page_views?.toLocaleString(),
    recirculation: `${data?.recirculation || 0} %`,
    scrolldepth: `${data?.scroll_depth_percentage || 0} %`,
    ad_revenue: `$${Math.floor(Math.random() * 100) + 1}`,
  }));
};

export const mapAuthorData = (overviewAuthor: any) => {
  return overviewAuthor?.map((data: any) => ({
    id: data?.author?.author_id,
    type: "author",
    title: data?.author?.name || "UnKnown",
    user: data?.users,
    page_views: data?.page_views,
    recirculation: `${data?.recirculation || 0} %`,
    readability: `${data?.readability || 0} %`,
    article_count: data?.author?.articles_aggregate?.aggregate?.count,
    ad_revenue: `$${Math.floor(Math.random() * 100) + 1}`,
  }));
};

export const mapCategoryData = (overviewTagsHour: any) => {
  return overviewTagsHour?.map((data: any, index: any) => ({
    id: index,
    type: "tag",
    title: data?.category,
    user: data?.users?.toLocaleString(),
    page_views: data?.page_views?.toLocaleString(),
    ad_revenue: `$${Math.floor(Math.random() * 100) + 1}`
  }));
};

export const seriesData = [
  {
    name: "12:00 am",
    pageViews: 115,
  },
  {
    name: "1:00 am",
    pageViews: 67,
  },
  {
    name: "2:00 am",
    pageViews: 47,
  },
  {
    name: "3:00 am",
    pageViews: 44,
  },
  {
    name: "4:00 am",
    pageViews: 47,
  },
  {
    name: "5:00 am",
    pageViews: 86,
  },
  {
    name: "6:00 am",
    pageViews: 193,
  },
  {
    name: "7:00 am",
    pageViews: 319,
  },
  {
    name: "8:00 am",
    pageViews: 336,
  },
  {
    name: "9:00 am",
    pageViews: 353,
  },
  {
    name: "10:00 am",
    pageViews: 297,
  },
  {
    name: "11:00 am",
    pageViews: 823,
  },
  {
    name: "12:00 pm",
    pageViews: 969,
  },
  {
    name: "1:00 pm",
    pageViews: 1021,
  },
  {
    name: "2:00 pm",
    pageViews: 912,
  },
  {
    name: "3:00 pm",
    pageViews: 1065,
  },
  {
    name: "4:00 pm",
    pageViews: 717,
  },
  {
    name: "5:00 pm",
    pageViews: 521,
  },
  {
    name: "6:00 pm",
    pageViews: 374,
  },
  {
    name: "7:00 pm",
    pageViews: 0,
  },
  {
    name: "8:00 pm",
    pageViews: 0,
  },
  {
    name: "9:00 pm",
    pageViews: 0,
  },
  {
    name: "10:00 pm",
    pageViews: 0,
  },
  {
    name: "11:00 pm",
    pageViews: 0,
  },
];

export const dummylabels = [
  "12:00 am",
  "1:00 am",
  "2:00 am",
  "3:00 am",
  "4:00 am",
  "5:00 am",
  "6:00 am",
  "7:00 am",
  "8:00 am",
  "9:00 am",
  "10:00 am",
  "11:00 am",
  "12:00 pm",
  "1:00 pm",
  "2:00 pm",
  "3:00 pm",
  "4:00 pm",
  "5:00 pm",
  "6:00 pm",
  "7:00 pm",
  "8:00 pm",
  "9:00 pm",
  "10:00 pm",
  "11:00 pm",
];
