import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "antd";

// OauthServiceConnect component
const OauthServiceConnect = (props: any) => {
  const { item, pipeline, onMenuItem, onClickReconnect, onClickItem, loader } =
    props;

  const router = useRouter();
  const { connection } = pipeline;

  /* Handler Functionn */
  const onClickMenuItem = (value: any) => {
    if (onMenuItem) {
      onMenuItem(item, value);
    }
  };

  const handleClickBack = () => {
    router.push(`/pipeline/${pipeline.id}`);
  };

  return (
    <div className="wrapper">
      <div className="content-pipeline">
        <Button
          block
          size="large"
          className="flex"
          onClick={connection ? onClickReconnect : () => onClickMenuItem(false)}
        >
          <Image src={"/images/auth_.png"} alt="auth" width={28} height={28} />
          <span className="oauth-title">
            &nbsp;{connection ? "Re-authenticate" : "Authenticate"}
          </span>
        </Button>
        <div className="button-row">
          <div className="right-btn">
            <Button
              loading={loader}
              onClick={handleClickBack}
            >
              Cancel
            </Button>
          </div>
          <Button
            loading={loader}
            disabled={!connection}
            onClick={() => onClickMenuItem(true)}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const OauthService = (props: any) => {
  const { children } = props;

  return children;
};

OauthService.Connect = OauthServiceConnect;

export default OauthService;
