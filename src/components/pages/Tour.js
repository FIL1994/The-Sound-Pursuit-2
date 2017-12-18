/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {Page, Button, Panel} from '../SpectreCSS';
import _ from 'lodash';
import $ from 'jquery';

class Tour extends Component {
  continents = ["North America", "South America", "Africa", "Australia", "Europe", "Asia"];
  constructor(props) {
    super(props);

    this.state = {
      weeksToTour: 0,
      continentsToTour: 0
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

  render() {
    const {weeksToTour, continentsToTour} = this.state;

    const minWeeksToTour = continentsToTour * 2;
    if(weeksToTour < minWeeksToTour) {
      setTimeout(() => this.setState({weeksToTour: minWeeksToTour}));
    }

    return(
      <Page centered>
        <Button large primary>Go on Tour</Button>
        <br/><br/>
        <Panel>
          <form className="centered col-10">
            <div className="form-group">
              {
                this.continents.map(continent =>
                  <label key={continent} className="form-checkbox">
                    <input type="checkbox" name="checkbox-container" id={`checkbox-continent-${continent}`}
                       onChange={(e) => this.setState({continentsToTour: continentsToTour + (e.target.checked ? 1 : -1) })}
                    />
                    <i className="form-icon"/> {continent}
                  </label>
                )
              }
            </div>
            <label htmlFor="range-weeks-to-tour">Weeks to Tour:</label>
            <input className="slider tooltip" type="range" id="range-weeks-to-tour"
               min={minWeeksToTour} max={104} value={weeksToTour}
               onChange={({target: {value: weeksToTour}}) => this.setState({weeksToTour})}
            />
            <div className="form-group">
              <div className="form-label">Venue Size:</div>
              {
                ["Small", "Medium", "Large"].map((size, index) =>
                  <label key={size} className="form-radio">
                    <input type="radio" name="venue-size" value={index + 1} onChange={() => this.forceUpdate()}/>
                    <i className="form-icon"/> {size}
                  </label>
                )
              }
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

export default Tour;