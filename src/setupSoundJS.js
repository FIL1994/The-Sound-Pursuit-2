import _ from "lodash";
import { Howler } from "howler";

import localForage, { SONG_VOLUME, SONG_TO_PLAY } from "./data/localForage";
import SONGS from "./data/Songs";

(async () => {
  const volume = await localForage.getItem(SONG_VOLUME);
  if (!_.isEmpty(volume) || _.isNumber(volume)) {
    Howler.volume(volume);
  }

  const song_to_play = await localForage.getItem(SONG_TO_PLAY);

  if (!_.isEmpty(song_to_play)) {
    const song = Howler._howls.find(h => h.title === song_to_play);
    if (song !== undefined) {
      song.play();
      return;
    }
  }

  SONGS.Song1.play();
})();
