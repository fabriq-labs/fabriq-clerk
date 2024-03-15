import React, { useState, useEffect } from "react";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Input } from "antd";

function trim(value: any) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.replace(/^\s+|\s+$/g, "");
  return trimmedValue;
}

interface EditInPlaceProps {
  ignoreBlanks?: boolean;
  isEditable?: boolean;
  placeholder?: string;
  value?: string;
  searchTerm?: string;
  onDone: (value: string) => void;
  onStopEditing?: any;
  getQueryList?: (searchTerm: string) => void;
  onRedirectBack?: () => void;
  multiline?: boolean;
  editorProps?: Record<string, any>;
  defaultEditing?: boolean;
  isQuery?: boolean;
  disableLeftView?: boolean;
}

const EditInPlace: React.FC<EditInPlaceProps> = ({
  ignoreBlanks,
  isEditable,
  placeholder,
  value,
  searchTerm,
  onDone,
  onStopEditing,
  getQueryList,
  onRedirectBack,
  multiline,
  editorProps,
  defaultEditing,
  isQuery,
  disableLeftView,
}) => {
  const [editing, setEditing] = useState(defaultEditing);

  useEffect(() => {
    if (!editing) {
      onStopEditing?.();
    }
  }, [editing, onStopEditing]);

  const startEditing = () => {
    if (isEditable) {
      setEditing(true);
    }
  };

  const stopEditing = (currentValue: string) => {
    const newValue = trim(currentValue);
    const ignorableBlank = ignoreBlanks && newValue === "";
    if (!ignorableBlank && newValue !== value) {
      onDone(newValue);

      setTimeout(() => {
        getQueryList?.(searchTerm || "");
      }, 2000);
    }
    setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      stopEditing((event.target as HTMLInputElement).value);
    } else if (event.keyCode === 27) {
      setEditing(false);
    }
  };

  const renderNormal = () =>
    value ? (
      <div
        role="presentation"
        onFocus={startEditing}
        onClick={startEditing}
        className={`edit-container ${isEditable ? "editable" : ""}`}
      >
        <div
          role="presentation"
          className={`editable ${isEditable ? "editable" : ""}`}
        >
          {value}&nbsp;
        </div>
        <EditOutlined />
      </div>
    ) : (
      <a className="clickable" onClick={startEditing}>
        {placeholder}
      </a>
    );

  const renderEdit = () => {
    const InputComponent: any = multiline ? Input.TextArea : Input;
    return (
      <InputComponent
        defaultValue={value}
        onBlur={(e: any) => stopEditing(e.target.value)}
        onPressEnter={handleKeyDown}
        autoFocus
        {...editorProps}
      />
    );
  };

  return (
    <span className={`edit-in-place ${editing ? "active" : ""}`}>
      {!isQuery && !disableLeftView && (
        <div className="left-icon" onClick={onRedirectBack}>
          <ArrowLeftOutlined
            style={{ cursor: "pointer" }}
            onClick={onRedirectBack}
          />
        </div>
      )}
      {editing ? renderEdit() : renderNormal()}
    </span>
  );
};
export default EditInPlace;
