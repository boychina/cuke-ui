import React, { PureComponent } from "react";
import cls from "classnames";
import PropTypes from "prop-types";
import Tooltip from "../tooltip";

export default class Popover extends PureComponent {
  state = {
    visible: this.props.visible || null
  };
  static defaultProps = {
    prefixCls: "cuke-popover",
    position: "top",
    title: "",
    theme: "light",
    trigger: "hover",
    onVisibleChange: () => {}
  };

  static propTypes = {
    prefixCls: PropTypes.string.isRequired,
    onVisibleChange: PropTypes.func,
    title: PropTypes.any,
    content: PropTypes.any,
    position: PropTypes.oneOf(["top", "right", "left", "bottom"]),
    trigger: PropTypes.oneOf(["click", "hover"]),
    theme: PropTypes.oneOf(["light", "dark"])
  };

  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps({ visible }, state) {
    if (!visible && state.visible === null) {
      return {
        visible: false
      };
    }
    return {
      visible
    };
  }

  _onVisibleChange = visible => {
    this.props.onVisibleChange(visible);
  };

  renderContent = () => {
    const { prefixCls, title, content } = this.props;
    return (
      <>
        {title && <div className={`${prefixCls}-title`}>{title}</div>}
        {content && <div className={`${prefixCls}-content`}>{content}</div>}
      </>
    );
  };

  render() {
    const {
      prefixCls,
      className,
      title, // eslint-disable-line
      position,
      theme,
      trigger,
      wrapperClassName,
      onVisibleChange, // eslint-disable-line
      visible, // eslint-disable-line,
      children,
      ...attr
    } = this.props;

    return (
      <div className={cls(prefixCls, className)} {...attr}>
        <Tooltip
          theme={theme}
          visible={visible}
          trigger={trigger}
          title={this.renderContent()}
          position={position}
          onVisibleChange={this._onVisibleChange}
          wrapperClassName={cls(`${prefixCls}-wrapper`, wrapperClassName)}
        >
          {children}
        </Tooltip>
      </div>
    );
  }
}
