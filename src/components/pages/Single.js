/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Loading, Page, ControlledTab } from "../SpectreCSS";
import _ from "lodash";
import numeral from "numeral";
import { checkNA, weeksToYearsAndWeeks } from "../../data/util";

import { getSongs, getSingles } from "../../actions";

class Single extends Component {
  state = {
    single: undefined
  };

  componentDidMount() {
    this.props.getSongs();
    this.props.getSingles();
  }

  componentDidUpdate() {
    const { songs, singles } = this.props;
    const { single } = this.state;

    if (single === undefined && !_.isEmpty(singles) && !_.isEmpty(songs)) {
      this.findSingle(songs, singles);
    }
  }

  findSingle(songs, singles) {
    const id = parseInt(this.props.match.params.id);

    let single = singles.find(s => s.id === id);

    if (single === undefined) {
      single = null;
    } else {
      single.songs = single.songs.map(si => songs.find(s => s.id === si));
    }

    this.setState({
      single
    });
  }

  render() {
    const { single } = this.state;

    console.log("single", single)

    if (single === undefined) {
      return (
        <Page centered>
          <Loading large />
        </Page>
      );
    } else if (single === null) {
      return (
        <Page centered>
          <p>That single could not be found</p>
        </Page>
      );
    }

    const {
      quality,
      released,
      sales,
      salesLastWeek,
      songs,
      title,
      charts: { peak, lastWeek, thisWeek },
      imgURL
    } = single;

    return (
      <Page centered>
        <h3>{title}</h3>
        <img src={imgURL} height={200} width={200} />
        <ControlledTab
          options={[
            {
              label: "Tracklist",
              value: "tracklist",
              render: () => (
                <p className="scrollable-small" style={{ height: 220 }}>
                  {songs.map(({ id, title }, index) => (
                    <span key={id}>
                      {index + 1}. {title}
                      <br />
                    </span>
                  ))}
                </p>
              )
            },
            {
              label: "Info",
              value: "info",
              render: () => (
                <p>
                  Released: {weeksToYearsAndWeeks(released)} <br />
                  Quality: {quality} <br />
                  Sales: {numeral(sales).format()} <br />
                  Sales Last Week: {numeral(salesLastWeek).format()}
                </p>
              )
            },
            {
              label: "Chart Details",
              value: "chart-details",
              render: () => (
                <p>
                  Peak: {checkNA(peak)} | Last Week: {checkNA(lastWeek)} | This
                  Week: {checkNA(thisWeek)}
                </p>
              )
            }
          ]}
        />
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    songs: state.songs,
    singles: state.singles
  };
}

export default connect(
  mapStateToProps,
  { getSongs, getSingles }
)(Single);
