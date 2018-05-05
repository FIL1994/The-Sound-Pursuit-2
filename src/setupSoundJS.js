import _ from "lodash";
import localForage, {
  PLAY_SONG,
  PLAY_MAIN_THEME,
  SONG_VOLUME
} from "./data/localForage";
import SONGS from "./data/Songs";

function playSongByID(songID) {
  try {
    createjs.Sound.stop();
  } catch (e) {}
  window.songPlaying = createjs.Sound.play(songID, {
    loop: -1,
    volume: window.VOLUME
  });
}

// prevent starting multiple songs
if (_.isEmpty(window.songPlaying)) {
  window.VOLUME = 1;

  const assetPath = "assets/";
  const sounds = [
    { id: SONGS.Song1.id, src: SONGS.Song1.src },
    { id: SONGS.Song2.id, src: SONGS.Song2.src }
  ];

  let songStarted = false;
  createjs.Sound.on(
    "fileload",
    function(e) {
      localForage.getItem(SONG_VOLUME).then(songVolume => {
        if (_.isFinite(songVolume)) {
          window.VOLUME = Number(songVolume);
        }

        localForage.getItem(PLAY_SONG).then(playSong => {
          if (!songStarted) {
            // make sure there is only one song playing
            try {
              window.songPlaying.destroy();
            } catch (error) {}

            try {
              localForage
                .getItem(PLAY_MAIN_THEME)
                .then(playMainTheme => {
                  playMainTheme =
                    !_.isEmpty(playMainTheme) &&
                    playMainTheme.toString() === false.toString();
                  // if playMainTheme isn't empty and is false play the Song1 song
                  // if playMainTheme is empty or false play the main theme
                  playSongByID(playMainTheme ? SONGS.Song1.id : SONGS.Song2.id);
                })
                .then(() => {
                  if (playSong) {
                    if (playSong !== "on") {
                      window.songPlaying.stop();
                    }
                  } else {
                    localForage.setItem(PLAY_SONG, "on");
                  }
                  if (window.songPlaying.playState === "playSucceeded") {
                    songStarted = true;
                  }
                });
            } catch (error) {
              console.log("Song Start Error: ", error);
            }
          }
        });
      });
    },
    this
  );

  createjs.Sound.registerSounds(sounds, assetPath);
}

/*
setTimeout(() => {
  if (_.isEmpty(window.songPlaying)) {
    localForage.getItem(SONG_VOLUME).then(songVolume => {
      if (_.isFinite(songVolume)) {
        window.VOLUME = Number(songVolume);
      }
      localForage.getItem(PLAY_SONG).then(playSong => {
        // make sure there is only one song playing
        try {
          window.songPlaying.destroy();
        } catch (error) {}

        try {
          localForage.getItem(PLAY_MAIN_THEME).then(playMainTheme => {
            playMainTheme = !_.isEmpty(playMainTheme) && playMainTheme.toString() === false.toString();
            // if playMainTheme isn't empty and is false play the Song1 song
            // if playMainTheme is empty or false play the main theme
            playSongByID(playMainTheme ? SONGS.Song1.id : SONGS.Song2.id);
          }).then(() => {
            if (playSong) {
              if (playSong !== "on") {
                window.songPlaying.stop();
              }
            } else {
              localForage.setItem(PLAY_SONG, "on");
            }
          });
        } catch (error) {
          console.log("Song Start Error: ", error);
        }
      });
    });
  }
}, 100);
*/
