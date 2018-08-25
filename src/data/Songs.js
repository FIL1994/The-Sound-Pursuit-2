import { Howl } from "howler";

const songDefaults = {
  volume: 1,
  loop: true,
  preload: true,
  rate: 1,
  pool: 1
};

let Song1 = new Howl({
  ...songDefaults,
  src: ["assets/song1.ogg"],
  name: "song 1"
});
Song1.title = "A Perilous Journey - FIL1994";

let Song2 = new Howl({
  ...songDefaults,
  src: ["assets/song2.ogg"]
});
Song2.title = "Something Else - FIL1994";

let Song3 = new Howl({
  ...songDefaults,
  src: ["assets/gba_17.mp3"]
});
Song3.title = "GBA 17 - Ancient Origin";

let Song4 = new Howl({
  ...songDefaults,
  src: ["assets/pagoda.mp3"]
});
Song4.title = "Pagoda - Ancient Origin";

export default {
  Song1,
  Song2,
  Song3,
  Song4
};
