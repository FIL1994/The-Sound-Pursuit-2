/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";

class TourResults extends Component {
  static propTypes = {
    tourResults: PropTypes.shape({
      newCash: PropTypes.number.isRequired,
      newFans: PropTypes.number.isRequired
    }).isRequired,
    tourCost: PropTypes.number.isRequired
  };

  render() {
    const {
      tourCost,
      tourResults: { newCash, newFans }
    } = this.props;

    return (
      <div>
        <h5>Tour Results</h5>
        <p>
          New Fans: {numeral(newFans).format()} <br />
          Tour Cost:{" "}
          {numeral(tourCost).format("$0,0.00")}{" "}
          <br />
          Gross Revenue:{" "}
          {numeral(newCash).format("$0,0.00")}{" "}
          <br />
          Net Revenue:{" "}
          {numeral(newCash - tourCost).format("$0,0.00")}
        </p>
      </div>
    );
  }
}

export default TourResults;
