/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import $ from "jquery";
import _ from "lodash";
import { Page, Button, EmptyState } from "../SpectreCSS";
import getRandomSongName from "../../data/randomSongName";
import {
  getBand,
  getCash,
  saveCash,
  getSongs,
  writeSong,
  deleteSong,
  updateSong,
  getWeek,
  nextWeek
} from "../../actions";
import studios from "../../data/studios";
import { unlockWriteSong, unlockRecordSong } from "../../ng/UnlockMedals";
import { weeksToYearsAndWeeks } from "../../data/util";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import numeral from "numeral";

class Songs extends Component {
  state = {
    errorRecording: null,
    studioID: 0,
    column: "written",
    sortAsc: false
  };

  componentDidMount() {
    this.props.getBand();
    this.props.getSongs();
    this.props.getCash();
    this.props.getWeek();
  }

  componentDidUpdate() {
    // fixes bug where window scrolls down
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  handleSort = clickedColumn => {
    let { column, sortAsc } = this.state;

    if (column !== clickedColumn) {
      sortAsc = true;
    } else {
      sortAsc = !sortAsc;
    }

    this.setState({
      column: clickedColumn,
      sortAsc
    });
  };

  sortSongs = () => {
    let { songs } = this.props;
    const { column, sortAsc } = this.state;

    return _.orderBy(songs, [column], [sortAsc ? "asc" : "desc"]);
  };

  writeSongSubmit = () => {
    let txtSongName = $("#txtSongName");
    if (_.isEmpty(this.props.band)) {
      return;
    }
    let songTitle = txtSongName.val();

    if (_.isEmpty(songTitle)) {
      songTitle = getRandomSongName();
    } else {
      txtSongName.val("");
    }

    songTitle = _.truncate(songTitle, { length: 30 });

    const leadMember = _.cloneDeep(this.props.band.leadMember);
    let members = _.cloneDeep(this.props.band.members);

    members.push(leadMember);
    let maxSongwriting = 0,
      sumSongwriting = 0;
    members.forEach(({ skills: { songwriting } }) => {
      if (songwriting > maxSongwriting) {
        maxSongwriting = songwriting;
      }
      sumSongwriting += songwriting;
    });
    const avgSongwriting = sumSongwriting / members.length;

    if (maxSongwriting > 98) {
      maxSongwriting += 2;
    }

    const song = {
      title: songTitle,
      quality: Number(
        _.random(avgSongwriting, maxSongwriting, true).toFixed(2)
      ),
      recording: null,
      single: null, // id of single
      album: null, // id of album
      written: this.props.week
    };

    setTimeout(unlockWriteSong);
    this.props.writeSong(song);
    this.props.nextWeek();
  };

  editSongSubmit = () => {
    let id,
      txtNewSongName = $("#txtNewSongName");
    try {
      id = Number(txtNewSongName.data().id);
    } catch (e) {
      return;
    }
    if (!_.isNumber(id)) {
      console.log("id not a number", id);
      return;
    }

    const { songs } = this.props;
    let songTitle = txtNewSongName.val();

    let song = _.find(songs, s => {
      return s.id === id;
    });
    if (_.isEmpty(song)) {
      return;
    }

    if (_.isEmpty(songTitle)) {
      songTitle = getRandomSongName();
    }

    song.title = songTitle;
    this.props.updateSong(song);
  };

  recordSongSubmit = () => {
    if (this.state.errorRecording) {
      return;
    }
    let { cash } = this.props;
    let id,
      selectStudio = $("#selectStudio");
    let studioID = selectStudio.val();
    try {
      id = Number(selectStudio.data().id);
    } catch (e) {
      return;
    }
    if (!_.isNumber(id)) {
      console.log("id not a number", id);
      return;
    }
    const studio = studios[studioID];
    if (studio.cost > cash) {
      return;
    } else {
      cash -= studio.cost;
    }

    const {
      songs,
      band: { leadMember, members }
    } = this.props;

    let song = _.find(songs, s => {
      return s.id === id;
    });
    if (_.isEmpty(song)) {
      return;
    }

    let maxSkill = 0,
      sumSkill = 0,
      avgSkill;

    [...members, leadMember].forEach(({ skills: { studio, musicianship } }) => {
      const skill = (studio * 3 + musicianship) / 4;
      if (skill > maxSkill) {
        maxSkill = skill;
      }
      sumSkill += skill;
    });

    avgSkill = sumSkill / members.length + 1;

    //calculate recording quality
    let quality = (_.random(avgSkill, maxSkill) + studio.quality) / 2;
    quality = Number(quality.toFixed(2));
    song.recording = quality;

    setTimeout(unlockRecordSong);
    this.props.saveCash(cash);
    this.props.updateSong(song);
    this.props.nextWeek();
  };

  renderModalWriteSong() {
    return (
      <div id="modal-write-song" className="modal modal-sm">
        <a href="#page-songs" className="modal-overlay" aria-label="Close" />
        <form
          className="modal-container"
          onSubmit={this.writeSongSubmit}
          action="#page-songs"
        >
          <div className="modal-header">
            <a
              href="#page-songs"
              className="btn btn-clear float-right"
              aria-label="Close"
            />
            <div className="modal-title h5 text-center">Write a Song</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <div className="form-group">
                <div className="input-group col-9">
                  <input
                    id="txtSongName"
                    className="form-input"
                    placeholder="Song Name"
                    type="text"
                  />
                  <Button
                    className="input-group-btn"
                    onClick={() => $("#txtSongName").val(getRandomSongName())}
                  >
                    Random
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="#page-songs"
              onClick={this.writeSongSubmit}
              className="btn btn-primary"
            >
              Submit
            </a>
            <a href="#page-songs" className="btn btn-link">
              Close
            </a>
          </div>
        </form>
      </div>
    );
  }

  renderModalEditSong = () => {
    return (
      <div id="modal-edit-song" className="modal modal-sm">
        <a href="#page-songs" className="modal-overlay" aria-label="Close" />
        <form
          className="modal-container"
          onSubmit={this.editSongSubmit}
          action="#page-songs"
        >
          <div className="modal-header">
            <a
              href="#page-songs"
              className="btn btn-clear float-right"
              aria-label="Close"
            />
            <div className="modal-title h5 text-center">Edit Song</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <div className="form-group">
                <div className="input-group">
                  <input
                    id="txtNewSongName"
                    className="form-input"
                    type="text"
                  />
                  <Button
                    className="input-group-btn"
                    onClick={() =>
                      $("#txtNewSongName").val(getRandomSongName())
                    }
                  >
                    Random
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="#page-songs"
              onClick={this.editSongSubmit}
              className="btn btn-primary"
            >
              Submit
            </a>
            <a href="#page-songs" className="btn btn-link">
              Close
            </a>
          </div>
        </form>
      </div>
    );
  };

  validateStudioSelect = (event, initialCheck) => {
    let studioID,
      errorRecording = null;

    try {
      studioID = event.target.value;
    } catch (e) {
      studioID = Number($("#selectStudio").val());
    }

    if (_.isNaN(studioID)) {
      return;
    }

    if (studios[studioID].cost > this.props.cash) {
      errorRecording = "You don't have enough cash.";
    }

    if (
      (_.isBoolean(initialCheck) ? !initialCheck : true) &&
      studioID !== this.state.studioID
    ) {
      this.setState({
        studioID
      });
    }

    return errorRecording;
  };

  renderModalRecordSong = () => {
    const errorRecording = this.validateStudioSelect(null, true);
    const buttonSubmitProps = errorRecording
      ? {
          className: "btn btn-primary disabled",
          disabled: true,
          tabIndex: "-1"
        }
      : {
          className: "btn btn-primary"
        };

    return (
      <div id="modal-record-song" className="modal modal-sm">
        <a href="#page-songs" className="modal-overlay" aria-label="Close" />
        <form
          className="modal-container"
          onSubmit={this.recordSongSubmit}
          action="#page-songs"
        >
          <div className="modal-header">
            <a
              href="#page-songs"
              className="btn btn-clear float-right"
              aria-label="Close"
            />
            <div className="modal-title h5 text-center">Record Song</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <div className="form-group">
                <label htmlFor="#selectStudio">Select Studio:</label>
                <div className="custom-select">
                  <select
                    id="selectStudio"
                    className={`form-select ${
                      errorRecording ? "is-error" : ""
                    }`}
                    onChange={this.validateStudioSelect}
                  >
                    {studios.map(({ name }, index) => {
                      return (
                        <option key={name} value={index}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="form-input-hint">{errorRecording}</div>
              </div>
              <div>
                Cost:{" "}
                {numeral(studios[this.state.studioID].cost).format("$0,0.00")}{" "}
                <br />
                Quality: {studios[this.state.studioID].quality}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="#page-songs"
              onClick={this.recordSongSubmit}
              {...buttonSubmitProps}
            >
              Submit
            </a>
            <a href="#page-songs" className="btn btn-link">
              Close
            </a>
          </div>
        </form>
      </div>
    );
  };

  renderEmpty() {
    return (
      <Fragment>
        <br />
        <EmptyState
          icon={<FontAwesomeIcon icon="music" size="4x" />}
          title="You haven't written any songs yet"
        />
      </Fragment>
    );
  }

  renderIcon = (thisColumn, isString) => {
    const { column, sortAsc } = this.state;
    let className = "sort";

    if (thisColumn === column) {
      if (isString) {
        className = sortAsc ? "sort-alpha-down" : "sort-alpha-up";
      } else {
        className = sortAsc ? "sort-numeric-down" : "sort-numeric-up";
      }
    }

    return <FontAwesomeIcon icon={className} />;

    // return <i className={className} aria-hidden="true" />;
  };

  getUsableSongs(songs) {
    try {
      songs = songs.filter(({ single, album }) => {
        return !(_.isNumber(single) || _.isNumber(album));
      });
    } catch (e) {
      songs = [];
    }

    return songs;
  }

  renderSongList = () => {
    let songs = this.getUsableSongs(this.sortSongs());

    if (songs.length < 1) {
      return (
        <EmptyState
          icon={<FontAwesomeIcon icon="pencil-alt" size="4x" />}
          title="You don't have any unreleased songs"
        />
      );
    }

    return (
      <table className="table table-striped table-hover text-center scrollable-table">
        <thead>
          <tr>
            <th
              className="c-hand"
              onClick={() => {
                this.handleSort("title");
              }}
            >
              {`Title `}
              {this.renderIcon("title", true)}
            </th>
            <th
              className="c-hand"
              onClick={() => {
                this.handleSort("written");
              }}
            >
              {`Written `}
              {this.renderIcon("written", false)}
            </th>
            <th
              className="c-hand"
              onClick={() => {
                this.handleSort("quality");
              }}
            >
              {`Quality `}
              {this.renderIcon("quality", false)}
            </th>
            <th
              className="c-hand"
              onClick={() => {
                this.handleSort("recording");
              }}
            >
              {`Recording `}
              {this.renderIcon("recording", false)}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs.map(s => {
            return (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{weeksToYearsAndWeeks(s.written)}</td>
                <td>{s.quality}</td>
                <td>{s.recording}</td>
                <td>
                  <div className="btn-group">
                    <a
                      href="#modal-edit-song"
                      className="btn"
                      onClick={() => {
                        let txtNewSongName = $("#txtNewSongName");
                        txtNewSongName.val(s.title);
                        txtNewSongName.data("id", s.id);
                      }}
                    >
                      Edit
                    </a>
                    <Button onClick={() => this.props.deleteSong(s.id)}>
                      Delete
                    </Button>
                    <a
                      href="#modal-record-song"
                      className="btn"
                      onClick={() => {
                        $("#selectStudio").data("id", s.id);
                      }}
                    >
                      Record
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  render() {
    const { songs } = this.props;
    const usableSongs = this.getUsableSongs(songs);

    return (
      <Page id="page-songs">
        <div className="centered text-center">
          <div className="columns">
            <a href="#modal-write-song" className="column col-4 col-mx-auto">
              <Button block primary large>
                Write Song
              </Button>
            </a>
          </div>
          {this.renderModalWriteSong()}
          {this.renderModalEditSong()}
          {this.renderModalRecordSong()}
        </div>
        {_.isEmpty(songs) ? (
          this.renderEmpty()
        ) : (
          <div className="col-12 centered">
            <p className="text-left">Unreleased Songs: {usableSongs.length}</p>
            <div /*className="scrollable"*/>{this.renderSongList()}</div>
          </div>
        )}
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    band: state.band,
    songs: state.songs,
    cash: state.cash,
    week: state.week
  };
}

export default connect(mapStateToProps, {
  getBand,
  getCash,
  saveCash,
  getSongs,
  writeSong,
  updateSong,
  deleteSong,
  getWeek,
  nextWeek
})(Songs);
