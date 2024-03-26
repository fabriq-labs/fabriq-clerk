import { Reactenv } from "@/utils/helper";

export const USER_ANALYTICS_DAILY = `
  query user_analytics_daily($site_id: String!, $period_date: String) {
    DailyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
        page_views
        readability
        recirculation
        new_users
        total_time_spent
        average_time_spent
        users
        anonymous_users
        logged_in_users
        top_referer
        os_wise_split
        client_wise_split
        category_list
        churned_users
        churned_percent
        loggedin_and_visitor_ratio
        user_activity
    }

    HourlyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_hourly(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
      top_referer
      period_date
      period_hour
      users
      anonymous_users
      logged_in_users
      new_users
      client_wise_split
      os_wise_split
      average_time_spent
      category_list
    }
  }
`;

export const USER_ANALYTICS_MONTHLY = `
  query user_analytics_monthly($site_id: String!,  $period_month: Int, $period_year: Int, $partial_period_date: String, $lastThreeMonths: [Int], $lastday: String, $current_day: String) {
    MonthlyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
        page_views
        readability
        recirculation
        total_time_spent
        average_time_spent
        users
        new_users
        anonymous_users
        logged_in_users
        top_referer
        os_wise_split
        client_wise_split
        category_list
        loggedin_and_visitor_ratio
        logged_in_frequency_buckets
        anonymous_frequency_buckets
        churned_users
        churned_percent
        user_activity
    }

    DailyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(where: {site_id: {_eq: $site_id}, period_date: {_like: $partial_period_date}}) {
      top_referer
      period_date
      users
      anonymous_users
      logged_in_users
      new_users
      client_wise_split
      os_wise_split
      average_time_spent
      churned_users
      churned_percent
      category_list
    }

    Bucket: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(
      where: {
        site_id: { _eq: $site_id },
        period_month: { _in: $lastThreeMonths },
        period_year: { _eq: $period_year }
      }
    ) {
      logged_in_frequency_buckets
      anonymous_frequency_buckets
      period_month
    }

    Last7DaysData: ${Reactenv.content_analytics_entity_prefix}user_analytics_daily(
      where: {
        site_id: { _eq: $site_id },
        period_date: {
          _gte: $lastday,
          _lte: $current_day
        }
      },
      order_by: { period_date: desc }
    ) {
      period_date
      d0_users
      d1_users
      d2_users
      d3_users
      d4_users
      d5_users
      d6_users
      d7_users
    }
    
  }
`;

export const USER_ANALYTICS_QUATERLY = `
  query user_analytics_quaterly($site_id: String!, $period_quarter: Int, $period_year: Int, $period_month: [Int!]) {
    QuaterlyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_quaterly(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}}) {
        page_views
        readability
        recirculation
        total_time_spent
        average_time_spent
        users
        anonymous_users
        logged_in_users
        top_referer
        os_wise_split
        client_wise_split
        category_list
        loggedin_and_visitor_ratio
        user_activity
    }

    MonthlyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(where: {site_id: {_eq: $site_id}, period_month: {_in: $period_month}, period_year: {_eq: $period_year}}) {
      top_referer
      period_month
      period_year
      users
      anonymous_users
      logged_in_users
      new_users
      client_wise_split
      os_wise_split
      average_time_spent
      churned_users
      churned_percent
      category_list
    }

    Bucket: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(
      where: {
        site_id: { _eq: $site_id },
        period_month: { _in: $period_month },
        period_year: { _eq: $period_year }
      }
    ) {
      logged_in_frequency_buckets
      anonymous_frequency_buckets
      period_month
      period_year
    }
  }
`;

export const USER_ANALYTICS_YEARLY = `
  query user_analytics_yearly($site_id: String!, $period_year: Int, $period_month: [Int!], $monthly_year: Int) {
    YearlyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_yearly(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
        page_views
        readability
        recirculation
        total_time_spent
        average_time_spent
        users
        anonymous_users
        logged_in_users
        top_referer
        os_wise_split
        client_wise_split
        category_list
        loggedin_and_visitor_ratio
        user_activity
    }

    MonthlyData: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(where: {site_id: {_eq: $site_id}, period_month: {_in: $period_month}, period_year: {_eq: $monthly_year}}) {
      top_referer
      period_month
      period_year
      users
      anonymous_users
      logged_in_users
      new_users
      client_wise_split
      os_wise_split
      average_time_spent
      churned_users
      churned_percent
      category_list
    }

    Bucket: ${Reactenv.content_analytics_entity_prefix}user_analytics_monthly(
      where: {
        site_id: { _eq: $site_id },
        period_month: { _in: $period_month },
        period_year: { _eq: $monthly_year }
      }
    ) {
      logged_in_frequency_buckets
      anonymous_frequency_buckets
      period_month
      period_year
    }
  }
`;
