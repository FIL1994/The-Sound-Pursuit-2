/**
 * @author Philip Van Raalte
 * @date 2017-12-14
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

import _ from 'lodash';
import {Page} from '../SpectreCSS';
import {getBand, getCash, saveCash, getSongs, updateSong, saveSongs, getSingles, addSingle, getAlbums, addAlbum,
  removeCash, nextWeek, getWeek} from '../../actions';
import getRandomSongName from '../../data/randomSongName';
import producers from '../../data/producers';

import Container from '../drag_and_drop/Container';

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

  render() {
    // console.log("Drag and Drop", this.props);
    const {songs} = this.props;
    const {unusedSongs, releaseSongs} = this.state;
    if(_.isEmpty(unusedSongs) && !_.isEmpty(songs)) {
      setTimeout(
        () => this.setState({unusedSongs: songs})
      );
    }

    return (
      <Page className="centered text-center">
        Drag and Drop
        <Container items={unusedSongs}/>
        {/*https://github.com/react-dnd/react-dnd/tree/master/examples/04%20Sortable/Cancel%20on%20Drop%20Outside*/}
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