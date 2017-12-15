/**
 * @author Philip Van Raalte
 * @date 2017-12-14
 */
import React, {Component, Fragment} from 'react';
import update from 'immutability-helper';
import {connect} from 'react-redux';

import _ from 'lodash';
import {Divider, Page, Button} from '../SpectreCSS';
import {getBand, getCash, saveCash, getSongs, updateSong, saveSongs, getSingles, addSingle, getAlbums, addAlbum,
  removeCash, nextWeek, getWeek} from '../../actions';
import getRandomSongName from '../../data/randomSongName';
import producers from '../../data/producers';

import Container from '../drag_and_drop/Container';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
class DragAndDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSingle: true,
      producerID: null,
      errorProducer: null,
      errorSingle: null,
      errorAlbum: null,
      finished: null,
      unusedSongs: [],
      releaseSongs: []
    };
  }

  componentDidMount() {
    this.props.getBand();
    this.props.getSingles();
    this.props.getAlbums();
    this.props.getSongs();
    this.props.getCash();
    this.props.getWeek();
  }

  pushCard(card) {
    this.setState(update(this.state, {
      unusedSongs: {
        $push: [ card ]
      }
    }));
  }

  removeCard(index) {
    this.setState(update(this.state, {
      unusedSongs: {
        $splice: [
          [index, 1]
        ]
      }
    }));
  }

  moveCard(dragIndex, hoverIndex) {
    const { unusedSongs } = this.state;
    const dragCard = unusedSongs[dragIndex];

    this.setState(update(this.state, {
      releaseSongs: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  pushCardRelease(card) {
    this.setState(update(this.state, {
      releaseSongs: {
        $push: [ card ]
      }
    }));
  }

  removeCardRelease(index) {
    this.setState(update(this.state, {
      releaseSongs: {
        $splice: [
          [index, 1]
        ]
      }
    }));
  }

  moveCardRelease(dragIndex, hoverIndex) {
    const { unusedSongs } = this.state;
    const dragCard = unusedSongs[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard]
        ]
      }
    }));
  }

  render() {
    const {songs} = this.props;
    const {unusedSongs, releaseSongs} = this.state;
    if(_.isEmpty(unusedSongs) && !_.isEmpty(songs)) {
      setTimeout(
        () => this.setState({unusedSongs: songs})
      );
    }

    return (
      <Page className="centered text-center">
        {
          !_.isArray(songs) ? null :
            <Fragment>
              <div>
                <Button large centered onClick={() => console.log(this.songsToRelease.handler.component.state.cards)}>Release</Button>
                <br/>
              </div>
              <div className="columns">
                <div className="column col-6 col-mx-auto">
                  <h5>Unreleased Songs ({songs.length})</h5>
                  <Container
                    id="container-unreleased"
                    classes="centered scrollable"
                    maxSongs={Number.MAX_SAFE_INTEGER}
                    list={
                      songs.map(({id, title}) => {
                        return {id, text: title}
                      })
                    }
                    pushCard={this.pushCard}
                    moveCard={this.moveCard}
                    removeCard={this.removeCard}
                    ref={(songsList) => this.songsList = songsList}
                    getCards={() => {
                      try{
                        return this.songList.handler.component.state.cards;
                      } catch(e) {
                        return undefined;
                      }
                    }}
                  />
                </div>
                <div className="column col-6 col-mx-auto">
                  <h5>Songs to Release</h5>
                  <Container
                    id="container-to-release"
                    classes="centered scrollable"
                    maxSongs={16}
                    list={[]}
                    ref={(songsToRelease) => this.songsToRelease = songsToRelease}
                    getCards={() => {
                      try{
                        return this.songsToRelease.handler.component.state.cards;
                      } catch(e) {
                        return undefined;
                      }
                    }}
                  />
                </div>
              </div>
            </Fragment>
        }
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

export default connect(mapStateToProps, {getBand, getCash, saveCash, removeCash, getSongs, updateSong, getSingles,
  addSingle, getAlbums, addAlbum, nextWeek, getWeek, saveSongs})(DragAndDrop);