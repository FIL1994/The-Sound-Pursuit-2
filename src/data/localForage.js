/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import localForage from "localforage";

localForage.config({
  name: "sound-pursuit-2",
  version: 1.0
});

if (process.env.NODE_ENV !== "production") {
  // For Testing Only
  window.localForage = localForage;
}

export default localForage;

export const DATA_BAND = "band";
export const DATA_SONGS = "songs";
export const DATA_WEEK = "week";
export const DATA_CASH = "cash";
export const DATA_FANS = "fans";
export const DATA_SINGLES = "singles";
export const DATA_ALBUMS = "albums";
export const DATA_CHARTS = "charts";

export const PLAY_SONG = "playSong";
export const PLAY_MAIN_THEME = "mainTheme";
export const SONG_VOLUME = "volume";
export const SONG_TO_PLAY = "song_to_play";
