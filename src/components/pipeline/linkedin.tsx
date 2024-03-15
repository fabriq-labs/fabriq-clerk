// LinkedInPage Component
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { isEmpty } from "lodash";
import { Divider, Button as ButtonComponent, Input, notification } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

import { Label } from "@/components/ui/label";

// Main Component
const LinkedInPageConnect = (props: any) => {
  const { item, pipeline, onMenuItem, loader, setSourceLoader, organization } =
    props;
  const connection = (pipeline && pipeline.connection) || {};
  const [clientIDType, setClientIDType] = useState("password");
  const [clientSecretType, setClientSecretType] = useState("password");
  const [refreshTokenType, setRefreshTokenType] = useState("password");
  const [orgIDType, setOrgIDType] = useState("password");
  const [api, contextHolder] = notification.useNotification();
  const [editFields, setEditFields]: any = useState({
    client_id: false,
    client_secret: false,
    refresh_token: false,
    org_id: false,
  });

  const [state, setState]: any = useState({
    client_id: "",
    client_secret: "",
    refresh_token: "",
    org_id: "",
  });

  const [countNo, setCountNo] = useState(0);
  const [changedFields, setChangedFields] = useState({});

  // Check if connection data is available
  const isConnectionAvailable = connection?.id;

  useEffect(() => {
    if (isConnectionAvailable) {
      // If connection is available, populate input fields with connection data and disable them
      setEditFields({
        client_id: true,
        client_secret: true,
        refresh_token: true,
        org_id: true,
      });
    }
  }, [isConnectionAvailable]);

  const toggleVisibility = (fieldName: any) => {
    if (fieldName === "client_id") {
      setClientIDType(clientIDType === "text" ? "password" : "text");
    } else if (fieldName === "client_secret") {
      setClientSecretType(clientSecretType === "text" ? "password" : "text");
    } else if (fieldName === "refresh_token") {
      setRefreshTokenType(refreshTokenType === "text" ? "password" : "text");
    } else if (fieldName === "org_id") {
      setOrgIDType(orgIDType === "text" ? "password" : "text");
    }
  };

  const handleChange = (value: any, name: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));

    // Update the changedFields state to track the changed field
    setChangedFields((prevChangedFields: any) => ({
      ...prevChangedFields,
      [name]: true,
    }));

    setCountNo(countNo + 1);
  };

  const handleEditClick = (fieldName: any) => {
    if (editFields[fieldName]) {
      // If we were in edit mode and user clicks "Done" without changes
      setEditFields((prevEditFields: any) => ({
        ...prevEditFields,
        [fieldName]: false,
      }));
      setState((prevState: any) => ({
        ...prevState,
        [fieldName]: prevState[fieldName], // Preserve the user's changes
      }));
    } else {
      setEditFields((prevEditFields: any) => ({
        ...prevEditFields,
        [fieldName]: true,
      }));
    }
  };

  const onClickMenuItem = async () => {
    setSourceLoader(true);
    if (connection?.id) {
      if (Object.keys(changedFields)?.length === 0) {
        if (onMenuItem) {
          onMenuItem(item);
        }
      } else {
        const changedFieldsData = Object.keys(changedFields).reduce(
          (result: any, fieldName: any) => {
            result[fieldName] = state[fieldName];
            return result;
          },
          {}
        );
        try {
          const req = {
            data: changedFieldsData,
          };

          const response = await axios.post("/api/connection_update", {
            id: connection?.id,
            reqdata: req,
          });

          if (response?.data?.status === "success") {
            setSourceLoader(false);
            if (onMenuItem) {
              onMenuItem(item);
            }
          }
        } catch (error) {
          setSourceLoader(false);
          api.warning({
            message: "Pipeline Edit",
            description: "Error updating connection details",
          });
        }
      }
    } else {
      const connectionData = {
        client_id: state.client_id,
        client_secret: state.client_secret,
        refresh_token: state.refresh_token,
        org_id: state.org_id,
      };

      let noError = 0;
      if (isEmpty(state.client_id)) {
        noError++;
      }

      if (isEmpty(state.client_secret)) {
        noError++;
      }

      if (isEmpty(state.refresh_token)) {
        noError++;
      }

      if (isEmpty(state.org_id)) {
        noError++;
      }

      if (countNo === 0) {
        if (onMenuItem) {
          onMenuItem(item);
        }
      } else if (noError === 0) {
        const operation = "insertConnection";
        const variables = {
          display_name: `Linkeding_page_${state.client_id}`,
          credentials: connectionData,
          source_id: item.id,
          org_id: organization?.publicMetadata?.fabriq_org_id,
        };
        await axios
          .post("/api/pipeline", {
            operation,
            variables,
          })
          .then(async (res: any) => {
            const { data } = res;
            if (data?.data?.insert_connection.returning?.[0]) {
              const connectionItem = data.data.insert_connection.returning[0];

              await axios.post("/api/pipeline", {
                operation: "connectionPipelineUpdate",
                variables: {
                  id: pipeline.id,
                  connection_id: connectionItem.id,
                  org_id: organization?.publicMetadata?.fabriq_org_id,
                },
              });

              if (onMenuItem) {
                setSourceLoader(false);
                onMenuItem(item);
              }
            }
          });
      } else {
        setSourceLoader(false);
        api.warning({
          message: "Pipeline Edit",
          description: "Please update all the required values",
        });
      }
    }
  };

  const handleClickBack = () => {
    if (onMenuItem) {
      onMenuItem(item);
    }
  };

  const renderInputField = (fieldName: string, label: string, type: string) => (
    <div className="form-row" key={fieldName}>
      <Label className="linked-title">{label}</Label>
      <div className="linked-row">
        {!editFields?.[fieldName] ? (
          <Input.Password
            type={type}
            value={state[fieldName]}
            name={fieldName}
            className={`input-linkedin ${isConnectionAvailable ? "" : "full"}`}
            onChange={(e) => handleChange(e.target.value, fieldName)}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onPressEnter={() => toggleVisibility(fieldName)}
          />
        ) : (
          <Input value={"*********"} disabled className="input-linkedin" />
        )}
        {isConnectionAvailable && (
          <ButtonComponent onClick={() => handleEditClick(fieldName)}>
            {editFields[fieldName] ? "Edit" : "Done"}
          </ButtonComponent>
        )}
      </div>
    </div>
  );

  return (
    <div className="wrapper">
      <div className="content-pipeline">
        {renderInputField("client_id", "Client ID", clientIDType)}
        {renderInputField("client_secret", "Client Secret", clientSecretType)}
        {renderInputField("refresh_token", "Refresh Token", refreshTokenType)}
        <Divider dashed />
        {renderInputField("org_id", "Organization ID", orgIDType)}
        <div className="button-row">
          <div className="right-btn">
            <ButtonComponent loading={loader} onClick={handleClickBack}>
              Cancel
            </ButtonComponent>
          </div>
          <ButtonComponent onClick={onClickMenuItem} loading={loader}>
            Save
          </ButtonComponent>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

// Main Component
const LinkedInPage = (props: any) => {
  const { children } = props;

  return children;
};

LinkedInPage.Connect = LinkedInPageConnect;

LinkedInPage.propTypes = {
  children: PropTypes.node,
};

LinkedInPage.defaultProps = {
  children: null,
};

export default LinkedInPage;
