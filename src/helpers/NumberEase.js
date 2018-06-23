import { Component } from "react";
import PropTypes from "prop-types";
import anime from "animejs";
import _ from "lodash";

window.anime = anime;

class NumberEase extends Component {
  state = {
    value: this.props.value,
    animation: {}
  };

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(this.props.value, prevProps.value)) {
      this.state.animation.pause();
      this.setState({ value: this.props.value }, () =>
        this.startAnimation(this.state.animation.animations[0].currentValue)
      );
    }
  }

  componentWillUnmount() {
    delete this.timeline;
  }

  timeline = anime.timeline();

  startAnimation = (value = 0) => {
    let myObject = {
      value
    };

    window.t = this.timeline;

    const animation = this.timeline.add({
      targets: myObject,
      value: this.state.value,
      easing: "linear",
      round: 1,
      update: () => {
        this.setState(myObject);
      },
      complete: () => {
        console.log(this.timeline.remove)
      }
    });

    this.setState({ animation });
  };

  componentDidMount() {
    this.startAnimation();
  }

  render = () => this.props.format(this.state.value);
}

NumberEase.defaultProps = {
  format: v => v
};

NumberEase.propTypes = {
  format: PropTypes.func,
  value: PropTypes.number.isRequired
};

export default NumberEase;
