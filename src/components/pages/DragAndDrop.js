/**
 * @author Philip Van Raalte
 * @date 2017-12-14
 */
import React, { Component, Fragment } from "react";
import update from "immutability-helper";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import numeral from "numeral";

import $ from "jquery";
import _ from "lodash";
import { Page, Button, Loading, EmptyState } from "../SpectreCSS";
import {
  getBand,
  getCash,
  saveCash,
  getSongs,
  updateSong,
  saveSongs,
  getSingles,
  addSingle,
  getAlbums,
  addAlbum,
  removeCash,
  nextWeek,
  getWeek
} from "../../actions";
import getRandomSongName from "../../data/randomSongName";
import producers from "../../data/producers";

import Container from "../drag_and_drop/Container";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { unlockReleaseAlbum, unlockReleaseSingle } from "../../ng/UnlockMedals";
import ErrorDiv from "../ErrorDiv";
import { ImageURL } from "../../data/util";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

const ErrorWrapper = props => {
  return (
    <div
      className={`form-group has-error small-top-margin ${props.className ||
        ""}`}
    >
      <ErrorDiv {...props} />
    </div>
  );
};

class DragAndDrop extends Component {
  state = {
    isSingle: true,
    producerID: null,
    errorProducer: null,
    errorSingle: null,
    errorAlbum: null,
    finished: null,
    unusedSongs: [],
    unusedSongsCount: 0,
    releaseSongsCount: 0,
    containerKey: 0
  };

  // region Lifecycle Methods
  componentDidMount() {
    this.props.getBand();
    this.props.getSingles();
    this.props.getAlbums();
    this.props.getSongs();
    this.props.getCash();
    this.props.getWeek();
  }

  componentDidUpdate(prevProps, prevState) {
    setTimeout(this.getUnusedSongsCount);

    // if isSingle was changed, reset the containers so there are no songs in songsToRelease
    if (prevState.isSingle !== this.state.isSingle) {
      this.resetContainers();
    }
  }
  // endregion

  getSongsEligibleForSingle = songs => {
    try {
      songs = songs.filter(s => {
        // return songs that are recorded and not on a single
        return !_.isNumber(s.single) && _.isNumber(s.recording);
      });
    } catch (e) {
      songs = [];
    }

    return songs;
  };

  getSongsEligibleForAlbum = songs => {
    try {
      songs = songs.filter(s => {
        // return songs that are recorded and not on an album
        return !_.isNumber(s.album) && _.isNumber(s.recording);
      });
    } catch (e) {
      songs = [];
    }

    return songs;
  };

  checkEnoughCash = cost => cost <= this.props.cash;

  // region Producers
  changedProducer = isSingle => {
    let producerID = $("input[name=producers]:checked").val();
    producerID = Number(producerID);
    isSingle = _.isBoolean(isSingle) ? isSingle : this.state.isSingle;

    if (_.isFinite(producerID)) {
      let errorProducer = null;
      const {
        name,
        cost: { single, album }
      } = producers[producerID];
      const hasEnoughCash = this.checkEnoughCash(isSingle ? single : album);
      if (!hasEnoughCash) {
        errorProducer = `You don't have enough cash to hire ${name}`;
      }

      if (
        this.state.producerID !== producerID ||
        errorProducer !== this.state.errorProducer
      ) {
        this.setState({
          producerID,
          errorProducer
        });
      }
    }
  };

  renderProducers = () => {
    const { errorProducer } = this.state;
    return (
      <Fragment>
        <div
          className={`form-group centered text-center ${
            !_.isEmpty(errorProducer) ? "has-error" : ""
          }`}
          onChange={this.changedProducer}
        >
          <label className="form-label small-top-margin">
            Select a producer:
          </label>
          {producers.map(({ name }, index) => {
            return (
              <label className="form-radio small-top-margin" key={index}>
                <input type="radio" name="producers" value={index} />
                <i className="form-icon" /> {name}
              </label>
            );
          })}
        </div>
        {errorProducer}
      </Fragment>
    );
  };

  renderProducerDetails = () => {
    const { producerID, isSingle } = this.state;
    if (!_.isNumber(producerID)) {
      return;
    }
    const producer = producers[producerID];
    return (
      <div className="text-center small-top-margin">
        Quality: {producer.quality} | Cost:{" "}
        {numeral(isSingle ? producer.cost.single : producer.cost.album).format(
          "$0,0.00"
        )}
      </div>
    );
  };

  changedProducer = isSingle => {
    let producerID = $("input[name=producers]:checked").val();
    producerID = Number(producerID);
    isSingle = _.isBoolean(isSingle) ? isSingle : this.state.isSingle;

    if (_.isFinite(producerID)) {
      let errorProducer = null;
      const {
        name,
        cost: { single, album }
      } = producers[producerID];
      const hasEnoughCash = this.checkEnoughCash(isSingle ? single : album);
      if (!hasEnoughCash) {
        errorProducer = `You don't have enough cash to hire ${name}`;
      }

      if (
        this.state.producerID !== producerID ||
        errorProducer !== this.state.errorProducer
      ) {
        this.setState({
          producerID,
          errorProducer
        });
      }
    }
  };
  // endregion

  // region Drag and Drop
  pushCard(card) {
    this.setState(
      update(this.state, {
        unusedSongs: {
          $push: [card]
        }
      })
    );
  }

  removeCard(index) {
    this.setState(
      update(this.state, {
        unusedSongs: {
          $splice: [[index, 1]]
        }
      })
    );
  }

  moveCard(dragIndex, hoverIndex) {
    const { unusedSongs } = this.state;
    const dragCard = unusedSongs[dragIndex];

    this.setState(
      update(this.state, {
        releaseSongs: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    );
  }

  pushCardRelease(card) {
    this.setState(
      update(this.state, {
        releaseSongs: {
          $push: [card]
        }
      })
    );
  }

  removeCardRelease(index) {
    this.setState(
      update(this.state, {
        releaseSongs: {
          $splice: [[index, 1]]
        }
      })
    );
  }

  moveCardRelease(dragIndex, hoverIndex) {
    const { unusedSongs } = this.state;
    const dragCard = unusedSongs[dragIndex];

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    );
  }

  getSongsToReleaseCount = () => {
    let releaseSongsCount = 0;
    try {
      releaseSongsCount = this.songsToRelease.handler.component.state.cards
        .length;
    } catch (e) {
      console.log(e);
      releaseSongsCount = 0;
    }

    if (this.state.releaseSongsCount !== releaseSongsCount) {
      this.setState({
        releaseSongsCount
      });
    }
  };

  getUnusedSongsCount = () => {
    let unusedSongsCount = 0;
    try {
      unusedSongsCount = this.songsList.handler.component.state.cards.length;
    } catch (e) {
      unusedSongsCount = 0;
    }

    if (this.state.unusedSongsCount !== unusedSongsCount) {
      this.setState({
        unusedSongsCount
      });
    }
  };

  getMaxSongs = () => (this.state.isSingle ? 3 : 16);

  resetContainers = () => {
    this.setState({
      containerKey: this.state.containerKey + 1,
      errorSingle: null,
      errorAlbum: null
    });
    setTimeout(() => {
      this.getUnusedSongsCount();
      this.getSongsToReleaseCount();
    });
  };
  // endregion

  validateAlbum = () => {
    let errorProducer = null,
      errorAlbum = null,
      producer,
      cost;
    // album title
    let albumTitle = $("#txtAlbumTitle").val();
    if (_.isEmpty(albumTitle)) {
      albumTitle = getRandomSongName();
    }

    let cards;
    // check song selection
    try {
      cards = this.songsToRelease.handler.component.state.cards;
      if (cards.length < 8) {
        errorAlbum = (
          <ErrorWrapper>
            You must select at least 8 songs.<br />You selected {cards.length}.
          </ErrorWrapper>
        );
      } else if (cards.length > 16) {
        errorAlbum = (
          <ErrorWrapper>
            You can select a maximum of 16 songs.<br />You selected{" "}
            {cards.length}.
          </ErrorWrapper>
        );
      }
    } catch (e) {
      console.log(e);
      return;
    }

    // producer select
    const producerID = Number($("input[name=producers]:checked").val());
    if (_.isFinite(producerID)) {
      producer = producers[producerID];
      cost = producer.cost.album;

      // enough cash check
      if (!this.checkEnoughCash(cost)) {
        errorProducer = (
          <ErrorWrapper>
            {" "}
            You don't have enough cash to hire {producer.name}
          </ErrorWrapper>
        );
      }
    } else {
      errorProducer = <ErrorWrapper>You must select a producer</ErrorWrapper>;
    }

    // if no errors
    if (_.isEmpty(errorProducer) && _.isEmpty(errorAlbum)) {
      // calculate quality
      const { songs } = this.props;

      let sumQuality = 0,
        avgQuality,
        quality;
      cards.forEach(({ id }) => {
        const { quality, recording } = songs.find(s => s.id === id);
        sumQuality += (quality * 3 + recording * 2) / 5;
      });
      avgQuality = sumQuality / cards.length;
      quality = (avgQuality * 5 + producer.quality) / 6;
      quality = Number(quality.toFixed(2));

      let album = {
        band: "USER",
        title: albumTitle,
        songs: cards.map(c => c.id),
        released: this.props.week,
        quality,
        imgURL: ImageURL.getURL(),
        sales: 0,
        salesLastWeek: 0,
        charts: {
          peak: -1,
          lastWeek: -1,
          thisWeek: -1
        }
      };

      this.changedProducer(false); // isSingle = false
      this.props.removeCash(cost);

      // get album id and save songs
      this.props.addAlbum(album).then(() =>
        this.props.getAlbums().then(() => {
          let { albums, songs } = this.props;
          const album = _.maxBy(albums, "released");

          album.songs.forEach(s => {
            const songIndex = _.findIndex(songs, { id: s });
            songs[songIndex].album = album.id;
          });

          setTimeout(unlockReleaseAlbum);
          this.props
            .saveSongs(songs)
            .then(() =>
              this.props
                .nextWeek()
                .then(() => this.setState({ finished: "album" }))
            );
        })
      );

      this.resetContainers();
    }

    this.setState({
      errorProducer,
      errorAlbum
    });
  };

  validateSingle = () => {
    let errorProducer = null,
      errorSingle = null,
      producer,
      cost;

    let cards;
    // check song selection
    try {
      cards = this.songsToRelease.handler.component.state.cards;
      if (cards.length < 1) {
        errorSingle = (
          <ErrorWrapper>You must select at least 1 song.</ErrorWrapper>
        );
      } else if (cards.length > 3) {
        errorSingle = (
          <ErrorWrapper>
            You can select a maximum of 3 songs.<br />You selected{" "}
            {cards.length}.
          </ErrorWrapper>
        );
      }
    } catch (e) {
      console.log(e);
      return;
    }

    // producer select
    const producerID = Number($("input[name=producers]:checked").val());
    if (_.isFinite(producerID)) {
      producer = producers[producerID];
      cost = producer.cost.single;

      // enough cash check
      if (!this.checkEnoughCash(cost)) {
        errorProducer = (
          <ErrorWrapper>
            You don't have enough cash to hire {producer.name}
          </ErrorWrapper>
        );
      }
    } else {
      errorProducer = <ErrorWrapper>You must select a producer</ErrorWrapper>;
    }
    // if no errors
    if (_.isEmpty(errorProducer) && _.isEmpty(errorSingle)) {
      // calculate quality
      const { songs } = this.props;

      let sumQuality = 0,
        avgQuality,
        quality;
      cards.forEach(({ id }) => {
        const { quality, recording } = songs.find(s => s.id === id);
        sumQuality += (quality * 3 + recording * 2) / 5;
      });
      avgQuality = sumQuality / cards.length;
      quality = (avgQuality * 5 + producer.quality) / 6;
      quality = Number(quality.toFixed(2));

      let single = {
        band: "USER",
        title: songs.find(s => s.id === cards[0].id).title,
        songs: cards.map(c => c.id),
        released: this.props.week,
        quality,
        imgURL: ImageURL.getURL(),
        sales: 0,
        salesLastWeek: 0,
        charts: {
          peak: -1,
          lastWeek: -1,
          thisWeek: -1
        }
      };

      this.changedProducer(true); // isSingle = true
      this.props.removeCash(cost);

      // get album id and save songs
      this.props.addSingle(single).then(() =>
        this.props.getSingles().then(() => {
          let { singles, songs } = this.props;
          const single = _.maxBy(singles, "released");

          single.songs.forEach(s => {
            const songIndex = _.findIndex(songs, { id: s });
            songs[songIndex].single = single.id;
          });

          setTimeout(unlockReleaseSingle);
          this.props
            .saveSongs(songs)
            .then(() =>
              this.props
                .nextWeek()
                .then(() => this.setState({ finished: "single" }))
            );
        })
      );

      this.resetContainers();
    }

    this.setState({
      errorProducer,
      errorSingle
    });
  };

  checkFinished = () => {
    const { finished } = this.state;
    if (!_.isEmpty(finished)) {
      if (finished === "album") {
        this.props.history.push({
          pathname: "/records",
          search: "?showAlbum=true"
        });
      } else if (finished === "single") {
        this.props.history.push("/records");
      }
    }
  };

  checkUnusedSongs = songs => {
    const { unusedSongs } = this.state;
    if (_.isEmpty(unusedSongs) && !_.isEmpty(songs)) {
      setTimeout(() => this.setState({ unusedSongs: songs }));
    }
  };

  render() {
    const { songs } = this.props;
    const { isSingle, containerKey, errorSingle, errorAlbum } = this.state;

    this.checkFinished();
    this.checkUnusedSongs(songs);

    return (
      <Page centered>
        {!_.isArray(songs) ? (
          <Loading large />
        ) : _.isEmpty(songs) ? (
          <EmptyState
            icon={<FontAwesomeIcon icon="music" size="4x" />}
            title={
              <Fragment>
                You don't have a song that is eligible for a single.<br />
                Go to the <Link to={"/songs"}>Songs page</Link> and write and
                record a new song.
              </Fragment>
            }
          />
        ) : (
          <Fragment>
            <div>
              <div className="btn-group btn-group-block centered col-4">
                <Button
                  primary={isSingle}
                  onClick={() => {
                    this.changedProducer(true);
                    this.setState({
                      isSingle: true,
                      errorSingle: null,
                      errorAlbum: null
                    });
                  }}
                >
                  Single
                </Button>
                <Button
                  primary={!isSingle}
                  onClick={() => {
                    this.changedProducer(false);
                    this.setState({
                      isSingle: false,
                      errorSingle: null,
                      errorAlbum: null
                    });
                  }}
                >
                  Album
                </Button>
              </div>
              {isSingle ? (
                ""
              ) : (
                <div className="form-group pt-1">
                  <div className="input-group">
                    <input
                      className="form-input"
                      type="text"
                      id="txtAlbumTitle"
                      placeholder="Album Title"
                    />
                    <Button
                      className="input-group-btn"
                      onClick={() =>
                        $("#txtAlbumTitle").val(getRandomSongName())
                      }
                    >
                      Random
                    </Button>
                  </div>
                </div>
              )}
              {this.renderProducers()}
              {this.renderProducerDetails()}
            </div>
            <div className="columns">
              <div className="column col-6 col-mx-auto">
                <h6>Unreleased Songs ({this.state.unusedSongsCount})</h6>
                <Container
                  key={`${containerKey}-unreleased`}
                  id="container-unreleased"
                  classes="centered scrollable"
                  maxSongs={Number.MAX_SAFE_INTEGER}
                  list={(isSingle
                    ? this.getSongsEligibleForSingle(songs)
                    : this.getSongsEligibleForAlbum(songs)
                  ).map(({ id, title }) => {
                    return { id, text: title };
                  })}
                  pushCard={this.pushCard}
                  moveCard={this.moveCard}
                  removeCard={this.removeCard}
                  ref={songsList => (this.songsList = songsList)}
                  getCards={() => {
                    try {
                      setTimeout(this.getUnusedSongsCount);
                      return this.songsList.handler.component.state.cards;
                    } catch (e) {
                      return undefined;
                    }
                  }}
                />
              </div>
              <div className="column col-6 col-mx-auto">
                <h6>Songs to Release ({this.state.releaseSongsCount})</h6>
                <Container
                  key={`${containerKey}-to-release`}
                  id="container-to-release"
                  classes="centered scrollable"
                  maxSongs={this.getMaxSongs()}
                  list={[]}
                  ref={songsToRelease => (this.songsToRelease = songsToRelease)}
                  getCards={() => {
                    try {
                      setTimeout(this.getSongsToReleaseCount);
                      return this.songsToRelease.handler.component.state.cards;
                    } catch (e) {
                      return undefined;
                    }
                  }}
                />
              </div>
            </div>
            <div className="form-input-hint is-error text-center">
              {isSingle ? errorSingle : errorAlbum}
            </div>
            <Button
              primary
              large
              centered
              onClick={isSingle ? this.validateSingle : this.validateAlbum}
            >
              Release
            </Button>
          </Fragment>
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
    albums: state.albums,
    singles: state.singles,
    week: state.week
  };
}

export default connect(
  mapStateToProps,
  {
    getBand,
    getCash,
    saveCash,
    removeCash,
    getSongs,
    updateSong,
    getSingles,
    addSingle,
    getAlbums,
    addAlbum,
    nextWeek,
    getWeek,
    saveSongs
  }
)(DragDropContext(HTML5Backend)(DragAndDrop));
