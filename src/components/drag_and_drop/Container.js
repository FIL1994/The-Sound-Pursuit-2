/**
 * @author Philip Van Raalte
 * @date 2017-12-14
 */
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {DropTarget, DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import ItemTypes from './ItemTypes';
import _ from 'lodash';

const cardTarget = {
  drop(){}
};

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.moveSong = this.moveSong.bind(this);
    this.findSong = this.findSong.bind(this);

    this.state = {songs: []};
  }

  moveSong(id, atIndex) {
    const {song, index} = this.findSong(id);

    this.setState(
      update(this.state, {
        songs: {
          $splice: [[index, 1], [atIndex, 0, song]],
        },
      }),
    );
  }

  findSong(id) {
    const {songs} = this.state;
    const song = songs.filter(s => s.id === id)[0];

    return {
      song,
      index: songs.indexOf(song)
    }
  }

  render() {
    const {songs} = this.state;
    const {connectDropTarget, items} = this.props;

    if(_.isEmpty(songs) && !_.isEmpty(items)) {
      setTimeout(() => this.setState({songs: items}));
    }

    return connectDropTarget(
      <div style={{width: 400}}>
        {songs.map(song => (
          <Card
            key={song.id}
            id={song.id}
            text={song.title}
            moveCard={this.moveSong}
            findCard={this.findSong}
          />
        ))}
      </div>
    );
  }
}

export default Container;