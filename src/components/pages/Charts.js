/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, {Component, Fragment} from 'react';
import {Divider, Page} from '../SpectreCSS';
import _ from 'lodash';
import getRandomSongName from '../../data/randomSongName';
import getRandomBandName from '../../data/randomBandName';
import getRandomName from '../../data/names';

class Charts extends Component {
  constructor(props) {
    super(props);

    this.singleCharts = Array.from(new Array(40), (single, index) => {
      return {
        id: `${index}-cpu`,
        band: getRandomBandName(),
        title: getRandomSongName(),
        quality: _.random(20, 100),
        released: _.random(20, 40),
        sales: _.random(20000, 500000),
        salesLastWeek: _.random(5000, 50000),
        songs: []
      }
    }).sort((a, b) => {
      return a.salesLastWeek === b.salesLastWeek ? 0 : a.salesLastWeek > b.salesLastWeek ? -1 : 1
    });

    this.albumCharts = Array.from(new Array(40), (album, index) => {
      return {
        id: `${index}-cpu`,
        band: getRandomBandName(),
        title: getRandomSongName(),
        quality: _.random(20, 100),
        released: _.random(20, 40),
        sales: _.random(20000, 500000),
        salesLastWeek: _.random(5000, 50000),
        songs: []
      }
    }).sort((a, b) => {
      return a.salesLastWeek === b.salesLastWeek ? 0 : a.salesLastWeek > b.salesLastWeek ? -1 : 1
    });
  }

  render() {
    return(
      <Page centered>
        <h5>Charts</h5>
        <ul className="scrollable">
          {this.albumCharts.map(({id, band, title, salesLastWeek}, index) =>
            <li key={id}>
              #{index + 1}. {title} - {band} <br/> {salesLastWeek.toLocaleString()}
              <Divider/>
            </li>
          )}
        </ul>
      </Page>
    );
  }
}

export default Charts;