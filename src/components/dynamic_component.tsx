import { isFunction, isString } from "lodash";
import React from "react";
import PropTypes from "prop-types";

const componentsRegistry = new Map();
const activeInstances = new Set();

export function registerComponent(name: any, component: any) {
  if (isString(name) && name !== "") {
    componentsRegistry.set(name, isFunction(component) ? component : null);
    // Refresh active DynamicComponent instances which use this component
    activeInstances.forEach((dynamicComponent: any) => {
      if (dynamicComponent.props.name === name) {
        dynamicComponent.forceUpdate();
      }
    });
  }
}

export function unregisterComponent(name: any) {
  registerComponent(name, null);
}

export default class DynamicComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    children: null,
    disabled: PropTypes.bool
  };

  componentDidMount() {
    activeInstances.add(this);
  }

  componentWillUnmount() {
    activeInstances.delete(this);
  }

  render() {
    const { name, children, ...props }: any = this.props;
    const RealComponent = componentsRegistry.get(name);
    if (!RealComponent) {
      return children;
    }
    return <RealComponent {...props}>{children}</RealComponent>;
  }
}
