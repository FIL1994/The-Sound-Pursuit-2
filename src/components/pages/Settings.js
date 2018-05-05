/**
 * @author Philip Van Raalte
 * @date 2017-10-24.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Page, Button, Panel } from "../SpectreCSS";
import localForage, {
  PLAY_SONG,
  PLAY_MAIN_THEME,
  SONG_VOLUME
} from "../../data/localForage";
import SONGS from "../../data/Songs";

class Settings extends Component {
  constructor(props) {
    super(props);
    let songID = SONGS.Song2.id;

    // make sure the right song is selected in the select dropdown
    if (!_.isEmpty(window.songPlaying)) {
      // if songPlaying exists and the src is not Song2
      if (window.songPlaying.src !== `assets/${SONGS.Song2.src}`) {
        songID = SONGS.Song1.id;
      }
    } else {
      // if songPlaying was empty check again in 400ms --> songPlaying is rarely available before 400ms
      setTimeout(() => {
        // if songPlaying isn't empty and its src isn't Song2 set the id to Song1
        if (
          !_.isEmpty(window.songPlaying) &&
          window.songPlaying.src !== `assets/${SONGS.Song2.src}`
        ) {
          this.setState({ songID: SONGS.Song1.id });
        }
      }, 250);
    }

    this.state = {
      volume: window.VOLUME * 100 || 100,
      songID
    };

    this.songs = [
      {
        id: SONGS.Song2.id,
        title: "Something Else - FIL1994"
      },
      {
        id: SONGS.Song1.id,
        title: "A Perilous Journey - FIL1994"
      }
    ];

    this.volumeChange = this.volumeChange.bind(this);
    this.toggleMusic = this.toggleMusic.bind(this);
    this.changeSong = this.changeSong.bind(this);
  }

  toggleMusic() {
    const { songPlaying } = window;
    if (
      !songPlaying.paused &&
      songPlaying.playState !== createjs.Sound.PLAY_SUCCEEDED
    ) {
      window.songPlaying.play();
      localForage.setItem(PLAY_SONG, "on");
    } else if (songPlaying.paused) {
      window.songPlaying.paused = false;
      localForage.setItem(PLAY_SONG, "on");
    } else {
      window.songPlaying.stop();
      localForage.setItem(PLAY_SONG, "off");
    }
  }

  volumeChange(event) {
    const volume = event.target.value;
    this.setState({
      volume
    });
    const newVolume = volume / 100;
    window.VOLUME = newVolume;
    window.songPlaying.volume = newVolume;

    localForage.setItem(SONG_VOLUME, newVolume);
  }

  changeSong(event) {
    const songID = event.target.value;
    if (songID !== this.state.songID) {
      this.setState({
        songID
      });

      try {
        window.songPlaying.stop();
      } catch (e) {}
      try {
        window.songPlaying.destroy();
      } catch (e) {}

      window.songPlaying = createjs.Sound.play(songID, {
        loop: -1,
        volume: window.VOLUME
      });
      localForage.setItem(PLAY_MAIN_THEME, !(songID === SONGS.Song1.id));
    }
  }

  render() {
    const { songID, volume } = this.state;

    return (
      <Page centered>
        <Panel className="col-8 centered text-center">
          <form>
            <div className="form-group">
              <p className="form-label" htmlFor="selectSong">
                Select Song:
              </p>
              <select
                id="selectSong"
                className="form-select"
                value={songID}
                onChange={this.changeSong}
              >
                {this.songs.map(s => {
                  return (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <p className="form-label" htmlFor="rangeVolume">
                Volume:
              </p>
              <input
                id="rangeVolume"
                className="slider"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={this.volumeChange}
              />
            </div>
            <br />
            <div>
              <Button large onClick={this.toggleMusic}>
                Toggle Music
              </Button>
            </div>
            <br />
            <div>
              <Link to="/">
                <Button large primary>
                  Go to Main Menu
                </Button>
              </Link>
            </div>
          </form>
        </Panel>
      </Page>
    );
  }
}

export default Settings;
