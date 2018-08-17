import { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import TWEEN, { Tween, Easing } from "@tweenjs/tween.js";

class NumberEase extends Component {
  state = {
    value: this.props.value,
    animation: {}
  };

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props.value, prevProps.value)) {
      this.state.animation.stop();
      this.startAnimation(this.state.animation._object.value);
    }
  }

  componentWillUnmount() {
    this.state.animation.stop();
  }

  startAnimation = (value = 0) => {
    let valueToUpdate = { value };
    const animation = new Tween(valueToUpdate)
      .to({ value: this.props.value }, this.props.duration)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        this.setState(valueToUpdate);
      })
      .start();

    this.setState({ animation });
  };

  componentDidMount() {
    this.startAnimation();
  }

  render = () => this.props.format(this.state.value);
}

NumberEase.defaultProps = {
  format: v => v,
  duration: 1000
};

NumberEase.propTypes = {
  format: PropTypes.func,
  value: PropTypes.number.isRequired,
  duration: PropTypes.number
};

export default NumberEase;
