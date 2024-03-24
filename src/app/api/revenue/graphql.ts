import { Reactenv } from "@/utils/helper";

export const REVENUE_ANALYTICS = `
  query revenue_analytics($period_month: numeric, $period_year: numeric) {
    ChartData: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_daily(
      where: {
        period_month: {_eq: $period_month}, 
        period_year: {_eq: $period_year}
      },
      order_by: { period_date: asc }
    ) {
      period_date
      period_month
      total_revenue
      total_impressions
      total_fill_rate
    }
  }
`;

export const OVERALLDATA = `
  query revenue_analytics($period_month: Int, $period_year: Int) {
    OverViewInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_monthly_overall(where: {
      period_month: {_eq: $period_month}, 
      period_year: {_eq: $period_year}
    }) {
      total_revenue
      avg_revenue_per_user
      total_avg_fill_rate
      average_ecpm
    }
  }
`;

export const ADVERTISER_MONTHLY = `
  query advertiser_monthly($period_month: numeric, $period_year: numeric) {
    AdvertiserData: ${Reactenv.content_analytics_entity_prefix}advertiser_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}, order_by: {
      total_revenue: desc_nulls_last
    }) {
      period_month
      buyer_network_name
      total_revenue
      total_average_ecpm
    }

    DemandChannel: ${Reactenv.content_analytics_entity_prefix}advertiser_demand_channel_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, demand_channel_name: {_neq: ""}}, order_by: {
      total_revenue: desc_nulls_last
    }) {
      period_month
      demand_channel_name
      total_revenue
      total_average_ecpm
    }
  }
`;

export const get_main_list = (filterConditons: any) => {
  let additonWhereConditions = `where: {
        period_month: {_eq: $period_month},
        period_year: {_eq: $period_year}
      }`;

  if (filterConditons?.filterKey === "campaign_type") {
    if (filterConditons?.filterValue === "-") {
      additonWhereConditions = `where: {
            period_month: {_eq: $period_month},
            period_year: {_eq: $period_year},
            buyer_network_name: {_eq: "Direct"}
          }`;
    } else {
      additonWhereConditions = `where: {
            period_month: {_eq: $period_month},
            period_year: {_eq: $period_year},
            buyer_network_name: {_neq: "Direct"}
          }`;
    }
  } else if (filterConditons?.filterKey === "ad_partner") {
    if (filterConditons?.filterValue) {
      additonWhereConditions = `where: {
            period_month: {_eq: $period_month},
            period_year: {_eq: $period_year},
            ad_unit_1: {_eq: "${filterConditons?.filterValue}"}
          }`;
    } else {
      additonWhereConditions = `where: {
            period_month: {_eq: $period_month},
            period_year: {_eq: $period_year}
          }`;
    }
  }

  const query = `
          query table_list($offset: Int!, $period_month: numeric, $period_year: numeric, $sortOrder: order_by) {
            TableList: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_monthly(
              ${additonWhereConditions},
              limit: 10,
              offset: $offset,
              order_by: { total_revenue: $sortOrder }
            ) {
              ad_unit_2
              ad_unit_id_2
              total_revenue
              total_impressions
              period_year
              period_month
              total_average_ecpm
              total_fill_rate
            }
            totalCount: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_monthly_aggregate(${additonWhereConditions}) {
              aggregate {
                count
              }
            }
          }
        `;

  return query;
};

export const GET_MAIN_LIST_CHART = `
  query main_chart($ad_unit_id_2: [String!]!, $period_year: numeric, $period_month: numeric) {
    ChartInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_daily(
      where: {
        ad_unit_id_2: { _in: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_month: { _eq: $period_month }
      }
    ) {
      ad_unit_2
      period_date
      period_month
      ad_unit_id_2
      total_revenue
    }
  }
`;

export const get_overall_data = (filterConditons: any) => {
  let additonWhereConditions = `where: {
    period_month: {_eq: $period_month},
    period_year: {_eq: $period_year}
  }`;

  if (filterConditons?.filterKey === "ad_partner") {
    if (filterConditons?.filterValue) {
      additonWhereConditions = `where: {
          period_month: {_eq: $period_month},
          period_year: {_eq: $period_year},
          ad_unit_1: {_eq: "${filterConditons?.filterValue}"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_month: {_eq: $period_month},
          period_year: {_eq: $period_year}
        }`;
    }
  }

  const query = `
      query revenue_analytics($period_month: Int, $period_year: Int) {
        OverViewInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_monthly(${additonWhereConditions}) {
          total_revenue
          avg_revenue_per_user
          total_avg_fill_rate
          average_ecpm
        }
      }
    `;

  return query;
};

export const GET_SUB_LIST = `
  query revenue_analytics($ad_unit_id_2: String, $offset: Int, $limit: Int, $period_year: numeric, $period_month: numeric, $sortOption: order_by) {
    TableList: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_monthly(
      where: {
        ad_unit_id_2: { _eq: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_month: { _eq: $period_month }
      },
      limit: $limit,
      offset: $offset,
      order_by: { total_revenue: $sortOption }
    ) {
      ad_unit_3
      ad_unit_id_3
      total_revenue
      total_impressions
      total_average_ecpm
      total_fill_rate
    }
    totalCount: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_monthly_aggregate(
      where: {
        ad_unit_id_2: { _eq: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_month: { _eq: $period_month }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_SUB_LIST_CHART = `
  query sub_chart($ad_unit_id_3: [String!]!, $period_year: numeric, $period_month: numeric) {
    ChartInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_daily(
      where: {
        ad_unit_id_3: { _in: $ad_unit_id_3 },
        period_year: { _eq: $period_year },
        period_month: { _eq: $period_month }
      }
    ) {
      ad_unit_3
      period_date
      period_month
      ad_unit_id_3
      total_revenue
    }
  }
`;

export const REVENUE_ANALYTICS_MONTHLY = `
  query revenue_analytics($period_month: [Int!], $period_year: Int) {
    ChartData: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_monthly_overall(
      where: {
        period_month: {_in: $period_month}, 
        period_year: {_eq: $period_year}
      },
      order_by: { period_month: asc }
    ) {
      period_month
      period_year
      total_revenue
      total_impressions
      total_fill_rate: total_avg_fill_rate
    }
  }
`;

export const OVERALLDATA_QUARTERLY = `
  query revenue_analytics($period_quarter: Int, $period_year: Int) {
    OverViewInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_quarterly_overall(where: {
      period_quarter: {_eq: $period_quarter}, 
      period_year: {_eq: $period_year}
    }) {
      total_revenue
      avg_revenue_per_user
      total_avg_fill_rate
      average_ecpm
    }
  }
`;

export const get_main_list_quarterly = (filterConditons: any) => {
  let additonWhereConditions = `where: {
      period_quarter: {_eq: $period_quarter},
      period_year: {_eq: $period_year}
    }`;

  if (filterConditons?.filterKey === "campaign_type") {
    if (filterConditons?.filterValue === "-") {
      additonWhereConditions = `where: {
          period_quarter: {_eq: $period_quarter},
          period_year: {_eq: $period_year},
          buyer_network_name: {_eq: "Direct"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_quarter: {_eq: $period_quarter},
          period_year: {_eq: $period_year},
          buyer_network_name: {_neq: "Direct"}
        }`;
    }
  } else if (filterConditons?.filterKey === "ad_partner") {
    if (filterConditons?.filterValue) {
      additonWhereConditions = `where: {
          period_quarter: {_eq: $period_quarter},
          period_year: {_eq: $period_year},
          ad_unit_1: {_eq: "${filterConditons?.filterValue}"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_quarter: {_eq: $period_quarter},
          period_year: {_eq: $period_year}
        }`;
    }
  }

  const query = `
    query table_list($offset: Int!, $period_quarter: numeric, $period_year: numeric, $sortOrder: order_by) {
      TableList: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_quarterly(
        ${additonWhereConditions},
        limit: 10,
        offset: $offset,
        order_by: { total_revenue: $sortOrder }
      ) {
        ad_unit_2
        ad_unit_id_2
        total_revenue
        total_impressions
        period_year
        period_quarter
        total_average_ecpm
        total_fill_rate
      }
      totalCount: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_quarterly_aggregate(${additonWhereConditions}) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
};

export const GET_MAIN_LIST_CHART_QUARTERLY = `
  query main_chart($ad_unit_id_2: [String!]!, $period_year: numeric, $period_month: [numeric!]!) {
    ChartInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_monthly(
      where: {
        ad_unit_id_2: { _in: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_month: { _in: $period_month }
      }
    ) {
      ad_unit_2
      period_year
      period_month
      ad_unit_id_2
      total_revenue
    }
  }
`;

export const GET_SUB_LIST_CHART_QUARTERLY = `
  query sub_chart($ad_unit_id_3: [String!]!, $period_year: numeric, $period_month: [numeric!]) {
    ChartInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_monthly(
      where: {
        ad_unit_id_3: { _in: $ad_unit_id_3 },
        period_year: { _eq: $period_year },
        period_month: { _in: $period_month }
      }
    ) {
      ad_unit_3
      period_month
      period_year
      ad_unit_id_3
      total_revenue
    }
  }
`;

export const ADVERTISER_QUARTERLY = `
  query advertiser_quarterly($period_quarter: numeric, $period_year: numeric) {
    AdvertiserData: ${Reactenv.content_analytics_entity_prefix}advertiser_quarterly(where: {period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}}, order_by: {
      total_revenue: desc_nulls_last
    }) {
      period_quarter
      buyer_network_name
      total_revenue
      total_average_ecpm
    }

    DemandChannel: ${Reactenv.content_analytics_entity_prefix}advertiser_demand_channel_quarterly(where: {period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}, demand_channel_name: {_neq: ""}}, order_by: {
      total_revenue: desc_nulls_last
    }) {
      period_quarter
      demand_channel_name
      total_revenue
      total_average_ecpm
    }
  }
`;

export const get_overall_data_quarterly = (filterConditons: any) => {
  let additonWhereConditions = `where: {
    period_quarter: {_eq: $period_quarter},
    period_year: {_eq: $period_year}
  }`;

  if (filterConditons?.filterKey === "ad_partner") {
    if (filterConditons?.filterValue) {
      additonWhereConditions = `where: {
          period_quarter: {_eq: $period_quarter},
          period_year: {_eq: $period_year},
          ad_unit_1: {_eq: "${filterConditons?.filterValue}"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_quarter: {_eq: $period_quarter},
          period_year: {_eq: $period_year}
        }`;
    }
  }

  const query = `
      query revenue_analytics($period_year: Int, $period_quarter: Int) {
        OverViewInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_quarterly(${additonWhereConditions}) {
          total_revenue
          avg_revenue_per_user
          total_avg_fill_rate
          average_ecpm
        }
      }
    `;

  return query;
};

export const GET_SUB_LIST_QUARTERLY = `
  query revenue_analytics($ad_unit_id_2: String, $offset: Int, $limit: Int, $period_year: numeric, $period_quarter: numeric, $sortOption: order_by) {
    TableList: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_quarterly(
      where: {
        ad_unit_id_2: { _eq: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_quarter: { _eq: $period_quarter }
      },
      limit: $limit,
      offset: $offset,
      order_by: { total_revenue: $sortOption }
    ) {
      ad_unit_3
      ad_unit_id_3
      total_revenue
      total_impressions
      total_average_ecpm
      period_quarter
      total_fill_rate
    }
    totalCount: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_quarterly_aggregate(
      where: {
        ad_unit_id_2: { _eq: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_quarter: { _eq: $period_quarter }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const REVENUE_ANALYTICS_YEARLY = `
  query revenue_analytics($period_year: Int) {
    ChartData: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_monthly_overall(
      where: {
        period_year: {_eq: $period_year}
      },
      order_by: { period_month: asc }
    ) {
      period_month
      period_year
      total_revenue
      total_impressions
      total_fill_rate: total_avg_fill_rate
    }
  }
`;

export const OVERALLDATA_YEARLY = `
  query revenue_analytics($period_year: Int) {
    OverViewInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_yearly_overall(where: {
      period_year: {_eq: $period_year}
    }) {
      total_revenue
      avg_revenue_per_user
      total_avg_fill_rate
      average_ecpm
    }
  }
`;

export const get_main_list_yearly = (filterConditons: any) => {
  let additonWhereConditions = `where: {
      period_year: {_eq: $period_year}
    }`;

  if (filterConditons?.filterKey === "campaign_type") {
    if (filterConditons?.filterValue === "-") {
      additonWhereConditions = `where: {
          period_year: {_eq: $period_year},
          buyer_network_name: {_eq: "Direct"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_year: {_eq: $period_year},
          buyer_network_name: {_neq: "Direct"}
        }`;
    }
  } else if (filterConditons?.filterKey === "ad_partner") {
    if (filterConditons?.filterValue) {
      additonWhereConditions = `where: {
          period_year: {_eq: $period_year},
          ad_unit_1: {_eq: "${filterConditons?.filterValue}"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_year: {_eq: $period_year}
        }`;
    }
  }

  const query = `
    query table_list($offset: Int!, $period_year: numeric, $sortOrder: order_by) {
      TableList: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_yearly(
        ${additonWhereConditions},
        limit: 10,
        offset: $offset,
        order_by: { total_revenue: $sortOrder }
      ) {
        ad_unit_2
        ad_unit_id_2
        total_revenue
        total_impressions
        period_year
        total_average_ecpm
        total_fill_rate
      }
      totalCount: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_yearly_aggregate(${additonWhereConditions}) {
        aggregate {
          count
        }
      }
    }
  `;

  return query;
};

export const GET_MAIN_LIST_CHART_YEARLY = `
  query main_chart($ad_unit_id_2: [String!]!, $period_year: numeric, $period_month: [numeric!]!) {
    ChartInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_category_monthly(
      where: {
        ad_unit_id_2: { _in: $ad_unit_id_2 },
        period_year: { _eq: $period_year },
        period_month: { _in: $period_month }
      }
    ) {
      ad_unit_2
      period_year
      period_month
      ad_unit_id_2
      total_revenue
    }
  }
`;

export const ADVERTISER_YEARLY = `
  query advertiser_quarterly($period_year: numeric) {
    AdvertiserData: ${Reactenv.content_analytics_entity_prefix}advertiser_yearly(where: {period_year: {_eq: $period_year}}, order_by: {
      total_revenue: desc_nulls_last
    }) {
      period_year
      buyer_network_name
      total_revenue
      total_average_ecpm
    }

    DemandChannel: ${Reactenv.content_analytics_entity_prefix}advertiser_demand_channel_yearly(where: {period_year: {_eq: $period_year}, demand_channel_name: {_neq: ""}}, order_by: {
      total_revenue: desc_nulls_last
    }) {
      period_year
      demand_channel_name
      total_revenue
      total_average_ecpm
    }
  }
`;

export const get_overall_data_yearly = (filterConditons: any) => {
  let additonWhereConditions = `where: {
    period_year: {_eq: $period_year}
  }`;

  if (filterConditons?.filterKey === "ad_partner") {
    if (filterConditons?.filterValue) {
      additonWhereConditions = `where: {
          period_year: {_eq: $period_year},
          ad_unit_1: {_eq: "${filterConditons?.filterValue}"}
        }`;
    } else {
      additonWhereConditions = `where: {
          period_year: {_eq: $period_year}
        }`;
    }
  }

  const query = `
    query revenue_analytics($period_year: Int) {
      OverViewInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_yearly(${additonWhereConditions}) {
        total_revenue
        avg_revenue_per_user
        total_avg_fill_rate
        average_ecpm
      }
    }
  `;

  return query;
};

export const GET_SUB_LIST_YEARLY = `
  query revenue_analytics($ad_unit_id_2: String, $offset: Int, $limit: Int, $period_year: numeric, $sortOption: order_by) {
    TableList: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_yearly(
      where: {
        ad_unit_id_2: { _eq: $ad_unit_id_2 },
        period_year: { _eq: $period_year }
      },
      limit: $limit,
      offset: $offset,
      order_by: { total_revenue: $sortOption }
    ) {
      ad_unit_3
      ad_unit_id_3
      total_revenue
      total_impressions
      total_average_ecpm
      period_year
      total_fill_rate
    }
    totalCount: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_yearly_aggregate(
      where: {
        ad_unit_id_2: { _eq: $ad_unit_id_2 },
        period_year: { _eq: $period_year }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_SUB_LIST_CHART_YEARLY = `
  query sub_chart($ad_unit_id_3: [String!]!, $period_year: numeric) {
    ChartInfo: ${Reactenv.content_analytics_entity_prefix}ad_revenue_analytics_sub_category_monthly(
      where: {
        ad_unit_id_3: { _in: $ad_unit_id_3 },
        period_year: { _eq: $period_year }
      }
    ) {
      ad_unit_3
      period_month
      period_year
      ad_unit_id_3
      total_revenue
    }
  }
`;

