/**
 * @author Philip Van Raalte
 * @date 2017-10-24.
 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import { Howler } from "howler";
import Tooltip from "rc-tooltip";
import Slider, { Handle } from "rc-slider";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import { Page, Button, Panel } from "../SpectreCSS";
import localForage, {
  PLAY_SONG,
  SONG_VOLUME,
  SONG_TO_PLAY
} from "../../data/localForage";

import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import "rc-pagination/assets/index.css";
import "rc-select/assets/index.css";

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

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
              <Slider
                handleStyle={{
                  backgroundColor: "#1e5f53",
                  borderColor: "white"
                }}
                trackStyle={{ backgroundColor: "#237c70de" }}
                railStyle={{
                  backgroundColor: "white",
                  boxShadow: "rgba(103, 151, 232, 0.29) 2px 2px 8px 1px"
                }}
                min={0}
                max={100}
                value={volume}
                handle={handle}
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
