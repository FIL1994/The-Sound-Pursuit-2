/**
 * @author Philip Van Raalte
 * @date 2017-10-19.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import { Button, Divider, Page, Parallax, Toast } from "../SpectreCSS";
import LightSpeed from "react-reveal/LightSpeed";
import Bounce from "react-reveal/Bounce";

import { getBand } from "../../actions";
import { resetDataAsync } from "../../data/resetData";

class MainMenu extends Component {
  state = {
    resettingData: false,
    showToastDeleted: false
  };

  componentDidMount() {
    this.props.getBand();
  }

  resetData = () => {
    this.setState({ resettingData: true });
    resetDataAsync().then(() => {
      this.props.getBand();
      this.setState({ resettingData: false, showToastDeleted: true });
      setTimeout(() => {
        this.setState({
          showToastDeleted: false
        });
      }, 3000);
    });
  };

  render() {
    const { resettingData, showToastDeleted } = this.state;

    const disabledButtonProps = _.isEmpty(this.props.band)
      ? {
          disabled: true,
          tabIndex: "-1"
        }
      : {};

    const resetProps = !resettingData
      ? {
          className: "btn btn-lg btn-primary"
        }
      : {
          className: "btn btn-lg btn-primary loading"
        };

    return (
      <Page centered>
        <h1>
          <LightSpeed left cascade onReveal={() => console.log("Reveal")}>
            The Sound Pursuit 2
          </LightSpeed>
        </h1>
        <Divider />
        <div className="spaced">
          <Bounce left delay={350}>
            <Button
              as={Link}
              to="/dashboard"
              size={8}
              primary
              {...disabledButtonProps}
            >
              Continue
            </Button>
            <Button as={Link} to="/start" size={8} primary>
              Start
            </Button>
            <Button size={8} primary {...resetProps} onClick={this.resetData}>
              Delete Save
            </Button>
          </Bounce>
        </div>
        <br />
        <div className="centered text-center">
          <Parallax className="width-190 centered">
            <img
              src="https://www.newgrounds.com/img/misc/dl-official.gif"
              className="img-responsive rounded"
            />
          </Parallax>
          <br />
          <div>
            <b>Programming:</b>{" "}
            <a href="https://fil1994.newgrounds.com/" target="_blank">
              FIL1994
            </a>
            <br />
            <b>Music:</b>{" "}
            <a href="https://ancientorigin.newgrounds.com/" target="_blank">
              ancientorigin
            </a>
          </div>
        </div>
        {showToastDeleted ? (
          <Toast className="toast-bottom">Save deleted</Toast>
        ) : (
          ""
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    band: state.band
  };
}

export default connect(
  mapStateToProps,
  { getBand }
)(MainMenu);
