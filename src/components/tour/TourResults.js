/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

class TourResults extends Component {
  static propTypes = {
    tourResults: PropTypes.shape({
      newCash: PropTypes.number.isRequired,
      newFans: PropTypes.number.isRequired
    }).isRequired,
    tourCost: PropTypes.number.isRequired
  };

  render() {
    const {tourCost, tourResults: {newCash, newFans}} = this.props;

    return (
      <div>
        <h5>Tour Results</h5>
        <p>
          New Fans: {Math.ceil(newFans)} <br/>
          Tour Cost: ${tourCost.toLocaleString(undefined, {minimumFractionDigits: 2})} <br/>
          Gross Revenue: ${newCash.toLocaleString(undefined, {minimumFractionDigits: 2})} <br/>
          Net Revenue: ${(newCash - tourCost).toLocaleString(undefined, {minimumFractionDigits: 2})}
        </p>
      </div>
    );
  }
}

export default TourResults;