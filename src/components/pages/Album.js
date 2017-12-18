/**
 * @author Philip Van Raalte
 * @date 2017-12-18
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Page, Loading} from '../SpectreCSS';
import _ from 'lodash';

import {getSongs, getAlbums} from '../../actions';

class Album extends Component {
  constructor(props) {
    super(props);

    this.state = {
      album: undefined
    };
  }

  componentDidMount() {
    this.props.getSongs();
    this.props.getAlbums();
  }

  componentDidUpdate() {
    const {songs, albums} = this.props;
    const {album} = this.state;

    if(album === undefined && !_.isEmpty(albums) && !_.isEmpty(songs)) {
      this.findAlbum(songs, albums);
    }
  }

  findAlbum(songs, albums) {
    const id = parseInt(this.props.match.params.id);

    let album = albums.find(a => a.id === id);

    if(album === undefined) {
      album = null;
    } else {
      album.songs = album.songs.map(si => songs.find(s => s.id === si));
    }

    this.setState({
      album
    });
  }

  render() {
    const {album} = this.state;

    if(album === undefined) {
      return <Page centered><Loading large/></Page>;
    } else if(album === null) {
      return <Page centered><p>That album could not be found</p></Page>;
    }

    const {quality, released, sales, salesLastWeek, songs, title} = album;

    return(
      <Page centered>
        <h3>{title}</h3>
        <p>
          Released: {released} <br/>
          Quality: {quality} <br/>
          Sales: {sales} <br/>
          Sales Last Week: {salesLastWeek}
        </p>
        <div>
          <h5>Tracklist:</h5>
          <p>
            {
              songs.map(({id, title}, index) =>
                <span key={id}>
                  {index + 1}. {title}
                  <br/>
                </span>
              )
            }
          </p>
        </div>
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

export default connect(mapStateToProps, {getSongs, getAlbums})(Album);