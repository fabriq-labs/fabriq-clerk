function for_salesforce(pipeline: any) {
  const refresh_token = pipeline["connection"]["credentials"]["refresh_token"];
  const client_id = pipeline["source"]["app_config"]["client_id"];
  const client_secret = pipeline["source"]["app_config"]["client_secret"];
  var config = {
    api_type: "BULK",
    client_id: client_id,
    is_sandbox: false,
    start_date: "2022-12-31T00:00:00Z",
    client_secret: client_secret,
    refresh_token: refresh_token,
  };

  return config;
}

function for_GA(pipeline: any) {
  const view_id = pipeline["connection"]["config"]["view_id"];
  const start_date = pipeline["connection"]["config"]["start_date"];
  const custom_reports = pipeline["connection"]["config"]["reports"];
  const credentials_json = JSON.stringify(
    pipeline["connection"]["credentials"]["credentials_json"]
  );

  const viewIdsArray = [];
  viewIdsArray.push(view_id);
  var config = {
    sourceType: "google-analytics-data-api",
    credentials: {
      auth_type: "Service",
      credentials_json: credentials_json,
    },
    property_ids: viewIdsArray,
    date_ranges_start_date: start_date,
    custom_reports_array: custom_reports,
    window_in_days: 1,
  };

  return config;
}

function for_Postgres(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "postgres",
    replication_method: {
      method: "Standard",
    },
    tunnel_method: {
      tunnel_method: "NO_TUNNEL",
    },
    username: credentials?.user,
    ssl_mode: {
      mode: "disable",
    },
    password: credentials?.password,
    database: credentials?.dbname,
    schemas: ["public"],
    port: parseInt(credentials?.port),
    host: credentials?.host,
    ssl: false,
  };

  return config;
}

function for_S3(pipeline: any) {
  const {
    connection: { credentials },
    config: piplineConfig,
  } = pipeline;

  var config = {
    sourceType: "s3",
    path_pattern: piplineConfig?.pathPrefix,
    provider: {
      aws_secret_access_key: credentials?.secretAccessKey,
      aws_access_key_id: credentials?.accessKey,
      path_prefix: "",
      endpoint: "",
      bucket: piplineConfig?.path,
    },
    dataset: piplineConfig?.name,
    schema: "{}",
    format: {
      filetype: piplineConfig?.format,
      newlines_in_values: false,
      infer_datatypes: true,
      double_quote: true,
      quote_char: '"',
      block_size: 10000,
      delimiter: ",",
      encoding: "utf8",
    },
  };

  return config;
}

function for_Intercom(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "intercom",
    access_token: credentials?.access_token,
    start_date: credentials?.start_date,
  };

  return config;
}

function for_Teams(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "microsoft-teams",
    credentials: {
      auth_type: "token",
      client_id: credentials?.client_id,
      client_secret: credentials?.client_secret,
      tenant_id: credentials?.tenant_id,
    },
    period: credentials?.period,
  };

  return config;
}

function for_Jira(pipeline: any) {
  const domain = pipeline["connection"]["credentials"]["jira_domain"];
  const email = pipeline["connection"]["credentials"]["user_name"];
  const api_token = pipeline["connection"]["credentials"]["password"];
  var config = {
    sourceType: "jira",
    api_token: api_token,
    domain: domain,
    email: email,
  };
  return config;
}

function for_Slack(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "slack",
    credentials: {
      option_title: "API Token Credentials",
      api_token: credentials?.bot_user_oauth_token,
    },
    join_channels: true,
    channel_filter: [],
    start_date: credentials?.start_date,
    lookback_window: parseInt(credentials?.threads_lockback),
  };

  return config;
}

function for_Freshdesk(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "freshdesk",
    domain: credentials?.domain,
    api_key: credentials?.api_key,
  };

  return config;
}

function for_Shopify(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "shopify",
    credentials: {
      auth_method: "api_password",
      api_password: credentials?.api_key,
    },
    shop: credentials?.shop,
    start_date: credentials?.start_date,
  };

  return config;
}

function for_Stripe(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "stripe",
    start_date: credentials?.start_date,
    account_id: credentials?.account_id,
    client_secret: credentials?.client_secret,
  };

  return config;
}

function for_Chargebee(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "chargebee",
    product_catalog: "1.0",
    start_date: credentials?.start_date,
    site_api_key: credentials?.api_key,
    site: credentials?.site,
  };

  return config;
}

function for_Youtube() {
  var config = {
    sourceType: "youtube-analytics",
  };

  return config;
}

function for_GoogleAds(pipeline: any) {
  var config = {
    sourceType: "google-ads",
    customer_id: pipeline["config"]["customer_id"],
  };

  return config;
}

function for_Twitter(pipeline: any) {
  const {
    connection: { credentials },
  } = pipeline;

  var config = {
    sourceType: "twitter",
    api_key: credentials?.api_key,
    query: credentials?.query,
  };

  return config;
}

function for_FacebookMarket(pipeline: any) {
  var config = {
    sourceType: "facebook-marketing",
    account_id: pipeline["config"]["account_id"],
  };

  return config;
}

function for_FacebookPages(pipeline: any) {
  var config = {
    sourceType: "facebook-pages",
    page_id: pipeline["config"]["page_id"],
  };

  return config;
}

function for_Instagram(pipeline: any) {
  var config = {
    sourceType: "instagram",
    start_date: pipeline["config"]["start_date"],
  };

  return config;
}

function for_LinkedinAds(pipeline: any) {
  var config = {
    sourceType: "linkedin-ads",
    start_date: pipeline["config"]["start_date"],
    credentials: {
      auth_method: "oAuth2.0",
    },
  };

  return config;
}

function for_LinkedinPage(pipeline: any) {
  var config = {
    sourceType: "linkedin-pages",
    org_id: pipeline["connection"]["credentials"]["org_id"],
    credentials: {
      auth_method: "oAuth2.0",
      client_id: pipeline["connection"]["credentials"]["client_id"],
      client_secret: pipeline["connection"]["credentials"]["client_secret"],
      refresh_token: pipeline["connection"]["credentials"]["refresh_token"],
    },
  };

  return config;
}

function get_source_config(pipeline: any) {
  const source_id = pipeline["source_id"];
  switch (source_id) {
    case 2:
      return for_salesforce(pipeline);
    case 5:
      return for_Freshdesk(pipeline);
    case 18:
      return for_Shopify(pipeline);
    case 34:
      return for_GA(pipeline);
    case 27:
      return for_Jira(pipeline);
    case 11:
      return for_Postgres(pipeline);
    case 17:
      return for_S3(pipeline);
    case 13:
      return for_Slack(pipeline);
    case 7:
      return for_Intercom(pipeline);
    case 22:
      return for_Chargebee(pipeline);
    case 23:
      return for_Stripe(pipeline);
    case 24:
      return for_Teams(pipeline);
    case 37:
      return for_Youtube();
    case 36:
      return for_GoogleAds(pipeline);
    case 39:
      return for_Twitter(pipeline);
    case 40:
      return for_FacebookMarket(pipeline);
    case 41:
      return for_FacebookPages(pipeline);
    case 42:
      return for_Instagram(pipeline);
    case 44:
      return for_LinkedinAds(pipeline);
    case 45:
      return for_LinkedinPage(pipeline);
    default:
      return {};
  }
}

export { get_source_config };
