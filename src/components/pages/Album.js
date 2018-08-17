/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Page, Loading, ControlledTab } from "../SpectreCSS";
import _ from "lodash";
import numeral from "numeral";
import { checkNA, weeksToYearsAndWeeks } from "../../data/util";

import { getSongs, getAlbums } from "../../actions";

class Album extends Component {
  state = {
    album: undefined
  };

  componentDidMount() {
    this.props.getSongs();
    this.props.getAlbums();
  }

  componentDidUpdate() {
    const { songs, albums } = this.props;
    const { album } = this.state;

    if (album === undefined && !_.isEmpty(albums) && !_.isEmpty(songs)) {
      this.findAlbum(songs, albums);
    }
  }

  findAlbum(songs, albums) {
    const id = parseInt(this.props.match.params.id);

    let album = albums.find(a => a.id === id);

    if (album === undefined) {
      album = null;
    } else {
      album.songs = album.songs.map(si => songs.find(s => s.id === si));
    }

    this.setState({
      album
    });
  }

  render() {
    const { album } = this.state;

    console.log("album", album);

    if (album === undefined) {
      return (
        <Page centered>
          <Loading large />
        </Page>
      );
    } else if (album === null) {
      return (
        <Page centered>
          <p>That album could not be found</p>
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
    } = album;

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
    albums: state.albums
  };
}

export default connect(
  mapStateToProps,
  { getSongs, getAlbums }
)(Album);
