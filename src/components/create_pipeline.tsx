// Create Pipeline
import React, { useState } from "react";
import { Modal, Input } from "antd";
import DynamicComponent from "./dynamic_component";

function CreatePipeline({
  visible,
  savePipeline,
  name,
  isValid,
  handleNameChange,
  close,
}: any) {
  const [saveInProgress, setSaveInProgress] = useState(false);
  const isCreatePipelineEnabled = true;

  async function save() {
    if (name !== "") {
      setSaveInProgress(true);
      if (savePipeline) {
        savePipeline();
      }
    }
  }

  return (
    <Modal
      {...(isCreatePipelineEnabled ? {} : { footer: null })}
      title="New Pipeline"
      okText="Save"
      visible={visible}
      cancelText="Close"
      className="create-pipeline"
      okButtonProps={{
        disabled: !isValid || saveInProgress,
        loading: saveInProgress,
        "data-test": "DashboardSaveButton",
        className: "okay-btn"
      }}
      cancelButtonProps={{
        disabled: saveInProgress,
      }}
      onOk={save}
      onCancel={close}
      closable={!saveInProgress}
      maskClosable={!saveInProgress}
      wrapProps={{
        "data-test": "CreatePipeline",
      }}
    >
      <DynamicComponent
        name="CreatePipelineExtra"
        disabled={!isCreatePipelineEnabled}
      >
        <Input
          defaultValue={name}
          onChange={handleNameChange}
          onPressEnter={save}
          placeholder="Pipeline Name"
          disabled={saveInProgress}
          autoFocus
        />
      </DynamicComponent>
    </Modal>
  );
}

export default CreatePipeline;
