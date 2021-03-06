import React, { PureComponent, createRef } from "react";
import cls from "classnames";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";

export class TooltipPortal extends PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    document.body.appendChild(this.el);
    if (this.props.onChange) {
      this.props.onChange();
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}

const triggerTypes = {
  hover: "hover",
  click: "click"
};
const themes = ["dark", "light"];

export default class Tooltip extends PureComponent {
  closeTimeDelay = 100;
  state = {
    visible: this.props.visible || null,
    left: 0,
    top: 0,
    openLock: false,
    closeLock: false
  };
  static defaultProps = {
    prefixCls: "cuke-tooltip",
    position: "top",
    title: "",
    trigger: triggerTypes.hover,
    theme: themes[0],
    onVisibleChange: () => {}
  };

  static propTypes = {
    prefixCls: PropTypes.string.isRequired,
    onVisibleChange: PropTypes.func,
    title: PropTypes.node,
    trigger: PropTypes.oneOf(Object.values(triggerTypes)),
    position: PropTypes.oneOf(["top", "right", "left", "bottom"]),
    theme: PropTypes.oneOf(themes)
  };

  constructor(props) {
    super(props);
    this.wrapper = createRef();
    this.triggerWrapper = createRef();
    this.toggleContainer = createRef();
    this.closeTimer = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
      openLock: !nextProps.visible,
      closeLock: !nextProps.visible
    });
  }

  getWrapperBounding = () => {
    const {
      width,
      height,
      top,
      left
    } = this.triggerWrapper.current.getBoundingClientRect();
    const {
      height: wrapperHeight,
      width: wrapperWidth
    } = this.wrapper.current.getBoundingClientRect();

    const { scrollX, scrollY } = window;

    const positions = {
      top: {
        top: top + scrollY - wrapperHeight,
        left: left + scrollX + width / 2 - wrapperWidth / 2
      },
      bottom: {
        top: top + height + scrollY,
        left: left + scrollX + width / 2 - wrapperWidth / 2
      },
      left: {
        top: top + scrollY + height / 2 - wrapperHeight / 2,
        left: left + scrollX - wrapperWidth
      },
      right: {
        top: top + scrollY + height / 2 - wrapperHeight / 2,
        left: left + scrollX + width
      }
    };
    return positions[this.props.position];
  };

  setWrapperBounding() {
    const { left, top } = this.getWrapperBounding();
    this.setState({ left, top });
  }

  onClickOutsideHandler = e => {
    e.stopPropagation();
    if (
      this.state.visible &&
      !this.wrapper.current.contains(e.target) &&
      !this.toggleContainer.current.contains(e.target)
    ) {
      this.setState({ visible: false, closeLock: false, openLock: false });
      this.props.onVisibleChange(false);
    }
  };

  onOpenTooltip = () => {
    // 如果 鼠标离开了当前目标 马上 focus 上去 就取消关闭
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
    }
    this.setState({ visible: true, closeLock: false }, () => {
      if (!this.state.openLock) {
        this.setWrapperBounding();
        this.props.onVisibleChange(true);
        this.setState({ openLock: true, closeLock: false });
      }
    });
  };

  onCloseTooltip = () => {
    this.closeTimer = setTimeout(() => {
      this.setState({ visible: false, openLock: false }, () => {
        if (!this.state.closeLock) {
          this.setWrapperBounding();
          this.props.onVisibleChange(false);
          this.setState({ openLock: false, closeLock: true });
        }
      });
    }, this.closeTimeDelay);
  };

  onRestWrapperPosition = () => {
    if (this.state.visible) {
      setTimeout(() => {
        this.setWrapperBounding();
      });
    }
  };

  render() {
    const {
      prefixCls,
      className,
      title,
      theme,
      trigger,
      position,
      wrapperClassName,
      onVisibleChange, // eslint-disable-line
      visible: visibleFromProps, // eslint-disable-line
      ...attr
    } = this.props;
    const { visible, left, top } = this.state;

    const isHover = trigger === triggerTypes["hover"];

    const bindTriggerEvents = isHover
      ? {
          onMouseEnter: this.onOpenTooltip,
          onMouseLeave: this.onCloseTooltip
        }
      : { onClick: this.onOpenTooltip };

    return (
      <div
        className={cls(prefixCls, className)}
        {...attr}
        {...bindTriggerEvents}
        ref={this.toggleContainer}
      >
        <TooltipPortal onChange={this.onRestWrapperPosition}>
          <div
            className={cls(
              `${prefixCls}-wrapper`,
              `${prefixCls}-position-${position}`,
              `${prefixCls}-${theme}`,
              wrapperClassName,
              {
                [`${prefixCls}-show`]: visible,
                [`${prefixCls}-hide`]: !visible,
                [`cuke-ui-no-animate`]: visible === null
              }
            )}
            style={{
              left,
              top
            }}
            ref={this.wrapper}
            onMouseEnter={isHover ? this.onOpenTooltip : undefined}
            onMouseLeave={isHover ? this.onCloseTooltip : undefined}
          >
            {title}
          </div>
        </TooltipPortal>
        <span
          ref={this.triggerWrapper}
          className={cls(`${prefixCls}-trigger-wrapper`)}
        >
          {this.props.children}
        </span>
      </div>
    );
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.onClickOutsideHandler, false);
    this.closeTimer = undefined;
  }
  componentDidMount() {
    window.addEventListener("click", this.onClickOutsideHandler, false);
  }
}
