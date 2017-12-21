/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Divider, Page, Loading, Button} from '../SpectreCSS';
import _ from 'lodash';
import {getCharts, getBand} from '../../actions';
import {checkNA} from '../../data/util';

class Charts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSingles: true
    };
  }

  componentDidMount() {
    this.props.getCharts();
    this.props.getBand();
  }

  render() {
    const {charts, userBand} = this.props;
    const {showSingles} = this.state;
    let songsOnChart = _.isEmpty(charts) || _.isEmpty(userBand) ? 0 : (
      showSingles
        ?
          _.take(charts.singles, 40).filter(c => c.band === "USER").length
        :
          _.take(charts.albums, 40).filter(c => c.band === "USER").length
    );

    return(
      <Page centered>
        {
          _.isEmpty(charts) || _.isEmpty(userBand)
            ?
             <Fragment>
               Loading Charts
               <Loading large/>
             </Fragment>
            :
            <Fragment>
              <div>{songsOnChart} of your {showSingles ? 'singles' : 'albums'} charted</div>
              <div className="btn-group btn-group-block centered col-4">
                <Button
                  primary={showSingles}
                  onClick={() => this.setState({showSingles: true})}
                >
                  Singles
                </Button>
                <Button
                  primary={!showSingles}
                  onClick={() => this.setState({showSingles: false})}
                >
                  Albums
                </Button>
              </div>
              <ul className="scrollable">
                {_.take((showSingles ? charts.singles : charts.albums), 40).map(
                  ({id, band, title, salesLastWeek, charts: {peak, lastWeek}}, index) => {
                    const isUser = band === "USER";
                    if(isUser) {
                      band = userBand.name;
                    }

                    return (
                      <li key={id} className={isUser ? 'bg-success' : 'bg-dark'}>
                      #{index + 1}. {title} - {band} <br/>
                      Peak: {checkNA(peak)} | Last Week: {checkNA(lastWeek)} | Sales: {salesLastWeek.toLocaleString()}
                      <Divider/>
                    </li>
                    );
                  }
                )}
              </ul>
            </Fragment>
        }
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    charts: state.charts,
    userBand: state.band
  };
}

export default connect(mapStateToProps, {getCharts, getBand})(Charts);