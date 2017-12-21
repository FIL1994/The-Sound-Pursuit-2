/**
 * @author Philip Van Raalte
 * @date 2017-12-19
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Divider, Page, Loading, Button} from '../SpectreCSS';
import _ from 'lodash';
import {getCharts} from '../../actions';

class Charts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSingles: true
    };
  }

  componentDidMount() {
    this.props.getCharts();
  }

  render() {
    const {charts} = this.props;
    const {showSingles} = this.state;
    console.log(charts);

    return(
      <Page centered>
        <h5>Charts</h5>
        {
          _.isEmpty(charts)
            ?
             <Fragment>
               Loading Charts
               <Loading large/>
             </Fragment>
            :
            <Fragment>
              <div className="btn-group btn-group-block centered col-4">
                <Button
                  primary={showSingles}
                  onClick={() => this.setState({showSingles: true})}
                >
                  Single
                </Button>
                <Button
                  primary={!showSingles}
                  onClick={() => this.setState({showSingles: false})}
                >
                  Album
                </Button>
              </div>
              <ul className="scrollable">
                {(showSingles ? charts.singles : charts.albums).map(
                  ({id, band, title, salesLastWeek, charts: {peak, lastWeek}}, index) =>
                  <li key={id}>
                    #{index + 1}. {title} - {band} <br/>
                    Peak: {peak} | Last Week: {lastWeek} | Sales: {salesLastWeek.toLocaleString()}
                    <Divider/>
                  </li>
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
    charts: state.charts
  };
}

export default connect(mapStateToProps, {getCharts})(Charts);