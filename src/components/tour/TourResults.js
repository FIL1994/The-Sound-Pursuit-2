/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, { Component } from "react";
import PropTypes from "prop-types";

import { Grid } from "../SpectreCSS";
import { NumberEase, formatNumber, formatMoney } from "../../helpers";

const { Column } = Grid;

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

        <Grid style={{ textAlign: "right" }}>
          <Column width={3} />

          <Column width={3}>New Fans:</Column>
          <Column width={3} style={{ textAlign: "left" }}>
            <NumberEase value={newFans} format={formatNumber} />{" "}
          </Column>

          <Column width={3} />
          <Column width={3} />

          <Column width={3}>Tour Cost:</Column>
          <Column width={3} style={{ textAlign: "left" }}>
            <NumberEase value={tourCost} format={formatMoney} />
          </Column>

          <Column width={3} />
          <Column width={3} />

          <Column width={3}>Gross Revenue:</Column>
          <Column width={3} style={{ textAlign: "left" }}>
            <NumberEase value={newCash} format={formatMoney} />
          </Column>

          <Column width={3} />
          <Column width={3} />

          <Column width={3}>Net Revenue: </Column>
          <Column width={3} style={{ textAlign: "left" }}>
            <NumberEase value={newCash - tourCost} format={formatMoney} />
          </Column>

          <Column width={3} />
        </Grid>
      </div>
    );
  }
}

export default TourResults;
