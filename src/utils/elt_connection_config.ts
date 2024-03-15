function formatStreams(inputArray: any) {
  const streams = [];

  if (inputArray) {
    for (const item of inputArray) {
      if (item.config.selected) {
        const streamObject = {
          name: item.config.aliasName,
          syncMode: "incremental_append",
          cursorField: item.config.cursorField,
        };
        streams.push(streamObject);
      }
    }
  }

  return { streams };
}

function formatStreamsFullRefresh(inputArray: any) {
  const streams = [];

  if (inputArray) {
    for (const item of inputArray) {
      if (item.config.selected) {
        const streamObject = {
          name: item.config.aliasName,
          syncMode: "full_refresh_overwrite",
          cursorField: item.config.cursorField,
        };
        streams.push(streamObject);
      }
    }
  }

  return { streams };
}

function for_Jira(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_GA(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_S3(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Slack(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Freshdesk(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Shopify(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Postgres(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Intercom(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Teams(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Stripe(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Chargebee(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Youtube(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_GoogleAds(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Twitter(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );
  return formattedStreams;
}

function for_Facebook(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );

  return formattedStreams;
}

function for_FacebookPage(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreamsFullRefresh(
    pipeline["config"]["streams"]
  );

  return formattedStreams;
}

function for_Instagram(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreamsFullRefresh(
    pipeline["config"]["streams"]
  );

  return formattedStreams;
}

function for_LinkedinAds(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreams(
    pipeline["config"]["streams"]
  );

  return formattedStreams;
}

function for_LinkedinPage(pipeline: any) {
  let formattedStreams: any = {};
  formattedStreams["streamsConfig"] = formatStreamsFullRefresh(
    pipeline["config"]["streams"]
  );

  return formattedStreams;
}

function get_config(pipeline: any) {
  const source_id = pipeline["source_id"];
  switch (source_id) {
    case 34:
      return for_GA(pipeline);
    case 11:
      return for_Postgres(pipeline);
    case 17:
      return for_S3(pipeline);
    case 13:
      return for_Slack(pipeline);
    case 5:
      return for_Freshdesk(pipeline);
    case 18:
      return for_Shopify(pipeline);
    case 7:
      return for_Intercom(pipeline);
    case 22:
      return for_Chargebee(pipeline);
    case 23:
      return for_Stripe(pipeline);
    case 24:
      return for_Teams(pipeline);
    case 37:
      return for_Youtube(pipeline);
    case 36:
      return for_GoogleAds(pipeline);
    case 39:
      return for_Twitter(pipeline);
    case 40:
      return for_Facebook(pipeline);
    case 41:
      return for_FacebookPage(pipeline);
    case 42:
      return for_Instagram(pipeline);
    case 44:
      return for_LinkedinAds(pipeline);
    case 45:
      return for_LinkedinPage(pipeline);
    default:
      return for_Jira(pipeline);
  }
}

export { get_config };
