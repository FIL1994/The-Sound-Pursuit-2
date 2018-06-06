/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import localForage, { DATA_BAND } from "../data/localForage";

class HasStarted extends Component {
  async componentDidMount() {
    try {
      const value = await localForage.getItem(DATA_BAND);

      if (_.isEmpty(value)) {
        this.props.history.push("/start");
      }
    } catch (err) {
      console.log("Local Forage Error", err);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(HasStarted);
