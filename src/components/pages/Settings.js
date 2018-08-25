/**
 * @author Philip Van Raalte
 * @date 2017-10-24.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Howler } from "howler";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { Page, Button, Panel } from "../SpectreCSS";
import localForage, {
  PLAY_SONG,
  SONG_VOLUME,
  SONG_TO_PLAY
} from "../../data/localForage";
import MySlider from "../MySlider";
import { fullscreenMode } from "../../helpers";

class Settings extends Component {
  state = {
    volume: Howler.volume() * 100,
    song: Howler._howls.find(h => h.playing()) || Howler._howls[0]
  };

  async componentDidMount() {
    setTimeout(() => this.setState({ volume: Howler.volume() * 100 }), 600);
  }

  toggleMusic = async () => {
    const { song } = this.state;
    song.playing() ? song.stop() : song.play();
    await localForage.setItem(PLAY_SONG, song.playing() ? "on" : "off");
    this.forceUpdate();
  };

  isSongPlaying = () => this.state.song.playing();

  volumeChange = volume => {
    this.setState({
      volume
    });
    const newVolume = volume / 100;
    Howler.volume(newVolume);

    localForage.setItem(SONG_VOLUME, newVolume);
  };

  changeSong = event => {
    const title = event.target.value;
    Howler._howls.map(h => h.stop());
    const song = Howler._howls.find(h => h.title === title);
    song.play();
    this.setState({ song });
    localForage.setItem(SONG_TO_PLAY, title);
  };

  render() {
    const { song, volume } = this.state;

    return (
      <Page centered>
        <Panel
          className="col-8 centered text-center"
          style={{ marginTop: 35, paddingTop: 15 }}
        >
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
              <MySlider
                min={0}
                max={100}
                value={volume}
                onChange={this.volumeChange}
              />
            </div>
            <br />
            <div>
              <Button
                large
                style={{ width: "100%" }}
                onClick={this.toggleMusic}
              >
                {this.isSongPlaying() ? (
                  <FontAwesomeIcon icon="volume-up" />
                ) : (
                  <FontAwesomeIcon icon="volume-off" />
                )}
              </Button>
            </div>
            <br />
            <div>
              <Button
                large
                style={{ width: "100%" }}
                onClick={() => fullscreenMode()}
              >
                Fullscreen Mode
              </Button>
            </div>
            <br />
            <div>
              <Link to="/">
                <Button large primary style={{ width: "100%" }}>
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
