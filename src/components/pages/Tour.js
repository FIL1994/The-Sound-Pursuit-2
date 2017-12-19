/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Page, Button, Panel} from '../SpectreCSS';
import _ from 'lodash';
import $ from 'jquery';

import {goOnTour} from '../../actions/index';

const ErrorDiv = (props) => {
  return (
    <div {...props} className="form-input-hint is-error text-center"/>
  )
};

class Tour extends Component {
  continents = ["North America", "South America", "Africa", "Australia", "Europe", "Asia"];
  constructor(props) {
    super(props);

    this.validateTour = this.validateTour.bind(this);

    this.state = {
      weeksToTour: 0,
      continentsToTour: 0,
      tourCost: 0, // set when going on tour - used in showing tour results
      errorContinents: null,
      errorVenueSize: null,
      errorWeeksToTour: null
    };
  }

  componentDidMount() {
    $('input[name=venue-size]')[0].checked = true;
    // $('input[name=checkbox-container]')[0].checked = true;
  }

  calcCost(weeksToTour, continentsToTour) {
    const venueSize = Number($('input[name=venue-size]:checked').val());

    return Math.floor(
      weeksToTour * (Math.pow(1.18 * venueSize, 2.15) * 80) * (1 + (continentsToTour * 0.35))
    ) || 0;
  }

  validateTour() {
    const {weeksToTour, continentsToTour} = this.state;
    let errorContinents = null, errorVenueSize = null, errorWeeksToTour = null, continents = [];

    const venueSize = Number($('input[name=venue-size]:checked')[0].value);
    if(!_.isFinite(venueSize)) {
      errorVenueSize = <ErrorDiv>You must select a venue size.</ErrorDiv>;
    }
    if(continentsToTour < 1) {
      errorContinents = <ErrorDiv>You must select at least one continent.</ErrorDiv>;
    } else {
      let checkboxContinent = $('input[name=checkbox-continent]:checked');
      // jQuery has its own map function so Lodash's map function is a good alternative to the unavailable ES6 map
      continents = _.map(checkboxContinent, c => c.dataset.name);
    }
    if(weeksToTour < 2) {
      errorWeeksToTour = <ErrorDiv>You must tour for at least two weeks.</ErrorDiv>;
    }

    if(_.isEmpty(errorVenueSize) && _.isEmpty(errorContinents) && _.isEmpty(errorWeeksToTour)) {
      this.props.goOnTour({weeksToTour, continents, venueSize});
    }

    this.setState({
      errorContinents,
      errorVenueSize,
      errorWeeksToTour
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.tourResults !== this.props.tourResults) {
      console.log("Tour Results", nextProps.tourResults);
    }
  }

  render() {
    const {weeksToTour, continentsToTour, errorContinents, errorVenueSize, errorWeeksToTour} = this.state;

    const minWeeksToTour = continentsToTour * 2;
    if(weeksToTour < minWeeksToTour) {
      setTimeout(() => this.setState({weeksToTour: minWeeksToTour}));
    }

    return(
      <Page centered>
        <Button large primary onClick={this.validateTour}>Go on Tour</Button>
        <br/><br/>
        <Panel>
          <form className="centered col-10">
            <div className={`form-group ${_.isEmpty(errorContinents) ? '' : 'has-error'}`}>
              {
                this.continents.map(continent =>
                  <label key={continent} className="form-checkbox">
                    <input type="checkbox" name="checkbox-continent" id={`checkbox-continent-${continent}`} data-name={continent}
                       onChange={(e) => this.setState({continentsToTour: continentsToTour + (e.target.checked ? 1 : -1) })}
                    />
                    <i className="form-icon"/> {continent}
                  </label>
                )
              }
              {errorContinents}
            </div>
            <div className={`form-group ${_.isEmpty(errorWeeksToTour) ? '' : 'has-error'}`}>
              <label htmlFor="range-weeks-to-tour">Weeks to Tour:</label>
              <input className="slider tooltip" type="range" id="range-weeks-to-tour"
                 min={minWeeksToTour} max={104} value={weeksToTour}
                 onChange={({target: {value}}) => this.setState({weeksToTour: Number(value)})}
              />
              {errorWeeksToTour}
            </div>
            <div className={`form-group ${_.isEmpty(errorVenueSize) ? '' : 'has-error'}`}>
              <div className="form-label">Venue Size:</div>
              {
                ["Small", "Medium", "Large"].map((size, index) =>
                  <label key={size} className="form-radio">
                    <input type="radio" name="venue-size" value={index + 1} onChange={() => this.forceUpdate()}/>
                    <i className="form-icon"/> {size}
                  </label>
                )
              }
              {errorVenueSize}
            </div>
            <div>
              Cost: ${this.calcCost(weeksToTour, continentsToTour).toLocaleString()}
            </div>
          </form>
        </Panel>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    tourResults: state.tourResults
  };
}

export default connect(mapStateToProps, {goOnTour})(Tour);