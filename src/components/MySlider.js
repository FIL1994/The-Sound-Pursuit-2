import React from "react";
import Tooltip from "rc-tooltip";
import Slider, { Handle } from "rc-slider";

import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "rc-pagination/assets/index.css";
import "rc-select/assets/index.css";

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const MySlider = props => {
  return (
    <Slider
      {...props}
      handleStyle={{
        backgroundColor: "#1e5f53",
        borderColor: "white"
      }}
      trackStyle={{ backgroundColor: "#237c70de" }}
      railStyle={{
        backgroundColor: "white",
        boxShadow: "rgba(103, 151, 232, 0.29) 2px 2px 8px 1px"
      }}
      handle={handle}
    />
  );
};

MySlider.propTypes = Slider.propTypes;
MySlider.defaultProps = Slider.defaultProps;

export default MySlider;
