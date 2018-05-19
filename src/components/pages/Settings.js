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
import { Howler } from "howler";

class Settings extends Component {
  state = {
    volume: window.VOLUME * 100 || 100,
    song: Howler._howls.find(h => h.playing()) || Howler._howls[0]
  };

  toggleMusic = () => {
    const { song } = this.state;
    song.playing() ? song.stop() : song.play();
    localForage.setItem(PLAY_SONG, song.playing() ? "on" : "off");
  };

  volumeChange = event => {
    const volume = event.target.value;
    this.setState({
      volume
    });
    const newVolume = volume / 100;
    window.VOLUME = newVolume;
    Howler.volume(newVolume);

    localForage.setItem(SONG_VOLUME, newVolume);
  };

  changeSong = event => {
    const title = event.target.value;
    Howler._howls.map(h => h.stop());
    const song = Howler._howls.find(h => h.title === title);
    song.play();
    this.setState({ song });
  };

  render() {
    const { song, volume } = this.state;

    return (
      <Page centered>
        <Panel className="col-8 centered text-center">
          <form>
            <div className="form-group">
              <p className="form-label" htmlFor="selectSong">
                Select Song:
              </p>
              <div className="custom-select">
                <select
                  id="selectSong"
                  className="form-select"
                  value={song.title}
                  onChange={this.changeSong}
                >
                  {Howler._howls.map(h => (
                    <option key={h.title} value={h.title}>
                      {h.title}
                    </option>
                  ))}
                </select>
              </div>
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
